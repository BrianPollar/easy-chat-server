import { expect, describe, beforeEach, it, afterAll } from 'vitest';
import { EasyChat } from '../../src/easy-chat';
import { constructSocketServer } from '../integration-tests/websocket.test';
import { EasyChatClient } from 'easy-chat-client/src/websocket';
import { ChatRoom } from 'easy-chat-client/src/defines/chat-room.define';
import { EasyChatController } from 'easy-chat-client/src/controllers/chat.controller';
import { faker } from '@faker-js/faker';

describe('EasyChat end to end', () => {
  let easyChatInstance: EasyChat;
  let easyChatClientInstance: EasyChatClient;
  let easyChatControllerInstance: EasyChatController;

  let activeRoom: ChatRoom;

  beforeEach(() => {
    const { easyChat, easyChatClient, easyChatController } = constructSocketServer();
    easyChatInstance = easyChat;
    easyChatClientInstance = easyChatClient;
    easyChatControllerInstance = easyChatController;
  });

  afterAll(() => {
    // easyChatInstance.io.close();
    easyChatClientInstance.disconectSocket();
  });

  it('#easyChatInstance must be an intsance of EasyChat', () => {
    expect(easyChatInstance).toBeInstanceOf(EasyChat);
  });

  it('#easyChatClientInstance must be an intsance of EasyChatClient', () => {
    expect(easyChatClientInstance).toBeInstanceOf(EasyChatClient);
  });

  it('#easyChatControllerInstance must be an intsance of EasyChatController', () => {
    expect(easyChatControllerInstance).toBeInstanceOf(EasyChatController);
  });

  it('EasyChatClient should have mode undefined', () => {
    expect(EasyChatClient.mode).toBeDefined();
  });

  it('#easyChatInstance should have properties undefined', () => {
    expect(easyChatInstance.onlineRoom).toBeUndefined();
  });

  it('#easyChatClientInstance should bear connected socket', () => {
    expect(easyChatClientInstance.isSocketConnected()).toBe(true);
  });

  it('#easyChatControllerInstance should have activeUsers defined', () => {
    expect(easyChatClientInstance.activeUsers).toBeDefined();
    expect(easyChatClientInstance.activeUsers).toBe(typeof Map);
  });

  it('#easyChatControllerInstanceshould levy socket connection in the oreder of test', () => {
    expect(easyChatControllerInstance.joinMainRoom).toHaveBeenCalled();
    expect(easyChatControllerInstance.joinMain).toHaveBeenCalled();
    expect(easyChatControllerInstance.determinLocalPeerInfo).toHaveBeenCalled();
  });

  it('#easyChatClientInstance should see changes in the following properties', () => {
    expect(easyChatClientInstance.activeUsers.size).toBeGreaterThan(0);
  });

  it('#easyChatControllerInstance should make JOIN room request', async() => {
    activeRoom = createChatRoom();
    const joinReq = await easyChatControllerInstance.newRoom(activeRoom);
    expect(joinReq).toBe(null);
    expect(easyChatClientInstance.sendOnlineSoloRequest).toHaveBeenCalled();
    expect(easyChatControllerInstance.joinRoom).toHaveBeenCalled();
    expect(easyChatControllerInstance.determinLocalPeerInfo).toHaveBeenCalled();
    expect(easyChatControllerInstance.activeRoom.peers).toBe(typeof Array.isArray);
    expect(easyChatControllerInstance.activeRoom.peers.length).toBeGreaterThan(0);
  });

  it('#easyChatInstance should recieve JOIN room request', () => {
    expect(easyChatInstance.onlineRoom).toBeUndefined();
    expect(easyChatInstance.onlineRoom.nowhandleSocketRequest).toHaveBeenCalled();
    expect(easyChatInstance.onlineRoom.rooms).toBeDefined();
    expect(easyChatInstance.onlineRoom.rooms).toBe(typeof Map);
    expect(easyChatInstance.onlineRoom.peers).toBeDefined();
    expect(easyChatInstance.onlineRoom.rooms).toBe(typeof Map);
    expect(easyChatInstance.onlineRoom.rooms.size).toBeGreaterThan(0);
    expect(easyChatInstance.onlineRoom.peers.size).toBeGreaterThan(0);
  });

  it('#easyChatControllerInstance should make send message request', async() => {
    const message = faker.string.alphanumeric();
    const sent = await easyChatControllerInstance.send(message);
    expect(sent).toBe(null);
    expect(easyChatControllerInstance.scrollToLast).toHaveBeenCalled();
    expect(easyChatControllerInstance.determinLocalPeerInfo).toHaveBeenCalled();
  });

  it('#easyChatInstance should recieve make send message request', () => {
    expect(easyChatInstance.onlineRoom.rooms.get(activeRoom.id)?.nowhandleSocketRequest).toHaveBeenCalled();
  });

  it('#easyChatControllerInstance should make update message status request', async() => {
    const status = 'received';
    const message = easyChatControllerInstance.messages[0];
    const sent = await easyChatControllerInstance.updateStatus(status as any, message);
    expect(sent).toBe(true);
    expect(message.status).toBe(status);
  });

  it('#easyChatInstance should recieve update message status request', () => {
    expect(easyChatInstance.onlineRoom.rooms.get(activeRoom.id)?.nowhandleSocketRequest).toHaveBeenCalled();
  });

  it('#easyChatControllerInstance should make updatePeer request', async() => {
    const peerInfo = activeRoom.peers[0];
    const updated = await easyChatControllerInstance.updatePeer(peerInfo);
    expect(updated).toBe(null);
    expect(easyChatControllerInstance.activeRoom.getPeerInfo).toHaveBeenCalled();
  });

  it('#easyChatInstance should recieve updatePeer request', () => {
    expect(easyChatInstance.onlineRoom.rooms.get(activeRoom.id)?.nowhandleSocketRequest).toHaveBeenCalled();
  });
});
