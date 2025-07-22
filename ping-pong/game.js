const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 12;
const paddleHeight = 100;
const ballRadius = 10;
const playerX = 20;
const aiX = canvas.width - paddleWidth - 20;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 6 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);

let upPressed = false;
let downPressed = false;

let playerScore = 0;
let aiScore = 0;

// Draw paddles, ball, and scores
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Middle line
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Player paddle
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);

    // AI paddle
    ctx.fillStyle = "#f44336";
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#ffd600";
    ctx.fill();

    // Scores
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvas.width / 4, 40);
    ctx.fillText(aiScore, canvas.width * 3 / 4, 40);
}

// Mouse movement controls player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;

    // Clamp within bounds
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height) playerY = canvas.height - paddleHeight;
});

// AI movement (simple tracking)
function moveAI() {
    const aiCenter = aiY + paddleHeight / 2;
    if (ballY < aiCenter - 30) {
        aiY -= 5;
    } else if (ballY > aiCenter + 30) {
        aiY += 5;
    }
    // Clamp within canvas
    if (aiY < 0) aiY = 0;
    if (aiY + paddleHeight > canvas.height) aiY = canvas.height - paddleHeight;
}

// Ball movement and collision detection
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Paddle collision: Player
    if (
        ballX - ballRadius < playerX + paddleWidth &&
        ballY > playerY &&
        ballY < playerY + paddleHeight &&
        ballSpeedX < 0
    ) {
        ballSpeedX = -ballSpeedX;
        // Change angle based on where the ball hits the paddle
        let deltaY = ballY - (playerY + paddleHeight/2);
        ballSpeedY = deltaY * 0.25;
    }

    // Paddle collision: AI
    if (
        ballX + ballRadius > aiX &&
        ballY > aiY &&
        ballY < aiY + paddleHeight &&
        ballSpeedX > 0
    ) {
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (aiY + paddleHeight/2);
        ballSpeedY = deltaY * 0.25;
    }

    // Left and right wall (score)
    if (ballX - ballRadius < 0) {
        aiScore++;
        resetBall();
    } else if (ballX + ballRadius > canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Reset ball to center after point scored
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 6 * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() * 2 - 1);
}

// Main game loop
function gameLoop() {
    moveAI();
    moveBall();
    draw();
    requestAnimationFrame(gameLoop);
}

draw();
gameLoop();