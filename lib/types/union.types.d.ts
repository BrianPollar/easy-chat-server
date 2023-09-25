/**
 * This file defines the types used for chat messages and chat room events.
 */
import { ECHATMETHOD } from '../enums/chat.enum';
/**
  * The status of a chat message.
  */
export type TchatMsgStatus = 'sent' | 'pending' | 'failed' | 'recieved' | 'viewed';
/**
  * The sender of a chat message.
  */
export type TchatMsgWho = 'me' | 'partner';
/**
  * The type of a chat room event.
  */
export type TroomEvent = ECHATMETHOD;
