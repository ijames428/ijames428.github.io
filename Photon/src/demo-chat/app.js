/// <reference path="Photon/Photon-Javascript_SDK.d.ts"/>
var PhotonServerAddress = "24.149.29.78:9090";
var DefaultController = (function () {
    function DefaultController() { }
    DefaultController.logger = new Exitgames.Common.Logger("Demo:");
    DefaultController.setupUI = function setupUI() {
        this.logger.info("Setting up UI.");
        var input = document.getElementById("input");
        input.value = 'hello';
        input.focus();
        var form = document.getElementById("mainfrm");
        form.onsubmit = function () {
            var input = document.getElementById("input");
            try  {
                DefaultController.peer.raiseEvent(1, {
                    message: String(input.value)
                });
                DefaultController.output('me[' + DefaultController.peer.myActor().photonId + ']: ' + input.value);
            } catch (err) {
                DefaultController.output("error: " + err.message);
            }
            input.value = '';
            input.focus();
            return false;
        };
        var btn = document.getElementById("closebtn");
        btn.onclick = function (ev) {
            DefaultController.peer.disconnect();
            return false;
        };
    };
    DefaultController.start = function start() {
        DefaultController.peer = new Photon.Lite.LitePeer("ws://" + PhotonServerAddress, '');
        DefaultController.peer.setLogLevel(Exitgames.Common.Logger.Level.DEBUG);
        // Set event handlers.
        DefaultController.peer.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connect, function () {
            DefaultController.output("Connected!");
            DefaultController.peer.join('DemoChat');
        });
        DefaultController.peer.addResponseListener(Photon.Lite.Constants.LiteOpCode.Join, function (e) {
            DefaultController.output('I joined with id: [' + e.actorNr + '].');
        });
        DefaultController.peer.addEventListener(Photon.Lite.Constants.LiteEventCode.Join, function (e) {
            for(var i = 0; i < e.newActors.length; i++) {
                if(e.newActors[i] != DefaultController.peer.myActor().photonId) {
                    DefaultController.output('actor[' + e.newActors[i] + '] joined!');
                }
            }
        });
        DefaultController.peer.addEventListener(Photon.Lite.Constants.LiteEventCode.Leave, function (e) {
            DefaultController.output('actor[' + e.actorNr + '] left!');
        });
        DefaultController.peer.addEventListener(1, function (data) {
            var text = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].message;// we get JSON back from Photon, the text we pass in by submitMessage() below is passed back here
            
            var actorNr = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.ActorNr];// each client joining is identified with a actor number.
            
            DefaultController.peer._logger.debug('myChat - chat message:', arguments[0]);
            DefaultController.output('actor[' + actorNr + '] - says: ' + text);
        });
        DefaultController.peer.connect();
    };
    DefaultController.output = function output(str) {
        var log = document.getElementById("theDialogue");
        var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").replace(/>/, "&gt;").replace(/"/, "&quot;");
        log.innerHTML = log.innerHTML + escaped + "<br>";
        log.scrollTop = log.scrollHeight;
    };
    return DefaultController;
})();
window.onload = function () {
    DefaultController.setupUI();
    DefaultController.start();
};
