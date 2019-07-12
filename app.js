let canvas, ctx;
const fps = 60;

let ballX = 50;
let ballSpeedX = 5;
let ballY = 50;
let ballSpeedY = 5;

let paddle1Y = 250;
let paddle2Y = 250;
const paddleHeight = 100;
const winningScore = 3;

let scorePlayer1 = 0;
let scorePlayer2 = 0;
let showMenu = false;

window.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')

  setInterval(() => {
    movement();
    drawCanvas();
  }, 1000 / fps);

  canvas.addEventListener('mousemove', (e) => {
    paddle1Y = mousePosition(e).y - (paddleHeight / 2);
    paddle1Y = checkPaddleBounds(paddle1Y)
  });

  canvas.addEventListener('mousedown', handleMouseClick);
})

function handleMouseClick(e) {
  if (showMenu) {
    scorePlayer1 = 0
    scorePlayer2 = 0
    showMenu = !showMenu
  }
}

function mousePosition(e) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = e.clientX - rect.left - root.scrollLeft
  let mouseY = e.clientY - rect.top - root.scrollTop
  // console.log(mouseX)
  // console.log(mouseY)
  return {
    x: mouseX,
    y: mouseY
  }
}

function checkPaddleBounds(paddle) {
  if (paddle >= (canvas.height - paddleHeight)) {
    return canvas.height - paddleHeight
  }
  return paddle <= 0 ? 0 : paddle;
}

function npcMovement() {
  (paddle2Y + paddleHeight / 2) < ballY ? paddle2Y += 4 : paddle2Y -= 4;
  paddle2Y = checkPaddleBounds(paddle2Y)
}

function movement() {
  if (showMenu) {
    return;
  }
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  // left side
  // if (ballX <= 25 && ballX >= 20) {
  // inline with paddle1
  if (ballY > paddle1Y && ballY < (paddle1Y + paddleHeight) && ballX <= 25 && ballX >= 20) {
    ballSpeedX = -ballSpeedX

    let deltaY = ballY - (paddle1Y + paddleHeight / 2);
    ballSpeedY = deltaY * 0.3
  }
  if (ballX <= 0) {
    scorePlayer2++;
    ballReset()
    console.log(scorePlayer2)
  }
  // }
  //  right side
  // if (ballX > (canvas.width - 25)) {
  // inline with paddle2
  if (ballY > paddle2Y && ballY < (paddle2Y + paddleHeight) && ballX >= (canvas.width - 25) && ballX <= (canvas.width - 20)) {
    ballSpeedX = -ballSpeedX
    let deltaY = ballY - (paddle2Y + paddleHeight / 2);
    ballSpeedY = deltaY * 0.3
  }
  if (ballX >= canvas.width) {
    scorePlayer1++;
    ballReset()
    console.log(scorePlayer1)
  }
  // }
  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  npcMovement()
}

function ballReset() {
  if (scorePlayer1 === winningScore || scorePlayer2 === winningScore) {
    showMenu = true
  }
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = (Math.random() - 0.5) * 5;
}

function drawCanvas() {
  drawRectangle(0, 0, canvas.width, canvas.height, '#000')
  if (showMenu) {
    ctx.fillStyle = '#FFF'
    scorePlayer1 === winningScore ? ctx.fillText("player 1 wins", 400, 250) : ctx.fillText("player 2 wins", 400, 250)
    ctx.fillText("click to play", 400, 300)
    return
  }
  for (let i = 10; i < canvas.height; i += 40) {
    drawRectangle(canvas.width / 2 - 1, i, 2, 20, '#FFF')
  }
  drawRectangle(10, paddle1Y, 10, paddleHeight, '#FFF')
  drawRectangle(canvas.width - 20, paddle2Y, 10, paddleHeight, '#FFF')
  drawCircle(ballX, ballY, 10, '#FFF')

  ctx.fillText(scorePlayer1, 350, 100);
  ctx.fillText(scorePlayer2, 450, 100);
}

function drawRectangle(leftX, topY, width, height, colour) {
  ctx.fillStyle = colour
  ctx.fillRect(leftX, topY, width, height)
}

function drawCircle(centreX, centreY, radius, colour) {
  ctx.fillStyle = colour
  ctx.beginPath()
  ctx.arc(centreX, centreY, radius, 0, Math.PI * 2, true)
  ctx.fill()
}