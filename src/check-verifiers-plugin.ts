import {EventHandler, Message, Plugin, UlaResponse} from 'universal-ledger-agent'
import {keccak256} from 'js-sha3';
// @ts-ignore
import * as secp256k1 from 'secp256k1'

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

        if (message.properties.type !== 'after-challengerequest') {
            return 'ignored';
        }

        if (!message.properties.msg.toVerify || (message.properties.msg.toVerify && message.properties.msg.toVerify.length < 1)) {
            return 'ignored'
        }

        if (!this.eventHandler) {
            throw new Error('Plugin not initialized. Did you forget to call initialize() ?')
        }
        this.checkVerifier(message);
        this.checkSignature(message);
        return 'success'
    }

    private checkVerifier(message: Message) {
        const verifierPublicKey = message.properties.msg.proof.verificationMethod;
        if (!this.allowedVerifiers.includes(verifierPublicKey)) {
            throw new Error('Unknown verifier');
        }
        console.log('Verifier is valid');
    }

    private checkSignature(message: Message) {
        const modelWithoutSignatureValue = {... message.properties.msg };
        const publicKey = modelWithoutSignatureValue.proof.verificationMethod;
        const signature = modelWithoutSignatureValue.proof.signatureValue as string;
        modelWithoutSignatureValue.proof.signatureValue = undefined;
        const payload = JSON.stringify(modelWithoutSignatureValue);
        if (!this.verifyPayload(payload, publicKey, signature)) {
            throw new Error('Payload integrity error');
        }
        console.log('Signature is valid');
    }

    private verifyPayload(payload: string, publicKey: string, signature: string): boolean {
        const hash = Buffer.from(keccak256.digest(payload));
        const signatureBuf = Buffer.from(signature, 'hex');
        const buf = Buffer.from(('04' + publicKey.replace(/^0x/, '')), 'hex');
        return secp256k1.verify(hash, signatureBuf, buf);
    }

}
