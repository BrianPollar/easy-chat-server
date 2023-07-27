/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import Onlineroom, { createMockOnlineroom, onlineRoomLogger } from '../../../src/defines/online-room.define';
import { ECHATMETHOD } from '../../../src/easy-chat';
import { faker } from '@faker-js/faker';
import Onlinepeer from '../../../src/defines/peer.define';
import { createMockPeerinfo } from 'easy-chat-client/src/defines/chat-room.define';

const peerMock = {
  id: faker.string.uuid(),
  joined: false,
  socket: {
    id: faker.string.uuid(),
    handshake: {
      address: faker.internet.ip()
    },
    on: vi.fn(),
    join: vi.fn()
  },
  peerInfo: () => {
    return createMockPeerinfo();
  },
  close: vi.fn()
} as unknown as Onlinepeer;

describe('Onlineroom', () => {
  let callbackArgs: string | symbol[];
  const callBacFn = (...args) => {
    callbackArgs = args;
  };

  let instance: Onlineroom;

  beforeEach(() => {
    instance = createMockOnlineroom(100);
  });

  it('its real instance of Onlineroom', () => {
    expect(instance).toBeInstanceOf(Onlineroom);
  });

  it('should have properties as expected', () => {
    expect(instance).toHaveProperty('id');
    expect(instance).toHaveProperty('roomStatusInterval');
    expect(instance).toHaveProperty('peers');
    expect(instance).toHaveProperty('rooms');
    expect(instance.peers).toBeDefined();
    expect(instance.rooms).toBeDefined();
    expect(instance.peers).toBeInstanceOf(Map);
    expect(instance.rooms).toBeInstanceOf(Map);
    expect(instance.peers.size).toBe(0);
    expect(instance.rooms.size).toBe(0);
  });

  it('should create a new Onlineroom instance with the given roomId and roomStatusInterval', () => {
    const roomId = 'room1';
    const roomStatusInterval = 1000;
    const onlineroom = Onlineroom.create(roomId, roomStatusInterval);
    expect(onlineroom).toBeInstanceOf(Onlineroom);
    expect(onlineroom.id).toBe(roomId);
    // @ts-ignore
    expect(onlineroom.roomStatusInterval).toBe(roomStatusInterval);
  });

  it('should log an info message with the roomId', () => {
    const roomId = 'room1';
    const roomStatusInterval = 1000;
    const loggerInfoSpy = vi.spyOn(onlineRoomLogger, 'info');
    Onlineroom.create(roomId, roomStatusInterval);
    expect(loggerInfoSpy).toHaveBeenCalledWith('Onlineroom:create() [roomId:"%s"]', roomId);
    loggerInfoSpy.mockRestore();
  });

  it('#nowhandleSocketRequest should make JOIN room request', async() => {
    // @ts-ignore
    const nownotificationSpy = vi.spyOn(instance, 'nownotification').mockImplementationOnce(() => undefined);
    instance.nowhandleSocketRequest = vi.fn();
    peerMock.on = vi.fn().mockImplementation(() => null);
    const joinReq = await instance.nowhandleSocketRequest(peerMock, { method: ECHATMETHOD.JOIN }, callBacFn);
    // expect(joinReq).toHaveProperty('success');
    // expect(joinReq.success).toBe(true);
    // expect(peerMock.joined).toBe(true);
    // expect(nownotificationSpy).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make clooser room request', async() => {
    // @ts-ignore
    const closePeerReq = await instance.nowhandleSocketRequest(peerMock, { method: ECHATMETHOD.CLOSE_PEER }, callBacFn);
    expect(closePeerReq).toHaveProperty('success');
    expect(closePeerReq.success).toBe(true);
    // expect(peerMock.joined).toBe(true);
    expect(callbackArgs).toBeDefined();
  });

  it('#nowhandleSocketRequest should make JOIN room request', async() => {
    // @ts-ignore
    const nownotificationSpy = vi.spyOn(instance, 'nownotification')
      .mockImplementationOnce(() => true); // TODO watch this
    const sendMsgReq = await instance.nowhandleSocketRequest(peerMock, { method: ECHATMETHOD.NEW_ROOM, data: {
      roomId: faker.string.uuid(),
      userId: faker.string.uuid(),
      to: faker.string.uuid()
    } }, callBacFn);
    expect(sendMsgReq).toHaveProperty('success');
    expect(sendMsgReq.success).toBe(true);
    // expect(peerMock.joined).toBe(true);
    expect(callbackArgs).toBeDefined();
    expect(nownotificationSpy).toHaveBeenCalled();
  });

  it('#callBacFn should call emit events for nodejs', () => {
    // @ts-ignore
    const cbSpy = vi.spyOn(instance, 'emit').mockImplementationOnce(() => undefined);
    instance.callBacFn('event', {});
    expect(instance.emit).toHaveBeenCalled();
    expect(cbSpy).toHaveBeenCalled();
  });
});
