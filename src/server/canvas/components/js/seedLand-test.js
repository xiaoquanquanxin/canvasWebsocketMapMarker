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
    canvas.height = window.innerWidth * this.height / this.width * ratio;
    canvas.style.height = canvas.height / ratio + 'px';
    setTimeout(function () {
        mainRender();
    }, 100)

};
//  设置地图src
ImageMap.src = ImageMap._src;

//  小车图片
ImageCar.onload = function () {
    // console.log(this);
    this.width = this.width / 10;
    this.height = this.height / 10;
};
//  设置小车src
ImageCar.src = ImageCar._src;

//  站点图片
ImageStation.onload = function () {
    this.width = this.width / 10;
    this.height = this.height / 10;
};
//  设置站点图片src
ImageStation.src = ImageStation._src;





