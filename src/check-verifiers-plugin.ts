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


        if (message.properties.type !== 'process-challengerequest') {
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
