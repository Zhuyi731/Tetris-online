var app = require("http").createServer();

var io = require("socket.io")(app);

var PORT = 3000;

app.listen(PORT);

var socketList = [];

var socketCount = 0;

var userAccount = [{
    "username":"zhuyi",
    "password":"123",
    "nickname":"zzy",
    "entered":"0",
    "auth":"0"
}];

io.on("connection", function (socket) {
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


    /**
     * 客户端断开连接
     */ 
    socket.on("disconnect",function(){
        if(socket.user){
            var index = socket.user.index;
            userAccount[index].auth = "0";
            userAccount[index].entered = "0";
            console.log(socket.user.username + " left....")
        }
    });
});
var registerLogic = function(socket){
    var mes;
    socket.on("register",function(data){
        var i = getUser(data.username);
        if(i != null){
            mes = "已经被注册了哦";
        }else{
            var user = {} ;
            user.username = data.username;
            user.password = data.password;
            user.nickname = data.nickname;
            user.auth = "0";
            user.entered = "0";
            userAccount.push(user);
            mes = "注册成功";
        }
        socket.emit("backRegister",mes);
    });
}



var loginLogic = function(socket){ //绑定登录逻辑
    socket.on("login",function(data){
        var res = {
            "auth":false,
            "username":""
        };
        for(var i = 0 ;i<userAccount.length;i++){
            if(data.username == userAccount[i].username &&data.password == userAccount[i].password){
                res.auth = true;
                res.username = userAccount[i].username;
                userAccount[i].auth = "1";
                break;
            }
        }
        socket.emit("loginBack",res);
    });

    socket.on("checkAuth",function(name){
        var index = getUser(name);
        var auth ;
        if(index != null && userAccount[index].auth == "1" && userAccount[index].entered == "0"){//说明进入游戏界面了
               userAccount[index].entered = "1";
               socket.user = userAccount[index];
               socket.user.index = index;
               socket.count = socketCount;
               socketCount ++;
               socketList.push(socket);
               auth = true;    
        }else{
              auth =  false;    
        }
        console.log(userAccount[index].username +"\n   " + auth);
        socket.emit("backAuth",auth);
    });

}

var getUser = function(name){
    var user = null;
    for(var i = 0 ;i<userAccount.length;i++){
        if(userAccount[i].username == name){
            user = userAccount[i];
            break;
        }
    }
    if(user !=null){
        return i;
    }else{
        return null;
    }
};


console.log("websocket sever is running on port: " + PORT);