window.onload = function () {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');


    //  marker图片
    let marker = new Image();
    marker.src = '/public/img/marker.png';
    //  只有图片加载出来才能进行绘制
    marker.onload = function () {
        marker.isLoaded = true;
    };

    //  地图图片
    let image = new Image();
    image.src = '/public/img/map1.jpg';
    image.onload = function () {
        //  canvas的宽度
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth * image.height / image.width;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };


    //  websocket
    const socket = io('http://localhost:4000/');
    //  手动按钮
    let $manualButton = document.getElementById('manualButton');
    //  自动按钮
    let $autoButton = document.getElementById('autoButton');

    //  地图数据
    let rangeData = null;
    //  地图数据转为绝对角度制后的数据
    let _rangeData = null;
    //  点位数据
    let pointsData = [];
    //  四个角的笛系坐标
    let differData = null;

    socket.addEventListener('open', function (msg) {
        rangeData = JSON.parse(unescape(msg));
        console.log('前端websocket连接成功');
        console.log('地图四个点的经纬度', rangeData);
        calculateCorner(rangeData);
        //  自动按钮
        $autoButton.onclick = function () {
            socket.send('autoButton');
            $autoButton.onclick = null;
        };
        //  手动按钮
        $manualButton.onclick = function () {
            if (pointsData.length >= 2) {
                $manualButton.onclick = null;
                return;
            }
            socket.send('manualButton');
        };
    });
    //  socket接受数据
    socket.addEventListener('my-custom-socket', function (msg) {
        let _data = JSON.parse(unescape(msg));
        console.log('前端接收数据', _data);
        let _realData = getCanvasPos(_data);
        pointsData.push(_realData);
        console.log(pointsData);
        //  对两不同的点进行做动画，如果只有一个点，则不做动画，就是第一次只有一个点的时候
        let current = pointsData[pointsData.length - 1];
        let prev = pointsData[pointsData.length - 2];
        if (prev === undefined) {
            drawMarker(current);
            return;
        }
        mainRender(prev, current);
    });


    //  计算四个角的在笛卡尔坐标系下的绝对值
    function calculateCorner(rangeData) {
        _rangeData = transformOriginData(rangeData);
        //  经纬度在笛卡尔坐标系下的绝对位置，以左下角为原点
        differData = {
            topLeft: getDiffer(_rangeData.bottomLeft, _rangeData.topLeft),
            topRight: getDiffer(_rangeData.bottomLeft, _rangeData.topRight),
            bottomLeft: getDiffer(_rangeData.bottomLeft, _rangeData.bottomLeft),
            bottomRight: getDiffer(_rangeData.bottomLeft, _rangeData.bottomRight),
        };
        console.log('四个角的笛系坐标', differData);
    }

    //  获取笛卡尔坐标系的绝对差值                           👌👌
    function getDiffer(aim, ref) {
        return {
            diffY: ref.longitude - aim.longitude,
            diffX: ref.latitude - aim.latitude
        }
    }

    //  获取canvas的实际坐标
    function getCanvasPos(data) {
        let _data = {
            longitude: transformRadioToFloat(data.longitude),
            latitude: transformRadioToFloat(data.latitude),
        };
        let _differFlagData = getDiffer(_rangeData.bottomLeft, _data);
        return getRealRatio(_differFlagData, differData.topRight, canvas);
    }

    //  转换全部数据                                  👌👌
    function transformOriginData(originData) {
        let _data = {};
        for (let key in originData) {
            if (originData.hasOwnProperty(key)) {
                _data[key] = {
                    longitude: transformRadioToFloat(originData[key].longitude),
                    latitude: transformRadioToFloat(originData[key].latitude)
                }
            }
        }
        return _data;
    }


    //  将绝对坐标转为小数点的度数    --- 转换细节           👌👌
    function transformRadioToFloat(radio) {
        let degreesArr = radio.split('°');
        let degrees = Number(degreesArr[0]);
        let minuteArr = degreesArr[1].split('\'');
        let minutes = Number(minuteArr[0]);
        let secondArr = minuteArr[1].split('.');
        let seconds = Number(secondArr[0]);
        let dotS = Number(secondArr[1].slice(0, -1));
        // console.log(degrees, minutes, seconds, dotS);
        // console.log(degrees, minutes / 60, seconds / 60 / 60, dotS / 60 / 60 / 100);
        let res = degrees + minutes / 60 + seconds / 60 / 60 + dotS / 60 / 60 / 100;
        // console.log(res);
        return res;
    }


    //  绘制marker
    function drawMarker(point) {
        ctx.beginPath();
        if (marker.isLoaded === true) {
            ctx.drawImage(marker, point.x - marker.width / 2, point.y - marker.height / 2, marker.width, marker.height);
            return;
        }
        ctx.stroke();
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    //  获取本地图下的真实坐标 坐标原点是笛卡尔坐标系原点 单位px      👌👌
    function getRealRatio(_differ, differ, canvas) {
        return {
            x: _differ.diffX / differ.diffX * canvas.width,
            y: canvas.height - _differ.diffY / differ.diffY * canvas.height,
        }
    }

    //  绘制的main
    function mainRender(prev, current) {
        //  绘制的时间间隔
        let _delay = 10;
        //  1000ms内绘制的次数
        let _drawCount = 1000 / _delay;
        //  绘制的起始次数
        let index = 0;
        let timer = setInterval(render, _delay, prev, current);

        //  主函数
        function render(prev, current) {
            let data = {
                x: (current.x - prev.x) / _drawCount * index + prev.x,
                y: (current.y - prev.y) / _drawCount * index + prev.y,
            };
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            drawMarker(data);
            if (index >= _drawCount) {
                clearInterval(timer);
                timer = null;
                return;
            }
            index++;
        }
    }
};



/**
 * idea
 * 1。无论什么数据，都要转为完整的度制，不要分和秒，要转为度的小数点形式
 * 2。60精制，小数点的秒是十进制
 * 3.   todo      得考虑地图是歪斜的情况
 * */


//  问题：：
//
//  这个marker，使用图片吗？如果是，那么加载图片怎么处理，加载时间较长怎么处理？
//  返回前端的数据格式？？ 度分秒？？ 小数点的度数？？  坐标？？？
//  图片倾斜情况

