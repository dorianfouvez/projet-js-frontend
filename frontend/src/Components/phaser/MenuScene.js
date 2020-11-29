import Phaser from "phaser";

const PATH_ASSETS = "../assets/";
const PATH_BUTTON = PATH_ASSETS + "button/";
const PATH_PROGRESSBAR = PATH_ASSETS + "progressBar/";
const PATH_UI = PATH_ASSETS + "ui/";
const PATH_CURSORS = PATH_UI + "cursors/";
const PATH_GENDERS = PATH_UI + "genders/";
const PATH_SELECTS = PATH_UI + "selects/";

class MenuScene extends Phaser.Scene {
    constructor() {
      super("menu_scene");
      this.cursors = undefined;
      this.globals = undefined;
      this.exitButton = undefined;
      this.VolumeText = undefined;
      this.dragButton = undefined;
    }
  
    preload() {
        this.load.image("button_settings", PATH_BUTTON+"Settings.png");
        this.load.image("windows_menu", PATH_BUTTON + "panelInset_brown.png");
        this.load.image("switch_arrow", PATH_BUTTON + "CC_SwitchSelect_Arrow.png");
        this.load.image("volume_text", PATH_BUTTON + "Volume Sonore.png");
        this.load.image("gender_M", PATH_GENDERS + "Gender_Male.png");
        this.load.image("gender_F", PATH_GENDERS + "Gender_Female.png");
        this.load.image("loadingBar", PATH_PROGRESSBAR + "LoadingBar_3_Fill_Red.png");

        // Mouse
        this.input.setDefaultCursor('url(' + PATH_CURSORS + 'Cursor_Normal.png), pointer');
    }

    create(){
        this.globals = this.sys.game.globals;
        let jeu = this;
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        // Exit Button
        this.exitButton = this.add.sprite(width-30,30,"button_settings").setScale(1.5).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'cursorGauntlet_bronze.png), pointer' }).setScrollFactor(0);
        this.exitButton.setTint("0xB6AA9A");
        this.add.sprite(width / 2, height / 2, "windows_menu").setScale(4);
        this.exitButton.on("pointerdown",function(){
            jeu.scene.resume('game_scene');
            jeu.scene.stop();
        });
        
        // Volume Sonore
        this.add.sprite(width / 2 - 60, height / 2 - 130, "volume_text");
        this.add.image(240,270, 'loadingBar').setScale(0.17).setX(width / 2 + 9).setY(height / 2 -70);
        this.dragButton = this.add.sprite(/*width / 2 + 25*/(this.globals.musicVolume*280)+260, height / 2 - 70, "switch_arrow").setScale(0.7).setInteractive().setFlipX(true);
        this.input.setDraggable(this.dragButton);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            if(pointer.x <= 260) gameObject.x = 260;
            else if(pointer.x >= 540) gameObject.x = 540;
            else gameObject.x = pointer.x;
            //console.log(pointer.x);
            jeu.globals.musicVolume = (gameObject.x-260)/280;
            //console.log(jeu.globals);
        });
        
        // Gender
        this.add.sprite(width / 2 - 130, height / 2, "gender_M").setScale(0.5);
        this.add.sprite(width / 2 - 20, height / 2, "gender_F").setScale(0.5);
        if(this.globals.gender == "F"){
            this.add.sprite(width / 2 + 25, height / 2, "switch_arrow").setScale(0.7).setInteractive();
        }else{
            this.add.sprite(width / 2 - 85, height / 2, "switch_arrow").setScale(0.7).setInteractive();
        }


    }

    update(){
        //
    }
}

export default MenuScene;