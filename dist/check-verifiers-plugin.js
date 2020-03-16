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
            if (message.properties.type !== 'process-challengerequest'
                && !message.properties.toVerify
                && message.properties.toVerify.length <= 0) {
                return 'ignored';
            }
            if (!this.eventHandler) {
                throw new Error('Plugin not initialized. Did you forget to call initialize() ?');
            }
            try {
                console.log('Incoming message');
                console.log(message);
                console.log('Verification method');
                console.log(message.properties.msg.proof.verificationMethod);
                console.log('Signature');
                console.log(message.properties.msg.proof.signatureValue);
                console.log('hello from the custom plugin');
                const verifierPublicKey = message.properties.msg.proof.verificationMethod;
                if (!this.allowedVerifiers.includes(verifierPublicKey)) {
                    throw new Error('Unknown verifier');
                }
                console.log('Verifier is valid');
                console.log(this.allowedVerifiers.includes(verifierPublicKey));
                console.log("Allowed verifiers");
                console.log(this.allowedVerifiers);
                console.log("Actual verifier");
                console.log(verifierPublicKey);
            }
            catch (error) {
                console.log(error);
                this.triggerFailure(callback);
                return 'error';
            }
            return 'success';
        });
    }
    triggerFailure(callback) {
        if (callback) {
            callback(new universal_ledger_agent_1.UlaResponse({ statusCode: 1, body: { loading: false, success: false, failure: true } }));
            callback(new universal_ledger_agent_1.UlaResponse({ statusCode: 204, body: {} }));
        }
    }
}
exports.CheckVerifiersPlugin = CheckVerifiersPlugin;
//# sourceMappingURL=check-verifiers-plugin.js.map