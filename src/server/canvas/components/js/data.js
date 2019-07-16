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
//  路径配置
var roadData = {
    lineColor: 'grey',
    lineWidth: 10,
    inflexionPointColor: 'grey',
    inflexionPointColor: 'yellow',
    inflexionPointRadius: 5,
};

//  小车位置
var CarPoint = {};
