const signalR = require("@microsoft/signalr");
var Connector = require('./index')
var expect = require('chai').expect





describe('Tests of messages from signalR hubs', () => {
    let token;
    let signalClass;
    let conn;
    before(async () => {
        signalClass = new Connector();
        token = await signalClass.get_auth_token();
        conn = await signalClass.create_connection();
        signalClass.config_connection();
        let counter;
        let id = setInterval(() => {
            counter++;
            console.log(`Keys in interval: ${Object.keys(signalClass.get_messages())}`)
            let messages = signalClass.get_messages();
            if(Object.keys(messages) == 9){
                clearInterval(id);
            }
            if(counter > 6){
                //pass
            }
        }, 2000)
    });

    afterEach(async () => {
        await conn.stop();
    });

    it('Tests of message from asset-list hub', (done) => {
            console.log(Object.keys(signalClass.get_messages()))
    });
});