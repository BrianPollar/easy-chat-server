/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect, describe, beforeEach, it, afterAll } from 'vitest';
import Chatroom, { createMockChatroom } from '../../../src/defines/chat-room.define';
import { faker } from '@faker-js/faker';
import Onlinepeer, { createMockPeer } from '../../../src/defines/peer.define';
import { EasyChat, ECHATMETHOD } from '../../../src/easy-chat';
import { constructSocketServer } from '../../integration-tests/websocket.test';
import { Socket } from 'socket.io';
import { createMockPeerinfo } from 'easy-chat-client/src/defines/chat-room.define';

describe('Chatroom', () => {
  let onlinePeer: Onlinepeer;
  let easyChatInstance: EasyChat;
  let callbackArgs: any[];
  let callbackEventArgs: any[];
  const callBacFn = (...args) => {
    callbackArgs = args;
  };

  const callBackEventFn = (...args) => {
    callbackEventArgs = args;
  };

  let instance: Chatroom;
  let serverSocket: Socket;

  beforeEach((done: any) => {
    instance = createMockChatroom(callBackEventFn);
    const { easyChat } = constructSocketServer();
    easyChatInstance = easyChat;
    easyChatInstance.io.on('connection', (socket: Socket) => {
      serverSocket = socket;
      done();
    });
  });

  afterAll(() => {
    serverSocket.disconnect();
    easyChatInstance.io.close();
  });

  it('its real instance of Chatroom', () => {
    expect(instance).toBeInstanceOf(Chatroom);
  });

  it('#create static should create an instance of Chatroom', () => {
    const roomId = faker.string.uuid();
    const userId = faker.string.uuid();
    let localcallBacArgs: any[];
    const callBacFn = (...args) => {
      localcallBacArgs = args;
    };
    const room = Chatroom.create(roomId, userId, callBacFn);
    expect(room).toBeInstanceOf(Chatroom);
  });

  it('create a instance of onlinePeer', () => {
    const id = faker.string.uuid();
    onlinePeer = new Onlinepeer(id, serverSocket, instance);
  });

  it('#nowhandleSocketRequest should make JOIN room request', async() => {
    const request = {
      method: ECHATMETHOD.JOIN,
      data: { }
    };
    const joinReq = await instance
      .nowhandleSocketRequest(onlinePeer, request, callBacFn);
    expect(joinReq).toHaveProperty('success');
    expect(joinReq.success).toBe(true);
    expect(onlinePeer.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
    // @ts-ignore
    expect(instance.nownotification).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make close peer request', async() => {
    const request = {
      method: ECHATMETHOD.CLOSE_PEER,
      data: { }
    };
    const closePeerReq = await instance.nowhandleSocketRequest(onlinePeer, request, callBacFn);
    expect(closePeerReq).toHaveProperty('success');
    expect(closePeerReq.success).toBe(true);
    expect(onlinePeer.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make chat message send request', async() => {
    const request = {
      method: ECHATMETHOD.CHAT_MESSAGE,
      data: {
        id: faker.string.uuid(),
        chatMessage: faker.string.alphanumeric(),
        createTime: new Date(),
        to: 'all',
        whoType: '',
        roomId: instance.id
      }
    };
    const sendMsgReq = await instance
      .nowhandleSocketRequest(onlinePeer, request, callBacFn);
    expect(sendMsgReq).toHaveProperty('success');
    expect(sendMsgReq.success).toBe(true);
    expect(onlinePeer.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
    expect(callBackEventFn).toHaveBeenCalled();
    expect(callbackEventArgs).toBeDefined();
    expect(callbackEventArgs[0]).toBe(ECHATMETHOD.CHAT_MESSAGE);
    expect(callbackEventArgs[1]).toHaveProperty('id');
    // @ts-ignore
    expect(instance.nownotification).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make delete message request', async() => {
    const request = {
      method: ECHATMETHOD.DELETE_MESSAGE,
      data: {
        to: 'all',
        deleted: true,
        id: faker.string.uuid()
      }
    };
    const deleteMsgReq = await instance.nowhandleSocketRequest(onlinePeer, request, callBacFn);
    expect(deleteMsgReq).toHaveProperty('success');
    expect(deleteMsgReq.success).toBe(true);
    expect(onlinePeer.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
    expect(callBackEventFn).toHaveBeenCalled();
    expect(callbackEventArgs).toBeDefined();
    expect(callbackEventArgs[0]).toBe(ECHATMETHOD.DELETE_MESSAGE);
    expect(callbackEventArgs[1]).toHaveProperty('id');
    expect(callbackEventArgs[1]).toHaveProperty('to');
    expect(callbackEventArgs[1]).toHaveProperty('deleted');
    // @ts-ignore
    expect(instance.nownotification).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make update room request', async() => {
    const request = {
      method: ECHATMETHOD.UPDATE_ROOM,
      data: {
        to: 'all',
        roomData: instance,
        add: false
      }
    };
    const updateRoomReq = await instance
      .nowhandleSocketRequest(onlinePeer, request, callBacFn);
    expect(updateRoomReq).toHaveProperty('success');
    expect(updateRoomReq.success).toBe(true);
    expect(onlinePeer.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
    expect(callBackEventFn).toHaveBeenCalled();
    expect(callbackArgs).toBeDefined();
    expect(callbackEventArgs[0]).toBe(ECHATMETHOD.UPDATE_ROOM);
    expect(callbackEventArgs[1]).toHaveProperty('to');
    expect(callbackEventArgs[1]).toHaveProperty('roomData');
    expect(callbackEventArgs[1]).toHaveProperty('add');
    // @ts-ignore
    expect(instance.nownotification).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make delete room request', async() => {
    const request = {
      method: ECHATMETHOD.DELETE_ROOM,
      data: {
        to: 'all'
      }
    };
    const deleteRoomReq = await instance
      .nowhandleSocketRequest(onlinePeer, request, callBacFn);
    expect(deleteRoomReq).toHaveProperty('success');
    expect(deleteRoomReq.success).toBe(true);
    expect(onlinePeer.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
    // @ts-ignore
    expect(instance.nownotification).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make update peer request', async() => {
    const request = {
      method: ECHATMETHOD.PEER_UPDATE,
      data: {
        to: 'all',
        peerInfo: null // TODO
      }
    };
    const updatePeerReq = await instance
      .nowhandleSocketRequest(onlinePeer, request, callBacFn);
    expect(updatePeerReq).toHaveProperty('success');
    expect(updatePeerReq.success).toBe(true);
    expect(onlinePeer.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
    expect(callBackEventFn).toHaveBeenCalled();
    expect(callbackEventArgs).toBeDefined();
    expect(callbackEventArgs[0]).toBe(ECHATMETHOD.PEER_UPDATE);
    expect(callbackEventArgs[1]).toHaveProperty('to');
    expect(callbackEventArgs[1]).toHaveProperty('peerInfo');
    // @ts-ignore
    expect(instance.nownotification).toHaveBeenCalled();
  });

  it('#emitEvent should call the callback function', () => {
    // @ts-ignore
    const peer = createMockPeerinfo();
    // @ts-ignore
    instance.emitEvent(ECHATMETHOD.NEW_PEER, peer);
    expect(callBackEventFn).toHaveBeenCalled();
    expect(callbackEventArgs).toBeDefined();
    expect(callbackEventArgs[0]).toBe(ECHATMETHOD.NEW_PEER);
    expect(callbackEventArgs[1]).toBe(ECHATMETHOD.NEW_PEER);
  });
});

