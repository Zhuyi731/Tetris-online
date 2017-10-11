(function (window) {

    var Local = function () {
        //定时器
        var timer = null;
        //速度定义
        var speed = 400;
        //游戏对象
        var game = new Game();
        //需要赋值的dom元素
        var doms = {
            gameDiv: $("#local_game")[0],
            nextDiv: $("#local_next")[0],
            timeDiv: $("#local_time")[0],
            scoreDiv: $("#local_score")[0],
            resultDiv: $("#local_gameOver")[0]
        };

        var start = function () {
            timer = setInterval(move,speed);
            game.init(doms);
        };
        var stop = function(){
         debugger;
            clearInterval(timer);
            document.onkeydown = null;
            alert("you lose!");
        }
        var move = function(){

            if(game.move("down")){

            }else{
                if(game.isGameOver()){
                    stop();
                }
            }

        }

        function bindKeyEvents() {
            document.onkeydown = function (e) {
                var keyCode = e.keyCode || e.which;
                switch (keyCode) {
                    case 38:// up
                        game.move("up");
                        break;
                    case 39://right
                        game.move("right");
                        break;
                    case 40://down
                        game.move("down");
                        break;
                    case 37: //left
                        game.move("left");
                        break;
                    case 32: //space
                      game.move("space");    
                      break;
                    default:
                        break;
                }
    
            };
        }
        bindKeyEvents();
        
        this.start = start;
    };

   

    //export to window
    window.Local = Local;

})(window);
