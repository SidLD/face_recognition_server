import { Server as SocketIOServer } from 'socket.io';
import {io as IoClient} from 'socket.io-client'
let io:any; 
const SERVER_URI = process.env.SERVER_URI as string
const FRONT_URI = process.env.FRONT_URI as string
const SOCKET_TOKEN = process.env.SOCKET_TOKEN as string

const allowedOrigins = [
  SERVER_URI,
  FRONT_URI
];
console.log(allowedOrigins)
export const initializeSocket = (server:any) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use(( _socket:any, next:any) => {
    next()
  })
  .on('connection', (socket:any) => {
    console.log('New Socket connected')
    socket.on(`notification`, async (data: any) => {
      console.log("New Data", JSON.stringify(data));
      socket.broadcast.emit(`user`, JSON.stringify(data));
    });

    socket.on('disconnect', async () => {
      console.log(`Socket is disconnected`);
    });
  });

  return io;
};

export const getSocketIOInstance = () => io;

export const emitNotification = async (data:any) => {
  try {
    const SocketInstance = IoClient(SERVER_URI, {
      auth: { 
        token: SOCKET_TOKEN
       },
      withCredentials: true,
    });
    await new Promise<void>((resolve, reject) => {
      SocketInstance.on('connect', () => {
        resolve();
      });
      SocketInstance.on('connect_error', (err) => {
        console.log("test", err)
        reject(err);
      });
    }).then(() => {
      SocketInstance.emit(`notification`, data, (response:any) => {
        console.log('Response from server:', response);
        SocketInstance.disconnect()
      });
    });  
  } catch (error) {
    console.log(error);
  }
};