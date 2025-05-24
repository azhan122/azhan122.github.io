class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 150;
        this.DRAG = 500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 4;

        this.counter = 0;
        this.frame = 'frame1';
    }

    create() {
        document.getElementById('description').innerHTML = '<h2>Move with arrow keys</h2>Refresh page if framerate is low'

        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer3b", 18, 18, 48, 16);




        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        this.tileset1 = this.map.addTilesetImage("tilemap-background", "tilemap_background");


        // Create a layer
        this.back = this.map.createLayer("background", this.tileset1, 0, 13).setScrollFactor(0.75);
        this.water = this.map.createLayer("water", this.tileset, 0, 13);
        this.groundLayer = this.map.createLayer("ground", this.tileset, 0, 13);
        this.watertop1 = this.map.createLayer("animate1", this.tileset, 0, 13);
        this.watertop2 = this.map.createLayer("animate2", this.tileset, 0, 13);
        this.watertop1.visible = true;
        this.watertop2.visible = false;
        this.door = this.map.createLayer("door", this.tileset, 0, 13);


        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        this.door.setCollisionByProperty({
            collides: true
        });

        // Create coins from Objects layer in tilemap
        this.coins = this.map.createFromObjects("Objects", {
            name: "key",
            key: "tilemap_sheet",
            frame: 151
        });

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);

        // Find water tiles
        this.waterTiles = this.groundLayer.filterTiles(tile => {
            return tile.properties.water == true;
        });

        ////////////////////
        // TODO: put water bubble particle effect here
        // It's OK to have it start running
        ////////////////////
        let bubblefx = this.add.particles(0, 0, 'kenny-particles', {
            frame: 'muzzle_02.png',
            scale: { start: 0.07, end: 0 },
            x: { min: 160, max: 200 },
            y: { start: 425, end: 410},
            alpha: {start: 0.1, end: 0.0}, 
            lifespan: 1000
        });

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 300, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);
        this.props = this.map.createLayer("props", this.tileset, 0, 13);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.door);
        this.physics.add.collider(my.sprite.player, this.stop);


        // Coin collision handler
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy();

            this.sound.play("blip", {
                volume: 1 
            });

            this.add.particles(0, 0, 'kenny-particles', {
                frame: 'star_06.png',
                x: obj2.x,
                y: obj2.y,
                duration: 20,
                scale: { start: 0.1, end: 0 }
            });
            this.door.y = -500;
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_02.png'],
            // TODO: Try: add random: true
            random: true,
            scale: {start: 0.01, end: 0.05},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 0.5, end: 0.1}, 
        });
        my.vfx.walking.stop();

        my.vfx.hop = this.add.particles(0, 0, 'kenny-particles', {
            frame: 'smoke_09.png',
            //scale: 0.07,
            x: my.sprite.player.x,
            y: my.sprite.player.y,
            duration: 5,
            scale: { start: 0.1, end: 0 },
            alpha: {start: 0.5, end: 0.0}
        });
        my.vfx.hop.stop();
        
        this.input.keyboard.on('keydown-UP', (event) => {
            if (my.sprite.player.body.blocked.down) {
                my.vfx.hop.start();
            }
        });

        // Simple camera to follow player
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
        
    }

    update() {
        this.counter++;
        if (this.counter % 30 == 0) {
            switch (this.frame) {
                case "frame1":
                    this.frame = "frame2";
                    this.watertop1.visible = true;
                    this.watertop2.visible = false;
                    break;
                case "frame2":
                    this.frame = "frame1";
                    this.watertop1.visible = false;
                    this.watertop2.visible = true;
                    break;
            }
        }

        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();

        }

        my.vfx.hop = this.add.particles(0, 0, 'kenny-particles', {
            frame: 'smoke_09.png',
            //scale: 0.07,
            x: my.sprite.player.x,
            y: my.sprite.player.y,
            duration: 5,
            scale: { start: 0.1, end: 0 },
            alpha: {start: 0.7, end: 0.0}
        });
        
        my.vfx.hop.stop();

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.sound.play("boing", {
                volume: 1 
            });
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }


        /*this.physics.add.overlap(my.sprite.player, this.stop, (obj1, obj2) => {
            this.scene.start("titleScreen");
        });*/

        if(my.sprite.player.y > game.config.height/2) {
            this.scene.start("titleScreen");
        }
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}