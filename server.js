var app = require("http").createServer();

var io = require("socket.io")(app);

var PORT = 3000;

app.listen(PORT);

var socketList = [];

var socketCount = 0;


var user = [{
    "username":"zhuyi",
    "password":"123",
    "entered":"0",
    "auth":"0"
}];

io.on("connection", function (socket) {
    socket.on("login",function(data){
        var res = {
            "auth":false,
            "username":""
        };
        for(var i = 0 ;i<user.length;i++){
            if(data.username == user[i].username &&data.password == user[i].password){
                res.auth = true;
                res.username = user[i].username;
                user[i].auth = "1";
                break;
            }
        }
        socket.emit("loginBack",res);
    });

});

console.log("websocket sever is running on port: " + PORT);