import {EventHandler, Message, Plugin, UlaResponse} from 'universal-ledger-agent'

export class CheckVerifiersPlugin implements Plugin {

    private eventHandler?: EventHandler = undefined;
    name = "CheckVerifiersPlugin";

    /**
     * Array of public keys of verifiers that are allowed
     * @param {allowedVerifiers} allowedVerifiers
     */
    constructor(private allowedVerifiers: string[]) {}

    initialize(eventHandler: EventHandler): void {
        this.eventHandler = eventHandler;
    }

    /**
     * Handle incoming messages
     * @param {Message} message
     * @param callback
     * @return {Promise<string>}
     */
    public async handleEvent(message: Message, callback: any): Promise<string> {


        if (message.properties.type !== 'process-challengerequest'
            && !message.properties.toVerify
            && message.properties.toVerify.length <= 0) {
            return 'ignored'
        }

        if (!this.eventHandler) {
            throw new Error('Plugin not initialized. Did you forget to call initialize() ?')
        }

        try {
            console.log('Incoming message');
            console.log(message);
            console.log('Verification method');
            console.log(message.properties.msg.proof.verificationMethod);
            console.log('Signature');
            console.log(message.properties.msg.proof.signatureValue);
            console.log('hello from the custom plugin');

            // check that it is allowed verifier
            // check that signature is correct
            // check that signature is created by the owner of the public key
            const verifierPublicKey = message.properties.msg.proof.verificationMethod;
            if (!this.allowedVerifiers.includes(verifierPublicKey)) {
                throw new Error('Unknown verifier');
            }
            console.log('Verifier is valid');
            console.log(this.allowedVerifiers.includes(verifierPublicKey));
            console.log("Allowed verifiers");
            console.log(this.allowedVerifiers.includes(verifierPublicKey));
            console.log("Actual verifier");
            console.log(verifierPublicKey);
        } catch (error) {
            console.log(error);
            this.triggerFailure(callback);
            return 'error';
        }
        return 'success'
    }

    private triggerFailure(callback: any) {
        if (callback) {
            callback(new UlaResponse({ statusCode: 1, body: { loading: false, success: false, failure: true } }));
            callback(new UlaResponse({ statusCode: 204, body: {} }));
        }
    }

}
