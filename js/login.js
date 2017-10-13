var socket = io("ws://localhost:3000");
(function(){
    function init(){
        initEvent();
    };

    function initEvent(){
        document.onkeydown = function(e){
            console.log(e.keycode||e.which);
            var keyCode = e.keycode || e.which;
            if(keyCode == 13){
                if($("#login-box").attr("class").indexOf("none") == -1){
                    $("#login").click();
                }else{
                    $("#onRegister").click();
                }
            }
        };


        socket.on("loginBack",function(data){
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
            data && socket.emit("login",data);
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
            data && socket.emit("register",data);
        });
    }

    function getLoginData(){
        var data = {};
        $("#login-box").find("input").each(function(){
            data[this.name] = this.value;
        });
        if(data.username == "" || data.password == ""){
            alert("账户名或密码不能为空");
            return null;
        }
        console.log(data);
        return data ;
    }

    function getRegisterData(){
        var data = {};
        $("#register-box").find("input").each(function(){
            data[this.name] = this.value;
        });
        if(data.username == "" || data.password == "" ||data.nickname == ""){
            alert("请将信息填写完整");
            return null;
        }
        return data ;
    }

    init();
})();