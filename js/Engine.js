// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
    // We add the background image to the game
    addBackground(this.root);

    // setup the scoreboard
    this.score = 0;
    this.scoreBoard = new Text(this.root, 20, 20, '60px');
    this.scoreBoard.update(this.score);

    // setup lives indicator
    this.showLives = new Text(this.root, GAME_WIDTH - 80, 20, '60px');
    this.showLives.update(this.player.livesRemaining.toString().padStart(2, '0'));

    // setup count down timer container
    this.countDownCtn = new Text(this.root, GAME_WIDTH / 2 - 100, 200, '60px');

    // initialize count down timer
    this.countDown = 150;

    // setup game over indicator
    this.gameOver = new Text(this.root, GAME_WIDTH / 2 - 145, 300, '80px');

    // other game play variables
    this.gameRunning = false;
    this.offerShields = false;
    this.colInProgress = false;
    this.colDetect = false;
    this.shieldBonus = false;
    this.freeLife = FREE_LIFE;
    this.shieldInterval = SHIELD_INTERVAL;
  }

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array

  gameLoop = () => {
    if (!this.gameRunning) {
      createStartBtn();  // create the start game button
      this.gameRunning = true;  
    } else {
      // remove the start game button
      const startBtn = document.querySelector('.start-btn');
      startBtn.removeEventListener('click', gameEngine.gameLoop);
      startBtn.style.display = 'none';

      if (this.countDown < 1) {
        sndMusic.play();
        document.addEventListener('keydown', keydownHandler);

        // restore enterprise image after explosion
        if (this.player.domElement.src !== 'images/enterprise.png' && !this.player.hasShields) {
          this.player.domElement.src = 'images/enterprise.png';
          this.player.domElement.style.left = this.player.x;
        }

        this.countDownCtn.update('');

        // This code is to see how much time, in milliseconds, has elapsed since the last
        // time this method was called.
        // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
        if (this.lastFrame === undefined) {
          this.lastFrame = new Date().getTime();
        }

        let timeDiff = new Date().getTime() - this.lastFrame;

        this.lastFrame = new Date().getTime();
        // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
        // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
        this.enemies.forEach((enemy) => {
          enemy.update(timeDiff);
        });

        // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
        // We use filter to accomplish this.
        // Remember: this.enemies only contains instances of the Enemy class.
        this.enemies = this.enemies.filter((enemy) => {
          return !enemy.destroyed;
        });

        // We need to perform the addition of enemies until we have enough enemies.
        while (this.enemies.length < MAX_ENEMIES) {
          // We find the next available spot and, using this spot, we create an enemy.
          // We add this enemy to the enemies array
          const spot = nextEnemySpot(this.enemies);
          this.enemies.push(new Enemy(this.root, spot, this.offerShields));
          this.offerShields = false;
        }

        // if any enemies are currently offering shields, play a sound
        this.enemies.forEach(enemy => {
          if (enemy.shieldProvider) {
            sndShields.play();
          }
        });

        // We check if the player is dead. If he is, we alert the user
        // and return from the method (Why is the return statement important?)
        if (this.isPlayerDead()) {
          // change the player image to an explosion and play sound
          this.player.domElement.src = 'images/explosion.gif';
          this.player.domElement.style.left = this.player.x - 60;
          sndExplosion.play();

          // check how many lives are remaining
          if (this.player.livesRemaining === 0) {
            setTimeout(() => {
              sndMusic.stop();
              sndGameOver.play();
              this.gameOver.update('Game Over');
            }, 2500);
            return;
          } else {
            this.player.livesRemaining--;
            this.showLives.update(this.player.livesRemaining.toString().padStart(2, '0'));
          }
        }

        // if the player currently has shields has the timer expired?
        if (this.player.hasShields) {
          this.player.shieldTimer--;

          if (this.player.shieldTimer < 100) {
            sndShieldWarn.play();
          }

          if (this.player.shieldTimer < 1) {
            this.player.hasShields = false;
            this.player.domElement.src = 'images/enterprise.png';
            this.shieldInterval = this.score + SHIELD_INTERVAL;
          }
        }

        // update the score
        this.updateScore(1);

        // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
        setTimeout(this.gameLoop, 20);

      } else {
        this.countDown--;
        this.countDownCtn.update('Ready... ' + Math.round(this.countDown / 50));
        setTimeout(this.gameLoop, 20);
      }
    }
  };

  // The player is dead if a collision occurs
  isPlayerDead = () => {
    let isDead = false;

    // loop through all the enemies and compare their positions with the player
    this.colDetect = false;
    this.enemies.forEach(enemy => {
      if (enemy.y > COL_START && enemy.y < COL_END && enemy.x === this.player.x) {
        this.colDetect = true;
        isDead = this.processCollision(enemy);
      }
    });

    if (this.colDetect) {
      this.colInProgress = true;
    } else {
      this.colInProgress = false;
      this.shieldBonus = false;
    }

    return isDead;
  }

  // a function to handle everything to do with the scoreboard and bonus points
  updateScore = (points) => {
    this.score += points;
    this.scoreBoard.update(this.score);

    // Is it time to offer the player shields?
    if (this.score > this.shieldInterval && !this.player.hasShields) {
      this.offerShields = true;
      this.shieldInterval = this.score + SHIELD_INTERVAL;
    }

    // check for free life
    if (this.score > this.freeLife) {
      sndFreeLife.play();
      this.player.livesRemaining++;
      this.showLives.update(this.player.livesRemaining.toString().padStart(2, '0'));
      this.freeLife = this.score + FREE_LIFE;
    }
  }

  // a function to decide what to do when there is a collision
  processCollision = (enemy) => {
    if (this.player.hasShields) {
      if (!this.shieldBonus  && !enemy.shieldProvider) {
        enemy.domElement.style.transform = 'scale(0.5)';
        sndShieldedPoints.play();
        this.updateScore(SHIELDED_POINTS);
        this.shieldBonus = true;
      }
    } else {
      if (enemy.shieldProvider) {
        this.player.hasShields = true;
        this.player.domElement.src = 'images/enterprise-shields.png';
        sndShieldsUp.play();
        this.player.shieldTimer = SHIELD_TIME;
        return false;  // Player is alive
      } else {
        document.removeEventListener('keydown', keydownHandler);
        this.player.hasShields = false;
        this.countDown = 150;
        return true;  // Player is dead
      }
    }
  }
}
