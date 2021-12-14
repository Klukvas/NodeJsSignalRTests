var expect = require('chai').expect;
const signalR = require("@microsoft/signalr");
const axios = require('axios');
require('dotenv').config();
class Connector{

    constructor(){
        this.server_url = 'https://wallet-api-test.simple-spot.biz/signalr'
        this.auth_url = 'https://wallet-api-test.simple-spot.biz/auth/v1/Trader/Authenticate'
        this.email = 'qwe56@mailinator.com'
        this.password = 'testpassword1'
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

}
const conn = new Connector();

const initWS = async () => {
  const connection = conn.create_connection();
  const WSConnection = async () => {
    try {
      await connection.start();

      try {
        const token = await conn.get_auth_token();

        await connection.send("init", token, 'en', '');

        setInterval(() => {

          connection.send('ping')
        }, 3000)
      } catch (e) {
        console.log(e)
      }
    } catch (error) {
      console.log(error)
    }
  };

  WSConnection();


  connection.on("campaigns-banners", (res) => {
    for(const i of res.campaigns){
      console.log(i)
      console.log(i.conditions[0].params)
    }
  });
  

  connection.on("pong", (res) => {
    console.log(res);
  });

  connection.onclose((res) => {
    console.log(res);
  });
};

initWS();
