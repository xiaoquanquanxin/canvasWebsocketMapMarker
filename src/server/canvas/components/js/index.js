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
        var userClosestStationId = NativeUtilsCallH5.DriverLessCar.drawLocation(JSON.stringify({
            latitude: 113.5516910000,
            longitude: 23.2090780000,
            longitude: 39.5,
            latitude: 117.1
        }));
        console.log(userClosestStationId);
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
        var _StationList = getStationList();

        var delayTime = 333;
        //  普通正向    到站点4
        var testCarList = [1, 2, 3, 4, 5, 6];
        var testStation = [_StationList[1], _StationList[2], _StationList[3]];

        //  普通反向    到站点4
        var testCarList = [4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6];
        var testStation = [_StationList[2], _StationList[1], _StationList[0], _StationList[1], _StationList[2], _StationList[3]];
        //
        //  大普通反向   到站点4，带一个起点折返
        var testCarList = [8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6];
        var testStation = [_StationList[3], _StationList[2], _StationList[1], _StationList[0], _StationList[1], _StationList[2], _StationList[3]];

        //  普通正向到终点     到站点5
        var testCarList = [10, 11, 12, 13];
        var testStation = [_StationList[4]];

        //  大反转终点到起点    到站点4，带一个终点折返
        var testCarList = [10, 11, 12, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6];
        var testStation = [_StationList[4], _StationList[3], _StationList[2], _StationList[1], _StationList[0], _StationList[1], _StationList[2], _StationList[3]];

        //  先获取等待接驾数据
        NativeUtilsCallH5.DriverLessCar.setWaitForRouteList(JSON.stringify({
            longitude: getRoadList()[testCarList[0]].longitude,     //  无人车当前的纬度
            latitude: getRoadList()[testCarList[0]].latitude,       //  无人车当前的经度
        }), JSON.stringify(
            testStation
        ));
        //  todo    无人车形式过程的模拟,有很多点
        var index = 0;
        var timer = setInterval(function () {
            //  后绘制
            NativeUtilsCallH5.DriverLessCar.drawCatchStarting(JSON.stringify({
                startPointDistance: Math.random() * 1000,            //  剩余距离，米
                startPointTime: '00:10:02',         //  剩余时间
                longitude: getRoadList()[testCarList[index]].longitude,     //  无人车当前的纬度
                latitude: getRoadList()[testCarList[index]].latitude,       //  无人车当前的经度
            }));
            clearInterval(timer);
            console.log(index);
            index++;
            if (index === testCarList.length) {
                clearInterval(timer);
            }
        }, delayTime);
        //  无人车偏差位置
        // if (isTest) {
        //     var _pointData = calculatePoint(obtainCopy(pointData));
        //     // console.log('红点', _pointData);
        //     drawCircle(_pointData, 10, 'red');
        // }
    },
    function (z7) {
        //  等待乘车
        var CarArrivedData = {
            countDown: '00:00:03',              //  倒计时
        };
        NativeUtilsCallH5.DriverLessCar.drawCarArrived(JSON.stringify(CarArrivedData));
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
    //  获取四个角落的经纬度  这个数据将来从移动端获取的时候，再做处理

    NativeUtilsCallH5.DriverLessCar.setCornerData(JSON.stringify(getCorner()));
    console.log('h5自给的四个角的经纬度');
    console.log(JSON.stringify(window.Corner));

    //  todo    暂时由我来提供
    NativeUtilsCallH5.DriverLessCar.setRoadList(JSON.stringify(getRoadList()));

    /**
     * 问移动端拿数据
     * **/
    if (typeof H5CallNativieUtils !== 'undefined') {
        console.log('拥有 H5CallNativieUtils类');
        if (typeof H5CallNativieUtils.h5IsReady === 'function') {
            console.log('拥有 H5CallNativieUtils.h5IsReady方法 ，我调用它了');
            H5CallNativieUtils.h5IsReady();
        }
    } else {
        //  fixme   本地测试,将来要删除
        //  获取车站站点经纬度
        // NativeUtilsCallH5.DriverLessCar.setStationList(JSON.stringify(getStationList()));
        NativeUtilsCallH5.DriverLessCar.setStationList(JSON.stringify(getStationList()));
        //  获取路线经纬度
        NativeUtilsCallH5.DriverLessCar.setRoadList(JSON.stringify(getRoadList()));
        //  载入测试数据
        testUsingData();
    }
    console.log('h5完全准备好了，可以调用任何方法了 ');
    NativeUtilsCallH5.DriverLessCar.drawInit();
    myTest();
}

//  我的测试
function myTest() {
    return
    if (typeof H5CallNativieUtils === 'undefined') {
        taskList.slice(3, 4).forEach(function (fn) {
            fn();
        });
    }
}


function test_canvas_point(point) {
    drawCircle(point, 11, 'red');
}

function test_canvas_list(list) {
    list.forEach(function (item) {
        test_canvas_point(item);
    });
}

function test_point(point) {
    drawCircle(calculatePoint(point), 11, 'red');
}

function test_List(list) {
    list.forEach(function (item) {
        test_point(item);
    });
}