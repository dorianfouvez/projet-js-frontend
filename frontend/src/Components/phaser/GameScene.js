import Phaser from "phaser";
import ScoreLabel from "./ScoreLabel.js";
import LadyBugSpawner from "./LadyBugSpawner.js";
import ZombieSpawner from "./ZombieSpawner.js";

const PLAYER_KEY = "player";
const LADYBUG_KEY = "ladyBug";
const ZOMBIE_KEY = "zombie";

const PATH_ASSETS = "../assets/";
const PATH_ENEMIES = PATH_ASSETS + "enemies/";
const PATH_MAPS = PATH_ASSETS + "maps/";
const PATH_PLAYERS = PATH_ASSETS + "players/";
const PATH_TILESHEETS = PATH_ASSETS + "tilesheets/";

const PATH_ASSETS_SOUNDS = PATH_ASSETS + "sounds/";

const PLAYER_SPEED = 160;
const MAP_RESIZING_FACTOR = 0.5;
const PLAYER_RESIZING_FACTOR = 0.75;

let isDebugingGraphicsAllowed = false;
let isDebugingKeyDown = false;

class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
    this.player = undefined;
    this.cursors = undefined;
    this.debugGraphics = [];
    this.debugingKey = undefined;
    this.scoreLabel = undefined;
    this.ladyBugSpawner = undefined;
    this.currentMap = undefined;
    this.warpObjects = undefined;
    this.isReadyToTP = undefined;
    this.gameOver = false;
    this.ZombieSpawner = undefined;
    this.bgm = undefined;
  }

  preload() {
    // Maps
    this.load.image("tiles", PATH_TILESHEETS + "winter.png");
    this.load.image("tilesExtruded", PATH_TILESHEETS + "winter-extruded.png");

    this.load.tilemapTiledJSON("map", PATH_MAPS + "mapTest.json");
    this.load.tilemapTiledJSON("mapDodo", PATH_MAPS + "mapTestDorian.json");

    // Enemies
    this.load.image(LADYBUG_KEY, PATH_ENEMIES + "ladyBug.png");
    this.load.atlas(ZOMBIE_KEY,PATH_ENEMIES+"zombie.png",PATH_ENEMIES+"zombieAtlas.json");

    // Players
    this.load.atlas(PLAYER_KEY, PATH_PLAYERS+"player.png", PATH_PLAYERS+"playerAtlas.json");

    // Audios
    //this.load.audio("explosionSound","explosion.ogg");
    this.load.audio("bgm_cimetronelle", PATH_ASSETS_SOUNDS+"Pokemon Em Cimetronelle.ogg");
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

    //(this.warpObjects);

    this.setAudio();
  }
  
  update(time, delta) {
    if (this.gameOver) {
      return;
    }
    
    /* FOR DEBUGGING !!! Make all colliding object colloring in ORANGE ! */
    this.checkDebugingKey();

    if(this.player.ableToMove){
    let runSpeed;
    if(this.cursors.shift.isDown){
      runSpeed = 100;
    } else {
      runSpeed = 0;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-(PLAYER_SPEED + runSpeed));
      if(runSpeed != 0){
        this.player.anims.play("playerRun", true);
      } else {
        this.player.anims.play("playerWalk", true);
      }
      this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(PLAYER_SPEED + runSpeed);
      if(runSpeed != 0){
        this.player.anims.play("playerRun", true);
      } else {
        this.player.anims.play("playerWalk", true);
      }
      this.player.flipX = false;
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("playerDown");
    }
    
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-(PLAYER_SPEED + runSpeed));
      if(runSpeed != 0){
        this.player.anims.play("playerRunUp", true); // a changer ici, animation de sprint vers le haut
      } else {
        this.player.anims.play("playerUp", true);
      }
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(PLAYER_SPEED + runSpeed);
      if(runSpeed != 0){
        this.player.anims.play("playerRunDown", true); // a changer ici, animation de sprint vers le bas
      } else {
        this.player.anims.play("playerDown", true);
      }
    } else {
      this.player.setVelocityY(0);
    }

    }

   /* if(this.player.x >this.end.x - 2 && this.player.x < this.end.x +2){
      this.end = this.tilemap.findObject("Objects", obj => obj.name === "end");
    }*/
  }

  setLayer() {
    //if(!this.currentMap) this.currentMap = "map";
    switch(this.currentMap){
      case "map":
        // Images of Maps
        this.tilemap = this.make.tilemap({key: "map"});
        this.tileset = this.tilemap.addTilesetImage("Winter","tilesExtruded");

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
        this.tileset = this.tilemap.addTilesetImage("winter","tilesExtruded");

        // Layers of Dorian's Map
        this.downLayer = this.tilemap.createStaticLayer("bottom",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldLayer = this.tilemap.createStaticLayer("world",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldSecondFloorLayer = this.tilemap.createStaticLayer("worldSecondFloor",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldThirdFloorLayer = this.tilemap.createStaticLayer("worldThirdFloor",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
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

  checkDebugingKey(){
    if(this.debugingKey.isDown && !isDebugingKeyDown){
      console.log("coucou");
      isDebugingGraphicsAllowed = !isDebugingGraphicsAllowed;
      this.setDebugingGraphics();
      isDebugingKeyDown = !isDebugingKeyDown;
    }else if(this.debugingKey.isUp && isDebugingKeyDown){
      isDebugingKeyDown = !isDebugingKeyDown;
    }
  }

  setDebugingGraphics() {
    if(isDebugingGraphicsAllowed) {
      //this.debugGraphics = this.add.graphics().setAlpha(PLAYER_RESIZING_FACTOR).setDepth(20);
      this.debugGraphics.push(this.add.graphics().setAlpha(PLAYER_RESIZING_FACTOR).setDepth(20));
      switch(this.currentMap){
        case "map":
          this.worldLayer.renderDebug(this.debugGraphics[0], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(PLAYER_RESIZING_FACTOR).setDepth(20));
          this.cityLayer.renderDebug(this.debugGraphics[1], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(PLAYER_RESIZING_FACTOR).setDepth(20));
          this.cityBuild1Layer.renderDebug(this.debugGraphics[2], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(PLAYER_RESIZING_FACTOR).setDepth(20));
          this.cityBuild2Layer.renderDebug(this.debugGraphics[3], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(PLAYER_RESIZING_FACTOR).setDepth(20));
          this.cityBuild3Layer.renderDebug(this.debugGraphics[4], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(PLAYER_RESIZING_FACTOR).setDepth(20));
          this.cityBuild4Layer.renderDebug(this.debugGraphics[5], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(PLAYER_RESIZING_FACTOR).setDepth(20));
          this.cityBuild5Layer.renderDebug(this.debugGraphics[6], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(PLAYER_RESIZING_FACTOR).setDepth(20));
          this.cityBuild6Layer.renderDebug(this.debugGraphics[7], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          break;
        case "mapDodo":
          this.worldLayer.renderDebug(this.debugGraphics[0], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          break;
      }
    }else if(this.debugGraphics[0]){
      //this.debugGraphics.destroy();
      this.debugGraphics.forEach(element => {
        element.destroy();
      });
      this.debugGraphics = [];
    }
  }

  setAudio(){
    this.clearAudio();
    
    // Set BGM
    this.manageBGM();
  }

  clearAudio(){
    // Clear Possible BGM
    if(this.bgm) this.bgm.stop();
  }

  manageBGM(){
    switch (this.currentMap) {
      case "map":

        break;
      case "mapDodo":
        this.bgm = this.sound.add("bgm_cimetronelle", { loop: true });
        this.bgm.play();
        this.bgm.volume = 0.1;

        break;
      default:
        this.currentMap = "map"
        this.manageBGM();
        break;
    }
  }

  createPlayer() {
    const player = this.physics.add.sprite(900, 450, PLAYER_KEY, "adventurer_stand").setScale(PLAYER_RESIZING_FACTOR).setSize(60, 50).setOffset(10,60);
    player.setCollideWorldBounds(true);

    player.ableToMove = true;
    
    this.anims.create({
      key : "playerWalk",
      frames : this.anims.generateFrameNames(PLAYER_KEY, {prefix: "adventurer_walk", start:1, end: 2}),
      frameRate : 5,
      repeat : -1 /* -1 value tells the animation to loop. */
    });

    this.anims.create({
      key : "playerRun",
      frames : this.anims.generateFrameNames(PLAYER_KEY, {prefix: "adventurer_walk", start:1, end: 2}),
      frameRate : 8.5,
      repeat : -1 /* -1 value tells the animation to loop. */
    });

    this.anims.create({
      key : "playerRunUp",
      frames : this.anims.generateFrameNames(PLAYER_KEY, {prefix: "adventurer_walk", start:1, end: 2}), // animation a changer !
      frameRate : 8.5,
      repeat : -1 /* -1 value tells the animation to loop. */
    });

    this.anims.create({
      key : "playerRunDown",
      frames : this.anims.generateFrameNames(PLAYER_KEY, {prefix: "adventurer_walk", start:1, end: 2}), // animation a changer !
      frameRate : 8.5,
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
    //console.log(this.tilemap.widthInPixels*MAP_RESIZING_FACTOR,this.tilemap.heightInPixels);
    this.cameras.main.setBounds(0,0,this.tilemap.widthInPixels*MAP_RESIZING_FACTOR,this.tilemap.heightInPixels*MAP_RESIZING_FACTOR);
  }

  changeMap(player, tile){
    this.player.ableToMove = false;
    if(!this.isReadyToTP){
      this.physics.moveTo(this.player,this.warpObjects[0].x+5,this.warpObjects[0].y,100);
      //console.log(player, tile);
      //console.log(tile.index, tile.properties.TP);
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
