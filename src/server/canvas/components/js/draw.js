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
    ctx.strokeStyle = fillStyle;
    // ctx.strokeStyle = 'red';
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

//  绘制圆角矩形
function drawRoundRect(x, y, width, height, radius, fillStyle) {
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
    ctx.lineTo(width - radius + x, y);
    ctx.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
    ctx.lineTo(width + x, height + y - radius);
    ctx.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
    ctx.lineTo(radius + x, height + y);
    ctx.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
    ctx.fill();
    ctx.closePath();
}

//  绘制文字
function drawText(message, x, y, fontSize, color) {
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = color;
    ctx.fillText(message, x, y);
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
        drawRound(__point, 13, 'purple',);
    });
}

//  绘制小车
function drawCar(point) {
    //  todo    拿到原始数据之后，应该计算出距离最近的点位，将小车扔过去，
    //  todo    缺少，线性方向 , 我要知道当前点的所属直线
    //  获取汽车应该在的点
    let MinIndex = getClosest(point, RoadList);
    console.log(MinIndex, RoadList);
    //  找到可以用来求解的两个点    这两个点应该是前三和后三
    const CarAngle = getCarAngle(MinIndex, RoadList);
    let __point = calculatePoint(RoadList[MinIndex]);
    console.log(__point, CarAngle);
    //  位移
    ctx.translate(__point.x, __point.y);
    //  旋转
    ctx.rotate(CarAngle / 180 * Math.PI);
    drawImage(ImageCar, {x: -ImageCar.width / 2, y: -ImageCar.height / 2}, ImageCar.width, ImageCar.height);
    //  返回旋转
    ctx.rotate(-CarAngle / 180 * Math.PI);
    //  返回位移
    ctx.translate(-__point.x, -__point.y);

    //  测试
    // drawStation(RoadList[0], ImageCar);
}

//  绘制某个站点
/**
 * @point：点位
 * @img:    不同类型的图片
 * */
function drawStation(point, img) {
    let __point = calculatePoint(point);
    __point.x -= img.width / 2;
    __point.y -= img.height;
    drawImage(img, __point, img.width, img.height);
}

//  绘制用户
function drawUser(point) {
    let __point = calculatePoint(point);
    __point.x = __point.x - ImageUser.width / 2;
    __point.y = __point.y - ImageUser.height * 0.9;
    drawImage(ImageUser, __point, ImageUser.width, ImageUser.height);

}

//  绘制小标记
function drawTips(message, point, width, height) {
    let __point = calculatePoint(point);
    // width = message.length * 17 + 16 / imgRatio;
    width = width / imgRatio;
    height = height / imgRatio;


    __point.x += ImageStationBasic.width * 0.5;
    __point.y -= ImageStationBasic.height / 2 + height * 0.7;

    //  绘制圆角矩形的阴影
    drawRoundRect(__point.x + 2, __point.y + 3, width, height, 5, 'rgba(0,0,0,0.05)');
    //  绘制圆角矩形
    drawRoundRect(__point.x, __point.y, width, height, 5, 'white');
    //  写入文字
    drawText(message, __point.x + 8 / imgRatio, __point.y + height * 0.7, 16 / imgRatio, 'black');
}


//  对外暴露方法  export

//  绘制无车可约
function drawNoCar() {
    //  任何时候都要先晴空
    drawClear();
    //  绘制地图
    drawImage(ImageMap, {x: 0, y: 0}, canvas.width, canvas.height);
    //  绘制道路
    drawRoad();
}

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
    console.log('离我最近的点', StationList[MinPoint]);
    return StationList[MinPoint];
}

//  绘制起点终点
//  todo    缺少【在这里上车】和【目的地】两个tips
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
    if (startPoint) {
        drawStation(startPoint, ImageStationStart);
        drawTips('在这里上车', startPoint, 100, 30);
    }
    if (endPoint) {
        drawStation(endPoint, ImageStationEnd);
        drawTips('目的地', endPoint, 66, 30);
        // drawTips('排队2人，预计5分钟', endPoint, 60, 30);
    }
    //  绘制用户的点位 只要用户曾经定位过，就永远在这里了
    UserPoint && drawUser(UserPoint);
}


//  主绘制
//  封装了绘制路线和地图
function mainRender() {
    drawStartAndEnd(StationList[1], StationList[4]);
    return
    //  绘制小车
    drawCar(CarPoint);
}


//  测试

//  测试坐标精准度
function testCoordinatePrecision(testPoint) {
    // 测试四角--证明坐标系准确性
    __testCorner(bottom_differ, left_differ, bottomLineParams.k * leftLineParams.k);
    //  测试点位
    testPoint && drawRound(calculatePoint(testPoint), 10, 'red');
}


//  绘制待接驾
function draw() {

}