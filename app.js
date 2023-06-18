// Create a new Phaser game
var config = {
    type: Phaser.AUTO,
    width: 1900,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const PlayerState = {
    Idle: 'idle',
    Run: 'run',
    Jump: 'jump'
}

var game = new Phaser.Game(config);

function preload() {
    // Load assets, such as images and audio, here
    this.load.image('background', './assets/tileset/png/BG/BG.png');
    this.load.spritesheet('idle', './assets/player/png/idle.png', { frameWidth: 669, frameHeight: 569 });
    this.load.spritesheet('run', './assets/player/png/run.png', { frameWidth: 669, frameHeight: 569 });
    this.load.spritesheet('jump', './assets/player/png/jump.png', { frameWidth: 669, frameHeight: 569 });
    this.load.image('platform', './assets/tileset/png/Object/Crate.png');
}

function create() {
    // Set up game objects, physics, and initial state here
    // Add a background image
    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0, 0);

    this.background.setScale(this.game.config.width / this.background.width, this.game.config.height / this.background.height);

    // Add a player sprite
    this.player = this.physics.add.sprite(100, 550, PlayerState.Jump);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.25);


    // Define the animation using the 'player' key
    this.anims.create({
        key: PlayerState.Idle,
        frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 9 }), // Adjust the frame range as needed
        frameRate: 15,
        repeat: -1 // Repeat indefinitely
    });

    this.anims.create({
        key: PlayerState.Run,
        frames: this.anims.generateFrameNumbers('run', { start: 0, end : 7 }),
        frameRate: 25,
        repeat: -1
    })

    this.anims.create({
        key: PlayerState.Jump,
        frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 11 }),
        frameRate: 25,
        repeat: 0
    })
    this.player.setSize(300, 500);
    this.player.setOffset(250, 25);

    // Play the animation
    this.playerState = PlayerState.Jump;

    // Add a ground platform
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(200, 763, 'platform').setScale(3).refreshBody();

    // Enable collision between the player and platforms
    this.physics.add.collider(this.player, this.platforms);
}

function movePlayer(velocityX, flipX, size, offset) {
    this.player.setVelocityX(velocityX);
    this.player.flipX = flipX;
    this.player.setSize(size.width, size.height);
    this.player.setOffset(offset.x, offset.y);
}

function playplayerAnimation(animKey, repeat) {
    this.player.anims.play(animKey, repeat);
}



function update() {
    // Implement game logic and update game objects here
    // Player movement
    var cursors = this.input.keyboard.createCursorKeys();

    var touching = this.player.body.touching.down;

    if ((cursors.up.isDown && touching)) {
        this.player.setVelocityY(-300);
        playplayerAnimation.call(this, PlayerState.Jump, true);
    }   
    if (cursors.left.isDown && !touching) {
        movePlayer.call(this, -250, true, { width: 300, height: 500 }, { x: 125, y: 25 });
    } else if (cursors.right.isDown) {
        movePlayer.call(this, 250, false, { width: 300, height: 500 }, { x: 250, y: 25 });
    }
    if (touching) {
        if (cursors.left.isDown) {
            movePlayer.call(this, -250, true, { width: 300, height: 500 }, { x: 125, y: 25 });
            playplayerAnimation.call(this, PlayerState.Run, true);
        } else if (cursors.right.isDown) {
            movePlayer.call(this, 250, false, { width: 300, height: 500 }, { x: 250, y: 25 });
            playplayerAnimation.call(this, PlayerState.Run, true);
        } else {
            this.player.setVelocityX(0);
            playplayerAnimation.call(this, PlayerState.Idle, true);
        }
    } else {
        if (this.playerState !== PlayerState.Jump) {
            playplayerAnimation.call(this, PlayerState.Jump, true);
        }
    }

    // Update playerState variable
    if (this.player.anims.currentAnim) {
        this.playerState = this.player.anims.currentAnim.key;
    }
}