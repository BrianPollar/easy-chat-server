import Chatroom, { InowhandleSocketRequestRes } from './chat-room.define';
import Onlinepeer from './peer.define';
import RoomBase from './room-base.define';
export declare const onlineRoomLogger: import("log4js").Logger;
export default class Onlineroom extends RoomBase {
    id: string;
    private roomStatusInterval;
    peers: Map<string, Onlinepeer>;
    rooms: Map<string, Chatroom>;
    constructor(id: string, // the room id
    roomStatusInterval: number);
    static create(roomId: string, roomStatusInterval: number): Onlineroom;
    nowhandleSocketRequest(peer: Onlinepeer, request: any, cb: any): Promise<InowhandleSocketRequestRes>;
    callBacFn: (eventName: string, data: any) => void;
}
