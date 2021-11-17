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
        try{
            const res = await axios.post(this.auth_url, user_data);
            try{
                const token = res.data.data.token;
                return token
            }catch (error){
                return res.status
            }
        }catch (err){
            return {'Err_sending_request': err}
        }
        
    };

    create_connection(){
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(this.server_url)
            .configureLogging(signalR.LogLevel.Error)
            .build();
        return connection;
    };
    async config_connection(token){
        const connection = this.create_connection();
        connection.on("welcome", (res) => {
            this.messages['welcome'] = res
            connection.off('welcome')
            
        });
        connection.on("asset-list", (res) => {
            this.messages['asset-list'] = res
            connection.off('asset-list')
            

        });
        connection.on("spot-insrument-list", (res) => {
            this.messages['spot-insrument-list'] = res
            connection.off('spot-insrument-list')
            


        });
        connection.on("spot-wallet-balances", (res) => {
            this.messages['spot-wallet-balances'] = res
            connection.off('spot-wallet-balances')
            

        });
        connection.on("spot-active-orders", (res) => {
            this.messages['spot-active-orders'] = res
            connection.off('spot-active-orders')
            

        });
        connection.on("market-reference", (res) => {
            this.messages['market-reference'] = res
            connection.off('market-reference')
            


        });
        connection.on("key-values", (res) => {
            this.messages['key-values'] = res
            connection.off('key-values')
            


        });
        connection.on("base-prices", (res) => {
            this.messages['base-prices'] = res
            connection.off('base-prices')
            


        });
        connection.on("prices-base-currency", (res) => {
            this.messages['prices-base-currency'] = res
            connection.off('prices-base-currency')
            


        });

        await connection.start();
        await connection.send('init', token);        
        return new Promise((resolve) => {
            let counter = 0;
            let intervalId = setInterval(() => {
                counter++
                if(Object.keys(this.messages).length == 8) {
                    resolve({'status': 1, 'data': this.messages, 'intervalId': intervalId, 'connection': connection});
                }else if(counter > 6){
                    resolve({'status': 0, 'data': this.messages, 'intervalId': intervalId, 'connection': connection})
                }
            }, 1000);
          });
    }
}

module.exports = Connector;
