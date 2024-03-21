/* eslint-disable prettier/prettier */
/* eslint-disable lines-between-class-members */
import * as mqtt from 'mqtt';

export default class IoTClient{

  brokerIp : string;
  brokerPort : number;
  username : string;
  password : string;
  client : mqtt.MqttClient
  constructor(ip:string,port:number,username:string,password:string){
    this.brokerIp = ip;
    this.brokerPort = port;
    this.username = username;
    this.password = password;
    this.client = mqtt.connect(this.brokerIp,{
      port:this.brokerPort,
      username:this.username,
      password:this.password
    })

    this.client.on('connect',(packet)=>{
      console.log(packet);
      this.client.subscribe('#');
   })


    this.client.on('error',(error)=>{
      console.log(`Error client : ${ error}`)
    })
  }

}
