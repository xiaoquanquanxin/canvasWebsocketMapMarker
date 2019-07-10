//  绘制地图
function drawMap() {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}


//  绘制marker
/**
 * @point : 点 [canvas坐标系]
 * */
function drawMarker(point) {
    ctx.beginPath();
    ctx.arc(point.x, canvas.height - point.y, Radio, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = FillStyle;
    ctx.fill();
    ctx.closePath();
}


//  绘制线条
/***/
function drawLine() {

}
