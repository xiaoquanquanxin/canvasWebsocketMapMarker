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
    ]
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
    //  绘制无可用车辆
    // drawNoCar();
    // return;

    //  绘制未定位状态
    // drawUnLocation();
    // return;

    //  绘制用户开启定位状态
    // drawLocation(JSON.stringify({
    //     latitude: 113.5516910000,
    //     longitude: 23.2090780000,
    // }));
    // return;

    //  绘制起点终点
    drawStartAndEnd(3, 5);
    // return;


    //  等待排队
    // drawQueueUp(JSON.stringify({
    //     remainingTime: '00:00:32',           //  剩余时间
    //     numberOfPeople: 2,          //  排队人数
    // }));
    // return;


    //  开始接驾的对象
    drawCatchStarting(JSON.stringify({
        startPointDistance: 13,            //  剩余距离，米
        startPointTime: '00:10:02',         //  剩余时间
        longitude: 23.209638,
        latitude: 113.550973
    }));
    return

    //  等待乘车
    var CarArrivedData = {
        type: 3,
        countDown: '00:00:03',              //  倒计时
    };
    // drawCarArrived(CarArrivedData);
    // return;


    //  乘车中
    var drivingData = {
        type: 4,
        fromTheEnd: 1221,                   //  距离终点
        estimatedTime: '00:00:13',          //  预计时间
    };
    drawInTheBus(drivingData);


}
