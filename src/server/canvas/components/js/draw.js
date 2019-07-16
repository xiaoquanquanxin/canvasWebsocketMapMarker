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
    if (img.isError) {
        console.log('图片报错了,这个花不了', img);
        return;
    }
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
/**
 *  @roadList:array     要画的路线
 *  @configData:object  要画的路线的配置
 * */
function drawRoad(roadList, configData) {
    //  绘制路径
    roadList.reduce(function (prev, current) {
        drawLine(calculatePoint(prev), calculatePoint(current), configData.lineColor, configData.lineWidth / imgRatio);
        return current;
    });

    //  绘制拐弯
    roadList.forEach(function (item, index) {
        var __point = calculatePoint(item);
        //  绘制某个点
        drawRound(__point, configData.inflexionPointRadius / imgRatio, configData.inflexionPointColor);
    });
}

//  绘制小车
function drawCar(point) {
    //  获取汽车应该在的点
    var MinIndex = getClosest(point, RoadList);
    console.log(RoadList[MinIndex]);
    //  todo    或longitude\latitude
    CarPoint = JSON.parse(JSON.stringify(RoadList[MinIndex]));
    //  找到可以用来求解的两个点    这两个点应该是前三和后三
    var CarAngle = getCarAngle(MinIndex, RoadList);
    var __point = calculatePoint(RoadList[MinIndex]);
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
    var __point = calculatePoint(point);
    __point.x -= img.width / 2;
    __point.y -= img.height;
    drawImage(img, __point, img.width, img.height);
}

//  绘制用户
function drawUser(point) {
    var __point = calculatePoint(point);
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
 * @hasTriangle:boolean 是否需要
 * */
function drawTips(message, point, height, fontSize, hasTriangle) {
    var __point = calculatePoint(point);
    var _height = height / imgRatio;
    var _fontSize = fontSize / imgRatio;
    // console.log(message, __point, _height, _fontSize);

    //  用于输入文字的对象
    var TextArr = [];
    //  文字长度
    var wordWidth = 0;

    if (typeof message === 'string') {
        wordWidth = message.length * _fontSize;
        TextArr = [{word: message}];
    } else {
        //  数字的宽度对于普通文字的宽度的比
        var NumberTextRatio = 0.55;
        switch (message.type) {
            case 1:                 //  type === 1 : 等待排队
                var NumberOfPeople = message.numberOfPeople.toString();
                var RemainingTimeData = getTimeData(message.remainingTime.toString());
                console.log(RemainingTimeData);
                TextArr = [
                    {word: '排队', color: 'black', textLength: '排队'.length * _fontSize},
                    {
                        word: NumberOfPeople,
                        color: 'red',
                        textLength: NumberOfPeople.length * NumberTextRatio * _fontSize
                    },
                    {word: '人，预计', color: 'black', textLength: '人，预计'.length * _fontSize},
                    {
                        word: RemainingTimeData.value,
                        color: 'red',
                        textLength: RemainingTimeData.value.length * NumberTextRatio * _fontSize
                    },
                    {
                        word: RemainingTimeData.unit,
                        color: 'black',
                        textLength: RemainingTimeData.unit.length * _fontSize
                    }
                ];
                break;
            case 2:                 //  type === 2  :等待接驾
                var StartPointDistanceData = getDistanceData(message.startPointDistance.toString());
                // console.log(StartPointDistanceData);
                var StartPointTimeData = getTimeData(message.startPointTime.toString());
                // console.log(StartPointTimeData);
                TextArr = [
                    {word: '距离', color: 'black', textLength: '距离'.length * _fontSize},
                    {
                        word: StartPointDistanceData.value,
                        color: 'red',
                        textLength: StartPointDistanceData.value.length * NumberTextRatio * _fontSize
                    },
                    {
                        word: StartPointDistanceData.unit + ' ，',
                        color: 'black',
                        textLength: (StartPointDistanceData.unit + ' ，').length * NumberTextRatio * _fontSize
                    },
                    {
                        word: StartPointTimeData.value,
                        color: 'red',
                        textLength: StartPointTimeData.value.length * NumberTextRatio * _fontSize
                    },
                    {
                        word: StartPointTimeData.unit,
                        color: 'black',
                        textLength: StartPointTimeData.unit.length * _fontSize
                    },
                ];
                // console.log(TextArr);
                break;
            case 3:             //  type === 3 ：等待乘车
                console.log(message);
                var countDownData = getCountDown(message.countDown.toString());
                console.log(countDownData);
                TextArr = [
                    {word: '车已到达，倒计时', color: 'black', textLength: '车已到达，倒计时'.length * _fontSize},
                    {word: countDownData, color: 'red', textLength: countDownData.length * NumberTextRatio * _fontSize}
                ];
                break;
            case 4:
                console.log(message);
                var fromTheEndData = getDistanceData(message.fromTheEnd.toString());
                var estimatedTimeData = getTimeData(message.estimatedTime.toString());
                console.log(fromTheEndData, estimatedTimeData);
                TextArr = [
                    {word: '距离终点', color: 'black', textLength: '距离终点'.length * _fontSize},
                    {
                        word: fromTheEndData.value,
                        color: 'red',
                        textLength: fromTheEndData.value.length * NumberTextRatio * _fontSize
                    },
                    {
                        word: fromTheEndData.unit + ' ，预计',
                        color: 'black',
                        textLength: ((fromTheEndData.unit + ' ').length * NumberTextRatio + '，预计'.length) * _fontSize
                    },
                    {
                        word: estimatedTimeData.value,
                        color: 'red',
                        textLength: estimatedTimeData.value.length * NumberTextRatio * _fontSize
                    },
                    {
                        word: estimatedTimeData.unit,
                        color: 'black',
                        textLength: estimatedTimeData.unit.length * _fontSize
                    }
                ];
                break;
            default:
                return;
        }
        wordWidth = TextArr.reduce(function (prev, current) {
            return prev + current.textLength
        }, 0);
    }
    //  tips长度
    var _width = wordWidth + _fontSize;

    //  三角形对象
    var triangleObject = {};
    triangleObject.width = tipData.triangleWidth / imgRatio;
    triangleObject.height = tipData.triangleHeight / imgRatio;

    //  如果是小车的tips,总是在上方
    var tipsIsCarCondition = message.type === 2 || message.type === 3 || message.type === 4;

    // debugger;
    //  限界，主要是考虑右侧
    if (__point.x + _width + tipData.limitRightWidth / imgRatio + ImageStationBasic.width * 0.5 >= canvas.width || tipsIsCarCondition) {
        //  tips的x轴
        triangleObject.x = __point.x;
        //  如果实际tips的右边  与  canvas右边距离少于10px，则让他放到上面
        __point.x -= _width / 2;
        if (__point.x + _width >= canvas.width - tipData.limitRightWidth / imgRatio) {
            __point.x = Math.min(__point.x, canvas.width - tipData.limitRightWidth / imgRatio - _width)
        }
        __point.y -= ImageStationBasic.height + _height;
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

    if (hasTriangle) {
        //  tips的小三角
        drawTriangle(triangleObject.turn, triangleObject, triangleObject.width, triangleObject.height, 'white');
    }

    //  文字对象
    var textLeft = __point.x + _fontSize / 2;
    var textTop = __point.y + _height * 0.7;
    //  写入文字
    TextArr.forEach(function (item, index, arr) {
        textLeft += arr[index - 1] && arr[index - 1].textLength || 0;
        drawText(item.word, textLeft, textTop, _fontSize, item.color);
    });
}


//  对外暴露方法  export
var NativeUtilsCallH5 = {};
//  无人车对象
NativeUtilsCallH5.DriverLessCar = (function () {
    return {
        //  绘制无可用车辆         🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉无可用车辆
        drawNoCar: function () {
            //  任何时候都要先晴空
            drawClear();
            //  绘制地图
            drawImage(ImageMap, {x: 0, y: 0}, canvas.width, canvas.height);
            //  绘制道路
            drawRoad(RoadList, roadData);
        },

        //  绘制未定位状态         🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊可约车状态
        drawUnLocation: function () {
            //  任何图都基于无可用车辆
            this.drawNoCar();
            //  绘制全部站点
            drawStations();
        },

        //  绘制用户开启定位状态
        /**
         * @userPoint:object    用户定位的经纬度
         * */
        drawLocation: function (userPoint) {
            //  用户位置
            window.UserPoint = JSON.parse(userPoint);
            //  先画未定位
            this.drawUnLocation();
            //  用户定位
            drawUser(UserPoint);
            // console.clear();
            var MinPoint = getClosest(UserPoint, StationList);
            console.log('离我最近的点', StationList[MinPoint]);
            return StationList[MinPoint];
        },

        //  绘制起点终点
        // startPointId, endPointId
        /**
         * @startPointId:number 起点id
         * @endPointId:number   终点id
         * */
        drawStartAndEnd: function (startPointId, endPointId) {
            //  绘制起点需要全部擦除
            drawClear();
            //  绘制地图
            drawMap();
            //  绘制道路
            drawRoad(RoadList, roadData);
            //  绘制全部站点
            drawStations();
            //  绘制起点和终点
            if (startPointId) {
                window.StartPoint = StationList.find(function (item) {
                    return item.id === startPointId;
                });
                if (window.StartPoint === undefined) {
                    throw new Error('没有这个上车点位');
                }
                drawStation(StartPoint, ImageStationStart);
                drawTips('在这里上车', StartPoint, tipData.height, tipData.fontSize, true);
            }
            if (endPointId) {
                window.EndPoint = StationList.find(function (item) {
                    return item.id === endPointId;
                });
                if (window.EndPoint === undefined) {
                    throw new Error('没有这个下车点位');
                }
                //  todo    别忘了放开注释
                drawStation(EndPoint, ImageStationEnd);
                drawTips('目的地', EndPoint, tipData.height, tipData.fontSize, true);
            }
            //  绘制用户的点位 只要用户曾经定位过，就永远在这里了
            if (typeof UserPoint === 'object') {
                drawUser(UserPoint);
            }
        },

        //  等待排队            🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎有未完成订单       以后就没有UserPoint了
        /**
         * @waitingObject:string    排队对象的json字符串
         *
         * */
        drawQueueUp: function (waitingString) {
            console.log('waitingString', waitingString);
            var waitingData = JSON.parse(waitingString);
            waitingData.type = 1;
            this.drawNoCar();
            //  绘制起点与终点，这来个点我控制
            var _StartPoint = JSON.parse(JSON.stringify(StartPoint));
            var _EndPoint = JSON.parse(JSON.stringify(EndPoint));
            var _RoadList = JSON.parse(JSON.stringify(RoadList));
            //  获取行程的路径
            var planRoadList = getPathOfTravel(_StartPoint, _EndPoint, _RoadList);
            console.log(planRoadList);
            drawRoad(planRoadList, planRoadData);

            drawStation(_StartPoint, ImageStationStart);
            drawTips(waitingData, _StartPoint, tipData.height, tipData.fontSize, true);
            drawStation(_EndPoint, ImageStationEnd);
            drawTips('终点', _EndPoint, tipData.height, tipData.fontSize, true);
        },

        //  开始接驾
        /**
         * @catchString:string  开始接驾的对象
         * */
        drawCatchStarting: function (catchString) {
            // debugger
            console.log('catchString', catchString);
            var catchData = JSON.parse(catchString);
            catchData.type = 2;
            console.log(catchData);
            window.CarPoint.longitude = catchData.longitude;
            window.CarPoint.latitude = catchData.latitude;
            this.drawNoCar();
            //  绘制起点与终点，这来个点我控制
            drawStation(EndPoint, ImageStationEnd);
            drawTips('终点', EndPoint, tipData.height, tipData.fontSize, true);
            drawStation(StartPoint, ImageStationStart);
            drawCar(CarPoint);
            drawTips(catchData, CarPoint, tipData.height, tipData.fontSize);
        },

        //  等待乘车
        /**
         * @carArrived:object   车辆已到达的倒计时对象
         * */
        drawCarArrived: function (carArrivedData) {
            this.drawNoCar();
            drawStation(EndPoint, ImageStationEnd);
            drawTips('终点', EndPoint, tipData.height, tipData.fontSize, true);
            drawStation(StartPoint, ImageStationStart);
            drawTips(carArrivedData, StartPoint, tipData.height, tipData.fontSize);
        },

        //  乘车中
        /**
         * @drivingData:object  汽车行驶状态对象
         *
         * */
        drawInTheBus: function (drivingData) {
            this.drawNoCar();
            drawStation(EndPoint, ImageStationEnd);
            drawTips('终点', EndPoint, tipData.height, tipData.fontSize, true);


            drawStation(StartPoint, ImageStationStart);
            drawTips(drivingData, StartPoint, tipData.height, tipData.fontSize);
        }
    }
}());


//  测试

//  测试坐标精准度
function testCoordinatePrecision(testPoint) {
    // 测试四角--证明坐标系准确性
    __testCorner(bottom_differ, left_differ, bottomLineParams.k * leftLineParams.k);
    //  测试点位
    testPoint && drawRound(calculatePoint(testPoint), 10, 'red');
}
