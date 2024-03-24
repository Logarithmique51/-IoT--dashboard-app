/* eslint-disable prettier/prettier */
/* eslint-disable lines-between-class-members */
import * as aedes from 'aedes';
import Aedes from 'aedes/types/instance';
import * as net from 'net';
import IoTClient from './IoTClient';

export default class IoTServer {
  ip: string;
  port: number;
  static username: string;
  static password: string;
  aedes: Aedes;
  server: net.Server;
  client : IoTClient;

  constructor(
    ip: string,
    port: number,
    username: string,
    password: string,
    authenticatefn: aedes.AuthenticateHandler | undefined,
  ) {
    this.ip = ip;
    this.port = port;
    IoTServer.username = username;
    IoTServer.password = password;
    this.aedes = aedes.createBroker({
      authenticate: authenticatefn || IoTServer.authHandler,
    });
    this.server = net.createServer(this.aedes.handle);
    this.server.listen(this.port, this.ip, () => {
      console.log(`IotServer started on ${  this.ip  }:${  this.port}`);
    });
    this.server.on('error', (err) => {
      console.log(err);
    });
    this.client = new IoTClient(`mqtt://${this.ip}`,this.port,IoTServer.username,IoTServer.password);
  }

  static authHandler(
    client: aedes.Client,
    username: Readonly<string | undefined>,
    password: Readonly<Buffer | undefined>,
    done: (
      error: aedes.AuthenticateError | null,
      success: boolean | null,
    ) => void,
  ) {
    if (
      IoTServer.username === username?.toString() &&
      IoTServer.password === password?.toString()
    ) {
      done(null, true);
    } else {
      done(
        {
          message: 'Invalid',
          returnCode: aedes.AuthErrorCode.BAD_USERNAME_OR_PASSWORD,
          name: 'BAD',
        },
        false,
      );
    }
  }
}
