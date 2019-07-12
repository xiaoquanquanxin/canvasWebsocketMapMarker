//  经度在当前纬度下的比例
let northernLatitude = 1;
//  图片绘制的比例，根据地图与window.innerWidth的比例
let imgRatio = 1;
//  四个角落的坐标
const corner = (function () {
    const Left = 113.5502100000;
    const Top = 23.2102910000;
    const Right = 113.5528060000;
    const Bottom = 23.2060700000;
    northernLatitude = Math.cos(Math.PI * ((Top + Bottom) / 2 / 180));
    console.log('当前纬度下,每个经度相当于  ' + northernLatitude + '  个纬度');
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

//  车站点list
const StationList = [
    {"longitude": 23.2096000000, "latitude": 113.5511030000},
    {"longitude": 23.2093780000, "latitude": 113.5517330000},
    {"longitude": 23.2091780000, "latitude": 113.5523630000},
    {"longitude": 23.2085350000, "latitude": 113.5522950000},
    {"longitude": 23.2081220000, "latitude": 113.5508160000},
];

//  路径点list
const RoadList = [
    {"longitude": 23.2096380000, "latitude": 113.5509730000},
    {"longitude": 23.2095080000, "latitude": 113.5513900000},
    {"longitude": 23.2093680000, "latitude": 113.5517830000},
    {"longitude": 23.2092180000, "latitude": 113.5522130000},


    {"longitude": 23.2090900000, "latitude": 113.5526080000},
    {"longitude": 23.2085350000, "latitude": 113.5523200000},
    {"longitude": 23.2081350000, "latitude": 113.5521200000},
    {"longitude": 23.2077930000, "latitude": 113.5519400000},


    {"longitude": 23.2077530000, "latitude": 113.5519100000},
    {"longitude": 23.2077490000, "latitude": 113.5517770000},
    {"longitude": 23.2078490000, "latitude": 113.5515170000},
    {"longitude": 23.2079490000, "latitude": 113.5512570000},
    {"longitude": 23.2081220000, "latitude": 113.5508160000},
];

//  图片配置
//  地图
const ImageMap = new Image();
ImageMap._src = './img/map5.png';
//  小车
const ImageCar = new Image();
ImageCar._src = './img/car.png';
//  站点
//  普通站点
const ImageStationBasic = new Image();
ImageStationBasic._src = './img/station_basic.png';
//  起点
const ImageStationStart = new Image();
ImageStationStart._src = './img/station_start.png';
//  终点
const ImageStationEnd = new Image();
ImageStationEnd._src = './img/station_end.png';
//  用户
const ImageUser = new Image();
ImageUser._src = './img/user.png';


//  活动数据


//  用户位置
let UserPoint = null;
UserPoint = {
    latitude: 113.5516910000,
    longitude: 23.2090780000,
};

//  测试点
let TestPoint = {
    latitude: 113.5520550000,
    longitude: 23.2089110000,
};

//  用户选择的起点
let StartPoint = StationList[0];
//  终点
let EndPoint = StationList[4];

//  小车位置
let CarPoint = null;
CarPoint = {longitude: 23.208435, latitude: 113.55239};
CarPoint = RoadList[2]