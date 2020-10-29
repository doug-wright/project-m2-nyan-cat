// In this file we have some data that the other source files will use.
// Most of this data is stored in constants.
// Constants are just variables that never change. By convention,
// We write constants with upper case letters.

// The GAME_WIDTH and GAME_HEIGHT constants denote the size
// of the game area in pixels and is used in engine-utilities.js.
const GAME_WIDTH = 595;
const GAME_HEIGHT = 700;

// These constants represent the width and height of an enemy in pixels
// as well as the maximum number of enemies on screen at any given time.
const ENEMY_WIDTH = 85;
const ENEMY_HEIGHT = 117;
const MAX_ENEMIES = 5;

// These constants represent the player width and height.
const PLAYER_WIDTH = 85;
const PLAYER_HEIGHT = 193;

// Number of extra lives
const EXTRA_LIVES = 2;

// Free life
const FREE_LIFE = 10000;

// shield properties
const SHIELD_INTERVAL = 1250;  // Obtain shields is offered every n points
const SHIELD_TIME = 750;  // How long shields are active
const SHIELDED_POINTS = 300;  // Bonus points for colliding with enemy with sheilds up

// This denotes the range of enemy y positions that is considered a collision.  Decreasing
// COL_END makes it easier to slip between two closely spaced enemies.  Don't touch
// COL_START as this equals the front edge of your ship.
const COL_START = 380;
const COL_END = 600;

// preload the ships and explosion images
const imageURL = ['./images/D7.png',
                  './images/D7-shields.png',
                  './images/enterprise.png',
                  './images/enterprise-shields.png',
                  './images/explosion.gif'];

imageURL.forEach(url => {
  const img = new Image();
  img.src = url;
});