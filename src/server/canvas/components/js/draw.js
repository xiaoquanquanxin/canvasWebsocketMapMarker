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
    //  设置阴影
    setShadow(10, "rgba(0,0,0,0.2)", 3, 4);

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

    //  恢复阴影设置
    setShadow(0, "rgba(0,0,0,0)", 0, 0);


}

//  绘制三角形
/**
 * @turn:number,    角度
 * @point:object,   位置
 * @width:number,   三角形宽度
 * @height:number,  三角形高度
 * */
function drawTriangle(turn, point, width, height, fillStyle) {
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.moveTo(point.x, point.y);
    // console.log(turn % 180);
    if (turn % 180 !== 0) {
        //  左右
        //  设置阴影
        setShadow(4, "rgba(0,0,0,0.2)", -2, 4);
        ctx.lineTo(point.x + width, point.y - height);
        ctx.lineTo(point.x + width, point.y + height);
    } else {
        //  设置阴影
        setShadow(4, "rgba(0,0,0,0.2)", 3, 4);
        ctx.lineTo(point.x + width, point.y - height);
        ctx.lineTo(point.x - width, point.y - height);
    }
    ctx.lineTo(point.x, point.y);
    ctx.fill();
    ctx.closePath();
    //  恢复阴影设置
    setShadow(0, "rgba(0,0,0,0)", 0, 0);
}

//  绘制文字
function drawText(message, x, y, fontSize, color) {
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = color || 'black';
    ctx.fillText(message, x, y);
}

//  阴影设置
function setShadow(shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY) {
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;
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
        drawRound(__point, 13, 'purple');
    });
}

//  绘制小车
function drawCar(point) {
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
//  fixme   可能需要重构
//  todo    根据传入的message的字数，去计算出来宽度
/**
 * @message:any 范型,字符串或对象
 * @point:object    位置
 * @height:number   tips的高度
 * @fontSize:number 字体大小
 * */
function drawTips(message, point, height, fontSize) {
    let __point = calculatePoint(point);
    let _height = height / imgRatio;
    let _fontSize = fontSize / imgRatio;
    console.log(message, __point, _height, _fontSize);

    //  用于输入文字的对象
    let TextArr = [];
    //  文字长度
    let wordWidth = 0;

    if (typeof message === 'string') {
        wordWidth = message.length * _fontSize;
        TextArr = [{word: message}];
    } else {
        //  数字的宽度对于普通文字的宽度的比
        const NumberTextRatio = 0.55;
        switch (message.type) {
            case 1:                 //  type ===1 : 等待排队
                const NumberOfPeople = message.numberOfPeople.toString();
                const RemainingTime = message.remainingTime.toString();
                TextArr = [{word: '排队', color: 'black', textLength: '排队'.length * _fontSize},
                    {
                        word: NumberOfPeople,
                        color: 'red',
                        textLength: NumberOfPeople.length * NumberTextRatio * _fontSize
                    },
                    {word: '人，预计', color: 'black', textLength: '人，预计'.length * _fontSize},
                    {word: RemainingTime, color: 'red', textLength: RemainingTime.length * NumberTextRatio * _fontSize},
                    {word: '分钟', color: 'black', textLength: '分钟'.length * _fontSize}
                ];
                wordWidth = TextArr.reduce(function (prev, current) {
                    return prev + current.textLength
                }, 0);
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                return;
        }
    }
    //  tips长度
    let _width = wordWidth + _fontSize;
    console.log(wordWidth, _width);


    //  三角形对象
    let triangleObject = {};
    triangleObject.width = 6 / imgRatio;
    triangleObject.height = 6 / imgRatio;

    //  限界，主要是考虑右侧
    if (__point.x + _width + 10 * ratio + ImageStationBasic.width * 0.5 >= canvas.width) {
        //  如果实际tips的右边  与  canvas右边距离少于10px，则让他放到上面
        __point.x -= _width / 2;
        __point.y -= ImageStationBasic.height + _height;
        triangleObject.x = __point.x + _width / 2;
        triangleObject.y = __point.y + _height + triangleObject.height;
        triangleObject.turn = 180;
    } else {
        __point.x += ImageStationBasic.width * 0.5;
        __point.y -= ImageStationBasic.height / 2 + _height * 0.7;
        triangleObject.x = __point.x - triangleObject.width;
        triangleObject.y = __point.y + _height * 0.5;
        triangleObject.turn = 270;
    }

    //  绘制圆角矩形
    drawRoundRect(__point.x, __point.y, _width, _height, 5, 'white');

    //  tips的小三角
    drawTriangle(triangleObject.turn, triangleObject, triangleObject.width, triangleObject.height, 'white');


    //  文字对象
    let textLeft = __point.x + _fontSize / 2;
    let textTop = __point.y + _height * 0.7;
    //  写入文字
    TextArr.forEach(function (item, index, arr) {
        textLeft += arr[index - 1] && arr[index - 1].textLength || 0;
        drawText(item.word, textLeft, textTop, _fontSize, item.color);
    });
}


//  对外暴露方法  export

//  绘制无可用车辆         🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉无可用车辆
function drawNoCar() {
    //  任何时候都要先晴空
    drawClear();
    //  绘制地图
    drawImage(ImageMap, {x: 0, y: 0}, canvas.width, canvas.height);
    //  绘制道路
    drawRoad();
}

//  绘制未定位状态         🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊可约车状态
function drawUnLocation() {
    //  任何图都基于无可用车辆
    drawNoCar();
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


//  等待排队            🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎有未完成订单       以后就没有UserPoint了
/**
 * @waitingObject:object    排队对对象
 *
 * */
function drawQueueUp(waitingObject) {
    drawNoCar();
    //  绘制起点与终点，这来个点我控制
    drawStation(StartPoint, ImageStationStart);
    drawTips(waitingObject, StartPoint, 30, 16);
    drawStation(EndPoint, ImageStationEnd);
    drawTips('终点', EndPoint, 30, 16);
}

//  开始接驾
function drawCatchStarting() {
    drawNoCar();
    //  绘制起点与终点，这来个点我控制
    drawStation(StartPoint, ImageStationStart);
    drawTips('排队2人，预计3分钟', StartPoint, 160, 30);
    drawStation(EndPoint, ImageStationEnd);
    drawTips('终点', EndPoint, 48, 30);
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


