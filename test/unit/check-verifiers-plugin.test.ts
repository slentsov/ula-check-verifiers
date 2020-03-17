import {EventHandler, Message} from "universal-ledger-agent";
import {CheckVerifiersPlugin} from "../../src";


describe('Check verifier plugin test', () => {
    const allowedVerifiers = ['public key 1', 'public key 2'];
    const checkVerifiersPlugin = new CheckVerifiersPlugin(allowedVerifiers);

    beforeEach(() => {
        checkVerifiersPlugin.initialize({} as EventHandler);
    });

    it('Creates correct urls for android device and application installed', () => {
        const ulaMessage = new Message({
            type: 'process-challengerequest',
            toAttest: [{
                predicate: 'passport'
            }],
            toVerify: [{

            }],
            correspondenceId: "916e6beb-b330-491b-abf7-ac9af9723017",
            postEndpoint: "url/do/something",
            proof: {
                signatureValue: "signature",
                verificationMethod: "verificationMethod"
            }
        });
         const callback  = () => {};
        checkVerifiersPlugin.handleEvent(ulaMessage, callback);
    });
});
