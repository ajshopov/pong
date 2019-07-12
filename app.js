let canvas, ctx;
const fps = 60;
const winningScore = 3;
const paddleHeight = 100;
let showMenu = false;

let ballX = 50, ballY = 50;
let ballSpeedX = 5, ballSpeedY = 5;
let paddle1Y = 250, paddle2Y = 250;
let scorePlayer1 = 0, scorePlayer2 = 0;


window.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')

  setInterval(() => {
    gamePlay()
    drawGameObjects()
  }, 1000 / fps)

  canvas.addEventListener('mousemove', (e) => {
    paddle1Y = mousePosition(e).y - (paddleHeight / 2)
    paddle1Y = checkPaddleBounds(paddle1Y)
  });

  canvas.addEventListener('mousedown', () => {
    if (showMenu) {
      scorePlayer1 = 0
      scorePlayer2 = 0
      showMenu = !showMenu
    }
  });
})

function mousePosition(e) {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement
  let mouseX = e.clientX - rect.left - root.scrollLeft
  let mouseY = e.clientY - rect.top - root.scrollTop
  return {
    x: mouseX,
    y: mouseY
  };
}

function drawGameObjects() {
  // background
  drawRectangle(0, 0, canvas.width, canvas.height, '#000')

  // victory menu
  if (showMenu) {
    ctx.fillStyle = '#FFF'
    ctx.font = "25px serif"
    const winner = scorePlayer1 === winningScore ? "1" : "2"
    ctx.fillText(`PLAYER ${winner} WINS`, 400, 250)
    ctx.fillText("CLICK TO PLAY AGAIN", 400, 300)
    return;
  }

  // centre net line
  for (let i = 10; i < canvas.height; i += 40) {
    drawRectangle(canvas.width / 2 - 1, i, 2, 20, '#FFF')
  }

  // paddles
  drawRectangle(10, paddle1Y, 10, paddleHeight, '#FFF')
  drawRectangle(canvas.width - 20, paddle2Y, 10, paddleHeight, '#FFF')

  // ball
  ctx.beginPath()
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2, true)
  ctx.fill()

  // scores
  ctx.textAlign = 'center'
  ctx.font = "60px serif"
  ctx.fillText(scorePlayer1, 320, 100)
  ctx.fillText(scorePlayer2, 480, 100)
}

function gamePlay() {
  if (showMenu) { return;}

  // ball movement
  ballX += ballSpeedX
  ballY += ballSpeedY
  if (ballX >= canvas.width) {
    scorePlayer1++;
    ballReset()
  }
  if (ballX <= 0) {
    scorePlayer2++;
    ballReset()
  }
  if (ballY >= canvas.height || ballY <= 0) {
    ballSpeedY = -ballSpeedY
  }

  // AI player movement
  ballY > (paddle2Y + paddleHeight / 2) ? paddle2Y += 4 : paddle2Y -= 4
  paddle2Y = checkPaddleBounds(paddle2Y)

  checkPaddleCollision(paddle1Y, 20, 25)
  checkPaddleCollision(paddle2Y, canvas.width - 25, canvas.width - 20)
}

function checkPaddleCollision(paddleY, rangeStart, rangeEnd) {
  if (ballY > paddleY && ballY < (paddleY + paddleHeight) && 
    ballX <= rangeEnd && ballX >= rangeStart
  ) {
    ballSpeedX = -ballSpeedX
    let deltaY = ballY - (paddleY + paddleHeight / 2)
    ballSpeedY = deltaY * 0.3
  }
}

function ballReset() {
  if (scorePlayer1 === winningScore || scorePlayer2 === winningScore) {
    showMenu = true
  }
  ballX = canvas.width / 2
  ballY = canvas.height / 2
  ballSpeedX = -ballSpeedX
  ballSpeedY = (Math.random() - 0.5) * 5
}

function checkPaddleBounds(paddle) {
  if (paddle >= (canvas.height - paddleHeight)) {
    return canvas.height - paddleHeight;
  }
  return paddle <= 0 ? 0 : paddle;
}

function drawRectangle(leftX, topY, width, height, colour) {
  ctx.fillStyle = colour
  ctx.fillRect(leftX, topY, width, height)
}