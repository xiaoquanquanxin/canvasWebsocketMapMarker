window.onload = function () {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');


    //  marker图片
    let marker = new Image();
    // marker.src = '/public/img/marker.png';
    //  只有图片加载出来才能进行绘制
    marker.onload = function () {
        console.log('marker load🍌🍌🍌🍌🍌');
        marker.isLoaded = false;
    };

    //  地图图片
    let image = new Image();
    image.src = '/public/img/map1.jpg';
    image.onload = function () {
        console.log('image load🍌🍌🍌🍌🍌');
        //  canvas的宽度
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth * image.height / image.width;
        image.isLoaded = true;
        drawRoad();
    };


    //  地图数据
    let rangeData = null;
    //  地图数据转为绝对角度制后的数据
    let _rangeData = null;
    //  点位数据
    let pointsData = [];
    //  四个角的笛系坐标
    let differData = null;
    //  websocket
    const socket = io('http://localhost:4000/');
    socket.addEventListener('open', function (msg) {
        socket.isConnected = true;
        rangeData = JSON.parse(unescape(msg));
        console.log('前端websocket连接成功');
        console.log('地图四个点的经纬度', rangeData);
        calculateCorner(rangeData);
        drawRoad();
        // return;
        setTimeout(function () {
            socket.send('autoButton');
        }, 10);
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
        return degrees + minutes / 60 + seconds / 60 / 60 + dotS / 60 / 60 / 100;
    }


    //  绘制marker
    function drawMarker(point) {
        ctx.beginPath();
        let markerWidth = Math.min(20, marker.width);
        let markerHeight = Math.min(20, marker.height);
        if (marker.isLoaded === true) {
            ctx.drawImage(marker, point.x - markerWidth / 2, point.y - markerHeight / 2, markerWidth, markerHeight);
            return;
        }
        ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = 'transparent';
        ctx.fill();
        ctx.closePath();
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
            drawRoad();
            drawLine(prev, current);
            drawMarker(data);
            if (index >= _drawCount) {
                clearInterval(timer);
                timer = null;
                return;
            }
            index++;
        }
    }

    //  绘制线
    function drawLine(begin, end) {
        ctx.beginPath();
        ctx.moveTo(begin.x, begin.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.closePath();
    }

    //  绘制路
    function drawRoad() {
        //  如果不相等,说明还没准备好
        if (socket.isConnected !== image.isLoaded) {
            return false;
        }
        // ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        let _tempList = [
            {
                longitude: unescape("39%B054'11.70\""),
                latitude: unescape("116%B023'29.06\""),
            },
            {
                longitude: unescape("39%B054'11.50\""),
                latitude: unescape("116%B024'17.01\""),
            },
            // {
            //     longitude: unescape("39%B054'16.50\""),
            //     latitude: unescape("116%B024'17.01\""),
            // },
            {
                longitude: unescape("39%B054'15.76\""),
                latitude: unescape("116%B024'22.19\""),
            },
            {
                longitude: unescape("39%B055'14.02\""),
                latitude: unescape("116%B024'28.26\""),
            },
            {
                longitude: unescape("39%B055'18.42\""),
                latitude: unescape("116%B024'24.26\""),
            },
            {
                longitude: unescape("39%B055'17.76\""),
                latitude: unescape("116%B023'22.66\""),
            },
        ];
        _tempList.forEach(function (item, index) {
            if (_tempList[index - 1]) {
                let _item = getCanvasPos(item);
                let _prev = getCanvasPos(_tempList[index - 1]);
                if (index === 2 || index === 4) {
                    drawArc(_prev, _item, index);
                } else {
                    drawLine(_prev, _item);
                }
            }
            drawMarker(getCanvasPos(item));
        });
    }

    //  绘制弧线
    function drawArc(prev, current, index) {
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 5;
        //  起始点坐标
        ctx.moveTo(prev.x, prev.y);
        //  两切线焦点坐标                 终点坐标        弧半径
        //  todo    这个地方要算!!!!!
        //  todo    这个地方要算!!!!!
        //  todo    这个地方要算!!!!!
        if (index === 2) {
            ctx.arcTo(current.x, prev.y, current.x, current.y, 40);
        } else {
            ctx.arcTo(prev.x, current.y, current.x, current.y, 40);
        }
        ctx.stroke();
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


//  1.先画线,线的坐标要确定，拐点的位置，坐标要确定，越细越好      ？？？弧形应该是公式么？？？？
//  2.
