//  测试、本地
var isTest = true;
if (isTest) {
    //  获取四个角落的经纬度
    window.Corner = transformOriginData(function () {
        var Left = 113.5502100000;
        var Top = 23.2102910000;
        var Right = 113.5528060000;
        var Bottom = 23.2060700000;
        northernLatitude = Math.cos(Math.PI * ((Top + Bottom) / 2 / 180));
        // console.log('当前纬度下,每个经度相当于  ' + northernLatitude + '  个纬度');
        return {
            topLeft: {
                latitude: Left,
                longitude: Top,
            },
            topRight: {
                latitude: Right,
                longitude: Top,
            },
            bottomLeft: {
                latitude: Left,
                longitude: Bottom,
            },
            bottomRight: {
                latitude: Right,
                longitude: Bottom,
            },
        };
    }());
    //  获取车站站点经纬度
    window.StationList = [
        {"longitude": 23.2096000000, "latitude": 113.5511030000, "id": 1},
        {"longitude": 23.2093780000, "latitude": 113.5517330000, "id": 2},
        {"longitude": 23.2091780000, "latitude": 113.5523630000, "id": 3},
        {"longitude": 23.2085350000, "latitude": 113.5522950000, "id": 4},
        {"longitude": 23.2081220000, "latitude": 113.5508160000, "id": 5},
    ];
    //  获取路线经纬度
    window.RoadList = [
        {"longitude": 23.2096380000, "latitude": 113.5509730000},
        {"longitude": 23.2095080000, "latitude": 113.5513900000},
        {"longitude": 23.2093680000, "latitude": 113.5517830000},
        {"longitude": 23.2092180000, "latitude": 113.5522130000},

        {"longitude": 23.2090900000, "latitude": 113.5526080000},
        {"longitude": 23.2090000000, "latitude": 113.5525650000},
        {"longitude": 23.2085350000, "latitude": 113.5523200000},
        {"longitude": 23.2081350000, "latitude": 113.5521200000},
        {"longitude": 23.2077930000, "latitude": 113.5519400000},

        {"longitude": 23.2077530000, "latitude": 113.5519100000},
        {"longitude": 23.2077490000, "latitude": 113.5517770000},
        {"longitude": 23.2078490000, "latitude": 113.5515170000},
        {"longitude": 23.2079490000, "latitude": 113.5512570000},
        {"longitude": 23.2081220000, "latitude": 113.5508160000},
    ];


    //  测试状态 4，5，6，7的数据
    var startId = 2;
    var endId = 4;
    //  无人车在左上角
    var pointData = {longitude: 23.20950, latitude: 113.5512};
    //  虚线路径    正方向
    var toGoThroughList = [StationList[1], StationList[2], StationList[3]];
    //  虚线路径    反方向
    // var toGoThroughList = [StationList[0], StationList[1], StationList[2]];
    //  无人车在右下角
    // var pointData = {longitude: 23.20830, latitude: 113.551839};
    //  虚线路径    正方向
    // var toGoThroughList = [StationList[4]];
    //  虚线路径    反方向
    // var toGoThroughList = [StationList[3], StationList[2], StationList[1], StationList[0], StationList[1], StationList[2], StationList[3], StationList[4]];


} else {
    // window.Corner = H5Callxxx.getCornerData()
    // window.StationList = getStationList()
    // window.RoadList = getRoadList()
}
var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext('2d');
//  分辨率
var ratio = getPixelRatio(ctx);

//  计算出来一些需要的值
(function () {
    // console.log('ratio', ratio);
    canvas.width = window.innerWidth * ratio;
    canvas.style.width = canvas.width / ratio + 'px';
    //  点的简写
    var bl = Corner.bottomLeft;
    var br = Corner.bottomRight;
    //  获得底边斜率k, 和b
    window.bottomLineParams = getK_B(br.latitude, br.longitude, bl.latitude, bl.longitude);
    // console.log('底边k,b对象', bottomLineParams);
    var tl = Corner.topLeft;

    //  获得左边斜率k,和b
    window.leftLineParams = getK_B(tl.latitude, tl.longitude, bl.latitude, bl.longitude);
    // console.log('左边k,b对象', leftLineParams);

    //  根据左下角和右下角求底边在canvas坐标系下的长度
    window.bottom_differ = getDiffer(bl.latitude, bl.longitude, br.latitude, br.longitude);
    //  单位经纬度坐标系长度相当于n个像素的比例,是一个很大的数
    window.getRatio = canvas.width / bottom_differ;
    window.left_differ = getDiffer(bl.latitude, bl.longitude, tl.latitude, tl.longitude);


    //  设置地图src
    ImageMap.src = ImageMap._src;
    //  小车图片
    ImageCar.onload = iconImageLoad;
    ImageCar.onerror = iconImageError;
    //  站点图片
    ImageStationBasic.onload = iconImageLoad;
    ImageStationBasic.onerror = iconImageError;
    //  站点图片
    ImageStationStart.onload = iconImageLoad;
    ImageStationStart.onerror = iconImageError;
    //  站点图片
    ImageStationEnd.onload = iconImageLoad;
    ImageStationEnd.onerror = iconImageError;
    //  用户图片
    ImageUser.onload = iconImageLoad;
    ImageUser.onerror = iconImageError;
}());

//  主背景图
ImageMap.onload = function () {
    imgRatio = this.width / window.innerWidth / ratio;
    // console.log('imgRatio', imgRatio);
    //  载入图标图片
    canvas.height = window.innerWidth * this.height / this.width * ratio;
    canvas.style.height = canvas.height / ratio + 'px';
    loadIconImage();
    imagesIsAllLoaded();
};


//  判断图片全部加载完了，或者有失败的也没有关系
function imagesIsAllLoaded() {
    if (ImageList.length === 5) {
        mainRender();
    }
}

//  载入图标图片
function loadIconImage() {
    //  设置小车src
    ImageCar.src = ImageCar._src;
    //  设置站点图片src
    ImageStationBasic.src = ImageStationBasic._src;
    //  设置站点图片src
    ImageStationStart.src = ImageStationStart._src;
    //  设置站点图片src
    ImageStationEnd.src = ImageStationEnd._src;
    //  用户图片
    ImageUser.src = ImageUser._src;
}


//  载入图标图片的时候
function iconImageLoad() {
    this.width /= imgRatio;
    this.height /= imgRatio;
    ImageList.push(this);
    imagesIsAllLoaded();
    // var list = this.src.split('/');
    // console.log(this.width, this.height, list[list.length - 1]);
}

//  载入图片出错
function iconImageError(e) {
    this.isError = true;
    ImageList.push(this);
    imagesIsAllLoaded();
}

//  主绘制
//  封装了绘制路线和地图
function mainRender() {
    // taskList[0]();
    // return;
    // taskList[1]();
    // taskList[2]();
    taskList[3]();
    // taskList[4]();
    // taskList[5]();
    // taskList[6]();
    taskList[7]();
    return
    var index = 0;
    var timer = null;

    function taskFn() {
        timer = setTimeout(taskFn, 1000);
        if (taskList[index] === undefined) {
            clearInterval(timer);
            timer = null;
            return;
        }
        console.log(index);
        taskList[index]();
        index++;
    }

    taskFn();
}

var taskList = [
    function (z0) {
        //  绘制无可用车辆
        NativeUtilsCallH5.DriverLessCar.drawNoCar();
        return;
    },
    function (z1) {
        //  绘制未定位状态
        NativeUtilsCallH5.DriverLessCar.drawUnLocation();
        return;
    },
    function (z2) {
        //  绘制用户开启定位状态
        NativeUtilsCallH5.DriverLessCar.drawLocation(JSON.stringify({
            latitude: 113.5516910000,
            longitude: 23.2090780000,
        }));
        return;
    },
    function (z3) {
        //  绘制起点终点
        NativeUtilsCallH5.DriverLessCar.drawStartAndEnd(startId, endId);
        return;
    },
    function (z4) {
        //  等待排队
        NativeUtilsCallH5.DriverLessCar.drawQueueUp(JSON.stringify({
            remainingTime: '00:00:32',           //  剩余时间
            numberOfPeople: 2,          //  排队人数
        }));
        return;
    },
    function (z5) {
        // return;
        NativeUtilsCallH5.DriverLessCar.drawCatchStarting(JSON.stringify({
            startPointDistance: 1311,            //  剩余距离，米
            startPointTime: '00:10:02',         //  剩余时间
            longitude: pointData.longitude,     //  无人车当前的纬度
            latitude: pointData.latitude,       //  无人车当前的经度
            toGoThroughList: toGoThroughList,
        }));
        if (isTest) {
            var _pointData = calculatePoint(pointData);
            // console.log('红点', _pointData);
            drawCircle(_pointData, 10, 'red');
        }
        return
    },
    function (z6) {
        //  等待乘车
        var CarArrivedData = {
            countDown: '00:00:03',              //  倒计时
        };
        NativeUtilsCallH5.DriverLessCar.drawCarArrived(CarArrivedData);
        return;
    },
    function (z7) {
        console.log(pointData, toGoThroughList);
        //  乘车中
        var drivingData = {
            fromTheEnd: 1221,                   //  距离终点
            estimatedTime: '00:00:13',          //  预计时间
            longitude: pointData.longitude,
            latitude: pointData.latitude,
            toGoThroughList: toGoThroughList
        };
        NativeUtilsCallH5.DriverLessCar.drawInTheBus(JSON.stringify(drivingData));
    }
];

//  fixme   判断车头车尾的还是有点问题   taskList[6]();