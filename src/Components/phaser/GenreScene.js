import Phaser from "phaser";

const PATH_ASSETS = "../assets/";
const PATH_UI = PATH_ASSETS + "ui/";
const PATH_TEXT = PATH_UI + "textAffichage/";
const PATH_GENREMENU = PATH_UI + "genreMenu/";
const PATH_CURSORS = PATH_UI + "cursors/";
const PATH_SOUNDS = PATH_ASSETS + "sounds/";
const PATH_MUSIC = PATH_SOUNDS + "musics/";

class GenreScene extends Phaser.Scene {
    constructor() {
        super("genre_scene");
        this.cursors = undefined;
        this.globals = undefined;
        this.warriorM = undefined;
        this.borderM = undefined;
        this.shadowM = undefined;
        this.warriorF = undefined;
        this.borderF = undefined;
        this.shadowF = undefined;
    }

    preload() {
        this.globals = this.sys.game.globals;

        this.load.image("background", PATH_GENREMENU + "Background.png");
        this.load.image("warriorM", PATH_GENREMENU + "WarriorMSelect.png");
        this.load.image("warriorF", PATH_GENREMENU + "WarriorFSelect.png");
        this.load.image("border", PATH_GENREMENU + "Border.png");
        this.load.image("shadow", PATH_GENREMENU + "Shadow.png");

        //text
        this.load.image("choisissezVotreCorrompu", PATH_TEXT + "choisissezVotreCorrompu.png");

        //music
        this.load.audio("debut", PATH_MUSIC +"debut.mp3");

        // Mouse
        this.input.setDefaultCursor('url(' + PATH_CURSORS + 'Cursor_Normal.png), pointer');
    }

    create() {
        let jeu = this;
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        this.add.image(width/2,height/2,"background");

        this.add.image(width/2, height/2 - 200, "choisissezVotreCorrompu").setScale(1.2);

        this.warriorM = this.add.sprite(width / 2 - 140, height / 2, "warriorM").setScale(0.4).setFlipX(true).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
        this.borderM = this.add.sprite(width / 2 - 175, height / 2 + 177, "border").setScale(0.3).setFlipY(true).setVisible(false);
        this.shadowM = this.add.sprite(width / 2 - 90, height / 2, "shadow").setFlipX(true).setFlipY(true).setVisible(false);
        this.shadowM.alpha = 0.4;

        this.warriorF = this.add.sprite(width / 2 + 140, height / 2, "warriorF").setScale(0.4).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
        this.borderF = this.add.sprite(width / 2 + 170, height / 2 + 177, "border").setScale(0.3).setFlipY(true).setVisible(false);
        this.shadowF = this.add.sprite(width / 2 + 85, height / 2, "shadow").setFlipY(true).setVisible(false);
        this.shadowF.alpha = 0.4;

        jeu.globals.bgm = jeu.sound.add("debut");
        jeu.globals.bgm.play();
        jeu.globals.bgm.volume = 0.3;
    }

    update() {
        this.warriorM.on("pointerover", () => {
            this.shadowM.setVisible(true);
            this.borderM.setVisible(true);
        });
        this.warriorM.on("pointerout", () => {
            this.shadowM.setVisible(false);
            this.borderM.setVisible(false);
        });
        this.warriorM.on("pointerdown", () => {
            this.globals.gender = "M";
            this.scene.start('game_scene');
            this.scene.destroy();
        });

        this.warriorF.on("pointerover", () => {
            this.shadowF.setVisible(true);
            this.borderF.setVisible(true);
        });
        this.warriorF.on("pointerout", () => {
            this.shadowF.setVisible(false);
            this.borderF.setVisible(false);
        });
        this.warriorF.on("pointerdown", () => {
            this.globals.gender = "F";
            this.scene.start('game_scene');
            this.scene.destroy();
        });

    }
}

export default GenreScene;