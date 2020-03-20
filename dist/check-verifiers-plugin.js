"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const universal_ledger_agent_1 = require("universal-ledger-agent");
const js_sha3_1 = require("js-sha3");
const secp256k1 = require("secp256k1");
class CheckVerifiersPlugin {
    constructor(allowedVerifiers) {
        this.allowedVerifiers = allowedVerifiers;
        this.eventHandler = undefined;
        this.name = "CheckVerifiersPlugin";
    }
    initialize(eventHandler) {
        this.eventHandler = eventHandler;
    }
    handleEvent(message, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.properties.type !== 'after-challengerequest') {
                return 'ignored';
            }
            if (!message.properties.msg.toVerify || (message.properties.msg.toVerify && message.properties.msg.toVerify.length < 1)) {
                return 'ignored';
            }
            if (!this.eventHandler) {
                throw new Error('Plugin not initialized. Did you forget to call initialize() ?');
            }
            this.checkVerifier(message);
            this.checkSignature(message);
            return 'success';
        });
    }
    checkVerifier(message) {
        const verifierPublicKey = message.properties.msg.proof.verificationMethod;
        if (!this.allowedVerifiers.includes(verifierPublicKey)) {
            throw new Error('Unknown verifier');
        }
        console.log('Verifier is valid');
    }
    checkSignature(message) {
        const model = message.properties.msg;
        const modelWithoutSignatureValue = Object.assign({}, message.properties.msg);
        const publicKey = model.proof.verificationMethod;
        const signature = model.proof.signatureValue;
        modelWithoutSignatureValue.proof.signatureValue = undefined;
        const payload = JSON.stringify(modelWithoutSignatureValue);
        if (!this.verifyPayload(payload, publicKey, signature)) {
            throw new Error('Payload integrity error');
        }
        console.log('Signature is valid');
    }
    verifyPayload(payload, publicKey, signature) {
        const hash = Buffer.from(js_sha3_1.keccak256.digest(payload));
        const signatureBuf = Buffer.from(signature, 'hex');
        const buf = Buffer.from(('04' + publicKey.replace(/^0x/, '')), 'hex');
        return secp256k1.verify(hash, signatureBuf, buf);
    }
    triggerFailure(callback, message) {
        if (callback) {
            callback(new universal_ledger_agent_1.UlaResponse({ statusCode: 1, body: { loading: false, success: false, failure: true } }));
            callback(new universal_ledger_agent_1.UlaResponse({ statusCode: 204, body: { message } }));
        }
    }
}
exports.CheckVerifiersPlugin = CheckVerifiersPlugin;
//# sourceMappingURL=check-verifiers-plugin.js.map