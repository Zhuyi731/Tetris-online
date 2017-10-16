$(function(){
    socket = io("ws://localhost:3000");
    socket.emit("checkAuth",window.location.href.split("?")[1]);
    socket.on("backAuth",function(auth){
        if(!auth){
            window.location.href = "./login.html";
        }else{//有权限登录
            
        }
    }); 

    $("#show-tip").on("click",function(){
        $(".tips").toggleClass("hide");
    }).on("mouseout",function(){
        // $(".tips").addClass("none");
    });

    var local = new Local(socket);
    var remote = new Remote(socket);
    // local.start()

});