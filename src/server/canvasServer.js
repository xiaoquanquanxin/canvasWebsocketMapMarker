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
        longitude: "39%B055'25.72\"", latitude: "116%B022'25.29\""
    },
    topRight: {
        longitude: "39%B055'25.45\"", latitude: "116%B024'41.22\""

    },
    bottomLeft: {
        longitude: "39%B054'3.78\"", latitude: "116%B022'24.77\""

    },
    bottomRight: {
        longitude: "39%B054'4.64\"", latitude: "116%B024'41.39\""

    }
};


//  点位数据
let pointsData = [
    {
        longitude: "39%B054'19.61\"",
        latitude: "116%B023'29.06\"",
    }, {
        longitude: "39%B054'26.49\"",
        latitude: "116%B023'28.79\"",
    },
];

//  输出点位数据

function outputPointsData(socket, index) {
    let _data = JSON.stringify(pointsData[index]);
    if (_data === undefined) {
        return
    }
    socket.emit('my-custom-socket', _data);
    socket.broadcast.emit('my-custom-socket', _data);
    console.log('推送数据', _data);
}
