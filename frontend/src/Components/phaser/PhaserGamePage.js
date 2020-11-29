import Phaser from "phaser";
import GameScene from "./GameScene.js";
import MenuScene from "./MenuScene.js";
import { RedirectUrl } from "../Router.js";
import { setTitle } from "../../utils/render.js";
import { getUserSessionData } from "../../utils/session.js";

var game;

const PhaserGamePage = () => {
  const user = getUserSessionData();
  if (!user) {
    return RedirectUrl("/error", "Resource not authorized. Please login.");
  }

  setTitle("Game");
  let phaserGame = `
  <div id="gameDiv" class="d-flex justify-content-center my-3 offset-2 pl-4">
  </div>`;

  let page = document.querySelector("#page");
  page.innerHTML = phaserGame;

  let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: true,
      },
    },
    scene: [ GameScene, MenuScene ],
    //  parent DOM element into which the canvas created by the renderer will be injected.
    parent: "gameDiv",
  };

  // there could be issues when a game was quit (events no longer working)
  // therefore destroy any started game prior to recreate it
  //KillGame();
  game = new Phaser.Game(config);
  return game.globals = { musicVolume: 0.2, sexe: "H" };
};

function KillGame() {
  if(game) game.destroy(true);
}

export default PhaserGamePage;
export { PhaserGamePage, KillGame };