define(["pixi.min", "app/pixiwindow", "app/animation", "app/controller"],
        function (PIXI, PIXIWindow, Animation, Controller) {
    KeyQuest = function (game) {
        this.name = "keyquest";
        this.game = game;
    };

    KeyQuest.prototype.load = function () {
        var stage = new PIXI.Container();

        var images = this.game.assets.images;

        var keyguy = Animation.fromSpritesheet
            ( images.keyguy, 24, 12, false, undefined, [1600, 1000] ); 

        console.log("Found "+keyguy.frames.length+" frames in spritesheet");

        keyguy.play(this.game);
        var sprite = keyguy.sprite;
        stage.addChild(sprite);
        stage.scale.x = 16; stage.scale.y = 16;

        var gamewindow = new PIXIWindow(null, null, stage);

        this.game.gamewindows[this.name] = [];
        this.game.gamewindows[this.name].push(gamewindow);

        this.game.activateGroup(this.name);

        var controller = new Controller();
        controller.attach(this.game);
        controller.noise = this.game.assets.audio.bap;
    };

    KeyQuest.prototype.unload = function () {
        this.game.deleteGroup(this.name);
    };

    return KeyQuest;
});
