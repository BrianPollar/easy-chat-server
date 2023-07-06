import { Socket } from 'socket.io';
import { EventEmitter } from 'events';
import { getLogger } from 'log4js';
import Chatroom from './chat-room.define';
import Onlineroom from './online-room.define';
import { faker } from '@faker-js/faker';

const logger = getLogger('Onlinepeer');

export const createMockPeer = (socket: Socket, room: Chatroom | Onlineroom) => {
  return new Onlinepeer(
    faker.string.uuid(),
    socket,
    room
  );
};

export const createMockPeers = (length: number, socket: Socket, room: Chatroom | Onlineroom) => {
  return Array.from({ length }).map(() => createMockPeer(socket, room));
};

export default class Onlinepeer
  extends EventEmitter {
  /** rooms a peer has */
  // rooms = new Map<string, ChatroomController> ();
  /** if peer has joined main room */
  joined = false;
  address: string;
  /** if peer is closed or not */
  closed = false;
  /** check disconnect counter value */
  disconnectCheck = 0;
  intervalHandler;

  /** peers joining time */
  enterTime = Date.now();
  lastSeen = new Date();

  constructor(
    public id: string,
    public socket: Socket,
    public room: Chatroom | Onlineroom
  ) {
    super();
    logger.info('Onlinepeer:constructor() [id:"%s", socket:"%s"]', id, socket.id);
    this.address = socket.handshake.address;
    this.setMaxListeners(Infinity);
    this.handlePeer();
  }

  /** close peer object */
  close() {
    logger.info('Onlinepeer:close:: - peer %s call close()', this.id);
    this.closed = true;
    this.lastSeen = new Date();
    this.closeResource();
    if (this.socket) {
      this.socket.disconnect(true);
    }

    if (this.intervalHandler) {
      clearInterval(this.intervalHandler);
    }
    this.emit('mainclose');
  }

  leaveRoom() {
    logger.info('Onlinepeer:close:: - peer %s call leaveRoom()', this.id);
    this.closed = true;
    this.closeResource();
    this.socket.leave(this.room.id);
    if (this.intervalHandler) {
      clearInterval(this.intervalHandler);
    }
    this.emit('close');
  }

  /** handle if peer attempts to
   * reconnect to a room
   */
  public handlePeerReconnect(socket: Socket, isMain = false) {
    this.socket.leave(this.room.id);
    if (isMain) {
      this.socket.disconnect(true);
    }
    logger.info('Onlinepeer:handlePeerReconnect:: - peer %s reconnnected! disconnect previous connection now.', this.id);

    this.socket = socket;
    this.socket.join(this.room.id);
    console.log('HANDLING SOMETHING');
    this.room.setupSocketHandler(this as any);
    this.handlePeer();
  }

  /** listen to socket disconnect and
   * error for the peer object
   */
  public handlePeer() {
    this.socket.on('disconnect', (reason) => {
      if (this.closed) {
        return;
      }
      logger.debug('Onlinepeer:handlePeer:: - "socket disconnect" event [id:%s], reason: %s', this.id, reason);


      this.disconnectCheck = 0;
      if (this.intervalHandler) {
        clearInterval(this.intervalHandler);
      }

      this.intervalHandler = setInterval(() => {
        this.checkClose();
      }, 20000);
    });

    this.socket.on('error', (error) => {
      logger.info('Onlinepeer:handlePeer:: - socket error, peer: %s, error: %s', this.id, error);
    });
  }

  /** close peer if disconnectCheck
   * is greater 6
   */
  public checkClose() {
    if (!this.socket.connected) {
      this.disconnectCheck++;
    } else {
      clearInterval(this.intervalHandler);
      this.intervalHandler = null;
    }

    if (this.disconnectCheck > 6) {
      this.close();
    }
  }


  /** returns peer info */
  peerInfo() {
    const peerInfo = {
      id: this.id,
      // roler: this.roler,
      // displayName: this.displayName,
      // picture: this.picture,
      // platform: this.platform,
      address: this.address,
      durationTime: (Date.now() - this.enterTime) / 1000
    };

    logger.info('Onlinepeer:peerInfo:: - returning peer info', peerInfo);
    return peerInfo;
  }

  protected closeResource() {}
}
