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

//  绘制用户
function drawUser() {

}

//  主绘制
//  封装了绘制路线和地图
function mainRender() {
    //  任何时候都要先晴空
    drawClear();
    //  绘制地图
    drawImage(imageMap, {x: 0, y: 0}, canvas.width, canvas.height);
    (function () {
        // 测试四角--证明坐标系准确性
        __testCorner(bottom_differ, left_differ, bottomLineParams.k * leftLineParams.k)
    }());
    console.clear();

    //  绘制路径
    pointsList.reduce(function (prev, current) {
        drawLine(calculatePoint(prev), calculatePoint(current), 'blue', 15);
        return current;
    });

    //  绘制拐弯
    pointsList.forEach(function (item, index) {
        let __point = calculatePoint(item);
        //  绘制某个点
        drawRound(__point, 7.5, 'blue');
        // console.log(imageCar, __point, 26, 36);
        drawImage(imageStation, {x: __point.x - 26 / 2, y: __point.y - 36 / 2}, 26, 36);
    });

    //  绘制某个实际的点位
    let __point = calculatePoint(StartPoint);
    //  绘制某个点
    drawRound(__point, 4.5, 'yellow');

    //  绘制小车
    drawImage(imageCar, {x: 0, y: 0}, imageCar.width, imageCar.height);

}

//  清除全部画布
function drawClear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//  