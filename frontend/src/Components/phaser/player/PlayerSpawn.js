import Phaser from "phaser";

const PATH_ASSETS = "../../assets/";
const PATH_PLAYERS = PATH_ASSETS + "players/";

export default class PlayerSpawner{
    /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene, resizingFactor, playerKey = "guardian") {
    this.scene = scene;
    this.resizingFactor = resizingFactor;
    this.key = playerKey;
  }
}