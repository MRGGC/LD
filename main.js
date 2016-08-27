var canvas, ctx;
var key;
var UP_ARROW = 87, DOWN_ARROW = 83, RIGHT_ARROW = 68, LEFT_ARROW = 65;
var bg_sound = './sounds/sound.mp3';
var HEIGHT = 400, WIDTH = 520;
var input = new inputHandeler();
var snake = new Snake();
var food = new Food();

// function Grid()
// {
//     this.w = WIDTH;
//     this.h = HEIGHT;
//     this._grid = [];
//
//     this.addGrids = function() {
//         for(var i = 0; i < this.h / 20; i++) {
//             for(var j = 0; j < this.w / 20; j++) {
//                 this._grid.push({x: j * 20, y: i * 20});
//                 console.log("X: " + j * 20 + ", Y: " + i * 20);
//             }
//         }
//     }
// }

function Snake()
{
    this.x = 20;
    this.y = 20;
    this.width = 19;
    this.height = 19;
    this.total = 1;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = "lightgreen";
        for(var i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, this.width, this.height);
        }
    }

    this.update = function() {
        if(input.isPressed(DOWN_ARROW)) key = 'DOWN';
        if(input.isPressed(UP_ARROW)) key = 'UP';
        if(input.isPressed(RIGHT_ARROW)) key = 'RIGHT';
        if(input.isPressed(LEFT_ARROW)) key = 'LEFT';

        if (this.total === this.tail.length) {
            for (var i = 0; i < this.tail.length - 1; i++) {
              this.tail[i] = this.tail[i + 1];
            }
        }
        
        this.tail[this.total - 1] = {x: this.x, y: this.y};
    }
}

function Food()
{
    this.x = Math.floor(Math.random() * WIDTH / 20) * 20;
    this.y = Math.floor(Math.random() * HEIGHT / 20) * 20;
    this.width = 20;
    this.height = 20;

    this.draw = function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.update = function() {
        this.x = Math.floor(Math.random() * WIDTH / 20) * 20;
        this.y = Math.floor(Math.random() * HEIGHT / 20) * 20;
    }

    this.eat = function() {
        if(AABB(this.x, this.y, this.width, this.height, snake.x, snake.y, snake.width, snake.height)) {
            snake.total++;
            this.update();

            return true;
        } else {
            return false;
        }
    }
}


function init()
{
    canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    var loop = function() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        snake.update();
        snake.draw();

        food.eat();
        food.draw();

        window.requestAnimationFrame(loop);
    }

    setInterval(function() {
        switch (key) {
            case 'UP':
                snake.y -= 20;
                break;

            case 'DOWN':
                snake.y += 20;
                break;

            case 'RIGHT':
                snake.x += 20;
                break;

            case 'LEFT':
                snake.x -= 20;
                break;
        }
    }, 150);

    loop();
}

function inputHandeler() {
    this.down = {};
    this.pressed = {};

    var _this = this;
    document.addEventListener("keydown", function (evt) {
        _this.down[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function (evt) {
        delete _this.down[evt.keyCode];
        delete _this.pressed[evt.keyCode];
    });
};

inputHandeler.prototype.isDown = function(code) {
    return this.down[code];
};

inputHandeler.prototype.isPressed = function(code) {
    if(this.pressed[code]) {
                return false;
    } else if(this.down[code]) {
        return this.pressed[code] = true;
    }
    return false;
};

function AABB(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bw + bx && ay < bh + by && bx < ax + aw && by < ay + ah;
}
















init();
