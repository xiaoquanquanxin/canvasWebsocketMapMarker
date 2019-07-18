//  经度在当前纬度下的比例
var northernLatitude = 1;
//  图片绘制的比例，根据地图与window.innerWidth的比例
var imgRatio = 1;

//  图片配置
var ImageList = [];
//  地图
var ImageMap = new Image();
ImageMap._src = './img/map6.png';
//  小车
var ImageCar = new Image();
ImageCar._src = './img/car.png';
//  站点
//  普通站点
var ImageStationBasic = new Image();
ImageStationBasic._src = './img/station_basic.png';
//  起点
var ImageStationStart = new Image();
ImageStationStart._src = './img/station_start.png';
//  终点
var ImageStationEnd = new Image();
ImageStationEnd._src = './img/station_end.png';
//  用户
var ImageUser = new Image();
ImageUser._src = './img/user.png';

//  小标签tips的配置
var tipData = {
    fontSize: 20,
    height: 30,
    triangleWidth: 6,
    triangleHeight: 6,
    limitRightWidth: 10,        //  距离右侧的最小边距
};
//  常规路径配置
var roadData = {
    lineColor: 'rgb(160,165,180)',
    lineWidth: 10,
    inflexionPointColor: 'yellow',
    // inflexionPointColor: 'rgb(160,165,180)',
    inflexionPointRadius: 5,
};

//  规划路线配置
var planRoadData = {
    lineColor: 'rgb(71,130,228)',
    lineWidth: 10,
    inflexionPointColor: 'rgb(71,130,228)',
    inflexionPointColor: 'orange',
    inflexionPointRadius: 5,
};

//  重复路线配置
var repeatPlanRoadData = {
    lineColor: '#ffa838',
    lineWidth: 10,
    inflexionPointColor: '#ffa838',
    inflexionPointColor: 'red',
    inflexionPointRadius: 5,
};

//  等待接驾路线配置        虚线
var waitForRouteData = {
    lineColor: 'white',
    lineWidth: 2,
    lineLength: 8,              //  线条长度
    lineSpacing: 8,             //  线条间距长度
};

//  小车位置
var CarPoint = {
    turn: true
};

//  重置数据
function resetData() {
    (function (w) {
        w.CarPoint = {
            turn: true
        };
        w.UserPoint = null;
        w.StartPoint = null;
        w.EndPoint = null;
        w.CarPoint = null;
        w.CarPoint = null;
    }(window));
}


//  fixme   测试数据

//  车站数据
function getStationList() {
    return [
        {"longitude": 23.2096000000, "latitude": 113.5511030000, "id": 1},
        {"longitude": 23.2093780000, "latitude": 113.5517330000, "id": 2},
        {"longitude": 23.2091780000, "latitude": 113.5523630000, "id": 3},
        {"longitude": 23.2085350000, "latitude": 113.5522950000, "id": 4},
        {"longitude": 23.2081220000, "latitude": 113.5508160000, "id": 5},
    ]
}

//  路径数据
function getRoadList() {
    return [
        {"longitude": 23.2096380000, "latitude": 113.5509730000, "id": 1},
        {"longitude": 23.2095080000, "latitude": 113.5513900000, "id": 2},
        {"longitude": 23.2093680000, "latitude": 113.5517830000, "id": 3},
        {"longitude": 23.2092180000, "latitude": 113.5522130000, "id": 4},

        {"longitude": 23.2090900000, "latitude": 113.5526080000, "id": 5},
        {"longitude": 23.2090000000, "latitude": 113.5525650000, "id": 6},
        {"longitude": 23.2085350000, "latitude": 113.5523200000, "id": 7},
        {"longitude": 23.2081350000, "latitude": 113.5521200000, "id": 8},
        {"longitude": 23.2077930000, "latitude": 113.5519400000, "id": 9},

        {"longitude": 23.2077530000, "latitude": 113.5519100000, "id": 10},
        {"longitude": 23.2077490000, "latitude": 113.5517770000, "id": 11},
        {"longitude": 23.2078490000, "latitude": 113.5515170000, "id": 12},
        {"longitude": 23.2079490000, "latitude": 113.5512570000, "id": 13},
        {"longitude": 23.2081220000, "latitude": 113.5508160000, "id": 14},
    ]
}

//  获取四角数据
function getCorner() {
    return transformOriginData(function () {
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
    }())
}

//  测试需要的数据
function testUsingData() {
    return (function (w) {
        //  测试状态 4，5，6，7的数据
        w.startId = 2;
        w.endId = 4;
        //  无人车在左上角
        w.pointData = {longitude: 23.20950, latitude: 113.5512};
        //  虚线路径    正方向
        w.toGoThroughList = [StationList[1], StationList[2], StationList[3]];
        //  虚线路径    反方向
        // var toGoThroughList = [StationList[0], StationList[1], StationList[2]];
        //  无人车在右下角
        // var pointData = {longitude: 23.20830, latitude: 113.551839};
        //  虚线路径    正方向
        // var toGoThroughList = [StationList[4]];
        //  虚线路径    反方向
        // var toGoThroughList = [StationList[3], StationList[2], StationList[1], StationList[0], StationList[1], StationList[2], StationList[3], StationList[4]];
    }(window));
}
