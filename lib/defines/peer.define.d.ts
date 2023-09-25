/// <reference types="node" />
import { Socket } from 'socket.io';
import { EventEmitter } from 'events';
import Chatroom from './chat-room.define';
import Onlineroom from './online-room.define';
export declare const createMockPeer: (socket: Socket, room: Chatroom | Onlineroom) => Onlinepeer;
export declare const createMockPeers: (length: number, socket: Socket, room: Chatroom | Onlineroom) => Onlinepeer[];
export default class Onlinepeer extends EventEmitter {
    id: string;
    socket: Socket;
    room: Chatroom | Onlineroom;
    /** rooms a peer has */
    /** if peer has joined main room */
    joined: boolean;
    address: string;
    /** if peer is closed or not */
    closed: boolean;
    /** check disconnect counter value */
    disconnectCheck: number;
    intervalHandler: any;
    /** peers joining time */
    enterTime: number;
    lastSeen: Date;
    constructor(id: string, socket: Socket, room: Chatroom | Onlineroom);
    /** close peer object */
    close(): void;
    leaveRoom(): void;
    /** handle if peer attempts to
     * reconnect to a room
     */
    handlePeerReconnect(socket: Socket, isMain?: boolean): void;
    /** listen to socket disconnect and
     * error for the peer object
     */
    handlePeer(): void;
    /** close peer if disconnectCheck
     * is greater 6
     */
    checkClose(): void;
    /** returns peer info */
    peerInfo(): {
        id: string;
        address: string;
        durationTime: number;
    };
    protected closeResource(): void;
}
