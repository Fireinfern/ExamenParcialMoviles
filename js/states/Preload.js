Preload = function(game) {};

Preload.prototype = {
    preload: function(){
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;

        this.game.load.image("background", "./assets/bg_layer4.png");
        this.game.load.image("yellow", "./assets/yellow/flyMan_fly.png");
        this.game.load.image("red", "./assets/red/spikeMan_jump.png");
        this.game.load.image("fly", "./assets/fly/shipBlue_manned.png");
        this.game.load.image("beige", "./assets/fly/shipBeige_manned.png");
        this.game.load.image("brown", "./assets/brown/duck_outline_brown.png");

        this.game.load.image("bulletbrown", "./assets/bullets/brown.png");
        this.game.load.image("bulletcream", "./assets/bullets/cream.png");
        this.game.load.image("bulletfly", "./assets/bullets/fly.png");
        this.game.load.image("bulletred", "./assets/bullets/red.png");
        this.game.load.image("bulletyellow", "./assets/bullets/yellow.png");

        this.game.load.image("heart", "./assets/Tiles/heart.png");
        this.game.load.image("cakeHalfMid", "./assets/Tiles/cakeHalfMid.png");
        this.game.load.image("cakeHalfRight", "./assets/Tiles/cakeHalfRight.png");
        this.game.load.image("cakeHalfLeft", "./assets/Tiles/cakeHalfMid.png");

        this.game.load.text('platformData', './js/data/tilemap.json');
        this.game.load.text('waves', './js/data/enemigos.json');

        this.game.load.spritesheet("dude", "./assets/dude.png", 32, 48, 9);
    },
    create: function() {
        this.game.state.start("Menu");
    }
};