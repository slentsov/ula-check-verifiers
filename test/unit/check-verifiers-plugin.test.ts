import {EventHandler, Message} from "universal-ledger-agent";
import {CheckVerifiersPlugin} from "../../src";
import {assert, expect} from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);


describe('Check verifier plugin test', () => {
    const allowedVerifiers = ['3594fcca53fa20253894a76da22c9b9ace355bc477731629d0d617211be9de506246b93cbccea2969cf85dc7994784e333704011883ee38db977a56214a9c7b2', 'public key 2'];
    const checkVerifiersPlugin = new CheckVerifiersPlugin(allowedVerifiers);

    beforeEach(() => {
        checkVerifiersPlugin.initialize({} as EventHandler);
    });

    it('properly validates the message and does not throw any exception', async () => {
        const ulaMessage = new Message({
            type: 'after-challengerequest',
            msg: {
                toAttest: [],
                correspondenceId: "102e2e52-9fe7-40a9-84cd-a87f73e6bb04",
                postEndpoint: "pentest.identityservice.careerwallet.devinnohub.nl/verifiable-presentations",
                toVerify: [
                    {predicate: "Drivers License", allowedIssuers: ["did:eth:0xe56315023679fA6C07727aBc06Eb600fE90fa673"], required: true},
                    {predicate: "Passport/ID", allowedIssuers: ["did:eth:0xe56315023679fA6C07727aBc06Eb600fE90fa673"], required: true}
                ],
                proof: {
                    type: "secp256k1Signature2019",
                    created: "2020-03-17T10:53:26.264Z",
                    verificationMethod: "3594fcca53fa20253894a76da22c9b9ace355bc477731629d0d617211be9de506246b93cbccea2969cf85dc7994784e333704011883ee38db977a56214a9c7b2",
                    nonce: "61e9c20d-35c8-46b8-a156-7009126bfea3",
                    signatureValue: "b0991b05bde3eb3a49115f6663f03f9abeb59de090a3657eda70b87dc7d5373011cb75387735e08f9b84ea35d5140922a9fe4af37a5b1076d7f051b5fa709468"
                },
            }
        });
        await checkVerifiersPlugin.handleEvent(ulaMessage, () => {});
    });

    it('should fail when verifier is not allowed', async () => {
        const ulaMessage = new Message({
            type: 'after-challengerequest',
            msg: {
                toAttest: [],
                correspondenceId: "102e2e52-9fe7-40a9-84cd-a87f73e6bb04",
                postEndpoint: "pentest.identityservice.careerwallet.devinnohub.nl/verifiable-presentations",
                toVerify: [
                    {predicate: "Drivers License", allowedIssuers: ["did:eth:0xe56315023679fA6C07727aBc06Eb600fE90fa673"], required: true},
                    {predicate: "Passport/ID", allowedIssuers: ["did:eth:0xe56315023679fA6C07727aBc06Eb600fE90fa673"], required: true}
                ],
                proof: {
                    type: "secp256k1Signature2019",
                    created: "2020-03-17T10:53:26.264Z",
                    verificationMethod: "public key 1",
                    nonce: "61e9c20d-35c8-46b8-a156-7009126bfea3",
                    signatureValue: "b0991b05bde3eb3a49115f6663f03f9abeb59de090a3657eda70b87dc7d5373011cb75387735e08f9b84ea35d5140922a9fe4af37a5b1076d7f051b5fa709468"
                },
            }
        });

        return expect(checkVerifiersPlugin.handleEvent(ulaMessage, null), "Is not rejected").to.be.rejectedWith("Unknown verifier");
    });

    it('should fail when signature is corrupted', async () => {
        const ulaMessage = new Message({
            type: 'after-challengerequest',
            msg: {
                toAttest: [],
                correspondenceId: "102e2e52-9fe7-40a9-84cd-a87f73e6bb04",
                postEndpoint: "pentest.identityservice.careerwallet.devinnohub.nl/verifiable-presentations",
                toVerify: [
                    {predicate: "Drivers License", allowedIssuers: ["did:eth:0xe56315023679fA6C07727aBc06Eb600fE90fa673"], required: true},
                    {predicate: "Passport/ID", allowedIssuers: ["did:eth:0xe56315023679fA6C07727aBc06Eb600fE90fa673"], required: true}
                ],
                proof: {
                    type: "secp256k1Signature2019",
                    created: "2020-03-17T10:53:26.264Z",
                    verificationMethod: "3594fcca53fa20253894a76da22c9b9ace355bc477731629d0d617211be9de506246b93cbccea2969cf85dc7994784e333704011883ee38db977a56214a9c7b2",
                    nonce: "61e9c20d-35c8-46b8-a156-7009126bfea3",
                    signatureValue: "b0991b05bde3eb3a49115f6663f13f9abeb59de090a3657eda70b87dc7d5373011cb75387735e08f9b84ea35d5140922a9fe4af37a5b1076d7f051b5fa709468"
                },
            }
        });

        return expect(checkVerifiersPlugin.handleEvent(ulaMessage, null), "Is not rejected").to.be.rejectedWith("Payload integrity error");
    });

    it('should fail when eventHandler is not provided', async () => {
        const ulaMessage = new Message({
            type: 'after-challengerequest',
            msg: {
                toAttest: [],
                correspondenceId: "102e2e52-9fe7-40a9-84cd-a87f73e6bb04",
                postEndpoint: "pentest.identityservice.careerwallet.devinnohub.nl/verifiable-presentations",
                toVerify: [
                    {predicate: "Drivers License", allowedIssuers: ["did:eth:0xe56315023679fA6C07727aBc06Eb600fE90fa673"], required: true},
                    {predicate: "Passport/ID", allowedIssuers: ["did:eth:0xe56315023679fA6C07727aBc06Eb600fE90fa673"], required: true}
                ],
                proof: {
                    type: "secp256k1Signature2019",
                    created: "2020-03-17T10:53:26.264Z",
                    verificationMethod: "3594fcca53fa20253894a76da22c9b9ace355bc477731629d0d617211be9de506246b93cbccea2969cf85dc7994784e333704011883ee38db977a56214a9c7b2",
                    nonce: "61e9c20d-35c8-46b8-a156-7009126bfea3",
                    signatureValue: "b0991b05bde3eb3a49115f6663f13f9abeb59de090a3657eda70b87dc7d5373011cb75387735e08f9b84ea35d5140922a9fe4af37a5b1076d7f051b5fa709468"
                },
            }
        });
        // @ts-ignore
        checkVerifiersPlugin.initialize(null as EventHandler);

        return expect(checkVerifiersPlugin.handleEvent(ulaMessage, null), "Is not rejected").to.be.rejectedWith("Plugin not initialized. Did you forget to call initialize() ?");
    });

    it('should ignore when message has different type then challengerequest', async () => {
        const ulaMessage = new Message({
            type: 'different-type',
            msg: {
                toAttest: [],
                correspondenceId: "102e2e52-9fe7-40a9-84cd-a87f73e6bb04",
                postEndpoint: "pentest.identityservice.careerwallet.devinnohub.nl/verifiable-presentations",
                toVerify: [
                    {predicate: "Drivers License", allowedIssuers: ["did:eth:0xe56315023679fA6C07727aBc06Eb600fE90fa673"], required: true},
                    {predicate: "Passport/ID", allowedIssuers: ["did:eth:0xe56315023679fA6C07727aBc06Eb600fE90fa673"], required: true}
                ],
                proof: {
                    type: "secp256k1Signature2019",
                    created: "2020-03-17T10:53:26.264Z",
                    verificationMethod: "3594fcca53fa20253894a76da22c9b9ace355bc477731629d0d617211be9de506246b93cbccea2969cf85dc7994784e333704011883ee38db977a56214a9c7b2",
                    nonce: "61e9c20d-35c8-46b8-a156-7009126bfea3",
                    signatureValue: "b0991b05bde3eb3a49115f6663f13f9abeb59de090a3657eda70b87dc7d5373011cb75387735e08f9b84ea35d5140922a9fe4af37a5b1076d7f051b5fa709468"
                },
            }
        });

        const result = await checkVerifiersPlugin.handleEvent(ulaMessage, null);

        assert.equal(result, 'ignored');
    });

    it('should ignore when message does not have toVerify field', async () => {
        const ulaMessage = new Message({
            type: 'after-challengerequest',
            msg: {
                toAttest: [],
                correspondenceId: "102e2e52-9fe7-40a9-84cd-a87f73e6bb04",
                postEndpoint: "pentest.identityservice.careerwallet.devinnohub.nl/verifiable-presentations",
                proof: {
                    type: "secp256k1Signature2019",
                    created: "2020-03-17T10:53:26.264Z",
                    verificationMethod: "3594fcca53fa20253894a76da22c9b9ace355bc477731629d0d617211be9de506246b93cbccea2969cf85dc7994784e333704011883ee38db977a56214a9c7b2",
                    nonce: "61e9c20d-35c8-46b8-a156-7009126bfea3",
                    signatureValue: "b0991b05bde3eb3a49115f6663f13f9abeb59de090a3657eda70b87dc7d5373011cb75387735e08f9b84ea35d5140922a9fe4af37a5b1076d7f051b5fa709468"
                },
            }
        });

        const result = await checkVerifiersPlugin.handleEvent(ulaMessage, null);

        assert.equal(result, 'ignored');
    });

    it('should ignore when toVerify field in the message has empty array', async () => {
        const ulaMessage = new Message({
            type: 'after-challengerequest',
            msg: {
                toAttest: [],
                toVerify: [],
                correspondenceId: "102e2e52-9fe7-40a9-84cd-a87f73e6bb04",
                postEndpoint: "pentest.identityservice.careerwallet.devinnohub.nl/verifiable-presentations",
                proof: {
                    type: "secp256k1Signature2019",
                    created: "2020-03-17T10:53:26.264Z",
                    verificationMethod: "3594fcca53fa20253894a76da22c9b9ace355bc477731629d0d617211be9de506246b93cbccea2969cf85dc7994784e333704011883ee38db977a56214a9c7b2",
                    nonce: "61e9c20d-35c8-46b8-a156-7009126bfea3",
                    signatureValue: "b0991b05bde3eb3a49115f6663f13f9abeb59de090a3657eda70b87dc7d5373011cb75387735e08f9b84ea35d5140922a9fe4af37a5b1076d7f051b5fa709468"
                },
            }
        });

        const result = await checkVerifiersPlugin.handleEvent(ulaMessage, null);

        assert.equal(result, 'ignored');
    });
});
