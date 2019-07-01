const express = require('express');
const app = new express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use('/public', express.static(__dirname + '/canvas/libs'));
app.use('/', function (req, res) {
    res.sendfile(__dirname + '/canvas/components/canvas.html');
});

io.on('connection', function (socket) {
    socket.emit('open', JSON.stringify(rangeData));
    //  mock数据库 的数据id
    let pointsDataIndex = 0;
    socket.on('message', function (msg) {
        console.log('服务端接收到', msg);
        switch (msg) {
            case 'manualButton':
                outputPointsData(socket, pointsDataIndex++);
                break;
            case 'autoButton':      //  自动推送全部数据
                outputPointsData(socket, pointsDataIndex++);
                let timer = setInterval(function () {
                    if (pointsDataIndex === pointsData.length) {
                        clearInterval(timer);
                        timer = null;
                        return;
                    }
                    outputPointsData(socket, pointsDataIndex++)
                }, 1000);
                break;
            default:
                return;
        }
    });


});

http.listen(4000, function () {
    console.log('listening on *:4000');
});
// app.listen(3000, function () {
// 	console.log('listen')
// });


//  地图数据
let rangeData = {
    topLeft: {
        latitude: "116%B022'51.20\"", longitude: "39%B055'24.86\"",
        longitude: "39%B055'25.72\"", latitude: "116%B022'25.29\""
    },
    topRight: {
        latitude: "116%B024'03.30\"", longitude: "39%B055'24.86\"",
        longitude: "39%B055'25.45\"", latitude: "116%B024'41.22\""

    },
    bottomLeft: {
        latitude: "116%B022'51.20\"", longitude: "39%B054'13.00\"",
        longitude: "39%B054'3.78\"", latitude: "116%B022'24.77\""

    },
    bottomRight: {
        latitude: "116%B024'03.30\"", longitude: "39%B054'13.00\"",
        longitude: "39%B054'4.64\"", latitude: "116%B024'41.39\""

    }
};


//  点位数据
let pointsData = [
    {
        longitude: "39%B054'19.97\"",
        latitude: "116%B023'29.34\"",
    }, {
        longitude: "39%B054'26.37\"",
        latitude: "116%B023'29.22\"",
    },
];

//  输出点位数据

function outputPointsData(socket, index) {
    var _data = JSON.stringify(pointsData[index]);
    socket.emit('my-custom-socket', _data);
    socket.broadcast.emit('my-custom-socket', _data);
}
