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
            longitude: 113.5455810104,
            latitude: 23.2128596807,
        }));
    },
    function (startId, endId) {
        //  绘制起点终点
        NativeUtilsCallH5.DriverLessCar.drawStartAndEnd(startId, endId);
    },
    function (z5) {
        //  等待排队
        var index = 0;
        var timer = setTimeout(fn, 333);

        function fn() {
            if (index === 3) {
                clearTimeout(timer);
                timer = null;
                return
            }
            NativeUtilsCallH5.DriverLessCar.drawQueueUp(JSON.stringify({
                remainingTime: '00:01:44',           //  剩余时间
                numberOfPeople: Math.floor(Math.random() * 100),          //  排队人数
            }));
            index++;
            timer = setTimeout(fn, 333);
        }
    },
    function (z6) {
        //  等待接驾


        NativeUtilsCallH5.DriverLessCar.drawCatchStarting(JSON.stringify({
            startPointDistance: Math.random() * 8,            //  剩余距离，米
            startPointTime: '00:99:02',         //  剩余时间
        }), 1);


        NativeUtilsCallH5.DriverLessCar.drawCatchStarting(JSON.stringify({
            longitude: pointData.longitude,      //  无人车当前的纬度
            latitude: pointData.latitude,        //  无人车当前的经度
        }), 2);

        return
        setTimeout(function () {
            NativeUtilsCallH5.DriverLessCar.drawCatchStarting(JSON.stringify({
                longitude: pointData.longitude + 0.00004,      //  无人车当前的纬度
                latitude: pointData.latitude - 0.00014,        //  无人车当前的经度
            }), 2);
            NativeUtilsCallH5.DriverLessCar.drawCatchStarting(JSON.stringify({
                startPointDistance: Math.random() * 1000,            //  剩余距离，米
                startPointTime: '00:66:02',         //  剩余时间
            }), 1);
        }, 1000);
    },
    function (z7) {
        //  等待乘车
        var CarArrivedData = {
            countDown: '00:00:03',              //  倒计时
        };
        NativeUtilsCallH5.DriverLessCar.drawCarArrived(JSON.stringify(CarArrivedData));
    },
    function (z8) {

        var roadList = getRoadList().map(function (item, index) {
            var arr = item.split(',');
            return {
                longitude: arr[1],
                latitude: arr[0],
                _id: index + 1,
            }
        });
        var firstIndex = getCanvasClosest(StationList.find(function (item) {
            return item.station_id === jingguo[0];
        }), RoadList);
        var lastIndex = getCanvasClosest(StationList.find(function (item) {
            return item.station_id === jingguo[jingguo.length - 1];
        }), RoadList);
        var maxIndex = getCanvasClosest(StationList.find(function (item) {
            return item.station_id === Math.max.apply(null, jingguo);
        }), RoadList);

        var minIndex = getCanvasClosest(StationList.find(function (item) {
            return item.station_id === Math.min.apply(null, jingguo);
        }), RoadList);


        //  1.纯正向 ，234
        var list = roadList.slice(firstIndex, maxIndex + 1);
        //  2.折返一个终点，454321
        var list1 = roadList.slice(firstIndex, maxIndex + 1);
        var list2 = roadList.slice(0, maxIndex).reverse();
        var list = list1.concat(list2);
        //   3.折返一个起点，543212
        var list1 = roadList.slice(minIndex, maxIndex + 1).reverse();
        var list2 = roadList.slice(minIndex, lastIndex + 1);
        list = list1.concat(list2);

        //  4.折返2个，4543212
        var list1 = roadList.slice(firstIndex, maxIndex + 1);
        var list2 = roadList.slice(0, maxIndex + 1).reverse();
        var list3 = roadList.slice(0, lastIndex + 1);
        list = list1.concat(list2).concat(list3);

        //  5.纯反向，54321
        // var list1 = roadList.slice(minIndex, maxIndex + 1).reverse();
        // list = list1;


        var delay = 500;
        var timer = setTimeout(fn, delay / 3);
        var index = 0;

        function fn() {
            if (index === list.length) {
                clearTimeout(timer);
                timer = null;
                return
            }


            NativeUtilsCallH5.DriverLessCar.drawInTheBus(JSON.stringify({
                fromTheEnd: Math.floor(Math.random() * 100),                 //  距离终点
                estimatedTime: '00:00:13',                      //  预计时间
                longitude: list[index].longitude,
                latitude: list[index].latitude,
            }));
            index++;
            timer = setTimeout(fn, delay);
        }
    },
    function (z9) {
        //  在图片没加载出来以前,计算出来最近的点位
        NativeUtilsCallH5.DriverLessCar.getUserClosestStation(JSON.stringify({
            longitude: 113.5455810104,
            latitude: 23.2128596807,
        }), JSON.stringify(getStationList()));
    },
    function (z10) {
        //  重置
        NativeUtilsCallH5.DriverLessCar.drawReset();
    },
    function (z11) {
        //  测试
        NativeUtilsCallH5.DriverLessCar.testCoordinatePrecision();
    }
];


setTimeout(function () {
    if (typeof H5CallNativieUtils === "undefined") {
        taskList[4].apply(null, qidianzhongdian);
        //  从task 5 开始就要规划路径
        // taskList[5]();
        taskList[6]();
        // taskList[7]();
        if (typeof ridingActivityList !== "undefined") {
            throw new Error('我去治不了你了？？？？');
        }
        // taskList[8]();
        // taskList[9]();
        // taskList[10]();
        // taskList[11]();
    }

}, 100);


//  判断图片全部加载完了，或者有失败的也没有关系
function imagesIsAllLoaded() {
    if (ImageList.length !== 5) {
        return
    }
    console.log('图片全部加载完了,这个log永久保留');
    //  获取四个角落的经纬度  这个数据将来从移动端获取的时候，再做处理

    NativeUtilsCallH5.DriverLessCar.setCornerData(JSON.stringify(getCorner()));
    // console.log('h5自给的四个角的经纬度');
    // console.log(JSON.stringify(window.Corner).substr(0, 50));

    /**
     * 问移动端拿数据
     * **/
    if (typeof H5CallNativieUtils !== 'undefined') {
        console.log('拥有 H5CallNativieUtils类');
        if (typeof H5CallNativieUtils.h5IsReady === 'function') {
            console.log('拥有 H5CallNativieUtils.h5IsReady方法 ，我调用它了');
            H5CallNativieUtils.h5IsReady();
        } else {
            throw new Error('H5CallNativieUtils.h5IsReady方法不存在');
        }
    } else {
        //  获取车站站点经纬度
        //  获取路线经纬度
        NativeUtilsCallH5.DriverLessCar.setStationList(JSON.stringify(getStationList()), JSON.stringify(getRoadList()));
        //  载入测试数据
        testUsingData();
    }
    console.log('h5完全准备好了，可以调用任何方法了 ');
    NativeUtilsCallH5.DriverLessCar.drawInit();
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


//  橙色的保留