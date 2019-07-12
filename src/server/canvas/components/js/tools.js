//  转换全部数据
/**
 * @originData : 要被从字符串转为小数点的对象 , 经过 x northernLatitude 处理  [data:[string]]
 * */
function transformOriginData(originData) {
    let data = {};
    for (let key in originData) {
        if (originData.hasOwnProperty(key)) {
            data[key] = {};
            data[key].latitude = originData[key].latitude * northernLatitude;
            data[key].longitude = originData[key].longitude;
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
    let k = (y2 - y1) / (x2 - x1);
    let b = y1 - k * x1;
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
const getPixelRatio = function (context) {
    const backingStore = context.backingStorePixelRatio ||
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
    const _point = {
        latitude: point.latitude * northernLatitude,
        longitude: point.longitude,
    };
    //  换算为canvas坐标系后的坐标
    const __point = {
        latitude: _point.latitude - leftLineParams.x,
        longitude: _point.longitude - bottomLineParams.y
    };
    return {
        x: transformLongitudeAndLatitudeToCartesianCoordinateSystem(__point.latitude),
        y: canvas.height - transformLongitudeAndLatitudeToCartesianCoordinateSystem(__point.longitude)
    };
}


//  返回最近的点
/**
 * @referenceSpot:参考点位
 * @pointList:一系列点
 *
 * @return:number 从pointList中,返回最近的那个点的下标
 * */
function getClosest(referenceSpot, pointList) {
    //  转为canvas坐标系
    const __referenceSpot = calculatePoint(referenceSpot);
    //  转为canvas坐标系
    const __pointList = pointList.map(function (item, index) {
        return calculatePoint(item);
    });
    //  作出距离的list
    const __differList = __pointList.map(function (item) {
        return getDiffer(item.x, item.y, __referenceSpot.x, __referenceSpot.y);
    });
    const Min = Math.min.apply(null, __differList);
    const MinIndex = __differList.findIndex(function (item) {
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
    const FirstIndex = Math.max(0, index - 3);
    const LastIndex = FirstIndex + 5;
    const FirstPoint = calculatePoint(list[FirstIndex]);
    const LastPoint = calculatePoint(list[LastIndex]);
    const CarObject = getK_B(FirstPoint.x, FirstPoint.y, LastPoint.x, LastPoint.y);
    // console.log(CarObject);
    const Angle = Math.atan(CarObject.k) * 180 / Math.PI;
    console.log(Angle);
    return Angle;
}



/**
 * requestAnimationFrame兼容性扩展，两方面工作：
 * 1、把各浏览器前缀进行统一
 * 2、在浏览器没有requestAnimationFrame方法时将其指向setTimeout方法
 * */
(function() {
    let lastTime = 0;
    let vendors = ["webkit", "moz"];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        // Webkit中此取消方法的名字变了
        window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            let id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());



//  测试  四角定位
/**
 * @bottom_differ
 * @left_differ
 * @productOfSlope
 * */
function __testCorner(bottom_differ, left_differ, productOfSlope) {
    console.log('*******************************四角定位测试*******************************');
    console.log('bottom_differ  :   底边在经纬度坐标下的长度', bottom_differ);
    let width_rate_bottom = canvas.width / bottom_differ;
    console.log('width_rate :      每个单位相当于  ** 个像素', width_rate_bottom);

    console.log('left_differ  :     左边在经纬度坐标下的长度', left_differ);
    let width_rate_left = canvas.height / left_differ;
    console.log('width_rate_left : 每个单位相当于  ** 个像素', width_rate_left);
    console.log('width_rate_bottom 应该等于 width_rate', Math.floor(width_rate_bottom), Math.floor(width_rate_left));

    console.log('\n', '四角坐标', _corner, '\n\t');
    console.log('两边斜率乘积 , 越接近 -1 越精确', productOfSlope);

    console.log('*******************************四角定位测试*******************************');
    //  绘制四角定位点
    testDraw(bottom_differ, left_differ);
}

//  测试
function testDraw(bottom_differ, left_differ) {
    //  test右下角
    drawRound({
        x: transformLongitudeAndLatitudeToCartesianCoordinateSystem(Number(bottom_differ)),
        y: transformLongitudeAndLatitudeToCartesianCoordinateSystem(0),
    }, 20, 'red');
    //  test右上角
    drawRound({
        x: transformLongitudeAndLatitudeToCartesianCoordinateSystem(Number(bottom_differ)),
        y: transformLongitudeAndLatitudeToCartesianCoordinateSystem(left_differ)
    }, 20, 'red');
    //  test左上角
    drawRound({
        x: transformLongitudeAndLatitudeToCartesianCoordinateSystem(0),
        y: transformLongitudeAndLatitudeToCartesianCoordinateSystem(left_differ)
    }, 20, 'red');
    //  test左下角
    drawRound({
        x: transformLongitudeAndLatitudeToCartesianCoordinateSystem(0),
        y: transformLongitudeAndLatitudeToCartesianCoordinateSystem(0)
    }, 20, 'red');
}
