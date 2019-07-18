//  测试、本地
var isTest = true;
var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext('2d');
//  分辨率
var ratio = getPixelRatio(ctx);

//  计算出来一些需要的值
(function () {
    // console.log('ratio', ratio);
    canvas.width = window.innerWidth * ratio;
    canvas.style.width = canvas.width / ratio + 'px';

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
};


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

var taskList = [
    function (z0) {
        NativeUtilsCallH5.DriverLessCar.drawInit();
    },
    function (z1) {
        //  绘制无可用车辆
        NativeUtilsCallH5.DriverLessCar.drawNoCar();
    },
    function (z2) {
        //  绘制未定位状态
        NativeUtilsCallH5.DriverLessCar.drawUnLocation();
    },
    function (z3) {
        //  绘制用户开启定位状态
        NativeUtilsCallH5.DriverLessCar.drawLocation(JSON.stringify({
            latitude: 113.5516910000,
            longitude: 23.2090780000,
        }));
    },
    function (z4) {
        //  绘制起点终点
        NativeUtilsCallH5.DriverLessCar.drawStartAndEnd(startId, endId);
    },
    function (z5) {
        //  等待排队
        NativeUtilsCallH5.DriverLessCar.drawQueueUp(JSON.stringify({
            remainingTime: '00:00:32',           //  剩余时间
            numberOfPeople: 2,          //  排队人数
        }));
    },
    function (z6) {
        // return;
        NativeUtilsCallH5.DriverLessCar.drawCatchStarting(JSON.stringify({
            startPointDistance: 1311,            //  剩余距离，米
            startPointTime: '00:10:02',         //  剩余时间
            longitude: pointData.longitude,     //  无人车当前的纬度
            latitude: pointData.latitude,       //  无人车当前的经度
            toGoThroughList: toGoThroughList,
        }));
        if (isTest) {
            var _pointData = calculatePoint(obtainCopy(pointData));
            // console.log('红点', _pointData);
            drawCircle(_pointData, 10, 'red');
        }
    },
    function (z7) {
        //  等待乘车
        var CarArrivedData = {
            countDown: '00:00:03',              //  倒计时
        };
        NativeUtilsCallH5.DriverLessCar.drawCarArrived(CarArrivedData);
    },
    function (z8) {
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
    },
    function (z9) {
        window.StationList = getStationList();
        NativeUtilsCallH5.DriverLessCar.getUserClosestStation(JSON.stringify({
            latitude: 113.5516910000,
            longitude: 23.2090780000,
        }), StationList);
    },
    function (z100) {
        //  重置
        NativeUtilsCallH5.DriverLessCar.drawReset();
    }
];

//  判断图片全部加载完了，或者有失败的也没有关系
function imagesIsAllLoaded() {
    if (ImageList.length !== 5) {
        return
    }
    console.log('图片全部加载完了,这个log永久保留');
    /**
     * 问移动端拿数据
     * **/
    if (typeof H5CallNativieUtils !== 'undefined') {
        if (typeof H5CallNativieUtils.h5IsReady === 'function') {
            H5CallNativieUtils.h5IsReady();
        }
    } else {
        //  fixme   本地测试,将来要删除
        //  获取四个角落的经纬度  这个数据将来从移动端获取的时候，再做处理
        window.Corner = getCorner();
        //  获取车站站点经纬度
        window.StationList = getStationList();
        //  获取路线经纬度
        window.RoadList = getRoadList();
        //  载入测试数据
        testUsingData();
    }

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

    RoadList = calculateList(RoadList);
    StationList = calculateList(StationList);

    console.log('h5完全准备好了，可以调用任何方法了 ');
    NativeUtilsCallH5.DriverLessCar.drawInit();
    myTest();
}

//  我的测试
function myTest() {
    taskList.slice(0, 7).forEach(function (fn) {
        fn();
    })
}

