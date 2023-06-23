import { getLogger } from 'log4js';
import { ECHATMETHOD } from '../enums/chat.enum';
import Chatroom from './chat-room.define';
import Onlinepeer from './peer.define';
import RoomBase from './room-base.define';
import { faker } from '@faker-js/faker';

const logger = getLogger('ChatroomController');

export const createMockOnlineroom = (roomStatusInterval: number) => {
  return new Onlineroom(faker.string.uuid(), roomStatusInterval);
};

export const createMockOnlinerooms = (length: number, roomStatusInterval: number) => {
  return Array.from({ length }).map(() => createMockOnlineroom(roomStatusInterval));
};

export default class Onlineroom
  extends RoomBase {
  public override peers = new Map<string, Onlinepeer> ();
  public override rooms = new Map<string, Chatroom> ();

  constructor(
    public override id: string, // the room id
    private roomStatusInterval: number
  ) {
    super(id);
    logger.info('Onlineroom:constructor() [roomId:"%s"]', id);

    setInterval(() => {
      let all = 0;
      let closed = 0;

      this.rooms.forEach(room => {
        all++;
        if (room.closed) {
          closed++;
        }

        room.checkDeserted();// check if empty room
        logger.debug(
          JSON.stringify(
            room.statusReport()));
      });

      logger.info(
        'chatroom total: %s, closed: %s',
        all,
        closed
      );
    }, this.roomStatusInterval * 1000);
  }

  static create(roomId: string, roomStatusInterval: number) {
    logger.info('Onlineroom:create() [roomId:"%s"]', roomId);
    return new Onlineroom(
      roomId,
      roomStatusInterval);
  }

  public async nowhandleSocketRequest(
    peer: Onlinepeer,
    request,
    cb
  ) {
    switch (request.method as ECHATMETHOD) {
      case ECHATMETHOD.JOIN:
      {
        if (peer.joined) {
          cb(null, { joined: true });
          break;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-array-constructor
        const peerInfos = new Array<any>();

        this.peers.forEach(joinedPeer => {
          peerInfos.push(joinedPeer.peerInfo());
        });

        cb(null, { peers: peerInfos, joined: false });

        this.nownotification(
          peer.socket,
          'newMainPeer',
          { ...peer.peerInfo() },
          true
        );

        logger.debug(
          'Onlineroom:nowhandleSocketRequest:: - peer joined [peer: "%s"]',
          peer.id);

        peer.joined = true;
        break;
      }

      case ECHATMETHOD.CLOSE_PEER:
      {
        logger.info('Onlineroom:nowhandleSocketRequest:: - CLOSE_PEER, main peer: %s', peer.id);
        peer.close();
        cb();
        break;
      }

      case ECHATMETHOD.NEW_ROOM:
      {
        const { roomId, userId, to } = request.data;
        let room = this.rooms
          .get(roomId as string);

        if (!room) {
          logger.info(
            'Onlineroom:nowhandleSocketRequest:: - creating a new ChatroomController [roomId:"%s"]',
            roomId
          );
          room = new Chatroom(
        roomId as string,
        userId as string,
        this.callBacFn
          );
          this.rooms
            .set(roomId as string, room);
        }

        let newPeer = room.getPeer(
					userId as string
        );

        if (!newPeer) {
          newPeer = new Onlinepeer(
            userId,
            peer.socket,
            room
          );
          room.handlePeer(peer);
          logger.info(
            'Onlineroom:nowhandleSocketRequest:: - new peer, %s, %s',
            userId,
            peer.socket.id
          );
        } else {
          newPeer.handlePeerReconnect(peer.socket);
          logger.info(
            'Onlineroom:nowhandleSocketRequest:: - peer reconnect, %s, %s',
            userId,
            peer.socket.id
          );
        }

        if (to === 'all') {
          this.nownotification(peer.socket, ECHATMETHOD.ROOM_CREATED, request.data, true);
        } else {
          const toPeer = this.getPeer(to);
          if (toPeer) {
            this.nownotification(peer.socket, ECHATMETHOD.ROOM_CREATED, request.data, false);
          }
        }
        this.nownotification(peer.socket, ECHATMETHOD.UPDATE_ROOMS_ON_NEW, request.data, true);
        cb();
        break;
      }
    }
    return new Promise(resolve => resolve(true));
  }

  callBacFn = (eventName: string, data) => {
    this.emit(eventName, data);
  };
}
