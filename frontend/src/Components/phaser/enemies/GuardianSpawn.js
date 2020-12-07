import Phaser from "phaser";

const PATH_ASSETS = "../../assets/";
const PATH_ENEMIES = PATH_ASSETS + "enemies/";
const PATH_GUARDIAN = PATH_ENEMIES + "guardian/";

export default class  GuardianSpawner{
    /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, resizingFactor, guardianKey = "guardian", range = 300) {
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
    jeu.load.atlas("left", PATH_GUARDIAN+"guardian_left.png", PATH_GUARDIAN+"guardian_left_atlas.json");*/
    jeu.load.atlas("front", PATH_GUARDIAN+"guardian_front_movements_atlas.png", PATH_GUARDIAN+"guardian_front_movements_atlas.json");
    jeu.load.atlas("frontAtk", PATH_GUARDIAN+"guardian_front_atk_atlas.png", PATH_GUARDIAN+"guardian_front_atk_atlas.json");
  }

  spawn(spawnX, spawnY) {
    const guardian = this.group.create(spawnX, spawnY, this.key).setScale(this.resizingFactor).setSize(230, 170).setOffset(435,670);

    guardian.hp = 10;
    guardian.isInvulnerability = false;
    guardian.isAttacking = false;
    guardian.lastDirection = "B";
    guardian.redBar = this.scene.physics.add.sprite(spawnX,spawnY - 42,"red_healbar").setScale(0.3, 0.2).setOrigin(0,0).setDisplaySize(60, 9);
    guardian.redBar.setPosition(spawnX - (guardian.redBar.width/6.66), spawnY - 45);
    guardian.greenBar = this.scene.physics.add.sprite(spawnX,spawnY - 42,"green_healbar").setScale(0.3).setOrigin(0,0).setX(60).setDisplaySize(60, 9);
    guardian.greenBar.setPosition(spawnX - (guardian.greenBar.width/6.4), spawnY - 45);
    guardian.hurt = false;

    this.manageCollides(guardian);
    this.createAnims();
    this.manageMovements(guardian);
    return guardian;
    
  }

  manageCollides(guardian){
    guardian.setCollideWorldBounds(true);
    this.scene.physics.add.overlap(this.scene.player.himSelf, guardian, () => { this.swingSword(guardian); });
  }

  createAnims(){

    this.scene.anims.create({
        key: "frontWalk",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Walk_0", start: 0, end: 29}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "frontRun",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Run_0", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "frontIdle",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Idle Blinking_0", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "frontAtq1",
        frames: this.scene.anims.generateFrameNames("frontAtk", {prefix: "0_Warrior_Attack_1_0", start: 0, end: 14}),
        frameRate: 35,
        repeat: 0,
    });
  
    this.scene.anims.create({
        key: "frontAtq2",
        frames: this.scene.anims.generateFrameNames("frontAtk", {prefix: "0_Warrior_Attack_2_0", start: 0, end: 14}),
        frameRate: 25,
        repeat: 0,
        delay: 450
    });
  
    this.scene.anims.create({
        key: "frontDied",
        frames: this.scene.anims.generateFrameNames("frontAtk", {prefix: "0_Warrior_Died_0", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "frontHurt",
        frames: this.scene.anims.generateFrameNames("frontAtk", {prefix: "0_Warrior_Hurt_0", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "backWalk",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Walk_0", start: 0, end: 29}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "backRun",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Run_0", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "backIdle",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Idle_0", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "backAtq1",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Attack_1_0", start: 0, end: 14}),
        frameRate: 35,
        repeat: 0,
    });
  
    this.scene.anims.create({
        key: "backAtq2",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Attack_2_0", start: 0, end: 14}),
        frameRate: 25,
        repeat: 0,
        delay: 450
    });
  
    this.scene.anims.create({
        key: "backDied",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Died_0", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "backHurt",
        frames: this.scene.anims.generateFrameNames("back", {prefix: "0_Warrior_Hurt_0", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });
  
    /*this.scene.anims.create({
        key: "leftWalk",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Walk_0", start: 0, end: 29}),
        frameRate: 20,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "leftRun",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Run_0", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "leftIdle",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Idle_Blinking_0", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "leftAtq1",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Attack_1_0", start: 0, end: 14}),
        frameRate: 35,
        repeat: 0,
    });
  
    this.scene.anims.create({
        key: "leftAtq2",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Attack_2_0", start: 0, end: 14}),
        frameRate: 25,
        repeat: 0,
        delay: 450
    });
  
    this.scene.anims.create({
        key: "leftDied",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Died_0", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "leftHurt",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Hurt_0", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });*/
  
    /*this.scene.anims.create({
        key: "rightWalk",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Walk_0", start: 0, end: 29}),
        frameRate: 20,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "rightRun",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Run_0", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "rightIdle",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Idle_Blinking_0", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "rightAtq1",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Attack_1_0", start: 0, end: 14}),
        frameRate: 35,
        repeat: 0,
    });
  
    this.scene.anims.create({
        key: "rightAtq2",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Attack_2_0", start: 0, end: 14}),
        frameRate: 25,
        repeat: 0,
        delay: 450
    });
  
    this.scene.anims.create({
        key: "rightDied",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Died_0", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "rightHurt",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Hurt_0", start: 0, end: 14}),
        frameRate: 20,
        repeat: 0
    });*/

  }

  manageMovements(guardian){
    if(Math.abs(guardian.x - this.scene.player.himSelf.x) < this.range && Math.abs(guardian.y - this.scene.player.himSelf.y) < this.range){
        console.log("In the range");

        if(guardian.anims.currentAnim == null || !guardian.anims.isPlaying || (guardian.anims.currentAnim.key != "frontHurt"
        && guardian.anims.currentAnim.key != "backHurt"  && guardian.anims.currentAnim.key != "frontAtq1" && guardian.anims.currentAnim.key != "backAtq1")){

            if(guardian.y > this.scene.player.himSelf.y){
                guardian.lastDirection = "B";
                guardian.anims.play("backWalk", true);
            }else if(guardian.y < this.scene.player.himSelf.y){
                guardian.lastDirection = "F";
                guardian.anims.play("frontWalk", true);
            }else if(guardian.lastDirection == "B"){
                if(guardian.anims.currentAnim == null || guardian.anims.currentAnim.key != "backIdle" || !guardian.anims.isPlaying) 
                    guardian.anims.play("backIdle", true);
            }else if(guardian.lastDirection == "F"){
                if(guardian.anims.currentAnim == null || guardian.anims.currentAnim.key != "frontIdle" || !guardian.anims.isPlaying) 
                    guardian.anims.play("frontIdle", true);
            }
    
            if(guardian.x < this.scene.player.himSelf.x - 15 || guardian.y < this.scene.player.himSelf.y - 15 || guardian.x > this.scene.player.himSelf.x + 15 || guardian.y > this.scene.player.himSelf.y + 15)
                this.scene.physics.moveTo(guardian, this.scene.player.himSelf.x, this.scene.player.himSelf.y,100);
            guardian.redBar.x = guardian.x - (guardian.redBar.width/6.66);
            guardian.redBar.y = guardian.y - 45;
            guardian.greenBar.x = guardian.x - (guardian.greenBar.width/6.4);
            guardian.greenBar.y = guardian.y - 45;
        }
    }else{
        guardian.setVelocity(0);

        if(guardian.redBar.x != guardian.x - (guardian.redBar.width/6.66) || guardian.redBar.y != guardian.y - 45){
            guardian.redBar.x = guardian.x - (guardian.redBar.width/6.66);
            guardian.redBar.y = guardian.y - 45;
        }
        if(guardian.greenBar.x != guardian.x - (guardian.greenBar.width/6.4) || guardian.greenBar.y != guardian.y - 45){
            guardian.greenBar.x = guardian.x - (guardian.greenBar.width/6.4);
            guardian.greenBar.y = guardian.y - 45;
        }

        if(guardian.lastDirection == "B"){
            if(guardian.anims.currentAnim == null || guardian.anims.currentAnim.key != "backIdle" || !guardian.anims.isPlaying) 
                guardian.anims.play("backIdle", true);
        }else if(guardian.lastDirection == "F"){
            if(guardian.anims.currentAnim == null || guardian.anims.currentAnim.key != "frontIdle" || !guardian.anims.isPlaying) 
                guardian.anims.play("frontIdle", true);
        }
    }
  }

  takeDamage(guardian, typeOfAtk){
    if(guardian.isInvulnerability) return;

    guardian.setVelocity(0);
    guardian.hurt = true;
    guardian.anims.play("frontHurt", true);
    if(typeOfAtk == 1) guardian.hp -= 1;
    else guardian.hp -= 2;
    console.log("Guardian lose HP ! ("+guardian.hp+"/10)");
    guardian.greenBar.setScale((guardian.hp/10)*0.3, 0.3);
    guardian.isInvulnerability = true;
    if(guardian.hp <= 0){
        guardian.redBar.destroy();
        guardian.greenBar.destroy();
        guardian.destroy();
    }
  }

  swingSword(guardian){
    if(guardian.isAttacking) return;

    guardian.setVelocity(0);
    guardian.isAttacking = true;

    if(guardian.lastDirection == "B")
        guardian.anims.play("backAtq1", true);
    else
        guardian.anims.play("frontAtq1", true)

    let player = this.scene.player;
    this.scene.time.delayedCall(800, ()=>{ guardian.isAttacking = false; });

    this.scene.player.takeDamage();
    
  }

}