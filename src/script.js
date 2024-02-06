const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('main-canvas');
const context = canvas.getContext('2d');

// resize function
function initSize() {
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
}
initSize();
window.addEventListener('resize', initSize);

let computerTurn = true;

// ball class
class Ball {
    // constructor
    constructor(x, y, radius, color, strokeColor, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.strokeColor = strokeColor;
        this.velocity = velocity;
    }

    // update method
    update(x, y) {
        this.x = x;
        this.y = y;
    }

    // draw method
    draw() {
        // Create radial gradient for background
        let bgGradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height));
        bgGradient.addColorStop(0, '#030637'); // inner color
        bgGradient.addColorStop(1, '#3C0753'); // outer color

        context.fillStyle = bgGradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Create radial gradient for ball
        let ballGradient = context.createRadialGradient(this.x, this.y, this.radius / 10, this.x, this.y, this.radius);
        ballGradient.addColorStop(0, 'purple'); // inner color
        ballGradient.addColorStop(1, this.color); // outer color

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.strokeStyle = this.strokeColor;
        context.stroke();
        context.fillStyle = ballGradient;
        context.fill();
    }

    // collision method
    collisionWithEdges(params) {
        if (this.y + this.radius > params.height || this.y - this.radius < 0) {
            this.velocity.y *= -1;
        }
    }

    // collision with paddles
    collisionWithPaddles(paddle1, paddle2) {
        if (
            this.x + this.radius > paddle2.x &&
            this.y > paddle2.y &&
            this.y < paddle2.y + paddle2.height
        ) {
            this.velocity.x *= -1;
            setTimeout(() => {
                computerTurn = !computerTurn;
            }, 150);
        }
        if (
            this.x - this.radius < paddle1.x + paddle1.width &&
            this.y > paddle1.y &&
            this.y < paddle1.y + paddle1.height
        ) {
            this.velocity.x *= -1;
            setTimeout(() => {
                computerTurn = !computerTurn;
            }, 150);
        }
    }
}

// paddle class
class Paddle {
    // constructor
    constructor(x, y, width, height, color, velocity) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocity = velocity;
    }

    // update method
    update(x, y) {
        this.x = x;
        this.y = y;
    }

    // draw method
    draw() {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.color;
        context.fill();
    }
}

// create ball
const ball = new Ball(500, 100, 20, '#8b5cf6', 'brown', { x: 10, y: 10 });

// create paddles in the canvas boundaries (left and right)
const paddleHeight = 200;
const paddleY = (canvas.height - paddleHeight) / 2;

const paddle1 = new Paddle(30, paddleY, 20, paddleHeight, '#5D3587', 3);
const paddle2 = new Paddle(canvas.width - 20 - 30, paddleY, 20, paddleHeight, '#5D3587', 3);

// get mouse position
function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

// algorithm for the computer to play
function computerPlay(speed = 5) {
    const paddle2Center = paddle2.y + paddleHeight / 2;
    if (paddle2Center < ball.y - 35) {
        paddle2.y += speed;
    } else if (paddle2Center > ball.y + 35) {
        paddle2.y -= speed;
    }
}

// event listener for mouse move
document.addEventListener('mousemove', (event) => {
    const mousePos = getMousePos(event);
    paddle1.y = mousePos.y - paddleHeight / 2;
});

function gameUpdate() {
    // update ball position
    ball.update(
        ball.x + ball.velocity.x,
        ball.y + ball.velocity.y
    );
    // check collision with canvas edges
    ball.collisionWithEdges(canvas);
    // check collision with paddles
    ball.collisionWithPaddles(paddle1, paddle2);
}

function gameDraw() {
    // make the computer play
    if (computerTurn)
        computerPlay(16);
    // draw ball
    ball.draw();
    // draw paddles
    paddle1.draw();
    paddle2.draw();
    ball.velocity.y *= 1.0001;
    ball.velocity.x *= 1.0001;
}

function gameLoop() {
    // update and draw game
    gameUpdate();
    gameDraw();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
