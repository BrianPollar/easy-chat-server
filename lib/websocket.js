"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyChat = void 0;
const tslib_1 = require("tslib");
const socket_io_1 = require("socket.io");
const log4js_1 = require("log4js");
const online_room_define_1 = tslib_1.__importDefault(require("./defines/online-room.define"));
const peer_define_1 = tslib_1.__importDefault(require("./defines/peer.define"));
const logger = (0, log4js_1.getLogger)('WebsocketServer');
class EasyChat {
    constructor(httpsServer, roomStatusInterval, socketConfig) {
        this.httpsServer = httpsServer;
        this.roomStatusInterval = roomStatusInterval;
        this.socketConfig = socketConfig;
        // Log rooms status
        setInterval(() => {
            let active = false;
            if (this.onlineRoom) {
                this.onlineRoom.checkDeserted(); // check if empty room
                logger.debug(JSON.stringify(this.onlineRoom.statusReport()));
                active = true;
            }
            logger.info('onlineRoom active: %s', active);
        }, this.roomStatusInterval * 1000);
    }
    /** Run web Socket server
     * This handles real time communication
     * This mostly handles media server rtc
     * connection operations
     */
    run() {
        this.io = new socket_io_1.Server(this.httpsServer, {
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
        this.io.on('connection', (socket) => {
            this.handleMainConnection(socket);
        });
    }
    emitEvent(eventName, data) {
        this.onlineRoom.emit(eventName, data);
    }
    handleMainConnection(socket) {
        const { userId } = socket.handshake.query;
        if (!userId) {
            logger.warn(`handleMainConnection:: connection
					request without
					userId`);
            socket.disconnect(true); // disconnect on missing parameter
            return;
        }
        if (!this.onlineRoom) {
            logger.info('creating a new Onlineroom');
            this.onlineRoom = new online_room_define_1.default('mainonlineroom', this.roomStatusInterval);
        }
        let peer = this.onlineRoom.getPeer(userId);
        if (!peer) {
            peer = new peer_define_1.default(userId, socket, this.onlineRoom);
            this.onlineRoom.handlePeer(peer);
            logger.info('new peer, %s, %s', userId, socket.id);
        }
        else {
            peer.handlePeerReconnect(socket, true);
            logger.info('WebsocketServer:handleMainConnection:: - peer reconnect, %s, %s', userId, socket.id);
        }
    }
}
exports.EasyChat = EasyChat;
//# sourceMappingURL=websocket.js.map