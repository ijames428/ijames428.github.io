/// <reference path="photon.ts"/>
/// <reference path="photon-loadbalancing-constants.ts"/>

/** 
    Photon Load Balancing API
    @namespace Photon.LoadBalancing 
*/


module Photon.LoadBalancing {

    export class Actor {

        /**
            @classdesc Summarizes a "player" within a room, identified (in that room) by ID (or "actorNr"). Extend to implement custom logic.
            @constructor Photon.LoadBalancing.Actor
            @param {string} name Actor name.
            @param {number} actorNr Actor ID.
            @param {bool} isLocal Actor is local.
        */
        constructor(public name: string, public actorNr: number, public isLocal: bool) { }

        // public getLoadBalancingClient() { return this.loadBalancingClient; }

        /** 
            @summary Actor's room: the room initialized by client for create room operation or room client connected to.
            @method Photon.LoadBalancing.Actor#getRoom
            @returns {Photon.LoadBalancing.Room} Actor's room.
        */
        public getRoom() { return this.loadBalancingClient.myRoom(); }

        /** 
            @summary Raises game custom event.
            @method Photon.LoadBalancing.Actor#raiseEvent
            @param {number} eventCode Identifies this type of event (and the content). Your game's event codes can start with 0.
            @param {object} [data] Custom data you want to send along (use null, if none).
            @param {object} [options] Additional options
            @property {object} options Additional options
            @property {number} [options.interestGroup] The ID of the interest group this event goes to (exclusively).
            @property {Photon.LoadBalancing.Constants.EventCaching} [options.cache=EventCaching.DoNotCache] Events can be cached (merged and removed) for players joining later on.
            @property {Photon.LoadBalancing.Constants.ReceiverGroup} [options.receivers=ReceiverGroup.Others] Defines to which group of players the event is passed on.
        */
        public raiseEvent(eventCode: number, data?: any, options?: { interestGroup?: number; cache?: number; receivers?: number; }) {
            if (this.loadBalancingClient) {
                this.loadBalancingClient.raiseEvent(eventCode, data, options);
            }
        }

        /** 
            @summary Sets room name (before create room operation).
            @method Photon.LoadBalancing.Actor#setName
            @param {string} name Room name.
        */
        public setName(name: string) { this.name = name; }

        // properties methods

        /** 
            @summary Called on every actor properties update: properties set by client, poperties update from server.
            Override to update custom room state.
            @method Photon.LoadBalancing.RoomInfo#onPropertiesChange
            @param {object} changedCustomProps Key-value map of changed properties.
        */
        public onPropertiesChange(changedCustomProps: any) { }

        /** 
            @summary Returns custom property by name.
            @method Photon.LoadBalancing.Actor#getCustomProperty
            @param {string} name Name of the property.
            @returns {object} Property or undefined if property not found.
        */
        public getCustomProperty(name: string) { return this.customProperties[name]; }

        /** 
            @summary Returns custom property by name or default value.
            @method Photon.LoadBalancing.Actor#getCustomPropertyOrElse
            @param {string} name Name of the property.
            @param {object} defaultValue Default property value.
            @returns {object} Property or default value if property not found.
        */
        public getCustomPropertyOrElse(name: string, defaultValue: any) { return Exitgames.Common.Util.getPropertyOrElse(this.customProperties, name, defaultValue); }

        /** 
            @summary Sets custom property.
            @method Photon.LoadBalancing.Actor#setCustomProperty
            @param {string} name Name of the property.
            @param {object} value Property value.
        */
        public setCustomProperty(name: string, value: any) {
            this.customProperties[name] = value;
            if (this.loadBalancingClient && this.loadBalancingClient.isJoinedToRoom()) {
                var props = {};
                props[name] = value;
                this.loadBalancingClient._setPropertiesOfActor(props);
                this.onPropertiesChange(props);
            }

        }

        _getAllProperties() {
            var p = {};
            p[Constants.ActorProperties.PlayerName] = this.name;
            for (var k in this.customProperties) {
                p[k] = this.customProperties[k];
            }
            return p;
        }


        public _setLBC(lbc: LoadBalancingClient) { this.loadBalancingClient = lbc; }

        private customProperties = {};
        private loadBalancingClient: LoadBalancingClient;

        _updateFromResponse(vals: {}) {
            this.actorNr = vals[Constants.ParameterCode.ActorNr];
            var props = vals[Constants.ParameterCode.PlayerProperties];
            if (props !== undefined) {
                var name = props[Constants.ActorProperties.PlayerName];
                if (name !== undefined) {
                    this.name = name;
                }
                this._updateCustomProperties(props);
            }
        }

        _updateMyActorFromResponse(vals: {}) {
            this.actorNr = vals[Constants.ParameterCode.ActorNr];
        }

        _updateCustomProperties(vals: {}) {
			for (var p in vals) {
				this.customProperties[p] = vals[p];
			}
            this.onPropertiesChange(vals);
        }

        static _getActorNrFromResponse(vals: {}) {
            return vals[Constants.ParameterCode.ActorNr];
        }
    }

    // readonly room info from server
    export class RoomInfo {

        // standard room properties
        // TODO: access via getters

        /** 
            @summary Room name.
            @member Photon.LoadBalancing.RoomInfo#name
            @type {string}
            @readonly
        */
        public name = "";

        /** 
            @summary Joined room game server address.
            @member Photon.LoadBalancing.RoomInfo#address
            @type {string}
            @readonly
        */
        public address = "";

        /** 
            @summary Max players before room is considered full.
            @member Photon.LoadBalancing.RoomInfo#maxPlayers
            @type {number}
            @readonly
        */
        public maxPlayers = 0;

        /** 
            @summary Shows the room in the lobby's room list. Makes sense only for local room.
            @member Photon.LoadBalancing.RoomInfo#isVisible
            @type {bool}
            @readonly
        */
        public isVisible = true;

        /** 
            @summary Defines if this room can be joined.
            @member Photon.LoadBalancing.RoomInfo#isOpen
            @type {bool}
            @readonly
        */
        public isOpen = true;

        /** 
            @summary Count of player currently in room.
            @member Photon.LoadBalancing.RoomInfo#playerCount
            @type {number}
            @readonly
        */
        public playerCount = 0;

        /** 
            @summary Room removed (in room list updates).
            @member Photon.LoadBalancing.RoomInfo#removed
            @type {bool}
            @readonly
        */
        public removed = false;

        // TODO: does end user need this?
        private cleanupCacheOnLeave = false;

        // custom properties
        public _customProperties = {};
        public _propsListedInLobby: string[] = [];


        /** 
            @summary Called on every room properties update: room creation, properties set by client, poperties update from server.
            Override to update custom room state.
            @method Photon.LoadBalancing.RoomInfo#onPropertiesChange
            @param {object} changedCustomProps Key-value map of changed properties.
        */
        public onPropertiesChange(changedCustomProps: any) { }
        /** 
            @summary Returns custom property by name.
            @method Photon.LoadBalancing.RoomInfo#getCustomProperty
            @param {string} name Name of the property.
            @returns {object} Property or undefined if property not found.
        */
        public getCustomProperty(prop: string) { return this._customProperties[prop]; }
        /** 
            @summary Returns custom property by name or default value.
            @method Photon.LoadBalancing.RoomInfo#getCustomPropertyOrElse
            @param {string} name Name of the property.
            @param {object} defaultValue Default property value.
            @returns {object} Property or default value if property not found.
        */
        public getCustomPropertyOrElse(prop: string, defaultValue: any) { return Exitgames.Common.Util.getPropertyOrElse(this._customProperties, prop, defaultValue) }
        /**
            @classdesc Used for Room listings of the lobby (not yet joining). Offers the basic info about a room: name, player counts, properties, etc.
            @constructor Photon.LoadBalancing.RoomInfo
            @param {string} name Room name.
        */
        constructor(name: string) {
            this.name = name;
        }

        public _updateFromMasterResponse(vals: any) {
            this.address = vals[Constants.ParameterCode.Address];
            var name = vals[Constants.ParameterCode.RoomName];
            if (name) {
                this.name = name;
            }
        }

        public _updateFromProps(props: Object, customProps: Object = null) {
            if (props) {
                this.maxPlayers = this.updateIfExists(this.maxPlayers, Constants.GameProperties.MaxPlayers, props);
                this.isVisible = this.updateIfExists(this.isVisible, Constants.GameProperties.IsVisible, props);
                this.isOpen = this.updateIfExists(this.isOpen, Constants.GameProperties.IsOpen, props);
                this.playerCount = this.updateIfExists(this.playerCount, Constants.GameProperties.PlayerCount, props);
                this.removed = this.updateIfExists(this.removed, Constants.GameProperties.Removed, props);
                this._propsListedInLobby = this.updateIfExists(this._propsListedInLobby, Constants.GameProperties.PropsListedInLobby, props);
                this.cleanupCacheOnLeave = this.updateIfExists(this.cleanupCacheOnLeave, Constants.GameProperties.CleanupCacheOnLeave, props);
                var changedProps = {};
                if (customProps === null) {
                    customProps = props;
                }
                for (var k in customProps) {
                    if (parseInt(k).toString() != k) {// if key is not a number
                        if (this._customProperties[k] !== customProps[k]) {
                            this._customProperties[k] = customProps[k];
                            changedProps[k] = customProps[k];
                        }
                    }
                }
                this.onPropertiesChange(changedProps);
            }
        }

        private updateIfExists(prevValue: any, code: number, props: any) {
            if (props.hasOwnProperty(code)) {
                return props[code];
            }
            else {
                return prevValue;
            }
        }
    }

    // joined room with writable properties
    export class Room extends RoomInfo {
        /**
            @classdesc Represents a room client joins or is joined to. Extend to implement custom logic. Custom properties can be set via setCustomProperty() while being in the room.
            @mixes Photon.LoadBalancing.RoomInfo
            @constructor Photon.LoadBalancing.Room
            @param {string} name Room name.
        */
        constructor(name: string) { super(name) }
        // room created from client via factory always has this field set
        //public getLoadBalancingClient() { return this.loadBalancingClient; }
        /** 
            @summary Sets custom property 
            @method Photon.LoadBalancing.Room#setCustomProperty
            @param {string} name Name of the property.
            @param {object} value Property value.
        */
        public setCustomProperty(name: string, value: any) {
            this._customProperties[name] = value;
            if (this.loadBalancingClient && this.loadBalancingClient.isJoinedToRoom()) {
                var props = {};
                props[name] = value;
                this.loadBalancingClient._setPropertiesOfRoom(props);
            }
            var cp = {};
            cp[name] = value;
            this.onPropertiesChange(cp);
        }

        private setProp(name: number, value: any) {
            if(this.loadBalancingClient && this.loadBalancingClient.isJoinedToRoom()) {
                var props = {};
                props[name] = value;
                this.loadBalancingClient._setPropertiesOfRoom(props);
            }
        }

        /** 
         * @summary Sets rooms visibility in the lobby's room list.
         * @method Photon.LoadBalancing.Room#setIsOpen
         * @param {bool} isVisible New visibility value.
        */
        public setIsVisible(isVisible: bool) {

            if (this.isVisible != isVisible) {
                this.isVisible = isVisible;
                this.setProp(Constants.GameProperties.IsVisible, isVisible);
            }
        }

        /** 
         * @summary Sets if this room can be joined.
         * @method Photon.LoadBalancing.Room#setIsOpen
         * @param {bool} isOpen New property value.
        */
        public setIsOpen(isOpen: bool) {
            if (this.isOpen == !isOpen) {
                this.isOpen = isOpen;
                this.setProp(Constants.GameProperties.IsOpen, isOpen);
            }
        }

        /** 
         * @summary Sets max players before room is considered full.
         * @method Photon.LoadBalancing.Room#setMaxPlayers
         * @param {number} maxPlayers New max players value.
        */
        public setMaxPlayers(maxPlayers: number) {
            if (this.maxPlayers != maxPlayers) {
                this.maxPlayers = maxPlayers;
                this.setProp(Constants.GameProperties.MaxPlayers, maxPlayers);
            }
        }

        /** 
            @summary Sets list of the room properties to pass to the RoomInfo list in a lobby. Call for myRoom() before createRoomFromMy call.
            @method Photon.LoadBalancing.Room#setPropsListedInLobby
            @param {string[]} props Array of properties names.
        */
        public setPropsListedInLobby(props: string[]) {
            this._propsListedInLobby = props;
        }


        private loadBalancingClient: LoadBalancingClient;

        public _setLBC(lbc: LoadBalancingClient) { this.loadBalancingClient = lbc; }

    }

    export class LoadBalancingClient {

        // override to handle system events:

        /** 
            @summary Called on client state change. Override to handle it.
            @method Photon.LoadBalancing.LoadBalancingClient#onStateChange
            @param {Photon.LoadBalancing.LoadBalancingClient.State} state New client state.
        */
        onStateChange(state: number) { }

        /** 
            @summary Called if client error occures. Override to handle it.
            @method Photon.LoadBalancing.LoadBalancingClient#onError
            @param {Photon.LoadBalancing.LoadBalancingClient.PeerErrorCode} errorCode Client error code.
            @param {string} errorMsg Error message.
        */
        onError(errorCode: number, errorMsg: string) { this.logger.error("Load Balancing Client Error", errorCode, errorMsg); }

        /** 
            @summary Called on operation response. Override if need custom workflow or response error handling.
            @method Photon.LoadBalancing.LoadBalancingClient#onOperationResponse
            @param {number} errorCode Server error code.
            @param {string} errorMsg Error message.
            @param {Photon.LoadBalancing.Constants.OperationCode} code Operation code.
            @param {object} content Operation response content.
        */
        onOperationResponse(errorCode: number, errorMsg: string, code: number, content: any) { }

        /** 
            @summary Called on custom event. Override to handle it.
            @method Photon.LoadBalancing.LoadBalancingClient#onEvent
            @param {number} code Event code.
            @param {object} content Event content.
            @param {number} actorNr Actor ID event raised by.
        */
        onEvent(code: number, content: any, actorNr: number) { }

        /** 
            @summary Called on room list received from master server (on connection). Override to handle it.
            @method Photon.LoadBalancing.LoadBalancingClient#onRoomList
            @param {Photon.LoadBalancing.RoomInfo[]} rooms Room list.
        */
        onRoomList(rooms: RoomInfo[]) { }

        /** 
            @summary Called on room list updates received from master server. Override to handle it.
            @method Photon.LoadBalancing.LoadBalancingClient#onRoomListUpdate
            @param {Photon.LoadBalancing.RoomInfo[]} rooms Updated room list.
            @param {Photon.LoadBalancing.RoomInfo[]} roomsUpdated Rooms whose properties were changed.
            @param {Photon.LoadBalancing.RoomInfo[]} roomsAdded New rooms in list.
            @param {Photon.LoadBalancing.RoomInfo[]} roomsRemoved Rooms removed from list.
        */
        onRoomListUpdate(rooms: RoomInfo[], roomsUpdated: RoomInfo[], roomsAdded: RoomInfo[], roomsRemoved: RoomInfo[]) { }

        // TODO: move to Room? Or remove and use Room.onPropertiesChange only?

        /** 
            @summary Called on joined room properties changed event. Override to handle it.
            @method Photon.LoadBalancing.LoadBalancingClient#onMyRoomPropertiesChange
        */
        onMyRoomPropertiesChange() { }        

        /** 
            @summary Called on actor properties changed event. Override to handle it.
            @method Photon.loadbalancing.loadbalancingClient#onActorPropertiesChange
            @param {Photon.LoadBalancing.Actor} actor Actor whose properties were changed.
        */
        onActorPropertiesChange(actor: Actor): void { }         

        /** 
            @summary Called when client joins room. Override to handle it.
            @method Photon.LoadBalancing.LoadBalancingClient#onJoinRoom
        */
        onJoinRoom() { }

        /** 
            @summary Called when new actor joins the room client joined to. Override to handle it.
            @method Photon.LoadBalancing.LoadBalancingClient#onActorJoin
            @param {Photon.LoadBalancing.Actor} actor New actor.
        */
        onActorJoin(actor: Actor) { }

        /** 
            @summary Called when actor leaves the room client joined to. Override to handle it.
            @method Photon.LoadBalancing.LoadBalancingClient#onActorLeave
            @param {Photon.LoadBalancing.Actor} actor Actor left the room.
        */
        onActorLeave(actor: Actor) { }

        /** 
            @summary Override with creation of custom room (extended from Room): { return new CustomRoom(...); }
            @method Photon.LoadBalancing.LoadBalancingClient#roomFactory
            @param {string} name Room name. Pass to super() in custom actor constructor.
        */
        private roomFactory(name: string) { return new Room(name); }
        /** 
            @summary Override with creation of custom actor (extended from Actor): { return new CustomActor(...); }
            @method Photon.LoadBalancing.LoadBalancingClient#actorFactory
            @param {string} name Actor name. Pass to super() in custom room constructor.
            @param {number} actorNr Actor ID. Pass to super() in custom room constructor.
            @param {bool} isLocal Actor is local. Pass to super() in custom room constructor.
        */
        private actorFactory(name: string, actorNr: number, isLocal: bool) { return new Actor(name, actorNr, isLocal); }

        //------------------------

        /** 
            @summary Returns local actor.
            Client always has local actor even if not joined.
            @method Photon.LoadBalancing.LoadBalancingClient#myActor
            @returns {Photon.LoadBalancing.Actor} Local actor.
        */
        public myActor(): Actor { return this._myActor; }

        /** 
            @summary Returns client's room.
            Client always has it's room even if not joined. It's used for room creation operation.
            @method Photon.LoadBalancing.LoadBalancingClient#myRoom
            @returns {Photon.LoadBalancing.Room} Current room.
        */
        public myRoom(): Room { return this.currentRoom; }

        /** 
            @summary Returns actors in room client currently joined including local actor.
            @method Photon.LoadBalancing.LoadBalancingClient#myRoomActors
            @returns {Photon.LoadBalancing.Room[]} Room actors list.
        */
        public myRoomActors() { return this.actors; }

        private roomFactoryInternal(name: string = "") {
            var r = this.roomFactory(name);
            r._setLBC(this);
            return r;
        }
        private actorFactoryInternal(name: string = "", actorId = -1, isLocal = false) {
            var a = this.actorFactory(name, actorId, isLocal);
            a._setLBC(this);
            return a;
        }

        /**
            @classdesc Implements the Photon LoadBalancing workflow. This class should be extended to handle system or custom events and operation responses.
            @constructor Photon.LoadBalancing.LoadBalancingClient
            @param {string} masterServerAddress Master server address:port.
            @param {string} appId Cloud application ID.
            @param {string} appVersion Cloud application version.
        */
        constructor(private masterServerAddress: string, private appId: string, private appVersion: string) {
            this.initValidNextState();
            this.currentRoom = this.roomFactoryInternal("");
            this._myActor = this.actorFactoryInternal("", -1, true);
            this.addActor(this._myActor)
        }

        /** 
            @summary Enables custom authentication and sets it's parameters.
            @method Photon.LoadBalancing.LoadBalancingClient#setCustomAuthentication
            @param {string} authParameters This string must contain any (http get) parameters expected by the used authentication service.
            @param {Photon.LoadBalancing.Constants.CustomAuthenticationType} [authType=Photon.LoadBalancing.Constants.CustomAuthenticationType.Custom] The type of custom authentication provider that should be used.
        */
        public setCustomAuthentication(authParameters: string, authType: number = Photon.LoadBalancing.Constants.CustomAuthenticationType.Custom ) {
            this.userAuthType = authType;
            this.userAuthParameters = authParameters;
        }

        /** 
            @summary Starts connection to master server.
            @method Photon.LoadBalancing.LoadBalancingClient#connect
            @param {bool} [keepMasterConnection=false] Don't disconnect from master server after joining room.
        */
        public connect(keepMasterConnection = false): bool {
            this.reconnectPending = false;
            if (this.checkNextState(LoadBalancingClient.State.ConnectingToMasterserver)) {
                this.changeState(LoadBalancingClient.State.ConnectingToMasterserver);
                this.logger.info("Connecting to Master", this.masterServerAddress);
                this.keepMasterConnection = keepMasterConnection;
                this.masterPeer = new MasterPeer(this, "ws://" + this.masterServerAddress, "");
                this.initMasterPeer(this.masterPeer);
                this.masterPeer.connect();
                return true;
            }
            else {
                return false;
            }
        }

        /** 
            @summary Creates a new room on the server (or fails when the name is already taken). Takes parameters (except name) for new room from myRoom() object. Set them before call.
            @method Photon.LoadBalancing.LoadBalancingClient#createRoomFromMy
            @param {string} [roomName] New room name. Assigned automatically by server if empty or not specified.
        */
        public createRoomFromMy(roomName?: string) {
            this.currentRoom.name = roomName ? roomName : "";
            return this.createRoomInternal(this.masterPeer);
        }

        /** 
            @summary Creates a new room on the server (or fails when the name is already taken).
            @method Photon.LoadBalancing.LoadBalancingClient#createRoom
            @param {string} [roomName] The name to create a room with. Must be unique and not in use or can't be created. If not specified or null, the server will assign a GUID as name.
            @param {bool} [isVisible=true] Shows the room in the lobby's room list.
            @param {bool} [isOpen=false] Keeps players from joining the room (or opens it to everyone).
            @param {number} [maxPlayers=0] Max players before room is considered full (but still listed).
            @param {object} [customGameProperties] Custom properties to apply to the room on creation (use string-typed keys but short ones).
            @param {string} [propsListedInLobby] Defines the custom room properties that get listed in the lobby.
        */
        public createRoom(roomName?: string, isVisible?: bool = true, isOpen?: bool = true, maxPlayers?: number = 0, customGameProperties?: {} = {}, propsListedInLobby?: string[]) {
            this.currentRoom = this.roomFactoryInternal(roomName ? roomName : "");
            this.currentRoom.isVisible = isVisible;
            this.currentRoom.isOpen = isOpen;
            this.currentRoom.maxPlayers = maxPlayers;
            this.currentRoom._customProperties = customGameProperties ? customGameProperties: { };
            this.currentRoom._propsListedInLobby = propsListedInLobby ? propsListedInLobby : [];
            this.currentRoom.onPropertiesChange(customGameProperties);

            return this.createRoomInternal(this.masterPeer);
        }

        /** 
            @summary Joins a room by name and sets this player's properties.
            @method Photon.LoadBalancing.LoadBalancingClient#joinRoom
            @param {string} roomName The name of the room to join. Must be existing already, open and non-full or can't be joined.
        */
        public joinRoom(roomName: string): bool {
            var op = [];

            this.currentRoom = this.roomFactoryInternal(roomName);
            op.push(Constants.ParameterCode.RoomName);
            op.push(roomName);

            this.masterPeer.sendOperation(Constants.OperationCode.JoinGame, op);
            return true;
        }

        /** 
            @summary Joins a random, available room. 
            This operation fails if all rooms are closed or full.
            @method Photon.LoadBalancing.LoadBalancingClient#joinRandomRoom
            @param {object} [expectedCustomRoomProperties] If specified, a room will only be joined, if it matches these custom properties. Use null to accept rooms with any properties.
		    @param {number} [expectedMaxPlayers] If specified, filters for a particular maxPlayer setting. Use 0 to accept any maxPlayer value.
            @param {Photon.LoadBalancing.Constants.MatchmakingMode} [matchmakingMode=MatchmakingMode.FillRoom] Selects one of the available matchmaking algorithms.
        */
        public joinRandomRoom(expectedCustomRoomProperties?: any, expectedMaxPlayers: number = 0, matchingType: number = Constants.MatchmakingMode.FillRoom): bool {
            var op = [];
            if (matchingType != Constants.MatchmakingMode.FillRoom)
            {
                op.push(Constants.ParameterCode.MatchMakingType);
                op.push(matchingType);
            }

            var expectedRoomProperties = {}
            var propNonEmpty = false;
            if (expectedCustomRoomProperties) {
                for (var k in expectedCustomRoomProperties) {
                    expectedRoomProperties[k] = expectedCustomRoomProperties[k];
                    propNonEmpty = true;
                }
            }
            if (expectedMaxPlayers > 0) {
                expectedRoomProperties[Constants.GameProperties.MaxPlayers] = expectedMaxPlayers;
                propNonEmpty = true;
            }
            if (propNonEmpty) {
                op.push(Constants.ParameterCode.GameProperties);
                op.push(expectedRoomProperties);
            }

            this.masterPeer.sendOperation(Constants.OperationCode.JoinRandomGame, op);
            return true;
        }

        _setPropertiesOfRoom(properties: {}) {
            var op = [];
            op.push(Constants.ParameterCode.Properties);
            op.push(properties);
            op.push(Constants.ParameterCode.Broadcast);
            op.push(true);

            this.gamePeer.sendOperation(Constants.OperationCode.SetProperties, op);
        }

        _setPropertiesOfActor(properties: {}) {
            var op = [];
			op.push(Constants.ParameterCode.ActorNr);
			op.push(this.myActor().actorNr);
            op.push(Constants.ParameterCode.Properties);
            op.push(properties);
            op.push(Constants.ParameterCode.Broadcast);
            op.push(true);

            this.gamePeer.sendOperation(Constants.OperationCode.SetProperties, op);
        }

        /** 
            @summary Disconnects from master and game servers.
            @method Photon.LoadBalancing.LoadBalancingClient#disconnect
        */
        public disconnect() {
            if (this.state != LoadBalancingClient.State.Uninitialized) {
                if (this.masterPeer) {
                    this.masterPeer.disconnect();
                }
                if (this.gamePeer) {
                    this.gamePeer.disconnect();
                }
                this.changeState(LoadBalancingClient.State.Disconnecting);
            }
        }

        /** 
            @summary Leaves room and connects to master server if not connected.
            @method Photon.LoadBalancing.LoadBalancingClient#leaveRoom
        */
        public leaveRoom() {
            if (this.isJoinedToRoom()) {
                if (this.gamePeer) {
                    this.reconnectPending = true;
                    this.gamePeer.disconnect();
                }
                this.changeState(LoadBalancingClient.State.Disconnecting);
            }
        }

        /** 
            @summary Raises game custom event
            @method Photon.LoadBalancing.LoadBalancingClient#raiseEvent
            @param {number} eventCode Identifies this type of event (and the content). Your game's event codes can start with 0.
            @param {object} [data] Custom data you want to send along (use null, if none).
            @param {object} [options] Additional options
            @property {object} options Additional options
            @property {number} [options.interestGroup] The ID of the interest group this event goes to (exclusively).
            @property {Photon.LoadBalancing.Constants.EventCaching} [options.cache=EventCaching.DoNotCache] Events can be cached (merged and removed) for players joining later on.
            @property {Photon.LoadBalancing.Constants.ReceiverGroup} [options.receivers=ReceiverGroup.Others] Defines to which group of players the event is passed on.
        */
        public raiseEvent(eventCode: number, data?: any, options?: { interestGroup?: number; cache?: number; receivers?: number; }) {
            if (this.isJoinedToRoom()) {
                this.gamePeer.raiseEvent(eventCode, data, options);
            }
        }

        /** 
            @summary Changes client's interest groups (for events in room).
            First, removing groups is executed. This way, you could leave all groups and join only the ones provided.
            @method Photon.LoadBalancing.LoadBalancingClient#changeGroups
            @param {number[]} groupsToRemove Groups to remove from interest. Null will not leave any. A [] will remove all.
            @param {number[]} groupsToAdd Groups to add to interest. Null will not add any. A [] will add all current.
        */
        public changeGroups(groupsToRemove: number[], groupsToAdd: number[]) {
            if (this.isJoinedToRoom()) {
                this.logger.debug("Group change:", groupsToRemove, groupsToAdd);
                this.gamePeer.changeGroups(groupsToRemove, groupsToAdd);
            }
        }

        /** 
            @summary Checks if client is connected to master server (usually joined to lobby and receives room list updates).
            @method Photon.LoadBalancing.LoadBalancingClient#isConnectedToMaster
            @returns {bool} True if client is connected to master server.
        */
        public isConnectedToMaster() {
            return this.masterPeer && this.masterPeer.isConnected();
        }

        /** 
            @summary Checks if client is in lobby and ready to join or create game.
            @method Photon.LoadBalancing.LoadBalancingClient#isInLobby
            @returns {bool} True if client is in lobby.
        */
        public isInLobby() {
            return this.state == LoadBalancingClient.State.JoinedLobby;
        }

        /** 
            @summary Checks if client is joined to game.
            @method Photon.LoadBalancing.LoadBalancingClient#isJoinedToRoom
            @returns {bool} True if client is joined to game.
        */
        public isJoinedToRoom() {
            return this.state == LoadBalancingClient.State.Joined;
        }

        /**
            @deprecated Use isJoinedToRoom()
        */
        public isConnectedToGame() {
            return this.isJoinedToRoom();
        }

        /** 
            @summary Current room list from master server.
            @method Photon.LoadBalancing.LoadBalancingClient#availableRooms
            @returns {RoomInfo[]} Current room list
        */
        public availableRooms() { return this.roomInfos; }

        /** 
            @summary Sets client logger level
            @method Photon.LoadBalancing.LoadBalancingClient#setLogLevel
            @param {Exitgames.Common.Logger.Level} level Logging level.
        */
        public setLogLevel(level: number) {
            this.logger.setLevel(level);
            if (this.masterPeer) {
                this.masterPeer.setLogLevel(level);
            }
            if (this.gamePeer) {
                this.gamePeer.setLogLevel(level);
            }
        }
        //------------------------

        private masterPeer: MasterPeer;
        private keepMasterConnection = false;
        private reconnectPending = false; // reconnects to master after disconnection from game if this flag set
        private gamePeer: GamePeer;
        private currentRoom: Room;
        private roomInfos = new RoomInfo[];
        private _myActor: Actor;
        private actors = {};
        private addActor(a: Actor) { this.actors[a.actorNr] = a; }

        private userAuthType = Constants.CustomAuthenticationType.None;
        private userAuthParameters = "";
        private userAuthSecret = "";

        private state = LoadBalancingClient.State.Uninitialized;
        private logger = new Exitgames.Common.Logger("LoadBalancingClient");

        private changeState(nextState: number) {
            this.logger.info("State:", LoadBalancingClient.StateToName(this.state), "->", LoadBalancingClient.StateToName(nextState));
            this.state = nextState;
            this.onStateChange(nextState);
        }

        private createRoomInternal(peer: PhotonPeer) {
            var gp = {};
            gp[Constants.GameProperties.IsOpen] = this.currentRoom.isOpen;
            gp[Constants.GameProperties.IsVisible] = this.currentRoom.isVisible;
            if (this.currentRoom.maxPlayers > 0) {
                gp[Constants.GameProperties.MaxPlayers] = this.currentRoom.maxPlayers;
            }
            if (this.currentRoom._propsListedInLobby && this.currentRoom._propsListedInLobby.length > 0) {
                gp[Constants.GameProperties.PropsListedInLobby] = this.currentRoom._propsListedInLobby;
            }
            for (var p in this.currentRoom._customProperties) {
                gp[p] = this.currentRoom._customProperties[p];
            }
            var op = [];
            if (this.currentRoom.name) {
                op.push(Constants.ParameterCode.RoomName);
                op.push(this.currentRoom.name);
            }
            op.push(Constants.ParameterCode.GameProperties);
            op.push(gp);
            op.push(Constants.ParameterCode.CleanupCacheOnLeave);
            op.push(true);  //TODO: make this optional?
            op.push(Constants.ParameterCode.Broadcast);
            op.push(true);  //TODO: make this optional?
            if (peer === this.gamePeer) {
                op.push(Constants.ParameterCode.PlayerProperties);
                op.push(this._myActor._getAllProperties());
            }

            peer.sendOperation(Constants.OperationCode.CreateGame, op);
        }

        private initMasterPeer(mp: MasterPeer) {
            mp.setLogLevel(this.logger.getLevel());

            // errors
            mp.addPeerStatusListener(PhotonPeer.StatusCodes.error, () => {
                this.changeState(LoadBalancingClient.State.Error);
                this.onError(LoadBalancingClient.PeerErrorCode.MasterError, "Master peer error");
            });
            mp.addPeerStatusListener(PhotonPeer.StatusCodes.connectFailed, () => {
                this.changeState(LoadBalancingClient.State.Error);
                this.onError(LoadBalancingClient.PeerErrorCode.MasterConnectFailed, "Master peer connect failed: " + this.masterServerAddress);
            });
            mp.addPeerStatusListener(PhotonPeer.StatusCodes.timeout, () => {
                this.changeState(LoadBalancingClient.State.Error);
                this.onError(LoadBalancingClient.PeerErrorCode.MasterTimeout, "Master peer error timeout");
            });
            mp.addPeerStatusListener(PhotonPeer.StatusCodes.connecting, () => {
            });

            // status
            mp.addPeerStatusListener(PhotonPeer.StatusCodes.connect, () => {
                mp._logger.info("Connected");
                //TODO: encryption phase
                var op = [];
                op.push(Constants.ParameterCode.ApplicationId);
                op.push(this.appId);
                op.push(Constants.ParameterCode.AppVersion);
                op.push(this.appVersion);
                if (this.userAuthType != Constants.CustomAuthenticationType.None) {
                    op.push(Constants.ParameterCode.ClientAuthenticationType);
                    op.push(this.userAuthType);
                    op.push(Constants.ParameterCode.ClientAuthenticationParams);
                    op.push(this.userAuthParameters);
                }
                mp.sendOperation(Constants.OperationCode.Authenticate, op);
                mp._logger.info("Authenticate...");
            });
            mp.addPeerStatusListener(PhotonPeer.StatusCodes.disconnect, () => {
                mp._logger.info("Disconnected");
            });
            mp.addPeerStatusListener(PhotonPeer.StatusCodes.connectClosed, () => {
                mp._logger.info("Server closed connection");
				this.changeState(LoadBalancingClient.State.Error);
				this.onError(LoadBalancingClient.PeerErrorCode.MasterConnectClosed, "Master server closed connection");
            });
            //events
            mp.addEventListener(Constants.EventCode.GameList, (data) => {
                var gameList: Object = data.vals[Constants.ParameterCode.GameList];
                this.roomInfos = new RoomInfo[];
                for (var g in gameList) {
                    var r = new RoomInfo(g);
                    r._updateFromProps(gameList[g]);
                    this.roomInfos.push(r);

                }
                this.onRoomList(this.roomInfos);
                mp._logger.debug("ev GameList", this.roomInfos, gameList);

            });
            mp.addEventListener(Constants.EventCode.GameListUpdate, (data) => {
                var gameList: Object = data.vals[Constants.ParameterCode.GameList];
                var roomsUpdated = new RoomInfo[];
                var roomsAdded = new RoomInfo[];
                var roomsRemoved = new RoomInfo[];
                for (var g in gameList) {
                    var exist = this.roomInfos.filter((x) => x.name == g);
                    if (exist.length > 0) {
                        var r = exist[0];
                        r._updateFromProps(gameList[g]);
                        if (r.removed) {
                            roomsRemoved.push(r);
                        }
                        else {
                            roomsUpdated.push(r);
                        }
                    }
                    else {
                        var r = new RoomInfo(g);
                        r._updateFromProps(gameList[g]);
                        this.roomInfos.push(r);
                        roomsAdded.push(r);
                    }
                }
                this.roomInfos = this.roomInfos.filter((x) => !x.removed);
                this.onRoomListUpdate(this.roomInfos, roomsUpdated, roomsAdded, roomsRemoved);
                mp._logger.debug("ev GameListUpdate:", this.roomInfos, "u:", roomsUpdated, "a:", roomsAdded, "r:", roomsRemoved, gameList);

            });

            // responses - check operation result: data.errCode
            mp.addResponseListener(Constants.OperationCode.Authenticate, (data) => {
                mp._logger.debug("resp Authenticate", data);
                if (!data.errCode) {
                    mp._logger.info("Authenticated");
                    this.userAuthSecret = data.vals[Constants.ParameterCode.Secret];
                    this.changeState(LoadBalancingClient.State.ConnectedToMaster);
                    mp.sendOperation(Constants.OperationCode.JoinLobby);
                    mp._logger.info("Join Lobby...");
                }
                else {
                    this.changeState(LoadBalancingClient.State.Error);
                    this.onError(LoadBalancingClient.PeerErrorCode.MasterAuthenticationFailed, "Master authentication failed");
                }
            });
            mp.addResponseListener(Constants.OperationCode.JoinLobby, (data) => {
                mp._logger.debug("resp JoinLobby", data);
                if (!data.errCode) {
                    mp._logger.info("Joined to Lobby");
                    this.changeState(LoadBalancingClient.State.JoinedLobby);
                }
                this._onOperationResponseInternal2(Constants.OperationCode.JoinLobby, data);
            });
            mp.addResponseListener(Constants.OperationCode.CreateGame, (data) => {
                mp._logger.debug("resp CreateGame", data);
                if (!data.errCode) {
                    this.currentRoom._updateFromMasterResponse(data.vals);
                    mp._logger.debug("Created/Joined " + this.currentRoom.name);
                    this.connectToGameServer(true);
                }

                this._onOperationResponseInternal2(Constants.OperationCode.CreateGame, data);
            });
            mp.addResponseListener(Constants.OperationCode.JoinGame, (data) => {
                mp._logger.debug("resp JoinGame", data);
                if (!data.errCode) {
                    this.currentRoom._updateFromMasterResponse(data.vals);
                    mp._logger.debug("Joined " + this.currentRoom.name);
                    this.connectToGameServer(false);
                }

                this._onOperationResponseInternal2(Constants.OperationCode.JoinGame, data);
            });
            mp.addResponseListener(Constants.OperationCode.JoinRandomGame, (data) => {
                mp._logger.debug("resp JoinRandomGame", data);
                if (!data.errCode) {
                    this.currentRoom._updateFromMasterResponse(data.vals);
                    mp._logger.debug("Joined " + this.currentRoom.name);                   
                    this.connectToGameServer(false);
                }

                this._onOperationResponseInternal2(Constants.OperationCode.JoinRandomGame, data);
            });
        }

        private connectToGameServer(createGame: bool): bool {
            if (!this.keepMasterConnection) {
                this.masterPeer.disconnect();
            }
            if (this.checkNextState(LoadBalancingClient.State.ConnectingToGameserver)) {
                this.logger.info("Connecting to Game", this.currentRoom.address);
                this.gamePeer = new GamePeer(this, "ws://" + this.currentRoom.address, "");
                this.initGamePeer(this.gamePeer, createGame);
                if (!this.keepMasterConnection) {
                    this.masterPeer.disconnect();
                }
                this.gamePeer.connect();
                this.changeState(LoadBalancingClient.State.ConnectingToGameserver);
                return true;
            }
            else {
                return false;
            }
        }
        private initGamePeer(gp: GamePeer, createGame: bool) {
            gp.setLogLevel(this.logger.getLevel());

            // errors
            gp.addPeerStatusListener(PhotonPeer.StatusCodes.error, () => {
                this.changeState(LoadBalancingClient.State.Error);
                this.onError(LoadBalancingClient.PeerErrorCode.GameError, "Game peer error");
            });
            gp.addPeerStatusListener(PhotonPeer.StatusCodes.connectFailed, () => {
                this.changeState(LoadBalancingClient.State.Error);
                this.onError(LoadBalancingClient.PeerErrorCode.GameConnectFailed, "Game peer connect failed: " + this.currentRoom.address);
            });
            gp.addPeerStatusListener(PhotonPeer.StatusCodes.timeout, () => {
                this.changeState(LoadBalancingClient.State.Error);
                this.onError(LoadBalancingClient.PeerErrorCode.GameTimeout, "Game peer timeout");
            });

            // status
            gp.addPeerStatusListener(PhotonPeer.StatusCodes.connect, () => {
                gp._logger.info("Connected");
                //TODO: encryption phase
                var op = [];
                op.push(Constants.ParameterCode.ApplicationId);
                op.push(this.appId);
                op.push(Constants.ParameterCode.AppVersion);
                op.push(this.appVersion);
                if (this.userAuthType != Constants.CustomAuthenticationType.None) {
                    op.push(Constants.ParameterCode.ClientAuthenticationType);
                    op.push(this.userAuthType);
                    op.push(Constants.ParameterCode.Secret);
                    op.push(this.userAuthSecret);
                }

                gp.sendOperation(Constants.OperationCode.Authenticate, op);
                gp._logger.info("Authenticate...");
            });
            gp.addPeerStatusListener(PhotonPeer.StatusCodes.disconnect, () => {
				for (var i in this.actors) {
					this.onActorLeave(this.actors[i]);
				}
				this.actors = {};
				this.addActor(this._myActor);
				gp._logger.info("Disconnected");
				
				if (this.masterPeer && this.masterPeer.isConnected()) {
				    this.changeState(LoadBalancingClient.State.JoinedLobby);
				}
				else {
				    this.changeState(LoadBalancingClient.State.Disconnected);
				    if (this.reconnectPending) {
				        this.connect(this.keepMasterConnection);
				    }
				}

            });
            gp.addPeerStatusListener(PhotonPeer.StatusCodes.connectClosed, () => {
                gp._logger.info("Server closed connection");
				this.changeState(LoadBalancingClient.State.Error);				
				this.onError(LoadBalancingClient.PeerErrorCode.MasterConnectClosed, "Game server closed connection");
            });

            // responses
            gp.addResponseListener(Constants.OperationCode.Authenticate, (data) => {
                gp._logger.debug("resp Authenticate", data);
                if (!data.errCode) {
                    gp._logger.info("Authenticated");
                    gp._logger.info("Connected");
                    if (createGame) {
                        this.createRoomInternal(gp);
                    }
                    else {
                        var op = [];
                        op.push(Constants.ParameterCode.RoomName);
                        op.push(this.currentRoom.name);

                        op.push(Constants.ParameterCode.Broadcast);
                        op.push(true);

                        op.push(Constants.ParameterCode.PlayerProperties);
                        op.push(this._myActor._getAllProperties());

                        gp.sendOperation(Constants.OperationCode.JoinGame, op);
                    }
                    this.changeState(LoadBalancingClient.State.ConnectedToGameserver);
                }
                else {
                    this.changeState(LoadBalancingClient.State.Error);
                    this.onError(LoadBalancingClient.PeerErrorCode.GameAuthenticationFailed, "Game authentication failed");
                }
            });
            gp.addResponseListener(Constants.OperationCode.CreateGame, (data) => {
                gp._logger.debug("resp CreateGame", data);
                if (!data.errCode) {
                    this._myActor._updateMyActorFromResponse(data.vals);
                    gp._logger.info("myActor: ", this._myActor);

                    this.actors = {};
                    this.addActor(this._myActor);

                    this.changeState(LoadBalancingClient.State.Joined);
                    this.onJoinRoom();
                }

                this._onOperationResponseInternal2(Constants.OperationCode.CreateGame, data);
            });
            gp.addResponseListener(Constants.OperationCode.JoinGame, (data) => {
                gp._logger.debug("resp JoinGame", data);
                if (!data.errCode) {
                    this._myActor._updateMyActorFromResponse(data.vals);
                    gp._logger.info("myActor: ", this._myActor);
                    this.currentRoom._updateFromProps(data.vals[Constants.ParameterCode.GameProperties]);

                    this.actors = {};
                    this.addActor(this._myActor);
                    var actorList = data.vals[Constants.ParameterCode.PlayerProperties];
                    for (var k in actorList) {
                        var a = this.actorFactoryInternal(actorList[k][Constants.ActorProperties.PlayerName], parseInt(k));
						a._updateCustomProperties(actorList[k]);
                        this.addActor(a);
                    }

                    this.changeState(LoadBalancingClient.State.Joined);
                    this.onJoinRoom();
                }

                this._onOperationResponseInternal2(Constants.OperationCode.JoinGame, data);
            });
            gp.addResponseListener(Constants.OperationCode.SetProperties, (data) => {
                gp._logger.debug("resp SetProperties", data);
//                if (!data.errCode) { }

                this._onOperationResponseInternal2(Constants.OperationCode.SetProperties, data);
            });

            // events
            gp.addEventListener(Constants.EventCode.Join, (data) => {
                gp._logger.debug("ev Join", data);
                if (Actor._getActorNrFromResponse(data.vals) === this._myActor.actorNr) {
                    this._myActor._updateMyActorFromResponse(data.vals);
                    this.addActor(this._myActor);
                }
                else {
                    var actor = this.actorFactoryInternal();
                    actor._updateFromResponse(data.vals);
                    this.addActor(actor);
                    this.onActorJoin(actor);
                }
            });
            gp.addEventListener(Constants.EventCode.Leave, (data) => {
                gp._logger.debug("ev Leave", data);
                var actorNr = Actor._getActorNrFromResponse(data.vals);
                if (actorNr && this.actors[actorNr]) {
                    var a = this.actors[actorNr];
                    delete this.actors[actorNr];
                    this.onActorLeave(a);
                }
            });
            gp.addEventListener(Constants.EventCode.PropertiesChanged, (data) => {
                gp._logger.debug("ev PropertiesChanged", data);
                var targetActorNr = data.vals[Constants.ParameterCode.TargetActorNr];
                if (targetActorNr !== undefined && targetActorNr > 0) {
					if (this.actors[targetActorNr] !== undefined) {
						var actor = this.actors[targetActorNr];
						actor._updateCustomProperties(data.vals[Constants.ParameterCode.Properties]);
                        this.onActorPropertiesChange(actor);
					}
				}
				else {
					this.currentRoom._updateFromProps(data.vals, data.vals[Constants.ParameterCode.Properties]);
                    this.onMyRoomPropertiesChange();
				}
            });
        }
        private _onOperationResponseInternal2(code: number, data: any) {
            this.onOperationResponse(data.errCode, data.errMsg, code, data.vals);
        }

        private validNextState = {};
        //TODO: ugly way to init const table
        private initValidNextState() {
            this.validNextState[LoadBalancingClient.State.Error] = [LoadBalancingClient.State.ConnectingToMasterserver];
            this.validNextState[LoadBalancingClient.State.Uninitialized] = [LoadBalancingClient.State.ConnectingToMasterserver];
            this.validNextState[LoadBalancingClient.State.Disconnected] = [LoadBalancingClient.State.ConnectingToMasterserver];
            this.validNextState[LoadBalancingClient.State.ConnectedToMaster] = [LoadBalancingClient.State.JoinedLobby];
            this.validNextState[LoadBalancingClient.State.JoinedLobby] = [LoadBalancingClient.State.ConnectingToGameserver];
            this.validNextState[LoadBalancingClient.State.ConnectingToGameserver] = [LoadBalancingClient.State.ConnectedToGameserver];
            this.validNextState[LoadBalancingClient.State.ConnectedToGameserver] = [LoadBalancingClient.State.Joined];
        }
        private checkNextState(nextState: number, dontThrow: bool = false) {
            var valid: number[] = this.validNextState[this.state];
            var res = valid && valid.indexOf(nextState) >= 0;
            if (res || dontThrow) {
                return res;
            }
            else {
                throw new Error("LoadBalancingPeer checkNextState fail: " + LoadBalancingClient.StateToName(this.state) + " -> " + LoadBalancingClient.StateToName(nextState));
            }
        }

        // tsc looses all comments after first static member 
        // jsdoc reads comments from any place within class (and may be from any place in file)
        /**
            @summary Enum for client master and game peers error codes.
            @member Photon.LoadBalancing.LoadBalancingClient.PeerErrorCode
            @readonly
            @property {number} Ok No Error.
            @property {number} MasterError General master server peer error.
            @property {number} MasterConnectFailed Master server connection error.
            @property {number} MasterConnectClosed Disconnected from master server.</p>
            @property {number} MasterDisconnect Disconnected from master server.
            @property {number} MasterTimeout Disconnected from master server for timeout.
            @property {number} MasterAuthenticationFailed Master server authentication failed.
            @property {number} GameError General game server peer error.
            @property {number} GameConnectFailed Game server connection error.
            @property {number} GameConnectClosed Disconnected from game server.
            @property {number} GameDisconnect Disconnected from game server.
            @property {number} GameTimeout Disconnected from game server for timeout.
            @property {number} GameAuthenticationFailed Game server authentication failed.
         */
        /**
            @summary Enum for client states.
            @member Photon.LoadBalancing.LoadBalancingClient.State
            @readonly
            @property {number} Error Critical error occurred.
            @property {number} Uninitialized Peer is created but not used yet.
            @property {number} ConnectingToMasterserver Connecting to master (includes connect, authenticate and joining the lobby).
            @property {number} ConnectedToMaster Connected to master server.
            @property {number} JoinedLobby Connected to master and joined lobby. Display room list and join/create rooms at will.
            @property {number} ConnectingToGameserver Connecting to game server(client will authenticate and join/create game).
            @property {number} ConnectedToGameserver Connected to gameserver (going to auth and join game).
            @property {number} Joined The client joined room.
            @property {number} Disconnecting The client disconnects (from any server).
            @property {number} Disconnected The client is no longer connected (to any server). Connect to master to go on.
        */
        /** 
            @summary Converts LoadBalancingClient.State element to string name.
            @method Photon.LoadBalancing.LoadBalancingClient.StateToName
            @param {LoadBalancingClient.State} state Client state enum element.
            @returns {string} Specified element name or "undefined" if not found.
        */
        static public PeerErrorCode = {
            Ok: 0,
            MasterError: 1001,
            MasterConnectFailed: 1002,
            MasterConnectClosed: 1003,
            MasterTimeout: 1004,
            MasterAuthenticationFailed: 1101,
            GameError: 2001,
            GameConnectFailed: 2002,
            GameConnectClosed: 2003,
            GameTimeout: 2004,
            GameAuthenticationFailed: 2101,
        };
        static public State = {
            Error: -1,
            Uninitialized: 0,
            ConnectingToMasterserver: 1,
            ConnectedToMaster: 2,
            JoinedLobby: 3,
            ConnectingToGameserver: 4,
            ConnectedToGameserver: 5,
            Joined: 6,
            Disconnecting: 7,
            Disconnected: 8,
        };

        static public StateToName(value: number) { return Exitgames.Common.Util.enumValueToName(LoadBalancingClient.State, value); }

    }

    //TODO: internal
    export class MasterPeer extends PhotonPeer {
        constructor(private client: LoadBalancingClient, url: string, subprotocol: string) { super(url, subprotocol, "Master") }

        // overrides
        onUnhandledEvent(code: number, args: any) {
            this.client.onEvent(code, args.vals[Constants.ParameterCode.CustomEventContent], args.vals[Constants.ParameterCode.ActorNr]);
        }
        // overrides
        onUnhandledResponse(code: number, args: any) {
            this.client.onOperationResponse(args.errCode, args.errMsg, code, args.vals);
        }
    }

    //TODO: internal
    export class GamePeer extends PhotonPeer {
        constructor(private client: LoadBalancingClient, url: string, subprotocol: string) {
            super(url, subprotocol, "Game");
        }

        // overrides
        onUnhandledEvent(code: number, args: any) {
            this.client.onEvent(code, args.vals[Constants.ParameterCode.CustomEventContent], args.vals[Constants.ParameterCode.ActorNr]);
        }
        // overrides
        onUnhandledResponse(code: number, args: any) {
            this.client.onOperationResponse(args.errCode, args.errMsg, code, args.vals);
        }

        raiseEvent(eventCode: number, data?: any, options?: { interestGroup?: number; cache?: number; receivers?: number; }) {
            if (this.client.isJoinedToRoom()) {
                this._logger.debug("raiseEvent", eventCode, data, options);
                var params = [Constants.ParameterCode.Code, eventCode, Constants.ParameterCode.Data, data];
                if (options) {
                    if (options.receivers != undefined && options.receivers !== Constants.ReceiverGroup.Others) {
                        params.push(Constants.ParameterCode.ReceiverGroup);
                        params.push(options.receivers);
                    }
                    if (options.cache != undefined && options.cache !== Constants.EventCaching.DoNotCache) {
                        params.push(Constants.ParameterCode.Cache);
                        params.push(options.cache);
                    }
                    if (options.interestGroup != undefined) {
                        if (this.checkGroupNumber(options.interestGroup)) {
                            params.push(Constants.ParameterCode.Group);
                            params.push(options.interestGroup);
                        }
                        else {
                            throw new Error("raiseEvent - Group not a number: " + options.interestGroup);
                        }
                    }
                }
                this.sendOperation(Constants.OperationCode.RaiseEvent, params);
            } else {
                throw new Error("raiseEvent - Not joined!");
            }
        }

        changeGroups(groupsToRemove: number[], groupsToAdd: number[]) {
            var params = [];
            if (groupsToRemove != null && groupsToRemove != undefined) {
                this.checkGroupArray(groupsToRemove, "groupsToRemove");
                params.push(Constants.ParameterCode.Remove);
                params.push(groupsToRemove);
            }
            if (groupsToAdd != null && groupsToAdd != undefined) {
                this.checkGroupArray(groupsToAdd, "groupsToAdd");
                params.push(Constants.ParameterCode.Add);
                params.push(groupsToAdd);
            }
            this.sendOperation(Constants.OperationCode.ChangeGroups, params);
        }

        private checkGroupNumber(g: number) {
            return !(typeof (g) != "number" || isNaN(g) || g === Infinity || g === -Infinity);
        }
        private checkGroupArray(groups: number[], groupsName) {
            if (Exitgames.Common.Util.isArray(groups)) {
                for (var i = 0; i < groups.length; ++i) {
                    var g = groups[i];
                    if (this.checkGroupNumber(g)) {
                    }
                    else {
                        throw new Error("changeGroups - " + groupsName + " (" + groups + ") not an array of numbers: element " + i + " = " + g);
                    }
                }
            }
            else {
                throw new Error("changeGroups - groupsToRemove not an array: " + groups);
            }
        }
    }


}