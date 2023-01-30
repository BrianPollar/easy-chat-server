import { ECHATMETHOD } from "../enums/chat.enum";

export type TchatMsgStatus =
  'sent' |
  'pending' |
  'failed' |
  'recieved' |
  'viewed';


export type TchatMsgWho =
  'me' |
  'partner';

export type TroomEvent = ECHATMETHOD;
