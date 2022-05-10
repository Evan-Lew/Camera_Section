class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set load path
        this.load.path = 'assets/';
        // Load all assets here.
        // Since the asset keys can be used in any scene, can load here
        // and use in any other scene

        // Load atlas here
        this.load.atlas('link_atlas', 'linksheet.png', 'linkmap.json');
        this.load.image('LoZ-overworld', 'LoZ-overworld-1.gif');
        this.load.image('LoZ-overworld-left', 'LoZ-overworld-left.gif');
        this.load.image('LoZ-overworld-right', 'LoZ-overworld-right.gif');
        this.load.image('LoZ-overworld-up', 'LoZ-overworld-up.gif');
        this.load.image('LoZ-overworld-upleft', 'LoZ-overworld-upleft.gif');
        this.load.image('LoZ-overworld-upright', 'LoZ-overworld-upright.gif');
    }

    create() {
        // ...and pass to the next Scene
        this.scene.start('overworldScene');
    }
}