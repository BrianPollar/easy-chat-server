/// <reference types="node" />
/// <reference types="node" />
import * as http from 'http';
import * as https from 'https';
import { Server } from 'socket.io';
import Onlineroom from './defines/online-room.define';
import { IsocketConfig } from './interfaces/socket.interface';
export default class EasyChat {
    private httpsServer;
    private roomStatusInterval;
    private socketConfig;
    onlineRoom: Onlineroom;
    io: Server;
    constructor(httpsServer: https.Server | http.Server, roomStatusInterval: number, socketConfig: Partial<IsocketConfig>);
    /** Run web Socket server
     * This handles real time communication
     * This mostly handles media server rtc
     * connection operations
     */
    run(): void;
    emitEvent(eventName: string, data: any): void;
    private handleMainConnection;
}
