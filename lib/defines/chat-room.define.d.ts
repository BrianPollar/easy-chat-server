import { TroomEvent } from '../easy-chat';
import Onlinepeer from './peer.define';
import RoomBase from './room-base.define';
export interface InowhandleSocketRequestRes {
    success: boolean;
    err: string;
    msg: string;
}
export default class Chatroom extends RoomBase {
    id: string;
    userId: string;
    private cb;
    protected bornTime: number;
    protected reqString: string;
    protected notifString: string;
    constructor(id: string, // the room id
    userId: string, cb: (...args: any[]) => void);
    static create(roomId: string, userId: string, cb: (...args: any[]) => void): Chatroom;
    nowhandleSocketRequest(peer: Onlinepeer, request: any, cb: any): Promise<InowhandleSocketRequestRes>;
    protected emitEvent(eventName: TroomEvent, data?: any): void;
}
