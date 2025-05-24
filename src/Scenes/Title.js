class ArrayBoom extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    preload() {
    }

    create() {
        let my = this.my;
        
        this.nextScene = this.input.keyboard.addKey("R");


        this.map = this.add.tilemap("platformer3b", 18, 18, 48, 16);
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        this.tileset1 = this.map.addTilesetImage("tilemap-background", "tilemap_background");
        this.back = this.map.createLayer("background", this.tileset1, 0, 0).setScale(2);
        this.water = this.map.createLayer("water", this.tileset, 0, 0).setScale(2);
        this.groundLayer = this.map.createLayer("ground", this.tileset, 0, 0).setScale(2);
        this.watertop1 = this.map.createLayer("animate1", this.tileset, 0, 0).setScale(2);
        this.props = this.map.createLayer("props", this.tileset, 0, 0).setScale(2);

        // Put title on screen
        this.add.text(game.config.width/4, game.config.height/3, "Game End", {
            fontFamily: 'Brush Script MT, cursive',
            fontSize: 70,
            wordWrap: {
                width: 500
            }
        });
        this.add.text(game.config.width/4, game.config.height/2, "Press R to restart", {
            fontFamily: 'Brush Script MT, cursive',
            fontSize: 35,
            wordWrap: {
                width: 500
            }
        });

    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("platformerScene")
        }
    }
}