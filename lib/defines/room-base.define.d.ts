// / <reference types="node" />
import { EventEmitter } from 'events';
import { Socket } from 'socket.io';
import Onlinepeer from './peer.define';
import Chatroom from './chat-room.define';
import { ECHATMETHOD } from '../enums/chat.enum';
export default abstract class RoomBase extends EventEmitter {
  id: string;
  peers: Map<string, Onlinepeer>;
  rooms: Map<string, Chatroom>;
  /** if room is closed or not */
  closed: boolean;
  /** room active time */
  activeTime: number;
  protected bornTime: number;
  protected reqString: string;
  protected notifString: string;
  constructor(id: string);
  setupSocketHandler(peer: Onlinepeer): void;
  handlePeer(peer: Onlinepeer): void;
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
