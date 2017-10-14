(function (window) {
    var Remote = function () {
        //游戏对象
        var game = new Game();
        //需要赋值的dom元素
        var doms = {
            gameDiv: $("#remote_game")[0],
            nextDiv: $("#remote_next")[0],
            timeDiv: $("#remote_time")[0],
            scoreDiv: $("#remote_score")[0],
            resultDiv: $("#remote_gameOver")[0],
            weaponDiv: $("#remote_weapon")[0]
        };

        var start = function (data) {
            game.init(doms, data.curBlock, data.nextBlock);
            
        };
        var stop = function () {
            game.clearTimer();
        };
     
        (function () {
            socket.on("gameOver",function(Win){
                game.clearTimer();
            });
            socket.on("init", function (data) {
                console.log("get init event");
                start(data);
            });

            socket.on("move", function (order) {
                game.move(order);
            });

            socket.on("next",function(nextBlock){
                game.done();
                game.nextStep(nextBlock);
            });

            socket.on("down",function(){
                game.move("down");
            });

            socket.on("weaponData",function(data){
                game.setWeaponData(data);
            });
          
        })();


        this.start = start;
    };



    //export to window
    window.Remote = Remote;

})(window);
