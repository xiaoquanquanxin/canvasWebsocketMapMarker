//  经度在当前纬度下的比例
var northernLatitude = 1;
//  图片绘制的比例，根据地图与window.innerWidth的比例
var imgRatio = 1;

//  图片配置
var ImageList = [];
//  地图
var ImageMap = new Image();
ImageMap._src = './img/map6.png';
// ImageMap._src = './img/map5.png';
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
    // lineColor: 'red',
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
    lineColor: 'blue',
    lineWidth: 2,
    lineWidth: 4,
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
        w.toGoThroughList = null;
        //  等待接驾的站点数据   死值死值死值死值死值
        w.WaitForRouteList = null;
        //  等待接驾的剩余路线点位     动态减少的值
        w.PassingStationList = null;
        //  重置调用状态
        NativeUtilsCallH5.DriverLessCar.drawUnLocation.called = false;
    }(window));
}


//  fixme   测试数据
//  fixme   测试数据
//  fixme   测试数据
//  车站数据
function getStationList() {
    //  广州
    return [{
        "create_time": 1552027370,
        "staion_both_sides": 1,
        "station_community_id": 1,
        "station_distance_to_next": 100,
        "station_id": 11,
        "station_lat": 23.2129878673,
        "station_long": 113.5452645098,
        "station_name": "测试点4",
        "station_status": -9,
        "station_time_to_next": 3,
        "station_type": 1,
        "update_time": 1555386925
    }, {
        "create_time": 1529655509,
        "staion_both_sides": 1,
        "station_community_id": 1,
        "station_distance_to_next": 100,
        "station_id": 6,
        "station_lat": 23.2127709362,
        "station_long": 113.5458492313,
        "station_name": "站点F",
        "station_status": 9,
        "station_time_to_next": 3,
        "station_type": 1,
        "update_time": 1529655509
    }, {
        "create_time": 1529655509,
        "staion_both_sides": 1,
        "station_community_id": 1,
        "station_distance_to_next": 100,
        "station_id": 8,
        "station_lat": 23.2124800507,
        "station_long": 113.5468309198,
        "station_name": "站点F",
        "station_status": 9,
        "station_time_to_next": 3,
        "station_type": 1,
        "update_time": 1529655509
    }]
}

//  路径数据
function getRoadList() {
    return ["23.2129878673,113.5452645098", "23.2129533555,113.5453557049", "23.2129237740,113.5454415356", "23.2128941925,113.5455005441", "23.2128596807,113.5455810104", "23.2128399597,113.5456292902", "23.2128202387,113.5456936632", "23.2128054479,113.5457526718", "23.2127906572,113.5458009516", "23.2127709362,113.5458492313", "23.2126526099,113.5463427578", "23.2126328889,113.5463856731", "23.2126131679,113.5464393173", "23.2125934468,113.5464875971", "23.2126131678,113.5464768682", "23.2125934468,113.5465358768", "23.2125490744,113.5466592584", "23.2125194928,113.5467289959", "23.2124800507,113.5468309198", "23.2124356783,113.5469703947", "23.2122433976,113.5473566328", "23.2121891646,113.5474424635", "23.2120905590,113.5474746500", "23.2119919533,113.5474478279", "23.2119081384,113.5474102770", "23.2118046023,113.5473834549", "23.2117207873,113.5473566328", "23.2116221814,113.5473244463", "23.2115482269,113.5473029886", "23.2114742723,113.5472600733", "23.2112819903,113.5471742426", "23.2111636628,113.5471205984", "23.2110551958,113.5470508610", "23.2108924951,113.5469757591", "23.2107100729,113.5468845640", "23.2106065359,113.5465466057", "23.2106706302,113.5463266645", "23.2107445852,113.5461389099", "23.2108431918,113.5458867822", "23.2109516590,113.5455917393"];
}

//  获取四角数据
function getCorner() {
    (function (arr) {
        // return
        var lef = [];
        var rig = [];
        arr.forEach(function (value) {
            var item = value.split(',');
            lef.push(Number(item[0]));
            rig.push(Number(item[1]));
        });
        var top = Math.max.apply(null, lef);
        var bottom = Math.min.apply(null, lef);
        var left = Math.min.apply(null, rig);
        var right = Math.max.apply(null, rig);
        // console.log(top, bottom, left, right);
        setTimeout(function () {
            if (typeof H5CallNativieUtils === "undefined") {
                taskList[4](11, 8);
                // taskList[5]();
                // taskList[7]();
                taskList[8]();
                taskList[9]();
                // taskList[11]();
            }

        }, 100)
    }(getRoadList()));
    return (function () {
        var Right = 113.54790;
        var Left = 113.54470;
        var Top = 23.21370;        //  大
        var Bottom = 23.20850;

        if (Right - Left < 0) {
            throw new Error('四个角的数据不对');
        }
        if (Top - Bottom < 0) {
            throw new Error('四个角的数据不对');
        }
        northernLatitude = Math.cos(Math.PI * ((Top + Bottom) / 2 / 180));
        // console.log('当前纬度下,每个经度相当于  ' + northernLatitude + '  个纬度');
        return {
            topLeft: {
                latitude: Top,
                longitude: Left,
            },
            topRight: {
                latitude: Top,
                longitude: Right,
            },
            bottomLeft: {
                latitude: Bottom,
                longitude: Left,
            },
            bottomRight: {
                latitude: Bottom,
                longitude: Right,
            },
        };
    }());
}

//  测试需要的数据
function testUsingData() {
    return (function (w) {
        w.pointData = {longitude: 113.5455005441, latitude: 23.2128941925, id: 5};
        //  虚线路径    正方向
        // w.toGoThroughList = [StationList[1], StationList[2], StationList[3]];
        w.toGoThroughList = [6, 8];
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
