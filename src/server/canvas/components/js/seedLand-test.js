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


let image = new Image();
image.onload = function () {
    canvas.height = window.innerWidth * this.height / this.width * ratio;
    canvas.style.height = canvas.height / ratio + 'px';
    drawMap();
    (function () {
        return
        // 测试四角--证明坐标系准确性
        __testCorner(bottom_differ, left_differ, bottomLineParams.k * leftLineParams.k)
    }());
    // console.clear();


    pointsList.forEach(function (item, index) {
        //  绘制某个实际的点位
        let __point = calculatePoint(item);
        //  绘制某个点
        drawMarker(__point);
    })
};
image.src = '../libs/img/map4.jpg';


