/**
Photon
@namespace Photon
*/
module Photon {
    class PhotonPeer {
        private url;
        private subprotocol;
        /**
        @classdesc Instances of the PhotonPeer class are used to connect to a Photon server and communicate with it.
        A PhotonPeer instance allows communication with the Photon Server, which in turn distributes messages to other PhotonPeer clients.
        An application can use more than one PhotonPeer instance, which are treated as separate users on the server.
        Each should have its own listener instance, to separate the operations, callbacks and events.
        @constructor Photon.PhotonPeer
        @param {string} url Server address:port.
        @param {string} [subprotocol=""] WebSocket protocol.
        @param {string} [debugName=""] Log messages prefixed with this value.
        */
        constructor(url: string, subprotocol?: string, debugName?: string);
        /**
        @summary Peer sends 'keep alive' message to server as this timeout exceeded after last send operation.
        Set it < 1000 to disable 'keep alive' operation
        @member Photon.PhotonPeer#keepAliveTimeoutMs
        @type {number}
        @default 5000
        */
        public keepAliveTimeoutMs: number;
        /**
        @summary Checks if peer is connecting.
        @method Photon.PhotonPeer#isConnecting
        @returns {bool} True if peer is connecting.
        */
        public isConnecting(): bool;
        /**
        @summary Checks if peer is connected.
        @method Photon.PhotonPeer#isConnected
        @returns {bool} True if peer is connected.
        */
        public isConnected(): bool;
        /**
        @summary Checks if peer is closing.
        @method Photon.PhotonPeer#isClosing
        @returns {bool} True if peer is closing.
        */
        public isClosing(): bool;
        /**
        @summary Starts connection to server.
        @method Photon.PhotonPeer#connect
        */
        public connect(): void;
        /**
        @summary Disconnects from server.
        @method Photon.PhotonPeer#disconnect
        */
        public disconnect(): void;
        /**
        @summary Sends operation to the Photon Server.
        @method Photon.PhotonPeer#sendOperation
        @param {number} code Code of operation.
        @param {object} [data] Parameters of operation as key-value pairs.
        @param {bool} [sendReliable=false] Selects if the operation must be acknowledged or not. If false, the operation is not guaranteed to reach the server.
        @param {number} [channelId=0] The channel in which this operation should be sent.
        */
        public sendOperation(code: number, data?: any, sendReliable?: bool, channelId?: number): void;
        /**
        @summary Registers listener for peer status change.
        @method Photon.PhotonPeer#addPeerStatusListener
        @param {PhotonPeer.StatusCodes} statusCode Status change to this value will be listening.
        @param {Function} callback The listener function that processes the status change. This function don't accept any parameters.
        */
        public addPeerStatusListener(statusCode: string, callback: () => void): void;
        /**
        @summary Registers listener for custom event.
        @method Photon.PhotonPeer#addEventListener
        @param {number} eventCode Custom event code.
        @param {Function} callback The listener function that processes the event. This function may accept object with event content.
        */
        public addEventListener(eventCode: number, callback: (any: any) => void): void;
        /**
        @summary Registers listener for operation response.
        @method Photon.PhotonPeer#addResponseListener
        @param {number} operationCode Operation code.
        @param {Function} callback The listener function that processes the event. This function may accept object with operation response content.
        */
        public addResponseListener(operationCode: number, callback: (any: any) => void): void;
        /**
        @summary Removes listener if exists for peer status change.
        @method Photon.PhotonPeer#removePeerStatusListener
        @param {string} statusCode One of PhotonPeer.StatusCodes to remove listener for.
        @param {Function} callback Listener to remove.
        */
        public removePeerStatusListener(statusCode: string, callback: Function): void;
        /**
        @summary Removes listener if exists for custom event.
        @method Photon.PhotonPeer#removeEventListener
        @param {number} eventCode Event code to remove to remove listener for.
        @param {Function} callback Listener to remove.
        */
        public removeEventListener(eventCode: number, callback: Function): void;
        /**
        @summary Removes listener if exists for operation response.
        @method Photon.PhotonPeer#removeResponseListener
        @param {number} operationCode Operation code to remove listener for.
        @param {Function} callback Listener to remove.
        */
        public removeResponseListener(operationCode: number, callback: Function): void;
        /**
        @summary Removes all listeners for peer status change specified.
        @method Photon.PhotonPeer#removePeerStatusListenersForCode
        @param {string} statusCode One of PhotonPeer.StatusCodes to remove all listeners for.
        */
        public removePeerStatusListenersForCode(statusCode: string): void;
        /**
        @summary Removes all listeners for custom event specified.
        @method Photon.PhotonPeer#removeEventListenersForCode
        @param {number} eventCode Event code to remove all listeners for.
        */
        public removeEventListenersForCode(eventCode: number): void;
        /**
        @summary Removes all listeners for operation response specified.
        @method Photon.PhotonPeer#removeResponseListenersForCode
        @param {number} operationCode Operation code to remove all listeners for.
        */
        public removeResponseListenersForCode(operationCode: number): void;
        /**
        @summary Sets peer logger level.
        @method Photon.PhotonPeer#setLogLevel
        @param {Exitgames.Common.Logger.Level} level Logging level.
        */
        public setLogLevel(level: number): void;
        /**
        @summary Called if no listener found for received custom event.
        Override to relay unknown event to user's code or handle known events without listener registration.
        @method Photon.PhotonPeer#onUnhandledEvent
        @param {number} eventCode Code of received event.
        @param {object} [args] Content of received event or empty object.
        */
        public onUnhandledEvent(eventCode: number, args: any): void;
        /**
        @summary Called if no listener found for received operation response event.
        Override to relay unknown response to user's code or handle known responses without listener registration.
        @method Photon.PhotonPeer#onUnhandledEvent
        @param {number} operationCode Code of received response.
        @param {object} [args] Content of received response or empty object.
        */
        public onUnhandledResponse(operationCode: number, args: any): void;
        /**
        @summary Enum for peer status codes.
        Use to subscribe to status changes.
        @member Photon.PhotonPeer.StatusCodes
        @readonly
        @property {string} connecting Is connecting to server.
        @property {string} connect Connected to server.
        @property {string} connectFailed Connection to server failed.
        @property {string} disconnect Disconnected from server.
        @property {string} connectClosed Connection closed by server.
        @property {string} error General connection error.
        @property {string} timeout Disconnected from server for timeout.
        */
        static StatusCodes: {
            connecting: string;
            connect: string;
            connectFailed: string;
            disconnect: string;
            connectClosed: string;
            error: string;
            timeout: string;
        };
        public _dispatchEvent(code: number, args: any): void;
        public _dispatchResponse(code: number, args: any): void;
        public _logger: Exitgames.Common.Logger;
        private _socket;
        private _frame;
        private _sessionid;
        private _isConnecting;
        private _isConnected;
        private _isClosing;
        private _peerStatusListeners;
        private _eventListeners;
        private _responseListeners;
        private _stringify(message);
        private _encode(messages);
        private _decode(data);
        private _onMessage(message);
        private keepAliveTimer;
        private resetKeepAlive();
        private _send(data, checkConnected?);
        private _onMessageReceived(message);
        private _parseMessageValuesArrayToJSON(vals);
        private _parseEvent(code, event);
        private _parseResponse(code, response);
        private _parseInternalResponse(code, response);
        private _onConnecting();
        private _onConnect();
        private _onConnectFailed(evt);
        private _onDisconnect();
        private _onTimeout();
        private _onError(ev);
        private _addListener(listeners, code, callback);
        private _dispatch(listeners, code, args, debugType);
        private _dispatchPeerStatus(code);
        private _removeListener(listeners, code, callback);
        private _removeListenersForCode(listeners, code);
    }
}
/**
Exitgames utilities
@namespace Exitgames.Common
*/
module Exitgames.Common {
    class Logger {
        private prefix;
        private level;
        /**
        @classdesc Logger with ability to control logging level.
        Prints messages to browser console.
        Each logging method perfoms toString() calls and default formatting of arguments only after it checks logging level. Therefore disabled level logging method call with plain arguments doesn't involves much overhead.
        But if one prefer custom formatting or some calculation for logging methods arguments he should check logging level before doing this to avoid unnecessary operations:
        if(logger.isLevelEnabled(Logger.Level.DEBUG)) {
        logger.debug("", someCall(x, y), x + "," + y);
        }
        @constructor Exitgames.Common.Logger
        @param {string} [prefix=""] All log messages will be prefixed with that.
        @param {Exitgames.Common.Logger.Level} [level=Level.INFO] Initial logging level.
        */
        constructor(prefix?: string, level?: number);
        /**
        @summary Changes current logging level.
        @method Exitgames.Common.Logger#setLevel
        @param {Exitgames.Common.Logger.Level} level New logging level.
        */
        public setLevel(level: number): void;
        /**
        @summary Checks if logging level active.
        @method Exitgames.Common.Logger#isLevelEnabled
        @param {Exitgames.Common.Logger.Level} level Level to check.
        @returns {bool} True if level active.
        */
        public isLevelEnabled(level: number): bool;
        /**
        @summary Returns current logging level.
        @method Exitgames.Common.Logger#getLevel
        @returns {Exitgames.Common.Logger.Level} Current logging level.
        */
        public getLevel(): number;
        /**
        @summary Logs message if logging level = DEBUG, INFO, WARN, ERROR
        @method Exitgames.Common.Logger#debug
        @param {string} mess Message to log.
        @param {...any} optionalParams For every additional parameter toString() applies and result added to the end of log message after space character.
        */
        public debug(mess: string, ...optionalParams: any[]): void;
        /**
        @summary Logs message if logging level = INFO, WARN, ERROR
        @method Exitgames.Common.Logger#info
        @param {string} mess Message to log.
        @param {...any} optionalParams For every additional parameter toString() applies and result added to the end of log message after space character.
        */
        public info(mess: string, ...optionalParams: any[]): void;
        /**
        @summary Logs message if logging level = WARN, ERROR
        @method Exitgames.Common.Logger#warn
        @param {string} mess Message to log.
        @param {...any} optionalParams For every additional parameter toString() applies and result added to the end of log message after space character.
        */
        public warn(mess: string, ...optionalParams: any[]): void;
        /**
        @summary Logs message if logging level = ERROR
        @method Exitgames.Common.Logger#error
        @param {string} mess Message to log.
        @param {...any} optionalParams For every additional parameter toString() applies and result added to the end of log message after space character.
        */
        public error(mess: string, ...optionalParams: any[]): void;
        /**
        @summary Applies default logger formatting to arguments
        @method Exitgames.Common.Logger#format
        @param {string} mess String to start formatting with.
        @param {...any} optionalParams For every additional parameter toString() applies and result added to the end of formatted string after space character.
        @returns {string} Formatted string.
        */
        public format(mess: string, ...optionalParams: any[]): string;
        /**
        @summary Applies default logger formatting to array of objects.
        @method Exitgames.Common.Logger#format
        @param {string} mess String to start formatting with.
        @param {any[]} optionalParams For every additional parameter toString() applies and result added to the end of formatted string after space character.
        @returns {string} Formatted string.
        */
        public formatArr(mess: string, optionalParams: any[]): string;
        /**
        @summary Logging levels. Set to restrict log output.
        @member Exitgames.Common.Logger.Level
        @readonly
        @property {number} DEBUG All logging methods enabled.
        @property {number} INFO info(...), warn(...), error(...) methods enabled.
        @property {number} WARN warn(...) and error(...) methods enabled.
        @property {number} ERROR Only error(...) method enabled.
        @property {number} OFF Logging off.
        */
        static Level: {
            DEBUG: number;
            INFO: number;
            WARN: number;
            ERROR: number;
            OFF: number;
        };
        private static log_types;
        private log(level, msg, optionalParams);
        private format0(msg, optionalParams);
    }
    class Util {
        static indexOf(arr, item, from);
        static isArray(obj): bool;
        static merge(target, additional): void;
        static getPropertyOrElse(obj: any, prop: string, defaultValue: any);
        static enumValueToName(enumObj: any, value: number): string;
    }
}
module Photon.Lite.Constants {
    var LiteOpKey: {
        ActorList: number;
        ActorNr: number;
        ActorProperties: number;
        Add: number;
        Broadcast: number;
        Cache: number;
        Code: number;
        Data: number;
        GameId: number;
        GameProperties: number;
        Group: number;
        Properties: number;
        ReceiverGroup: number;
        Remove: number;
        TargetActorNr: number;
    };
    var LiteEventCode: {
        Join: number;
        Leave: number;
        PropertiesChanged: number;
    };
    var LiteOpCode: {
        ChangeGroups: number;
        GetProperties: number;
        Join: number;
        Leave: number;
        RaiseEvent: number;
        SetProperties: number;
    };
}
/**
Photon Lite API
@namespace Photon.Lite
*/
module Photon.Lite {
    class LitePeer extends PhotonPeer {
        /**
        @classdesc Extends PhotonPeer and implements the operations offered by the "Lite" Application of the Photon Server SDK.
        @constructor Photon.Lite.LitePeer
        @param {string} url Server address:port.
        @param {string} [subprotocol=""] WebSocket protocol.
        */
        constructor(url: string, subprotocol?: string);
        /**
        @summary Returns local actor data.
        @method Photon.Lite.LitePeer#myActor
        @returns {object} Local actor in form { photonId: number, properties: object }
        */
        public myActor(): {
            photonId: any;
            properties: {};
        };
        /**
        @summary Joins an existing room by name or create one if the name is not in use yet.
        @method Photon.Lite.LitePeer#join
        @param {string} roomName Any identifying name for a room
        @param {object} [roomProperties] Set of room properties, by convention: only used if room is new/created.
        @param {object} [actorProperties] Set of actor properties.
        @param {object} [broadcast] Broadcast actor proprties in join-event.
        */
        public join(roomName: string, roomProperties?: any, actorProperties?: any, broadcast?: bool): void;
        /**
        @summary Leaves a room, but keeps the connection.
        @method Photon.Lite.LitePeer#leave
        */
        public leave(): void;
        /**
        @summary Sends your custom data as event to a actors in the current Room.
        @method Photon.Lite.LitePeer#raiseEvent
        @param {number} eventCode The code of custom event.
        @param {object} data Event content
        */
        public raiseEvent(eventCode: number, data: any): void;
        /**
        @summary Sets or updates properties of specified actor.
        @method Photon.Lite.LitePeer#setActorProperties
        @param {number} actorNr Id of actor.
        @param {object} data Actor properties to set or update.
        @param {bool} broadcast Triggers an LiteEventCode.PropertiesChanged event if true.
        */
        public setActorProperties(actorNr: number, data: any, broadcast: bool): void;
        /**
        @summary Requests selected properties of specified actors.
        @method Photon.Lite.LitePeer#getActorProperties
        @param {object} [propertyKeys] Property keys to fetch. All properties will return if not specified.
        @param {number[]} [actorNrs] List of actornumbers to get the properties of. Properties of all actors will return if not specified.
        */
        public getActorProperties(propertyKeys: number[], actorNrs?: number[]): void;
        /**
        @summary Sets or updates properties of joined room.
        @method Photon.Lite.LitePeer#setRoomProperties
        @param {object} data Room properties to set or update.
        @param {bool} broadcast Triggers an LiteEventCode.PropertiesChanged event if true.
        */
        public setRoomProperties(data: any, broadcast: bool): void;
        /**
        @summary Requests selected properties of joined room.
        @method Photon.Lite.LitePeer#getRoomProperties
        @param {object} [propertyKeys] Property keys to fetch. All properties will return if not specified.
        */
        public getRoomProperties(propertyKeys: number[]): void;
        private isJoined;
        private roomName;
        private room;
        private actors;
        private _myActor;
        private _addActor(actorNr);
        private _removeActor(actorNr);
        private actorNrFromVals(vals);
        private _parseEvent(code, event);
        private _onEventJoin(event, actorNr);
        private _onEventLeave(actorNr);
        private _onEventSetProperties(event, actorNr);
        private _parseResponse(code, response);
        private _onResponseGetProperties(response);
        private _onResponseJoin(actorNr);
        private _onResponseLeave(actorNr);
        private _onResponseSetProperties(response, actorNr);
    }
}
/**
Photon Load Balancing API Constants
@namespace Photon.LoadBalancing.Constants
*/
module Photon.LoadBalancing.Constants {
    /**
    @summary Master and game servers error codes.
    @member Photon.LoadBalancing.Constants.ErrorCode
    @readonly
    @property {number} Ok No Error.
    @property {number} OperationNotAllowedInCurrentState Operation can't be executed yet.
    @property {number} InvalidOperationCode The operation you called is not implemented on the server (application) you connect to. Make sure you run the fitting applications.
    @property {number} InternalServerError Something went wrong in the server. Try to reproduce and contact Exit Games.
    @property {number} InvalidAuthentication Authentication failed. Possible cause: AppId is unknown to Photon (in cloud service).
    @property {number} GameIdAlreadyExists GameId (name) already in use (can't create another). Change name.
    @property {number} GameFull Game is full. This can when players took over while you joined the game.
    @property {number} GameClosed Game is closed and can't be joined. Join another game.
    @property {number} NoRandomMatchFound Random matchmaking only succeeds if a room exists thats neither closed nor full. Repeat in a few seconds or create a new room.
    @property {number} GameDoesNotExist Join can fail if the room (name) is not existing (anymore). This can happen when players leave while you join.
    @property {number} MaxCcuReached Authorization on the Photon Cloud failed becaus the concurrent users (CCU) limit of the app's subscription is reached.
    @property {number} InvalidRegion Authorization on the Photon Cloud failed because the app's subscription does not allow to use a particular region's server.
    */
    var ErrorCode: {
        Ok: number;
        OperationNotAllowedInCurrentState: number;
        InvalidOperationCode: number;
        InternalServerError: number;
        InvalidAuthentication: number;
        GameIdAlreadyExists: number;
        GameFull: number;
        GameClosed: number;
        NoRandomMatchFound: number;
        GameDoesNotExist: number;
        MaxCcuReached: number;
        InvalidRegion: number;
    };
    var ActorProperties: {
        PlayerName: number;
    };
    var GameProperties: {
        MaxPlayers: number;
        IsVisible: number;
        IsOpen: number;
        PlayerCount: number;
        Removed: number;
        PropsListedInLobby: number;
        CleanupCacheOnLeave: number;
    };
    var EventCode: {
        GameList: number;
        GameListUpdate: number;
        QueueState: number;
        AppStats: number;
        AzureNodeInfo: number;
        Join: number;
        Leave: number;
        PropertiesChanged: number;
    };
    var ParameterCode: {
        Address: number;
        PeerCount: number;
        GameCount: number;
        MasterPeerCount: number;
        UserId: number;
        ApplicationId: number;
        Position: number;
        MatchMakingType: number;
        GameList: number;
        Secret: number;
        AppVersion: number;
        AzureNodeInfo: number;
        AzureLocalNodeId: number;
        AzureMasterNodeId: number;
        RoomName: number;
        Broadcast: number;
        ActorList: number;
        ActorNr: number;
        PlayerProperties: number;
        CustomEventContent: number;
        Data: number;
        Code: number;
        GameProperties: number;
        Properties: number;
        TargetActorNr: number;
        ReceiverGroup: number;
        Cache: number;
        CleanupCacheOnLeave: number;
        Group: number;
        Remove: number;
        Add: number;
        ClientAuthenticationType: number;
        ClientAuthenticationParams: number;
    };
    /**
    @summary Codes for parameters and events used in Photon Load Balancing API.
    @member Photon.LoadBalancing.Constants.OperationCode
    @readonly
    @property {number} Authenticate Authenticates this peer and connects to a virtual application.
    @property {number} JoinLobby Joins lobby (on master).
    @property {number} LeaveLobby Leaves lobby (on master).
    @property {number} CreateGame Creates a game (or fails if name exists).
    @property {number} JoinGame Joins room (by name).
    @property {number} JoinRandomGame Joins random room (on master).
    @property {number} Leave Leaves the room.
    @property {number} RaiseEvent Raises event (in a room, for other actors/players).
    @property {number} SetProperties Sets Properties (of room or actor/player).
    @property {number} GetProperties Gets Properties.
    @property {number} ChangeGroups Changes interest groups in room.
    */
    var OperationCode: {
        Authenticate: number;
        JoinLobby: number;
        LeaveLobby: number;
        CreateGame: number;
        JoinGame: number;
        JoinRandomGame: number;
        Leave: number;
        RaiseEvent: number;
        SetProperties: number;
        GetProperties: number;
        ChangeGroups: number;
    };
    /**
    @summary Options for matchmaking rules for joinRandomGame.
    @member Photon.LoadBalancing.Constants.MatchmakingMode
    @readonly
    @property {number} FillRoom Default. FillRoom Fills up rooms (oldest first) to get players together as fast as possible. Makes most sense with MaxPlayers > 0 and games that can only start with more players.
    @property {number} SerialMatching Distributes players across available rooms sequentially but takes filter into account. Without filter, rooms get players evenly distributed.
    @property {number} RandomMatching Joins a (fully) random room. Expected properties must match but aside from this, any available room might be selected.
    */
    var MatchmakingMode: {
        FillRoom: number;
        SerialMatching: number;
        RandomMatching: number;
    };
    /**
    @summary Caching options for events.
    @member Photon.LoadBalancing.Constants.EventCaching
    @readonly
    @property {number} DoNotCache Default. Do not cache.
    @property {number} MergeCache Will merge this event's keys with those already cached.
    @property {number} ReplaceCache Replaces the event cache for this eventCode with this event's content.
    @property {number} RemoveCache Removes this event (by eventCode) from the cache.
    @property {number} AddToRoomCache Adds an event to the room's cache.
    @property {number} AddToRoomCacheGlobal Adds this event to the cache for actor 0 (becoming a "globally owned" event in the cache).
    @property {number} RemoveFromRoomCache Remove fitting event from the room's cache.
    @property {number} RemoveFromRoomCacheForActorsLeft Removes events of players who already left the room (cleaning up).
    */
    var EventCaching: {
        DoNotCache: number;
        MergeCache: number;
        ReplaceCache: number;
        RemoveCache: number;
        AddToRoomCache: number;
        AddToRoomCacheGlobal: number;
        RemoveFromRoomCache: number;
        RemoveFromRoomCacheForActorsLeft: number;
    };
    /**
    @summary Options for choosing room's actors who should receive events.
    @member Photon.LoadBalancing.Constants.ReceiverGroup
    @readonly
    @property {number} Others Default. Anyone else gets my event.
    @property {number} All Everyone in the current room (including this peer) will get this event.
    @property {number} MasterClient The "master client" does not have special rights but is the one who is in this room the longest time.
    */
    var ReceiverGroup: {
        Others: number;
        All: number;
        MasterClient: number;
    };
    /**
    @summary Options for optional "Custom Authentication" services used with Photon.
    @member Photon.LoadBalancing.Constants.CustomAuthenticationType
    @readonly
    @property {number} Custom Default. Use a custom authentification service.
    @property {number} None Disables custom authentification.
    */
    var CustomAuthenticationType: {
        Custom: number;
        None: number;
    };
}
/**
Photon Load Balancing API
@namespace Photon.LoadBalancing
*/
module Photon.LoadBalancing {
    class Actor {
        public name: string;
        public actorNr: number;
        public isLocal: bool;
        /**
        @classdesc Summarizes a "player" within a room, identified (in that room) by ID (or "actorNr"). Extend to implement custom logic.
        @constructor Photon.LoadBalancing.Actor
        @param {string} name Actor name.
        @param {number} actorNr Actor ID.
        @param {bool} isLocal Actor is local.
        */
        constructor(name: string, actorNr: number, isLocal: bool);
        /**
        @summary Actor's room: the room initialized by client for create room operation or room client connected to.
        @method Photon.LoadBalancing.Actor#getRoom
        @returns {Photon.LoadBalancing.Room} Actor's room.
        */
        public getRoom(): Room;
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
        public raiseEvent(eventCode: number, data?: any, options?: {
                interestGroup?: number;
                cache?: number;
                receivers?: number;
            }): void;
        /**
        @summary Sets room name (before create room operation).
        @method Photon.LoadBalancing.Actor#setName
        @param {string} name Room name.
        */
        public setName(name: string): void;
        /**
        @summary Called on every actor properties update: properties set by client, poperties update from server.
        Override to update custom room state.
        @method Photon.LoadBalancing.RoomInfo#onPropertiesChange
        @param {object} changedCustomProps Key-value map of changed properties.
        */
        public onPropertiesChange(changedCustomProps: any): void;
        /**
        @summary Returns custom property by name.
        @method Photon.LoadBalancing.Actor#getCustomProperty
        @param {string} name Name of the property.
        @returns {object} Property or undefined if property not found.
        */
        public getCustomProperty(name: string);
        /**
        @summary Returns custom property by name or default value.
        @method Photon.LoadBalancing.Actor#getCustomPropertyOrElse
        @param {string} name Name of the property.
        @param {object} defaultValue Default property value.
        @returns {object} Property or default value if property not found.
        */
        public getCustomPropertyOrElse(name: string, defaultValue: any);
        /**
        @summary Sets custom property.
        @method Photon.LoadBalancing.Actor#setCustomProperty
        @param {string} name Name of the property.
        @param {object} value Property value.
        */
        public setCustomProperty(name: string, value: any): void;
        public _getAllProperties(): {};
        public _setLBC(lbc: LoadBalancingClient): void;
        private customProperties;
        private loadBalancingClient;
        public _updateFromResponse(vals: {}): void;
        public _updateMyActorFromResponse(vals: {}): void;
        public _updateCustomProperties(vals: {}): void;
        static _getActorNrFromResponse(vals: {});
    }
    class RoomInfo {
        /**
        @summary Room name.
        @member Photon.LoadBalancing.RoomInfo#name
        @type {string}
        @readonly
        */
        public name: string;
        /**
        @summary Joined room game server address.
        @member Photon.LoadBalancing.RoomInfo#address
        @type {string}
        @readonly
        */
        public address: string;
        /**
        @summary Max players before room is considered full.
        @member Photon.LoadBalancing.RoomInfo#maxPlayers
        @type {number}
        @readonly
        */
        public maxPlayers: number;
        /**
        @summary Shows the room in the lobby's room list. Makes sense only for local room.
        @member Photon.LoadBalancing.RoomInfo#isVisible
        @type {bool}
        @readonly
        */
        public isVisible: bool;
        /**
        @summary Defines if this room can be joined.
        @member Photon.LoadBalancing.RoomInfo#isOpen
        @type {bool}
        @readonly
        */
        public isOpen: bool;
        /**
        @summary Count of player currently in room.
        @member Photon.LoadBalancing.RoomInfo#playerCount
        @type {number}
        @readonly
        */
        public playerCount: number;
        /**
        @summary Room removed (in room list updates).
        @member Photon.LoadBalancing.RoomInfo#removed
        @type {bool}
        @readonly
        */
        public removed: bool;
        private cleanupCacheOnLeave;
        public _customProperties: {};
        public _propsListedInLobby: string[];
        /**
        @summary Called on every room properties update: room creation, properties set by client, poperties update from server.
        Override to update custom room state.
        @method Photon.LoadBalancing.RoomInfo#onPropertiesChange
        @param {object} changedCustomProps Key-value map of changed properties.
        */
        public onPropertiesChange(changedCustomProps: any): void;
        /**
        @summary Returns custom property by name.
        @method Photon.LoadBalancing.RoomInfo#getCustomProperty
        @param {string} name Name of the property.
        @returns {object} Property or undefined if property not found.
        */
        public getCustomProperty(prop: string);
        /**
        @summary Returns custom property by name or default value.
        @method Photon.LoadBalancing.RoomInfo#getCustomPropertyOrElse
        @param {string} name Name of the property.
        @param {object} defaultValue Default property value.
        @returns {object} Property or default value if property not found.
        */
        public getCustomPropertyOrElse(prop: string, defaultValue: any);
        /**
        @classdesc Used for Room listings of the lobby (not yet joining). Offers the basic info about a room: name, player counts, properties, etc.
        @constructor Photon.LoadBalancing.RoomInfo
        @param {string} name Room name.
        */
        constructor(name: string);
        public _updateFromMasterResponse(vals: any): void;
        public _updateFromProps(props: Object, customProps?: Object): void;
        private updateIfExists(prevValue, code, props);
    }
    class Room extends RoomInfo {
        /**
        @classdesc Represents a room client joins or is joined to. Extend to implement custom logic. Custom properties can be set via setCustomProperty() while being in the room.
        @mixes Photon.LoadBalancing.RoomInfo
        @constructor Photon.LoadBalancing.Room
        @param {string} name Room name.
        */
        constructor(name: string);
        /**
        @summary Sets custom property
        @method Photon.LoadBalancing.Room#setCustomProperty
        @param {string} name Name of the property.
        @param {object} value Property value.
        */
        public setCustomProperty(name: string, value: any): void;
        private setProp(name, value);
        /**
        * @summary Sets rooms visibility in the lobby's room list.
        * @method Photon.LoadBalancing.Room#setIsOpen
        * @param {bool} isVisible New visibility value.
        */
        public setIsVisible(isVisible: bool): void;
        /**
        * @summary Sets if this room can be joined.
        * @method Photon.LoadBalancing.Room#setIsOpen
        * @param {bool} isOpen New property value.
        */
        public setIsOpen(isOpen: bool): void;
        /**
        * @summary Sets max players before room is considered full.
        * @method Photon.LoadBalancing.Room#setMaxPlayers
        * @param {number} maxPlayers New max players value.
        */
        public setMaxPlayers(maxPlayers: number): void;
        /**
        @summary Sets list of the room properties to pass to the RoomInfo list in a lobby. Call for myRoom() before createRoomFromMy call.
        @method Photon.LoadBalancing.Room#setPropsListedInLobby
        @param {string[]} props Array of properties names.
        */
        public setPropsListedInLobby(props: string[]): void;
        private loadBalancingClient;
        public _setLBC(lbc: LoadBalancingClient): void;
    }
    class LoadBalancingClient {
        private masterServerAddress;
        private appId;
        private appVersion;
        /**
        @summary Called on client state change. Override to handle it.
        @method Photon.LoadBalancing.LoadBalancingClient#onStateChange
        @param {Photon.LoadBalancing.LoadBalancingClient.State} state New client state.
        */
        public onStateChange(state: number): void;
        /**
        @summary Called if client error occures. Override to handle it.
        @method Photon.LoadBalancing.LoadBalancingClient#onError
        @param {Photon.LoadBalancing.LoadBalancingClient.PeerErrorCode} errorCode Client error code.
        @param {string} errorMsg Error message.
        */
        public onError(errorCode: number, errorMsg: string): void;
        /**
        @summary Called on operation response. Override if need custom workflow or response error handling.
        @method Photon.LoadBalancing.LoadBalancingClient#onOperationResponse
        @param {number} errorCode Server error code.
        @param {string} errorMsg Error message.
        @param {Photon.LoadBalancing.Constants.OperationCode} code Operation code.
        @param {object} content Operation response content.
        */
        public onOperationResponse(errorCode: number, errorMsg: string, code: number, content: any): void;
        /**
        @summary Called on custom event. Override to handle it.
        @method Photon.LoadBalancing.LoadBalancingClient#onEvent
        @param {number} code Event code.
        @param {object} content Event content.
        @param {number} actorNr Actor ID event raised by.
        */
        public onEvent(code: number, content: any, actorNr: number): void;
        /**
        @summary Called on room list received from master server (on connection). Override to handle it.
        @method Photon.LoadBalancing.LoadBalancingClient#onRoomList
        @param {Photon.LoadBalancing.RoomInfo[]} rooms Room list.
        */
        public onRoomList(rooms: RoomInfo[]): void;
        /**
        @summary Called on room list updates received from master server. Override to handle it.
        @method Photon.LoadBalancing.LoadBalancingClient#onRoomListUpdate
        @param {Photon.LoadBalancing.RoomInfo[]} rooms Updated room list.
        @param {Photon.LoadBalancing.RoomInfo[]} roomsUpdated Rooms whose properties were changed.
        @param {Photon.LoadBalancing.RoomInfo[]} roomsAdded New rooms in list.
        @param {Photon.LoadBalancing.RoomInfo[]} roomsRemoved Rooms removed from list.
        */
        public onRoomListUpdate(rooms: RoomInfo[], roomsUpdated: RoomInfo[], roomsAdded: RoomInfo[], roomsRemoved: RoomInfo[]): void;
        /**
        @summary Called on joined room properties changed event. Override to handle it.
        @method Photon.LoadBalancing.LoadBalancingClient#onMyRoomPropertiesChange
        */
        public onMyRoomPropertiesChange(): void;
        /**
        @summary Called on actor properties changed event. Override to handle it.
        @method Photon.loadbalancing.loadbalancingClient#onActorPropertiesChange
        @param {Photon.LoadBalancing.Actor} actor Actor whose properties were changed.
        */
        public onActorPropertiesChange(actor: Actor): void;
        /**
        @summary Called when client joins room. Override to handle it.
        @method Photon.LoadBalancing.LoadBalancingClient#onJoinRoom
        */
        public onJoinRoom(): void;
        /**
        @summary Called when new actor joins the room client joined to. Override to handle it.
        @method Photon.LoadBalancing.LoadBalancingClient#onActorJoin
        @param {Photon.LoadBalancing.Actor} actor New actor.
        */
        public onActorJoin(actor: Actor): void;
        /**
        @summary Called when actor leaves the room client joined to. Override to handle it.
        @method Photon.LoadBalancing.LoadBalancingClient#onActorLeave
        @param {Photon.LoadBalancing.Actor} actor Actor left the room.
        */
        public onActorLeave(actor: Actor): void;
        /**
        @summary Override with creation of custom room (extended from Room): { return new CustomRoom(...); }
        @method Photon.LoadBalancing.LoadBalancingClient#roomFactory
        @param {string} name Room name. Pass to super() in custom actor constructor.
        */
        private roomFactory(name);
        /**
        @summary Override with creation of custom actor (extended from Actor): { return new CustomActor(...); }
        @method Photon.LoadBalancing.LoadBalancingClient#actorFactory
        @param {string} name Actor name. Pass to super() in custom room constructor.
        @param {number} actorNr Actor ID. Pass to super() in custom room constructor.
        @param {bool} isLocal Actor is local. Pass to super() in custom room constructor.
        */
        private actorFactory(name, actorNr, isLocal);
        /**
        @summary Returns local actor.
        Client always has local actor even if not joined.
        @method Photon.LoadBalancing.LoadBalancingClient#myActor
        @returns {Photon.LoadBalancing.Actor} Local actor.
        */
        public myActor(): Actor;
        /**
        @summary Returns client's room.
        Client always has it's room even if not joined. It's used for room creation operation.
        @method Photon.LoadBalancing.LoadBalancingClient#myRoom
        @returns {Photon.LoadBalancing.Room} Current room.
        */
        public myRoom(): Room;
        /**
        @summary Returns actors in room client currently joined including local actor.
        @method Photon.LoadBalancing.LoadBalancingClient#myRoomActors
        @returns {Photon.LoadBalancing.Room[]} Room actors list.
        */
        public myRoomActors(): {};
        private roomFactoryInternal(name?);
        private actorFactoryInternal(name?, actorId?, isLocal?);
        /**
        @classdesc Implements the Photon LoadBalancing workflow. This class should be extended to handle system or custom events and operation responses.
        @constructor Photon.LoadBalancing.LoadBalancingClient
        @param {string} masterServerAddress Master server address:port.
        @param {string} appId Cloud application ID.
        @param {string} appVersion Cloud application version.
        */
        constructor(masterServerAddress: string, appId: string, appVersion: string);
        /**
        @summary Enables custom authentication and sets it's parameters.
        @method Photon.LoadBalancing.LoadBalancingClient#setCustomAuthentication
        @param {string} authParameters This string must contain any (http get) parameters expected by the used authentication service.
        @param {Photon.LoadBalancing.Constants.CustomAuthenticationType} [authType=Photon.LoadBalancing.Constants.CustomAuthenticationType.Custom] The type of custom authentication provider that should be used.
        */
        public setCustomAuthentication(authParameters: string, authType?: number): void;
        /**
        @summary Starts connection to master server.
        @method Photon.LoadBalancing.LoadBalancingClient#connect
        @param {bool} [keepMasterConnection=false] Don't disconnect from master server after joining room.
        */
        public connect(keepMasterConnection?: bool): bool;
        /**
        @summary Creates a new room on the server (or fails when the name is already taken). Takes parameters (except name) for new room from myRoom() object. Set them before call.
        @method Photon.LoadBalancing.LoadBalancingClient#createRoomFromMy
        @param {string} [roomName] New room name. Assigned automatically by server if empty or not specified.
        */
        public createRoomFromMy(roomName?: string): void;
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
        public createRoom(roomName?: string, isVisible?: bool, isOpen?: bool, maxPlayers?: number, customGameProperties?: {}, propsListedInLobby?: string[]): void;
        /**
        @summary Joins a room by name and sets this player's properties.
        @method Photon.LoadBalancing.LoadBalancingClient#joinRoom
        @param {string} roomName The name of the room to join. Must be existing already, open and non-full or can't be joined.
        */
        public joinRoom(roomName: string): bool;
        /**
        @summary Joins a random, available room.
        This operation fails if all rooms are closed or full.
        @method Photon.LoadBalancing.LoadBalancingClient#joinRandomRoom
        @param {object} [expectedCustomRoomProperties] If specified, a room will only be joined, if it matches these custom properties. Use null to accept rooms with any properties.
        @param {number} [expectedMaxPlayers] If specified, filters for a particular maxPlayer setting. Use 0 to accept any maxPlayer value.
        @param {Photon.LoadBalancing.Constants.MatchmakingMode} [matchmakingMode=MatchmakingMode.FillRoom] Selects one of the available matchmaking algorithms.
        */
        public joinRandomRoom(expectedCustomRoomProperties?: any, expectedMaxPlayers?: number, matchingType?: number): bool;
        public _setPropertiesOfRoom(properties: {}): void;
        public _setPropertiesOfActor(properties: {}): void;
        /**
        @summary Disconnects from master and game servers.
        @method Photon.LoadBalancing.LoadBalancingClient#disconnect
        */
        public disconnect(): void;
        /**
        @summary Leaves room and connects to master server if not connected.
        @method Photon.LoadBalancing.LoadBalancingClient#leaveRoom
        */
        public leaveRoom(): void;
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
        public raiseEvent(eventCode: number, data?: any, options?: {
                interestGroup?: number;
                cache?: number;
                receivers?: number;
            }): void;
        /**
        @summary Changes client's interest groups (for events in room).
        First, removing groups is executed. This way, you could leave all groups and join only the ones provided.
        @method Photon.LoadBalancing.LoadBalancingClient#changeGroups
        @param {number[]} groupsToRemove Groups to remove from interest. Null will not leave any. A [] will remove all.
        @param {number[]} groupsToAdd Groups to add to interest. Null will not add any. A [] will add all current.
        */
        public changeGroups(groupsToRemove: number[], groupsToAdd: number[]): void;
        /**
        @summary Checks if client is connected to master server (usually joined to lobby and receives room list updates).
        @method Photon.LoadBalancing.LoadBalancingClient#isConnectedToMaster
        @returns {bool} True if client is connected to master server.
        */
        public isConnectedToMaster(): bool;
        /**
        @summary Checks if client is in lobby and ready to join or create game.
        @method Photon.LoadBalancing.LoadBalancingClient#isInLobby
        @returns {bool} True if client is in lobby.
        */
        public isInLobby(): bool;
        /**
        @summary Checks if client is joined to game.
        @method Photon.LoadBalancing.LoadBalancingClient#isJoinedToRoom
        @returns {bool} True if client is joined to game.
        */
        public isJoinedToRoom(): bool;
        /**
        @deprecated Use isJoinedToRoom()
        */
        public isConnectedToGame(): bool;
        /**
        @summary Current room list from master server.
        @method Photon.LoadBalancing.LoadBalancingClient#availableRooms
        @returns {RoomInfo[]} Current room list
        */
        public availableRooms(): RoomInfo[];
        /**
        @summary Sets client logger level
        @method Photon.LoadBalancing.LoadBalancingClient#setLogLevel
        @param {Exitgames.Common.Logger.Level} level Logging level.
        */
        public setLogLevel(level: number): void;
        private masterPeer;
        private keepMasterConnection;
        private reconnectPending;
        private gamePeer;
        private currentRoom;
        private roomInfos;
        private _myActor;
        private actors;
        private addActor(a);
        private userAuthType;
        private userAuthParameters;
        private userAuthSecret;
        private state;
        private logger;
        private changeState(nextState);
        private createRoomInternal(peer);
        private initMasterPeer(mp);
        private connectToGameServer(createGame);
        private initGamePeer(gp, createGame);
        private _onOperationResponseInternal2(code, data);
        private validNextState;
        private initValidNextState();
        private checkNextState(nextState, dontThrow?);
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
        static PeerErrorCode: {
            Ok: number;
            MasterError: number;
            MasterConnectFailed: number;
            MasterConnectClosed: number;
            MasterTimeout: number;
            MasterAuthenticationFailed: number;
            GameError: number;
            GameConnectFailed: number;
            GameConnectClosed: number;
            GameTimeout: number;
            GameAuthenticationFailed: number;
        };
        static State: {
            Error: number;
            Uninitialized: number;
            ConnectingToMasterserver: number;
            ConnectedToMaster: number;
            JoinedLobby: number;
            ConnectingToGameserver: number;
            ConnectedToGameserver: number;
            Joined: number;
            Disconnecting: number;
            Disconnected: number;
        };
        static StateToName(value: number): string;
    }
    class MasterPeer extends PhotonPeer {
        private client;
        constructor(client: LoadBalancingClient, url: string, subprotocol: string);
        public onUnhandledEvent(code: number, args: any): void;
        public onUnhandledResponse(code: number, args: any): void;
    }
    class GamePeer extends PhotonPeer {
        private client;
        constructor(client: LoadBalancingClient, url: string, subprotocol: string);
        public onUnhandledEvent(code: number, args: any): void;
        public onUnhandledResponse(code: number, args: any): void;
        public raiseEvent(eventCode: number, data?: any, options?: {
                interestGroup?: number;
                cache?: number;
                receivers?: number;
            }): void;
        public changeGroups(groupsToRemove: number[], groupsToAdd: number[]): void;
        private checkGroupNumber(g);
        private checkGroupArray(groups, groupsName);
    }
}
