import Phaser from "phaser";
import ScoreLabel from "./ScoreLabel.js";
import LadyBugSpawner from "./LadyBugSpawner.js";
import ZombieSpawner from "./ZombieSpawner.js";

const LADYBUG_KEY = "ladyBug";
const ZOMBIE_KEY = "zombie";
const BUTTON_KEY="settingButton";

const PATH_ASSETS = "../assets/";
const PATH_ENEMIES = PATH_ASSETS + "enemies/";
const PATH_MAPS = PATH_ASSETS + "maps/";
const PATH_PLAYERS = PATH_ASSETS + "players/";
const PATH_PROGRESSBAR = PATH_ASSETS + "progressBar/";
const PATH_SOUNDS = PATH_ASSETS + "sounds/";
const PATH_TILESHEETS = PATH_ASSETS + "tilesheets/";
const PATH_TILESHEETS_NORMAL = PATH_TILESHEETS + "normal/";
const PATH_TILESHEETS_EXTRUDED = PATH_TILESHEETS + "extruded/";
const PATH_UI = PATH_ASSETS + "ui/";
const PATH_BUTTON = PATH_UI + "button/";
const PATH_CURSORS = PATH_UI + "cursors/";
const PATH_MENU = PATH_UI + "menu/";
const PATH_TEXT = PATH_UI + "textAffichage/";

const SCALE_DEBUG = 0.75;

const PLAYER_SPEED = 80;
const MAP_RESIZING_FACTOR = 0.5;
const PLAYER_RESIZING_FACTOR = 0.1;

let isDebugingGraphicsAllowed = false;
let isDebugingKeyDown = false;

class GameScene extends Phaser.Scene {
  constructor() {
    super("game_scene");
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
    this.zombieSpawner = undefined;
    this.settingFullButton = undefined ;
    this.settingMinButton = undefined;
    this.fullButton = undefined;
    this.minButton = undefined;
    this.spawnPlayer = undefined;
    this.spawnEnnemi = undefined;
    //Idle and action attribut
    this.lastDirection = "F";
    //controls
    this.keys = undefined;
    this.globals = undefined;
  }

  preload() {
    this.globals = this.sys.game.globals;
    // Progress Bar
    this.setProgressBar();

    // Maps
    this.load.image("tiles", PATH_TILESHEETS_NORMAL + "winter.png");
    this.load.image("tilesExtruded", PATH_TILESHEETS_EXTRUDED + "winter-extruded.png");

    this.load.tilemapTiledJSON("map", PATH_MAPS + "mapTest.json");
    this.load.tilemapTiledJSON("mapDodo", PATH_MAPS + "mapTestDorian.json");
    this.load.tilemapTiledJSON("winterMap", PATH_MAPS + "WinterMap.json");

    // Enemies
    this.load.image(LADYBUG_KEY, PATH_ENEMIES + "ladyBug.png");
    this.load.atlas(ZOMBIE_KEY,PATH_ENEMIES+"zombie.png",PATH_ENEMIES+"zombieAtlas.json");

    // Audios
    //this.load.audio("explosionSound","explosion.ogg");
    this.load.audio("bgm_cimetronelle", PATH_SOUNDS+"Pokemon Em Cimetronelle.ogg");

    // Button
    this.load.image(BUTTON_KEY, PATH_BUTTON + "settingButton.png");
    this.load.image("switchToggle", PATH_BUTTON + "switchToggle.png");
    this.load.image('fullScreen', PATH_BUTTON + "fullScreen.png");
    this.load.image('minScreen', PATH_BUTTON + "minScreen.png");

    //UI Affichage
    this.load.image("sonoreBar", PATH_PROGRESSBAR + "LoadingBar_Fill.png");
    this.load.image("flecheTribal", PATH_MENU + "flecheTribal.png");
    this.load.image("popupAide", PATH_MENU + "popupAide.png");
    this.load.image("menu", PATH_MENU + "menu.png");

    //text
    this.load.image("volumeSonore", PATH_TEXT + "volumeSonore.png");
    this.load.image("attaqueChargee", PATH_TEXT + "attaqueChargee.png");
    this.load.image("attaqueDeBase", PATH_TEXT + "attaqueDeBase.png");
    this.load.image("choisissezVotreCorrompu", PATH_TEXT + "choisissezVotreCorrompu.png");
    this.load.image("courir", PATH_TEXT + "courir.png");
    this.load.image("deplacementVersLaDroite", PATH_TEXT + "deplacementVersLaDroite.png");
    this.load.image("deplacementVersLaGauche", PATH_TEXT + "deplacementVersLaGauche.png");
    this.load.image("deplacementVersLeBas", PATH_TEXT + "deplacementVersLeBas.png");
    this.load.image("deplacementVersLeHaut", PATH_TEXT + "deplacementVersLeHaut.png");

    // Mouse
    this.input.setDefaultCursor('url(' + PATH_CURSORS + 'Cursor_Normal.png), pointer');

    // Players
    if(this.globals.gender == "F"){
      this.load.atlas("playerBack", PATH_PLAYERS+"WarriorFemaleBackAtlas.png", PATH_PLAYERS+"WarriorFemaleBackAtlas.json");
      this.load.atlas("playerRight", PATH_PLAYERS+"WarriorFemaleRightAtlas.png", PATH_PLAYERS+"WarriorFemaleRightAtlas.json");
      this.load.atlas("playerLeft", PATH_PLAYERS+"WarriorFemaleLeftAtlas.png", PATH_PLAYERS+"WarriorFemaleLeftAtlas.json");
      this.load.atlas("playerFront", PATH_PLAYERS+"WarriorFemaleFrontAtlas.png", PATH_PLAYERS+"WarriorFemaleFrontAtlas.json");
    }else{
      this.load.atlas("playerBack", PATH_PLAYERS+"WarriorMaleBackAtlas.png", PATH_PLAYERS+"WarriorMaleBackAtlas.json");
      this.load.atlas("playerRight", PATH_PLAYERS+"WarriorMaleRightAtlas.png", PATH_PLAYERS+"WarriorMaleRightAtlas.json");
      this.load.atlas("playerLeft", PATH_PLAYERS+"WarriorMaleLeftAtlas.png", PATH_PLAYERS+"WarriorMaleLeftAtlas.json");
      this.load.atlas("playerFront", PATH_PLAYERS+"WarriorMaleFrontAtlas.png", PATH_PLAYERS+"WarriorMaleFrontAtlas.json");
    }
  }

  create() {
    console.log(this.globals);
    if(this.globals.bgm) console.log("BGM Key : " + this.globals.bgm.key);
    /*this.globals.musicVolume = 0.3;
    console.log(this.globals);*/
    this.isReadyToTP = false;
    // Set the points for changing the map
    this.setArray();
    
    // Set all layers of the map in params
    this.setLayer();
    
    // Set the Bounds of the map
    this.physics.world.setBounds(0,0,this.tilemap.widthInPixels*MAP_RESIZING_FACTOR,this.tilemap.heightInPixels*MAP_RESIZING_FACTOR);
    
    this.manageObjects();
    // Player
    this.player = this.createPlayer();

    this.manageColliders();
    
    // Enemies
    this.createEnemies();

    // Cameras
    this.manageCamera();
  
    // Cursors && Keyboards
    this.setControls();

    this.codeKonami();

    // Buttons
    this.setMenuButton();

    this.setAudio();

    this.setInvisibleCollideZones();

    this.setFullscreen();
  }
  
  update(time, delta) {
    if (this.gameOver) {
      return;
    }

    if(this.globals.modifSetting)
      this.setControls();

    this.manageFullscreen();

    /* FOR DEBUGGING !!! Make all colliding object colloring in ORANGE ! */
    this.checkDebugingKey();

    this.managePlayerMovements();

    this.callMenu();
  
  }

  

  setProgressBar(){
    this.load.image("loadingBox", PATH_PROGRESSBAR + "LoadingBar_3_Background.png");
    this.load.image("loadingBar", PATH_PROGRESSBAR + "LoadingBar_3_Fill_Red.png");
    this.load.audio("loadingBGM", PATH_SOUNDS+"Labyrinth-Of-Time_loop.ogg");

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    let progressBox = undefined;
    let progressBar = undefined;
    let progressBarFullWidth = undefined;
    let jeu = this;

    this.load.on('filecomplete-image-loadingBox', function (key, type, data) {
      progressBox = jeu.add.image(240,270, 'loadingBox').setScale(0.3).setX(width / 2).setY(height / 2);
    });

    this.load.on('filecomplete-image-loadingBar', function (key, type, data) {
      progressBar = jeu.add.image(240,270, 'loadingBar').setScale(0.3).setX(width / 2).setY(height / 2);
      progressBarFullWidth = progressBar.y;
      progressBar.displayWidth = progressBarFullWidth * 0.1;
    });

    console.log(this.globals);
    this.load.on('filecomplete-audio-loadingBGM', function (key, type, data) {
      jeu.globals.bgm = jeu.sound.add("loadingBGM", { loop: true });
      jeu.globals.bgm.play();
      jeu.globals.bgm.volume = 0.03;
    });


    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '40px Alex Brush',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
          font: '18px monospace',
          fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
          font: '18px monospace',
          fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    var doneText = this.make.text({
      x: width / 2,
      y: height / 2 + 80,
      text: '',
      style: {
          font: '18px monospace',
          fill: '#ffffff'
      }
    });
    doneText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      //console.log(value);
      percentText.setText(parseInt((value * 100) - 0.01) + '%').setDepth(10);
      if(progressBar) {
        progressBar.displayWidth = progressBarFullWidth * value * 1.7; // *1.8 if progressBar 1, if ProgressBar 3 => 1.28 si 2 bar et 1.7 si seul
      }
    });
    
    this.load.on('fileprogress', function (file) {
      //console.log(file.src);
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('filecomplete', function (key, type, data) {
      //console.log("Done : "+key, type, data);
      doneText.setText('Done: ' + key);
    });
   
    this.load.on('complete', function () {
      //console.log('complete');
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      jeu.globals.bgm.stop();
    });
    
  }

  setArray(){
    this.warpObjects = [];
    this.spawnEnnemi = [];
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

        break;
        case "winterMap":
          // Images of Maps
          this.tilemap = this.make.tilemap({key: "winterMap"});
          this.tileset = this.tilemap.addTilesetImage("winter","tilesExtruded");

          this.worldLayer = this.tilemap.createStaticLayer("world",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
          this.worldCollides9Layer = this.tilemap.createStaticLayer("worldCollides9",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
          this.worldSpecialLayer = this.tilemap.createStaticLayer("worldSpecial",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
          this.worldCollides8Layer = this.tilemap.createStaticLayer("worldCollides8",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
          this.worldCollides7Layer = this.tilemap.createStaticLayer("worldCollides7",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
          this.worldCollides6Layer = this.tilemap.createStaticLayer("worldCollides6",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
          this.worldCollides5Layer = this.tilemap.createStaticLayer("worldCollides5",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
          this.worldCollides4Layer = this.tilemap.createStaticLayer("worldCollides4",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
          this.worldCollides3Layer = this.tilemap.createStaticLayer("worldCollides3",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
          this.worldCollides2Layer = this.tilemap.createStaticLayer("worldCollides2",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
          this.worldCollides1Layer = this.tilemap.createStaticLayer("worldCollides1",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
          this.worldTop1Layer = this.tilemap.createStaticLayer("worldTop1",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);

          this.worldTop1Layer.setDepth(10);

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

        break;
      default:
        this.currentMap = "winterMap"
        this.setLayer();
        break;
    }
  }

  manageObjects(){
    switch(this.currentMap){
      case "map":
        //let nextMap = this.tilemap.findObject("Objects", obj => obj.name === "nextMap").properties[0].value;
        break;
      case "winterMap":
        this.spawnPlayer = this.tilemap.findObject("Objects", obj => obj.name === "spawnPlayer");
        this.spawnPlayer.x *= MAP_RESIZING_FACTOR;
        this.spawnPlayer.y *= MAP_RESIZING_FACTOR;

        break;
      case "mapDodo":
        // Changing Map Objects
        let entryHouse = this.tilemap.findObject("Objects", obj => obj.name === "entryHouse");
        for(let i =1 ;i<=3;i++){
          let spawnEnemie = this.tilemap.findObject("Objects", obj => obj.name === "spawnEnemies"+i);
          this.spawnEnnemi.push(spawnEnemie);
        }

        //entryHouse.x *= MAP_RESIZING_FACTOR;
        this.warpObjects.push(entryHouse);

        this.warpObjects.forEach(element => {
          element.x *= MAP_RESIZING_FACTOR;
          element.y *= MAP_RESIZING_FACTOR;
          // Set an image On each element For Debuging
          this.add.sprite(element.x,element.y,"ladyBug").setScale(0.4);
        });
        this.spawnEnnemi.forEach(element => {
          element.x *= MAP_RESIZING_FACTOR;
          element.y *= MAP_RESIZING_FACTOR;
          // Set an image On each element For Debuging
          this.add.sprite(element.x,element.y,"ladyBug").setScale(0.4);
        });
        
        break;
      default:
        this.currentMap = "winterMap"
        this.manageObjects();
        break;
    }
  }

  createPlayer() {
    let spawnX = 900;
    let spawnY = 450;
    if(this.spawnPlayer){
      console.log(this.spawnPlayer);
      spawnX = this.spawnPlayer.x;
      spawnY = this.spawnPlayer.y;
    }
    const player = this.physics.add.sprite(spawnX, spawnY, "playerFront", "Warrior_Idle_Blinking_0").setScale(PLAYER_RESIZING_FACTOR).setSize(170, 170).setOffset(470,670);
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
      key: "playerFrontAtq1",
      frames: this.anims.generateFrameNames("playerFront", {prefix: "Warrior_Attack_1_", start: 0, end: 14}),
      frameRate: 35,
      repeat: 0,
    });

    this.anims.create({
      key: "playerFrontAtq2",
      frames: this.anims.generateFrameNames("playerFront", {prefix: "Warrior_Attack_2_", start: 0, end: 14}),
      frameRate: 25,
      repeat: 0,
      delay: 450
    });

    this.anims.create({
      key: "playerFrontDied",
      frames: this.anims.generateFrameNames("playerFront", {prefix: "Warrior_Died_", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
    });

    this.anims.create({
      key: "playerFrontHurt",
      frames: this.anims.generateFrameNames("playerFront", {prefix: "Warrior_Hurt_", start: 0, end: 14}),
      frameRate: 20,
      repeat: 0
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
      key: "playerBackAtq1",
      frames: this.anims.generateFrameNames("playerBack", {prefix: "Warrior_Attack_1_", start: 0, end: 14}),
      frameRate: 35,
      repeat: 0,
    });

    this.anims.create({
      key: "playerBackAtq2",
      frames: this.anims.generateFrameNames("playerBack", {prefix: "Warrior_Attack_2_", start: 0, end: 14}),
      frameRate: 25,
      repeat: 0,
      delay: 450
    });

    this.anims.create({
      key: "playerBackDied",
      frames: this.anims.generateFrameNames("playerBack", {prefix: "Warrior_Died_", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
    });

    this.anims.create({
      key: "playerBackHurt",
      frames: this.anims.generateFrameNames("playerBack", {prefix: "Warrior_Hurt_", start: 0, end: 14}),
      frameRate: 20,
      repeat: 0
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
      key: "playerLeftAtq1",
      frames: this.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Attack_1_", start: 0, end: 14}),
      frameRate: 35,
      repeat: 0,
    });

    this.anims.create({
      key: "playerLeftAtq2",
      frames: this.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Attack_2_", start: 0, end: 14}),
      frameRate: 25,
      repeat: 0,
      delay: 450
    });

    this.anims.create({
      key: "playerLeftDied",
      frames: this.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Died_", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
    });

    this.anims.create({
      key: "playerLeftHurt",
      frames: this.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Hurt_", start: 0, end: 14}),
      frameRate: 20,
      repeat: 0
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

    this.anims.create({
      key: "playerRightAtq1",
      frames: this.anims.generateFrameNames("playerRight", {prefix: "Warrior_Attack_1_", start: 0, end: 14}),
      frameRate: 35,
      repeat: 0,
    });

    this.anims.create({
      key: "playerRightAtq2",
      frames: this.anims.generateFrameNames("playerRight", {prefix: "Warrior_Attack_2_", start: 0, end: 14}),
      frameRate: 25,
      repeat: 0,
      delay: 450
    });

    this.anims.create({
      key: "playerRightDied",
      frames: this.anims.generateFrameNames("playerRight", {prefix: "Warrior_Died_", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
    });

    this.anims.create({
      key: "playerRightHurt",
      frames: this.anims.generateFrameNames("playerRight", {prefix: "Warrior_Hurt_", start: 0, end: 14}),
      frameRate: 20,
      repeat: 0
    });

    return player;
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
      case "winterMap":
        this.worldCollides9Layer.setCollisionByProperty({ collides: true });
        this.worldCollides8Layer.setCollisionByProperty({ collides: true });
        this.worldCollides7Layer.setCollisionByProperty({ collides: true });
        this.worldCollides6Layer.setCollisionByProperty({ collides: true });
        this.worldCollides5Layer.setCollisionByProperty({ collides: true });
        this.worldCollides4Layer.setCollisionByProperty({ collides: true });
        this.worldCollides3Layer.setCollisionByProperty({ collides: true });
        this.worldCollides2Layer.setCollisionByProperty({ collides: true });
        this.worldCollides1Layer.setCollisionByProperty({ collides: true });

        // Colliders
        this.physics.add.collider(this.player, this.worldCollides9Layer);
        this.physics.add.collider(this.player, this.worldCollides8Layer);
        this.physics.add.collider(this.player, this.worldCollides7Layer);
        this.physics.add.collider(this.player, this.worldCollides6Layer);
        this.physics.add.collider(this.player, this.worldCollides5Layer);
        this.physics.add.collider(this.player, this.worldCollides4Layer);
        this.physics.add.collider(this.player, this.worldCollides3Layer);
        this.physics.add.collider(this.player, this.worldCollides2Layer);
        this.physics.add.collider(this.player, this.worldCollides1Layer);

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
        this.currentMap = "winterMap"
        this.manageColliders();
        break;
    }
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

  createEnemies(){
    this.ladyBugSpawner = new LadyBugSpawner(this, LADYBUG_KEY);
    const ladyBugsGroup = this.ladyBugSpawner.group;
    this.ladyBugSpawner.spawn(this.player.x, 480);
    this.zombieSpawner = new ZombieSpawner(this, ZOMBIE_KEY);
    const zombieGroup = this.zombieSpawner.group;
    //  this.zombieSpawner.spawn(this.player.x, 480);
    this.spawnEnnemi.forEach(element => {
      this.zombieSpawner.spawn(element.x,element.y);
    });
  }

  manageCamera() {
    this.cameras.main.startFollow(this.player);
    //console.log(this.tilemap.widthInPixels*MAP_RESIZING_FACTOR,this.tilemap.heightInPixels);
    this.cameras.main.setBounds(0,0,this.tilemap.widthInPixels*MAP_RESIZING_FACTOR,this.tilemap.heightInPixels*MAP_RESIZING_FACTOR);
  }

  setFullscreen(){
    this.fullButton = this.add.image(770, 570, 'fullScreen', 0).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' }).setScrollFactor(0);
  }

  manageFullscreen() {

    var debugTouche = this.input.keyboard.addKey(112); //F1 touche de débug pour pallier l'impossibilité de modifier la touche ESC

    debugTouche.on("down", () => {
      this.scale.resize(800, 600);

      this.fullButton.setVisible(true);
      this.settingMinButton.setVisible(true);
    }, this);

    if(this.scale.isFullscreen){

      this.minButton.setVisible(true);
      this.settingFullButton.setVisible(true);

      this.fullButton.setVisible(false);
      this.settingMinButton.setVisible(false);

      this.minButton.on("pointerup", () => {
        this.scale.resize(800, 600);
        this.scale.stopFullscreen();

        //ne pas modifier d'attribut avant car on modifie pas d'attribut enfant après l'attribut parent
        
        this.settingMinButton.setVisible(true);
        this.fullButton.setVisible(true);

        this.settingFullButton.destroy(); 
        this.minButton.destroy();
      }, this);
      
    }else {

      this.fullButton.setVisible(true);
      this.settingMinButton.setVisible(true); 

      this.fullButton.on("pointerup", () => {
        this.scale.resize(window.screen.width, window.screen.height);
        this.scale.startFullscreen();

        this.minButton = this.add.image(window.screen.width-30, window.screen.height-30, 'minScreen', 0).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' }).setScrollFactor(0);
        this.settingFullButton = this.add.image(window.screen.width-30,30,BUTTON_KEY).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' }).setScrollFactor(0);
      }, this);

    }

    //optimisation possible pour même problème -> valeur undefined, à besoin d'un if aussi non erreur est envoyée
  }

  setControls(){
    this.keys = this.input.keyboard.addKeys({
      up: this.input.keyboard.addKey(this.globals.up),
      down: this.input.keyboard.addKey(this.globals.down),
      left: this.input.keyboard.addKey(this.globals.left),
      right: this.input.keyboard.addKey(this.globals.right),
      atq1: this.input.keyboard.addKey(this.globals.atq1),
      atq2: this.input.keyboard.addKey(this.globals.atq2),
      run: this.input.keyboard.addKey(this.globals.run),
    })
    this.cursors = this.input.keyboard.createCursorKeys();
    this.debugingKey = this.input.keyboard.addKey('C');

    console.log(this.keys);
    this.globals.modifSetting = false;
  }

  codeKonami(){
    //  Lien pour les keyCodes : https://github.com/photonstorm/phaser/blob/v3.22.0/src/input/keyboard/keys/KeyCodes.js
    //  37 = LEFT
    //  38 = UP
    //  39 = RIGHT
    //  40 = DOWN
    //  65  = A
    //  66  = B

    this.input.keyboard.createCombo([ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65 ], { resetOnMatch: true });
    let jeu = this;

    this.input.keyboard.on('keycombomatch', function (event) {

        console.log('Konami Code entered!');

        jeu.currentMap = "mapDodo";
        jeu.scene.restart();
    });
  }

  setMenuButton(){
    this.settingMinButton = this.add.sprite(this.cameras.main.width-30,30,BUTTON_KEY).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' }).setScrollFactor(0);
  }

  setAudio(){
    this.clearAudio();
    
    // Set BGM
    this.manageBGM();
  }

  clearAudio(){
    // Clear Possible BGM
    //if(this.globals.bgm) this.globals.bgm.stop();

    // Permet un fondu de la musique
    if(this.globals.bgm){
      let jeu = this;

      this.tweens.add({
        targets: jeu.globals.bgm,
        volume: 0,
        ease: 'Linear',
        duration: 500
      });
    }
  }

  manageBGM(){
    switch (this.currentMap) {
      case "map":

        break;
      case "winterMap":

        break;
      case "mapDodo":
        this.globals.bgm = this.sound.add("bgm_cimetronelle", { loop: true });
        this.globals.bgm.play();
        this.globals.bgm.volume = this.globals.musicVolume; //0.1

        break;
      default:
        this.currentMap = "winterMap"
        this.manageBGM();
        break;
    }
  }

  setInvisibleCollideZones(){
    this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        for(var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            // parameters are x, y, width, height
            this.spawns.create(x, y, 20, 20);            
        }        
        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
  }

  onMeetEnemy(player, zone){        
    // we move the zone to some other location
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
    
    // shake the world
    this.cameras.main.shake(300);
    
    // start battle 
  }

  checkDebugingKey(){
    if(this.debugingKey.isDown && !isDebugingKeyDown){
      console.log("Run debbug color");
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
      this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
      switch(this.currentMap){
        case "map":
          this.worldLayer.renderDebug(this.debugGraphics[0], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.cityLayer.renderDebug(this.debugGraphics[1], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.cityBuild1Layer.renderDebug(this.debugGraphics[2], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.cityBuild2Layer.renderDebug(this.debugGraphics[3], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.cityBuild3Layer.renderDebug(this.debugGraphics[4], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.cityBuild4Layer.renderDebug(this.debugGraphics[5], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.cityBuild5Layer.renderDebug(this.debugGraphics[6], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.cityBuild6Layer.renderDebug(this.debugGraphics[7], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          break;
        case "winterMap":
          this.worldCollides9Layer.renderDebug(this.debugGraphics[0], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides8Layer.renderDebug(this.debugGraphics[1], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides7Layer.renderDebug(this.debugGraphics[2], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides6Layer.renderDebug(this.debugGraphics[3], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides5Layer.renderDebug(this.debugGraphics[4], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides4Layer.renderDebug(this.debugGraphics[5], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides3Layer.renderDebug(this.debugGraphics[6], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides2Layer.renderDebug(this.debugGraphics[7], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides1Layer.renderDebug(this.debugGraphics[8], {
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

  managePlayerMovements(){
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
          //if(false){
            //this.player.anims.play("playerBackHurt", true);
          //}else {
            if(runSpeed != 0){
              this.player.anims.play("playerBackRun", true);
            } else {
              this.keys.atq1.on("down", ()=> { this.player.anims.play("playerBackAtq1", true); });
              if(this.keys.atq2.isDown)
                this.player.anims.play("playerBackAtq2", true);
              else if(this.player.anims.currentAnim == null || this.player.anims.currentAnim.key != "playerBackAtq1" || !this.player.anims.isPlaying)
                this.player.anims.play("playerBackWalk", true);
            }
          //}
        }
      } else if (this.keys.down.isDown) {
        this.player.setVelocityY(PLAYER_SPEED + runSpeed);
        if(this.keys.left.isUp && this.keys.right.isUp){
          this.lastDirection = "F";
          //if(hurt){
            //this.player.anims.play("playerFrontHurt", true);
          //}else {
            if(runSpeed != 0){
              this.player.anims.play("playerFrontRun", true);
            } else {
              this.keys.atq1.on("down", ()=> { this.player.anims.play("playerFrontAtq1", true); });
              if(this.keys.atq2.isDown)
                this.player.anims.play("playerFrontAtq2", true);
              else if(this.player.anims.currentAnim == null || this.player.anims.currentAnim.key != "playerFrontAtq1" || !this.player.anims.isPlaying)
                this.player.anims.play("playerFrontWalk", true);
            }
          //}
        }
      } else {
        this.player.setVelocityY(0);
      }

      if (this.keys.left.isDown) {
        this.player.setVelocityX(-(PLAYER_SPEED + runSpeed));
        this.lastDirection = "L";
        //if(hurt){
          //this.player.anims.play("playerLeftHurt", true);
        //}else {
          if(runSpeed != 0){
            this.player.anims.play("playerLeftRun", true);
          } else {
            this.keys.atq1.on("down", ()=> { this.player.anims.play("playerLeftAtq1", true); });
            if(this.keys.atq2.isDown)
              this.player.anims.play("playerLeftAtq2", true);
            else if(this.player.anims.currentAnim == null || this.player.anims.currentAnim.key != "playerLeftAtq1" || !this.player.anims.isPlaying)
              this.player.anims.play("playerLeftWalk", true);
          }
        //}
      } else if (this.keys.right.isDown) {
        this.player.setVelocityX(PLAYER_SPEED + runSpeed);
        this.lastDirection = "R";
        //if(hurt){
          //this.player.anims.play("playerRightHurt", true);
        //}else {
          if(runSpeed != 0){
            this.player.anims.play("playerRightRun", true);
          } else {
            this.keys.atq1.on("down", ()=> { this.player.anims.play("playerRightAtq1", true); });
            if(this.keys.atq2.isDown)
              this.player.anims.play("playerRightAtq2", true);
            else if(this.player.anims.currentAnim == null || this.player.anims.currentAnim.key != "playerRightAtq1" || !this.player.anims.isPlaying)
              this.player.anims.play("playerRightWalk", true);
          }
        //}
      } else {
        this.player.setVelocityX(0);
      }

      if(this.keys.up.isUp && this.keys.down.isUp && this.keys.left.isUp && this.keys.right.isUp){

        if(this.lastDirection == "B"){
          //if(hurt){
            //this.player.anims.play("playerBackHurt", true);
          //}else {
            this.keys.atq1.on("down", ()=> { this.player.anims.play("playerBackAtq1", true); });
            if(this.keys.atq2.isDown)
              this.player.anims.play("playerBackAtq2", true);
            else if(this.player.anims.currentAnim == null || this.player.anims.currentAnim.key != "playerBackAtq1" || !this.player.anims.isPlaying)
              this.player.anims.play("playerBackIdle", true);
          //} 
        }
        else if(this.lastDirection == "F"){
          //if(hurt){
            //this.player.anims.play("playerFrontHurt", true);
          //}else {
            this.keys.atq1.on("down", ()=> { this.player.anims.play("playerFrontAtq1", true); });
            if(this.keys.atq2.isDown)
              this.player.anims.play("playerFrontAtq2", true);
            else if(this.player.anims.currentAnim == null || this.player.anims.currentAnim.key != "playerFrontAtq1" || !this.player.anims.isPlaying)
              this.player.anims.play("playerFrontIdle", true);
          //}
        }
        else if(this.lastDirection == "L"){
          //if(hurt){
            //this.player.anims.play("playerLeftHurt", true);
          //}else {
            this.keys.atq1.on("down", ()=> { this.player.anims.play("playerLeftAtq1", true); });
            if(this.keys.atq2.isDown)
              this.player.anims.play("playerLeftAtq2", true);
            else if(this.player.anims.currentAnim == null || this.player.anims.currentAnim.key != "playerLeftAtq1" || !this.player.anims.isPlaying)
              this.player.anims.play("playerLeftIdle", true);
          //}
        }
        else if(this.lastDirection == "R"){
          //if(hurt){
            //this.player.anims.play("playerRightHurt", true);
          //}else {
            this.keys.atq1.on("down", ()=> { this.player.anims.play("playerRightAtq1", true); });
            if(this.keys.atq2.isDown)
              this.player.anims.play("playerRightAtq2", true);
            else if(this.player.anims.currentAnim == null || this.player.anims.currentAnim.key != "playerRightAtq1" || !this.player.anims.isPlaying)
              this.player.anims.play("playerRightIdle", true);
          //}
        }
      }
    }

    /*possibilité de metre les attaques en mode 1 click = une attaque complète, à voir si cela nous intéresse et si on a le temps
      this.keys.atq1.on("down", ()=> { this.player.anims.play("playerFrontAtq1", true); });

    /*if(mort){
      if(this.lastDirection == "B"){
        this.player.anims.play("playerBackDied", true);
      }
      else if(this.lastDirection == "F"){
        this.player.anims.play("playerFrontDied", true);
      }
      else if(this.lastDirection == "L"){
        this.player.anims.play("playerLeftDied", true);
      }
      else {
        this.player.anims.play("playerRightDied", true);
      }
    }*/

  }

  callMenu(){
    let jeu = this;
    
    if(this.scale.isFullscreen){
      this.settingFullButton.on("pointerdown",function(){

        jeu.minButton.setVisible(false);
        jeu.settingFullButton.setVisible(false);

        jeu.scene.launch('menu_scene');
        jeu.scene.pause();
      });
    }else{
      this.settingMinButton.on("pointerdown",function(){

        jeu.fullButton.setVisible(false);
        jeu.settingMinButton.setVisible(false);

        jeu.scene.launch('menu_scene');
        jeu.scene.pause();
      });
    }
    //Peut éventuellement être optimisé, ici je dois mettre un if aussi non j'ai une erreur 
    // car le setting button est undefined
    //Pas moyen de retirer les buttons fullscreen car il ne reconnait pas this 
  }

}

export default GameScene;
