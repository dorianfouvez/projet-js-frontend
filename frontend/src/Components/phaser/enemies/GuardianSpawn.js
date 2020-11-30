import Phaser from "phaser";

const PATH_ASSETS = "../../assets/";
const PATH_ENEMIES = PATH_ASSETS + "enemies/";
const PATH_GUARDIAN = PATH_ENEMIES + "guardian/";

export default class  GuardianSpawner{
    /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, resizingFactor, guardianKey = "guardian", range = 200) {
    this.scene = scene;
    this.resizingFactor = resizingFactor;
    this.key = guardianKey;
    this.range = range;
    this.tween = undefined;

    this._group = this.scene.physics.add.group();
  }

  get group() {
    return this._group;
  }

  static loadAssets(jeu){
    jeu.load.atlas("back", PATH_GUARDIAN+"guardian_back.png", PATH_GUARDIAN+"guardian_back_atlas.json");
    /*jeu.load.atlas("right", PATH_GUARDIAN+"guardian_right.png", PATH_GUARDIAN+"guardian_right_atlas.json");
    jeu.load.atlas("left", PATH_GUARDIAN+"guardian_left.png", PATH_GUARDIAN+"guardian_left_atlas.json");
    jeu.load.atlas("front", PATH_GUARDIAN+"guardian_front.png", PATH_GUARDIAN+"guardian_front_atlas.json");*/
  }

  spawn(spawnX, spawnY) {
    const guardian = this.group.create(spawnX, spawnY, this.key).setScale(this.resizingFactor).setSize(230, 170).setOffset(435,670);
    this.manageCollides(guardian);
    this.createAnims();
    this.manageMovements(guardian);
    return guardian;
    
  }

  manageCollides(guardian){
    guardian.setCollideWorldBounds(true);
    this.scene.physics.add.overlap(this.scene.player, guardian, function () { console.log("You lose HP !"); });
  }

  createAnims(){

    /*this.scene.anims.create({
        key: "frontWalk",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Walk_000", start: 0, end: 29}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "frontRun",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Run_000", start: 0, end: 14}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "frontIdle",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Idle_Blinking_000", start: 0, end: 29}),
        frameRate: 15,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "frontAtq1",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Attack_1_000", start: 0, end: 14}),
        frameRate: 35,
        repeat: 0,
    });
  
    this.scene.anims.create({
        key: "frontAtq2",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Attack_2_000", start: 0, end: 14}),
        frameRate: 25,
        repeat: 0,
        delay: 450
    });
  
    this.scene.anims.create({
        key: "frontDied",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Died_000", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "frontHurt",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Hurt_000", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });*/
  
    this.scene.anims.create({
        key: "backWalk",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Walk_00", start: 0, end: 29}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "backRun",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Run_000", start: 0, end: 14}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "backIdle",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Idle_00", start: 0, end: 29}),
        frameRate: 15,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "backAtq1",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Attack_1_000", start: 0, end: 14}),
        frameRate: 35,
        repeat: 0,
    });
  
    this.scene.anims.create({
        key: "backAtq2",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Attack_2_000", start: 0, end: 14}),
        frameRate: 25,
        repeat: 0,
        delay: 450
    });
  
    this.scene.anims.create({
        key: "backDied",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Died_000", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "backHurt",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Hurt_000", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });
  
    /*this.scene.anims.create({
        key: "leftWalk",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Walk_000", start: 0, end: 29}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "leftRun",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Run_000", start: 0, end: 14}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "leftIdle",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Idle_Blinking_000", start: 0, end: 29}),
        frameRate: 15,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "leftAtq1",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Attack_1_000", start: 0, end: 14}),
        frameRate: 35,
        repeat: 0,
    });
  
    this.scene.anims.create({
        key: "leftAtq2",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Attack_2_000", start: 0, end: 14}),
        frameRate: 25,
        repeat: 0,
        delay: 450
    });
  
    this.scene.anims.create({
        key: "leftDied",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Died_000", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "leftHurt",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Hurt_000", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });*/
  
    /*this.scene.anims.create({
        key: "rightWalk",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Walk_000", start: 0, end: 29}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "rightRun",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Run_000", start: 0, end: 14}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "rightIdle",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Idle_Blinking_000", start: 0, end: 29}),
        frameRate: 15,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "rightAtq1",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Attack_1_000", start: 0, end: 14}),
        frameRate: 35,
        repeat: 0,
    });
  
    this.scene.anims.create({
        key: "rightAtq2",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Attack_2_000", start: 0, end: 14}),
        frameRate: 25,
        repeat: 0,
        delay: 450
    });
  
    this.scene.anims.create({
        key: "rightDied",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Died_000", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "rightHurt",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Hurt_000", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });*/

  }

  manageMovements(guardian){
    if(Math.abs(guardian.x - this.scene.player.x) < this.range && Math.abs(guardian.y - this.scene.player.y) < this.range){
        console.log("In the range");
        guardian.anims.play("backWalk", true);
        this.scene.physics.moveTo(guardian, this.scene.player.x, this.scene.player.y,100);
    }else{
        guardian.setVelocity(0);
        guardian.anims.play("backIdle", true);
    }
  }

}