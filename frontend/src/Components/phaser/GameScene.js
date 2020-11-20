import Phaser from "phaser";
import ScoreLabel from "./ScoreLabel.js";
import LadyBugSpawner from "./LadyBugSpawner.js";

const PLAYER_KEY = "player";
const LADYBUG_KEY = "bomb";

const PATH_ASSETS = "../assets/";
const PATH_ENEMIES = PATH_ASSETS + "enemies/";
const PATH_MAPS = PATH_ASSETS + "maps/";
const PATH_PLAYERS = PATH_ASSETS + "players/";
const PATH_TILESHEETS = PATH_ASSETS + "tilesheets/";

const PLAYER_SPEED = 160;

class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.stars = undefined;
    this.ladyBugSpawner = undefined;
    this.gameOver = false;
  }

  preload() {
    // Maps
    this.load.image("tiles", PATH_TILESHEETS + "winter.png");
    this.load.tilemapTiledJSON("map", PATH_MAPS + "mapTest.json");

    // Enemies
    //this.load.image(LADYBUG_KEY, PATH_ENEMIES + "ladyBug.png");

    // Players
    this.load.atlas(PLAYER_KEY, PATH_PLAYERS+"player.png", PATH_PLAYERS+"playerAtlas.json");
  }

  create() {
    // Images of Maps
    this.tilemap = this.make.tilemap({key: "map"});
    this.tileset = this.tilemap.addTilesetImage("Winter","tiles");

    // Set all levels of the map
    this.setLayer();

    this.physics.world.setBounds(0,0,this.tilemap.widthInPixels,this.tilemap.heightInPixels);

    // Player
    this.player = this.createPlayer();
    
    // Enemies
    this.ladyBugSpawner = new LadyBugSpawner(this, LADYBUG_KEY);
    const ladyBugsGroup = this.ladyBugSpawner.group;

    // Cameras
    this.manageCamera();
  
    // Cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    /* FOR DEBUGGING !!! Make all colliding object colloring in ORAGNE ! */
    this.setDebugingGraphics();
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-PLAYER_SPEED);
      this.player.anims.play("playerWalk", true);
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(PLAYER_SPEED);
      this.player.anims.play("playerWalk", true);
      this.player.flipX = false;
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("playerDown");
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-PLAYER_SPEED);
      this.player.anims.play("playerUp");
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(PLAYER_SPEED);
      this.player.anims.play("playerDown");
    } else {
      this.player.setVelocityY(0);
    }

  }

  setLayer() {
    this.downLayer = this.tilemap.createStaticLayer("land",this.tileset,0,0);
    this.worldLayer = this.tilemap.createStaticLayer("world",this.tileset,0,0);
    this.topLayer = this.tilemap.createStaticLayer("cityRoad",this.tileset,0,0);
    this.topLayer = this.tilemap.createStaticLayer("City",this.tileset,0,0);
    this.topLayer = this.tilemap.createStaticLayer("CityBuild1",this.tileset,0,0);
    this.topLayer = this.tilemap.createStaticLayer("CityBuild2",this.tileset,0,0);
    this.topLayer = this.tilemap.createStaticLayer("CityBuild3",this.tileset,0,0);
    this.topLayer = this.tilemap.createStaticLayer("CityBuild4",this.tileset,0,0);
    this.topLayer = this.tilemap.createStaticLayer("CityBuild5",this.tileset,0,0);
    this.topLayer = this.tilemap.createStaticLayer("Citybuild6",this.tileset,0,0);
    //this.overlapLayer = this.tilemap.createDynamicLayer("overlap",this.tileset,0,0); // pour claques avec objets récoltable ou pique qui font mal
  }

  setDebugingGraphics() {
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.worldLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 450, PLAYER_KEY, "adventurer_stand");
    player.setCollideWorldBounds(true);
    
    this.anims.create({
      key : "playerWalk",
      frames : this.anims.generateFrameNames(PLAYER_KEY, {prefix: "adventurer_walk", start:1, end: 2}),
      frameRate : 5,
      repeat : -1 /* -1 value tells the animation to loop. */
    });

    this.anims.create({
      key : "playerDown",
      frames : [{key: PLAYER_KEY, frame: "adventurer_stand"}],
      frameRate : 5,
      repeat : -1
    });

    this.anims.create({
      key : "playerUp",
      frames : [{key: PLAYER_KEY, frame: "adventurer_back"}],
      frameRate : 5,
      repeat : -1
    });

    // exemple of anims with more then 1 frame without following in the Atlas
    /*this.anims.create({
      key : "playerIdle",
      frames : [
          {key: PLAYER_KEY, frame: "adventurer_stand"},
          {key: PLAYER_KEY, frame: "adventurer_idle"}
      ],
      frameRate : 2,
      repeat : -1
    });*/

    return player;
  }

  manageCamera() {
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0,0,this.tilemap.widthInPixels,this.tilemap.heigthInPixels);
  }

}

export default GameScene;
