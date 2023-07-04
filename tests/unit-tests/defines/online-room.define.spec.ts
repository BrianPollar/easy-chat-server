import { Socket } from 'socket.io';
import { expect, describe, beforeEach, it, afterAll } from 'vitest';
import Onlineroom, { createMockOnlineroom } from '../../../src/defines/online-room.define';
import Onlinepeer from '../../../src/defines/peer.define';
import { ECHATMETHOD } from '../../../src/easy-chat';
import { EasyChat } from '../../../src/websocket';
import { constructSocketServer } from '../../integration-tests/websocket.test';

describe('Onlineroom', () => {
  let onlinePeer: Onlinepeer;
  let easyChatInstance: EasyChat;
  let callbackArgs: any[];
  const callBacFn = (...args) => {
    callbackArgs = args;
  };

  let instance: Onlineroom;
  let serverSocket: Socket;

  beforeEach((done: any) => {
    instance = createMockOnlineroom(100);
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

  it('its real instance of Onlineroom', () => {
    expect(instance).toBeInstanceOf(Onlineroom);
  });


  it('should have properties defined', () => {
    expect(instance).toHaveProperty('id');
    expect(instance).toHaveProperty('roomStatusInterval');
    expect(instance).toHaveProperty('peers');
    expect(instance).toHaveProperty('rooms');
    expect(instance.peers).toBeDefined();
    expect(instance.rooms).toBeDefined();
    expect(instance.peers).toBeInstanceOf(Map);
    expect(instance.rooms).toBeInstanceOf(Map);
  });

  it('#nowhandleSocketRequest should make JOIN room request', async() => {
    const joinReq = await instance.nowhandleSocketRequest(onlinePeer, ECHATMETHOD.JOIN, callBacFn);
    expect(joinReq).toHaveProperty('success');
    expect(joinReq.success).toBe(true);
    expect(onlinePeer.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make JOIN room request', async() => {
    const closePeerReq = await instance.nowhandleSocketRequest(onlinePeer, ECHATMETHOD.CLOSE_PEER, callBacFn);
    expect(closePeerReq).toHaveProperty('success');
    expect(closePeerReq.success).toBe(true);
    expect(onlinePeer.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make JOIN room request', async() => {
    const sendMsgReq = await instance.nowhandleSocketRequest(onlinePeer, ECHATMETHOD.NEW_ROOM, callBacFn);
    expect(sendMsgReq).toHaveProperty('success');
    expect(sendMsgReq.success).toBe(true);
    expect(onlinePeer.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
  });

  it('#callBacFn should call emit events for nodejs', () => {
    instance.callBacFn('event', {});
    expect(instance.emit).toHaveBeenCalled();
  });
});
