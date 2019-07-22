//  转换全部数据
/**
 * @originData : 要被从字符串转为小数点的对象 , 经过 x northernLatitude 处理  [data:[string]]
 * */
function transformOriginData(originData) {
    var data = {};
    for (var key in originData) {
        if (originData.hasOwnProperty(key)) {
            data[key] = {};
            data[key].latitude = originData[key].latitude;
            data[key].longitude = originData[key].longitude * northernLatitude
        }
    }
    return data;
}

//  获取笛卡尔坐标系的绝对差值                       👌👌纯函数
function getDiffer(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

//  求两点连线的方程                                👌👌纯函数
function getK_B(x1, y1, x2, y2) {
    var k = (y2 - y1) / (x2 - x1);
    var b = y1 - k * x1;
    if (x2 === x1) {
        return {
            x: x1,              //  说明是垂直的线，x=c
        }
    }
    if (y1 === y2) {
        return {
            y: y1,              //  说明是水平的线，y=c
        }
    }
    return {
        k: k,
        b: b
    }
}

//  将经纬度坐标系单位长度转为canvas坐标系的单位长度
/**
 * @x : 被转换的长度  [被换算成小数点的经纬度坐标系][northernLatitude]
 * */
function transformLongitudeAndLatitudeToCartesianCoordinateSystem(x) {
    return x * getRatio;
}


// polyfill 提供了这个方法用来获取设备的 pixel ratio
var getPixelRatio = function (context) {
    var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
};


//  计算点位，从经纬度坐标 计算 为 canvas坐标系坐标
/**
 * @point : [ChinaAgriculturalUniversityPoints]
 * */
function calculatePoint(point) {
    //  某个点的数据
    var _point = {
        latitude: point.latitude,
        longitude: point.longitude * northernLatitude
    };
    //  换算为canvas坐标系后的坐标
    var __point = {
        latitude: _point.latitude - bottomLineParams.y,
        longitude: _point.longitude - leftLineParams.x,
    };
    point.x = transformLongitudeAndLatitudeToCartesianCoordinateSystem(__point.longitude);
    point.y = canvas.height - transformLongitudeAndLatitudeToCartesianCoordinateSystem(__point.latitude);
    delete point.latitude;
    delete point.longitude;
    return point;
}

//  将某个list的经纬度全部转为canvas坐标系点
function calculateList(list) {
    return list.map(function (item) {
        return calculatePoint(item);
    })
}


//  返回最近的点
/**
 * @referenceSpot:参考点位
 * @pointList:一系列点
 *
 * @return:number 从pointList中,返回最近的那个点的下标
 * */
function getCanvasClosest(referenceSpot, pointList) {
    //  作出距离的list
    var __differList = pointList.map(function (item) {
        return getDiffer(item.x, item.y, referenceSpot.x, referenceSpot.y);
    });
    var Min = Math.min.apply(null, __differList);
    var MinIndex = __differList.findIndex(function (item) {
        return item === Min;
    });
    return MinIndex;
}


//  获取前后三个点【差值为5的点】的斜率               👌👌纯函数
/**
 * @index:number,当前车辆点位所在道路数组的下标
 * @list:array,道路数组
 *
 * @return:number,小车需要转动的角度
 * */
function getCarAngle(index, list) {
    if (CarPoint.turn) {
        console.log('计算无人车角度时，给与的无人车方向 , -------------正向');
    } else {
        console.log('计算无人车角度时，给与的无人车方向 , -------------反向');
    }
    var FirstIndex = Math.max(0, index - 3);
    var LastIndex = Math.min(FirstIndex + 5, list.length - 1);
    var FirstPoint = list[FirstIndex];
    var LastPoint = list[LastIndex];
    var CarObject = getK_B(FirstPoint.x, FirstPoint.y, LastPoint.x, LastPoint.y);
    // console.log(CarObject);
    var Angle = Math.atan(CarObject.k) * 180 / Math.PI;
    if (CarObject.k < 0) {
        Angle = 180 + Angle
    }
    // console.log('Angle无人车角度', Angle);
    return Angle;
}


//  处理时间字符串，返回数值和单位
/**
 * @timeStr:string  时间字符串
 * @isShowAl:boolean    需要展示全部？
 * @return:object   数值和单位
 * */
function getTimeData(timeStr) {
    var timeArr = timeStr.split(':');
    var data = {};
    if (timeArr[0] !== '00') {
        data.unit = '小时';
        data.value = timeArr[0];
    } else if (timeArr[1] !== '00') {
        data.unit = '分钟';
        data.value = timeArr[1];
    } else {
        data.unit = '秒';
        data.value = timeArr[2];
    }
    data.value = Number(data.value).toString();
    return data;
}

//  处理距离字符串，返回数值和单位
/**
 *  @distanceStr:string 距离的值
 * @return:Object   返回数值和单位
 * */
function getDistanceData(distanceStr) {
    var _distance = Number(distanceStr);
    if (_distance - 1000 >= 0) {
        return {unit: 'km', value: (_distance / 1000).toFixed(1)}
    } else {
        return {unit: 'm', value: _distance.toFixed(0)}
    }
}

//  返回倒计时对象
/**
 * @countDown:string    输入时间字符串
 * @return:string       返回时间字符串
 * */
function getCountDown(countDown) {
    var _arr = countDown.substring(3).replace(':', '\'').split('\'');
    return Number(_arr[0]) + '\'' + _arr[1];
}

/**
 * requestAnimationFrame兼容性扩展，两方面工作：
 * 1、把各浏览器前缀进行统一
 * 2、在浏览器没有requestAnimationFrame方法时将其指向setTimeout方法
 * */
(function () {
    var lastTime = 0;
    var vendors = ["webkit", "moz"];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        // Webkit中此取消方法的名字变了
        window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());

//  获取行程的路径
/**
 * @carPoint:object     无人车的位置
 * @expectList:array    要经过路径的list
 * @roadList:array      路径的list
 *
 * 说明：寻找路径中关于起点和终点最近的两个点，然后把他们在roadList中的那部分返回  ，以及无人车方向
 * @return:object
 * @list:array    返回应该被染色的list
 * @turn:boolean    无人车方向
 * */
//  todo    未完成
function getPathOfTravel(carPoint, expectList, roadList) {
    //  不是null,就说明是真正的乘车中的状态
    if (carPoint !== null) {
        expectList.unshift(carPoint);
    }
    roadList.forEach(function (item, index) {
        item._id = index + 1;
    });
    //  预计虚线路线在道路路线上对应的点位下标
    var _dottedLineIndex = expectList.map(function (item) {
        return getCanvasClosest(item, roadList);
    });
    // console.log(_dottedLineIndex);
    //  至少有两个点
    if (_dottedLineIndex.length <= 1) {
        throw new Error('不可能出现有少于两个点点情况,至少要用一个无人车的点，和一个站点【用户选择的上车站点】');
    }

    // debugger
    console.log('无人车 + stations 映射在roadList上的点', _dottedLineIndex);
    //  对应道路的拐点  下标的最小值和最大值
    var _listMinValue = Math.min.apply(null, _dottedLineIndex);
    var _listMaxValue = Math.max.apply(null, _dottedLineIndex);
    //  对应道路拐点下标
    var _listMinInflexionIndex = _dottedLineIndex.findIndex(function (item) {
        return item === _listMinValue;
    });
    var _listMaxInflexionIndex = _dottedLineIndex.findIndex(function (item) {
        return item === _listMaxValue;
    });
    // console.log(_listMinValue, _listMaxValue);
    // console.log(_listMinInflexionIndex, _listMaxInflexionIndex);


    // debugger;
    //  取起点和终点
    var firstValue = _dottedLineIndex[0];
    var lastValue = _dottedLineIndex[_dottedLineIndex.length - 1];

    // debugger
    // if (_dottedLineIndex[1] - _dottedLineIndex[0] < 0) {
    //     console.log('初始 反方向');
    //     if (firstValue > lastValue) {
    //         firstValue++;
    //     } else {
    //         lastValue++;
    //     }
    // } else {
    //     firstValue++;
    //     lastValue++;
    // }
    firstValue++;
    lastValue++;

    var roadListMinValue = Math.min.apply(null, _dottedLineIndex);
    // debugger
    var list = roadList.slice(roadListMinValue + 1, firstValue).reverse().concat(roadList.slice(roadListMinValue, lastValue));
    // console.log(list);
    return list;
}

//  获取


//  测试  四角定位
/**
 * @bottom_differ
 * @left_differ
 * @productOfSlope
 * */
function __testCorner(bottom_differ, left_differ, productOfSlope) {
    console.log('*******************************四角定位测试*******************************');
    console.log('bottom_differ  :   底边在经纬度坐标下的长度', bottom_differ);
    var width_rate_bottom = canvas.width / bottom_differ;
    console.log('width_rate :      每个单位相当于  ** 个像素', width_rate_bottom);

    console.log('left_differ  :     左边在经纬度坐标下的长度', left_differ);
    var width_rate_left = canvas.height / left_differ;
    console.log('width_rate_left : 每个单位相当于  ** 个像素', width_rate_left);
    console.log('width_rate_bottom 应该等于 width_rate', Math.floor(width_rate_bottom), Math.floor(width_rate_left));

    console.log('\n', '四角坐标', Corner, '\n\t');
    console.log('两边斜率乘积 , 越接近 -1 越精确', productOfSlope);

    console.log('*******************************四角定位测试*******************************');
    //  绘制四角定位点
    testDraw(bottom_differ, left_differ);
}

//  测试
function testDraw(bottom_differ, left_differ) {
    //  test右下角
    drawCircle({
        x: transformLongitudeAndLatitudeToCartesianCoordinateSystem(Number(bottom_differ)),
        y: transformLongitudeAndLatitudeToCartesianCoordinateSystem(0),
    }, 20, 'red');
    //  test右上角
    drawCircle({
        x: transformLongitudeAndLatitudeToCartesianCoordinateSystem(Number(bottom_differ)),
        y: transformLongitudeAndLatitudeToCartesianCoordinateSystem(left_differ)
    }, 20, 'red');
    //  test左上角
    drawCircle({
        x: transformLongitudeAndLatitudeToCartesianCoordinateSystem(0),
        y: transformLongitudeAndLatitudeToCartesianCoordinateSystem(left_differ)
    }, 20, 'red');
    //  test左下角
    drawCircle({
        x: transformLongitudeAndLatitudeToCartesianCoordinateSystem(0),
        y: transformLongitudeAndLatitudeToCartesianCoordinateSystem(0)
    }, 20, 'red');
}


//  获取一个json对象的副本
function obtainCopy(data) {
    return JSON.parse(JSON.stringify(data));
}
