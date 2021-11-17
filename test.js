const signalR = require("@microsoft/signalr");
var Connector = require('./index')
var expect = require('chai').expect


describe('Tests of auth(login)', () => {
    before(async () => {
        signalClass = new Connector();
        global.token = await signalClass.get_auth_token();
    });

    it('Check that token are correct', (done) => {
        expect(global.token).to.be.an('string');
        done()
    });
})

describe('Tests of messages from signalR hubs', () => {
    let signalClass;
    let messagesObject;
    before(async () => {
        signalClass = new Connector();
        messagesObject = await signalClass.config_connection(global.token);
        clearInterval(messagesObject.intervalId);
        messagesObject.connection.stop()
    });

    it('Tests of message from asset-list hub', (done) => {
        expect( Object.keys( messagesObject.data ) ).to.include('asset-list');
        expect(messagesObject.data['asset-list']).to.be.an('object').that.has.all.keys(
            'assets', 'now'
        );
        for(let item of messagesObject.data['asset-list']['assets']){
            expect(item).to.be.an('object').that.has.all.keys(
                "symbol",
                "description",
                "prefixSymbol",
                "accuracy",
                "depositMode",
                "withdrawalMode",
                "tagType",
                "iconUrl",
                "fees",
                "assetType",
                "isMainNet",
                "isEnabled",
                "depositMethods",
                "withdrawalMethods",
                "depositBlockchains",
                "withdrawalBlockchains"
            );
            expect(item.symbol).to.be.an('string');
            expect(item.description).to.be.an('string');
            expect(item.prefixSymbol).to.be.oneOf(["$", "€", null]);
            expect(item.accuracy).to.be.an('number');
            expect(item.depositMode).to.be.an('number');
            expect(item.withdrawalMode).to.be.an('number');
            expect(item.tagType).to.be.an('number');
            expect(item.iconUrl).to.be.an('string');
            expect(item.fees).to.be.an('object').that.has.all.keys(
                "withdrawalFee"
            );
            expect(typeof item.fees.withdrawalFee).to.be.oneOf(['object', "number"]);
            expect(item.assetType).to.be.an('string');
            expect(item.isMainNet).to.be.an('boolean');
            expect(item.isEnabled).to.be.an('boolean');
            expect(item.depositMethods).to.be.an('array');
            expect(item.withdrawalMethods).to.be.an('array');
            expect(item.depositBlockchains).to.be.an('array');
            expect(item.withdrawalBlockchains).to.be.an('array');
        }
        done();
    });
});