var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="3rdparty/easeljs-0.5.d.ts" />
/// <reference path="Photon/Photon-Javascript_SDK.d.ts"/>
// For Photon Cloud Application access create cloud-app-info.js file in the root directory (next to default.html) and place next lines in it:
//var AppInfo = {
//    MasterAddress: "master server address:port",
//    AppId: "your app id",
//    AppVersion: "your app version",
//}
// fetching app info global variable while in global context
var ParticleDemoMasterAddress = this["AppInfo"] && this["AppInfo"]["MasterAddress"] ? this["AppInfo"]["MasterAddress"] : "24.149.29.78:9090";
var ParticleDemoAppId = this["AppInfo"] && this["AppInfo"]["AppId"] ? this["AppInfo"]["AppId"] : "<no-app-id>";
var ParticleDemoAppVersion = this["AppInfo"] && this["AppInfo"]["AppVersion"] ? this["AppInfo"]["AppVersion"] : "1.0";
var ParticleDemoFbAppId = this["AppInfo"] && this["AppInfo"]["FbAppId"];
var DemoConstants = {
    EvColor: /// <summary>(1) Event defining a color of a player.</summary>
    1,
    EvPosition: /// <summary>(2) Event defining the position of a player.</summary>
    2,
    GridSizeProp: /// <summary>("s") Property grid size currently used in this room.</summary>
    "s",
    MapProp: /// <summary>("m") Property map (map / level / scene) currently used in this room.</summary>
    "m",
    MapType: /// <summary>Types available as map / level / scene.</summary>
    {
        Forest: "Forest",
        Town: "Town",
        Sea: "Sea"
    },
    GroupsPerAxis: 2,
    GridSizeDefault: 16,
    GridSizeMin: 4,
    GridSizeMax: 256,
    TickInterval: 500,
    LogLevel: Exitgames.Common.Logger.Level.DEBUG
};
var ParticleDemo = (function (_super) {
    __extends(ParticleDemo, _super);
    function ParticleDemo(canvas) {
        _super.call(this, ParticleDemoMasterAddress, ParticleDemoAppId, ParticleDemoAppVersion);
        this.canvas = canvas;
        this.useGroups = false;
        this.automove = false;
        // connect to random room or create new one automatocally
        // close button click sets this to false
        this.autoconnect = true;
        this.logger = new Exitgames.Common.Logger("Demo: ", DemoConstants.LogLevel);
        this.cellWidth = 1;
        this.cellHeight = 1;
        this.bgColor = 'rgba(240,240,240,255)';
        this.gridColor = 'rgba(180,180,180,255)';
        this.checkerColor = 'rgba(210,210,210,255)';
        this.checker = new createjs.Container();
        // uncomment to use Custom Authentication
        // this.setCustomAuthentication("username=" + "yes" + "&token=" + "yes");
        Output.log("Init", ParticleDemoMasterAddress, ParticleDemoAppId, ParticleDemoAppVersion);
        this.logger.info("Init", ParticleDemoMasterAddress, ParticleDemoAppId, ParticleDemoAppVersion);
        this.setLogLevel(DemoConstants.LogLevel);
        this.myActor().setName("ts" + Math.floor(Math.random() * 100));
    }
    ParticleDemo.prototype.roomFactory = // overrides
    function (name) {
        return new ParticleRoom(name);
    };
    ParticleDemo.prototype.actorFactory = function (name, actorNr, isLocal) {
        return new ParticlePlayer(this, name, actorNr, isLocal);
    };
    ParticleDemo.prototype.myRoom = function () {
        return _super.prototype.myRoom.call(this);
    };
    ParticleDemo.prototype.myActor = function () {
        return _super.prototype.myActor.call(this);
    };
    ParticleDemo.prototype.myRoomActors = function () {
        return _super.prototype.myRoomActors.call(this);
    };
    ParticleDemo.prototype.start = function () {
        var _this = this;
        this.setupUI();
        this.updateCellSize();
        // connect if no fb auth required
        if(!ParticleDemoFbAppId) {
            this.connect(true);
        }
        this.setupScene();
        this.timerToken = setInterval(function () {
            //            if (this.isJoinedToRoom()) {
            _this.tick();
            //            }
                    }, DemoConstants.TickInterval);
    };
    ParticleDemo.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    ParticleDemo.prototype.tick = function () {
        for(var a in this.myRoomActors()) {
            // comment to freeze all
            this.myRoomActors()[a].tick();
        }
        this.stage.update();
    };
    ParticleDemo.prototype.onError = // overrides
    function (errorCode, errorMsg) {
        Output.log("Error", errorCode, errorMsg);
        // optional super call
        _super.prototype.onError.call(this, errorCode, errorMsg);
    };
    ParticleDemo.prototype.onOperationResponse = function (errorCode, errorMsg, code, content) {
        if(errorCode) {
            switch(code) {
                case Photon.LoadBalancing.Constants.OperationCode.JoinRandomGame:
                    switch(errorCode) {
                        case Photon.LoadBalancing.Constants.ErrorCode.NoRandomMatchFound:
                            Output.log("Join Random:", errorMsg);
                            this.createParticleDemoRoom();
                            break;
                        default:
                            Output.log("Join Random:", errorMsg);
                            break;
                    }
                    break;
                default:
                    Output.log("Operation Response error:", errorCode, errorMsg, code, content);
                    break;
            }
        }
    };
    ParticleDemo.prototype.onEvent = function (code, content, actorNr) {
        switch(code) {
            case DemoConstants.EvColor:
                var color = content[1];
                var p = (this.myRoomActors()[actorNr]);
                p.setColor(color);
                break;
            case DemoConstants.EvPosition:
                var p = (this.myRoomActors()[actorNr]);
                p.move(content[1][0], content[1][1]);
                Output.logger.debug("Actor", actorNr, "Pos:", content[1][0], content[1][1]);
                break;
            default:
        }
        this.logger.debug("Demo: onEvent", code, "content:", content, "actor:", actorNr);
    };
    ParticleDemo.prototype.onStateChange = function (state) {
        // "namespace" import for static members shorter acceess
        var LBC = Photon.LoadBalancing.LoadBalancingClient;
        var stateText = document.getElementById("statetxt");
        stateText.textContent = LBC.StateToName(state);
        switch(state) {
            case LBC.State.JoinedLobby:
                if(this.autoconnect) {
                    Output.log("joining random room...");
                    this.joinRandomRoom();
                }
                break;
            default:
                break;
        }
        this.updateRoomButtons();
    };
    ParticleDemo.prototype.onRoomListUpdate = function (rooms, roomsUpdated, roomsAdded, roomsRemoved) {
        Output.log("onRoomListUpdate", rooms, roomsUpdated, roomsAdded, roomsRemoved);
        this.updateRoomListMenu(rooms);
        this.updateRoomButtons()// join btn state can be changed
        ;
    };
    ParticleDemo.prototype.onRoomList = function (rooms) {
        this.updateRoomListMenu(rooms);
        this.updateRoomButtons();
    };
    ParticleDemo.prototype.onMyRoomPropertiesChange = function () {
        this.setupScene();
    };
    ParticleDemo.prototype.onJoinRoom = function () {
        this.logger.info("onJoinRoom myRoom", this.myRoom());
        this.logger.info("onJoinRoom myActor", this.myActor());
        this.logger.info("onJoinRoom myRoomActors", this.myRoomActors());
        this.updatePlayerList();
        this.setupScene();
        this.myActor().raiseColorEvent();
        this.updateGroups();
    };
    ParticleDemo.prototype.onActorJoin = function (actor) {
        Output.log("actor " + actor.actorNr + " joined");
        this.updatePlayerList();
        var p = actor;
        p.setVisual(new ParticlePlayerVisual(this.stage, p, this.cellWidth, this.cellHeight));
    };
    ParticleDemo.prototype.onActorLeave = function (actor) {
        var p = actor;
        if(!p.isLocal) {
            p.clearVisual();
        }
        Output.log("actor " + actor.actorNr + " left");
        this.updatePlayerList();
    };
    ParticleDemo.prototype.createParticleDemoRoom = // tools
    function () {
        Output.log("New Game");
        this.createRoomFromMy();
    };
    ParticleDemo.prototype.updateGroups = function () {
        Output.log("updateGroups", this.useGroups);
        if(this.isJoinedToRoom()) {
            if(this.useGroups) {
                this.changeGroups([], [
                    this.myActor().group()
                ]);
            } else {
                this.changeGroups([], null);
            }
        }
    };
    ParticleDemo.prototype.updateCellSize = function () {
        this.cellWidth = Math.floor(this.canvas.width / this.myRoom().gridSize());
        this.cellHeight = Math.floor(this.canvas.height / this.myRoom().gridSize());
    };
    ParticleDemo.prototype.setupScene = function () {
        this.stage = new createjs.Stage(this.canvas);
        this.stage.removeAllChildren();
        this.updateCellSize();
        this.stage.removeAllChildren();
        this.drawBg();
        this.drawChecker();
        this.drawGrid();
        for(var aNr in this.myRoomActors()) {
            var p = this.myRoomActors()[aNr];
            p.setVisual(new ParticlePlayerVisual(this.stage, p, this.cellWidth, this.cellHeight));
        }
        this.stage.update();
    };
    ParticleDemo.prototype.drawBg = function () {
        var bg = new createjs.Shape();
        bg.graphics.beginFill(this.bgColor).drawRect(0, 0, this.canvas.width, this.canvas.height);
        this.stage.addChild(bg);
    };
    ParticleDemo.prototype.drawGrid = function () {
        var grid = new createjs.Shape();
        var w = this.canvas.width;
        var h = this.canvas.height;
        for(var i = 0; i < this.myRoom().gridSize() + 1; ++i) {
            var x = i * this.cellWidth;
            var y = i * this.cellHeight;
            grid.graphics.setStrokeStyle(1);
            grid.graphics.beginStroke(this.gridColor).moveTo(x, 0).lineTo(x, h);
            grid.graphics.beginStroke(this.gridColor).moveTo(0, y).lineTo(w, y);
        }
        this.stage.addChild(grid);
    };
    ParticleDemo.prototype.drawChecker = function () {
        this.checker.removeAllChildren();
        for(var x = 0; x < DemoConstants.GroupsPerAxis; ++x) {
            for(var y = 0; y < DemoConstants.GroupsPerAxis; ++y) {
                if((x % 2) != (y % 2)) {
                    var square = new createjs.Shape();
                    var x0 = this.cellWidth * Math.ceil(x * this.myRoom().gridSize() / DemoConstants.GroupsPerAxis);
                    var y0 = this.cellHeight * Math.ceil(y * this.myRoom().gridSize() / DemoConstants.GroupsPerAxis);
                    var x1 = this.cellWidth * Math.ceil((x + 1) * this.myRoom().gridSize() / DemoConstants.GroupsPerAxis);
                    var y1 = this.cellHeight * Math.ceil((y + 1) * this.myRoom().gridSize() / DemoConstants.GroupsPerAxis);
                    square.graphics.beginFill(this.checkerColor).drawRect(x0, y0, x1 - x0, y1 - y0);
                    this.checker.addChild(square);
                }
            }
        }
        this.stage.addChild(this.checker);
        this.updateCheckerVisibility();
    };
    ParticleDemo.prototype.updateCheckerVisibility = function () {
        this.checker.visible = this.useGroups;
    };
    ParticleDemo.prototype.nextGridSize = function () {
        var s = this.myRoom().gridSize();
        s = s << 1;
        if(s > DemoConstants.GridSizeMax) {
            s = DemoConstants.GridSizeMin;
        }
        Output.log("nextGridSize:", this.myRoom().gridSize() + " -> " + s);
        this.myRoom().setCustomProperty(DemoConstants.GridSizeProp, s);
    };
    ParticleDemo.prototype.setupUI = // ui
    function () {
        var _this = this;
        this.canvas.onclick = function (mouseEvent) {
            var relativeClickX = mouseEvent.clientX - _this.canvas.offsetLeft;
            var relativeClickY = mouseEvent.clientY - _this.canvas.offsetTop;
            if(isNaN(relativeClickX)) {
                Output.log("Could not calculate click position! Maybe browser's event does not contain needed values. Ignoring click.");
                return;
            }
            _this.myActor().moveLocal(Math.floor(relativeClickX / _this.cellWidth), Math.floor(relativeClickY / _this.cellHeight));
            _this.stage.update();
        };
        var btn = document.getElementById("newgamebtn");
        btn.onclick = function (ev) {
            if(_this.isInLobby()) {
                _this.createParticleDemoRoom();
            } else {
                Output.log("Reload page to connect to Master");
            }
            return false;
        };
        btn = document.getElementById("joinbtn");
        btn.onclick = function (ev) {
            if(_this.isInLobby()) {
                var menu = document.getElementById("gamelist");
                if(menu.selectedIndex >= 0 && menu.selectedIndex < _this.availableRooms().length) {
                    var gameId = _this.availableRooms()[menu.selectedIndex].name;
                    Output.log("Join Game", gameId);
                    _this.joinRoom(gameId);
                } else {
                    Output.log("No Rooms to Join");
                }
            } else {
                Output.log("Reload page to connect to Master");
            }
            return false;
        };
        btn = document.getElementById("leavebtn");
        btn.onclick = function (ev) {
            _this.autoconnect = false;
            _this.leaveRoom();
            return false;
        };
        btn = document.getElementById("gridsize");
        btn.onclick = function (ev) {
            _this.nextGridSize();
            _this.setupScene();
            return false;
        };
        btn = document.getElementById("randomcolor");
        btn.onclick = function (ev) {
            _this.myActor().setRandomColor();
            _this.stage.update();
            return false;
        };
        var checkBox = document.getElementById("usegroups");
        this.useGroups = checkBox.checked;
        checkBox.onclick = function (ev) {
            _this.useGroups = ev.currentTarget["checked"];
            _this.updateGroups();
            _this.updateCheckerVisibility();
        };
        checkBox = document.getElementById("automove");
        this.automove = checkBox.checked;
        checkBox.onclick = function (ev) {
            _this.automove = ev.currentTarget["checked"];
        };
        this.updateRoomButtons();
    };
    ParticleDemo.prototype.updateRoomListMenu = function (rooms) {
        Output.log("onRoomList", rooms);
        var menu = document.getElementById("gamelist");
        while(menu.firstChild) {
            menu.removeChild(menu.firstChild);
        }
        var selectedIndex = 0;
        for(var i = 0; i < rooms.length; ++i) {
            var r = rooms[i];
            var item = document.createElement("option");
            item.attributes["value"] = r.name;
            item.textContent = r.name + "/" + r.getCustomProperty(DemoConstants.MapProp) + "/" + r.getCustomProperty(DemoConstants.GridSizeProp);
            menu.appendChild(item);
            if(this.myRoom().name == r.name) {
                selectedIndex = i;
            }
            Output.log("room:", r);
        }
        (menu).selectedIndex = selectedIndex;
        Output.log("Demo: Rooms total: " + rooms.length);
    };
    ParticleDemo.prototype.updatePlayerList = function () {
        var list = document.getElementById("playerlist");
        while(list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for(var i in this.myRoomActors()) {
            var a = this.myRoomActors()[i];
            var item = document.createElement("li");
            item.attributes["value"] = a.name;
            item.textContent = a.name + "/" + a.actorNr;
            if(a.isLocal) {
                item.textContent = item.textContent + " <-";
            }
            list.appendChild(item);
            this.logger.info("actor:", a);
        }
    };
    ParticleDemo.prototype.updateRoomButtons = function () {
        var btn;
        btn = document.getElementById("newgamebtn");
        btn.disabled = !this.isInLobby();
        btn = document.getElementById("joinbtn");
        btn.disabled = !(this.isInLobby() && this.availableRooms().length > 0);
        btn = document.getElementById("leavebtn");
        btn.disabled = !this.isJoinedToRoom();
    };
    return ParticleDemo;
})(Photon.LoadBalancing.LoadBalancingClient);
var Output = (function () {
    function Output() { }
    Output.logger = new Exitgames.Common.Logger();
    Output.log = function log(str) {
        var op = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            op[_i] = arguments[_i + 1];
        }
        var log = document.getElementById("log");
        var formatted = Output.logger.formatArr(str, op);
        log.textContent = log.textContent + formatted;
        log.innerHTML = log.innerHTML + "<br>";
        log.scrollTop = log.scrollHeight;
    };
    return Output;
})();
var ParticleRoom = (function (_super) {
    __extends(ParticleRoom, _super);
    function ParticleRoom(name) {
        _super.call(this, name);
        this.setCustomProperty(DemoConstants.MapProp, DemoConstants.MapType.Forest);
        this.setCustomProperty(DemoConstants.GridSizeProp, DemoConstants.GridSizeDefault);
        this.setPropsListedInLobby([
            DemoConstants.MapProp
        ]);
    }
    ParticleRoom.prototype.mapType = // acceess properties every time
    function () {
        return this.getCustomPropertyOrElse(DemoConstants.MapProp, DemoConstants.MapType.Forest);
    };
    ParticleRoom.prototype.gridSize = // cached property value
    function () {
        return this._gridSize;
    };
    ParticleRoom.prototype.onPropertiesChange = function (changedCustomProps) {
        // optional: check if size prop in changedCustomProps
        this._gridSize = this.getCustomPropertyOrElse(DemoConstants.GridSizeProp, this._gridSize);
    };
    ParticleRoom.prototype.setGridSize = function (value) {
        this.setCustomProperty(DemoConstants.GridSizeProp, value);
    };
    return ParticleRoom;
})(Photon.LoadBalancing.Room);
var ParticlePlayerVisual = (function () {
    function ParticlePlayerVisual(stage, player, cellWidth, cellHeight) {
        this.stage = stage;
        this.player = player;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.updateShape(player.color, 0, 0);
    }
    ParticlePlayerVisual.prototype.updateShape = function (color, x, y) {
        var scolor = Util.toRgbString(color);
        this.clear();
        this.root = new createjs.Container();
        this.stage.addChild(this.root);
        this.shape = new createjs.Shape();
        this.shape.graphics.beginFill(scolor).drawRect(1, 1, this.cellWidth - 2, this.cellHeight - 2);
        if(this.player.isLocal) {
            this.shape.graphics.beginStroke("black").drawRect(1, 1, this.cellWidth - 2, this.cellHeight - 2);
        }
        this.root.addChild(this.shape);
        this.text = new createjs.Text("init");
        this.root.addChild(this.text);
        this.update(x, y);
    };
    ParticlePlayerVisual.prototype.clear = function () {
        if(this.root) {
            this.stage.removeChild(this.root);
            this.root = null;
        }
    };
    ParticlePlayerVisual.prototype.update = function (x, y) {
        this.root.alpha = 255;
        this.root.x = x * this.cellWidth;
        this.root.y = y * this.cellHeight;
    };
    ParticlePlayerVisual.prototype.setAlpha = function (a) {
        this.root.alpha = a;
    };
    ParticlePlayerVisual.prototype.updateText = function (text) {
        if(this.text) {
            this.text.text = text;
        }
    };
    return ParticlePlayerVisual;
})();
var ParticlePlayer = (function (_super) {
    __extends(ParticlePlayer, _super);
    function ParticlePlayer(game, name, actorNr, isLocal) {
        _super.call(this, name, actorNr, isLocal);
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.color = Util.randomColor(100);
        this.lastUpdateTime = Date.now();
        this._group = 1;
    }
    ParticlePlayer.prototype.getRoom = function () {
        return _super.prototype.getRoom.call(this);
    };
    ParticlePlayer.prototype.setVisual = function (visual) {
        this.visual = visual;
        this.visual.update(this.x, this.y);
        this.updateText();
    };
    ParticlePlayer.prototype.clearVisual = function () {
        if(this.visual) {
            this.visual.clear();
        }
    };
    ParticlePlayer.prototype.setRandomColor = function () {
        this.setColor(Util.randomColor(100));
        this.raiseColorEvent();
    };
    ParticlePlayer.prototype.setColor = function (color) {
        this.color = color;
        this.visual.updateShape(color, this.x, this.y);
        this.updateText();
    };
    ParticlePlayer.prototype.move = function (x, y) {
        this.x = x;
        this.y = y;
        this._group = this.getGroupByPos();
        if(this.visual) {
            this.visual.update(this.x, this.y);
            this.updateText();
        }
        this.lastUpdateTime = Date.now();
    };
    ParticlePlayer.prototype.updateText = function () {
        this.visual.updateText(this.name + "/" + this.actorNr + "\n" + this.group());
    };
    ParticlePlayer.prototype.tick = function () {
        if(this.isLocal) {
            this.tickLocal();
        } else {
            this.tickRemote();
        }
    };
    ParticlePlayer.prototype.tickRemote = function () {
        var t = Date.now() - this.lastUpdateTime;
        if(t > 2000) {
            this.visual.setAlpha(Math.max(0.1, (2000 + 5000 - t) / 5000));
        } else {
            this.visual.setAlpha(1);
        }
    };
    ParticlePlayer.prototype.tickLocal = function () {
        if(this.game.isJoinedToRoom()) {
            if(this.getRoom()) {
                if(this.game.automove) {
                    var d = Math.floor(Math.random() * 8);
                    var s = this.getRoom().gridSize();
                    var x = this.x + [
                        -1, 
                        0, 
                        1, 
                        -1, 
                        1, 
                        -1, 
                        0, 
                        1
                    ][d];
                    var y = this.y + [
                        1, 
                        1, 
                        1, 
                        0, 
                        0, 
                        -1, 
                        -1, 
                        -1
                    ][d];
                    if(x < 0) {
                        x = 1;
                    }
                    if(x >= s) {
                        x = s - 2;
                    }
                    if(y < 0) {
                        y = 1;
                    }
                    if(y >= s) {
                        y = s - 2;
                    }
                    this.moveLocal(x, y);
                }
            }
        }
    };
    ParticlePlayer.prototype.moveLocal = function (x, y) {
        this.x = x;
        this.y = y;
        var newGroup = this.getGroupByPos();
        if(newGroup !== this._group) {
            this._group = newGroup;
            if(this.game.useGroups) {
                this.game.changeGroups([], [
                    this.group()
                ]);
            }
        }
        this.raiseEvent(DemoConstants.EvPosition, {
            1: [
                this.x, 
                this.y
            ]
        }, {
            interestGroup: this.game.useGroups ? this.group() : undefined
        });
        this.move(x, y);
    };
    ParticlePlayer.prototype.raiseColorEvent = function () {
        this.raiseEvent(DemoConstants.EvColor, {
            1: this.color
        }, {
            cache: Photon.LoadBalancing.Constants.EventCaching.AddToRoomCache
        });
    };
    ParticlePlayer.prototype.group = function () {
        return this._group;
    };
    ParticlePlayer.prototype.getGroupByPos = function () {
        var xp = Math.floor(this.x * DemoConstants.GroupsPerAxis / this.getRoom().gridSize());
        var yp = Math.floor(this.y * DemoConstants.GroupsPerAxis / this.getRoom().gridSize());
        return (1 + xp + yp * DemoConstants.GroupsPerAxis);
    };
    return ParticlePlayer;
})(Photon.LoadBalancing.Actor);
var Util = (function () {
    function Util() { }
    Util.toRgbString = function toRgbString(color) {
        var ucolor = ((0x100000000 + color) % 0x100000000);
        //        var scolor = "rgba(" + ((ucolor >> 16) & 255) + "," + ((ucolor >> 8) & 255) + "," + (ucolor & 255) + "," + ((ucolor >> 24) & 255) + ")";
        var scolor = "rgba(" + ((ucolor >> 16) & 255) + "," + ((ucolor >> 8) & 255) + "," + (ucolor & 255) + ",255)";
        return scolor;
    };
    Util.randomColor = function randomColor(from, to) {
        if (typeof from === "undefined") { from = 0; }
        if (typeof to === "undefined") { to = 256; }
        //(255 << 24) + (255 << 16) + (200 << 8) + 200
        var rnd = function () {
            return Math.floor(from + (to - from) * Math.random());
        };
        return (rnd() << 16) + (rnd() << 8) + rnd();
    };
    return Util;
})();
var loadBalancingClient;
window.onload = function () {
    loadBalancingClient = new ParticleDemo(document.getElementById("canvas"));
    loadBalancingClient.start();
};
