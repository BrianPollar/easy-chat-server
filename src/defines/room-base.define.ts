import { getLogger } from 'log4js';
import { EventEmitter } from 'events';
import { Socket } from 'socket.io';
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

/**
 * This class is the base class for all chat rooms.
 */
export default abstract class RoomBase
  extends EventEmitter {
  /** The list of peers in the room. */
  public peers = new Map<string, Onlinepeer> ();
  /** The list of chat rooms in the room. */
  public rooms = new Map<string, Chatroom> ();
  /** If the room is closed or not. */
  public closed = false;
  /** The time when the room was last active. */
  public activeTime = Date.now();
  /** The time when the room was created. */
  protected bornTime = Date.now();
  protected reqString = 'onlinerequest';
  protected notifString = 'mainnotification';

  /**
   * Constructs a new RoomBase instance.
   *
   * @param id The ID of the room.
   */
  constructor(
    public id: string // the room id
  ) {
    super();
    logger.info('RoomBase:constructor() [roomId:"%s"]', id);
  }

  /**
   * Sets up the socket handler for the room.
   *
   * @param peer The peer that the handler is being set up for.
   */
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

  /**
   * Handles a new peer joining the room.
   *
   * @param peer The peer that is joining the room.
   */
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

  /**
   * The `getPeer()` method returns the peer with the specified ID, or `null` if the peer does not exist.
   * @param peerId The peerId for the return peer.
   */
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

  public checkDeserted() {
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

  public statusReport() {
    const dura = Math.floor((Date.now() - this.bornTime) / 1000);
    const lastActive = Math.floor((Date.now() - this.activeTime) / 1000);

    return {
      id: this.id,
      peers: [...this.peers.keys()],
      duration: dura,
      lastActive
    };
  }

  public sendMsgToallpeers(
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
