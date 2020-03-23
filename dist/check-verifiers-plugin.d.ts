import { EventHandler, Message, Plugin } from 'universal-ledger-agent';
export declare class CheckVerifiersPlugin implements Plugin {
    private allowedVerifiers;
    private eventHandler?;
    name: string;
    constructor(allowedVerifiers: string[]);
    initialize(eventHandler: EventHandler): void;
    handleEvent(message: Message, callback: any): Promise<string>;
    private checkVerifier;
    private checkSignature;
    private verifyPayload;
}
