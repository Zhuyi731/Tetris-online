(function (window) {
    var that = this;


    var Square = function (type,dir) {
        this.data = that.squareData[type];
        this.dir = dir;
        this.pos = {
            x: 0,
            y: 3
        };

    };

    Square.prototype.move = function (order) {
        switch (order) {
            case "down":
                this.pos.x++;
                break;
            case "left":
                this.pos.y--;
                break;
            case "right":
                this.pos.y++;
                break;
            case "up":
                this.dir = (this.dir + 1) % 4;
                break;
            default:
                break;
        }
    };



    var squareData = [];

    this.squareData = squareData;
    window.Square = Square;



    // 下面为方块数据的定义

    /**
     *  口口口口 形
     */
    squareData[0] = [
        [
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [2, 2, 2, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [2, 2, 2, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ];
    /**
     *  口口  形
     *  口口
     *
     */
    squareData[1] = [
        [
            [0, 0, 0, 0],
            [0, 2, 2, 0],
            [0, 2, 2, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 2, 2, 0],
            [0, 2, 2, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 2, 2, 0],
            [0, 2, 2, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 2, 2, 0],
            [0, 2, 2, 0],
            [0, 0, 0, 0]
        ]
    ];
    /**
       型     口 
            口口口
     */
    squareData[2] = [
        [
            [0, 2, 0, 0],
            [2, 2, 2, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 2, 0, 0],
            [0, 2, 2, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [2, 2, 2, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 2, 0, 0],
            [2, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ]
    ];
    /**
    *      口口 
    *  型    口口
     */
    squareData[3] = [
        [
            [0, 0, 0, 0],
            [2, 2, 0, 0],
            [0, 2, 2, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 2, 0],
            [0, 2, 2, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [2, 2, 0, 0],
            [0, 2, 2, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 2, 0],
            [0, 2, 2, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ]
    ];
    /**
    *   型    口口 
    *       口口
     */
    squareData[4] = [
        [
            [0, 0, 0, 0],
            [0, 2, 2, 0],
            [2, 2, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [2, 0, 0, 0],
            [2, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 2, 2, 0],
            [2, 2, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [2, 0, 0, 0],
            [2, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ]
    ];
    /**
     *        口口口
     *  型        口
     */
    squareData[5] = [
        [
            [2, 2, 2, 0],
            [0, 0, 2, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [2, 2, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [2, 0, 0, 0],
            [2, 2, 2, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [2, 2, 0, 0],
            [2, 0, 0, 0],
            [2, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ];
    /**
     *   口口口 型
     *   口
     */
    squareData[6] = [
        [
            [2, 2, 2, 0],
            [2, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [2, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 2, 0],
            [2, 2, 2, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [2, 0, 0, 0],
            [2, 0, 0, 0],
            [2, 2, 0, 0],
            [0, 0, 0, 0]
        ]
    ];

    //  6以后为道具  异型方块
    /**
     * 口    口
     *   口口
     *   口口
     * 口    口 型 
     * 
     */
    squareData[7] = [
        [
            [2, 0, 0, 2],
            [0, 2, 2, 0],
            [0, 2, 2, 0],
            [2, 0, 0, 2]
        ],
        [
            [2, 0, 0, 2],
            [0, 2, 2, 0],
            [0, 2, 2, 0],
            [2, 0, 0, 2]
        ], [
            [2, 0, 0, 2],
            [0, 2, 2, 0],
            [0, 2, 2, 0],
            [2, 0, 0, 2]
        ], [
            [2, 0, 0, 2],
            [0, 2, 2, 0],
            [0, 2, 2, 0],
            [2, 0, 0, 2]
        ]
    ];
    /**
    *      口口
     *   口口
     *   口口
     * 口口     型 
     */
    squareData[8] = [
        [
            [0, 0, 2, 2],
            [0, 2, 2, 0],
            [0, 2, 2, 0],
            [2, 2, 0, 0]
        ], [
            [2, 0, 0, 0],
            [2, 2, 2, 0],
            [0, 2, 2, 2],
            [0, 0, 0, 2]
        ], [
            [0, 0, 2, 2],
            [0, 2, 2, 0],
            [0, 2, 2, 0],
            [2, 2, 0, 0]
        ], [
            [2, 0, 0, 0],
            [2, 2, 2, 0],
            [0, 2, 2, 2],
            [0, 0, 0, 2]
        ]
    ];
    //终极异形方块
    /**
     *  口口
     *口    口
     *口    口
     *  口口
     */
    squareData[9] = [
        [
            [0, 2, 2, 0],
            [2, 0, 0, 2],
            [2, 0, 0, 2],
            [0, 2, 2, 0]
        ], [
            [0, 2, 2, 0],
            [2, 0, 0, 2],
            [2, 0, 0, 2],
            [0, 2, 2, 0]
        ], [
            [0, 2, 2, 0],
            [2, 0, 0, 2],
            [2, 0, 0, 2],
            [0, 2, 2, 0]
        ], [
            [0, 2, 2, 0],
            [2, 0, 0, 2],
            [2, 0, 0, 2],
            [0, 2, 2, 0]
        ]
    ];
    /**
     *  口口口口 
     *  口口口口 
     *  口口口口 
     *  口口口口 
     */
    squareData[10] = [
        [
            [2, 2, 2, 2],
            [2, 2, 2, 2],
            [2, 2, 2, 2],
            [2, 2, 2, 2]
        ], [
            [2, 2, 2, 2],
            [2, 2, 2, 2],
            [2, 2, 2, 2],
            [2, 2, 2, 2]
        ], [
            [2, 2, 2, 2],
            [2, 2, 2, 2],
            [2, 2, 2, 2],
            [2, 2, 2, 2]
        ], [
            [2, 2, 2, 2],
            [2, 2, 2, 2],
            [2, 2, 2, 2],
            [2, 2, 2, 2]
        ]
    ];
    /**
     *  口口口口 
     *  口口口口 
     *  口口口口 
     *  口口口口 
     */
    squareData[11] = [
        [
            [0, 2, 0, 0],
            [2, 3, 2, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ], [
            [0, 2, 0, 0],
            [2, 3, 2, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ], [
            [0, 2, 0, 0],
            [2, 3, 2, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ], [
            [0, 2, 0, 0],
            [2, 3, 2, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0]
        ]
    ];

})(window);
