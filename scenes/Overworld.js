class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene');
    }

    create() {
        const gui = new dat.GUI();

        // variables and settings
        this.AVATAR_SCALE = 0.25;
        this.VELOCITY = 150;
        this.ROOMWIDTH = 512;
        this.ROOMHEIGHT = 336;

        // Set background color
        this.cameras.main.setBackgroundColor('#666');

        // Set main camera to be 3 rooms wide, 2 rooms tall
        this.cameras.main.setBounds(0, 0, this.ROOMWIDTH*3, this.ROOMHEIGHT*2);

        // Everything is 1:1 scale
        this.cameras.main.setZoom(1.0);
    
        // setScroll moves the viewport to the starting room (1 down, 1 over)
        this.cameras.main.setScroll(this.ROOMWIDTH, this.ROOMHEIGHT);

        gui.addFolder("Main Camera");
        gui.add(this.cameras.main, 'scrollX');
        gui.add(this.cameras.main, 'scrollY');
        gui.add(this.cameras.main, 'zoom');


        // Add overworld background images
        this.add.image(0, this.ROOMHEIGHT, 'LoZ-overworld-left').setOrigin(0);
        this.add.image(this.ROOMWIDTH, this.ROOMHEIGHT, 'LoZ-overworld').setOrigin(0);
        this.add.image(this.ROOMWIDTH*2, this.ROOMHEIGHT, 'LoZ-overworld-right').setOrigin(0);
        this.add.image(0, 0, 'LoZ-overworld-upleft').setOrigin(0);
        this.add.image(this.ROOMWIDTH, 0, 'LoZ-overworld-up').setOrigin(0);
        this.add.image(this.ROOMWIDTH*2, 0, 'LoZ-overworld-upright').setOrigin(0);

        // Set up animations
        this.createAnimations();

        // set world boundaries
        this.physics.world.setBounds(this.ROOMWIDTH, this.ROOMHEIGHT, this.ROOMWIDTH, this.ROOMHEIGHT);

        // make player avatar 🧍
        this.player = this.physics.add.sprite(this.ROOMWIDTH*1.5, this.ROOMHEIGHT*1.5, 'link_atlas', 'idle_down_0001').setScale(this.AVATAR_SCALE);
        this.player.body.allowGravity = false;
        this.player.body.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true;

        this.physics.world.on('worldbounds', (body, blockedUp, blockedDown, blockedLeft, blockedRight) => {
            if (blockedUp) {
                this.cameras.main.shake(250);
                this.cameras.main.flash(250);
                this.cameras.main.pan(
                    this.ROOMWIDTH*1.5,
                    this.ROOMHEIGHT*0.5,
                    3000,
                    'Sine.easeOut'
                );
                this.physics.world.setBounds(this.ROOMWIDTH, 0, this.ROOMWIDTH, this.ROOMHEIGHT);
                this.player.body.reset(this.player.body.x+this.player.body.halfWidth, this.player.body.y - 1);
            }
            if (blockedLeft) {
                this.cameras.main.shake(250);
                this.cameras.main.flash(250);
                this.cameras.main.pan(
                    this.ROOMWIDTH*0.5,
                    this.ROOMHEIGHT*1.5,
                    3000,
                    'Sine.easeOut'
                );
                this.physics.world.setBounds(this.ROOMWIDTH, 0, this.ROOMWIDTH, this.ROOMHEIGHT);
                this.player.body.reset(this.player.body.x + 1, this.player.body.y + 1);
            }
            if (blockedRight) {
                this.cameras.main.shake(250);
                this.cameras.main.flash(250);
                this.cameras.main.pan(
                    this.ROOMWIDTH*2.5,
                    this.ROOMHEIGHT*1.5,
                    3000,
                    'Sine.easeOut'
                );
                this.physics.world.setBounds(this.ROOMWIDTH, 0, this.ROOMWIDTH, this.ROOMHEIGHT);
                this.player.body.reset(this.player.body.x+this.player.body.halfWidth, this.player.body.y - 1);
            }
        });

        // Use Phaser-provided cursor key creation function
        cursors = this.input.keyboard.createCursorKeys();

    }

    update() {

        // check keyboard input
        if(cursors.left.isDown) {
            this.player.body.setVelocity(-this.VELOCITY, 0);

            this.player.anims.play('run_left', true);

        } else if(cursors.right.isDown) {
            this.player.body.setVelocity(this.VELOCITY, 0);
            this.player.anims.play('run_right', true);

        } else if(cursors.up.isDown) {
            this.player.body.setVelocity(0, -this.VELOCITY);
            this.player.anims.play('run_up', true);

        } else if(cursors.down.isDown) {
            this.player.body.setVelocity(0, this.VELOCITY);
            this.player.anims.play('run_down', true);

        } else if (!cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown) {
            this.player.body.setVelocity(0, 0);

            if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'run_left') {
                this.player.anims.play('idle_left');
            }
            if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'run_right') {
               this.player.anims.play('idle_right');
            }
            if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'run_up') {
                this.player.anims.play('idle_up');
            }
            if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'run_down') {
                this.player.anims.play('idle_down');
            }

            
        }

        // wrap physics object(s) .wrap(gameObject, padding)
        this.physics.world.wrap(this.player, 0);
    }

    // Function to create all of the animations used in this scene
    createAnimations() {
        this.anims.create({
            key: 'idle_left',
            frames: this.anims.generateFrameNames('link_atlas', {
                prefix: 'idle_left_',
                start: 1,
                end: 3,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
            repeatDelay: 5000,
            yoyo: true
        });

        // Idle right
        this.anims.create({
            key: 'idle_right',
            frames: this.anims.generateFrameNames('link_atlas', {
                prefix: 'idle_right_',
                start: 1,
                end: 3,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
            repeatDelay: 5000,
            yoyo: true
        });

        // Idle down
        this.anims.create({
            key: 'idle_down',
            frames: this.anims.generateFrameNames('link_atlas', {
                prefix: 'idle_down_',
                start: 1,
                end: 3,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1,
            repeatDelay: 5000,
            yoyo: true
        });

        // Idle up
        this.anims.create({
            key: 'idle_up',
            defaultTextureKey: 'link_atlas',
            frames: [
                { frame: 'idle_up' }
            ],
            repeat: -1
        });


        // Run left
        this.anims.create({
            key: 'run_left',
            frames: this.anims.generateFrameNames('link_atlas', {
                prefix: 'run_left_',
                start: 1,
                end: 10,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 30,
            repeat: -1
        });

        // Run right
        this.anims.create({
            key: 'run_right',
            frames: this.anims.generateFrameNames('link_atlas', {
                prefix: 'run_right_',
                start: 1,
                end: 10,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 30,
            repeat: -1
        });

        // Run up
        this.anims.create({
            key: 'run_up',
            frames: this.anims.generateFrameNames('link_atlas', {
                prefix: 'run_up_',
                start: 1,
                end: 10,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 30,
            repeat: -1
        });

        // Run down
        this.anims.create({
            key: 'run_down',
            frames: this.anims.generateFrameNames('link_atlas', {
                prefix: 'run_down_',
                start: 1,
                end: 10,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 30,
            repeat: -1
        });
    }


}