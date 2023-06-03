import * as http from 'http';
import * as https from 'https';
import { Server, Socket } from 'socket.io';
import { getLogger } from 'log4js';
import Onlineroom from './defines/online-room.define';
import Onlinepeer from './defines/peer.define';
import { IsocketConfig } from './interfaces/socket.interface';
const logger = getLogger('WebsocketServer');

export class EasyChat {
  // general room on initial connect
  onlineRoom: Onlineroom;
  io: Server;

  constructor(
    private httpsServer: https.Server | http.Server,
    private roomStatusInterval: number,
    private socketConfig: Partial<IsocketConfig>
  ) {
    // Log rooms status
    setInterval(() => {
      let active = false;
      if (this.onlineRoom) {
        this.onlineRoom.checkDeserted();// check if empty room
        logger.debug(
          JSON.stringify(
            this.onlineRoom.statusReport()));
        active = true;
      }

      logger.info(
        'onlineRoom active: %s',
        active
      );
    }, this.roomStatusInterval * 1000);
  }

  /** Run web Socket server
   * This handles real time communication
   * This mostly handles media server rtc
   * connection operations
   */
  run() {
    this.io = new Server(this.httpsServer, {
    // io = socketio.listen(httpsServer, {
    /** cors: {
			origin: 'http://localhost:8080',
			methods: ['GET', 'POST']
		},**/
      pingTimeout: this.socketConfig.pingTimeout || 3000,
      pingInterval: this.socketConfig.pingInterval || 5000,
      transports: this.socketConfig.transports || ['websocket'],
      allowUpgrades: this.socketConfig.allowUpgrades || false
    });

    logger.info('run websocket server....');

    this.io.on('connection', (socket: Socket) => {
      this.handleMainConnection(socket);
    });
  }

  emitEvent(eventName: string, data){
    this.onlineRoom.emit(eventName, data)
  }

  private handleMainConnection(socket: Socket) {
    const { userId } = socket.handshake.query;
    if (!userId) {
      logger.warn(
        `handleMainConnection:: connection
					request without
					userId`);
      socket.disconnect(true);// disconnect on missing parameter
      return;
    }

    if (!this.onlineRoom) {
      logger.info(
        'creating a new Onlineroom');
      this.onlineRoom = new Onlineroom(
        'mainonlineroom',
        this.roomStatusInterval
      );
    }

    let peer = this.onlineRoom.getPeer(
			userId as string
    );

    if (!peer) {
      peer = new Onlinepeer(
					userId as string,
					socket,
					this.onlineRoom
      );
      this.onlineRoom.handlePeer(peer);
      logger.info(
        'new peer, %s, %s',
        userId,
        socket.id
      );
    } else {
      peer.handlePeerReconnect(socket, true);
      logger.info(
        'WebsocketServer:handleMainConnection:: - peer reconnect, %s, %s',
        userId,
        socket.id
      );
    }
  }
}
