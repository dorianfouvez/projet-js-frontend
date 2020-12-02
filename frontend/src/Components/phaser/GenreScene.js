import Phaser from "phaser";

const PATH_ASSETS = "../assets/";
const PATH_UI = PATH_ASSETS + "ui/";
const PATH_GENDERS = PATH_UI + "genders/";
const PATH_GENREMENU = PATH_UI + "genreMenu/";
const PATH_CURSORS = PATH_UI + "cursors/";

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

        this.load.image("gender_M", PATH_GENDERS + "Gender_Male.png");
        this.load.image("gender_F", PATH_GENDERS + "Gender_Female.png");
        this.load.image("background", PATH_GENREMENU + "Background.png");
        this.load.image("warriorM", PATH_GENREMENU + "WarriorMSelect.png");
        this.load.image("warriorF", PATH_GENREMENU + "WarriorFSelect.png");
        this.load.image("border", PATH_GENREMENU + "Border.png");
        this.load.image("shadow", PATH_GENREMENU + "Shadow.png");

        // Mouse
        this.input.setDefaultCursor('url(' + PATH_CURSORS + 'Cursor_Normal.png), pointer');
    }

    create() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        this.add.sprite(0,0,"background").setSize(width,height);

        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Choose Your Character',
            style: {
              font: '40px Alex Brush',
              fill: '#ffffff'
            }
          });
        loadingText.setOrigin(0.5, 0.5).setX(width / 2).setY(height / 2 - 200);

        this.warriorM = this.add.sprite(width / 2 - 140, height / 2, "warriorM").setScale(0.4).setFlipX(true).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
        this.borderM = this.add.sprite(width / 2 - 175, height / 2 + 177, "border").setScale(0.3).setFlipY(true).setVisible(false);
        this.shadowM = this.add.sprite(width / 2 - 90, height / 2, "shadow").setFlipX(true).setFlipY(true).setVisible(false);
        this.shadowM.alpha = 0.4;

        this.warriorF = this.add.sprite(width / 2 + 140, height / 2, "warriorF").setScale(0.4).setInteractive({ cursor: 'url(' + PATH_CURSORS + 'Cursor_Click.png), pointer' });
        this.borderF = this.add.sprite(width / 2 + 170, height / 2 + 177, "border").setScale(0.3).setFlipY(true).setVisible(false);
        this.shadowF = this.add.sprite(width / 2 + 85, height / 2, "shadow").setFlipY(true).setVisible(false);
        this.shadowF.alpha = 0.4;
    }

    update() {
        let jeu = this;

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