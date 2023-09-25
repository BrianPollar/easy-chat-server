/// <reference types="node" />
import { EventEmitter } from 'events';
import { Socket } from 'socket.io';
import Onlinepeer from './peer.define';
import Chatroom from './chat-room.define';
import { ECHATMETHOD } from '../enums/chat.enum';
export declare const createMockRoomBase: () => {
    id: string;
};
/**
 * This class is the base class for all chat rooms.
 */
export default abstract class RoomBase extends EventEmitter {
    id: string;
    /** The list of peers in the room. */
    peers: Map<string, Onlinepeer>;
    /** The list of chat rooms in the room. */
    rooms: Map<string, Chatroom>;
    /** If the room is closed or not. */
    closed: boolean;
    /** The time when the room was last active. */
    activeTime: number;
    /** The time when the room was created. */
    protected bornTime: number;
    protected reqString: string;
    protected notifString: string;
    /**
     * Constructs a new RoomBase instance.
     *
     * @param id The ID of the room.
     */
    constructor(id: string);
    /**
     * Sets up the socket handler for the room.
     *
     * @param peer The peer that the handler is being set up for.
     */
    setupSocketHandler(peer: Onlinepeer): void;
    /**
     * Handles a new peer joining the room.
     *
     * @param peer The peer that is joining the room.
     */
    handlePeer(peer: Onlinepeer): void;
    /**
     * The `getPeer()` method returns the peer with the specified ID, or `null` if the peer does not exist.
     * @param peerId The peerId for the return peer.
     */
    getPeer(peerId: string): Onlinepeer;
    close(): void;
    checkDeserted(): void;
    statusReport(): {
        id: string;
        peers: string[];
        duration: number;
        lastActive: number;
    };
    sendMsgToallpeers(peerId: string, method: ECHATMETHOD, data: any): void;
    protected nownotification(socket: Socket, method: any, data?: {}, broadcast?: boolean): void;
    private setActive;
    private checkEmpty;
    abstract nowhandleSocketRequest(peer: Onlinepeer, request: any, cb: any): Promise<any>;
}
