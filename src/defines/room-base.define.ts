import { getLogger } from 'log4js';
import { EventEmitter } from 'events';
import { Socket } from 'socket.io';
import { TroomEvent } from '../types/union.types';
import Onlinepeer from './peer.define';
import Chatroom from './chat-room.define';
import { ECHATMETHOD } from '../enums/chat.enum';
import { faker } from '@faker-js/faker';

const logger = getLogger('RoomBase');

export const createMockRoomBase = () => {
  return {
    id: faker.string.uuid()
  };
};

export default abstract class RoomBase
  extends EventEmitter {
  public peers = new Map<string, Onlinepeer> ();
  public rooms = new Map<string, Chatroom> ();
  /** if room is closed or not */
  public closed = false;
  /** room active time */
  public activeTime = Date.now();
  // born at
  protected bornTime = Date.now();
  protected reqString = 'onlinerequest';
  protected notifString = 'mainnotification';

  constructor(
    public id: string // the room id
  ) {
    super();
    logger.info('RoomBase:constructor() [roomId:"%s"]', id);
  }

  public setupSocketHandler(peer: Onlinepeer) {
    peer.socket.on(this.reqString, (request, cb) => {
      this.setActive();
      logger.debug(
        'RoomBase:setupSocketHandler:: - "request" event [room:"%s", method:"%s", peerId:"%s"]',
        this.id, request.method, peer.id);

      this.nowhandleSocketRequest(peer, request, cb)
        .catch(error => {
          logger.error('RoomBase:setupSocketHandler:: - "request" failed [error:"%o"]', error);
          cb(error);
        });
    });
  }

  public handlePeer(peer: Onlinepeer) {
    logger.info('handlePeer() id: %s, address: %s', peer.id, peer.socket.handshake.address);

    peer.socket.join(this.id);
    this.setupSocketHandler(peer);
    this.peers.set(peer.id, peer);

    peer.on('close', () => {
      logger.info('RoomBase:handlePeer:: - %s closed, room:  %s', peer.id, this.id);
      if (this.closed) {
        return;
      }

      this.nownotification(peer.socket, 'peerClosed', { peerId: peer.id }, true);
      this.peers.delete(peer.id);
      logger.error('GOING TO DELETE NOW', this.peers);
      if (this.checkEmpty()) {
        this.close();
      }
    });

    peer.on('mainclose', () => {
      logger.info('RoomBase:handlePeer:: - %s main closed, room:  %s', peer.id, this.id);
      if (this.closed) {
        return;
      }

      logger.error('GOING TO DELETE NOW, MMMMMAIIINNNYYYYYYY', this.peers);

      this.nownotification(peer.socket, 'mainPeerClosed', { peerId: peer.id }, true);
      this.peers.delete(peer.id);
      if (this.checkEmpty()) {
        this.close();
      }
    });
  }

  public getPeer(peerId: string) {
    return this.peers.get(peerId);
  }

  public close() {
    logger.info('RoomBase:close:: - close() room: %s', this.id);
    this.closed = true;

    this.peers.forEach(peer => {
      if (!peer.closed) {
        peer.close();
      }
    });

    this.peers.clear();
    this.emit('close');
  }

  checkDeserted() {
    if (this.checkEmpty()) {
      logger.info('RoomBase:checkDeserted:: - room %s is empty , now close it!', this.id);
      this.close();
      return;
    }

    const lastActive = (Date.now() - this.activeTime) / 1000; // seconds
    if (lastActive > 2 * 60 * 60) { // 2 hours not active
      logger.warn('RoomBase:checkDeserted:: - room %s too long no active!, now close it, lastActive: %s', this.id, lastActive);
      this.close();
    }
  }

  statusReport() {
    const dura = Math.floor((Date.now() - this.bornTime) / 1000);
    const lastActive = Math.floor((Date.now() - this.activeTime) / 1000);

    return {
      id: this.id,
      peers: [...this.peers.keys()],
      duration: dura,
      lastActive
    };
  }

  sendMsgToallpeers(
    peerId: string,
    method: ECHATMETHOD,
    data
  ) {
    const peer = this.peers.get(peerId);
    if (!peer) {
      return;
    }
    this.nownotification(
      peer.socket,
      method,
      data,
      true
    );
  }

  protected nownotification(socket: Socket, method, data = {}, broadcast = false) {
    if (broadcast) {
      socket.broadcast.to(this.id).emit(
        this.notifString, { method, data }
      );
    } else {
      socket.emit(this.notifString, { method, data });
    }
  }

  private setActive() {
    this.activeTime = Date.now();
  }

  private checkEmpty() {
    return this.peers.size === 0;
  }

  abstract nowhandleSocketRequest(
    peer: Onlinepeer,
    request,
    cb
  ): Promise<any>;
}
