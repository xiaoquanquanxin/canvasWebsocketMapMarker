//  抽象方法

//  绘制路径
/**
 * @startPoint：起始点
 * @endPoint：终点
 * @strokeStyle：填充颜色
 * @lineWidth：路径宽度
 * */
function drawLine(startPoint, endPoint, strokeStyle, lineWidth) {
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.closePath();
    ctx.stroke()
}

//  绘制拐弯处的弯弯，每个折线点处点用这个小圆处理，使平滑
/**
 * @point : 点 [canvas坐标系]
 * @radio:半径
 * @fillStyle:填充颜色
 * */
function drawRound(point, radio, fillStyle) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radio, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 0.5;
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.closePath();
}

//  绘制图片，将来可能要考虑方向
/**
 * @point:绘制图片位置
 * @width：绘制图片长度【当正向的时候】
 * @height：绘制图片高度
 * @
 * */
function drawImage(img, point, width, height) {
    ctx.drawImage(img, point.x, point.y, width, height);
}


//  实例方法

//  清除全部画布
function drawClear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//  绘制地图
function drawMap() {
    drawImage(ImageMap, {x: 0, y: 0}, canvas.width, canvas.height);
}

//  绘制全部站点
function drawStations() {
    //  绘制全部站点
    StationList.forEach(function (item, index) {
        drawStation(item, ImageStationBasic);
    });
}

//  绘制路径
function drawRoad() {
    //  绘制路径
    RoadList.reduce(function (prev, current) {
        drawLine(calculatePoint(prev), calculatePoint(current), 'rgba(0,199,0,0.4)', 15);
        return current;
    });

    //  绘制拐弯
    RoadList.forEach(function (item, index) {
        let __point = calculatePoint(item);
        //  绘制某个点
        drawRound(__point, 7.5, 'rgba(0,199,0,0.4)',);
        // console.log(ImageCar, __point, 26, 36);
        // drawImage(ImageStation, {x: __point.x - 26 / 2, y: __point.y - 36 / 2}, 26, 36);
    });
}


//  绘制某个站点
/**
 * @point：点位
 * @img:    不同类型的图片
 * */
function drawStation(point, img) {
    let __point = calculatePoint(point);
    __point.x = __point.x - img.width / 2;
    __point.y = __point.y - img.height;
    drawImage(img, __point, img.width, img.height);
}

//  绘制用户
function drawUser(point) {
    let __point = calculatePoint(point);
    __point.x = __point.x - ImageUser.width / 2;
    __point.y = __point.y - ImageUser.height * 0.9;
    drawImage(ImageUser, __point, ImageUser.width, ImageUser.height);

}



//  对外暴露方法  export

//  绘制未定位状态
function drawUnLocation() {
    //  任何时候都要先晴空
    drawClear();
    //  绘制地图
    drawImage(ImageMap, {x: 0, y: 0}, canvas.width, canvas.height);
    //  绘制道路
    drawRoad();
    //  绘制全部站点
    drawStations();
}

//  绘制用户开启定位状态
function drawLocation(userPoint) {
    //  先画未定位
    drawUnLocation();
    //  用户定位
    drawUser(userPoint);
    console.clear();
    const MinPoint = getClosest(userPoint, StationList);
    console.log('离我最近的点', MinPoint);
    return MinPoint;
}

//  绘制起点终点
function drawStartAndEnd(startPoint, endPoint) {
    //  绘制起点需要全部擦除
    drawClear();
    //  绘制地图
    drawMap();
    //  绘制道路
    drawRoad();
    //  绘制全部站点
    drawStations();
    //  绘制起点和终点
    startPoint && drawStation(startPoint, ImageStationStart);
    endPoint && drawStation(endPoint, ImageStationEnd);
    //  绘制用户的点位 只要用户曾经定位过，就永远在这里了
    UserPoint && drawUser(UserPoint);
}

//  主绘制
//  封装了绘制路线和地图
function mainRender() {
    //  绘制用户开启定位状态
    drawUnLocation();

    return
    //  绘制小车
    drawImage(ImageCar, {x: 0, y: 0}, ImageCar.width, ImageCar.height);
}


//  todo    考虑这些小图点载入顺序，考虑小图的大小比例

//  测试

//  测试坐标精准度
function testCoordinatePrecision(testPoint) {
    // 测试四角--证明坐标系准确性
    __testCorner(bottom_differ, left_differ, bottomLineParams.k * leftLineParams.k);
    //  测试点位
    testPoint && drawRound(calculatePoint(testPoint), 10, 'red');
}

