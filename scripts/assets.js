define(["jquery", "pixi.min"], function ($, PIXI) {
    Assets = function(callback) {
        $.ajax("assets.php").done((function (assetstring) {
            var assetarray = eval(assetstring);
            for (var i = 0; i < assetarray.length; ++i) {
                this.addAsset(this.getIDFromRelativeURL(assetarray[i]), assetarray[i]);
            }
        }).bind(this), callback);
    };

    Assets.prototype.addAsset = function (id, url) {
        var idarray = id.split(".");
        var asset = undefined;

        switch (idarray[0]) {
            case "images":
                asset = new PIXI.Texture.fromImage(url);
                break;
            default:
                break;
        }

        var node = asset;

        var parent = this;

        for (var p = 0; p < idarray.length && parent.hasOwnProperty(idarray[p]); ++p) {
            parent = parent[idarray[p]];
        }

        for (var i = idarray.length-1; i > p; --i) {
            var parentnode = {};
            parentnode[idarray[i]] = node;
            node = parentnode;
        }

        parent[idarray[p]] = node;
    };

    Assets.prototype.getIDFromRelativeURL = function (url) {
        var id = url.substr(7);
        var patharray = id.split("/");
        patharray[patharray.length-1] = patharray[patharray.length-1].split(".", 1);
        id = patharray.join(".");
        return id;
    };

    return Assets;
});
