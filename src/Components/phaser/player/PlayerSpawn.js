import Phaser from "phaser";

const PATH_ASSETS = "../../assets/";
const PATH_PLAYERS = PATH_ASSETS + "players/";

const PLAYER_SPEED = 80;

export default class PlayerSpawner{
    /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, resizingFactor, playerKey = "player", spawnX = 900, spawnY = 450) {
    this.scene = scene;
    this.resizingFactor = resizingFactor;
    this.key = playerKey;
    //this.globals = this.scene.sys.game.globals;
    this.createAnims();
    this.himSelf = this.scene.physics.add.sprite(spawnX, spawnY, "playerFront", "Warrior_Idle_Blinking_0").setScale(resizingFactor).setSize(170, 170).setOffset(470,670);
    this.hp = 10;
    this.lastDirection = "F";
    this.ableToMove = true;
    this.hurt = false;
    this.isInvulnerability = false;
    this.alreadyatk = false;
    // ZoneAtk
    this.aoe = undefined;
    this.aoeX = 0;
    this.aoeY = 0;

    this.himSelf.setCollideWorldBounds(true);

    return this;
  }

    static loadAssets(jeu, globals){
        if(globals.gender == "F"){
            jeu.load.atlas("playerBack", PATH_PLAYERS+"WarriorFemaleBackAtlas.png", PATH_PLAYERS+"WarriorFemaleBackAtlas.json");
            jeu.load.atlas("playerRight", PATH_PLAYERS+"WarriorFemaleRightAtlas.png", PATH_PLAYERS+"WarriorFemaleRightAtlas.json");
            jeu.load.atlas("playerLeft", PATH_PLAYERS+"WarriorFemaleLeftAtlas.png", PATH_PLAYERS+"WarriorFemaleLeftAtlas.json");
            jeu.load.atlas("playerFront", PATH_PLAYERS+"WarriorFemaleFrontAtlas.png", PATH_PLAYERS+"WarriorFemaleFrontAtlas.json");
        }else{
            jeu.load.atlas("playerBack", PATH_PLAYERS+"WarriorMaleBackAtlas.png", PATH_PLAYERS+"WarriorMaleBackAtlas.json");
            jeu.load.atlas("playerRight", PATH_PLAYERS+"WarriorMaleRightAtlas.png", PATH_PLAYERS+"WarriorMaleRightAtlas.json");
            jeu.load.atlas("playerLeft", PATH_PLAYERS+"WarriorMaleLeftAtlas.png", PATH_PLAYERS+"WarriorMaleLeftAtlas.json");
            jeu.load.atlas("playerFront", PATH_PLAYERS+"WarriorMaleFrontAtlas.png", PATH_PLAYERS+"WarriorMaleFrontAtlas.json");
        }
    }

    createAnims(){
        this.scene.anims.create({
            key: "playerFrontWalk",
            frames: this.scene.anims.generateFrameNames("playerFront", {prefix: "Warrior_Walk_", start: 0, end: 29}),
            frameRate: 20,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerFrontRun",
            frames: this.scene.anims.generateFrameNames("playerFront", {prefix: "Warrior_Run_", start: 0, end: 14}),
            frameRate: 20,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerFrontIdle",
            frames: this.scene.anims.generateFrameNames("playerFront", {prefix: "Warrior_Idle_Blinking_", start: 0, end: 29}),
            frameRate: 15,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerFrontAtq1",
            frames: this.scene.anims.generateFrameNames("playerFront", {prefix: "Warrior_Attack_1_", start: 0, end: 14}),
            frameRate: 35,
            repeat: 0,
        });
      
        this.scene.anims.create({
            key: "playerFrontAtq2",
            frames: this.scene.anims.generateFrameNames("playerFront", {prefix: "Warrior_Attack_2_", start: 0, end: 14}),
            frameRate: 25,
            repeat: 0,
            delay: 450
        });
      
        this.scene.anims.create({
            key: "playerFrontDied",
            frames: this.scene.anims.generateFrameNames("playerFront", {prefix: "Warrior_Died_", start: 0, end: 29}),
            frameRate: 15,
            repeat: 0
        });
      
        this.scene.anims.create({
            key: "playerFrontHurt",
            frames: this.scene.anims.generateFrameNames("playerFront", {prefix: "Warrior_Hurt_", start: 0, end: 14}),
            frameRate: 20,
            repeat: 0
        });
      
        this.scene.anims.create({
            key: "playerBackWalk",
            frames: this.scene.anims.generateFrameNames("playerBack", {prefix: "Warrior_Walk_", start: 0, end: 29}),
            frameRate: 20,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerBackRun",
            frames: this.scene.anims.generateFrameNames("playerBack", {prefix: "Warrior_Run_", start: 0, end: 14}),
            frameRate: 20,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerBackIdle",
            frames: this.scene.anims.generateFrameNames("playerBack", {prefix: "Warrior_Idle_", start: 0, end: 29}),
            frameRate: 15,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerBackAtq1",
            frames: this.scene.anims.generateFrameNames("playerBack", {prefix: "Warrior_Attack_1_", start: 0, end: 14}),
            frameRate: 35,
            repeat: 0,
        });
      
        this.scene.anims.create({
            key: "playerBackAtq2",
            frames: this.scene.anims.generateFrameNames("playerBack", {prefix: "Warrior_Attack_2_", start: 0, end: 14}),
            frameRate: 25,
            repeat: 0,
            delay: 450
        });
      
        this.scene.anims.create({
            key: "playerBackDied",
            frames: this.scene.anims.generateFrameNames("playerBack", {prefix: "Warrior_Died_", start: 0, end: 29}),
            frameRate: 15,
            repeat: 0
        });
      
        this.scene.anims.create({
            key: "playerBackHurt",
            frames: this.scene.anims.generateFrameNames("playerBack", {prefix: "Warrior_Hurt_", start: 0, end: 14}),
            frameRate: 20,
            repeat: 0
        });
      
        this.scene.anims.create({
            key: "playerLeftWalk",
            frames: this.scene.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Walk_", start: 0, end: 29}),
            frameRate: 20,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerLeftRun",
            frames: this.scene.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Run_", start: 0, end: 14}),
            frameRate: 20,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerLeftIdle",
            frames: this.scene.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Idle_Blinking_", start: 0, end: 29}),
            frameRate: 15,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerLeftAtq1",
            frames: this.scene.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Attack_1_", start: 0, end: 14}),
            frameRate: 35,
            repeat: 0,
        });
      
        this.scene.anims.create({
            key: "playerLeftAtq2",
            frames: this.scene.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Attack_2_", start: 0, end: 14}),
            frameRate: 25,
            repeat: 0,
            delay: 450
        });
      
        this.scene.anims.create({
            key: "playerLeftDied",
            frames: this.scene.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Died_", start: 0, end: 29}),
            frameRate: 15,
            repeat: 0
        });
      
        this.scene.anims.create({
            key: "playerLeftHurt",
            frames: this.scene.anims.generateFrameNames("playerLeft", {prefix: "Warrior_Hurt_", start: 0, end: 14}),
            frameRate: 20,
            repeat: 0
        });
      
        this.scene.anims.create({
            key: "playerRightWalk",
            frames: this.scene.anims.generateFrameNames("playerRight", {prefix: "Warrior_Walk_", start: 0, end: 29}),
            frameRate: 20,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerRightRun",
            frames: this.scene.anims.generateFrameNames("playerRight", {prefix: "Warrior_Run_", start: 0, end: 14}),
            frameRate: 20,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerRightIdle",
            frames: this.scene.anims.generateFrameNames("playerRight", {prefix: "Warrior_Idle_Blinking_", start: 0, end: 29}),
            frameRate: 15,
            repeat: -1
        });
      
        this.scene.anims.create({
            key: "playerRightAtq1",
            frames: this.scene.anims.generateFrameNames("playerRight", {prefix: "Warrior_Attack_1_", start: 0, end: 14}),
            frameRate: 35,
            repeat: 0,
        });
      
        this.scene.anims.create({
            key: "playerRightAtq2",
            frames: this.scene.anims.generateFrameNames("playerRight", {prefix: "Warrior_Attack_2_", start: 0, end: 14}),
            frameRate: 25,
            repeat: 0,
            delay: 450
        });
      
        this.scene.anims.create({
            key: "playerRightDied",
            frames: this.scene.anims.generateFrameNames("playerRight", {prefix: "Warrior_Died_", start: 0, end: 29}),
            frameRate: 15,
            repeat: 0
        });
      
        this.scene.anims.create({
            key: "playerRightHurt",
            frames: this.scene.anims.generateFrameNames("playerRight", {prefix: "Warrior_Hurt_", start: 0, end: 14}),
            frameRate: 20,
            repeat: 0
        });
    }

    manageMovements(){
        if(!this.ableToMove) return;
        
        let runSpeed;
        if(this.scene.keys.run.isDown) runSpeed = 100;
        else runSpeed = 0;

        let player = this;

        if (this.scene.keys.up.isDown) {
        
            this.himSelf.setVelocityY(-(PLAYER_SPEED + runSpeed));
            if(this.scene.keys.left.isUp && this.scene.keys.right.isUp){
              this.lastDirection = "B";
              if(this.hurt && !this.isInvulnerability){
                this.himSelf.setVelocity(0);
                this.himSelf.anims.play("playerBackHurt", true);
                this.scene.time.delayedCall(200, () => { player.hurt = false; player.isInvulnerability = true; });
                this.scene.time.delayedCall(600, () => { player.isInvulnerability = false; });
              }else {
                if(runSpeed != 0){
                  this.himSelf.anims.play("playerBackRun", true);
                  this.destroyZoneAtk();
                } else {
                  this.scene.keys.atq1.once("down", ()=> { if(!player.hurt){ this.himSelf.anims.play("playerBackAtq1", true); this.setZoneAtk(1); }; });
                  if(this.scene.keys.atq2.isDown){
                    this.himSelf.anims.play("playerBackAtq2", true);
                    this.scene.time.delayedCall(400, () => { if(player.scene.keys.atq2.isDown) this.setZoneAtk(2); });
                  }else if(this.himSelf.anims.currentAnim == null || this.himSelf.anims.currentAnim.key != "playerBackAtq1" || !this.himSelf.anims.isPlaying){
                    this.himSelf.anims.play("playerBackWalk", true);
                    this.destroyZoneAtk();
                  }
                }
              }
            }
          } else if (this.scene.keys.down.isDown) {
            this.himSelf.setVelocityY(PLAYER_SPEED + runSpeed);
            if(this.scene.keys.left.isUp && this.scene.keys.right.isUp){
              this.lastDirection = "F";
              if(this.hurt && !this.isInvulnerability){
                this.himSelf.setVelocity(0);
                this.himSelf.anims.play("playerFrontHurt", true);
                this.scene.time.delayedCall(200, () => { player.hurt = false; player.isInvulnerability = true; });
                this.scene.time.delayedCall(600, () => { player.isInvulnerability = false; });
              }else {
                if(runSpeed != 0){
                  this.himSelf.anims.play("playerFrontRun", true);
                  this.destroyZoneAtk();
                } else {
                  this.scene.keys.atq1.once("down", ()=> { if(!player.hurt){ this.himSelf.anims.play("playerFrontAtq1", true); this.setZoneAtk(1); }; });
                  if(this.scene.keys.atq2.isDown){
                    this.himSelf.anims.play("playerFrontAtq2", true);
                    this.scene.time.delayedCall(400, () => { if(player.scene.keys.atq2.isDown) this.setZoneAtk(2); });
                  }else if(this.himSelf.anims.currentAnim == null || this.himSelf.anims.currentAnim.key != "playerFrontAtq1" || !this.himSelf.anims.isPlaying){
                    this.himSelf.anims.play("playerFrontWalk", true);
                    this.destroyZoneAtk();
                  }
                }
              }
            }
          } else {
            this.himSelf.setVelocityY(0);
          }
    
          if (this.scene.keys.left.isDown) {
            this.himSelf.setVelocityX(-(PLAYER_SPEED + runSpeed));
            this.lastDirection = "L";
            if(this.hurt && !this.isInvulnerability){
              this.himSelf.setVelocity(0);
              this.himSelf.anims.play("playerLeftHurt", true);
              this.scene.time.delayedCall(200, () => { player.hurt = false; player.isInvulnerability = true; });
              this.scene.time.delayedCall(600, () => { player.isInvulnerability = false; });
            }else {
              if(runSpeed != 0){
                this.himSelf.anims.play("playerLeftRun", true);
                this.destroyZoneAtk();
              } else {
                this.scene.keys.atq1.once("down", ()=> { if(!player.hurt){ this.himSelf.anims.play("playerLeftAtq1", true); this.setZoneAtk(1); }; });
                if(this.scene.keys.atq2.isDown){
                  this.himSelf.anims.play("playerLeftAtq2", true);
                  this.scene.time.delayedCall(400, () => { if(player.scene.keys.atq2.isDown) this.setZoneAtk(2); });
                }else if(this.himSelf.anims.currentAnim == null || this.himSelf.anims.currentAnim.key != "playerLeftAtq1" || !this.himSelf.anims.isPlaying){
                  this.himSelf.anims.play("playerLeftWalk", true);
                  this.destroyZoneAtk();
                }
              }
            }
          } else if (this.scene.keys.right.isDown) {
            this.himSelf.setVelocityX(PLAYER_SPEED + runSpeed);
            this.lastDirection = "R";
            if(this.hurt && !this.isInvulnerability){
              this.himSelf.setVelocity(0);
              this.himSelf.anims.play("playerRightHurt", true);
              this.scene.time.delayedCall(200, () => { player.hurt = false; player.isInvulnerability = true; });
              this.scene.time.delayedCall(600, () => { player.isInvulnerability = false; });
            }else {
              if(runSpeed != 0){
                this.himSelf.anims.play("playerRightRun", true);
                this.destroyZoneAtk();
              } else {
                this.scene.keys.atq1.once("down", ()=> { if(!player.hurt){ this.himSelf.anims.play("playerRightAtq1", true); this.setZoneAtk(1); }; });
                if(this.scene.keys.atq2.isDown){
                  this.himSelf.anims.play("playerRightAtq2", true);
                  this.scene.time.delayedCall(400, () => { if(player.scene.keys.atq2.isDown) this.setZoneAtk(2); });
                }else if(this.himSelf.anims.currentAnim == null || this.himSelf.anims.currentAnim.key != "playerRightAtq1" || !this.himSelf.anims.isPlaying){
                  this.himSelf.anims.play("playerRightWalk", true);
                  this.destroyZoneAtk();
                }
              }
            }
          } else {
            this.himSelf.setVelocityX(0);
          }
    
          if(this.scene.keys.up.isUp && this.scene.keys.down.isUp && this.scene.keys.left.isUp && this.scene.keys.right.isUp){
    
            if(this.lastDirection == "B"){
              if(this.hurt && !this.isInvulnerability){
                this.himSelf.setVelocity(0);
                this.himSelf.anims.play("playerBackHurt", true);
                this.scene.time.delayedCall(200, () => { player.hurt = false; player.isInvulnerability = true; });
                this.scene.time.delayedCall(600, () => { player.isInvulnerability = false; });
              }else {
                this.scene.keys.atq1.once("down", ()=> { if(!player.hurt){ this.himSelf.anims.play("playerBackAtq1", true); this.setZoneAtk(1); }; });
                if(this.scene.keys.atq2.isDown){
                  this.himSelf.anims.play("playerBackAtq2", true);
                  this.scene.time.delayedCall(400, () => { if(player.scene.keys.atq2.isDown) this.setZoneAtk(2); });
                }else if(this.himSelf.anims.currentAnim == null || this.himSelf.anims.currentAnim.key != "playerBackAtq1" || !this.himSelf.anims.isPlaying){
                  this.himSelf.anims.play("playerBackIdle", true);
                  this.destroyZoneAtk();
                }
              } 
            }else if(this.lastDirection == "F"){
              if(this.hurt && !this.isInvulnerability){
                this.himSelf.setVelocity(0);
                this.himSelf.anims.play("playerFrontHurt", true);
                this.scene.time.delayedCall(200, () => { player.hurt = false; player.isInvulnerability = true; });
                this.scene.time.delayedCall(600, () => { player.isInvulnerability = false; });
              }else {
                this.scene.keys.atq1.once("down", ()=> { if(!player.hurt){ this.himSelf.anims.play("playerFrontAtq1", true); this.setZoneAtk(1); }; });
                if(this.scene.keys.atq2.isDown){
                  this.himSelf.anims.play("playerFrontAtq2", true);
                  this.scene.time.delayedCall(400, () => { if(player.scene.keys.atq2.isDown) this.setZoneAtk(2); });
                }else if(this.himSelf.anims.currentAnim == null || this.himSelf.anims.currentAnim.key != "playerFrontAtq1" || !this.himSelf.anims.isPlaying){
                  this.himSelf.anims.play("playerFrontIdle", true);
                  this.destroyZoneAtk();
                }
              }
            }else if(this.lastDirection == "L"){
              if(this.hurt && !this.isInvulnerability){
                this.himSelf.setVelocity(0);
                this.himSelf.anims.play("playerLeftHurt", true);
                this.scene.time.delayedCall(200, () => { player.hurt = false; player.isInvulnerability = true; });
                this.scene.time.delayedCall(600, () => { player.isInvulnerability = false; });
              }else {
                this.scene.keys.atq1.once("down", ()=> { if(!player.hurt){ this.himSelf.anims.play("playerLeftAtq1", true); this.setZoneAtk(1); }; });
                if(this.scene.keys.atq2.isDown){
                  this.himSelf.anims.play("playerLeftAtq2", true);
                  this.scene.time.delayedCall(400, () => { if(player.scene.keys.atq2.isDown) this.setZoneAtk(2); });
                }else if(this.himSelf.anims.currentAnim == null || this.himSelf.anims.currentAnim.key != "playerLeftAtq1" || !this.himSelf.anims.isPlaying){
                  this.himSelf.anims.play("playerLeftIdle", true);
                  this.destroyZoneAtk();
                }
              }
            }else if(this.lastDirection == "R"){
              if(this.hurt && !this.isInvulnerability){
                this.himSelf.setVelocity(0);
                this.himSelf.anims.play("playerRightHurt", true);
                this.scene.time.delayedCall(200, () => { player.hurt = false; player.isInvulnerability = true; });
                this.scene.time.delayedCall(600, () => { player.isInvulnerability = false; });
              }else {
                this.scene.keys.atq1.once("down", ()=> { if(!player.hurt){ this.himSelf.anims.play("playerRightAtq1", true); this.setZoneAtk(1); }; });
                if(this.scene.keys.atq2.isDown){
                  this.himSelf.anims.play("playerRightAtq2", true);
                  this.scene.time.delayedCall(400, () => { if(player.scene.keys.atq2.isDown) this.setZoneAtk(2); });
                }else if(this.himSelf.anims.currentAnim == null || this.himSelf.anims.currentAnim.key != "playerRightAtq1" || !this.himSelf.anims.isPlaying){
                  this.himSelf.anims.play("playerRightIdle", true);
                  this.destroyZoneAtk();
                }
              }
            }
        }
    }

    setZoneAtk(typeOfAtk){
        if(this.alreadyatk) return;

        this.aoeX = 0;
        this.aoeY = 0;
        let sizeX = 20;
        let sizeY = 20;
        switch(this.lastDirection){
            case "B":
                //this.aoeY += 10;
                sizeX += 20;
                break;
            case "F":
                this.aoeY += 40;
                sizeX += 20;
                break;
            case "L":
                this.aoeX -= 20;
                this.aoeY += 20;
                sizeY += 20;
                break;
            case "R":
                this.aoeX += 20;
                this.aoeY += 20;
                sizeY += 20;
                break;
            default:
                this.lastDirection = "B";
                this.setZoneAtk(typeOfAtk);
                break;
        }

        this.alreadyatk = true;
        this.aoe = this.scene.add.zone(this.himSelf.x + this.aoeX, this.himSelf.y + this.aoeY).setSize(sizeX, sizeY);
        this.scene.physics.world.enable(this.aoe, 0);
        this.scene.guardianGroup.getChildren().forEach(element => {
            let jeu = this.scene;
            this.scene.physics.add.overlap(this.aoe, element, function () { jeu.guardianSpawner.takeDamage(element, typeOfAtk); });
        });

        let player = this;
        if(typeOfAtk == 2) this.scene.time.delayedCall(900, () => { if(player.scene.keys.atq2.isDown) player.destroyZoneAtk(); });
    }

    updateZoneAtk(){
        if(this.aoe && this.aoe.x != this.himSelf.x+this.aoeX) this.aoe.x = this.himSelf.x+this.aoeX;
        if(this.aoe && this.aoe.y != this.himSelf.y+this.aoeY) this.aoe.y = this.himSelf.y+this.aoeY;
    }

    destroyZoneAtk(){
        if(this.aoe && this.aoe.body) {
            this.aoe.destroy();
            this.scene.guardianGroup.getChildren().forEach(element => {
              element.isInvulnerability = false;
            });
            this.alreadyatk = false;
        }
    }

    takeDamage(){
        if(this.isInvulnerability) return;
    
        this.hurt = true;
        this.hp -= 1;
        this.scene.greenBar.setScale((this.hp/10), 1);
        if(this.hp == 0){
            this.gameOver();
        }
    }
  
    gameOver(){
      console.log("Game Over");
      this.himSelf.body.stop();
      this.ableToMove = false;
      switch(this.lastDirection){
        case "B":
          this.himSelf.anims.play("playerBackDied", true);
          break;
        case "F":
          this.himSelf.anims.play("playerFrontDied", true);
          break;
        case "L":
          this.himSelf.anims.play("playerLeftDied", true);
          break;
        case "R":
          this.himSelf.anims.play("playerRightDied", true);
          break;
      }
      //this.scene.restart();
    }

}