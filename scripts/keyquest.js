define(["pixi.min", "app/pixiwindow"], function (PIXI, PIXIWindow) {
    KeyQuest = function (game) {
        this.name = "keyquest";
        this.game = game;
    };

    KeyQuest.prototype.load = function () {
        var stage = new PIXI.Container();
        var sprite = new PIXI.Sprite(this.game.assets.images.keyguy);
        sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        stage.addChild(sprite);
        stage.scale.x = 16; stage.scale.y = 16;

        var gamewindow = new PIXIWindow(undefined, undefined, stage);

        this.game.gamewindows[this.name] = [];
        this.game.gamewindows[this.name].push(gamewindow);

        this.game.activateGroup(this.name);
    };

    KeyQuest.prototype.unload = function () {
        this.game.deleteGroup(this.name);
    };

    return KeyQuest;
});
