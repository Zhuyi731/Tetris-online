(function (window) {

    var Local = function (socket) {
        //定时器
        var timer = null;
        //速度定义
        var speed = 2000;
        //游戏对象
        var game = new Game();
        //需要赋值的dom元素
        var doms = {
            gameDiv: $("#local_game")[0],
            nextDiv: $("#local_next")[0],
            timeDiv: $("#local_time")[0],
            scoreDiv: $("#local_score")[0],
            resultDiv: $("#local_gameOver")[0],
            weaponDiv: $("#local_weapon")[0]
        };

        var start = function () {
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
            alert("you lose!");
        };

        var move = function () {
            if (!game.move("down")) {
                var nextBlock = {
                    type: getRandom(7),
                    dir: getRandom(4)
                };
                socket.emit("next",nextBlock);
                game.nextStep(nextBlock);
               
                if (game.isGameOver()) {
                    stop();
                }
            }else{
                socket.emit("move","down");
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
                    default:
                        break;
                }
            };
        }
        bindKeyEvents();


        /**
         * 绑定socket事件
         */
        (function () {
            socket.on("waiting", function (str) {
                $("#waiting").html(str);
            });
            socket.on("start", function () {
                $("#waiting").html("");
                start();
            });

        })()


        this.start = start;
    };

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
