var canvas, ctx;
var key = '';
var gv = false;
var scale = 10;
var UP_ARROW = 87, DOWN_ARROW = 83, RIGHT_ARROW = 68, LEFT_ARROW = 65, P = 80;

var bg_sound = new Audio();
bg_sound.src = './sounds/sound.mp3';
bg_sound.play();
bg_sound.loop = true;
var eat_sound = new Audio();
eat_sound.src = './sounds/eat.mp3';

var score = 0;
var run;

//settings vars
var speed, walls, sound;

var HEIGHT = 400, WIDTH = 520;

var input = new inputHandeler();
var snake = new Snake();
var food = new Food();
var wall = new Walls();

// function Grid()
// {
//     this.w = WIDTH;
//     this.h = HEIGHT;
//     this._grid = [];
//
//     this.addGrids = function() {
//         for(var i = 0; i < this.h / 10; i++) {
//             for(var j = 0; j < this.w / 10; j++) {
//                 this._grid.push({x: j * 10, y: i * 10});
//                 console.log("X: " + j * 10 + ", Y: " + i * 10);
//             }
//         }
//     }
// }

function Snake()
{
    this.x;
    this.y;
    this.width;
    this.height;
    this.total;
    this.tail;
    const s_speed = 10;

    this.draw = function() {
        ctx.fillStyle = "lightgreen";
        for(var i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, this.width, this.height);
        }
    }

    this.update = function() {
        if (this.total === this.tail.length) {
            for (var i = 0; i < this.tail.length - 1; i++) {
              this.tail[i] = this.tail[i + 1];
            }
        }
        this.tail[this.total - 1] = {x: this.x, y: this.y};

        if(input.isPressed(DOWN_ARROW) && key != 'UP' && snake.x > 0 && snake.x < WIDTH && snake.y > 0 && snake.y < HEIGHT) key = 'DOWN';
        if(input.isPressed(UP_ARROW) && key != 'DOWN' && snake.x > 0 && snake.x < WIDTH && snake.y > 0 && snake.y < HEIGHT) key = 'UP';
        if(input.isPressed(RIGHT_ARROW) && key != 'LEFT' && snake.x > 0 && snake.x < WIDTH && snake.y > 0 && snake.y < HEIGHT) key = 'RIGHT';
        if(input.isPressed(LEFT_ARROW) && key != 'RIGHT' && snake.x > 0 && snake.x < WIDTH && snake.y > 0 && snake.y < HEIGHT) key = 'LEFT';

        switch (key) {
            case 'UP':
                snake.y -= s_speed;
                break;

            case 'DOWN':
                snake.y += s_speed;
                break;

            case 'RIGHT':
                snake.x += s_speed;
                break;

            case 'LEFT':
                snake.x -= s_speed;
                break;
        }
    }

    this.death = function() {
        for (var i = 0; i < this.tail.length; i++) {
            var pos = this.tail[i];
            var d = Math.dist(pos.x, pos.y, this.x, this.y);
            if(d < 1 && key != '') {
                GameOver();
            }
        }
    }
}

function Food()
{
    this.x = Math.floor(Math.random() * WIDTH / scale) * scale;
    this.y = Math.floor(Math.random() * HEIGHT / scale) * scale;
    this.width = scale;
    this.height = scale;

    this.draw = function() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.update = function() {
        this.x = Math.floor(Math.random() * WIDTH / scale) * scale;
        this.y = Math.floor(Math.random() * HEIGHT / scale) * scale;
    }

    this.eat = function() {
        if(AABB(this.x, this.y, this.width, this.height, snake.x, snake.y, snake.width, snake.height)) {
            eat_sound.play();

            snake.total++;
            score++;
            this.update();

            return true;
        } else {
            return false;
        }
    }
}


function init()
{
    gv = false;

    speed = $('input[name="speed"]:checked').val();
    walls = $('input[name="wall"]:checked').val();
    sound = $('input[name="music"]:checked').val();


    $('#setting').css({"display":"none"});
    $('#gameover').css({"display":"none"});
    $('#menu').css({"display":"none"});


    snake.x = snake.y = scale;
    snake.width = snake.height = scale - 1;
    snake.total = 1;
    snake.tail = [];

    canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    run = setInterval(function() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        snake.update();
        snake.death();
        snake.draw();

        food.eat();
        food.draw();

        wall.update(walls);

        DrawScore();






        if(gv === true && input.isPressed(32)) {
            init();
        }

        switch (sound) {
            case 1:
                bg_sound.play();
                bg_sound.loop = true;
                break;
            case 0:
                bg_sound.stop();
                break;

        }
    }, speed);
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

function DrawScore() {
    ctx.beginPath();

    ctx.fillStyle = "#fff";
    ctx.font = "25px VT323";
    ctx.fillText(score, WIDTH * 0.5, 30);

    ctx.stroke();
}

function AABB(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bw + bx && ay < bh + by && bx < ax + aw && by < ay + ah;
}

Math.dist=function(x1,y1,x2,y2){
    if(!x2) x2=0;
    if(!y2) y2=0;
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

function GameOver() {
    snake.total = 1;
    key = '';
    snake.x = snake.y = scale;
    score = 0;

    clearInterval(run);

    init();

    gv = true;

    $('canvas').remove();
    $('.all_snake').css({"display":"block"});
    $('#menu').css({"display":"none"});
    $('#setting').css({"display":"none"});
    $('#gameover').css({"display":"block"});

    food.update();
}

function settings()
{
    $('canvas').remove();
    $('.all_snake').css({"display":"block"});
    $('#menu').css({"display":"none"});
    $('#gameover').css({"display":"none"});
    $('#setting').css({"display":"block"});
}

function Walls(wall)
{
    this.update = function() {
        if(walls == 1) {
            if(snake.x < 0 || snake.x > WIDTH || snake.y < 0 || snake.y > HEIGHT) {
                GameOver();
            }
        } else {
            if(snake.x < 0) snake.x = WIDTH;
            if(snake.x > WIDTH) snake.x = 0;
            if(snake.y < 0) snake.y = HEIGHT;
            if(snake.y > HEIGHT) snake.y = 0;
        }
    }
}


















//init();
