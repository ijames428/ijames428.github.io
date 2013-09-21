var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Photon;
(function (Photon) {
    (function (Lite) {
        var LitePeer = (function (_super) {
            __extends(LitePeer, _super);
            function LitePeer(url, subprotocol) {
                if (typeof subprotocol === "undefined") { subprotocol = ""; }
                        _super.call(this, url, subprotocol);
                this.isJoined = false;
                this.roomName = "";
                this.room = {
                    properties: {
                    }
                };
                this.actors = {
                };
                this._myActor = {
                    photonId: null,
                    properties: {
                    }
                };
            }
            LitePeer.prototype.myActor = function () {
                return this._myActor;
            };
            LitePeer.prototype.join = function (roomName, roomProperties, actorProperties, broadcast) {
                if(roomName !== undefined && this.isConnected() && !this.isJoined) {
                    this._logger.info("PhotonPeer.Lite[join] - Joining roomName:", roomName);
                    this._logger.debug("PhotonPeer.Lite[join] - actorProperties:", actorProperties, ", roomProperties:", roomProperties, ", broadcast:", broadcast);
                    var sndArr = [];
                    sndArr.push(Lite.Constants.LiteOpKey.GameId);
                    sndArr.push(roomName + "");
                    if(typeof roomProperties === "object") {
                        sndArr.push(Lite.Constants.LiteOpKey.GameProperties);
                        sndArr.push(roomProperties);
                    }
                    if(typeof actorProperties === "object") {
                        sndArr.push(Lite.Constants.LiteOpKey.ActorProperties);
                        sndArr.push(actorProperties);
                    }
                    sndArr.push(Lite.Constants.LiteOpKey.Broadcast);
                    sndArr.push(broadcast || false);
                    this.sendOperation(Lite.Constants.LiteOpCode.Join, sndArr);
                } else {
                    if(roomName === undefined) {
                        throw new Error("PhotonPeer.Lite[join] - Trying to join with undefined roomName!");
                    } else {
                        if(this.isJoined) {
                            throw new Error("PhotonPeer.Lite[join] - you have already joined!");
                        } else {
                            throw new Error("PhotonPeer.Lite[join] - Not connected!");
                        }
                    }
                }
            };
            LitePeer.prototype.leave = function () {
                if(this.isJoined) {
                    this._logger.debug("PhotonPeer.Lite[leave] - Leaving ...");
                    this.sendOperation(Lite.Constants.LiteOpCode.Leave);
                } else {
                    throw new Error("PhotonPeer.Lite[leave] - Not joined!");
                }
            };
            LitePeer.prototype.raiseEvent = function (eventCode, data) {
                if(this.isJoined) {
                    if(data !== undefined) {
                        this._logger.debug('PhotonPeer.Lite[raiseEvent] - Event', eventCode, ":", data);
                        this.sendOperation(Lite.Constants.LiteOpCode.RaiseEvent, [
                            Lite.Constants.LiteOpKey.Code, 
                            eventCode, 
                            Lite.Constants.LiteOpKey.Data, 
                            data
                        ]);
                    } else {
                        throw new Error(this._logger.format('PhotonPeer.Lite[raiseEvent] - Event', eventCode, '- data not passed in as object!'));
                    }
                } else {
                    throw new Error("PhotonPeer.Lite[raiseEvent] - Not joined!");
                }
            };
            LitePeer.prototype.setActorProperties = function (actorNr, data, broadcast) {
                if(this.isJoined) {
                    this._logger.debug("PhotonPeer.Lite[setActorProperties] - actorNumber:" + actorNr + ", broadcast:" + broadcast + ", data:", data);
                    this.sendOperation(Lite.Constants.LiteOpCode.SetProperties, [
                        Lite.Constants.LiteOpKey.Broadcast, 
                        broadcast, 
                        Lite.Constants.LiteOpKey.Properties, 
                        data, 
                        Lite.Constants.LiteOpKey.ActorNr, 
                        actorNr
                    ]);
                } else {
                    throw new Error("PhotonPeer.Lite[setActorProperties] - Not joined!");
                }
            };
            LitePeer.prototype.getActorProperties = function (propertyKeys, actorNrs) {
                if(this.isJoined) {
                    var sndArr = [];
                    sndArr.push(Lite.Constants.LiteOpKey.ActorProperties);
                    if(propertyKeys !== undefined) {
                        if(Exitgames.Common.Util.isArray(propertyKeys)) {
                            if(propertyKeys.length > 0) {
                                sndArr.push(propertyKeys);
                            }
                        }
                    }
                    if(sndArr.length !== 2) {
                        sndArr.push(null);
                    }
                    sndArr.push(Lite.Constants.LiteOpKey.ActorList);
                    if(actorNrs !== undefined) {
                        if(Exitgames.Common.Util.isArray(actorNrs)) {
                            if(actorNrs.length > 0) {
                                sndArr.push(actorNrs);
                            }
                        }
                    }
                    if(sndArr.length !== 4) {
                        sndArr.push(null);
                    }
                    sndArr.push(Lite.Constants.LiteOpKey.Properties);
                    sndArr.push(2);
                    this._logger.debug("PhotonPeer.Lite[getActorProperties] -", sndArr);
                    this.sendOperation(Lite.Constants.LiteOpCode.GetProperties, sndArr);
                } else {
                    throw new Error("PhotonPeer.Lite[getProperties] - Not joined!");
                }
            };
            LitePeer.prototype.setRoomProperties = function (data, broadcast) {
                if(this.isJoined) {
                    this._logger.debug("PhotonPeer.Lite[setRoomProperties] - broadcast:" + broadcast + ", data:", data);
                    this.sendOperation(Lite.Constants.LiteOpCode.SetProperties, [
                        Lite.Constants.LiteOpKey.Broadcast, 
                        broadcast, 
                        Lite.Constants.LiteOpKey.Properties, 
                        data
                    ]);
                } else {
                    throw new Error("PhotonPeer.Lite[setRoomProperties] - Not joined!");
                }
            };
            LitePeer.prototype.getRoomProperties = function (propertyKeys) {
                if(this.isJoined) {
                    var sndArr = [];
                    sndArr.push(Lite.Constants.LiteOpKey.GameProperties);
                    if(propertyKeys !== undefined) {
                        if(Exitgames.Common.Util.isArray(propertyKeys)) {
                            if(propertyKeys.length > 0) {
                                sndArr.push(propertyKeys);
                            }
                        }
                    } else {
                        sndArr.push(null);
                    }
                    this._logger.debug("PhotonPeer.Lite[getRoomProperties] -", sndArr);
                    this.sendOperation(Lite.Constants.LiteOpCode.GetProperties, sndArr);
                } else {
                    throw new Error("PhotonPeer.Lite[getRoomProperties] - Not joined!");
                }
            };
            LitePeer.prototype._addActor = function (actorNr) {
                this.actors[actorNr] = {
                    photonId: actorNr
                };
                this._logger.debug("PhotonPeer.Lite[_addActor] - Added actorNr", actorNr, "actors known are now ", this.actors);
                return this.actors[actorNr];
            };
            LitePeer.prototype._removeActor = function (actorNr) {
                delete this.actors[actorNr];
                this._logger.debug("PhotonPeer.Lite[_removeActor] - Removed actorNr", actorNr, ", actors known are now", this.actors);
                return this;
            };
            LitePeer.prototype.actorNrFromVals = function (vals) {
                var actorNrVal = vals[Photon.Lite.Constants.LiteOpKey.ActorNr];
                return actorNrVal !== undefined ? parseInt(actorNrVal) : -1;
            };
            LitePeer.prototype._parseEvent = function (code, event) {
                var actorNr = this.actorNrFromVals(event.vals);
                switch(code) {
                    case Lite.Constants.LiteEventCode.Join:
                        this._onEventJoin(event, actorNr);
                        break;
                    case Lite.Constants.LiteEventCode.Leave:
                        this._onEventLeave(actorNr);
                        break;
                    case Lite.Constants.LiteEventCode.PropertiesChanged:
                        this._onEventSetProperties(event, actorNr);
                        break;
                    default:
                        this._logger.info('PhotonPeer.Lite[_parseEvent] - Unknown event code', code, 'with JSON:', event);
                        this._dispatchEvent(code, {
                            vals: event.vals,
                            actorNr: actorNr
                        });
                        break;
                }
            };
            LitePeer.prototype._onEventJoin = function (event, actorNr) {
                if(actorNr !== this._myActor.photonId) {
                    this._logger.debug("PhotonPeer.Lite[_onEventJoin] - ActorNr", actorNr, "joined.");
                    this._addActor(actorNr);
                    this._dispatchEvent(Lite.Constants.LiteEventCode.Join, {
                        newActors: [
                            actorNr
                        ]
                    });
                } else {
                    var eventActors = event.vals[Lite.Constants.LiteOpKey.ActorList], joinedActors = [];
                    for(var i in eventActors) {
                        var actorNr = parseInt(eventActors[i]);
                        if(actorNr !== this._myActor.photonId && this.actors[actorNr] === undefined) {
                            this._logger.debug("PhotonPeer.Lite[_onEventJoin] - ActorNr", actorNr, "registered as already joined");
                            this._addActor(actorNr);
                            joinedActors.push(actorNr);
                        }
                    }
                    this._dispatchEvent(Lite.Constants.LiteEventCode.Join, {
                        newActors: joinedActors
                    });
                }
            };
            LitePeer.prototype._onEventLeave = function (actorNr) {
                this._logger.debug("PhotonPeer.Lite[_onEventLeave] - ActorNr", actorNr, "left");
                this._removeActor(actorNr);
                this._dispatchEvent(Lite.Constants.LiteEventCode.Leave, {
                    actorNr: actorNr
                });
            };
            LitePeer.prototype._onEventSetProperties = function (event, actorNr) {
            };
            LitePeer.prototype._parseResponse = function (code, response) {
                var actorNr = this.actorNrFromVals(response.vals);
                switch(code) {
                    case Lite.Constants.LiteOpCode.Join:
                        this._onResponseJoin(actorNr);
                        break;
                    case Lite.Constants.LiteOpCode.Leave:
                        this._onResponseLeave(actorNr);
                        break;
                    case Lite.Constants.LiteOpCode.RaiseEvent:
                        break;
                    case Lite.Constants.LiteOpCode.GetProperties:
                        this._onResponseGetProperties(response);
                        break;
                    case Lite.Constants.LiteOpCode.SetProperties:
                        this._onResponseSetProperties(response, actorNr);
                        break;
                    default:
                        this._logger.debug('PhotonPeer.Lite[_parseResponse] - Unknown response code', code, response, "actorNr", actorNr);
                        this._dispatchResponse(code, {
                            errCode: response.err,
                            errMsg: response.msg,
                            vals: response.vals,
                            actorNr: actorNr
                        });
                        break;
                }
            };
            LitePeer.prototype._onResponseGetProperties = function (response) {
                this._logger.debug("PhotonPeer.Lite[_onResponseGetProperties] - getProperties response:", response);
                if(response.vals[Lite.Constants.LiteOpKey.ActorProperties] !== undefined) {
                    var actorProperties = response.vals[Lite.Constants.LiteOpKey.ActorProperties];
                    for(var actorNr in actorProperties) {
                        this.actors[actorNr].properties = actorProperties[actorNr];
                    }
                }
                if(response.vals[Lite.Constants.LiteOpKey.GameProperties] !== undefined) {
                    var roomProperties = response.vals[Lite.Constants.LiteOpKey.GameProperties];
                    this.room.properties = roomProperties;
                }
                this._dispatchResponse(Lite.Constants.LiteOpCode.GetProperties, {
                    vals: response.vals
                });
            };
            LitePeer.prototype._onResponseJoin = function (actorNr) {
                this.isJoined = true;
                if(typeof this._myActor === "object") {
                    this._myActor = this._addActor(actorNr);
                    this._logger.debug("PhotonPeer.Lite[_onResponseJoin] - You joined as actor number / myActor.photonId has been set to:", this._myActor.photonId);
                }
                this._dispatchResponse(Lite.Constants.LiteOpCode.Join, {
                    actorNr: actorNr
                });
            };
            LitePeer.prototype._onResponseLeave = function (actorNr) {
                this.isJoined = false;
                this._removeActor(this._myActor.photonId);
                this._logger.debug('PhotonPeer.Lite[_onResponseLeave] - You left the room', this.roomName);
                this.roomName = "";
                this.room = {
                    properties: {
                    }
                };
                this._dispatchResponse(Lite.Constants.LiteOpCode.Leave, {
                    actorNr: actorNr
                });
            };
            LitePeer.prototype._onResponseSetProperties = function (response, actorNr) {
                this._logger.debug("PhotonPeer.Lite[_onResponseSetProperties] - setProperties response:", response, "actorNr", actorNr);
                this._dispatchResponse(Lite.Constants.LiteOpCode.SetProperties, {
                    vals: response.vals,
                    actorNr: actorNr
                });
            };
            return LitePeer;
        })(Photon.PhotonPeer);
        Lite.LitePeer = LitePeer;        
    })(Photon.Lite || (Photon.Lite = {}));
    var Lite = Photon.Lite;
})(Photon || (Photon = {}));
//@ sourceMappingURL=photon-lite.js.map
