import Phaser from "phaser";

const PATH_ASSETS = "../../assets/";
const PATH_ENEMIES = PATH_ASSETS + "enemies/";
const PATH_GUARDIAN = PATH_ENEMIES + "guardian/";
const PATH_SOUNDS = PATH_ASSETS + "sounds/";

export default class  GuardianSpawner{
    /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, guardianKey = "guardian", range = 300) {
    this.scene = scene;
    this.key = guardianKey;
    this.range = range;
    this.tween = undefined;
    this.atqSound = undefined;
    this.deathSound = undefined;

    this._group = this.scene.physics.add.group();
    this.createSound();
  }

  get group() {
    return this._group;
  }

  createSound(){
    this.atqSound = this.scene.sound.add("atqEnnemie", {loop: false });
    this.deathSound = this.scene.sound.add("deathEnnemie", {loop: false });   
  }

  static loadAssets(jeu){
    //sounds
    jeu.load.audio("atqEnnemie", PATH_SOUNDS+"atqEnnemie.mp3");
    jeu.load.audio("deathEnnemie", PATH_SOUNDS+"deathEnnemie.mp3");
    jeu.load.audio("aggro1", PATH_SOUNDS+"aggro1.mp3");
    jeu.load.audio("aggro2", PATH_SOUNDS+"aggro2.mp3");
    jeu.load.audio("aggro3", PATH_SOUNDS+"aggro3.mp3");
    jeu.load.audio("aggro4", PATH_SOUNDS+"aggro4.mp3");
    jeu.load.audio("aggro5", PATH_SOUNDS+"aggro5.mp3");
    jeu.load.audio("aggro6", PATH_SOUNDS+"aggro6.mp3");
    jeu.load.audio("aggro7", PATH_SOUNDS+"aggro7.mp3");
    jeu.load.audio("aggro8", PATH_SOUNDS+"aggro8.mp3");

    // Men
    jeu.load.atlas("back", PATH_GUARDIAN+"guardian_back_atlas.png", PATH_GUARDIAN+"guardian_back_atlas.json");
    jeu.load.atlas("right", PATH_GUARDIAN+"guardian_right_atlas.png", PATH_GUARDIAN+"guardian_right_atlas.json");
    jeu.load.atlas("left", PATH_GUARDIAN+"guardian_left_atlas.png", PATH_GUARDIAN+"guardian_left_atlas.json");
    jeu.load.atlas("front", PATH_GUARDIAN+"guardian_front_atlas (1).png", PATH_GUARDIAN+"guardian_front_atlas (1).json");

    // Women
    jeu.load.atlas("backF", PATH_GUARDIAN+"guardian_back_f_atlas.png", PATH_GUARDIAN+"guardian_back_f_atlas.json");
    jeu.load.atlas("rightF", PATH_GUARDIAN+"guardian_right_f_atlas.png", PATH_GUARDIAN+"guardian_right_f_atlas.json");
    jeu.load.atlas("leftF", PATH_GUARDIAN+"guardian_left_f_atlas.png", PATH_GUARDIAN+"guardian_left_f_atlas.json");
    jeu.load.atlas("frontF", PATH_GUARDIAN+"guardian_front_f_atlas.png", PATH_GUARDIAN+"guardian_front_f_atlas.json");
  }

  spawn(spawnX, spawnY, jeu) {
    const guardian = this.group.create(spawnX, spawnY, this.key).setSize(18, 16).setOffset(46,68);

    this.setAggroSound(guardian, jeu);

    guardian.aggro = false;
    guardian.hp = 10;
    guardian.isInvulnerability = false;
    guardian.isAttacking = false;
    this.generateFirstDirection(guardian);
    this.generateGender(guardian);
    guardian.redBar = this.scene.physics.add.sprite(spawnX,spawnY - 42,"red_healbar").setScale(0.3, 0.2).setOrigin(0,0).setDisplaySize(60, 9);
    guardian.redBar.setPosition(spawnX - (guardian.redBar.width/6.66), spawnY - 45);
    guardian.greenBar = this.scene.physics.add.sprite(spawnX,spawnY - 42,"green_healbar").setScale(0.3).setOrigin(0,0).setX(60).setDisplaySize(60, 9);
    guardian.greenBar.setPosition(spawnX - (guardian.greenBar.width/6.4), spawnY - 45);
    guardian.hurt = false;
    guardian.isDead = false;

    this.manageCollides(guardian);
    this.createAnims();
    this.manageMovements(guardian, jeu);
    return guardian;
    
  }

  setAggroSound(guardian, jeu){
    let alea = Math.floor(Math.random() * Math.floor(8)) + 1;
    guardian.aggroSound = this.scene.sound.add("aggro" + alea, {loop: false });
    guardian.aggroSound.volume = (jeu.globals.musicVolume * 10) + 3;
  }

  generateFirstDirection(guardian){
    let choix = Math.floor(Math.random() * 4);
    //console.log(choix);
    switch(choix){
      case 0:
        guardian.lastDirection = "B";
        break;
      case 1:
        guardian.lastDirection = "F";
        break;
      case 2:
        guardian.lastDirection = "L";
        break;
      case 3:
        guardian.lastDirection = "R";
        break;
    }
  }

  generateGender(guardian){
    let choix = Math.floor(Math.random() * 2);
    switch(choix){
      case 0:
        guardian.gender = "M";
        break;
      case 1:
        guardian.gender = "F";
        break;
    }
  }

  manageCollides(guardian){
    guardian.setCollideWorldBounds(true);
    this.scene.physics.add.overlap(this.scene.player.himSelf, guardian, () => { this.swingSword(guardian); });
  }

  createAnims(){

    /************************************************Men*************************************************************/
    this.scene.anims.create({
        key: "frontWalk",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Walk_0", start: 0, end: 29}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "frontIdle",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Idle Blinking_0", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "frontAtq1",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Attack_1_0", start: 0, end: 14}),
        frameRate: 35,
        repeat: 0,
    });
  
    this.scene.anims.create({
        key: "frontDied",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Died_0", start: 0, end: 29}),
        frameRate: 15,
        repeat: 0
    });
  
    this.scene.anims.create({
        key: "frontHurt",
        frames: this.scene.anims.generateFrameNames("front", {prefix: "0_Warrior_Hurt_0", start: 0, end: 14}),
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
  
    this.scene.anims.create({
        key: "leftWalk",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Walk_0", start: 0, end: 29}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "leftIdle",
        frames: this.scene.anims.generateFrameNames("left", {prefix: "0_Warrior_Idle Blinking_0", start: 0, end: 29}),
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
    });
  
    this.scene.anims.create({
        key: "rightWalk",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Walk_0", start: 0, end: 29}),
        frameRate: 20,
        repeat: -1
    });
  
    this.scene.anims.create({
        key: "rightIdle",
        frames: this.scene.anims.generateFrameNames("right", {prefix: "0_Warrior_Idle Blinking_0", start: 0, end: 29}),
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
    });

    /************************************************Women*************************************************************/

    this.scene.anims.create({
      key: "frontWalkF",
      frames: this.scene.anims.generateFrameNames("frontF", {prefix: "0_Warrior_Walk_0", start: 0, end: 29}),
      frameRate: 20,
      repeat: -1
  });

  this.scene.anims.create({
      key: "frontIdleF",
      frames: this.scene.anims.generateFrameNames("frontF", {prefix: "0_Warrior_Idle Blinking_0", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
  });

  this.scene.anims.create({
      key: "frontAtq1F",
      frames: this.scene.anims.generateFrameNames("frontF", {prefix: "0_Warrior_Attack_1_0", start: 0, end: 14}),
      frameRate: 35,
      repeat: 0,
  });

  this.scene.anims.create({
      key: "frontDiedF",
      frames: this.scene.anims.generateFrameNames("frontF", {prefix: "0_Warrior_Died_0", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
  });

  this.scene.anims.create({
      key: "frontHurtF",
      frames: this.scene.anims.generateFrameNames("frontF", {prefix: "0_Warrior_Hurt_0", start: 0, end: 14}),
      frameRate: 20,
      repeat: 0
  });

  this.scene.anims.create({
      key: "backWalkF",
      frames: this.scene.anims.generateFrameNames("backF", {prefix: "0_Warrior_Walk_0", start: 0, end: 29}),
      frameRate: 20,
      repeat: -1
  });

  this.scene.anims.create({
      key: "backIdleF",
      frames: this.scene.anims.generateFrameNames("backF", {prefix: "0_Warrior_Idle_0", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
  });

  this.scene.anims.create({
      key: "backAtq1F",
      frames: this.scene.anims.generateFrameNames("backF", {prefix: "0_Warrior_Attack_1_0", start: 0, end: 14}),
      frameRate: 35,
      repeat: 0,
  });

  this.scene.anims.create({
      key: "backDiedF",
      frames: this.scene.anims.generateFrameNames("backF", {prefix: "0_Warrior_Died_0", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
  });

  this.scene.anims.create({
      key: "backHurtF",
      frames: this.scene.anims.generateFrameNames("backF", {prefix: "0_Warrior_Hurt_0", start: 0, end: 14}),
      frameRate: 20,
      repeat: 0
  });

  this.scene.anims.create({
      key: "leftWalkF",
      frames: this.scene.anims.generateFrameNames("leftF", {prefix: "0_Warrior_Walk_0", start: 0, end: 29}),
      frameRate: 20,
      repeat: -1
  });

  this.scene.anims.create({
      key: "leftIdleF",
      frames: this.scene.anims.generateFrameNames("leftF", {prefix: "0_Warrior_Idle Blinking_0", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
  });

  this.scene.anims.create({
      key: "leftAtq1F",
      frames: this.scene.anims.generateFrameNames("leftF", {prefix: "0_Warrior_Attack_1_0", start: 0, end: 14}),
      frameRate: 35,
      repeat: 0,
  });

  this.scene.anims.create({
      key: "leftDiedF",
      frames: this.scene.anims.generateFrameNames("leftF", {prefix: "0_Warrior_Died_0", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
  });

  this.scene.anims.create({
      key: "leftHurtF",
      frames: this.scene.anims.generateFrameNames("leftF", {prefix: "0_Warrior_Hurt_0", start: 0, end: 14}),
      frameRate: 20,
      repeat: 0
  });

  this.scene.anims.create({
      key: "rightWalkF",
      frames: this.scene.anims.generateFrameNames("rightF", {prefix: "0_Warrior_Walk_0", start: 0, end: 29}),
      frameRate: 20,
      repeat: -1
  });

  this.scene.anims.create({
      key: "rightIdleF",
      frames: this.scene.anims.generateFrameNames("rightF", {prefix: "0_Warrior_Idle Blinking_0", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
  });

  this.scene.anims.create({
      key: "rightAtq1F",
      frames: this.scene.anims.generateFrameNames("rightF", {prefix: "0_Warrior_Attack_1_0", start: 0, end: 14}),
      frameRate: 35,
      repeat: 0,
  });

  this.scene.anims.create({
      key: "rightDiedF",
      frames: this.scene.anims.generateFrameNames("rightF", {prefix: "0_Warrior_Died_0", start: 0, end: 29}),
      frameRate: 15,
      repeat: 0
  });

  this.scene.anims.create({
      key: "rightHurtF",
      frames: this.scene.anims.generateFrameNames("rightF", {prefix: "0_Warrior_Hurt_0", start: 0, end: 14}),
      frameRate: 20,
      repeat: 0
  });

  }

  manageMovements(guardian, jeu){
    if(guardian.isDead) return;

    if(Math.abs(guardian.x - this.scene.player.himSelf.x) < this.range && Math.abs(guardian.y - this.scene.player.himSelf.y) < this.range){
        if(!guardian.aggro)
          guardian.aggroSound.play();
        guardian.aggro = true;
        console.log("In the range");

        if(guardian.gender == "M"){
          ;
        }
        if(guardian.anims.currentAnim == null || !guardian.anims.isPlaying || (guardian.anims.currentAnim.key != "frontHurt"
        && guardian.anims.currentAnim.key != "backHurt" && guardian.anims.currentAnim.key != "leftHurt" && guardian.anims.currentAnim.key != "rightHurt"
        && guardian.anims.currentAnim.key != "frontAtq1" && guardian.anims.currentAnim.key != "backAtq1" && guardian.anims.currentAnim.key != "leftAtq1" 
        && guardian.anims.currentAnim.key != "rightAtq1" && guardian.anims.currentAnim.key != "frontHurtF" && guardian.anims.currentAnim.key != "backHurtF" 
        && guardian.anims.currentAnim.key != "leftHurtF" && guardian.anims.currentAnim.key != "rightHurtF" && guardian.anims.currentAnim.key != "frontAtq1F" 
        && guardian.anims.currentAnim.key != "backAtq1F" && guardian.anims.currentAnim.key != "leftAtq1F"  && guardian.anims.currentAnim.key != "rightAtq1F")){

            if(guardian.x > this.scene.player.himSelf.x + 50 || (guardian.x > this.scene.player.himSelf.x && Math.abs(guardian.y - this.scene.player.himSelf.y) < 10)){
                guardian.lastDirection = "L";
                if(guardian.gender == "M") guardian.anims.play("leftWalk", true);
                else guardian.anims.play("leftWalkF", true);
            }else if(guardian.x < this.scene.player.himSelf.x - 50 || (guardian.x < this.scene.player.himSelf.x && Math.abs(this.scene.player.himSelf.y - guardian.y) < 10)){
                guardian.lastDirection = "R";
                if(guardian.gender == "M") guardian.anims.play("rightWalk", true);
                else guardian.anims.play("rightWalkF", true);
            }else if(guardian.y > this.scene.player.himSelf.y){
                guardian.lastDirection = "B";
                if(guardian.gender == "M") guardian.anims.play("backWalk", true);
                else guardian.anims.play("backWalkF", true);
            }else if(guardian.y < this.scene.player.himSelf.y){
                guardian.lastDirection = "F";
                if(guardian.gender == "M") guardian.anims.play("frontWalk", true);
                else guardian.anims.play("frontWalkF", true);
            }else
                this.idling(guardian, jeu);
    
            if(guardian.x < this.scene.player.himSelf.x - 15 || guardian.y < this.scene.player.himSelf.y - 15 || guardian.x > this.scene.player.himSelf.x + 15 
              || guardian.y > this.scene.player.himSelf.y + 15)
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

        this.idling(guardian, jeu);
    }
  }

  idling(guardian, jeu){
    if(guardian.aggro)
      this.setAggroSound(guardian, jeu);
    guardian.aggro = false;
    if(guardian.lastDirection == "B"){
        if(guardian.anims.currentAnim == null || guardian.anims.currentAnim.key != "backIdle" || guardian.anims.currentAnim.key != "backIdleF" || !guardian.anims.isPlaying){
          if(guardian.gender == "M") guardian.anims.play("backIdle", true);
          else guardian.anims.play("backIdleF", true);
        }
    }else if(guardian.lastDirection == "F"){
        if(guardian.anims.currentAnim == null || guardian.anims.currentAnim.key != "frontIdle" || guardian.anims.currentAnim.key != "frontIdleF" || !guardian.anims.isPlaying){
          if(guardian.gender == "M") guardian.anims.play("frontIdle", true);
          else guardian.anims.play("frontIdleF", true);
        }
    }else if(guardian.lastDirection == "L"){
        if(guardian.anims.currentAnim == null || guardian.anims.currentAnim.key != "leftIdle" || guardian.anims.currentAnim.key != "leftIdleF" || !guardian.anims.isPlaying){
          if(guardian.gender == "M") guardian.anims.play("leftIdle", true);
          else guardian.anims.play("leftIdleF", true);
        }
    }else if(guardian.lastDirection == "R"){
        if(guardian.anims.currentAnim == null || guardian.anims.currentAnim.key != "rightIdle" || guardian.anims.currentAnim.key != "rightIdleF" || !guardian.anims.isPlaying){
          if(guardian.gender == "M") guardian.anims.play("rightIdle", true);
          else guardian.anims.play("rightIdleF", true);
        }
    }
  }

  takeDamage(guardian, typeOfAtk){
    if(guardian.isInvulnerability || guardian.isDead) return;

    guardian.setVelocity(0);
    guardian.hurt = true;
    switch(guardian.lastDirection){
        case "B":
          if(guardian.gender == "M") guardian.anims.play("backHurt", true);
          else guardian.anims.play("backHurtF", true);
          break;
        case "F":
          if(guardian.gender == "M") guardian.anims.play("frontHurt", true);
          else guardian.anims.play("frontHurtF", true);
          break;
        case "L":
          if(guardian.gender == "M") guardian.anims.play("leftHurt", true);
          else guardian.anims.play("leftHurtF", true);
          break;
        case "R":
          if(guardian.gender == "M") guardian.anims.play("rightHurt", true);
          else guardian.anims.play("rightHurtF", true);
          break;
    }
    if(typeOfAtk == 1) guardian.hp -= 1;
    else guardian.hp -= 2;
    console.log("Guardian lose HP ! ("+guardian.hp+"/10)");
    guardian.greenBar.setScale((guardian.hp/10)*0.3, 0.3);
    guardian.isInvulnerability = true;
    if(guardian.hp <= 0){
        this.die(guardian);
    }
  }

  swingSword(guardian){
    if(guardian.isAttacking || guardian.isDead) return;

    guardian.setVelocity(0);
    guardian.isAttacking = true;

    switch(guardian.lastDirection){
        case "B":
            this.atqSound.play();
            if(guardian.gender == "M") guardian.anims.play("backAtq1", true);
            else guardian.anims.play("backAtq1F", true);
          break;
        case "F":
            this.atqSound.play();
            if(guardian.gender == "M") guardian.anims.play("frontAtq1", true);
            else guardian.anims.play("frontAtq1F", true);
          break;
        case "L":
            this.atqSound.play();
            if(guardian.gender == "M") guardian.anims.play("leftAtq1", true);
            else guardian.anims.play("leftAtq1F", true);
          break;
        case "R":
            this.atqSound.play();
            if(guardian.gender == "M") guardian.anims.play("rightAtq1", true);
            else guardian.anims.play("rightAtq1F", true);
          break;
    }

    this.scene.time.delayedCall(800, ()=>{ guardian.isAttacking = false; });

    this.scene.player.takeDamage();
    
  }

  die(guardian){
    this.deathSound.play();
    guardian.isDead = true;
    guardian.redBar.destroy();
    guardian.greenBar.destroy();
    switch(guardian.lastDirection){
        case "B":
          if(guardian.gender == "M") guardian.anims.play("backDied", true);
          else guardian.anims.play("backDiedF", true);
          break;
        case "F":
          if(guardian.gender == "M") guardian.anims.play("frontDied", true);
          else guardian.anims.play("frontDiedF", true);
          break;
        case "L":
          if(guardian.gender == "M") guardian.anims.play("leftDied", true);
          else guardian.anims.play("leftDiedF", true);
          break;
        case "R":
          if(guardian.gender == "M") guardian.anims.play("rightDied", true);
          else guardian.anims.play("rightDiedF", true);
          break;
    }
    this.scene.time.delayedCall(1900, ()=>{ guardian.destroy(); });
  }

}