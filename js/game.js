var Game = function () {
    //游戏区域
    var doms = {
        gameDiv: null,
        nextDiv: null,
        timeDiv: null,
        scoreDiv: null,
        weaponDiv: null,
        arrowDiv: null,
        twinkleDiv: null
    };
    //当前方块码的高度
    var topHeight;
    var downHeight = 0;
    //score
    var score = 0;
    //游戏结束标志
    var gameOver = false;
    //是否增加行 标志
    var addLineFlag = false;
    //游戏道具
    var weapons = [
        {
            "name": "消行炸弹",
            "count": 3
        }, {
            "name": "黑幕",
            "count": 3
        }, {
            "name": "时间静止",
            "count": 3
        }, {
            "name": "时间加速",
            "count": 3
        }, {
            "name": "异形方块",
            "count": 2
        }
    ];
    //游戏数据
    var nextData = [
        [2, 2, 0, 0],
        [0, 2, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    var gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    //DOM节点数据
    var gameDoms = [];
    var nextDoms = [];
    //方块数据
    var cur, next;
    //计时的计数器
    var timer = null;
    var time = 0;
    /**
     * 
     * @param {*DOM元素} gameDom 
     */
    var init = function (gameDom, curBlock, nextBlock) {
        timer = setInterval(countTime, 1000);

        doms = gameDom;
        var fg = fg1 = document.createDocumentFragment();
        var divList;
        for (var i = 0; i < gameData.length; i++) {
            fg1 = document.createDocumentFragment();
            divList = [];
            for (var j = 0; j < gameData[0].length; j++) {
                var div = document.createElement("div");
                div.style.top = i * 20 + "px";
                div.style.left = j * 20 + "px";
                fg1.appendChild(div);
                divList.push(div);
            }
            fg.appendChild(fg1);
            gameDoms.push(divList);
        }
        doms.gameDiv.appendChild(fg);

        for (var i = 0; i < nextData.length; i++) {
            fg1 = document.createDocumentFragment();
            var divList = [];
            for (var j = 0; j < nextData[0].length; j++) {
                var div = document.createElement("div");
                div.style.top = i * 20 + "px";
                div.style.left = j * 20 + "px";
                fg1.appendChild(div);
                divList.push(div);
            }
            fg.appendChild(fg1);
            nextDoms.push(divList);
        }
        doms.nextDiv.appendChild(fg);

        cur = new Square(curBlock.type, curBlock.dir);
        next = new Square(nextBlock.type, nextBlock.dir);

        nextData = next.data[next.dir];
        setBlockData();
        refresh(nextDoms, nextData);
        refresh(gameDoms, gameData);
        refreshWeapon();
    };

    var countTime = function () {
        time++;
        doms.timeDiv.innerHTML = time;
    };


    /**
     * 将当前下落的模块赋值进入gameData
     */
    var setBlockData = function () {
        for (var i = 0; i < cur.data[cur.dir].length; i++) {
            for (var j = 0; j < cur.data[cur.dir][0].length; j++) {
                checkPoint(i, j, cur) && (gameData[cur.pos.x + i][cur.pos.y + j] = cur.data[cur.dir][i][j]);
            }
        }
    };
    /**
     * 清除上一个模块的数据
     */
    var clearBlockData = function () {
        for (var i = 0; i < cur.data[cur.dir].length; i++) {
            for (var j = 0; j < cur.data[cur.dir][0].length; j++) {
                checkPoint(i, j, cur) && (gameData[cur.pos.x + i][cur.pos.y + j] = 0);
            }
        }
    };
    /**
     * 
     * @param {*对应的DOM节点数组} doms 
     * @param {*对应的数据矩阵} data 
     */
    var refresh = function (doms, data) {//刷新对应的区域
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] == 0) {
                    doms[i][j].className = "none";
                } else if (data[i][j] == 1) {
                    doms[i][j].className = "done";
                } else if (data[i][j] == 2) {
                    doms[i][j].className = "current";
                } else {
                    doms[i][j].className = "special";
                }
            }
        }
    };
    /**
       * 
       * @param {*gameData的i} i 
       * @param {*gameData的j} j 
       */
    var checkPoint = function (i, j, block) {
        if (block.pos.x + i >= gameData.length || block.pos.x + i < 0
            || block.pos.y + j >= gameData[0].length || block.pos.y + j < 0
            || gameData[block.pos.x + i][block.pos.y + j] == 1 || gameData[block.pos.x + i][block.pos.y + j] == 4) {
            return false;
        } else {
            return true;
        }
    };
    /**
     * 
     * @param {*方块数据} block
     * 检查方块是否合法 
     */
    var checkBlock = function (block) {
        var ret = true;
        for (var i = 0; i < block.data[block.dir].length; i++) {
            for (var j = 0; j < block.data[block.dir][0].length; j++) {
                if (block.data[block.dir][i][j] == 2 && checkPoint(i, j, block) == false) {
                    ret = false;
                }
            }
        }
        return ret;
    };
    /**
     * 生成下一个方块
     */
    var nextStep = function (nextBlock) {
        cur = next;
        if (checkBlock(cur)) {
            clearBlockData();
            next = new Square(nextBlock.type, nextBlock.dir);
            nextData = next.data[next.dir];
            setBlockData();
            refresh(nextDoms, nextData);
            refresh(gameDoms, gameData);
        } else {//说明已经无法下降了
            gameOver = true;
        }
    };
    /**
     * 获得一个随机的道具
     */
    var getWeapon = function () {
        var weaponIndex = getRandom(weapons.length);
        weapons[weaponIndex].count++;
        refreshWeapon();
        // $wepDiv = $(doms.weaponDiv);
        // $wepDiv.find(".weapon"+weaponIndex).html(weapons[weaponIndex].count);
    };
    /**
     * 
     * @param {*} up 
     */
    var refreshWeapon = function () {
        $wepDiv = $(doms.weaponDiv);
        for (var i = 0; i < weapons.length; i++) {
            $wepDiv.find(".weapon" + i).html(weapons[i].count);
        }
    };
    function getRandom(up) {
        //parseInt  是为了解决 -0 的情况
        return parseInt(Math.ceil(Math.random() * up - 1));
    }
    /**
     * 消行
     */
    var clearLines = function () {
        var all, special;
        var linesCount = 0;
        var specialCount = 0;
        for (var i = gameData.length - 1; i >= 0; i--) {
            all = true; special = 0;
            for (var j = 0; j < gameData[0].length; j++) {
                if (gameData[i][j] == "0") {
                    all = false;
                    break;
                }
                if (gameData[i][j] == "4") {
                    special++;
                }
            }
            if (all) {
                for (var n = i; n > 0; n--) {
                    for (var m = 0; m < gameData[0].length; m++) {
                        gameData[n][m] = gameData[n - 1][m];
                    }
                }
                for (var m = 0; m < gameData[0].length; m++) {
                    gameData[0][m] = 0;
                }
                linesCount++;
                i++;
                if (special != 0) {
                    specialCount += special;
                }
            }
        }
        if (specialCount != 0) {
            getWeapon();
        }
        return linesCount;
    };

    /**
     * 根据消行的行数来加分
     */
    var addScore = function (lines) {
        var scoreLevel = [0, 10, 30, 100, 180, 360];
        score += scoreLevel[lines];
        doms.scoreDiv.innerHTML = score;
    };
    var scoreFlag = 0;
    var scoreGetWeaponLevel = [50,100,200,500,1000];
    /**
     *如果分数足够高来获得新的weapon 
     */
    var scoreGetWeapon = function(){
        if(scoreFlag )
    };
    /**
     * 让下落至最低端的方块固定下来
     * 
     */
    var done = function () {
        for (var i = 0; i < cur.data[cur.dir].length; i++) {
            for (var j = 0; j < cur.data[cur.dir][0].length; j++) {
                if (cur.data[cur.dir][i][j] == 2) {
                    gameData[cur.pos.x + i][cur.pos.y + j] = 1;
                } else if (cur.data[cur.dir][i][j] == 3) {
                    gameData[cur.pos.x + i][cur.pos.y + j] = 4;
                }
            }
        }
        setBlockData();
        refresh(gameDoms, gameData);
        var lines = clearLines();
        if (lines != 0) {
            addScore(lines);
        }
    };

    /**
     * 
     * @param {*操作指令} order 
     */
    var canMove = function (order) {
        var ret = false;
        switch (order) {
            case "up":
                cur.dir = (cur.dir + 1) % 4;
                ret = checkBlock(cur);
                cur.dir = (cur.dir + 3) % 4;
                break;
            case "left":
                cur.pos.y--;
                ret = checkBlock(cur);
                cur.pos.y++;
                break;
            case "right":
                cur.pos.y++;
                ret = checkBlock(cur);
                cur.pos.y--;
                break;
            case "down":
                cur.pos.x++;
                ret = checkBlock(cur);
                cur.pos.x--;
                if (ret == false) {
                    done();
                }
                break;
            case "space":
                ret = true;
                break;
            default:
                break;
        }
        return ret;
    };

    /**
     * 
     * @param {*操作指令} order 
     */
    var move = function (order) {
        //需要先清除上一个block的数据才能绘制下一个block
        if (canMove(order)) {
            clearBlockData();
            switch (order) {
                case "up":
                    cur.move("up");
                    break;
                case "left":
                    cur.move("left");
                    break;
                case "right":
                    cur.move("right");
                    break;
                case "down":
                    cur.move("down");
                    break;
                case "space":
                    while (canMove("down")) {
                        cur.move("down");
                    }
                    break;
                default:
                    break;
            }
            setBlockData();
            refresh(gameDoms, gameData);
            return true;
        } else {
            return false;
        }
    };
    /**
     * 
     */
    var clearTimer = function () {
        clearInterval(timer);
    }
    /**
     * 检查游戏是否结束
     */
    var isGameOver = function () {
        var over = false;
        for (var i = 0; i < gameData[0].length; i++) {
            if (gameData[1][i] == 1) {
                return true;
            }
        }
        return false;

    };
    /**
     * 获取道具的数据
     */
    var getWeaponData = function () {
        return weapons;
    };
    /**
     * 设置weapon数据 
     * */
    var setWeaponData = function (data) {
        weapons = data;
        refreshWeapon();
    };
    /**
     * 使用道具
     */
    var useWeapon = function (index) {
        if (weapons[index].count > 0) {
            weapons[index].count--;
            refreshWeapon();
            return true;
        } else {
            console.log("弹药不足");
            return false;
        }
    };

    /**
     * 
     * 获取第index行的数据
     */
    var getLineData = function (index) {
        var data = [];
        for (var i = 0; i < gameData[0].length; i++) {
            data[i] = gameData[index][i];
        }
        return data;
    }
    /**
     * 获取方块的总高度和
     */
    var getHeight = function () {
        if ($(doms.arrowDiv).attr("class").indexOf("hide") == -1) {
            //说明上一个炸弹动画还没有完成
            return null;
        }


        for (var i = gameData.length - 1; i >= 0; i--) {
            var allFlag = true;
            for (var j = 0; j < gameData[0].length; j++) {
                if (gameData[i][j] == 1 || gameData[i][j] == 4) { //说明这一行不为空
                    allFlag = false;
                    break;
                }
            }
            if (allFlag) {
                topHeight = (18 - i) * 20;
                break;
            }
        }
        if (topHeight == -20) {
            return null;
        } else {
            return topHeight;
        }

    }
    /**
     * 
     * 炸弹道具的动画
     * return 消除的行数下标
     */
    var selectAnimate = function (deleteIndex) {
        addLineFlag = false;
        var arrowDiv = $(doms.arrowDiv);
        arrowDiv.removeClass("hide");
        var deleteHeight = deleteIndex * 20;
        var timerSpeed = 50;
        var dir = 20;
        var flag = 0;
        var tempTimer = setInterval(choose, timerSpeed);
        var bottom;
        function choose() {
            if (topHeight == 0) {
                dir = 0;
                arrowDiv.css("bottom", 0);
                bottom = 0;
            } else {
                bottom = parseInt(arrowDiv.css("bottom").split("px")[0]);
                bottom += dir;
                arrowDiv.css("bottom", bottom);
                if (bottom == topHeight) {
                    dir = -20;
                } else if (bottom == downHeight) {
                    dir = 20;
                }
            }

            if (bottom == deleteHeight) {
                flag++;
            }

            if (flag == 7) {
                clearInterval(tempTimer);
                deleteLine(19 - deleteIndex);
            } else if (flag == 6) {
                timerSpeed = 300;
                clearInterval(tempTimer);
                tempTimer = setInterval(choose, timerSpeed);
            } else if (flag == 5) {
                timerSpeed = 100;
                clearInterval(tempTimer);
                tempTimer = setInterval(choose, timerSpeed);
            }

        }
    };


    /**
     * 
     * @param {*删除的行数  即gamedata中的index} index 
     */
    var deleteLine = function (index) {
        var data = gameData[index];
        var ct = 0;
        var twinkleDiv = $(doms.twinkleDiv);
        twinkleDiv.css("bottom", (19 - index) * 20 + "px");
        twinkleDiv.removeClass("hide");
        var twinkleTimer = setInterval(function () {
            if (ct == 0) {
                twinkleDiv.css("background-color", "#D1DAE0");
            } else {
                twinkleDiv.css("background-color", "#F2FAFF");
            }
            ct = (ct + 1) % 2;
        }, 300);
        setTimeout(function () {
            clearTimeout(twinkleTimer);
            twinkleDiv.addClass("hide");
            for (var i = index; i > 0; i--) {
                for (var j = 0; j < gameData[0].length; j++)
                    gameData[i][j] = gameData[i - 1][j];
            }
            for (var j = 0; j < gameData[0].length; j++) {
                gameData[0][j] = 0;
            }
            addLineFlag = true;
            clearBlockData();
            setBlockData();
            refresh(gameDoms, gameData);
            $(doms.arrowDiv).addClass("hide");
        }, 2000);
        return data;
    };

    var canAddLine = function () {
        return addLineFlag;
    }
    /**
     * 在最底部添加一行
     * @param {*行的数据} lineData 
     */
    var addLine = function (lineData) {
        clearBlockData();
        for (var i = 0; i <= gameData.length - 2; i++) {
            for (var j = 0; j < gameData[0].length; j++) {
                gameData[i][j] = gameData[i + 1][j];
            }
        }
        gameData[gameData.length - 1] = lineData;
        clearBlockData();
        setBlockData();
        refresh(gameDoms, gameData);
    };
    //导出接口
    this.canAddLine = canAddLine;
    this.getLineData = getLineData;
    this.getHeight = getHeight;
    this.deleteLine = deleteLine;
    this.addLine = addLine;
    this.selectAnimate = selectAnimate;
    this.useWeapon = useWeapon;
    this.getWeaponData = getWeaponData;
    this.setWeaponData = setWeaponData;
    this.gameOver = gameOver;
    this.clearTimer = clearTimer;
    this.addScore = addScore;
    this.done = done;
    this.clearLines = clearLines;
    this.isGameOver = isGameOver;
    this.nextStep = nextStep;
    this.canMove = canMove;
    this.move = move;
    this.init = init;
};