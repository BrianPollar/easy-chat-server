/**
 * This file defines the types used for chat messages and chat room events.
 */
import { ECHATMETHOD } from '../enums/chat.enum';

/**
  * The status of a chat message.
  */
export type TchatMsgStatus =
   'sent' |
   'pending' |
   'failed' |
   'recieved' |
   'viewed';

/**
  * The sender of a chat message.
  */
export type TchatMsgWho =
   'me' |
   'partner';

/**
  * The type of a chat room event.
  */
export type TroomEvent = ECHATMETHOD;

// Example:
// const message = {
//   id: '1234567890',
//   peerInfo: {
//     id: 'my-id',
//     photo: 'my-photo',
//     name: 'My Name',
//   },
//   roomId: 'my-room-id',
//   msg: 'Hello, world!',
//   createTime: new Date(),
//   who: TchatMsgWho.me,
//   status: TchatMsgStatus.sent,
// };
