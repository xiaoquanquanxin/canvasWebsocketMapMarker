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


//  计算连个点位之间都距离，返回距离？哪一个点位？
/**
 * @referenceSpot:参考点位
 * @point1:第一个点
 * @point2:第二个点
 * */
function getClosest(referenceSpot, point1, point2) {

}


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
