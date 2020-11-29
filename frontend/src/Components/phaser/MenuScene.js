import Phaser from "phaser";

const PATH_ASSETS = "../assets/";
const PATH_BUTTON = PATH_ASSETS + "button/";

class MenuScene extends Phaser.Scene {
    constructor() {
      super("menu_scene");
      this.cursors = undefined;
      this.pauseButton = undefined;
      this.VolumeText = undefined;
    }
  
    preload() {
        this.load.image("button_settings", PATH_BUTTON+"Settings.png");
        this.load.image("windows_menu", PATH_BUTTON + "panelInset_brown.png");
        this.load.image("switch_arrow", PATH_BUTTON + "CC_SwitchSelect_Arrow.png");
    }

    create(){
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        this.pauseButton = this.add.sprite(width-30,30,"button_settings").setScale(1.5).setInteractive().setScrollFactor(0);
        this.pauseButton.setTint("0xB6AA9A");
        this.add.sprite(width / 2, height / 2, "windows_menu").setScale(4);

        this.VolumeText = this.make.text({
            x: width / 2 - 50,
            y: height / 2 - 100,
            text: 'Volume Sonor',
            style: {
              font: '35px Alex Brush',
              fill: '#ffffff'
            }
        });
        this.VolumeText.setOrigin(0.5, 0.5);

        let jeu = this;
        this.pauseButton.on("pointerdown",function(){
            jeu.scene.resume('game_scene');
            jeu.scene.stop();
        });
    }

    update(){
        //
    }
}

export default MenuScene;