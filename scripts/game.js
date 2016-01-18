// Responsibilities:
//  - Update logic groups
//  - Render game windows

define(['app/messagebus','app/movements'], function (MessageBus, Movements) {
    Game = function () {
        this.data = {};
        this.physicsworlds = {};
        this.physicsbinders = {};
        this.logicgroups = {};
        this.gamewindows = {};
        this.messagebus = new MessageBus();
        this.localmessagebusses = {};
        
        // Keys of active groups
        this.groupnames = [];

        this.configs = {};

        this.movements = new Movements(this);

        this.updateTimestep = 20;

        this.velIterations = 10;
        this.posIterations = 3;

        this.lastUpdateTime = new Date().getTime();

        window.onresize = this.onResize.bind(this);

        window.onkeydown = this.onKeyDown.bind(this);
        window.onkeyup = this.onKeyUp.bind(this);

        // ALL ABOARD
        this.render();
        this.update();
    };

    Game.prototype.render = function () {
        for (var i = 0; i < this.groupnames.length; ++i) {
            var gws = this.gamewindows[this.groupnames[i]];
            if (gws != undefined) {
                for (var gw = 0; gw < gws.length; ++gw) {
                    gws[gw].render();
                }
            }
        }
        
        requestAnimationFrame(this.render.bind(this));
    };

    Game.prototype.update = function () {
        var newtime = new Date().getTime();
        var delta = newtime - this.lastUpdateTime;
        this.lastUpdateTime = newtime;

        for (var i = 0; i < this.groupnames.length; ++i) {
            var physicsworld = this.physicsworlds[this.groupnames[i]];
            if (physicsworld !== undefined) {
                physicsworld.Step(delta/1000, this.velIterations, this.posIterations);
            }
        }

        for (var i = 0; i < this.groupnames.length; ++i) {
            var physicsbinder = this.physicsbinders[this.groupnames[i]];
            if (physicsbinder !== undefined) {
                physicsbinder.syncActors();
            }
        }

        for (var i = 0; i < this.groupnames.length; ++i) {
            var logicgroup = this.logicgroups[this.groupnames[i]];
            if (logicgroup !== undefined) {
                for (var l = 0; l < logicgroup.length; ++l) {
                    if (logicgroup[l].finished) {
                        logicgroup.splice(l,1);
                        l -= 1;
                        continue;
                    }
                    logicgroup[l].update(delta, newtime);
                }
            }
        }

        setTimeout(this.update.bind(this), this.updateTimestep);
    };

    Game.prototype.load = function (config) {
        this.configs[config.name] = config;
        config.load();
    };

    Game.prototype.unload = function (name) {
        this.configs[name].unload();
        delete this.configs[name];
    };

    Game.prototype.activateGroup = function (name) {
        this.groupnames.push(name);
    };

    Game.prototype.deleteGroup = function (key) {
        var i = this.groupnames.indexOf(key);
        if (i != -1) this.groupnames.splice(i,1);

        delete this.physicsworlds[key];
        delete this.physicsbinders[key];
        delete this.logicgroups[key];
        delete this.gamewindows[key];
        delete this.localmessagebusses[key];
    };

    Game.prototype.onResize = function () {
        for (var i = 0; i < this.groupnames.length; ++i) {
            var gw = this.gamewindows[this.groupnames[i]];
            if (gw != undefined) gw.resize(window.innerWidth, window.innerHeight);
        }
    };

    Game.prototype.onKeyDown = function (keyevent) {
        this.messagebus.sendMessage("keydown", keyevent);
    };

    Game.prototype.onKeyUp = function (keyevent) {
        this.messagebus.sendMessage("keyup", keyevent);
    };

    return Game;
});
