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
        if (!message.properties.type.match(/(did:eth:[A-Za-z0-9]*\/qr)|(ethereum-qr)/g)) {
            return 'ignored' // This message is not intended for us
        }

        if (!message.properties.url) {
            return 'ignored' // The message type is correct, but url is missing
        }

        if (!this.eventHandler) {
            throw new Error('Plugin not initialized. Did you forget to call initialize() ?')
        }

        try {
            console.log('hello');
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
