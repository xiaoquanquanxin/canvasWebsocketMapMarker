let northernLatitude = Math.cos(Math.PI * (23.209017141700002 / 180));
// console.log('当前纬度下,每个经度相当于  ' + northernLatitude + '  个纬度');

//  四个角落的坐标
const corner = (function () {
    return {
        topLeft: {
            latitude: 113.5491138697,
            longitude: 23.2105553933,
        },
        topRight: {
            latitude: 113.5530728102,
            longitude: 23.2105553933,
        },
        bottomLeft: {
            latitude: 113.5491138697,
            longitude: 23.2074838205,
        },
        bottomRight: {
            latitude: 113.5530728102,
            longitude: 23.2074838205,
        },
    };
}());

//  起始点 实地青藤花园
const StartPoint = {
    latitude: 113.5499078035,
    longitude: 23.2100130661,
};


//  数据的list
const pointsList = [
    {"longitude": 23.2095115735, "latitude": 113.5511688492},
    {"longitude": 23.2092587347, "latitude": 113.5522627831},
    {"longitude": 23.2092143621, "latitude": 113.5523486137},
    {"longitude": 23.2080656005, "latitude": 113.5518175364},
    {"longitude": 23.2081050431, "latitude": 113.5515171289},
    {"longitude": 23.2083219774, "latitude": 113.5508251190},
];

//  图片配置
const imageMapSrc = './img/map4.jpg';
const imageCarSrc = './img/car.jpeg';