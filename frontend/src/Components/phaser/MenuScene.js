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
      this.buttonTribal = undefined;
    }
  
    preload() {
        this.globals = this.sys.game.globals;

        this.test = false;

        this.load.image("button_settings", PATH_BUTTON + "settingButton.png");
        this.load.image("windows_menu", PATH_BUTTON + "menu.png");
        this.load.image("volume_text", PATH_BUTTON + "Volume Sonore.png");
        this.load.image("gender_M", PATH_GENDERS + "Gender_Male.png");
        this.load.image("gender_F", PATH_GENDERS + "Gender_Female.png");
        this.load.image("loadingBar1", PATH_PROGRESSBAR + "LoadingBar_Fill.png");
        this.load.image("switchToggle", PATH_SELECTS + "SwitchToggle.png");
        this.load.image("buttonTribal", PATH_SELECTS + "ButtonTribal.png");

        // Mouse
        this.input.setDefaultCursor('url(' + PATH_CURSORS + 'Cursor_Normal.png), pointer');
    }

    create(){
        let jeu = this;
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        this.setExitButton(jeu, width, height);
        this.setVolumeSonore(jeu, width, height);
        this.showGender(width, height);  
        this.test = true;      
    }

    update(){
        //
    }

    setExitButton(jeu, width, height){
        this.exitButton = this.add.sprite(width-30,30,"button_settings").setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' }).setScrollFactor(0);
        this.add.sprite(width / 2, height / 2, "windows_menu").setScale(0.9);
        this.exitButton.on("pointerdown",function(){
            jeu.scene.resume('game_scene');
            jeu.scene.stop();
        });
    }

    setVolumeSonore(jeu, width, height){
        this.add.sprite(width / 2, height / 2 - 200, "volume_text");
        this.add.image(240,270, 'loadingBar1').setScale(0.17).setX(width / 2).setY(height / 2 - 150).setFlipX(true);
        this.dragButton = this.add.sprite((this.globals.musicVolume*280)+260, height / 2 - 150, "switchToggle").setScale(0.3).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' }).setFlipX(true);
        this.input.setDraggable(this.dragButton);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            if(pointer.x <= 260) gameObject.x = 260;
            else if(pointer.x >= 540) gameObject.x = 540;
            else gameObject.x = pointer.x;
            //console.log(pointer.x);
            jeu.globals.musicVolume = ((gameObject.x-260)/280).toFixed(2);
            jeu.globals.bgm.volume = jeu.globals.musicVolume;
            //console.log(jeu.globals);
        });
    }

    showGender(width, height){
        this.add.sprite(width / 2 - 100, height / 2 - 90, "gender_M").setScale(0.5);
        this.add.sprite(width / 2 + 100, height / 2 - 90, "gender_F").setScale(0.5);

        let widthFixed = undefined;
        if(this.globals.gender == "F")
            widthFixed = width / 2 + 40;
        else 
            widthFixed = width / 2 - 50;

        this.buttonTribal = this.add.sprite(widthFixed, height / 2 - 90, "buttonTribal").setScale(0.5).setInteractive();

        if(this.globals.gender == "M")
            this.buttonTribal.angle = 180;

        this.tweens.add({
            targets : this.buttonTribal,
            x : widthFixed + 10,
            ease : "linear",
            duration : 1500,
            yoyo : true ,
            repeat : -1,
        });
    }
}

export default MenuScene;