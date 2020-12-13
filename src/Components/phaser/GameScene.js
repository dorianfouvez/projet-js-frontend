import Phaser from "phaser";
import PlayerSpawn from "./player/PlayerSpawn.js";
import LadyBugSpawner from "./enemies/LadyBugSpawner.js";
import ZombieSpawner from "./enemies/ZombieSpawner.js";
import GuardianSpawn from "./enemies/GuardianSpawn.js";
import PhaserGamePage from "./PhaserGamePage.js";

const LADYBUG_KEY = "ladyBug";
const ZOMBIE_KEY = "zombie";
const GUARDIAN_KEY = "guardian";
const BUTTON_KEY="settingButton";

const PATH_ASSETS = "../assets/";
const PATH_HEALBAR = PATH_ASSETS + "healBar/";
const PATH_MAPS = PATH_ASSETS + "maps/";
const PATH_PROGRESSBAR = PATH_ASSETS + "progressBar/";
const PATH_SOUNDS = PATH_ASSETS + "sounds/";
const PATH_TILESHEETS = PATH_ASSETS + "tilesheets/";
const PATH_TILESHEETS_EXTRUDED = PATH_TILESHEETS + "extruded/";
const PATH_UI = PATH_ASSETS + "ui/";
const PATH_BUTTON = PATH_UI + "button/";
const PATH_CURSORS = PATH_UI + "cursors/";
const PATH_MENU = PATH_UI + "menu/";
const PATH_TEXT = PATH_UI + "textAffichage/";
const PATH_MUSIC = PATH_SOUNDS + "musics/";

const SCALE_DEBUG = 0.75;

const MAP_RESIZING_FACTOR = 0.5;

let isDebugingGraphicsAllowed = false;
let isDebugingKeyDown = false;
let alreadyatk = false;

class GameScene extends Phaser.Scene {
  constructor() {
    super("game_scene");
    this.player = undefined;
    this.cursors = undefined;
    this.debugGraphics = [];
    this.debugingKey = undefined;
    this.scoreLabel = undefined;
    this.ladyBugSpawner = undefined;
    this.zombieSpawner = undefined;
    this.guardianSpawner = undefined;
    this.currentMap = undefined;
    this.warpObjects = undefined;
    this.isReadyToTP = undefined;
    this.gameOver = false;
    this.zombieSpawner = undefined;
    this.settingFullButton = undefined;
    this.settingMinButton = undefined;
    this.fullButton = undefined;
    this.minButton = undefined;
    this.spawnPlayer = undefined;
    this.spawnEnnemi = undefined;
    this.nbrEnemiesRemaining = 0;
    //Idle and action attribut
    this.lastDirection = "F";
    //controls
    this.keys = undefined;
    this.globals = undefined;
    this.guardianGroup = undefined;
    this.aoe = undefined;
    this.aoeX = 0;
    this.aoeY = 0;
    // Player HealBar
    this.redBar = undefined;
    this.greenBar = undefined;
  }

  preload() {
    this.globals = this.sys.game.globals;
    // Progress Bar
    this.setProgressBar();

    // Maps
    this.load.image("winterTileSheet", PATH_TILESHEETS_EXTRUDED + "winter-extruded.png");
    this.load.image("dungeonTileSheet", PATH_TILESHEETS_EXTRUDED + "dungeon_extruded.png");
    this.load.image("caveTileSheet", PATH_TILESHEETS_EXTRUDED + "cave_extruded.png");
    this.load.image("tropicalTileSheet", PATH_TILESHEETS_EXTRUDED + "tropical_extruded.png");
    this.load.image("summerTileSheet", PATH_TILESHEETS_EXTRUDED + "summer_extruded.png");
    
    this.load.tilemapTiledJSON("map", PATH_MAPS + "mapTest.json");
    this.load.tilemapTiledJSON("mapDodo", PATH_MAPS + "mapTestDorian.json");
    this.load.tilemapTiledJSON("winterMap", PATH_MAPS + "WinterMap.json");
    this.load.tilemapTiledJSON("dungeonMap", PATH_MAPS + "DungeonMap.json");
    this.load.tilemapTiledJSON("houseMap", PATH_MAPS + "house.json");

    this.load.image("red_healbar", PATH_HEALBAR + "red_healbar_background.png");
    this.load.image("green_healbar", PATH_HEALBAR + "green_healbar.png");

    // Enemies
    GuardianSpawn.loadAssets(this);

    // Audios
    //musics
    this.load.audio("debut", PATH_MUSIC +"debut.mp3");
    this.load.audio("mix", PATH_MUSIC+"mix.mp3");
    this.load.audio("fin", PATH_MUSIC+"fin.mp3");

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
    PlayerSpawn.loadAssets(this, this.globals);
    
  }

  create() {
    //console.log(this.globals);
    //if(this.globals.bgm) console.log("BGM Key : " + this.globals.bgm.key);
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
    this.createHpBar();

    if(this.currentMap && this.currentMap == "dungeonMap") this.player.lastDirection = "B";

    // Enemies
    this.createEnemies(this);
    
    this.manageColliders();

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
    let jeu = this;

    if (this.gameOver) {
      return;
    }

    if(this.globals.modifSetting)
      this.setControls();

    this.manageFullscreen();

    /* FOR DEBUGGING !!! Make all colliding object colloring in ORANGE ! */
    this.checkDebugingKey();

    this.player.manageMovements();

    this.callMenu();

    this.manageAudio(jeu);
    
    this.guardianGroup.getChildren().forEach(element => {
      this.guardianSpawner.manageMovements(element, jeu);
    });

    this.player.updateZoneAtk();
  
  }

  

  setProgressBar(){
    this.load.image("loadingBox", PATH_PROGRESSBAR + "LoadingBar_3_Background.png");
    this.load.image("loadingBar", PATH_PROGRESSBAR + "LoadingBar_3_Fill_Red.png");

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

    // this.load.on('filecomplete-audio-loadingBGM', function (key, type, data) {
    //   this.music = jeu.globals.bgm;
    // });


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
      percentText.setText(parseInt((value * 100) - 0.01) + '%').setDepth(10);
      if(progressBar) {
        progressBar.displayWidth = progressBarFullWidth * value * 1.7; // *1.8 if progressBar 1, if ProgressBar 3 => 1.28 si 2 bar et 1.7 si seul
      }
    });
    
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('filecomplete', function (key, type, data) {
      doneText.setText('Done: ' + key);
    });
   
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
    
  }

  setArray(){
    this.warpObjects = [];
    this.spawnEnnemi = [];
  }

  setLayer() {
    switch(this.currentMap){
      case "houseMap":
        // Images of Maps
        this.tilemap = this.make.tilemap({key: "houseMap"});
        this.tileset = this.tilemap.addTilesetImage("tropical_extruded","tropicalTileSheet");
        this.tilesetSummer = this.tilemap.addTilesetImage("summer_extruded","summerTileSheet");

        this.worldLayer = this.tilemap.createStaticLayer("world",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldNoCollidesTropicalLayer = this.tilemap.createStaticLayer("worldNoCollidesTropical",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldNoCollidesSummerLayer = this.tilemap.createStaticLayer("worldNoCollidesSummer",this.tilesetSummer,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides1TropicalLayer = this.tilemap.createStaticLayer("worldCollides1Tropical",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides1SummerLayer = this.tilemap.createStaticLayer("worldCollides1Summer",this.tilesetSummer,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop1TropicalLayer = this.tilemap.createStaticLayer("worldTop1Tropical",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop1SummerLayer = this.tilemap.createStaticLayer("worldTop1Summer",this.tilesetSummer,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldWeaponsTopSummerLayer = this.tilemap.createStaticLayer("worldWeaponsTopSummer",this.tilesetSummer,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldWeaponsTopTropicalLayer = this.tilemap.createStaticLayer("worldWeaponsTopTropical",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);

        // Dynamic Layer
        this.overlapLayer = this.tilemap.createDynamicLayer("overlap",this.tilesetSummer,0,0).setScale(MAP_RESIZING_FACTOR);

        // Set depths of the layers
        this.worldTop1SummerLayer.setDepth(10);
        this.worldTop1TropicalLayer.setDepth(10);
        this.overlapLayer.setDepth(10);

        break;
      case "winterMap":
        // Images of Maps
        this.tilemap = this.make.tilemap({key: "winterMap"});
        this.tileset = this.tilemap.addTilesetImage("winter","winterTileSheet");

        this.worldLayer = this.tilemap.createStaticLayer("world",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides9Layer = this.tilemap.createStaticLayer("worldCollides9",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop9Layer = this.tilemap.createStaticLayer("worldTop9",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldSpecialLayer = this.tilemap.createStaticLayer("worldSpecial",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides8Layer = this.tilemap.createStaticLayer("worldCollides8",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop8Layer = this.tilemap.createStaticLayer("worldTop8",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides7Layer = this.tilemap.createStaticLayer("worldCollides7",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop7Layer = this.tilemap.createStaticLayer("worldTop7",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides6Layer = this.tilemap.createStaticLayer("worldCollides6",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop6Layer = this.tilemap.createStaticLayer("worldTop6",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides5Layer = this.tilemap.createStaticLayer("worldCollides5",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop5Layer = this.tilemap.createStaticLayer("worldTop5",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides4Layer = this.tilemap.createStaticLayer("worldCollides4",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop4Layer = this.tilemap.createStaticLayer("worldTop4",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides3Layer = this.tilemap.createStaticLayer("worldCollides3",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop3Layer = this.tilemap.createStaticLayer("worldTop3",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides2Layer = this.tilemap.createStaticLayer("worldCollides2",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop2Layer = this.tilemap.createStaticLayer("worldTop2",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides1Layer = this.tilemap.createStaticLayer("worldCollides1",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop1Layer = this.tilemap.createStaticLayer("worldTop1",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);

        // Dynamic Layer
        this.overlapLayer = this.tilemap.createDynamicLayer("overlap",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);

        // Set depths of the layers
        this.worldTop9Layer.setDepth(10);
        this.worldTop8Layer.setDepth(11);
        this.worldTop7Layer.setDepth(12);
        this.worldTop6Layer.setDepth(13);
        this.worldTop5Layer.setDepth(14);
        this.worldTop4Layer.setDepth(15);
        this.worldTop3Layer.setDepth(16);
        this.worldTop2Layer.setDepth(17);
        this.worldTop1Layer.setDepth(18);

        break;
      case "dungeonMap":
        // Images of Maps
        this.tilemap = this.make.tilemap({key: "dungeonMap"});
        this.tileset = this.tilemap.addTilesetImage("dungeon","dungeonTileSheet");
        this.tilesetCave = this.tilemap.addTilesetImage("cave","caveTileSheet");

        this.worldLayer = this.tilemap.createStaticLayer("world",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldNoCollidesLayer = this.tilemap.createStaticLayer("worldNoCollides",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides1Layer = this.tilemap.createStaticLayer("worldCollides1",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides1CaveLayer = this.tilemap.createStaticLayer("worldCollides1Cave",this.tilesetCave,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop1Layer = this.tilemap.createStaticLayer("worldTop1",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop1CaveLayer = this.tilemap.createStaticLayer("worldTop1Cave",this.tilesetCave,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides2Layer = this.tilemap.createStaticLayer("worldCollides2",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldCollides2CaveLayer = this.tilemap.createStaticLayer("worldCollides2Cave",this.tilesetCave,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop2Layer = this.tilemap.createStaticLayer("worldTop2",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTop2CaveLayer = this.tilemap.createStaticLayer("worldTop2Cave",this.tilesetCave,0,0).setScale(MAP_RESIZING_FACTOR);
        this.worldTorchs = this.tilemap.createStaticLayer("worldTorchs",this.tileset,0,0).setScale(MAP_RESIZING_FACTOR);
            

        // Set depths of the layers
        this.worldTop2Layer.setDepth(10);
        this.worldTop1Layer.setDepth(10);
        this.worldTop2CaveLayer.setDepth(10);
        this.worldTop1CaveLayer.setDepth(10);
  
        break;
      default:
        this.currentMap = "houseMap"
        this.setLayer();
        break;
    }
  }

  manageObjects(){
    switch(this.currentMap){
      case "houseMap":
        // Spawn Player
        this.spawnPlayer = this.tilemap.findObject("Objects", obj => obj.name === "spawnPlayer");
        this.spawnPlayer.x *= MAP_RESIZING_FACTOR;
        this.spawnPlayer.y *= MAP_RESIZING_FACTOR;

        let sortiePlayer = this.tilemap.findObject("Objects", obj => obj.name === "sortiePlayer");
        this.warpObjects.push(sortiePlayer);

        this.warpObjects.forEach(element => {
          element.x *= MAP_RESIZING_FACTOR;
          element.y *= MAP_RESIZING_FACTOR;
        });

        break;
      case "winterMap":
        // Spawn Player
        this.spawnPlayer = this.tilemap.findObject("Objects", obj => obj.name === "spawnPlayer");
        this.spawnPlayer.x *= MAP_RESIZING_FACTOR;
        this.spawnPlayer.y *= MAP_RESIZING_FACTOR;

        // Spawn of Guardians
        for(let i =1 ;i<=40;i++){
          let spawnEnemie = this.tilemap.findObject("Objects", obj => obj.name === "guardianSpawn"+i);
          this.spawnEnnemi.push(spawnEnemie);
        }
        
        this.spawnEnnemi.forEach(element => {
          element.x *= MAP_RESIZING_FACTOR;
          element.y *= MAP_RESIZING_FACTOR;
        });

        // Changing Map Objects
        let accessToTheDungeon = this.tilemap.findObject("Objects", obj => obj.name === "accessToTheDungeon");
        this.warpObjects.push(accessToTheDungeon);
        let accessToTheDungeonPoint = this.tilemap.findObject("Objects", obj => obj.name === "toTheDungeon");
        this.warpObjects.push(accessToTheDungeonPoint);

        this.warpObjects.forEach(element => {
          element.x *= MAP_RESIZING_FACTOR;
          element.y *= MAP_RESIZING_FACTOR;
          // Set an image On each element For Debuging
          //this.add.sprite(element.x,element.y,"ladyBug").setScale(0.4);
        });

        break;
      case "dungeonMap":
        // Spawn Player
        this.spawnPlayer = this.tilemap.findObject("Objects", obj => obj.name === "spawnPlayer");
        this.spawnPlayer.x *= MAP_RESIZING_FACTOR;
        this.spawnPlayer.y *= MAP_RESIZING_FACTOR;

        this.spawnSatan = this.tilemap.findObject("Objects", obj => obj.name === "satanSpawn");
        this.spawnSatan.x *= MAP_RESIZING_FACTOR;
        this.spawnSatan.y *= MAP_RESIZING_FACTOR;

        break;
      default:
        this.currentMap = "houseMap"
        this.manageObjects();
        break;
    }
  }

  createPlayer() {
    let spawnX = 900;
    let spawnY = 450;
    if(this.spawnPlayer){
      spawnX = this.spawnPlayer.x;
      spawnY = this.spawnPlayer.y;
    }
    return new PlayerSpawn(this, null, spawnX, spawnY);
  }

  createHpBar(){
    this.redBar = this.physics.add.sprite(10, 10, "red_healbar").setOrigin(0,0).setDisplaySize(200, 30).setScrollFactor(0).setDepth(Number.MAX_VALUE);
    this.greenBar = this.physics.add.sprite(10, 10, "green_healbar").setOrigin(0,0).setDisplaySize(200, 30).setScrollFactor(0).setDepth(Number.MAX_VALUE);
  }

  createEnemies(jeu){
    this.nbrEnemiesRemaining = 0;
    this.guardianSpawner = new GuardianSpawn(this, GUARDIAN_KEY);
    this.spawnEnnemi.forEach(element => {
      this.guardianSpawner.spawn(element.x,element.y, jeu);
    });
    this.guardianGroup = this.guardianSpawner.group;

    // Satan
    if(this.spawnSatan) this.guardianSpawner.spawn(this.spawnSatan.x,this.spawnSatan.y, jeu);
  }

  manageColliders(){
    switch(this.currentMap){
      case "houseMap":
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.worldCollides1TropicalLayer.setCollisionByProperty({ collides: true });
        this.worldCollides1SummerLayer.setCollisionByProperty({ collides: true });

        // Colliders
        this.physics.add.collider(this.player.himSelf, this.worldLayer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides1TropicalLayer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides1SummerLayer);

        // OverLaps
        this.physics.add.overlap(this.player.himSelf, this.overlapLayer);
        this.overlapLayer.setTileIndexCallback((8720+1), this.changeMap, this);
        this.overlapLayer.setTileIndexCallback((8721+1), this.changeMap, this);
        this.overlapLayer.setTileIndexCallback((8722+1), this.changeMap, this);
        this.overlapLayer.setTileIndexCallback((8790+1), this.changeMap, this);
        this.overlapLayer.setTileIndexCallback((8791+1), this.changeMap, this);
        this.overlapLayer.setTileIndexCallback((8792+1), this.changeMap, this);

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
        this.physics.add.collider(this.player.himSelf, this.worldCollides9Layer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides8Layer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides7Layer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides6Layer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides5Layer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides4Layer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides3Layer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides2Layer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides1Layer);

        // Enemies
        this.guardianGroup.getChildren().forEach(element => {
          this.physics.add.collider(element, this.worldCollides9Layer);
          this.physics.add.collider(element, this.worldCollides8Layer);
          this.physics.add.collider(element, this.worldCollides7Layer);
          this.physics.add.collider(element, this.worldCollides6Layer);
          this.physics.add.collider(element, this.worldCollides5Layer);
          this.physics.add.collider(element, this.worldCollides4Layer);
          this.physics.add.collider(element, this.worldCollides3Layer);
          this.physics.add.collider(element, this.worldCollides2Layer);
          this.physics.add.collider(element, this.worldCollides1Layer);
        });

        // OverLaps
        this.physics.add.overlap(this.player.himSelf, this.overlapLayer);
        this.overlapLayer.setTileIndexCallback((2893+1), this.changeMap, this);
        this.overlapLayer.setTileIndexCallback((2896+1), this.changeMap, this);

        break;
      case "dungeonMap":
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.worldCollides1Layer.setCollisionByProperty({ collides: true });
        this.worldCollides1CaveLayer.setCollisionByProperty({ collides: true });
        this.worldCollides2Layer.setCollisionByProperty({ collides: true });
        this.worldCollides2CaveLayer.setCollisionByProperty({ collides: true });

        // Colliders
        this.physics.add.collider(this.player.himSelf, this.worldLayer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides1Layer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides1CaveLayer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides2Layer);
        this.physics.add.collider(this.player.himSelf, this.worldCollides2CaveLayer);

        break;
      default:
        this.currentMap = "houseMap"
        this.manageColliders();
        break;
    }
  }

  changeMap(player, tile){
    if(this.nbrEnemiesRemaining != 0){
      return this.tweens.add({
        targets : this.player.himSelf,
        y : this.player.himSelf.y-50,
        ease : "linear",
        duration : 300,
        repeat : 0,
      });
    }

    this.player.ableToMove = false;
    let i = tile.properties.warpObjectsPlace;
    //console.log(this.nbrEnemiesRemaining);

    if(!this.isReadyToTP){
      this.physics.moveTo(this.player.himSelf,this.warpObjects[i].x + 5,this.warpObjects[i].y,100);
      //console.log(player, tile);
      //console.log(tile.index, tile.properties.TP, this.player.himSelf.x, this.warpObjects[i].x, this.player.himSelf.y, this.warpObjects[i].y);
    }

    //console.log(this.player.himSelf.y, (this.warpObjects[i].y));
    //console.log(this.player.himSelf.x > (this.warpObjects[i].x - 7), this.player.himSelf.x < (this.warpObjects[i].x + 7),
      //this.player.himSelf.y > (this.warpObjects[i].y - 20), this.player.himSelf.y < (this.warpObjects[i].y + 7));
    if(this.player.himSelf.x > (this.warpObjects[i].x - 7) && this.player.himSelf.x < (this.warpObjects[i].x + 7) && 
    this.player.himSelf.y > (this.warpObjects[i].y - 20) && this.player.himSelf.y < (this.warpObjects[i].y + 7)){
      this.cameras.main.fadeOut(500);
      this.player.himSelf.body.stop();
      this.isReadyToTP = true;
      this.currentMap = tile.properties.TP;
      this.scene.restart();
    }
  }

  manageCamera() {
    this.cameras.main.startFollow(this.player.himSelf);
    this.cameras.main.setBounds(0,0,this.tilemap.widthInPixels*MAP_RESIZING_FACTOR,this.tilemap.heightInPixels*MAP_RESIZING_FACTOR);
  }

  setFullscreen(){
    this.fullButton = this.add.image(770, 570, 'fullScreen', 0).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' }).setScrollFactor(0).setDepth(Number.MAX_VALUE);
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
    if(this.keys) this.keys.atq1.removeAllListeners();
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
      jeu.player.hp = 10;
      jeu.greenBar.setScale(1, 1);
    });
  }

  setMenuButton(){
    this.settingMinButton = this.add.sprite(this.cameras.main.width-30,30,BUTTON_KEY).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' }).setScrollFactor(0).setDepth(Number.MAX_VALUE);
  }

  setAudio(){

    if(this.currentMap == "winterMap"){
      if(this.globals.musicSeek == undefined){
        this.clearAudio();
        this.globals.bgm = this.sound.add("mix", { loop: true });
        this.globals.bgm.play();
      }else{
        this.globals.bgm.setSeek(this.globals.musicSeek);
        this.globals.bgm.resume();
        this.globals.musicSeek = undefined;
      }
    }else if(this.currentMap == "dungeonMap"){
      this.clearAudio();
      this.globals.bgm = this.sound.add("fin", { loop: true });
      this.globals.bgm.play();
    }else if(this.currentMap == "houseMap"){
      this.clearAudio();
    }
  }

  clearAudio(){

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

  manageAudio(jeu){
    this.globals.bgm.volume = this.globals.musicVolume;

    this.player.atq1Sound.volume = (jeu.globals.musicVolume * 10) + 1; 
    this.player.atq2Sound.volume = (jeu.globals.musicVolume * 10) + 1;
    this.player.hurtSound.volume = (jeu.globals.musicVolume * 6) + 1;
    this.player.deathSound.volume = (jeu.globals.musicVolume * 5) + 1;
    this.guardianSpawner.atqSound.volume = (jeu.globals.musicVolume * 10) + 3;
    this.guardianSpawner.deathSound.volume = (jeu.globals.musicVolume * 10) + 1;
  }

  setInvisibleCollideZones(){
    this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        for(var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            // parameters are x, y, width, height
            this.spawns.create(x, y, 20, 20);            
        }        
        this.physics.add.overlap(this.player.himSelf, this.spawns, this.onMeetEnemy, false, this);
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
      //console.log("Run debbug color");
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
        case "houseMap":
          this.worldLayer.renderDebug(this.debugGraphics[0], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides1TropicalLayer.renderDebug(this.debugGraphics[1], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides1SummerLayer.renderDebug(this.debugGraphics[2], {
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
        case "dungeonMap":
          this.worldLayer.renderDebug(this.debugGraphics[0], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides1Layer.renderDebug(this.debugGraphics[1], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides1CaveLayer.renderDebug(this.debugGraphics[2], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides2Layer.renderDebug(this.debugGraphics[3], {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
          });
          this.debugGraphics.push(this.add.graphics().setAlpha(SCALE_DEBUG).setDepth(20));
          this.worldCollides2CaveLayer.renderDebug(this.debugGraphics[4], {
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

  callMenu(){
    let jeu = this;
    
    if(this.scale.isFullscreen){
      this.settingFullButton.on("pointerdown",function(){

        jeu.minButton.setVisible(false);
        jeu.settingFullButton.setVisible(false);

        jeu.globals.bgm.pause();

        jeu.scene.launch('menu_scene');
        jeu.scene.pause();
      });
    }else{
      this.settingMinButton.on("pointerdown",function(){

        jeu.fullButton.setVisible(false);
        jeu.settingMinButton.setVisible(false);

        jeu.globals.bgm.pause();

        jeu.scene.launch('menu_scene');
        jeu.scene.pause();
      });
    } 
  }

}

export default GameScene;
