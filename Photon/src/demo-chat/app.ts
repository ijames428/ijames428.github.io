/// <reference path="Photon/Photon-Javascript_SDK.d.ts"/> 

var PhotonServerAddress = "localhost:9090"

class DefaultController {
    static peer: Photon.Lite.LitePeer;
    static private logger = new Exitgames.Common.Logger("Demo:");
    static setupUI() {
        this.logger.info("Setting up UI.");

        var input = <HTMLInputElement>document.getElementById("input");
        input.value = 'hello';
        input.focus();

        var form = <HTMLFormElement>document.getElementById("mainfrm");
        form.onsubmit = () => {
            var input = <HTMLInputElement>document.getElementById("input");

            try {
                peer.raiseEvent(1, { message : String(input.value) });
                output('me[' + peer.myActor().photonId + ']: ' + input.value);
            }
            catch (err) {
                output("error: " + err.message);
            }
            input.value = '';
            input.focus();

            return false;
        }

        var btn = <HTMLButtonElement>document.getElementById("closebtn");
        btn.onclick = (ev) => {
            peer.disconnect();
            return false;
        }
    }

    static start() {
        peer = new Photon.Lite.LitePeer("ws://" + PhotonServerAddress, '');
        peer.setLogLevel(Exitgames.Common.Logger.Level.DEBUG);

        // Set event handlers.
        peer.addPeerStatusListener(Photon.PhotonPeer.StatusCodes.connect, () => {
            output("Connected!");
            peer.join('DemoChat');
        });
            
        peer.addResponseListener(Photon.Lite.Constants.LiteOpCode.Join,
            (e) => {
                output('I joined with id: [' + e.actorNr + '].');
            });
        peer.addEventListener(Photon.Lite.Constants.LiteEventCode.Join,
            (e) => {
                for (var i = 0; i < e.newActors.length; i++) {
                    if (e.newActors[i] != peer.myActor().photonId) {
                        output('actor[' + e.newActors[i] + '] joined!');
                    }
                }
            });
        peer.addEventListener(Photon.Lite.Constants.LiteEventCode.Leave,
            (e) => {
                output('actor[' + e.actorNr + '] left!');
            });
        peer.addEventListener(1,
            (data) => {
                var text = arguments[0].vals[Photon.Lite.Constants.LiteOpKey.Data].message;            // we get JSON back from Photon, the text we pass in by submitMessage() below is passed back here
                var actorNr =   arguments[0].vals[Photon.Lite.Constants.LiteOpKey.ActorNr];                // each client joining is identified with a actor number.

                peer._logger.debug('myChat - chat message:', arguments[0]);    

                output('actor[' + actorNr + '] - says: ' + text);
            });

        peer.connect();
    }

    static output(str: string) {
        var log = document.getElementById("theDialogue");
        var escaped = str.replace(/&/, "&amp;").replace(/</, "&lt;").
        replace(/>/, "&gt;").replace(/"/, "&quot;");
        log.innerHTML = log.innerHTML + escaped + "<br>";
        log.scrollTop = log.scrollHeight;
    }
}

window.onload = () => {
    DefaultController.setupUI();
    DefaultController.start();
}