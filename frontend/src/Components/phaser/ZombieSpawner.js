import Phaser from "phaser";

export default class  ZombieSpawner{
    /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, zombieKey = "zombie") {
    this.scene = scene;
    this.key = zombieKey;

    this._group = this.scene.physics.add.group();
  }

  get group() {
    return this._group;
  }
  spawn(playerX = 0) {
    let x = 100;
    const zombie = this.group.create(x, 480, this.key).setScale(0.5).setSize(120,200).setOffset(30,50);
    zombie.setCollideWorldBounds(true);
    this.animZombie();
    this.deplacement(x,zombie);
    return zombie;
    
  }
  animZombie(){
    this.scene.anims.create({
        key : "zombieWalk",
        frames : this.scene.anims.generateFrameNames(this.key, {prefix: "character_zombie_walk", start:0, end: 7}),
        frameRate : 5,
        repeat : -1
      });
  }
  deplacement(moving,zombie){
    zombie.anims.play("zombieWalk");
    var tween=this.scene.tweens.add({
      targets : zombie,
      x : moving+400,
      ease : "linear",
      duration : 1300,
      yoyo : true ,
      repeat : -1,
      onstart : function(){},
      onComplete : function(){},
      onYoyo : function(){zombie.flipX = true;},
      onRepeat : function(){zombie.flipX = false;},

    })
  }
}