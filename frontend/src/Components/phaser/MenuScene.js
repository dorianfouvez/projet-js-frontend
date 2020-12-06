import Phaser from "phaser";

const PATH_ASSETS = "../assets/";
const PATH_BUTTON = PATH_ASSETS + "button/";
const PATH_PROGRESSBAR = PATH_ASSETS + "progressBar/";
const PATH_UI = PATH_ASSETS + "ui/";
const PATH_CURSORS = PATH_UI + "cursors/";
const PATH_MENU = PATH_UI + "menu/";
const PATH_TEXT = PATH_UI + "textAffichage/";

class MenuScene extends Phaser.Scene {
    constructor() {
        super("menu_scene");
        this.cursors = undefined;
        this.globals = undefined;
        this.exitButton = undefined;
        this.VolumeText = undefined;
        this.dragButton = undefined;

        this.deplacementVersLeHaut = undefined;
        this.deplacementVersLeBas = undefined;
        this.deplacementVersLaGauche = undefined;
        this.deplacementVersLaDroite = undefined;
        this.courir = undefined;
        this.attaqueDeBase = undefined;
        this.attaqueChargee = undefined;

        this.flecheTribal = undefined;
        this.tribal = undefined;
        this.premiereFois = true;

        this.verification = undefined;
    }
  
    preload() {
        this.globals = this.sys.game.globals;

        this.load.image("settingButton", PATH_BUTTON + "settingButton.png");
        this.load.image("switchToggle", PATH_BUTTON + "switchToggle.png");

        //UI AFFICHAGE
        this.load.image("menu", PATH_MENU + "menu.png");
        this.load.image("flecheTribal", PATH_MENU + "flecheTribal.png");
        this.load.image("popupAide", PATH_MENU + "popupAide.png");
        this.load.image("sonoreBar", PATH_PROGRESSBAR + "LoadingBar_Fill.png");

        //text
        this.load.image("volumeSonore", PATH_TEXT + "volumeSonore.png");
        this.load.image("attaqueChargee", PATH_TEXT + "attaqueChargee.png");
        this.load.image("attaqueDeBase", PATH_TEXT + "attaqueDeBase.png");
        this.load.image("choisissezVotreCorrompu", PATH_TEXT + "choisissezVotreCorrompu.png");
        this.load.image("courir", PATH_TEXT + "courir.png");
        this.load.image("deplacementVersLaDroite", PATH_TEXT + "deplacementVersLaDroite.png");
        this.load.image("deplacementVersLaGauche", PATH_TEXT + "deplacementVersLaGauche.png");
        this.load.image("deplacementVersLeBas", PATH_TEXT + "deplacementVersLeBas.png");
        this.load.image("deplacementVersLeHaut", PATH_TEXT + "deplacementVersLeHaut.png");

        // Mouse
        this.input.setDefaultCursor('url(' + PATH_CURSORS + 'Cursor_Normal.png), pointer');
    }

    create(){
        let jeu = this;
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        this.setExitButton(width, height);
        this.setVolumeSonore(width, height);
        this.setTouches(width, height);
        this.manageTouches(jeu, width, height);   
    }

    update(){
        if(this.flecheTribal)
            this.exitButton.setVisible(false);
        else
            this.exitButton.setVisible(true);
        
        let jeu = this;
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        this.manageExitButton(jeu);
        this.manageVolume(jeu);
        this.testTouches(jeu);
    }

    setExitButton(width, height){
        this.exitButton = this.add.sprite(width-30,30,"settingButton").setScale(1.1).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' }).setScrollFactor(0);
        
        if(this.scale.isFullscreen){
            this.add.sprite(width / 2, height / 2, "menu").setScale(0.5);
            if(this.premiereFois == true)
                this.add.image(width/2 + 400, height / 2 - 90, "popupAide");
        }else{
            this.add.sprite(width / 2, height / 2, "menu").setScale(0.3);
            if(this.premiereFois == true)
                this.add.image(width/2 + 250, height / 2 - 30, "popupAide").setScale(0.7);
        }
    }

    manageExitButton(jeu){ 
        this.exitButton.on("pointerdown",function(){
            jeu.premiereFois = false;
            jeu.globals.modifSetting = true;
            jeu.scene.resume('game_scene');
            jeu.scene.stop(); 
        });
    }

    setVolumeSonore(width, height){

        if(this.scale.isFullscreen){
            this.add.sprite(width / 2, height / 2 - 350, "volumeSonore").setScale(1.4);
            this.add.image(240,270, 'sonoreBar').setScale(0.3).setX(width / 2).setY(height / 2 - 280).setFlipX(true);
            this.dragButton = this.add.sprite((this.globals.musicVolume*280)+1000, height / 2 - 280, "switchToggle").setScale(0.5).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' }).setFlipX(true);
        }else{
            this.add.sprite(width / 2, height / 2 - 210, "volumeSonore").setScale(0.8);
            this.add.image(240,270, 'sonoreBar').setScale(0.17).setX(width / 2).setY(height / 2 - 160).setFlipX(true);
            this.dragButton = this.add.sprite((this.globals.musicVolume*280)+260, height / 2 - 160, "switchToggle").setScale(0.3).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' }).setFlipX(true);
        }

        this.input.setDraggable(this.dragButton);

    }

    manageVolume(jeu){
        if(this.scale.isFullscreen){
            this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                if(pointer.x <= 708) gameObject.x = 710;
                else if(pointer.x >= 1212) gameObject.x = 1212;
                else gameObject.x = pointer.x;
                jeu.globals.musicVolume = ((gameObject.x-1000)/280).toFixed(2);
                jeu.globals.bgm.volume = jeu.globals.musicVolume;
            });
        }else{
            this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                if(pointer.x <= 258) gameObject.x = 258;
                else if(pointer.x >= 542) gameObject.x = 542;
                else gameObject.x = pointer.x;
                jeu.globals.musicVolume = ((gameObject.x-260)/280).toFixed(2);
                jeu.globals.bgm.volume = jeu.globals.musicVolume;
            });
        }  
    }

    setTouches(width, height){
        if(this.scale.isFullscreen){
            this.deplacementVersLeHaut = this.add.sprite(width / 2 , height / 2 - 180, "deplacementVersLeHaut").setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.deplacementVersLeBas = this.add.sprite(width / 2, height / 2 - 100, "deplacementVersLeBas").setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.deplacementVersLaGauche = this.add.sprite(width / 2, height / 2 - 20, "deplacementVersLaGauche").setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.deplacementVersLaDroite = this.add.sprite(width / 2, height / 2 + 60, "deplacementVersLaDroite").setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.courir = this.add.sprite(width / 2 , height / 2 + 140, "courir").setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.attaqueDeBase = this.add.sprite(width / 2  , height / 2 + 220, "attaqueDeBase").setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.attaqueChargee = this.add.sprite(width / 2  , height / 2 + 300, "attaqueChargee").setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
        }else{
            this.deplacementVersLeHaut = this.add.sprite(width / 2 , height / 2 - 100, "deplacementVersLeHaut").setScale(0.65).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.deplacementVersLeBas = this.add.sprite(width / 2, height / 2 - 50, "deplacementVersLeBas").setScale(0.65).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.deplacementVersLaGauche = this.add.sprite(width / 2, height / 2, "deplacementVersLaGauche").setScale(0.65).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.deplacementVersLaDroite = this.add.sprite(width / 2, height / 2 + 50, "deplacementVersLaDroite").setScale(0.65).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.courir = this.add.sprite(width / 2 , height / 2 + 100, "courir").setScale(0.65).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.attaqueDeBase = this.add.sprite(width / 2  , height / 2 + 150, "attaqueDeBase").setScale(0.65).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
            this.attaqueChargee = this.add.sprite(width / 2  , height / 2 + 200, "attaqueChargee").setScale(0.65).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
        }
    }

    testTouches(jeu){
        this.deplacementVersLeHaut.on("pointerdown", () => {
            jeu.verification = "up";
        });
        this.deplacementVersLeBas.on("pointerdown", () => {
            jeu.verification = "down";
        });
    }

    manageTouches(jeu,width, height){
       
        this.deplacementVersLeHaut.on("pointerup", () => {
            if(this.scale.isFullscreen)
                this.commencerAnimationFull(width/2 - 223, height/2 - 174);
            else
                this.commencerAnimationMin(width/2 - 142, height/2 - 94);

            this.input.keyboard.on("keydown", (e) => {
                if(e.keyCode != 112 && jeu.verification == "up"){
                    jeu.globals.up = e.keyCode;
                    jeu.arreterAnimation();
                }
            });
        });

        this.deplacementVersLeBas.on("pointerup", () => {
            if(this.scale.isFullscreen)
                this.commencerAnimationFull(width/2 - 213, height/2 - 94);
            else
                this.commencerAnimationMin(width/2 - 135, height/2 - 44);
            
            this.input.keyboard.on("keyup", (e) => {
                if(e.keyCode != 112 && jeu.verification == "down"){
                    jeu.globals.down = e.keyCode;
                    jeu.arreterAnimation();
                }
            });
        });

        this.deplacementVersLaGauche.on("pointerdown", () => {
            if(this.flecheTribal == undefined){
                if(this.scale.isFullscreen)
                    this.commencerAnimationFull(width/2 - 235, height/2 - 14);
                else
                    this.commencerAnimationMin(width/2 - 150, height/2 + 6);
                this.input.keyboard.on("keyup", (e) => {
                    if(e.keyCode != 112){
                        jeu.globals.left = e.keyCode;
                        this.arreterAnimation();
                    }
                });
            }
        });

        this.deplacementVersLaDroite.on("pointerdown", () => {
            if(this.flecheTribal == undefined){
                if(this.scale.isFullscreen)
                    this.commencerAnimationFull(width/2 - 232, height/2 + 66);
                else
                    this.commencerAnimationMin(width/2 - 148, height/2 + 56);
                this.input.keyboard.on("keyup", (e) => {
                    if(e.keyCode != 112){
                        jeu.globals.right = e.keyCode;
                        this.arreterAnimation();
                    }   
                });
            }
        });

        this.courir.on("pointerdown", () => {
            if(this.flecheTribal == undefined){
                if(this.scale.isFullscreen)
                    this.commencerAnimationFull(width/2 - 90, height/2 + 144);
                else
                    this.commencerAnimationMin(width/2 - 55, height/2 + 104);
                this.input.keyboard.on("keyup", (e) => {
                    if(e.keyCode != 112){
                        jeu.globals.run = e.keyCode;
                        this.arreterAnimation();
                    }
                });
            }
        });

        this.attaqueDeBase.on("pointerdown", () => {
            if(this.flecheTribal == undefined){
                if(this.scale.isFullscreen)
                    this.commencerAnimationFull(width/2 - 152, height/2 + 230);
                else
                    this.commencerAnimationMin(width/2 - 95, height/2 + 157);
                this.input.keyboard.on("keyup", (e) => {
                    if(e.keyCode != 112){
                        jeu.globals.atq1 = e.keyCode;
                        this.arreterAnimation();
                    }
                });
            }
        });

        this.attaqueChargee.on("pointerdown", () => {
            if(this.flecheTribal == undefined){
                if(this.scale.isFullscreen)
                    this.commencerAnimationFull(width/2 - 152, height/2 + 310);
                else
                    this.commencerAnimationMin(width/2 - 95, height/2 + 207);
                this.input.keyboard.on("keyup", (e) => {
                    if(e.keyCode != 112){
                        jeu.globals.atq2 = e.keyCode;
                        this.arreterAnimation();
                    }
                });
            }
        });
    }

    assignation(signe, code){
        if(this.verif1){
            this.verif1 = false;
            this.verif2 = true;
            if(this.verif2){
                this.verif2 = false;
                if(signe == "up"){
                    this.test.up = code;
                }else{
                    this.test.down = code;
                }
            }
        }
    }

    commencerAnimationMin(width, height){
        
        this.tribal = this.add.sprite(width, height, "flecheTribal").setScale(0.3).setInteractive();
        
        this.flecheTribal = this.tweens.add({
            targets : this.tribal,
            x : width + 10,
            ease : "linear",
            duration : 1500,
            yoyo : true ,
            repeat : -1,
        });
    }

    commencerAnimationFull(width, height){
        
        this.tribal = this.add.sprite(width, height, "flecheTribal").setScale(0.5).setInteractive();
        
        this.flecheTribal = this.tweens.add({
            targets : this.tribal,
            x : width + 20,
            ease : "linear",
            duration : 1500,
            yoyo : true ,
            repeat : -1,
        });
    }

    arreterAnimation(){
        if(this.flecheTribal != null && this.tribal != null){
            this.flecheTribal.remove();
            this.tribal.destroy();
            this.tribal = undefined;
            this.flecheTribal = undefined;
        }
    }
}

/*  la touche ESC a fixer
    le switchToggle qui bug quand on passe du grand ecran au petit (il reste à une certaine place en fonction de ou on l'a mis )
    fixer la modification du volume sonore*/

export default MenuScene;