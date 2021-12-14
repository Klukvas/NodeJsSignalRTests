const signalR = require("@microsoft/signalr");
var Connector = require('./index')
var expect = require('chai').expect
require('dotenv').config();
// var Mocha = require('mocha');
// var mocha = new Mocha({});
// mocha.setup('bdd');

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
        clientId = process.env.clientId
        clientWalletId = process.env.clientWalletId
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

    it('Check "welcome" Hub ', (done) => {
        let res = messagesObject.data['welcome']
        expect(res.data).to.be.eql(`Hello ${clientId}/${clientWalletId}`)
        expect(res).to.be.an('object').that.has.all.keys(
            'data', 'now'
        );
        done();

    });

    it('Check "spot-insrument-list" Hub ', (done) => {
        let res = messagesObject.data['spot-insrument-list']
        expect(res).to.be.an('object').that.has.all.keys(
            'spotInstruments', 'now'
        );
        expect(res.spotInstruments).to.be.an('array');
        for(let item of res.spotInstruments){
            expect(item).to.be.an('object').that.has.all.keys(
                'symbol',
                'baseAsset',
                'quoteAsset',
                'accuracy',
                'minVolume',
                'maxVolume',
                'maxOppositeVolume',
                'iconUrl'
            );
            expect(item.symbol).to.be.an('string');
            expect(item.baseAsset).to.be.an('string');
            expect(item.quoteAsset).to.be.an('string');
            expect(item.accuracy).to.be.an('number');
            expect(item.minVolume).to.be.an('number');
            expect(item.maxVolume).to.be.an('number');
            expect(item.maxOppositeVolume).to.be.an('number');
            expect(typeof item.iconUrl).to.be.oneOf(['object', "number"]);
        }
        done();

    });

    it('Check "spot-wallet-balances" Hub ', (done) => {
        let res = messagesObject.data['spot-wallet-balances']
        expect(res).to.be.an('object').that.has.all.keys(
            'balances'
        );
        expect(res.balances).to.be.an('array');
        for(let item of res.balances){
            expect(item).to.be.an('object').that.has.all.keys(
                'avgBuyingPrice',
                'apy',
                'apr',
                'accumulationAmount',
                'assetId',
                'balance',
                'reserve',
                'lastUpdate',
                'sequenceId'
            );
            expect(item.avgBuyingPrice).to.be.an('number');
            expect(item.apy).to.be.an('number');
            expect(item.accumulationAmount).to.be.an('number');
            expect(item.assetId).to.be.an('string');
            expect(item.balance).to.be.an('number');
            expect(item.reserve).to.be.an('number');
            expect(item.lastUpdate).to.be.an('string');
            expect(item.sequenceId).to.be.an('number');
        }
        done();

    });

    it('Check "market-reference" Hub ', (done) => {
        let res = messagesObject.data['market-reference']
        expect(res).to.be.an('object').that.has.all.keys(
            'references', 'now'
        );
        expect(res.references).to.be.an('array');
        for(let item of res.references){
            expect(item).to.be.an('object').that.has.all.keys(
                'id',
                'brokerId',
                'name',
                'iconUrl',
                'associateAsset',
                'associateAssetPair',
                'weight',
                'isMainNet'
            );
            expect(item.id).to.be.an('string');
            expect(item.brokerId).to.be.an('string');
            expect(item.iconUrl).to.be.an('string');
            expect(item.associateAsset).to.be.an('string');
            expect(item.associateAssetPair).to.be.an('string');
            expect(item.weight).to.be.an('number');
            expect(item.isMainNet).to.be.an('boolean');
        }
        done();

    });

    it('Check "prices-base-currency" Hub ', (done) => {
        let res = messagesObject.data['prices-base-currency']
        expect(res).to.be.an('object').that.has.all.keys(
            'P', 'now'
        );
        expect(res.P).to.be.an('array');
        for(let item of res.P){
            expect(item).to.be.an('object').that.has.all.keys(
                'S',
                'T',
                'P',
                'P24p',
                'P24a'
            );
            expect(item.S).to.be.an('string');
            expect(item.T).to.be.an('number');
            expect(item.P).to.be.an('number');
            expect(item.P24p).to.be.an('number');
            expect(item.P24a).to.be.an('number');
        }
        done();

    });

    it('Check "base-prices" Hub ', (done) => {
        let res = messagesObject.data['base-prices']

        expect(res).to.be.an('object').that.has.all.keys(
            'priceRecords', 'now'
        );
        expect(res.priceRecords).to.be.an('array');
        for(let item of res.priceRecords){
            expect(item).to.be.an('object').that.has.all.keys(
                'brokerId',
                'assetSymbol',
                'currentPrice',
                'h24P',
                'h24',
                'd7',
                'm1',
                'm3'
            );
            expect(item.brokerId).to.be.eql('jetwallet');
            expect(item.assetSymbol).to.be.an('string');
            expect(item.currentPrice).to.be.an('number');
            
            expect(item.h24P).to.be.an('number');

            expect(item.h24).to.be.an('object').that.has.all.keys(
                'price', 'recordTime'
            );
            expect(item.h24.price).to.be.an('number');
            expect(item.h24.recordTime).to.be.an('string');
            
            
            expect(item.d7).to.be.an('object').that.has.all.keys(
                'price', 'recordTime'
            );
            expect(item.d7.price).to.be.an('number');
            expect(item.d7.recordTime).to.be.an('string');

            
            expect(item.m1).to.be.an('object').that.has.all.keys(
                'price', 'recordTime'
            );
            expect(item.m1.price).to.be.an('number');
            expect(item.m1.recordTime).to.be.an('string');

            
            expect(item.m3).to.be.an('object').that.has.all.keys(
                'price', 'recordTime'
            );
            expect(item.m3.price).to.be.an('number');
            expect(item.m3.recordTime).to.be.an('string');

        }
        done();
    });

});

// mocha.run()