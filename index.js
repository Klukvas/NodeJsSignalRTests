var expect = require('chai').expect;
const signalR = require("@microsoft/signalr");
const axios = require('axios');
require('dotenv').config();
class Connector{
    constructor(){
        this.server_url = process.env.server_url
        this.auth_url = process.env.auth_url
        this.email = process.env.email
        this.password = process.env.password
        this.messages = {}
    }
    async get_auth_token() {   
        const user_data = {
            email: this.email,
            password: this.password
        };
        const res = await axios.post(this.auth_url, user_data);
        try{
            const token = res.data.data.token;
            return token
        }catch (error){
            return res.status
        }
    };

    create_connection(){
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(this.server_url)
            .build();
        return connection;
    };
    async config_connection(){
        let counter = 0;
        const connection = this.create_connection();
        const token = await this.get_auth_token();
        connection.on("welcome", (res) => {
            this.messages['welcome'] = res
            connection.off('welcome')
            counter++
        });
        connection.on("asset-list", (res) => {
            this.messages['asset-list'] = res
            connection.off('asset-list')
            counter++

        });
        connection.on("spot-insrument-list", (res) => {
            this.messages['spot-insrument-list'] = res
            connection.off('spot-insrument-list')
            counter++


        });
        connection.on("spot-wallet-balances", (res) => {
            this.messages['spot-wallet-balances'] = res
            connection.off('spot-wallet-balances')
            counter++

        });
        connection.on("spot-active-orders", (res) => {
            this.messages['spot-active-orders'] = res
            connection.off('spot-active-orders')
            counter++

        });
        connection.on("market-reference", (res) => {
            this.messages['market-reference'] = res
            connection.off('market-reference')
            counter++


        });
        connection.on("key-values", (res) => {
            this.messages['key-values'] = res
            connection.off('key-values')
            counter++


        });
        connection.on("base-prices", (res) => {
            this.messages['base-prices'] = res
            connection.off('base-prices')
            counter++


        });
        connection.on("prices-base-currency", (res) => {
            this.messages['prices-base-currency'] = res
            connection.off('prices-base-currency')
            counter++


        });

        await connection.start();
        await connection.send('init', token);        
        return new Promise((resolve) => {
            let counter = 0;
            let intervalId = setInterval(() => {
                counter++
                console.log(`Counter1: ${counter}`)
                try{
                    if(Object.keys(this.messages).length == 9) {
                        resolve({'status': 1, 'data': this.messages, 'intervalId': intervalId, 'connection': connection});
                    }else if(counter > 6){
                        console.log(`Counter: ${counter}`)
                        resolve({'status': 0, 'data': this.messages, 'intervalId': intervalId, 'connection': connection})
                    }
                }catch(e1){
                    console.log(`e1: ${e1}`)
                }
              
            }, 1000);
          });
    }

    get_messages(){
        return this.messages
    }
}

module.exports = Connector;
let test = new Connector();
test.config_connection().then(
    mess=> {console.log(mess.status); clearInterval(mess.intervalId), mess.connection.stop()},
).catch(error => { throw error})
