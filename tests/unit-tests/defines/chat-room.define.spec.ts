/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import Chatroom, { createMockChatroom } from '../../../src/defines/chat-room.define';
import { faker } from '@faker-js/faker';
import { ECHATMETHOD } from '../../../src/easy-chat';
import { createMockPeerinfo } from 'easy-chat-client/src/defines/chat-room.define';
import Onlinepeer from '../../../src/defines/peer.define';
import { Socket } from 'socket.io';

const socketMock = {
  broadcast: {
    to: vi.fn()
  },
  emit: vi.fn()
} as unknown as Socket;

const peerMock = {
  id: faker.string.uuid(),
  joined: false,
  socket: socketMock,
  leaveRoom: vi.fn(),
  peerInfo: () => {
    return createMockPeerinfo();
  }
} as unknown as Onlinepeer;


describe('Chatroom', () => {
  let callbackArgs: any[];
  let callbackEventArgs: any[];

  const callBacFn = (...args) => {
    callbackArgs = args;
  };

  const callBackEventFn = (...args) => {
    callbackEventArgs = args;
  };

  let instance: Chatroom;

  beforeEach(() => {
    instance = createMockChatroom(callBackEventFn);
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

  it('#nowhandleSocketRequest should make JOIN room request', async() => {
    // @ts-ignore
    const nownotificationSpy = vi.spyOn(instance, 'nownotification').mockImplementationOnce(() => undefined);
    const request = {
      method: ECHATMETHOD.JOIN,
      data: { }
    };
    const joinReq = await instance
      .nowhandleSocketRequest(peerMock, request, callBacFn);
    expect(joinReq).toHaveProperty('success');
    expect(joinReq.success).toBe(true);
    expect(nownotificationSpy).toHaveBeenCalled();
    expect(peerMock.joined).toBe(true);
    expect(callbackArgs).toBeDefined();
  });

  it('#nowhandleSocketRequest should make close peer request', async() => {
    const request = {
      method: ECHATMETHOD.CLOSE_PEER,
      data: { }
    };
    const closePeerReq = await instance.nowhandleSocketRequest(peerMock, request, callBacFn);
    expect(closePeerReq).toHaveProperty('success');
    expect(closePeerReq.success).toBe(true);
    expect(peerMock.joined).toBe(true);
    expect(callbackArgs).toBeDefined();
  });

  it('#nowhandleSocketRequest should make chat message send request', async() => {
    // @ts-ignore
    const nownotificationSpy = vi.spyOn(instance, 'nownotification').mockImplementationOnce(() => undefined);
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
      .nowhandleSocketRequest(peerMock, request, callBacFn);
    expect(sendMsgReq).toHaveProperty('success');
    expect(sendMsgReq.success).toBe(true);
    expect(peerMock.joined).toBe(true);
    expect(callbackArgs).toBeDefined();
    expect(callbackEventArgs).toBeDefined();
    expect(callbackEventArgs[0]).toBe(ECHATMETHOD.CHAT_MESSAGE);
    expect(callbackEventArgs[1]).toHaveProperty('id');
    expect(nownotificationSpy).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make delete message request', async() => {
    // @ts-ignore
    const nownotificationSpy = vi.spyOn(instance, 'nownotification').mockImplementationOnce(() => undefined);
    const request = {
      method: ECHATMETHOD.DELETE_MESSAGE,
      data: {
        to: 'all',
        deleted: true,
        id: faker.string.uuid()
      }
    };
    const deleteMsgReq = await instance.nowhandleSocketRequest(peerMock, request, callBacFn);
    expect(deleteMsgReq).toHaveProperty('success');
    expect(deleteMsgReq.success).toBe(true);
    expect(peerMock.joined).toBe(true);
    expect(callbackEventArgs).toBeDefined();
    expect(callbackEventArgs).toBeDefined();
    expect(callbackEventArgs[0]).toBe(ECHATMETHOD.DELETE_MESSAGE);
    expect(callbackEventArgs[1]).toHaveProperty('id');
    expect(callbackEventArgs[1]).toHaveProperty('to');
    expect(callbackEventArgs[1]).toHaveProperty('deleted');
    expect(nownotificationSpy).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make update room request', async() => {
    // @ts-ignore
    const nownotificationSpy = vi.spyOn(instance, 'nownotification').mockImplementationOnce(() => undefined);
    const request = {
      method: ECHATMETHOD.UPDATE_ROOM,
      data: {
        to: 'all',
        roomData: instance,
        add: false
      }
    };
    const updateRoomReq = await instance
      .nowhandleSocketRequest(peerMock, request, callBacFn);
    expect(updateRoomReq).toHaveProperty('success');
    expect(updateRoomReq.success).toBe(true);
    expect(peerMock.joined).toBe(true);
    expect(callbackEventArgs).toBeDefined();
    expect(callbackArgs).toBeDefined();
    expect(callbackEventArgs[0]).toBe(ECHATMETHOD.UPDATE_ROOM);
    expect(callbackEventArgs[1]).toHaveProperty('to');
    expect(callbackEventArgs[1]).toHaveProperty('roomData');
    expect(callbackEventArgs[1]).toHaveProperty('add');
    expect(nownotificationSpy).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make delete room request', async() => {
    // @ts-ignore
    const nownotificationSpy = vi.spyOn(instance, 'nownotification').mockImplementationOnce(() => undefined);
    const request = {
      method: ECHATMETHOD.DELETE_ROOM,
      data: {
        to: 'all'
      }
    };
    const deleteRoomReq = await instance
      .nowhandleSocketRequest(peerMock, request, callBacFn);
    expect(deleteRoomReq).toHaveProperty('success');
    expect(deleteRoomReq.success).toBe(true);
    expect(peerMock.joined).toBe(true);
    expect(callbackArgs).toBeDefined();
    expect(nownotificationSpy).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make update peer request', async() => {
    // @ts-ignore
    const nownotificationSpy = vi.spyOn(instance, 'nownotification').mockImplementationOnce(() => undefined);
    const request = {
      method: ECHATMETHOD.PEER_UPDATE,
      data: {
        to: 'all',
        peerInfo: null // TODO
      }
    };
    const updatePeerReq = await instance
      .nowhandleSocketRequest(peerMock, request, callBacFn);
    expect(updatePeerReq).toHaveProperty('success');
    expect(updatePeerReq.success).toBe(true);
    expect(peerMock.joined).toBe(true);
    expect(callbackEventArgs).toBeDefined();
    expect(callbackEventArgs).toBeDefined();
    expect(callbackEventArgs[0]).toBe(ECHATMETHOD.PEER_UPDATE);
    expect(callbackEventArgs[1]).toHaveProperty('to');
    expect(callbackEventArgs[1]).toHaveProperty('peerInfo');
    expect(nownotificationSpy).toHaveBeenCalled();
  });

  it('#emitEvent should call the callback function', () => {
    const peer = createMockPeerinfo();
    // @ts-ignore
    instance.emitEvent(ECHATMETHOD.NEW_PEER, peer);
    expect(callbackEventArgs).toBeDefined();
    expect(callbackEventArgs).toBeDefined();
  });
});

