// Create sound class.  Function borrowed from w3shools and converted to a class.
class sound {
  constructor(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = () => {
      this.sound.play();
    };

    this.stop = () => {
      this.sound.pause();
    };
  }
}

// set up sounds
sndMusic = new sound('sounds/music.mp3');
sndExplosion = new sound('sounds/explosion.wav');
sndGameOver = new sound('sounds/game-over.wav');
sndFreeLife = new sound('sounds/free-life.wav');
sndShields = new sound('sounds/shields.wav');  // The sound made when shields are on offer
sndShieldsUp = new sound('sounds/shields-up.wav');  // Player obtained shields
sndShieldWarn = new sound('sounds/shield-warning.wav');  // Shields about to expire
sndShieldedPoints = new sound('sounds/shielded-points.wav');  // Collided with enemey while shields up

// We create an instance of the Engine class. Looking at our index.html,
// we see that it has a div with an id of `"app"`
const gameEngine = new Engine(document.getElementById('app'));

// keydownHandler is a variable that refers to a function. The function has one parameter
// (does the parameter name matter?) which is called event. As we will see below, this function
// will be called every time the user presses a key. The argument of the function call will be an object.
// The object will contain information about the key press, such as which key was pressed.
const keydownHandler = (event) => {
  // event.code contains a string. The string represents which key was press. If the
  // key is left, then we call the moveLeft method of gameEngine.player (where is this method defined?)
  if (event.code === 'ArrowLeft') {
    gameEngine.player.moveLeft();
  }

  // If `event.code` is the string that represents a right arrow keypress,
  // then move our hamburger to the right
  if (event.code === 'ArrowRight') {
    gameEngine.player.moveRight();
  }
};

// We add an event listener to document. document the ancestor of all DOM nodes in the DOM.
// document.addEventListener('keydown', keydownHandler);

// We call the gameLoop method to start the game
gameEngine.gameLoop();
