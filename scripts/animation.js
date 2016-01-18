define(function () {
    Animation = function () {
        this.frames = [];
        this.sprite = undefined;

        this.frame_delayms = 50;
        this.independent_frame_times = false;
        this.frame_times = [];
    };

    Animation.fromSpritesheet = function (texture,
                                          width, height,
                                          texwidth, texheight,
                                          rowMajor) {
        
    };

    Animation.fromSequence = function (textures, width, height) {
        this.frames = textures;

    };

    return Animation;
});
