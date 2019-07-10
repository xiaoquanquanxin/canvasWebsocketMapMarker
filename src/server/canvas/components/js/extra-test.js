let timer = null;

let point = {
    x: 0,
    y: 0,
};

let index = 0;

function renderCar() {
    return
    point.x = index * 10;
    point.y = index * 10;

    const width = imageCar.width / 10;
    const height = imageCar.height / 10;

    drawImage(imageCar, point, width, height);
    index++;
    timer = setTimeout(renderCar, 1000);
}

timer = setTimeout(renderCar, 1000);