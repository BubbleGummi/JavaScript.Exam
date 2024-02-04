class Game {
    constructor(canvas, ctx) {
            // Referenser till canvas och context
            this.canvas = canvas;
            this.ctx = ctx;
            // Spelstatusvariabler
            this.isRunning = false;
            this.isPaused = false;
            this.isGameOver = false;
            // Spelarens egenskaper
            this.player = {
                x: 50,
                y: 50,
                width: 20,
                height: 20,
                color: "blue",
                speed: 5,
            };
            // Arrayer för olika spelobjekt
            this.poles = [];
            this.enemies = [];
            this.powerUps = [];
            // Spelspecifika tidsvariabler
            this.startTime;
            this.startTimeForSpeedIncrease;
            // Bilder och ljud för spelet
            this.poleImage = new Image();
            this.poleImage.src = "../game/enemyImages/enemyPole.png";
            this.enemyImages = [
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
            this.backgroundMusic = new Audio('../game/sounds/backgroundMusic.mp3');
            this.startSound = new Audio('../game/sounds/gameStart.mp3');
            this.powerUpSound = new Audio('../game/sounds/powerUp.mp3');
            this.gameOverSound = new Audio('../game/sounds/GameOverSond.mp3');
            this.backgroundMusic.volume = 0.5;
            this.startSound.volume = 1;
            this.powerUpSound.volume = 1;
            this.gameOverSound.volume = 1;
            this.playerImage = new Image();
            this.playerImage.src = '../game/enemyImages/playerImage.svg';
            // Övriga speltillståndsvariabler
            this.score = 0;
            this.elapsedTimeSinceSpeedIncrease = 0;
            this.speedIncreaseInterval = 5;
            this.speedIncreaseAmount = 0.3;
            this.isPlayerControlled = true;
            this.boundMovePlayerToMouse = this.movePlayerToMouse.bind(this);
            this.spawnEnemies = true;
            // Sparar högsta poängen i local storage
            this.highScore = localStorage.getItem('highScore') || 0;
            // Restartknappens egenskaper
            this.restartButton = {
                x: this.canvas.width / 2 - 50,
                y: this.canvas.height / 2 + 50,
                width: 100,
                height: 50,
            };
            // Eventlyssnare för att hantera klick
            this.clickHandler = this.clickHandler.bind(this);
            this.canvas.addEventListener('click', this.clickHandler);
        }
        // Metod för att initiera spelet
    init() {
            this.isRunning = true;
            this.isGameOver = false;
            this.score = 0;
        }
        
        // Metod för att återställa spelet
    clickHandler(event) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (
                x >= this.restartButton.x &&
                x <= this.restartButton.x + this.restartButton.width &&
                y >= this.restartButton.y &&
                y <= this.restartButton.y + this.restartButton.height
            ) {
                this.restart();
            }
        }
        // Metod för att rita ut poles som kommer uppifrån
    spawnPole() {
            const poleHeight = this.canvas.height / 3;
            const pole = {
                x: Math.random() * this.canvas.width,
                y: -500,
                width: 30,
                height: poleHeight,
                image: this.poleImage,
                speed: 2, // Adjust this value to make the poles go slower or faster
            };
            this.poles.length = 0;
            this.poles.push(pole);
        }
        // Metod för att rita ut poles
    drawPoles() {
        this.poles.forEach((pole) => {
            this.ctx.drawImage(pole.image, pole.x, pole.y, pole.width, pole.height);
        });
    }

    // Metod för att rita ut spelaren
    drawPlayer() {
            this.ctx.drawImage(
                this.playerImage,
                this.player.x,
                this.player.y,
                this.player.width,
                this.player.height
            );
        }
        // Metod för att rita ut bakgrundsbilden
    drawBackground() {
            const backgroundImage = new Image();
            backgroundImage.src = '../game/enemyImages/Backgroundimage.jpg'; // Replace with the path to your background image
            this.ctx.drawImage(backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        }
        // Metod för att rita ut powerups
    drawPowerUps() {
            this.powerUps.forEach((powerUp) => {
                powerUp.draw(this.ctx);
            });
        }
        // Metod för att skapa fiender
    spawnEnemy() {
            if (this.spawnEnemies) {
                // Slumpa fram en fiendebild
                const randomImageIndex = Math.floor(
                    Math.random() * this.enemyImages.length
                );
                // Skapa en fiende
                const enemyImage = new Image();
                enemyImage.src = this.enemyImages[randomImageIndex];
                const enemy = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    width: 20,
                    height: 20,
                    image: enemyImage,
                    speed: 3,
                };
                // Lägg till fienden i arrayen
                this.enemies.push(enemy);
            }
        }
        // Metod för att rita ut fiender
    drawEnemies() {
            this.enemies.forEach((enemy) => {
                this.ctx.drawImage(
                    enemy.image,
                    enemy.x,
                    enemy.y,
                    enemy.width,
                    enemy.height
                );
            });
        }
        // Metod för att flytta spelaren till muspekarens position
    movePlayerToMouse(event) {
            this.player.x = event.clientX - this.player.width / 2;
            this.player.y = event.clientY - this.player.height / 2;
        }
        // Metod för att kontrollera kollision 
    checkCollision(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            );
        }
        // Metod för att skapa Power Ups 
    spawnPowerUp() {
            const x = Math.random() * this.canvas.width;
            const y = 0;
            const powerUp = new PowerUp(x, y);
            this.powerUps.push(powerUp);
        }
        // Metod för att uppdatera spelobjekt
    updateGameObjects() {
            this.poles.forEach((pole) => {
                pole.y += pole.speed;

                // Kollar kollision med spelaren
                if (this.checkCollision(this.player, pole)) {
                    this.isGameOver = true;
                }
            });

            this.enemies.forEach((enemy, index) => {
                // Räkna ut avståndet mellan spelaren och fienden
                const dx = this.player.x - enemy.x;
                const dy = this.player.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Räkna ut riktningen för fienden
                const directionX = dx / distance;
                const directionY = dy / distance;

                // Flytta fienden i riktningen mot spelaren
                enemy.x += directionX * enemy.speed;
                enemy.y += directionY * enemy.speed;

                // Kolla kollision med spelaren
                if (this.checkCollision(this.player, enemy)) {
                    this.isGameOver = true;
                }

                // Kolla kollision med andra fiender
                for (let i = 0; i < this.enemies.length; i++) {
                    if (i !== index && this.checkCollision(enemy, this.enemies[i])) {
                        // Knuffa fienderna ifrån varandra så de inte kan staplas på varann
                        const dx = enemy.x - this.enemies[i].x;
                        const dy = enemy.y - this.enemies[i].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const overlap = enemy.width + this.enemies[i].width - distance;

                        const angle = Math.atan2(dy, dx);
                        enemy.x += (Math.cos(angle) * overlap) / 2;
                        enemy.y += (Math.sin(angle) * overlap) / 2;
                        this.enemies[i].x -= (Math.cos(angle) * overlap) / 2;
                        this.enemies[i].y -= (Math.sin(angle) * overlap) / 2;
                    }
                }
            });
            this.powerUps.forEach((powerUp, index) => {
                powerUp.update();

                // Kollar kollision med spelaren
                if (this.checkCollision(this.player, powerUp)) {
                    // Lägger till ljudet för power-up
                    this.powerUpSound.play();

                    // Tar bort power-upen
                    this.powerUps.splice(index, 1);

                    // Tar bort alla fiender och sen spanar upp de igen 
                    this.enemies.length = 0;
                    this.spawnEnemies = false;
                }
            });
            setTimeout(() => {
                this.spawnEnemies = true;
            }, 20000);
        }
        // Metod för att rensa canvas
    clearCanvas() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        // Metod för att uppdatera poäng
    updateScore() {
            const currentTime = new Date().getTime();
            this.score = Math.floor((currentTime - this.startTime) / 1000);
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('highScore', this.highScore);
            }
        }
        // Metod för att rita ut poäng
    drawScore() {
            this.ctx.font = '30px Arial';
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(`Score: ${this.score}`, 10, 50);
            this.ctx.fillText(`High Score: ${this.highScore}`, 10, 90);
        }
        // Metod för att rita ut spelet
    gameLoop() {
            if (!this.isGameOver) {
                if (!this.isPaused) {
                    this.clearCanvas();
                    this.drawBackground();

                    this.updateGameObjects();
                    this.drawPlayer();
                    this.drawPoles();
                    this.drawEnemies();
                    this.updateScore();
                    this.drawScore();
                    this.increaseSpeed();
                    this.drawPowerUps();
                }
                requestAnimationFrame(this.gameLoop.bind(this));
            }
            // Om spelet är över så ritar vi ut en game over text och en restartknapp
            else {
                this.endGame();
                this.drawRestartButton();
            }
        }
        // Metod för att rita ut restartknappen
    drawRestartButton() {
            this.ctx.fillStyle = 'blue';
            this.ctx.fillRect(this.restartButton.x, this.restartButton.y, this.restartButton.width, this.restartButton.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('Restart', this.canvas.width / 2, this.canvas.height / 2 + 75);
        }
        // Metod för att starta spelet
    start() {
            this.isRunning = true;
            this.startTime = new Date().getTime();
            this.startTimeForSpeedIncrease = this.startTime;
            this.canvas.addEventListener("mousemove", this.boundMovePlayerToMouse);
            this.spawnPole();
            this.spawnEnemy();
            this.gameLoop();

            // Spanar fiender var 2 sekund
            this.enemySpawnInterval = setInterval(() => {
                this.spawnEnemy();
            }, 2000);

            // Spanar poles var 5 sekund
            this.poleSpawnInterval = setInterval(() => {
                this.spawnPole();
            }, 5000);
            // Spanar power-ups var 20 sekund
            this.powerUpSpawnInterval = setInterval(() => {
                this.spawnPowerUp();
            }, 20000);
            // Startljduet för spelet
            this.startSound.play();

            // Startar bakgrundsmusiken
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();
        }
        // Metod för att pausa spelet
    togglePause() {
            this.isPaused = !this.isPaused;

            if (this.isPaused) {
                // Rensar intervaler och timeout
                clearInterval(this.enemySpawnInterval);
                clearInterval(this.poleSpawnInterval);
                clearInterval(this.powerUpSpawnInterval);

                clearTimeout(this.enemySpawnTimeout);
                // Tar bort eventlyssnaren för att flytta spelaren
                this.canvas.removeEventListener("mousemove", this.boundMovePlayerToMouse);
            } else {
                // Sätter upp intervaller och timeout
                this.enemySpawnInterval = setInterval(() => {
                    this.spawnEnemy();
                }, 2000);

                this.poleSpawnInterval = setInterval(() => {
                    this.spawnPole();
                }, 5000);

                this.powerUpSpawnInterval = setInterval(() => {
                    this.spawnPowerUp();
                }, 20000);

                this.enemySpawnTimeout = setTimeout(() => {
                    this.enemySpawnInterval = setInterval(() => {
                        this.spawnEnemy();
                    }, 2000);
                }, 20000);
                // Lägger till eventlyssnaren för att flytta spelaren
                this.canvas.addEventListener("mousemove", this.boundMovePlayerToMouse);
            }
        }
        // Metod för att öka hastigheten på fiender och poles
    increaseSpeed() {
        const currentTime = new Date().getTime();
        this.elapsedTimeSinceSpeedIncrease = (currentTime - this.startTime) / 1000;

        if (this.elapsedTimeSinceSpeedIncrease >= this.speedIncreaseInterval) {
            this.player.speed += this.speedIncreaseAmount;
            // Ökar hastigheten på fiender och poles
            this.startTimeForSpeedIncrease = currentTime;
        }
    }

    // Metod för att avsluta spelet
    endGame() {
            this.isRunning = false;
            this.gameOver();
        }
        // Metod för att rita ut game over text och restartknapp
    gameOver() {
            const ctx = this.ctx;
            ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.font = "48px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            // Ritar ut game over texten
            ctx.fillText(
                `Game Over! Your score is: ${this.score}`,
                ctx.canvas.width / 2,
                ctx.canvas.height / 2
            );
            this.isRunning = false;
            this.isGameOver = true;

            // Ritar ut restartknappen
            this.ctx.fillStyle = 'blue';
            this.ctx.fillRect(this.restartButton.x, this.restartButton.y, this.restartButton.width, this.restartButton.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('Restart', this.canvas.width / 2, this.canvas.height / 2 + 75);
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            // Ljudet för game over
            this.gameOverSound.play();
        }
        // Metod för att starta om spelet
    restart() {
        this.isRunning = true;
        this.isGameOver = false;
        this.score = 0;
        this.powerUpScore = 0;
        this.startTime = Date.now();
        this.startTimeForSpeedIncrease = Date.now();
        this.elapsedTimeSinceSpeedIncrease = 0;
        this.isPlayerControlled = true;
        this.spawnEnemies = true;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Rensar alla arrayer
        this.player = {
            x: 50,
            y: 50,
            width: 20,
            height: 20,
            color: "blue",
            speed: 5,
        };
        this.poles = [];
        this.enemies = [];
        this.powerUps = [];

        // Startar bakgrundsmusiken
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();
        }

        this.gameLoop();
    }
}
// Klassen för power-ups
class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 2;
    }

    draw(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }
}
// Klassen för att skapa fiender
document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Skapar startknappen
    const startButton = document.createElement("button");
    startButton.id = "startButton";
    startButton.textContent = "Start Game";
    document.body.appendChild(startButton);
    // Skapar spelet
    const game = new Game(canvas, ctx);
    // Eventlyssnare för pausa och start spelet
    document.addEventListener("keydown", function(event) {
        if (event.key === "p" || event.key === "P") {
            if (!game.isPaused) {
                game.togglePause();
            }
        } else if (event.key === "r" || event.key === "R") {
            if (game.isPaused) {
                game.togglePause();
            }
        }
    });
    // Eventlyssnare för att starta spelet
    startButton.addEventListener("click", function startButtonClickHandler() {
        game.start();
        startButton.style.display = "none";
        startButton.removeEventListener("click", startButtonClickHandler);
    });
});