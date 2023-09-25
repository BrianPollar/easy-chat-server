import { TchatMsgStatus, TchatMsgWho } from '../types/union.types';
/**
 * This interface defines the properties of a chat message.
 */
export interface IchatMsg {
    /**
     * The unique ID of the chat message.
     */
    id: string;
    /**
     * The peer information of the sender of the chat message.
     */
    peerInfo?: IpeerInfo;
    /**
     * The ID of the chat room that the chat message belongs to.
     */
    roomId: string;
    /**
     * The message content.
     */
    msg: string;
    /**
     * The time when the chat message was created.
     */
    createTime: Date;
    /**
     * The sender of the chat message.
     */
    who: TchatMsgWho;
    /**
     * The status of the chat message.
     */
    status: TchatMsgStatus;
    /**
     * Whether the chat message has been deleted.
     */
    deleted: boolean;
}
/**
 * This interface defines the properties of a chat room.
 */
export interface IchatRoom {
    /**
     * The unique ID of the chat room.
     */
    id: string;
    /**
     * The time when the chat room was created.
     */
    createTime: Date;
    /**
     * The time when the chat room was last active.
     */
    lastActive: Date;
    /**
     * The list of peers in the chat room.
     */
    peers: IpeerInfo[];
    /**
     * The list of blocked peers in the chat room.
     */
    blocked: string[];
    /**
     * The number of unseen messages in the chat room.
     */
    unviewedMsgsLength?: number;
    /**
     * The type of the chat room.
     */
    type: string;
    /**
     * Any additional properties of the chat room.
     */
    extras?: any;
    /**
     * Whether the chat room is closed.
     */
    closed: boolean;
}
/**
 * This interface defines the properties of a peer in a chat room.
 */
export interface IpeerInfo {
    /**
     * The unique ID of the peer.
     */
    id: string;
    /**
     * The photo of the peer.
     */
    photo: string;
    /**
     * The name of the peer.
     */
    name: string;
    /**
     * Whether the peer is a room admin.
     */
    roomAdmin: boolean;
    /**
     * Whether the peer is online.
     */
    online: boolean;
    /**
     * The number of unseen messages for the peer.
     */
    unviewedMsgsLength: number;
}
