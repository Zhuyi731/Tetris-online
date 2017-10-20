(function (window) {

    var Local = function (socket) {
        //定时器
        var timer = null;
        //速度定义
        var NORMALDOWNSPEED = 500;
        var speed = NORMALDOWNSPEED;
        //武器名字
        var weaponNames = ["消行炸弹", "黑幕", "时间静止", "时间加速", "异形方块"];
        //是否需要addLine
        var addLineFlag = true;
        //是否产生异形方块
        var isUgly = 0;
        //昵称
        var nickName = {
            local: null,
            remote: null
        };
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
            arrowDiv: $("#local_arrow")[0],
            twinkleDiv: $("#local_twinkle_line")[0]
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
                if (getRandom(100) >= 92) {
                    nextBlock.type = 11;
                }
                if (isUgly) {
                    nextBlock.type = getRandom(5) + 7;
                    isUgly--;
                }
                var dataTemp = game.scoreGetWeapon();
                if(dataTemp[0].index != -1){
                    message("到达"+dataTemp[0].score+"分，获得了额外道具"+weaponNames[dataTemp[0].index],"getWeapon");
                }
                if(dataTemp[1].index !=-1){
                    message("增加100分，获得道具"+weaponNames[dataTemp[1].index],"getWeapon");
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

        (function () {//绑定输入框事件
            $("#messageInput").on("focus", function () {
                document.onkeydown = function (e) {
                    var keyCode = e.keyCode || e.which;
                    switch (keyCode) {
                        case 13://enter
                            $("#sendMessage").click();
                            break;
                        default:
                            break;
                    }
                };
            });
            $("#messageInput").on("blur", function () {
                bindKeyEvents();
            });
            $("#sendMessage").on("click", function () {
                var text = $("#messageInput").val();
                message(text + " ", "message");
                $("#messageInput").val("");
            });
        })();
        var messageCount = 0;
        var scrollTop = 0;
        /**
         * 在输入框体中append一个div
         * @param {*消息信息} text 
         * @param {*消息类型} type 
         * @param {*其他参数} other 
         */
        var message = function (text, type, other) {
            var addScrollTop = 21;
            switch (type) {
                case "enter":
                    $("#game-message").append("<p class='message-div'>" + text + "</p>");
                    break;
                case "getWeapon":
                    $("#game-message").append("<p class='message-div'>" + text + "</p>");
                    break;
                case "message":
                    $("#game-message").append("<p class='message-div'><span class='you-say'>你说:</span>" + text + "</p>");
                    socket.emit("message", text);
                    break;
                case "weapon":
                    var str = "<span class='you-say'>你</span> 对 <span class='he-say'>" + nickName.remote +
                        "</span>使用了道具<span class='use-weapon" + other + "'>" + weaponNames[other] + "</span>";
                    if (other == 0) {
                        str += ",<span class='he-say'>" +
                            nickName.remote + "</span>被你炸懵了!";
                        addScrollTop = 41;
                    } else if (other == 1) {
                        str += ",眼前的黑不是黑,你说的白是什么白.";
                        addScrollTop = 41;
                    } else if (other == 2) {
                        str += "......";
                    } else if (other == 3) {
                        str += "";
                    } else if (other == 4) {
                        str += "";
                    } else {

                    }
                    $("#game-message").append("<p class='message-div'>" + str + "</p>");
                    break;
                default:
                    break;
            }
            messageCount++;
            if (messageCount > 9) {
                scrollTop += addScrollTop;
                $("#game-message").scrollTop(scrollTop);
            }
        };
        /**
         * 接受信息 参数同message
         * @param {*} text 
         * @param {*} type 
         * @param {*} other 
         */
        var recvMessage = function (text, type, other) {
            var addScrollTop = 21;
            switch (type) {
                case "enter":
                    $("#game-message").append("<p class='message-div'>" + text + "</p>");
                    break;
                case "message":
                    $("#game-message").append("<p class='message-div'><span class='he-say'>" + nickName.remote + "说:</span>" + text + "</p>");
                    break;
                case "weapon":
                    var str = "<span class='he-say'>" + nickName.local + "</span> 对 <span class='you-say'>你</span>使用了道具<span class='use-weapon" +
                        other + "'>" + weaponNames[other] + "</span>";
                    if (other == 0) {
                        str += ",<span class='he-say'>" +
                            nickName.remote + "</span>你被炸懵了!";
                        addScrollTop = 41;
                    } else if (other == 1) {
                        str += ",眼前的黑不是黑,你说的白是什么白.";
                        addScrollTop = 41;
                    } else if (other == 2) {
                        str += "......";
                    } else if (other == 3) {
                        str += "";
                    } else if (other == 4) {
                        str += "";
                    } else {

                    }
                    $("#game-message").append("<p class='message-div'>" + str + "</p>");
                    break;
                case "gameOver":
                     $("#game-message").append("<p class='message-div'>" + text + "</p>");
                     addScrollTop = 41;
                default:
                    break;
            }
            messageCount++;
            if (messageCount > 9) {
                scrollTop += addScrollTop;
                $("#game-message").scrollTop(scrollTop);
            }
        }
        /**
         * 绑定按键事件
         */
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
                        bomb();
                        break;
                    case 87://W
                        if (game.useWeapon(1)) {
                            socket.emit("useWeapon", "1");
                            message("", "weapon", 1);
                            blackCover("remote");
                        } else {
                            messeage("", "weaponLack", 1);
                        }
                        break;
                    case 69://E
                        if (game.useWeapon(2)) {
                            socket.emit("useWeapon", "2");

                            message("", "weapon", 2);
                        } else {
                            messeage("", "weaponLack", 2);
                        }
                        break;
                    case 82://R
                        if (game.useWeapon(3)) {
                            socket.emit("useWeapon", "3");
                            message("", "weapon", 3);
                        } else {
                            messeage("", "weaponLack", 3);
                        }
                        break;
                    case 84://T
                        if (game.useWeapon(4)) {
                            socket.emit("useWeapon", "4");
                            message("", "weapon", 4);
                        } else {
                            message("", "weaponLack", "4");
                        }
                        break;
                    default:
                        break;
                }
            };
        }

        /**
         * 绑定socket事件
         */
        socket.on("playerLeft",function(){
            recvMessage("你的对手<span class = 'you-say'> "+nickName.remote+"</span> 离开了游戏，你赢了！","gameOver");
        });
        socket.on("message", function (str) {
            recvMessage(str, "message");
        });
        socket.on("waiting", function (str) {
            $("#waiting").html(str);
        });
        socket.on("start", function (nicknameData) {
            $("#waiting").html("");
            nickName = nicknameData;
            $("#local-player").html(nickName.local);
            $("#remote-player").html(nickName.remote);
            message("玩家<span class='player'> " + nickName.local + " </span>加入了游戏!", "enter");
            message("玩家<span class='player'> " + nickName.remote + " </span>加入了游戏!", "enter");
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
                    recvMessage("", "weapon", 0);
                    break;
                case "1":
                    blackCover("local");
                    recvMessage("", "weapon", 1);
                    break;
                case "2":
                    pause();
                    recvMessage("", "weapon", 2);
                    break;
                case "3":
                    accelerate();
                    recvMessage("", "weapon", 3);
                    break;
                case "4":
                    ugly();
                    recvMessage("", "weapon", 4);
                    break;
                default:
                    break;
            }
        });

        socket.on("addLine", function (data) {
            if (data.flag == "local") {
                game.addLine(data.lineData);
            }
        });

        /**
         * 炸弹道具互动
         */
        var bomb = function () {
            var topHeight = game.getHeight();
            if (topHeight != null) {
                topHeight = topHeight / 20 + 1;
                var selectIndex = ((getRandom(20) + topHeight) % topHeight);
                socket.emit("deleteLine", selectIndex);
                game.selectAnimate(selectIndex);
                addLineFlag = false;
                var lineData = game.getLineData(19 - selectIndex);
                var tempTimer = setInterval(function () {
                    if (game.canAddLine()) {
                        socket.emit("addLine", lineData);
                        clearInterval(tempTimer);
                    }
                }, 50);
                message("", "weapon", 0);
                socket.emit("useWeapon", "0");
                game.useWeapon(0);
            } else {

            }
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
        var blackCover = function (position) {
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
        var ugly = function () {
            isUgly++;
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
