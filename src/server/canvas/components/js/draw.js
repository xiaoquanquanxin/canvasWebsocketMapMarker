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
function drawCircle(point, radio, fillStyle) {
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
function drawCircleRect(x, y, width, height, radius, fillStyle) {
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
    var _StationList = obtainCopy(StationList);
    // console.log('StationList的json串是');
    // console.log(_StationList);
    //  绘制全部站点
    _StationList.forEach(function (item, index) {
        drawStation(item, ImageStationBasic);
    });
}

//  绘制路径
/**
 *  @roadList:array     要画的路线
 *  @configData:object  要画的路线的配置
 * */
function drawCanvasRoad(roadList, configData) {
    //  绘制路径
    roadList.reduce(function (prev, current) {
        drawLine(prev, current, configData.lineColor, configData.lineWidth / imgRatio);
        return current;
    });

    //  绘制拐弯
    roadList.forEach(function (item) {
        //  绘制某个点
        drawCircle(item, configData.inflexionPointRadius / imgRatio, configData.inflexionPointColor);
    });
}

//  画虚线
/**
 * @roadList:array          要花的路线
 * @configData:object       线条配置
 * */
function drawScreen(roadList, configData) {
    ctx.setLineDash([configData.lineLength / imgRatio, configData.lineSpacing / imgRatio]);
    ctx.lineWidth = configData.lineWidth / imgRatio;
    ctx.strokeStyle = configData.lineColor;
    ctx.beginPath();
    roadList.reduce(function (prev, current) {
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(current.x, current.y);
        return current;
    });
    ctx.stroke();
    ctx.setLineDash([0, 0]);
}

//  绘制小车
//  fixme   没有考虑汽车运行方向
function drawCar(point) {
    //  获取汽车应该在的点
    var MinIndex = getCanvasClosest(point, RoadList);
    // console.log(RoadList[MinIndex]);
    //  todo    或longitude\latitude
    var _CarPoint = obtainCopy(RoadList[MinIndex]);
    CarPoint.x = _CarPoint.x;
    CarPoint.y = _CarPoint.y;
    CarPoint.turn = point.turn || CarPoint.turn;
    //  找到可以用来求解的两个点    这两个点应该是前三和后三
    var CarAngle = getCarAngle(MinIndex, RoadList);
    CarAngle = CarAngle + 180 * (!CarPoint.turn);
    var __point = obtainCopy(RoadList[MinIndex]);
    // console.log(__point, CarAngle);
    // CarAngle = 180-64
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
    point.x -= img.width / 2;
    point.y -= img.height;
    drawImage(img, point, img.width, img.height);
}

//  绘制用户
function drawUser(point) {
    point.x = point.x - ImageUser.width / 2;
    point.y = point.y - ImageUser.height * 0.9;
    drawImage(ImageUser, point, ImageUser.width, ImageUser.height);

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
function drawCanvasTips(message, point, height, fontSize, hasTriangle) {
    var _height = height / imgRatio;
    var _fontSize = fontSize / imgRatio;

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
                // console.log(RemainingTimeData);
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
                // var StartPointDistanceData = getDistanceData(message.startPointDistance.toString());
                // console.log(StartPointDistanceData);
                var StartPointTimeData = getTimeData(message.startPointTime.toString());
                // console.log(StartPointTimeData);
                TextArr = [
                    {word: '车辆调度中，预计', color: 'black', textLength: '车辆调度中，预计'.length * _fontSize},
                    // {
                    //     word: StartPointDistanceData.value,
                    //     color: 'red',
                    //     textLength: StartPointDistanceData.value.length * NumberTextRatio * _fontSize
                    // },
                    // {
                    //     word: StartPointDistanceData.unit + ' ，',
                    //     color: 'black',
                    //     textLength: (StartPointDistanceData.unit + ' ，').length * NumberTextRatio * _fontSize
                    // },
                    {
                        word: StartPointTimeData.value,
                        color: 'red',
                        textLength: StartPointTimeData.value.length * NumberTextRatio * _fontSize
                    },
                    {
                        word: StartPointTimeData.unit + '到达',
                        color: 'black',
                        textLength: (StartPointTimeData.unit + '到达').length * _fontSize,
                    },
                ];
                // console.log(TextArr);
                break;
            case 3:             //  type === 3 ：等待乘车
                var countDownData = getCountDown(message.countDown.toString());
                // console.log(countDownData);
                TextArr = [
                    {word: '车已到达，倒计时', color: 'black', textLength: '车已到达，倒计时'.length * _fontSize},
                    {word: countDownData, color: 'red', textLength: countDownData.length * NumberTextRatio * _fontSize}
                ];
                break;
            case 4:
                var fromTheEndData = getDistanceData(message.fromTheEnd.toString());
                var estimatedTimeData = getTimeData(message.estimatedTime.toString());
                // console.log(fromTheEndData, estimatedTimeData);
                TextArr = [
                    {word: '距离终点', color: 'black', textLength: '距离终点'.length * _fontSize},
                    {
                        word: fromTheEndData.value,
                        color: 'red',
                        textLength: fromTheEndData.value.length * NumberTextRatio * _fontSize
                    },
                    {
                        word: fromTheEndData.unit + '',
                        color: 'black',
                        textLength: ((fromTheEndData.unit + ' ').length * NumberTextRatio + ''.length) * _fontSize
                    },
                    //  todo    暂时没有距离字段
                    // {
                    //     word: fromTheEndData.unit + ' ，预计',
                    //     color: 'black',
                    //     textLength: ((fromTheEndData.unit + ' ').length * NumberTextRatio + '，预计'.length) * _fontSize
                    // },
                    // {
                    //     word: estimatedTimeData.value,
                    //     color: 'red',
                    //     textLength: estimatedTimeData.value.length * NumberTextRatio * _fontSize
                    // },
                    // {
                    //     word: estimatedTimeData.unit,
                    //     color: 'black',
                    //     textLength: estimatedTimeData.unit.length * _fontSize
                    // }
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

    // 限界，主要是考虑右侧
    if (point.x + _width + tipData.limitRightWidth / imgRatio + ImageStationBasic.width * 0.5 >= canvas.width || tipsIsCarCondition) {
        //  tips的x轴
        triangleObject.x = point.x;
        //  如果实际tips的右边  与  canvas右边距离少于10px，则让他放到上面
        point.x -= _width / 2;
        if (point.x + _width >= canvas.width - tipData.limitRightWidth / imgRatio) {
            point.x = Math.min(point.x, canvas.width - tipData.limitRightWidth / imgRatio - _width)
        }
        if (tipsIsCarCondition) {
            // console.log('计算tips，是小车');
            point.y -= (ImageCar.height + _height - 15 / imgRatio);        //  这是另一种配置
            // point.y -= (ImageCar.height + _height);
        } else {
            point.y -= ImageStationBasic.height + _height;
        }
        triangleObject.y = point.y + _height + triangleObject.height;
        triangleObject.turn = 180;
    } else {
        point.x += ImageStationBasic.width * 0.5;
        point.y -= ImageStationBasic.height / 2 + _height * 0.7;
        triangleObject.x = point.x - triangleObject.width;
        triangleObject.y = point.y + _height * 0.5;
        triangleObject.turn = 270;
    }

    //  绘制圆角矩形
    drawCircleRect(point.x, point.y, _width, _height, 5, 'white');

    if (hasTriangle) {
        //  tips的小三角
        drawTriangle(triangleObject.turn, triangleObject, triangleObject.width, triangleObject.height, 'white');
    }

    //  文字对象
    var textLeft = point.x + _fontSize / 2;
    var textTop = point.y + _height * 0.75;
    //  写入文字
    TextArr.forEach(function (item, index, arr) {
        textLeft += arr[index - 1] && arr[index - 1].textLength || 0;
        drawText(item.word, textLeft, textTop, _fontSize, item.color);
    });
}


//  对外暴露方法  export
window.NativeUtilsCallH5 = window.NativeUtilsCallH5 || {};
//  无人车对象
NativeUtilsCallH5.DriverLessCar = (function () {
    return {
        //  清除数据, 除了 地图四角经纬度, 路径经纬度,站点经纬度以外的全部数据
        drawReset: function (force) {
            console.log('drawReset调用');
            console.log(StartPoint === null);
            if (StartPoint === null) {
                return;
            }
            this.drawUnLocation();
            //  todo    绘制起点和终点
            drawStation(obtainCopy(StartPoint), ImageStationStart);
            drawCanvasTips('起点', obtainCopy(StartPoint), tipData.height, tipData.fontSize, true);
            drawStation(obtainCopy(EndPoint), ImageStationEnd);
            drawCanvasTips('终点', obtainCopy(EndPoint), tipData.height, tipData.fontSize, true);
            resetData();
            console.log('drawReset完成');
        },
        //  刚进入页面的初始化状态，只有地图
        drawInit: function () {
            // console.log('drawInit调用');
            //  任何时候都要先晴空
            drawClear();
            //  绘制地图
            drawMap();
            // console.log('drawInit完成');
        },

        //  绘制无可用车辆         🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉🍉无可用车辆
        drawNoCar: function () {
            // console.log('drawNoCar调用');
            (function () {
                //  任何时候都要先晴空
                drawClear();
                //  绘制地图
                drawMap();
            }());
            //  绘制道路
            drawCanvasRoad(RoadList, roadData);
            // console.log('drawNoCar完成');
        },

        //  绘制未定位状态         🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊🍊可约车状态
        drawUnLocation: function () {
            // console.log('drawUnLocation调用');
            (function () {
                //  任何图都基于无可用车辆
                drawClear();
                //  绘制地图
                drawMap();
                //  绘制道路
                drawCanvasRoad(RoadList, roadData);
            }());
            //  绘制全部站点
            drawStations();
            this.drawUnLocation.called = true;
            // console.log('drawUnLocation完成');
        },

        //  绘制用户开启定位状态
        /**
         * @userPoint:object    用户定位的经纬度
         *
         * @return:string   JSON串：："{"id":2,"x":577.2850539290472,"y":385.72152093401405}"
         * */
        drawLocation: function (userPointString) {
            console.log('drawLocation调用');
            //  用户位置
            window.UserPoint = calculatePoint(JSON.parse(userPointString));
            if (this.drawUnLocation.called !== true) {
                //  先画未定位
                this.drawUnLocation();
            }
            var _UserPoint = obtainCopy(UserPoint);
            //  用户定位
            drawUser(_UserPoint);
            //  返回给移动端最近的stationId
            this.returnClosestStationId(obtainCopy(UserPoint), obtainCopy(StationList));
        },

        //  绘制起点终点
        // startPointId, endPointId
        /**
         * @startPointId:number 起点id
         * @endPointId:number   终点id
         * */
        drawStartAndEnd: function (startPointId, endPointId) {
            // console.log('drawStartAndEnd调用');
            //  先画未定位
            this.drawUnLocation();
            //  绘制起点和终点
            if (startPointId && Number(startPointId) !== -1) {
                window.StartPoint = StationList.find(function (item) {
                    return Number(item.station_id) === Number(startPointId);
                });
                if (window.StartPoint === undefined) {
                    throw new Error('没有这个上车点位，startPointId是' + startPointId);
                }
                drawStation(obtainCopy(StartPoint), ImageStationStart);
                drawCanvasTips('在这里上车', obtainCopy(StartPoint), tipData.height, tipData.fontSize, true);
            }
            if (endPointId && Number(endPointId) !== -1) {
                window.EndPoint = StationList.find(function (item) {
                    return Number(item.station_id) === Number(endPointId);
                });
                if (window.EndPoint === undefined) {
                    throw new Error('没有这个下车点位，endPointId是 ' + endPointId);
                }
                //  todo    别忘了放开注释
                drawStation(obtainCopy(EndPoint), ImageStationEnd);
                drawCanvasTips('目的地', obtainCopy(EndPoint), tipData.height, tipData.fontSize, true);
            }
            //  绘制用户的点位 只要用户曾经定位过，就永远在这里了
            if (typeof UserPoint === 'object') {
                drawUser(obtainCopy(UserPoint));
            }
        },

        //  等待排队            🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎有未完成订单       以后就没有UserPoint了
        /**
         * @waitingObject:string    排队对象的json字符串
         *
         * */
        drawQueueUp: function (waitingString) {
            console.log('调用drawQueueUp,从移动端拿到的数据是');
            console.log(waitingString);
            var waitingData = JSON.parse(waitingString);
            waitingData.type = 1;
            if (typeof StartPoint === 'undefined') {
                console.log('error: 没有缓存到StartPoint');
                return;
            }

            if (typeof EndPoint === 'undefined') {
                console.log('error: 没有缓存到EndPoint');
                return;
            }


            //  乘车中的预计路线

            if (typeof window.ridingList === 'undefined' || window.ridingList === null) {
                window.ridingList = this.setRidingList([StartPoint.station_id, EndPoint.station_id], false);
            }

            this.drawNoCar();
            //  画行驶路线
            drawCanvasRoad(obtainCopy(window.ridingList), planRoadData);

            drawStation(obtainCopy(StartPoint), ImageStationStart);
            drawCanvasTips(waitingData, obtainCopy(StartPoint), tipData.height, tipData.fontSize, true);
            drawStation(obtainCopy(EndPoint), ImageStationEnd);
            drawCanvasTips('终点', obtainCopy(EndPoint), tipData.height, tipData.fontSize, true);
        },

        //  开始接驾
        /**
         * @catchString:string  开始接驾的对象
         * */
        drawCatchStarting: function (catchString, type) {
            console.log('drawCatchStarting调用');
            console.log('从移动端获取的数据是');
            console.log(catchString);
            var catchData = JSON.parse(catchString);
            catchData.type = 2;
            //  如果获取的是车辆的信息,什么都不做
            if (Number(type) === 2) {
                delete catchData.startPointDistance;
                delete catchData.startPointTime;
                window.CarPoint.longitude = catchData.longitude;
                window.CarPoint.latitude = catchData.latitude;
                CarPoint = calculatePoint(CarPoint);
            } else {
                delete catchData.longitude;
                delete catchData.latitude;
            }
            //  如果获取的是站点的距离
            if (catchData.startPointDistance === undefined || CarPoint.x === undefined) {
                return;
            }


            //  乘车中的预计路线
            if (typeof window.ridingList === 'undefined' || window.ridingList === null) {
                window.ridingList = this.setRidingList([StartPoint.station_id, EndPoint.station_id], false);
            }
            this.drawNoCar();
            //  画行驶路线
            drawCanvasRoad(obtainCopy(window.ridingList), planRoadData);


            //  起点终点
            drawStation(obtainCopy(EndPoint), ImageStationEnd);
            drawCanvasTips('终点', obtainCopy(EndPoint), tipData.height, tipData.fontSize, true);
            drawStation(obtainCopy(StartPoint), ImageStationStart);

            //  小车
            //  todo
            drawCar(CarPoint);
            drawCanvasTips(catchData, obtainCopy(CarPoint), tipData.height, tipData.fontSize);
        },

        //  等待乘车
        /**
         * @carArrived:object   车辆已到达的倒计时对象
         * */
        drawCarArrived: function (carArrivedString) {
            console.log('执行drawCarArrived，从移动端取到的数据是');
            console.log(carArrivedString);
            var carArrivedData = JSON.parse(carArrivedString);
            carArrivedData.type = 3;
            //  乘车中的预计路线
            if (typeof window.ridingList === 'undefined' || window.ridingList === null) {
                window.ridingList = this.setRidingList([StartPoint.station_id, EndPoint.station_id], false);
            }
            this.drawNoCar();
            //  画行驶路线
            drawCanvasRoad(obtainCopy(window.ridingList), planRoadData);
            drawStation(obtainCopy(EndPoint), ImageStationEnd);
            drawCanvasTips('终点', obtainCopy(EndPoint), tipData.height, tipData.fontSize, true);
            drawStation(obtainCopy(StartPoint), ImageStationStart);
            //  无人车
            drawCar(obtainCopy(StartPoint));
            // console.log(CarPoint);
            drawCanvasTips(carArrivedData, obtainCopy(CarPoint), tipData.height, tipData.fontSize);
        },

        //  乘车中
        /**
         * @drivingData:object  汽车行驶状态对象
         *
         * */
        drawInTheBus: function (drivingString) {
            //  完整的待接驾路线 [1,2,3,4,5,6,7,8,9]
            // console.log(PassingStationList);
            // if (CarPoint.turn === true) {
            // var passIndex = getCanvasClosest(CarPoint, PassingStationList);
            // PassingStationList = PassingStationList.slice(passIndex);
            // }
            //  画虚线

            // drawScreen(PassingStationList, waitForRouteData);
            // console.log(PassingStationList[1], PassingStationList[0]);

            //  todo    有bug    方向判断单一
            // if (PassingStationList[1] === undefined || PassingStationList[1].id - PassingStationList[0].id > 0) {
            //     CarPoint.turn = true;
            // } else {
            //     CarPoint.turn = false;
            // }
            // console.log(PassingStationList, CarPoint);
            // if (PassingStationList.length === 1) {
            //     console.log('本次无人车运行以后再也画不出虚线了');
            // }
            console.log('执行drawInTheBus,从移动端渠道的数据是');
            console.log(drivingString);
            var drivingData = JSON.parse(drivingString);
            drivingData.type = 4;
            window.CarPoint.longitude = drivingData.longitude;
            window.CarPoint.latitude = drivingData.latitude;
            CarPoint = calculatePoint(CarPoint);
            // console.log('汽车真实经纬度', CarPoint);
            this.drawNoCar();

            //  获取行程的路径     以及无人车方向
            /**
             * carPoint:object     无人车的位置
             * @expectList:array    要经过路径的list
             * @roadList:array      路径的list
             * */
            var pathOfTravelData = getPathOfTravel(obtainCopy(CarPoint), obtainCopy(ridingList), obtainCopy(RoadList));
            // console.log('获取行程的路径     以及无人车方向', pathOfTravelData);

            //  画行驶路线
            drawCanvasRoad(pathOfTravelData, planRoadData);
            //  起点终点
            drawStation(obtainCopy(EndPoint), ImageStationEnd);
            drawCanvasTips('终点', obtainCopy(EndPoint), tipData.height, tipData.fontSize, true);
            drawStation(obtainCopy(StartPoint), ImageStationStart);

            //  小车
            //  todo
            drawCar(CarPoint);
            drawCanvasTips(drivingData, CarPoint, tipData.height, tipData.fontSize);
        },

        /**
         * 服务端推数据
         * */
        //  四角数据
        setCornerData: function (cornerData) {
            window.Corner = transformOriginData(JSON.parse(cornerData));
            // console.log(Corner);
            //  帮助完成坐标系的建立
            //  点的简写
            var bl = Corner.bottomLeft;
            var br = Corner.bottomRight;
            //  获得底边斜率k, 和b
            //  获得y
            window.bottomLineParams = getK_B(br.longitude, br.latitude, bl.longitude, bl.latitude);
            // console.log('获得y', bottomLineParams.y);
            var tl = Corner.topLeft;
            //  获得左边斜率k,和b
            //  获得x
            window.leftLineParams = getK_B(tl.longitude, tl.latitude, bl.longitude, bl.latitude);
            // console.log('获得x', leftLineParams.x);
            //  根据左下角和右下角求底边在canvas坐标系下的长度
            window.bottom_differ = br.longitude - bl.longitude;
            // console.log(bottom_differ);
            //  单位经纬度坐标系长度相当于n个像素的比例,是一个很大的数
            window.getRatio = canvas.width / bottom_differ;
            // window.left_differ = getDiffer(bl.longitude, bl.latitude, tl.longitude, tl.latitude);
            window.left_differ = tl.latitude - bl.latitude;
            // console.log(left_differ);
        },
        //  车站数据    转换数据得完成对坐标系的建立之后才能执行
        setStationList: function (stationListDataString, roadListDataString) {
            // alert( '从移动端获取的车站数据');
            // console.log('从移动端获取的车站数据');
            // console.log(stationListDataString.substr(0, 50));
            console.log('从移动端获取的路线数据');
            console.log(roadListDataString.substr(0, 50));
            var stationListData = JSON.parse(stationListDataString);
            stationListData.forEach(function (item) {
                item.longitude = item.station_long;
                item.latitude = item.station_lat;
            });
            window.StationList = calculateList(stationListData);
            // console.log(JSON.stringify(StationList).substr(0, 50));
            //  路径数据    转换数据得完成对坐标系的建立之后才能执行
            var roadListData = JSON.parse(roadListDataString).map(function (item) {
                var arr = item.split(',');
                return {
                    latitude: Number(arr[0]),
                    longitude: Number(arr[1]),
                };
            });
            window.RoadList = calculateList(roadListData);
            // console.log(JSON.stringify(RoadList).substr(0, 50));
        },

        //  乘车中的预计路线
        setRidingList: function (ridingList, isRidingBoolean) {
            console.log('执行setRidingList,这是我自己截的数据');
            console.log(ridingList);
            //  临时的list
            var list = ridingList.map(function (item) {
                return StationList.find(function (t) {
                    return Number(t.station_id) === Number(item);
                })
            });
            if (list.length === 0) {
                throw new Error('没有乘车中的预计路线');
            }
            //  获取行程的路径     以及无人车方向
            /**
             * carPoint:object     无人车的位置
             * @expectList:array    要经过路径的list
             * @roadList:array      路径的list
             * */
            var pathOfTravelData = getPathOfTravel(isRidingBoolean ? obtainCopy(CarPoint) : null, obtainCopy(list), obtainCopy(RoadList));
            console.log(pathOfTravelData);
            return pathOfTravelData;
        },


        //  仅用于计算的东西,和绘图无关
        getUserClosestStation: function (userPointString, stationListDataString) {
            var stationListData = JSON.parse(stationListDataString);
            stationListData.forEach(function (item) {
                item.longitude = item.station_long;
                item.latitude = item.station_lat;
            });
            window.StationList = calculateList(obtainCopy(stationListData));
            window.UserPoint = calculatePoint(JSON.parse(userPointString));
            //  返回给移动端最近的stationId
            this.returnClosestStationId(obtainCopy(UserPoint), obtainCopy(StationList));
        },
        //  返回给移动端最近的stationId
        returnClosestStationId: function (userPoint, stationList) {
            var MinPointIndex = getCanvasClosest(userPoint, stationList);
            if (typeof H5CallNativieUtils !== 'undefined') {
                if (typeof H5CallNativieUtils.giveBackStationId === 'function') {
                    console.log('返回给移动端station_id是' + StationList[MinPointIndex].station_id);
                    H5CallNativieUtils.giveBackStationId(StationList[MinPointIndex].station_id);
                } else {
                    throw new Error('返回给移动端station_id的时候,H5CallNativieUtils.giveBackStationId不是一个方法');
                }
            } else {
                throw new Error('返回给移动端station_id的时候,H5CallNativieUtils不存在, station_id是 ' + StationList[MinPointIndex].station_id);
            }
        },

        //  测试坐标精准度
        testCoordinatePrecision: function (styleData, testPoint) {
            // 测试四角--证明坐标系准确性
            __testCorner(bottom_differ, left_differ, bottomLineParams.k * leftLineParams.k);
            //  测试点位
            testPoint && drawCircle(calculatePoint(testPoint), styleData.radio || 10, styleData.color || 'red');
        }
    }
}());
