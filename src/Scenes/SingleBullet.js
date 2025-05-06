class SingleBullet extends Phaser.Scene {
    constructor() {
        super("singleBullet");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}, text: {}};   
        
        
        // Create a flag to determine if the "bullet" is currently active and moving
        this.bulletActive = false;

        this.my.sprite.bullet = []; 
        this.maxBullets = 1;           // Don't create more than this many bullets
        this.myScore = 50;       // record a score as a class variable
        // More typically want to use a global variable for score, since
        // it will be used across multiple scenes
        this.counter = 0;

        this.bulletCooldown = 3;
        this.bulletCooldownCounter = 0;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("elephant", "elephant.png");
        this.load.image("heart", "heart.png");

        this.load.atlasXML("fishBits", "fishSpritesheet.png", "fishSpritesheet.xml");
        this.load.image("fishBack", "fishSpritesheet.png");
        this.load.tilemapTiledJSON("map", "FishingBack.json");

        this.load.image("bubble", "bubble.png");

        this.load.image("hippo", "fishTile_087.png");
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        this.load.audio("dadada", "glass_001.ogg");

        this.load.image("cannon1", "rank050.png");
        this.load.image("cannon2", "rank051.png");
        this.load.image("cannon3", "rank055.png");
        this.load.image("spear", "rank049.png");
        this.load.image("spear0", "rank065.png");
        this.load.image("spear1", "rank049.png");
        this.load.image("spear2", "rank065.png");
        this.load.image("tab", "banner_hanging.png");
    }

    create() {
        let my = this.my;

        this.map = this.add.tilemap("map", 16, 16, 10, 10);
        this.tileset = this.map.addTilesetImage("fish-tiles", "fishBack");
        this.water = this.map.createLayer("Water", this.tileset, 0, 0);
        this.sand = this.map.createLayer("Sand", this.tileset, 0, -420);
        my.sprite.rock = this.add.sprite(game.config.width/2, game.config.height - 100, "fishBits", "fishTile_085.png");
        my.sprite.rock0 = this.add.sprite(game.config.width/3, game.config.height/2 + 50, "fishBits", "fishTile_084.png");
        my.sprite.seaweed = this.add.sprite(game.config.width/2 + 250, game.config.height/2 + 100, "fishBits", "fishTile_032.png");
        my.sprite.seaweed0 = this.add.sprite(game.config.width - 200, game.config.height/2 + 200, "fishBits", "fishTile_034.png");
        my.sprite.seaweed1 = this.add.sprite(game.config.width/10, game.config.height/2 + 140, "fishBits", "fishTile_014.png");
        my.sprite.fossil = this.add.sprite(game.config.width/2 - 200, game.config.height/2 + 255, "fishBits", "fishTile_091.png");

        
        my.sprite.elephant = this.add.sprite(game.config.width/12, game.config.height/2, "elephant");
        my.sprite.c3 = this.add.sprite(game.config.width/12 + 32, game.config.height/2, "cannon3");
        my.sprite.c1 = this.add.sprite(game.config.width/12, game.config.height/2, "cannon1");
        my.sprite.c2 = this.add.sprite(game.config.width/12, game.config.height/2, "cannon2");
        
        my.sprite.spear = this.add.sprite(game.config.width/12, game.config.height/2, "spear");
        my.sprite.spear0 = this.add.sprite(game.config.width/12 + 70, game.config.height/2, "spear0");
        //my.sprite.spear.setScale(2, 0.5);
        //my.sprite.spear0.setScale(1, 0.5);
        my.sprite.elephant.setScale(0.5);

        my.sprite.s1 = this.add.sprite(-10, -10, "spear1");
        my.sprite.s2 = this.add.sprite(-10, -10, "spear2");
        my.sprite.s1.visible = false;
        my.sprite.s2.visible = false;

        my.sprite.s1.setScale(2, 0.5);
        my.sprite.s2.setScale(1, 0.5);

        // Create the "bullet" offscreen and make it invisible to start
        my.sprite.heart = this.add.sprite(-10, -10, "heart");
        my.sprite.heart.visible = false;

        // Create key objects
        this.up = this.input.keyboard.addKey("A");
        this.down = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.space = this.input.keyboard.addKey("S");

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 10;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Fishing Simulator</h2>Press Space to begin'


        my.sprite.hippo = this.add.sprite(game.config.width + 100, game.config.height/3, "fishBits", "fishTile_079.png");
        my.sprite.lion = this.add.sprite(game.config.width, game.config.height/2, "fishBits", "fishTile_075.png");

        my.sprite.lion0 = this.add.sprite(game.config.width + 125, game.config.height/3 - 100, "fishBits", "fishTile_075.png");
        my.sprite.giraffe = this.add.sprite(game.config.width * 2, game.config.height/2, "fishBits", "fishTile_101.png");


        my.sprite.hippo.flipX = true;
        my.sprite.lion.flipX = true;
        my.sprite.lion0.flipX = true;
        my.sprite.giraffe.flipX = true;

        my.sprite.hippo.scorePoints = 25;
        my.sprite.lion.scorePoints = 10;
        my.sprite.giraffe.scorePoints = 50;
 
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 1,
            hideOnComplete: true
        });
        my.sprite.tab = this.add.sprite(130, 33, "tab");
        my.sprite.tab.setScale(0.5);
        document.getElementById('description').innerHTML = '<h2>Fishing Simulator</h2>A: Up <br> D: Down <br> S: Fire <br><br> Press Space to stop game'
        my.text.score = this.add.bitmapText(20, 15, "rocketSquare", "$" + this.myScore);

        my.sprite.bulletGroup = this.add.group({
            defaultKey: "bubble",
            maxSize:10
            }
        )
        my.sprite.bulletGroup.createMultiple({
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        });
        
        /*this.fish = {
            pink: {
                speed: 3,
                points: 10,
                spawnX: game.config.width,
                sprite: pinkfish
            },
            pink0: {
                speed: 3,
                points: 10,
                spawnX: game.config.width,
                sprite: pinkfish
            },
            pink1: {
                speed: 3,
                points: 10,
                spawnX: game.config.width,
                sprite: pinkfish
            }
        }*/
    }

    update() {
        let my = this.my;
        my.sprite.elephant.visible = false;
        this.counter++;
        this.bulletCooldownCounter--;

        if (this.up.isDown) {
            if (my.sprite.elephant.y > (my.sprite.elephant.displayHeight/2)) {
                my.sprite.elephant.y -= this.playerSpeed;
                my.sprite.c3.y -= this.playerSpeed;
                my.sprite.c1.y -= this.playerSpeed;
                my.sprite.c2.y -= this.playerSpeed;
                my.sprite.spear.y -= this.playerSpeed;
                my.sprite.spear0.y -= this.playerSpeed;
            }
        }

        if (this.down.isDown) {
            if (my.sprite.elephant.y < (game.config.height - (my.sprite.elephant.displayHeight/2) + 25)) {
                my.sprite.elephant.y += this.playerSpeed;
                my.sprite.c3.y += this.playerSpeed;
                my.sprite.c1.y += this.playerSpeed;
                my.sprite.c2.y += this.playerSpeed;
                my.sprite.spear.y += this.playerSpeed;
                my.sprite.spear0.y += this.playerSpeed;
            }
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(my.sprite.elephant.x + 70, my.sprite.elephant.y, "spear2"));
                my.sprite.bullet.push(this.add.sprite(my.sprite.elephant.x, my.sprite.elephant.y, "spear1"));
                my.sprite.spear.visible = false;
                my.sprite.spear0.visible = false;
            }
        }
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.x < game.config.width + 60);

        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.hippo, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.hippo.x, my.sprite.hippo.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.hippo.visible = false;
                my.sprite.hippo.x = -100;
                my.sprite.hippo.y = 400;

                // Update score
                this.myScore += my.sprite.hippo.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("dadada", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                // Have new hippo appear after end of animation
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.hippo.visible = true;
                    //this.my.sprite.hippo.x = Math.random()*config.width;
                    this.my.sprite.hippo.y = Math.random()*config.height;
                }, this);
            }
            if (this.collides(my.sprite.lion, bullet)) {
                this.puff = this.add.sprite(my.sprite.lion.x, my.sprite.lion.y, "whitePuff03").setScale(0.25).play("puff");
                bullet.y = -100;
                my.sprite.lion.visible = false;
                my.sprite.lion.x = -100;
                my.sprite.lion.y = 400;
                this.myScore += my.sprite.lion.scorePoints;
                this.updateScore();
                this.sound.play("dadada", {
                    volume: 1
                });
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.lion.visible = true;
                    this.my.sprite.lion.y = Math.random()*config.height;
                }, this);
            }
            if (this.collides(my.sprite.lion0, bullet)) {
                this.puff = this.add.sprite(my.sprite.lion0.x, my.sprite.lion0.y, "whitePuff03").setScale(0.25).play("puff");
                bullet.y = -100;
                my.sprite.lion0.visible = false;
                my.sprite.lion0.x = -100;
                my.sprite.lion0.y = 400;
                this.myScore += my.sprite.lion.scorePoints;
                this.updateScore();
                this.sound.play("dadada", {
                    volume: 1
                });
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.lion0.visible = true;
                    this.my.sprite.lion0.y = Math.random()*config.height;
                }, this);
            }
            if (this.collides(my.sprite.giraffe, bullet)) {
                this.puff = this.add.sprite(my.sprite.giraffe.x, my.sprite.giraffe.y, "whitePuff03").setScale(0.25).play("puff");
                bullet.y = -100;
                my.sprite.giraffe.visible = false;
                my.sprite.giraffe.x = -100;
                my.sprite.giraffe.y = 400;
                this.myScore += my.sprite.giraffe.scorePoints;
                this.updateScore();
                this.sound.play("dadada", {
                    volume: 1
                });
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.giraffe.visible = true;
                    this.my.sprite.giraffe.y = Math.random()*config.height;
                }, this);
            }
            /*for (fish in this.fish) {
                fish.sprite.x -= speed;
                if (this.collides(fish, bullet)) {
                    this.puff = this.add.sprite(fish.sprite.x, fish.sprite.y, "whitePuff03").setScale(0.25).play("puff");
                    bullet.y = -100;
                    sprite.visible = false;
                    sprite.x = -100;
                    sprite.y = 400;
                    this.myScore += points;
                    this.updateScore();
                    this.sound.play("dadada", {
                        volume: 1
                    });
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        this.fish.sprite.visible = true;
                        this.fish.sprite.y = Math.random()*config.height;
                    }, this);
                }
                if (this.fish.sprite.x < -game.config.width) {
                    this.fish.sprite.x = game.config.width;
                    this.fish.sprite.x = Math.random()*config.height;
                }
            }*/
            my.sprite.spear.visible = true;
            my.sprite.spear0.visible = true;
        }
        my.sprite.hippo.x -= 5;
        my.sprite.lion.x -= 3;

        my.sprite.giraffe.x -= 2;

        if (my.sprite.hippo.x < -game.config.width) {
            my.sprite.hippo.x = game.config.width * 2;
            my.sprite.hippo.y = Math.random()*config.height;
            return;
        }
        if (my.sprite.lion.x < -game.config.width) {
            my.sprite.lion.x = game.config.width;
            my.sprite.lion.y = Math.random()*config.height;
            return;
        }
        if (my.sprite.lion0.x < -game.config.width) {
            my.sprite.lion0.x = game.config.width;
            my.sprite.lion0.y = Math.random()*config.height;
            return;
        }
        if (my.sprite.giraffe.x < -game.config.width) {
            my.sprite.giraffe.x = game.config.width * 2;
            my.sprite.giraffe.y = Math.random()*config.height;
            return;
        }



        if (this.bulletCooldownCounter < 0) {
            // Get the first inactive bullet, and make it active
            let lionfish = my.sprite.bulletGroup.getFirstDead();
            // bullet will be null if there are no inactive (available) bullets
            if (lionfish != null) {
                lionfish.active = true;
                lionfish.visible = true;
                lionfish.x = game.config.width + Math.random()*config.width;
                lionfish.y = Math.random()*config.height;
                this.bulletCooldownCounter = this.bulletCooldown;
            }
        }
        for (let lionfish of my.sprite.bulletGroup.getChildren()) {
            if (lionfish.x < -game.config.width) {
                lionfish.active = false;
                lionfish.visible = false;
            }
        }
        my.sprite.bulletGroup.incX(-3);



        for (let bullet of my.sprite.bullet) {
            bullet.x += this.bulletSpeed;
        }
        /*if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Only start the bullet if it's not currently active
            if (!this.bulletActive) {
                // Set the active flag to true
                this.bulletActive = true;
                // Set the position of the bullet to be the location of the player
                // Offset by the height of the sprite, so the "bullet" comes out of
                // the top of the player avatar, not the middle.
                my.sprite.heart.x = my.sprite.elephant.x + 30;
                my.sprite.heart.y = my.sprite.elephant.y;
                my.sprite.heart.visible = false;

                my.sprite.s1.x = my.sprite.elephant.x;
                my.sprite.s1.y = my.sprite.elephant.y;

                my.sprite.s2.x = my.sprite.elephant.x + 70;
                my.sprite.s2.y = my.sprite.elephant.y;
                my.sprite.s1.visible = true;
                my.sprite.s2.visible = true;

                my.sprite.spear.visible = false;
                my.sprite.spear0.visible = false;
            }
        }

        // Now handle bullet movement, only if it is active
        if (this.bulletActive) {
            my.sprite.heart.x += this.bulletSpeed;

            my.sprite.s1.x += this.bulletSpeed;
            my.sprite.s2.x += this.bulletSpeed;
            // Is the bullet off the top of the screen?
            if (my.sprite.s1.x > game.config.width + 100) {
                // make it inactive and invisible
                this.bulletActive = false;
                my.sprite.heart.visible = false;

                my.sprite.s1.visible = false;
                my.sprite.s2.visible = false;

                my.sprite.spear.visible = true;
                my.sprite.spear0.visible = true;
            }
        }*/
        if (this.counter % 60 == 0) {
            this.myScore -= 5;
            this.updateScore();
        }
        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("arrayBoom");
            this.myScore = 50;
        }
        if (this.myScore <= 0) {
            this.scene.start("arrayBoom");
            this.myScore = 50;
        }
    }
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("$" + this.myScore);
    }
}