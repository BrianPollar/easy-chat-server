import { TchatMsgStatus, TchatMsgWho } from '../types/union.types';
export interface IchatMsg {
    id: string;
    peerInfo?: IpeerInfo;
    roomId: string;
    msg: string;
    createTime: Date;
    who: TchatMsgWho;
    status: TchatMsgStatus;
    deleted: boolean;
}
export interface IchatRoom {
    id: string;
    createTime: Date;
    lastActive: Date;
    peers: IpeerInfo[];
    blocked: string[];
    unviewedMsgsLength?: number;
    type: string;
    extras?: any;
    closed: boolean;
}
export interface IpeerInfo {
    id: string;
    photo: string;
    name: string;
    roomAdmin: boolean;
    online: boolean;
    unviewedMsgsLength: number;
}
