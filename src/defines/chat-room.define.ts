/* eslint-disable @typescript-eslint/dot-notation */
import { getLogger } from 'log4js';
import { TroomEvent } from '../easy-chat';
import { ECHATMETHOD } from '../enums/chat.enum';
import { IchatMsg } from '../interfaces/chat.interface';
import Onlinepeer from './peer.define';
import RoomBase from './room-base.define';

export interface InowhandleSocketRequestRes {
  // Indicates whether the request was successful.
  success: boolean;

  // The error message, if any.
  err: string;

  // The message to be sent to the client.
  msg: string;
}

const logger = getLogger('Chatroom');

export default class Chatroom
  extends RoomBase {
  // born at
  // the time the chatroom was created
  protected override bornTime = Date.now();

  // the string that is used to identify requests to this chatroom.
  protected override reqString = 'mainrequest';

  // the string that is used to identify notifications from this chatroom.
  protected override notifString = 'mainnotification';

  constructor(
    public override id: string, // the room id
    public userId: string,
    private cb: (...args) => void
  ) {
    super(id);
    logger.info('Chatroom:constructor() [roomId:"%s"]', id);
  }

  static create(
    roomId: string,
    userId: string,
    cb: (...args) => void
  ) {
    logger.info('Chatroom:create:: - create() [roomId:"%s"]', roomId);

    return new Chatroom(
      roomId, userId, cb);
  }

  // eslint-disable-next-line max-statements
  public async nowhandleSocketRequest(
    peer: Onlinepeer,
    request,
    cb
  ): Promise<InowhandleSocketRequestRes> {
    const res: InowhandleSocketRequestRes = {
      success: true,
      err: '',
      msg: ''
    };
    switch (request.method as ECHATMETHOD) {
      case ECHATMETHOD.JOIN:
      {
        if (peer.joined) {
          res.success = true;
          res.msg = 'JOINED_ALREADY';
          cb(null, { joined: true });
          break;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-array-constructor
        const peerInfos = new Array<any>();

        this.peers.forEach(joinedPeer => {
          peerInfos.push(joinedPeer.peerInfo());
        });

        res.msg = 'SUCCESS';

        cb(null, { peers: peerInfos, joined: false });

        this.nownotification(
          peer.socket,
          'newPeer',
          { ...peer.peerInfo() },
          true
        );

        logger.debug(
          'Chatroom:nowhandleSocketRequest:: - peer joined [peer: "%s"]',
          peer.id);

        peer.joined = true;
        break;
      }

      case ECHATMETHOD.CLOSE_PEER:
      {
        logger.info('Chatroom:nowhandleSocketRequest:: - CLOSE_PEER, peer: %s', peer.id);
        res.msg = 'SUCCESS';
        cb();
        peer.leaveRoom();
        break;
      }

      case ECHATMETHOD.CHAT_MESSAGE:
      {
        const { id, chatMessage, createTime, to, whoType, roomId } = request.data;

        if (roomId !== this.id) {
          res.msg = 'ROOM_ID_EXISTS';
          cb();
          return;
        }
        const msg: IchatMsg = {
          id,
          peerInfo: peer.id,
          roomId: this.id,
          msg: chatMessage,
          createTime,
          recieved: [],
          viewed: [],
          who: 'me',
          whoType,
          status: 'sent',
          deleted: false
        } as unknown as IchatMsg;
        this.emitEvent(request.method, msg);
        if (to === 'all') {
          this.nownotification(peer.socket, ECHATMETHOD.CHAT_MESSAGE, request.data, true);
        } else {
          const toPeer = this.getPeer(to);
          if (toPeer) {
            this.nownotification(toPeer.socket, ECHATMETHOD.CHAT_MESSAGE, request.data, false);
          }
        }
        res.msg = 'SUCCESS';
        cb();

        break;
      }

      case ECHATMETHOD.DELETE_MESSAGE:
      {
        const { to, deleted, id } = request.data;
        this.emitEvent(request.method, { to, deleted, id });
        if (to === 'all') {
          this.nownotification(peer.socket, ECHATMETHOD.DELETE_MESSAGE, request.data, true);
        } else {
          const toPeer = this.getPeer(to);
          if (toPeer) {
            this.nownotification(toPeer.socket, ECHATMETHOD.DELETE_MESSAGE, request.data, false);
          }
        }
        res.msg = 'SUCCESS';
        cb();
        break;
      }
      case ECHATMETHOD.UPDATE_ROOM:
      {
        const { to, roomData, add } = request.data;
        if (roomData) {
          this.emitEvent(request.method, { to, roomData, add });
        }
        if (to === 'all') {
          this.nownotification(peer.socket, ECHATMETHOD.UPDATE_ROOM, request.data, true);
        } else {
          const toPeer = this.getPeer(to);
          if (toPeer) {
            this.nownotification(toPeer.socket, ECHATMETHOD.UPDATE_ROOM, request.data, false);
          }
        }
        res.msg = 'SUCCESS';
        cb();
        break;
      }
      case ECHATMETHOD.DELETE_ROOM:
      {
        const { to } = request.data;
        if (to === 'all') {
          this.nownotification(peer.socket, ECHATMETHOD.DELETE_ROOM, request.data, true);
        } else {
          const toPeer = this.getPeer(to);
          if (toPeer) {
            this.nownotification(toPeer.socket, ECHATMETHOD.DELETE_ROOM, request.data, false);
          }
        }
        res.msg = 'SUCCESS';
        cb();
        break;
      }
      case ECHATMETHOD.UPDATE_STATUS:
      {
        const { to, id, status, statusField, statusQuo } = request.data;
        this.emitEvent(request.method, { to, id, status, statusField, statusQuo });
        if (to === 'all') {
          this.nownotification(peer.socket, ECHATMETHOD.UPDATE_STATUS, request.data, true);
        } else {
          const toPeer = this.getPeer(to);
          if (toPeer) {
            this.nownotification(toPeer.socket, ECHATMETHOD.UPDATE_STATUS, request.data, false);
          }
        }
        res.msg = 'SUCCESS';
        cb();
        break;
      }
      case ECHATMETHOD.PEER_UPDATE: {
        const { to, peerInfo } = request.data;
        this.emitEvent(request.method, { to, peerInfo });
        if (to === 'all') {
          this.nownotification(peer.socket, ECHATMETHOD.PEER_UPDATE, request.data, true);
        } else {
          const toPeer = this.getPeer(to);
          if (toPeer) {
            this.nownotification(toPeer.socket, ECHATMETHOD.PEER_UPDATE, request.data, false);
          }
        }
        res.msg = 'SUCCESS';
        cb();
        break;
      }
    }
    return new Promise(resolve => resolve(res));
  }

  protected emitEvent(eventName: TroomEvent, data?) {
    this.cb(eventName, data);
  }
}
