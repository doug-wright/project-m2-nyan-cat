// There will only be one instance of this class. This instance will contain the
// data and methods related to the burger that moves at the bottom of your screen

class Player {
  // The constructor takes one parameter. This parameter refers to the parent DOM node.
  // We will be adding a DOM element to this parent DOM node.
  constructor(root) {
    // The x position starts off in the middle (ish) of the screen. Since this data is needed every time we move the player, we
    // store the data in a property of the instance. It represents the distance from the left margin of the browsing area to
    // the leftmost x position of the image.
    // this.x = 2 * PLAYER_WIDTH;
    this.x = Math.trunc((GAME_WIDTH / PLAYER_WIDTH) / 2) * 85;

    // The y position never changes, so we don't need to store it in a property. It represents the y position of the top of the
    // hamburger. The y position is the distance from the top margin of the browsing area.
    const y = GAME_HEIGHT - PLAYER_HEIGHT - 10;

    // Lives
    this.livesRemaining = EXTRA_LIVES;

    // Deflector shields
    this.hasShields = false;
    this.shieldTimer = SHIELD_TIME;

    // We create a DOM node. We will be updating the DOM node every time we move the player, so we store a reference to the
    // DOM node in a property.
    this.domElement = document.createElement('img');
    this.domElement.src = 'images/enterprise.png';
    this.domElement.style.position = 'absolute';
    this.domElement.style.left = `${this.x}px`;
    this.domElement.style.top = `${y}px`;
    this.domElement.style.zIndex = '10';
    root.appendChild(this.domElement);
  }

  sndMove = new sound('sounds/move.wav');

  // This method will be called when the user presses the left key. See in Engine.js
  // how we relate the key presses to this method
  moveLeft() {
    if (this.x > 0) {
      this.x = this.x - PLAYER_WIDTH;
      this.sndMove.play();
      this.snd
    }

    this.domElement.style.left = `${this.x}px`;
  }

  // We do the same thing for the right key. See Engine.js to see when this happens.
  moveRight() {
    if (this.x + PLAYER_WIDTH < GAME_WIDTH) {
      this.x = this.x + PLAYER_WIDTH;
      this.sndMove.play();
    }
    this.domElement.style.left = `${this.x}px`;
  }
}
