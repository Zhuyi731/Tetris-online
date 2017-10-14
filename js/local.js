(function (window) {

    var Local = function (socket) {
        //定时器
        var timer = null;
        //速度定义
        var NORMALDOWNSPEED = 600;
        var speed = NORMALDOWNSPEED;
        //是否产生异形方块
        var isUgly = 0;
        //游戏对象
        var game = new Game();
        //需要赋值的dom元素
        var doms = {
            gameDiv: $("#local_game")[0],
            nextDiv: $("#local_next")[0],
            timeDiv: $("#local_time")[0],
            scoreDiv: $("#local_score")[0],
            resultDiv: $("#local_gameOver")[0],
            weaponDiv: $("#local_weapon")[0],
            arrowDiv:$("#local_arrow")[0],
            twinkleDiv:$("#local_twinkle_line")[0]
        };
        /**
         * 本地区域开始游戏
         */
        var start = function () {
            bindKeyEvents();
            var curBlock = {
                type: getRandom(7),
                dir: getRandom(4)
            };
            var nextBlock = {
                type: getRandom(7),
                dir: getRandom(4)
            };
            socket.emit("init", { curBlock: curBlock, nextBlock: nextBlock });
            game.init(doms, curBlock, nextBlock);
            timer = setInterval(move, speed);
        };

        var stop = function () {
            clearInterval(timer);
            document.onkeydown = null;
        };

        var move = function () {
            if (!game.move("down")) {
                var nextBlock = {
                    type: getRandom(7),
                    dir: getRandom(4)
                };
                if (getRandom(100) >= 30) {
                    nextBlock.type = 11;
                }
                if(isUgly){
                    nextBlock.type = getRandom(5)+7;
                    isUgly --;
                }
                var weaponData = game.getWeaponData();
                socket.emit("weaponData", weaponData);
                socket.emit("next", nextBlock);
                game.nextStep(nextBlock);

                if (game.isGameOver()) {
                    socket.emit("gameOver");
                    game.clearTimer();
                    stop();
                }
            } else {
                socket.emit("move", "down");
            }
        };

        function bindKeyEvents() {
            document.onkeydown = function (e) {
                var keyCode = e.keyCode || e.which;
                switch (keyCode) {
                    case 38:// up
                        socket.emit("move", "up");
                        game.move("up");
                        break;
                    case 39://right
                        socket.emit("move", "right");
                        game.move("right");
                        break;
                    case 40://down
                        socket.emit("move", "down");
                        game.move("down");
                        break;
                    case 37: //left
                        socket.emit("move", "left");
                        game.move("left");
                        break;
                    case 32: //space
                        socket.emit("move", "space");
                        game.move("space");
                        break;
                    case 81://Q
                        socket.emit("useWeapon", "0");
                        game.useWeapon(0);
                        bomb();
                        break;
                    case 87://W
                        socket.emit("useWeapon", "1");
                        game.useWeapon(1);
                        blackCover("remote");
                        break;
                    case 69://E
                        socket.emit("useWeapon", "2");
                        game.useWeapon(2);
                        break;
                    case 82://R
                        socket.emit("useWeapon", "3");
                        game.useWeapon(3);
                        break;
                    case 84://T
                        socket.emit("useWeapon", "4");
                        game.useWeapon(4);
                        break;
                    default:
                        break;
                }
            };
        }

        /**
         * 绑定socket事件
         */
      
            socket.on("waiting", function (str) {
                $("#waiting").html(str);
            });
            socket.on("start", function () {
                $("#waiting").html("");
                start();
            });
            socket.on("gameOver", function (Win) {
                console.log("gameOver " + Win);
                if (!Win) {
                    $("#local_gameOver").html("You Lose!!!");
                    $("#remote_gameOver").html("You Win!!!");
                } else {
                    $("#local_gameOver").html("You Win!!!");
                    $("#remote_gameOver").html("You Lose!!!");
                }
                game.clearTimer();
                stop();
            });

            socket.on("useWeapon", function (type) { //说明被攻击了
                switch (type) {
                    case "0":
                    break;
                    case "1":
                        blackCover("local");
                        break;
                    case "2":
                        pause();
                        break;
                    case "3":
                        accelerate();
                        break;
                    case "4":
                        ugly();
                        break;
                    default:
                        break;
                }
            });

        /**
         * 炸弹道具互动
         */    
        var bomb = function(){
            var selectIndex = game.selectAnimate();
            var lineData = game.deleteLine(selectIndex);
            socket.emit("deleteLine",selectIndex);
            socket.emit("addLine",lineData); 
        };
            
        /**
         * 黑幕道具互动
         * @prama{*local|remote 表示黑幕生成的位置}position
         *  OPACITYTOP OPACITYDOWN 黑幕透明度上下限
         * opacity 透明度
         * coverDiv Dom
         * coverTime 覆盖时间  可叠加
         * coverTimer 计时器
         */
        var OPACITYTOP = 1.0;
        var OPACITYDOWN = 0.85;
        var MOVETOP = 320;
        var MOVEDOWN = 180;
        var WEAPONTIME = 6000;
        var opacity = {
            local: 0.8,
            remote: 0.8
        };
        var opacityDir = -0.005;
        var coverDiv = {
            local: $(".black-cover-local"),
            remote: $(".black-cover-remote")
        }
        var coverTime = {
            local: 0,
            remote: 0
        }
        var coverTimer = {
            local: null,
            remote: null
        }
       var  blackCover =  function(position) {
            coverDiv[position].removeClass("hide");
            var top;
            var dir = -5;
            if (coverTime[position] != 0) {
                coverTime[position] += WEAPONTIME;
                return;
            }
            coverTime[position] += WEAPONTIME;
            coverTimer[position] = setInterval(function () {
                changeTop(coverDiv[position]);
                changeOpacity(position);
                coverTime[position] -= 50;
                if (coverTime[position] == 0) {
                    clearInterval(coverTimer[position]);
                    coverDiv[position].addClass("hide");
                }
            }, 50);

            function changeOpacity(opa) {
                var cover = coverDiv[opa];
                opacity[opa] = parseFloat(opacity[opa]) + opacityDir;
                if (opacity[opa] < OPACITYDOWN) {
                    opacityDir = 0.005;
                }
                if (opacity[opa] > OPACITYTOP) {
                    opacityDir = -0.005;
                }
                cover.css("opacity", opacity[opa]);
            }

            function changeTop(cover) {
                top = parseInt(cover.css("top").split("px")[0]) + dir;
                if (top >= MOVEDOWN && top <= MOVETOP) {
                    cover.css("top", top + "px");
                } else if (top < MOVEDOWN) {
                    dir = 5;
                } else {
                    dir = -5;
                }
            }
        }

        /**
         * 静止道具互动
         * PAUSETIME 静止时间
         * lefttime 剩余的时间
         */
        var PAUSETIME = 6000;
        var leftTime2;
        var pause = function () {
            if (leftTime2 > 0) {
                leftTime2 += PAUSETIME;
                return;
            }
            leftTime2 = PAUSETIME;
            clearInterval(timer);
            var tempTimer = setInterval(function () {
                leftTime2 -= 50;
                if (leftTime2 == 0) {
                    timer = setInterval(move, speed);
                    clearInterval(tempTimer);
                }
            }, 50);
        };

        /**
         * 加速互动
         * SPEEDUPTIME 加速道具持续时间
         * DOWNSPEED 下降速度
         * leftTime3 剩余加速时间
         */
        var SPEEDUPTIME = 3000;
        var leftTime3;
        var DOWNSPEED = 100;
        var accelerate = function () {
            if (leftTime3 > 0) {
                leftTime3 += SPEEDUPTIME;
                return;
            }
            leftTime3 = SPEEDUPTIME;
            speed = DOWNSPEED;
            clearInterval(timer);
            timer = setInterval(move, speed);
            var tempTimer = setInterval(function () {
                leftTime3 -= 50;
                if (leftTime3 == 0) {
                    speed = NORMALDOWNSPEED;
                    clearInterval(timer);
                    timer = setInterval(move, speed);
                    clearInterval(tempTimer);
                }
            }, 50);
        };

        /**
         * 异形道具互动
         */
        var ugly = function (){
            isUgly ++;
        };


        this.start = start;
        window.selectAnimate = game.selectAnimate;


    };  //end of Local


    /**
     * 
     * @param {*} up 
     * 返回 [0,up) 的随机整数
     */
    function getRandom(up) {
        //parseInt  是为了解决 -0 的情况
        return parseInt(Math.ceil(Math.random() * up - 1));
    }

    //export to window
    window.Local = Local;
    window.getRandom = getRandom;

})(window);
