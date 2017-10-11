var socket = io("ws://localhost:3000");
(function(){
    function init(){
        initEvent();
    };

    function initEvent(){
        socket.on("loginBack",function(data){
            console.log(data);
            if(data.auth == true){
                window.location.href = "./index.html?"+data.username;
            }else{
                alert("账户名或密码错误");
            }
        });

        socket.on("backRegister",function(str){
            alert(str);
            if(str == "注册成功"){
                $("#back")[0].click();
            }
        });

        $("#login").on("click", function () {
            var data = getLoginData();
            socket.emit("login",data);
        });

        $("#register").on("click",function(){
            $("#login-box").addClass("none");                        
            $("#register-box").removeClass("none");
        });
        
        $("#back").on("click",function(){
            $("#login-box").removeClass("none");                        
            $("#register-box").addClass("none");
        });

        $("#onRegister").on("click",function(){
            var data = getRegisterData();
            socket.emit("register",data);
        });
    }

    function getLoginData(){
        var data = {};
        $("#login-box").find("input").each(function(){
            data[this.name] = this.value;
        });
        console.log(data);
        return data ;
    }
    function getRegisterData(){
        var data = {};
        $("#register-box").find("input").each(function(){
            data[this.name] = this.value;
        });
        console.log(data);
        return data ;
    }

    init();
})();