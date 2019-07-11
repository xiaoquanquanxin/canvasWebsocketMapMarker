let timer = null;
const delay = 100;
const point = {
    x: 0,
    y: 0,
};

let index = 0;

function renderCar() {
    return
    point.x = index * 10;
    point.y = index * 10;

    mainRender();

    drawImage(imageCar, point, imageCar.width, imageCar.height);
    index++;
    timer = setTimeout(renderCar, delay);
}

timer = setTimeout(renderCar, delay);