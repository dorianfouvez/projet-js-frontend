import Phaser from "phaser";
import ScoreLabel from "./ScoreLabel.js";
import LadyBugSpawner from "./LadyBugSpawner.js";
import ZombieSpawner from "./ZombieSpawner.js";

const LADYBUG_KEY = "ladyBug";
const ZOMBIE_KEY = "zombie";

const PATH_ASSETS = "../assets/";
const PATH_ENEMIES = PATH_ASSETS + "enemies/";
const PATH_MAPS = PATH_ASSETS + "maps/";
const PATH_PLAYERS = PATH_ASSETS + "players/";
const PATH_TILESHEETS = PATH_ASSETS + "tilesheets/";

const PLAYER_SPEED = 80;
const MAP_RESIZING_FACTOR = 0.5;
const PLAYER_RESIZING_FACTOR = 0.1;

let isDebugingGraphicsAllowed = false;
let isDebugingKeyDown = false;

class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
    this.player = undefined;
    this.cursors = undefined;
    this.debugGraphics = undefined;
    this.debugingKey = undefined;
    this.scoreLabel = undefined;
    this.ladyBugSpawner = undefined;
    this.currentMap = undefined;
    this.warpObjects = undefined;
    this.isReadyToTP = undefined;
    this.gameOver = false;
    this.ZombieSpawner = undefined;
    //Idle and action attribut
    this.lastDirection = "F";
    //controls
    this.keys = undefined
  }

  preload() {
    // Maps
    this.load.image("tiles", PATH_TILESHEETS + "winter.png");
    this.load.tilemapTiledJSON("map", PATH_MAPS + "mapTest.json");

    this.load.tilemapTiledJSON("mapDodo", PATH_MAPS + "mapTestDorian.json");

    // Enemies
    this.load.image(LADYBUG_KEY, PATH_ENEMIES + "ladyBug.png");
    this.load.atlas(ZOMBIE_KEY,PATH_ENEMIES+"zombie.png",PATH_ENEMIES+"zombieAtlas.json");

    // Players
    this.load.atlas("playerFront", PATH_PLAYERS+"WarriorMaleFrontAtlas.png", PATH_PLAYERS+"WarriorMaleFrontAtlas.json");
    this.load.atlas("playerBack", PATH_PLAYERS+"WarriorMaleBackAtlas.png", PATH_PLAYERS+"WarriorMaleBackAtlas.json");
    this.load.atlas("playerLeft", PATH_PLAYERS+"WarriorMaleLeftAtlas.png", PATH_PLAYERS+"WarriorMaleLeftAtlas.json");
    this.load.atlas("playerRight", PATH_PLAYERS+"WarriorMaleRightAtlas.png", PATH_PLAYERS+"WarriorMaleRightAtlas.json");

    //Controls
    this.keys = this.input.keyboard.addKeys({
      up: this.input.keyboard.addKey('z'),
      down: this.input.keyboard.addKey('s'),
      left: this.input.keyboard.addKey('q'),
      right: this.input.keyboard.addKey('d'),
      atq1: this.input.keyboard.addKey("LEFT"),
      atq2: this.input.keyboard.addKey("RIGHT"),
      run: this.input.keyboard.addKey("SHIFT"),
      interact: this.input.keyboard.addKey('e')
    })
  }

  create() {
    this.isReadyToTP = false;
    //console.log(this.currentMap);
    //console.log(game.world);

    // Set all layers of the map in params
    this.setLayer();
    
    // Set the Bounds of the map
    this.physics.world.setBounds(0,0,this.tilemap.widthInPixels*MAP_RESIZING_FACTOR,this.tilemap.heightInPixels*MAP_RESIZING_FACTOR);
    
    // Player
    this.player = this.createPlayer();

    this.manageObjects();
    this.manageColliders();
    
    // Enemies
    this.ladyBugSpawner = new LadyBugSpawner(this, LADYBUG_KEY);
    const ladyBugsGroup = this.ladyBugSpawner.group;
    this.ladyBugSpawner.spawn(this.player.x);
    this.zombieSpawner = new ZombieSpawner(this, ZOMBIE_KEY);
    const zombieGroup = this.zombieSpawner.group;
    this.zombieSpawner.spawn(this.player.x);

    // Cameras
    this.manageCamera();
  
    // Cursors && Keyboards
    this.cursors = this.input.keyboard.createCursorKeys();
    this.debugingKey = this.input.keyboard.addKey('C');

    this.codeKonami();

    console.log(this.warpObjects);
  }
  
  update() {

    if (this.gameOver) {
      return;
    }
    
    /* FOR DEBUGGING !!! Make all colliding object colloring in ORANGE ! */
    if(this.debugingKey.isDown && !isDebugingKeyDown){
      isDebugingGraphicsAllowed = !isDebugingGraphicsAllowed;
      this.setDebugingGraphics();
      isDebugingKeyDown = !isDebugingKeyDown;
    }else if(this.debugingKey.isUp && isDebugingKeyDown){
      isDebugingKeyDown = !isDebugingKeyDown;
    }

    if(this.player.ableToMove){
      let runSpeed;
      if(this.keys.run.isDown){
        runSpeed = 100;
      } else {
        runSpeed = 0;
      }

      if (this.keys.up.isDown) {
        this.player.setVelocityY(-(PLAYER_SPEED + runSpeed));
        if(this.keys.left.isUp && this.keys.right.isUp){
          this.lastDirection = "B";
          if(runSpeed != 0){
            this.player.anims.play("playerBackRun", true);
          } else {
            this.player.anims.play("playerBackWalk", true);
          }
        }
      } else if (this.keys.down.isDown) {
        this.player.setVelocityY(PLAYER_SPEED + runSpeed);
        if(this.keys.left.isUp && this.keys.right.isUp){
          this.lastDirection = "F";
          if(runSpeed != 0){
            this.player.anims.play("playerFrontRun", true);
          } else {
            this.player.anims.play("playerFrontWalk", true);
          }
        }
      } else {
        this.player.setVelocityY(0);

        if(this.lastDirection == "F")
          this.player.anims.play("playerFrontIdle", true);
        else if(this.lastDirection == "B")
          this.player.anims.play("playerBackIdle", true);
      }

      if (this.keys.left.isDown) {
        this.player.setVelocityX(-(PLAYER_SPEED + runSpeed));
        this.lastDirection = "L";
        if(runSpeed != 0){
          this.player.anims.play("playerLeftRun", true);
        } else {
          this.player.anims.play("playerLeftWalk", true);
        }
      } else if (this.keys.right.isDown) {
        this.lastDirection = "R";
        this.player.setVelocityX(PLAYER_SPEED + runSpeed);
        if(runSpeed != 0){
          this.player.anims.play("playerRightRun", true);
        } else {
          this.player.anims.play("playerRightWalk", true);
        }
      } else {
        this.player.setVelocityX(0);

        if(this.lastDirection == "L")
          this.player.anims.play("playerLeftIdle", true);
        else if(this.lastDirection == "R")
          this.player.anims.play("playerRightIdle", true);
      }

    }
  }

  setLayer() {
    //if(!this.currentMap) this.currentMap = "map";
    switch(this.currentMap){
      case "map":
        // Images of Maps
        this.tilemap = this.make.tilemap({key: "map"});
        this.tileset = this.tilemap.addTilesetImage("Winter","tiles");

        this.landLayer = this.tilemap.createStaticLayer("land",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldLayer = this.tilemap.createStaticLayer("world",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.topLayer = this.tilemap.createStaticLayer("cityRoad",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.cityLayer = this.tilemap.createStaticLayer("City",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.cityBuild1Layer = this.tilemap.createStaticLayer("CityBuild1",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.cityBuild2Layer = this.tilemap.createStaticLayer("CityBuild2",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.cityBuild3Layer = this.tilemap.createStaticLayer("CityBuild3",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.cityBuild4Layer = this.tilemap.createStaticLayer("CityBuild4",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.cityBuild5Layer = this.tilemap.createStaticLayer("CityBuild5",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.cityBuild6Layer = this.tilemap.createStaticLayer("Citybuild6",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.abovePlayerLayer = this.tilemap.createStaticLayer("AbovePlayer",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        //this.overlapLayer = this.tilemap.createDynamicLayer("overlap",this.tileset,0,0); // pour claques avec objets récoltable ou pique qui font mal

        // By default, everything gets depth sorted on the screen in the order we created things. Here, we
        // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
        // Higher depths will sit on top of lower depth objects
        this.abovePlayerLayer.setDepth(10);

        // Set the point for changing the map
        this.warpObjects = [];
        break;
      case "mapDodo":
        // Images of Maps
        this.tilemap = this.make.tilemap({key: "mapDodo"});
        this.tileset = this.tilemap.addTilesetImage("winter","tiles");

        // Layers of Dorian's Map
        this.downLayer = this.tilemap.createStaticLayer("bottom",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldLayer = this.tilemap.createStaticLayer("world",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.topLayer = this.tilemap.createStaticLayer("top",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.overlapLayer = this.tilemap.createDynamicLayer("overlap",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);

        // Set depths of the layers
        this.topLayer.setDepth(10);

        // Set the point for changing the map
        this.warpObjects = [];
        break;
      default:
        this.currentMap = "map"
        this.setLayer();
        break;
    }
  }
  
  manageObjects(){
    switch(this.currentMap){
      case "map":
        //let nextMap = this.tilemap.findObject("Objects", obj => obj.name === "nextMap").properties[0].value;
        break;
      case "mapDodo":
        // Changing Map Objects
        let entryHouse = this.tilemap.findObject("Objects", obj => obj.name === "entryHouse");
        //entryHouse.x *= MAP_RESIZING_FACTOR;
        this.warpObjects.push(entryHouse);

        this.warpObjects.forEach(element => {
          element.x *= MAP_RESIZING_FACTOR;
          element.y *= MAP_RESIZING_FACTOR;
          // Set an image On each element For Debuging
          this.add.sprite(element.x,element.y,"ladyBug").setScale(0.4);
        });
        
        break;
      default:
        this.currentMap = "map"
        this.manageObjects();
        break;
    }
  }

  manageColliders(){
    switch(this.currentMap){
      case "map":
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.cityLayer.setCollisionByProperty({ collides: true });
        this.cityBuild1Layer.setCollisionByProperty({ collides: true });
        this.cityBuild2Layer.setCollisionByProperty({ collides: true });
        this.cityBuild3Layer.setCollisionByProperty({ collides: true });
        this.cityBuild4Layer.setCollisionByProperty({ collides: true });
        this.cityBuild5Layer.setCollisionByProperty({ collides: true });
        this.cityBuild6Layer.setCollisionByProperty({ collides: true });

        // Colliders
        this.physics.add.collider(this.player, this.worldLayer);
        this.physics.add.collider(this.player, this.cityLayer);
        this.physics.add.collider(this.player, this.cityBuild1Layer);
        this.physics.add.collider(this.player, this.cityBuild2Layer);
        this.physics.add.collider(this.player, this.cityBuild3Layer);
        this.physics.add.collider(this.player, this.cityBuild4Layer);
        this.physics.add.collider(this.player, this.cityBuild5Layer);
        this.physics.add.collider(this.player, this.cityBuild6Layer);


        // OverLaps


        break;
      case "mapDodo":
        this.worldLayer.setCollisionByProperty({ Collides: true });

        // Colliders
        this.physics.add.collider(this.player, this.worldLayer);

        // OverLaps
        this.physics.add.overlap(this.player, this.overlapLayer);
        this.overlapLayer.setTileIndexCallback((2249+1), this.changeMap, this);
        
        break;
      default:
        this.currentMap = "map"
        this.manageColliders();
        break;
    }
  }

  setDebugingGraphics() {
    if(isDebugingGraphicsAllowed) {
      this.debugGraphics = this.add.graphics().setAlpha(PLAYER_RESIZING_FACTOR).setDepth(20);
      switch(this.currentMap){
        case "map":
          this.worldLayer.renderDebug(this.debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          /*this.cityLayer.renderDebug(this.debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });*/
          /*this.cityBuild1Layer.renderDebug(this.debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });*/
          /*this.cityBuild2Layer.renderDebug(this.debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });*/
          /*this.cityBuild3Layer.renderDebug(this.debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });*/
          /*this.cityBuild4Layer.renderDebug(this.debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });*/
          /*this.cityBuild5Layer.renderDebug(this.debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });*/
          /*this.cityBuild6Layer.renderDebug(this.debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });*/
          break;
        case "mapDodo":
          this.worldLayer.renderDebug(this.debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          break;
      }
    }else if(this.debugGraphics){
      this.debugGraphics.destroy();
    }
  }

  createPlayer() {
    const player = this.physics.add.sprite(900, 450, "playerFront", "Warrior_Idle_Blinking_0").setScale(PLAYER_RESIZING_FACTOR).setSize(170, 170).setOffset(470,670);
    player.setCollideWorldBounds(true);

    player.ableToMove = true;

    this.anims.create({
      key: "playerFrontWalk",
      frames: this.anims.generateFrameNames("playerFront", {prefix: "Warrior_Walk_", start: 0, end: 29}),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "playerFrontRun",
      frames: this.anims.generateFrameNames("playerFront", {prefix: "Warrior_Run_", start: 0, end: 14}),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "playerFrontIdle",
      frames: this.anims.generateFrameNames("playerFront", {prefix: "Warrior_Idle_Blinking_", start: 0, end: 29}),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: "playerBackWalk",
      frames: this.anims.generateFrameNames("playerBack", {prefix: "Warrior_Walk_", start: 0, end: 29}),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "playerBackRun",
      frames: this.anims.generateFrameNames("playerBack", {prefix: "Warrior_Run_", start: 0, end: 14}),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "playerBackIdle",
      frames: this.anims.generateFrameNames("playerBack", {prefix: "Warrior_Idle_", start: 0, end: 29}),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: "playerLeftWalk",
      frames: this.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Walk_", start: 0, end: 29}),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "playerLeftRun",
      frames: this.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Run_", start: 0, end: 14}),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "playerLeftIdle",
      frames: this.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Idle_Blinking_", start: 0, end: 29}),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: "playerRightWalk",
      frames: this.anims.generateFrameNames("playerRight", {prefix: "Warrior_Walk_", start: 0, end: 29}),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "playerRightRun",
      frames: this.anims.generateFrameNames("playerRight", {prefix: "Warrior_Run_", start: 0, end: 14}),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "playerRightIdle",
      frames: this.anims.generateFrameNames("playerRight", {prefix: "Warrior_Idle_Blinking_", start: 0, end: 29}),
      frameRate: 15,
      repeat: -1
    });

    return player;
  }

  manageCamera() {
    this.cameras.main.startFollow(this.player);
    console.log(this.tilemap.widthInPixels*MAP_RESIZING_FACTOR,this.tilemap.heightInPixels);
    this.cameras.main.setBounds(0,0,this.tilemap.widthInPixels*MAP_RESIZING_FACTOR,this.tilemap.heightInPixels*MAP_RESIZING_FACTOR);
  }

  changeMap(player, tile){
    this.player.ableToMove = false;
    if(!this.isReadyToTP){
      this.physics.moveTo(this.player,this.warpObjects[0].x+5,this.warpObjects[0].y,100);
      console.log(player, tile);
      console.log(tile.index, tile.properties.TP);
    }

    if(this.player.x > (this.warpObjects[0].x - 1) && this.player.x < (this.warpObjects[0].x + 5) && this.player.y > (this.warpObjects[0].y - 1) && this.player.y < (this.warpObjects[0].y + 2)){
      this.player.body.stop();
      this.isReadyToTP = true;
      this.currentMap = tile.properties.TP;
      this.scene.restart();
      //this.changeMap(tile.properties.TP);
      //this.player.ableToMove = true;
    }
  }
  
  codeKonami(){
    //  Lien pour les keyCodes : https://github.com/photonstorm/phaser/blob/v3.22.0/src/input/keyboard/keys/KeyCodes.js
    //  37 = LEFT
    //  38 = UP
    //  39 = RIGHT
    //  40 = DOWN
    //  65  = A
    //  66  = B

    var combo = this.input.keyboard.createCombo([ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65 ], { resetOnMatch: true });
    let jeu = this;

    this.input.keyboard.on('keycombomatch', function (event) {

        console.log('Konami Code entered!');

        jeu.currentMap = "mapDodo";
        jeu.scene.restart();
    });
  }

}

export default GameScene;
