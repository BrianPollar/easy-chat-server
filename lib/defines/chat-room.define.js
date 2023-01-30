"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/dot-notation */
const log4js_1 = require("log4js");
const chat_enum_1 = require("../enums/chat.enum");
const room_base_define_1 = tslib_1.__importDefault(require("./room-base.define"));
const logger = (0, log4js_1.getLogger)('Chatroom');
class Chatroom extends room_base_define_1.default {
    constructor(id, // the room id
    userId, cb) {
        super(id);
        this.id = id;
        this.userId = userId;
        this.cb = cb;
        // born at
        this.bornTime = Date.now();
        this.reqString = 'mainrequest';
        this.notifString = 'mainnotification';
        logger.info('Chatroom:constructor() [roomId:"%s"]', id);
    }
    static create(roomId, userId, cb) {
        logger.info('Chatroom:create:: - create() [roomId:"%s"]', roomId);
        return new Chatroom(roomId, userId, cb);
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
                    this.nownotification(peer.socket, 'newPeer', { ...peer.peerInfo() }, true);
                    logger.debug('Chatroom:nowhandleSocketRequest:: - peer joined [peer: "%s"]', peer.id);
                    peer.joined = true;
                    break;
                }
            case chat_enum_1.ECHATMETHOD.CLOSE_PEER:
                {
                    logger.info('Chatroom:nowhandleSocketRequest:: - CLOSE_PEER, peer: %s', peer.id);
                    cb();
                    peer.leaveRoom();
                    break;
                }
            case chat_enum_1.ECHATMETHOD.CHAT_MESSAGE:
                {
                    const { id, chatMessage, createTime, to, whoType, roomId } = request.data;
                    console.log('MAY BE THIS ALSO GETS THAT SHIT', request.data);
                    console.log('AND WE THERE HAVE THE ID', this.id);
                    if (roomId !== this.id) {
                        cb();
                        return;
                    }
                    const msg = {
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
                    };
                    this.emitEvent(request.method, msg);
                    if (to === 'all') {
                        this.nownotification(peer.socket, chat_enum_1.ECHATMETHOD.CHAT_MESSAGE, request.data, true);
                    }
                    else {
                        const toPeer = this.getPeer(to);
                        if (toPeer) {
                            this.nownotification(toPeer.socket, chat_enum_1.ECHATMETHOD.CHAT_MESSAGE, request.data, false);
                        }
                    }
                    cb();
                    break;
                }
            case chat_enum_1.ECHATMETHOD.DELETE_MESSAGE:
                {
                    const { to, deleted, id } = request.data;
                    this.emitEvent(request.method, { to, deleted, id });
                    if (to === 'all') {
                        this.nownotification(peer.socket, chat_enum_1.ECHATMETHOD.DELETE_MESSAGE, request.data, true);
                    }
                    else {
                        const toPeer = this.getPeer(to);
                        if (toPeer) {
                            this.nownotification(toPeer.socket, chat_enum_1.ECHATMETHOD.DELETE_MESSAGE, request.data, false);
                        }
                    }
                    cb();
                    break;
                }
            case chat_enum_1.ECHATMETHOD.UPDATE_ROOM:
                {
                    const { to, roomData, add } = request.data;
                    if (roomData) {
                        this.emitEvent(request.method, { to, roomData, add });
                    }
                    if (to === 'all') {
                        this.nownotification(peer.socket, chat_enum_1.ECHATMETHOD.UPDATE_ROOM, request.data, true);
                    }
                    else {
                        const toPeer = this.getPeer(to);
                        if (toPeer) {
                            this.nownotification(toPeer.socket, chat_enum_1.ECHATMETHOD.UPDATE_ROOM, request.data, false);
                        }
                    }
                    cb();
                    break;
                }
            case chat_enum_1.ECHATMETHOD.DELETE_ROOM:
                {
                    const { to } = request.data;
                    if (to === 'all') {
                        this.nownotification(peer.socket, chat_enum_1.ECHATMETHOD.DELETE_ROOM, request.data, true);
                    }
                    else {
                        const toPeer = this.getPeer(to);
                        if (toPeer) {
                            this.nownotification(toPeer.socket, chat_enum_1.ECHATMETHOD.DELETE_ROOM, request.data, false);
                        }
                    }
                    cb();
                    break;
                }
            case chat_enum_1.ECHATMETHOD.UPDATE_STATUS:
                {
                    const { to, id, status, statusField, statusQuo } = request.data;
                    this.emitEvent(request.method, { to, id, status, statusField, statusQuo });
                    if (to === 'all') {
                        this.nownotification(peer.socket, chat_enum_1.ECHATMETHOD.UPDATE_STATUS, request.data, true);
                    }
                    else {
                        const toPeer = this.getPeer(to);
                        if (toPeer) {
                            this.nownotification(toPeer.socket, chat_enum_1.ECHATMETHOD.UPDATE_STATUS, request.data, false);
                        }
                    }
                    cb();
                    break;
                }
            case chat_enum_1.ECHATMETHOD.PEER_UPDATE: {
                const { to, peerInfo } = request.data;
                this.emitEvent(request.method, { to, peerInfo });
                if (to === 'all') {
                    this.nownotification(peer.socket, chat_enum_1.ECHATMETHOD.PEER_UPDATE, request.data, true);
                }
                else {
                    const toPeer = this.getPeer(to);
                    if (toPeer) {
                        this.nownotification(toPeer.socket, chat_enum_1.ECHATMETHOD.PEER_UPDATE, request.data, false);
                    }
                }
                cb();
                break;
            }
        }
        return new Promise(resolve => resolve(true));
    }
    emitEvent(eventName, data) {
        this.cb(eventName, data);
    }
}
exports.default = Chatroom;
//# sourceMappingURL=chat-room.define.js.map