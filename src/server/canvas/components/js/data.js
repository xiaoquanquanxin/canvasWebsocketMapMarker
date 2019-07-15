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
    fontSize: 16,
    height: 30,
};


//  活动数据


//  测试点
var TestPoint = {
    latitude: 113.5520550000,
    longitude: 23.2089110000,
};


//  小车位置
var CarPoint = {};
// var CarPoint = {longitude: 23.208435, latitude: 113.55239};


