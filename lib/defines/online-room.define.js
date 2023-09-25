"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlineRoomLogger = void 0;
const tslib_1 = require("tslib");
const log4js_1 = require("log4js");
const chat_enum_1 = require("../enums/chat.enum");
const chat_room_define_1 = tslib_1.__importDefault(require("./chat-room.define"));
const peer_define_1 = tslib_1.__importDefault(require("./peer.define"));
const room_base_define_1 = tslib_1.__importDefault(require("./room-base.define"));
exports.onlineRoomLogger = (0, log4js_1.getLogger)('ChatroomController');
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
        exports.onlineRoomLogger.info('Onlineroom:constructor() [roomId:"%s"]', id);
        setInterval(() => {
            let all = 0;
            let closed = 0;
            this.rooms.forEach(room => {
                all++;
                if (room.closed) {
                    closed++;
                }
                room.checkDeserted(); // check if empty room
                exports.onlineRoomLogger.debug(JSON.stringify(room.statusReport()));
            });
            exports.onlineRoomLogger.info('chatroom total: %s, closed: %s', all, closed);
        }, this.roomStatusInterval * 1000);
    }
    static create(roomId, roomStatusInterval) {
        exports.onlineRoomLogger.info('Onlineroom:create() [roomId:"%s"]', roomId);
        return new Onlineroom(roomId, roomStatusInterval);
    }
    async nowhandleSocketRequest(peer, request, cb) {
        const res = {
            success: true,
            err: '',
            msg: ''
        };
        switch (request.method) {
            case chat_enum_1.ECHATMETHOD.JOIN:
                {
                    if (peer.joined) {
                        res.msg = 'JOINED_ALREADY';
                        cb(null, { joined: true });
                        break;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-array-constructor
                    const peerInfos = new Array();
                    this.peers.forEach(joinedPeer => {
                        peerInfos.push(joinedPeer.peerInfo());
                    });
                    res.msg = 'SUCCESS';
                    cb(null, { peers: peerInfos, joined: false });
                    this.nownotification(peer.socket, 'newMainPeer', { ...peer.peerInfo() }, true);
                    exports.onlineRoomLogger.debug('Onlineroom:nowhandleSocketRequest:: - peer joined [peer: "%s"]', peer.id);
                    peer.joined = true;
                    break;
                }
            case chat_enum_1.ECHATMETHOD.CLOSE_PEER:
                {
                    exports.onlineRoomLogger.info('Onlineroom:nowhandleSocketRequest:: - CLOSE_PEER, main peer: %s', peer.id);
                    peer.close();
                    res.msg = 'SUCCESS';
                    cb();
                    break;
                }
            case chat_enum_1.ECHATMETHOD.NEW_ROOM:
                {
                    const { roomId, userId, to } = request.data;
                    let room = this.rooms
                        .get(roomId);
                    if (!room) {
                        exports.onlineRoomLogger.info('Onlineroom:nowhandleSocketRequest:: - creating a new ChatroomController [roomId:"%s"]', roomId);
                        room = new chat_room_define_1.default(roomId, userId, this.callBacFn);
                        this.rooms
                            .set(roomId, room);
                    }
                    let newPeer = room.getPeer(userId);
                    if (!newPeer) {
                        newPeer = new peer_define_1.default(userId, peer.socket, room);
                        room.handlePeer(peer);
                        exports.onlineRoomLogger.info('Onlineroom:nowhandleSocketRequest:: - new peer, %s, %s', userId, peer.socket.id);
                    }
                    else {
                        newPeer.handlePeerReconnect(peer.socket);
                        exports.onlineRoomLogger.info('Onlineroom:nowhandleSocketRequest:: - peer reconnect, %s, %s', userId, peer.socket.id);
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
                    res.msg = 'SUCCESS';
                    cb();
                    break;
                }
        }
        return new Promise(resolve => resolve(res));
    }
}
exports.default = Onlineroom;
//# sourceMappingURL=online-room.define.js.map