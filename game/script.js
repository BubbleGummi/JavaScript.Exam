const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
document.addEventListener("DOMContentLoaded", function () {
  // Set initial canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const startButton = document.createElement("button");
  startButton.id = "startButton";
  startButton.textContent = "Start Game";
  document.body.appendChild(startButton);

  startButton.addEventListener("click", function startButtonClickHandler() {
    gameRunning = true;
    startTime = new Date().getTime();
    canvas.addEventListener("mousemove", movePlayerToMouse);
    startButton.style.display = "none";
    startGame();

    startButton.removeEventListener("click", startButtonClickHandler);
  });

  const player = {
    x: 50,
    y: 50,
    width: 20,
    height: 20,
    color: "blue",
    speed: 5,
  };

  const poles = [];
  const enemies = [];
  let score = 0;
  let startTime;
  let gameRunning = false;

  const poleImage = new Image();
  poleImage.src = "../game/enemyImages/enemyPole.png";

  function spawnPole() {
    const poleHeight = canvas.height / 3;
    const pole = {
      x: Math.random() * canvas.width,
      y: -500,
      width: 30,
      height: poleHeight,
      image: poleImage,
    };
    poles.length = 0;
    poles.push(pole);
  }

  function drawPoles() {
    poles.forEach((pole) => {
      ctx.drawImage(pole.image, pole.x, pole.y, pole.width, pole.height);
    });
  }

  const enemyImages = [
    "../game/enemyImages/EnemyOne.png",
    "../game/enemyImages/EnemyTwo.png",
    "../game/enemyImages/EnemyThree.png",
    "../game/enemyImages/EnemyFour.png",
    "../game/enemyImages/EnemyFive.png",
    "../game/enemyImages/EnemySix.png",
    "../game/enemyImages/EnemySeven.png",
    "../game/enemyImages/EnemyEight.png",
    "../game/enemyImages/EnemyNine.png",
  ];

  function spawnEnemy() {
    const randomImageIndex = Math.floor(Math.random() * enemyImages.length);
    const enemyImage = new Image();
    enemyImage.src = enemyImages[randomImageIndex];

    const enemy = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 20,
      height: 20,
      image: enemyImage,
      speed: 1,
    };

    enemies.push(enemy);
  }

  function drawEnemies() {
    enemies.forEach((enemy) => {
      ctx.drawImage(
        enemy.image,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height
      );
    });
  }

  function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
  }

  function movePlayerToMouse(event) {
    player.x =
      event.clientX - canvas.getBoundingClientRect().left - player.width / 2;
    player.y =
      event.clientY - canvas.getBoundingClientRect().top - player.height / 2;
  }

  function moveEnemies() {
    enemies.forEach((enemy) => {
      const deltaX = player.x - enemy.x;
      const deltaY = player.y - enemy.y;
      const angle = Math.atan2(deltaY, deltaX);

      const speedX = Math.cos(angle) * enemy.speed;
      const speedY = Math.sin(angle) * enemy.speed;

      if (!checkEnemyCollision(enemy, speedX, speedY)) {
        enemy.x += speedX;
        enemy.y += speedY;
      }
    });
  }

  function movePoles() {
    poles.forEach((pole) => {
      pole.y += 1;
    });
  }

  function checkEnemyCollision(enemy, dx, dy) {
    const nextX = enemy.x + dx;
    const nextY = enemy.y + dy;

    for (const otherEnemy of enemies) {
      if (
        otherEnemy !== enemy &&
        nextX < otherEnemy.x + otherEnemy.width &&
        nextX + enemy.width > otherEnemy.x &&
        nextY < otherEnemy.y + otherEnemy.height &&
        nextY + enemy.height > otherEnemy.y
      ) {
        return true;
      }
    }

    return false;
  }

  let isGameOver = false;

  function checkCollision() {
    enemies.forEach((enemy) => {
      poles.forEach((pole) => {
        if (
          player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y
        ) {
          if (!isGameOver) {
            gameOver();
            isGameOver = true; // Set the flag to true to indicate that the game is over
          }
        }

        if (
          player.x < pole.x + pole.width &&
          player.x + player.width > pole.x &&
          player.y < pole.y + pole.height &&
          player.y + player.height > pole.y
        ) {
          if (!isGameOver) {
            gameOver();
            isGameOver = true; // Set the flag to true to indicate that the game is over
          }
        }
      });
    });
  }

  function calculateScore(elapsedTime) {
    return Math.floor(elapsedTime);
  }

  function updateScore() {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000;
    score = calculateScore(elapsedTime);
  }

  function resetGame() {
    player.x = 50;
    player.y = 50;
    enemies.length = 0;
    poles.length = 0;
    score = 0;
    startTime = new Date().getTime();
    isGameOver = false;
  }

function gameOver() {
  const endTime = new Date().getTime();
  const elapsedTime = (endTime - startTime) / 1000;

  // Remove the "mousemove" event listener
  canvas.removeEventListener("mousemove", movePlayerToMouse);

  // Create "Game Over" message
  const gameOverMessage = document.createElement("div");
  gameOverMessage.classList.add("game-over-message");
  gameOverMessage.textContent =
    "Game Over! Your Score: " + calculateScore(elapsedTime);
  document.body.appendChild(gameOverMessage);

  gameRunning = false;

  // Create "Try Again" button
  const tryAgainButton = document.createElement("button");
  tryAgainButton.id = "tryAgainButton";
  tryAgainButton.textContent = "Try Again";
  document.body.appendChild(tryAgainButton); // Append to canvas parent
  tryAgainButton.id = "tryAgainButton";

  // Set up event listener for "Try Again" button
  tryAgainButton.addEventListener("click", function () {
    document.body.removeChild(gameOverMessage);
    document.body.removeChild(tryAgainButton);
    resetGame();
    startGame();
  });
  document.getElementById("startButton").addEventListener("click", function () {
  gameRunning = true;
  startTime = new Date().getTime(); // Set start time when the game starts
  canvas.addEventListener("mousemove", movePlayerToMouse);
  startGame();
});
}
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawEnemies();
    drawPoles();
    drawScore();
    moveEnemies();
    movePoles();
    checkCollision();
    updateScore();
    increaseEnemySpeed();

    if (gameRunning) {
      requestAnimationFrame(gameLoop);
    }
  }


  let elapsedTimeSinceSpeedIncrease = 0;
  const speedIncreaseInterval = 10; // Increase speed every 10 seconds
  const speedIncreaseAmount = 0.1;

  function increaseEnemySpeed() {
    elapsedTimeSinceSpeedIncrease += 1 / 60;
    if (elapsedTimeSinceSpeedIncrease >= speedIncreaseInterval) {
      enemies.forEach((enemy) => {
        enemy.speed += speedIncreaseAmount;
      });
      elapsedTimeSinceSpeedIncrease = 0;
    }
  }

  document.getElementById("startButton").addEventListener("click", function () {
    gameRunning = true;
    startTime = new Date().getTime(); // Set start time when the game starts
    canvas.addEventListener("mousemove", movePlayerToMouse);
    startGame();
  });

 function startGame() {
  function spawnEnemyWithTimeout() {
    spawnEnemy();
    setTimeout(spawnEnemyWithTimeout, 2000); // Spawn a new enemy every 2 seconds
  }

  function spawnPoleWithTimeout() {
    spawnPole();
    setTimeout(spawnPoleWithTimeout, 5000); // Spawn a new pole every 5 seconds
  }

  spawnEnemyWithTimeout();
  spawnPoleWithTimeout();

  gameLoop();
  document.getElementById("startButton").style.display = "none";
}
});

