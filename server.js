var app = require("http").createServer();

var io = require("socket.io")(app);

var PORT = 3000;

app.listen(PORT);

var socketList = [];

var socketCount = 0;

var userAccount = [{
    "username": "zhuyi",
    "password": "123",
    "nickname": "zzy",
    "entered": "0",
    "auth": "0"
}, {
    "username": "123",
    "password": "123",
    "nickname": "z12y",
    "entered": "0",
    "auth": "0"
}, {
    "username": "admin",
    "password": "123",
    "nickname": "zz555y",
    "entered": "0",
    "auth": "0"
}];


io.on("connection", function (socket) {
    socket.on("addLine", function (lineData) {
        var data = {};
        data.lineData = lineData;
        if (socket.count % 2 == 0) {
            data.flag = "local";
            if (socketList[socket.count + 1]) {
                socketList[socket.count + 1].emit("addLine", data);
            }
            data.flag = "remote";

            if (socketList[socket.count]) {
                socketList[socket.count].emit("addLine", data);
            }
        } else {
            data.flag = "local";
            if (socketList[socket.count - 1]) {
                socketList[socket.count - 1].emit("addLine", data);
            }
            data.flag = "remote";
            if (socketList[socket.count]) {
                socketList[socket.count].emit("addLine", data);
            }
        }
    });
    socket.on("gameOver", function (lineData) {
        if (socket.count % 2 == 0) {
            if (socketList[socket.count + 1]) {
                socketList[socket.count + 1].emit("gameOver", true);
            }
            if (socketList[socket.count]) {
                socketList[socket.count].emit("gameOver", false);
            }
        } else {
            if (socketList[socket.count - 1]) {
                socketList[socket.count - 1].emit("gameOver", true);
            }
            if (socketList[socket.count]) {
                socketList[socket.count].emit("gameOver", false);
            }
        }
    });

    /**
     * 绑定登录事件
     */
    loginLogic(socket);
    /**
     * 绑定注册事件
     */
    registerLogic(socket);
    /**
     * 绑定转发事件
     */
    bindEvents(socket);

    /**
     * 客户端断开连接
     */
    socket.on("disconnect", function () {
        if (socket.user) {
            var index = socket.user.index;
            userAccount[index].entered = "0";
            setTimeout(function () {
                userAccount[index].auth = "0";
                console.log("clear user login data");
            }, 1000000);
            if (socket.count % 2 == 0) {
                if (socketList[socket.count + 1]) {
                    socketList[socket.count + 1].emit("playerLeft");
                    socketList[socket.count + 1].emit("gameOver", true);
                }
            } else {
                if (socketList[socket.count - 1]) {
                    socketList[socket.count - 1].emit("playerLeft");
                    socketList[socket.count - 1].emit("gameOver", true);
                }
            }
            console.log(socket.user.username + " left....");
        }
    });
});

/** 
 * 
 * 
 * 
*/
var bindEvents = function (socket) {

    socket.on("checkAuth", function (name) {
        var index = getUser(name);
        var auth;
        if (index != null && userAccount[index].auth == "1" && userAccount[index].entered == "0") {//说明进入游戏界面了
            userAccount[index].entered = "1";
            socket.user = userAccount[index];
            socket.user.index = index;
            socket.count = socketCount;
            socketList.push(socket);
            socketCount++;
            if (socket.count % 2 == 0) {
                socket.emit("waiting", "waiting for another player ......");
            } else {
                var data = {
                    local: socket.user.nickname,
                    remote: socketList[socket.count - 1].user.nickname
                }
                console.log(socketCount + " " + socketList.length + " " + data.local + " " + data.remote);
                socket.emit("start", data);
                data.local = socketList[socket.count - 1].user.nickname;
                data.remote = socket.user.nickname;
                console.log(data.local + " " + data.remote);
                socketList[socket.count - 1].emit("start", data);
            }
            auth = true;
            console.log(userAccount[index].username + "\n   " + auth);
        } else {
            auth = false;
        }
        socket.emit("backAuth", auth);
    });

    transport("init", socket);
    transport("next", socket);
    transport("move", socket);
    transport("weaponData", socket);
    transport("useWeapon", socket);
    transport("deleteLine", socket);
    transport("message", socket);
    transport("weaponMessage", socket);
};

/**
 * 
 * @param {*事件类型} type 
 * @param {*当前客户端} socket
 * 向对应的另一个客户端转发事件 
 */
function transport(type, socket) {
    socket.on(type, function (data) {
        //  console.log("transport "+type+" event");
        // console.log(socket.count +" " + socketList.length);
        if (type == "useWeapon") {
            console.log(data);
        }
        if (socket.count % 2 == 0) {
            if (socketList[socket.count + 1]) {
                socketList[socket.count + 1].emit(type, data);
            }
        } else {
            if (socketList[socket.count - 1]) {
                socketList[socket.count - 1].emit(type, data);
            }
        }
    });
}

/**
 * 
 * @param {*客户端} socket 
 */
var registerLogic = function (socket) {
    var mes;
    socket.on("register", function (data) {
        var i = getUser(data.username);
        if (i != null) {
            mes = "已经被注册了哦";
        } else {
            var user = {};
            user.username = data.username;
            user.password = data.password;
            user.nickname = data.nickname;
            user.auth = "0";
            user.entered = "0";
            userAccount.push(user);
            mes = "注册成功";
        }
        socket.emit("backRegister", mes);
    });
}

/**
 * 
 * @param {*当前客户端} socket
 *  绑定登录逻辑
 */
var loginLogic = function (socket) {
    socket.on("login", function (data) {
        console.log(data.username + " " + data.password);
        var res = {
            "auth": false,
            "username": ""
        };
        for (var i = 0; i < userAccount.length; i++) {
            console.log("userAccount[" + i + "].username=" + userAccount[i].username);
            console.log("userAccount[" + i + "].password=" + userAccount[i].password);

            if (data.username == userAccount[i].username && data.password == userAccount[i].password) {
                res.auth = true;
                res.username = userAccount[i].username;
                userAccount[i].auth = "1";
                break;
            }
        }
        socket.emit("loginBack", res);
    });
}

var getUser = function (name) {
    var user = null;
    for (var i = 0; i < userAccount.length; i++) {
        if (userAccount[i].username == name) {
            user = userAccount[i];
            break;
        }
    }
    if (user != null) {
        return i;
    } else {
        return null;
    }
};

console.log("websocket sever is running on port: " + PORT);