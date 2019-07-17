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
