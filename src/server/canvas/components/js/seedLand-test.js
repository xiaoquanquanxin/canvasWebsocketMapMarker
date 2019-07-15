let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

//  分辨率
const ratio = getPixelRatio(ctx);
// console.log('ratio', ratio);
canvas.width = window.innerWidth * ratio;
canvas.style.width = canvas.width / ratio + 'px';

//  转换全部数据 就是 * northernLatitude
const _corner = transformOriginData(corner);
//  点的简写
let bl = _corner.bottomLeft;
let br = _corner.bottomRight;
//  获得底边斜率k, 和b
let bottomLineParams = getK_B(br.latitude, br.longitude, bl.latitude, bl.longitude);
// console.log('底边k,b对象', bottomLineParams);
let tl = _corner.topLeft;

//  获得左边斜率k,和b
let leftLineParams = getK_B(tl.latitude, tl.longitude, bl.latitude, bl.longitude);
// console.log('左边k,b对象', leftLineParams);


//  根据左下角和右下角求底边在canvas坐标系下的长度
let bottom_differ = getDiffer(bl.latitude, bl.longitude, br.latitude, br.longitude);
//  单位经纬度坐标系长度相当于n个像素的比例,是一个很大的数
let getRatio = canvas.width / bottom_differ;
let left_differ = getDiffer(bl.latitude, bl.longitude, tl.latitude, tl.longitude);

//  主背景图
ImageMap.onload = function () {
    imgRatio = this.width / window.innerWidth / ratio;
    console.log('imgRatio', imgRatio);

    //  载入图标图片
    loadIconImage();
    canvas.height = window.innerWidth * this.height / this.width * ratio;
    canvas.style.height = canvas.height / ratio + 'px';
    setTimeout(function () {
        mainRender();
    }, 100);
};
//  设置地图src
ImageMap.src = ImageMap._src;


//  载入图标图片
function loadIconImage() {

//  设置小车src
    ImageCar.src = ImageCar._src;

//  设置站点图片src
    ImageStationBasic.src = ImageStationBasic._src;


//  设置站点图片src
    ImageStationStart.src = ImageStationStart._src;


//  设置站点图片src
    ImageStationEnd.src = ImageStationEnd._src;


//  用户图片
    ImageUser.src = ImageUser._src;

}


//  小车图片
ImageCar.onload = iconImageLoad;
//  站点图片
ImageStationBasic.onload = iconImageLoad;
//  站点图片
ImageStationStart.onload = iconImageLoad;
//  站点图片
ImageStationEnd.onload = iconImageLoad;
//  用户图片
ImageUser.onload = iconImageLoad;

//  载入图标图片的时候
function iconImageLoad() {
    this.width /= imgRatio;
    this.height /= imgRatio;
    // console.log(this.src.substr(-20), this.width, this.height);
}


//  主绘制
//  封装了绘制路线和地图
function mainRender() {

    //  排队的对象
    const WaitingData = {
        type: 1,
        remainingTime: '00:00:32',           //  剩余时间
        numberOfPeople: 2,          //  排队人数
    };
    //  等待排队
    drawQueueUp(WaitingData);
    return
    //  开始接驾的对象
    const CatchData = {
        type: 2,
        startPointDistance: 13,            //  剩余距离，米
        startPointTime: '00:10:02',         //  剩余时间
    };
    // drawCatchStarting(CatchData);
    // return

    //  等待乘车
    const CarArrivedData = {
        type: 3,
        countDown: '00:00:03',              //  倒计时
    };
    // drawCarArrived(CarArrivedData);
    // return;


    //  乘车中
    const drivingData = {
        type: 4,
        fromTheEnd: 1221,                   //  距离终点
        estimatedTime: '00:00:13',          //  预计时间
    };
    drawInTheBus(drivingData);


}