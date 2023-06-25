import { expect, describe, beforeEach, it, afterAll } from 'vitest';
import Onlinepeer from '../../../src/defines/peer.define';
import { constructSocketServer } from '../../integration-tests/websocket.test';
import { Socket } from 'socket.io';
import { EasyChat } from '../../../src/websocket';
import { faker } from '@faker-js/faker';
import { createMockChatroom } from '../../../src/easy-chat';
import Chatroom from '../../../src/defines/chat-room.define';

describe('Onlinepeer', () => {
  let easyChatInstance: EasyChat;
  let instance: Onlinepeer;
  let serverSocket: Socket;
  let chatRoomInstance: Chatroom;
  const callBacFn = (...args) => {

  };

  beforeEach((done: any) => {
    chatRoomInstance = createMockChatroom(callBacFn);
    const { easyChat } = constructSocketServer();
    easyChatInstance = easyChat;
    easyChatInstance.io.on('connection', (socket: Socket) => {
      serverSocket = socket;
      instance = new Onlinepeer(faker.string.uuid(), serverSocket, chatRoomInstance);
      done();
    });
  });

  afterAll(() => {
    serverSocket.disconnect();
    easyChatInstance.io.close();
  });

  it('should be a real instance Onlinepeer', () => {
    expect(instance).toBeInstanceOf(Onlinepeer);
  });

  it('should be a real instance Onlinepeer', () => {
    expect(easyChatInstance).toBeInstanceOf(EasyChat);
  });

  it('should have properties undefined', () => {
    expect(serverSocket).toBeDefined();
  });

  it('should have properties defined', () => {
    expect(instance.joined).toBeDefined();
    expect(instance.closed).toBeDefined();
    expect(instance.disconnectCheck).toBeDefined();
    expect(instance.enterTime).toBeDefined();
    expect(instance.lastSeen).toBeDefined();
    expect(instance.id).toBeDefined();
    expect(instance.socket).toBeDefined();
    expect(instance.room).toBeDefined();
  });


  it('should have auto methods to have beeen called', () => {

  });

  it('should close peer', () => {
    instance.close();
    expect(instance.closed).toBe(true);
  });

  it('leave room', () => {
    instance.leaveRoom();
    expect(instance.closed).toBe(true);
  });

  it('should checkClose', () => {
    instance.checkClose();
    expect(instance.checkClose).toHaveBeenCalled();
  });

  it('should return peer info', () => {
    const peerInfo = instance.peerInfo();
    expect(peerInfo.id).toBeDefined();
    expect(peerInfo.durationTime).toBeDefined();
  });
});
