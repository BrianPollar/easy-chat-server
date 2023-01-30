"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const log4js_1 = require("log4js");
const chat_enum_1 = require("../enums/chat.enum");
const chat_room_define_1 = tslib_1.__importDefault(require("./chat-room.define"));
const peer_define_1 = tslib_1.__importDefault(require("./peer.define"));
const room_base_define_1 = tslib_1.__importDefault(require("./room-base.define"));
const logger = (0, log4js_1.getLogger)('ChatroomController');
class Onlineroom extends room_base_define_1.default {
    constructor(id, // the room id
    roomStatusInterval) {
        super(id);
        this.id = id;
        this.roomStatusInterval = roomStatusInterval;
        this.peers = new Map();
        this.rooms = new Map();
        this.callBacFn = (eventName, data) => {
            this.emit(eventName, data);
        };
        logger.info('Onlineroom:constructor() [roomId:"%s"]', id);
        setInterval(() => {
            let all = 0;
            let closed = 0;
            this.rooms.forEach(room => {
                all++;
                if (room.closed) {
                    closed++;
                }
                room.checkDeserted(); // check if empty room
                logger.debug(JSON.stringify(room.statusReport()));
            });
            logger.info('chatroom total: %s, closed: %s', all, closed);
        }, this.roomStatusInterval * 1000);
    }
    static create(roomId, roomStatusInterval) {
        logger.info('Onlineroom:create() [roomId:"%s"]', roomId);
        return new Onlineroom(roomId, roomStatusInterval);
    }
    async nowhandleSocketRequest(peer, request, cb) {
        switch (request.method) {
            case chat_enum_1.ECHATMETHOD.JOIN:
                {
                    if (peer.joined) {
                        cb(null, { joined: true });
                        break;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-array-constructor
                    const peerInfos = new Array();
                    this.peers.forEach(joinedPeer => {
                        peerInfos.push(joinedPeer.peerInfo());
                    });
                    cb(null, { peers: peerInfos, joined: false });
                    this.nownotification(peer.socket, 'newMainPeer', { ...peer.peerInfo() }, true);
                    logger.debug('Onlineroom:nowhandleSocketRequest:: - peer joined [peer: "%s"]', peer.id);
                    peer.joined = true;
                    break;
                }
            case chat_enum_1.ECHATMETHOD.CLOSE_PEER:
                {
                    logger.info('Onlineroom:nowhandleSocketRequest:: - CLOSE_PEER, main peer: %s', peer.id);
                    peer.close();
                    cb();
                    break;
                }
            case chat_enum_1.ECHATMETHOD.NEW_ROOM:
                {
                    const { roomId, userId, to } = request.data;
                    let room = this.rooms
                        .get(roomId);
                    if (!room) {
                        logger.info('Onlineroom:nowhandleSocketRequest:: - creating a new ChatroomController [roomId:"%s"]', roomId);
                        room = new chat_room_define_1.default(roomId, userId, this.callBacFn);
                        this.rooms
                            .set(roomId, room);
                    }
                    let newPeer = room.getPeer(userId);
                    if (!newPeer) {
                        newPeer = new peer_define_1.default(userId, peer.socket, room);
                        room.handlePeer(peer);
                        logger.info('Onlineroom:nowhandleSocketRequest:: - new peer, %s, %s', userId, peer.socket.id);
                    }
                    else {
                        newPeer.handlePeerReconnect(peer.socket);
                        logger.info('Onlineroom:nowhandleSocketRequest:: - peer reconnect, %s, %s', userId, peer.socket.id);
                    }
                    if (to === 'all') {
                        this.nownotification(peer.socket, chat_enum_1.ECHATMETHOD.ROOM_CREATED, request.data, true);
                    }
                    else {
                        const toPeer = this.getPeer(to);
                        if (toPeer) {
                            this.nownotification(peer.socket, chat_enum_1.ECHATMETHOD.ROOM_CREATED, request.data, false);
                        }
                    }
                    this.nownotification(peer.socket, chat_enum_1.ECHATMETHOD.UPDATE_ROOMS_ON_NEW, request.data, true);
                    cb();
                    break;
                }
        }
        return new Promise(resolve => resolve(true));
    }
}
exports.default = Onlineroom;
//# sourceMappingURL=online-room.define.js.map