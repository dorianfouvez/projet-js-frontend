import Phaser from "phaser";

export default class LadyBugSpawner {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, ladyBugKey = "ladyBug") {
    this.scene = scene;
    this.key = ladyBugKey;

    this._group = this.scene.physics.add.group();
  }

  get group() {
    return this._group;
  }

  spawn(playerX = 0) {
    const x =
      playerX < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    const ladyBug = this.group.create(x, 16, this.key);
    ladyBug.setBounce(1);
    ladyBug.setCollideWorldBounds(true);
    ladyBug.setVelocity(Phaser.Math.Between(-200, 200), 20);

    return ladyBug;
  }
}
