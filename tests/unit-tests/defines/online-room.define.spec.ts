import { vi, expect, describe, beforeEach, it } from 'vitest';
import Onlineroom, { createMockOnlineroom } from '../../../src/defines/online-room.define';
import { ECHATMETHOD } from '../../../src/easy-chat';
import { faker } from '@faker-js/faker';
import Onlinepeer from '../../../src/defines/peer.define';

const peerMock = {
  id: faker.string.uuid(),
  joined: true,
  socket: {
    id: faker.string.uuid()
  },
  close: vi.fn()
} as unknown as Onlinepeer;

describe('Onlineroom', () => {
  let callbackArgs: any[];
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
    const joinReq = await instance.nowhandleSocketRequest(peerMock, ECHATMETHOD.JOIN, callBacFn);
    expect(joinReq).toHaveProperty('success');
    expect(joinReq.success).toBe(true);
    expect(peerMock.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make JOIN room request', async() => {
    const closePeerReq = await instance.nowhandleSocketRequest(peerMock, ECHATMETHOD.CLOSE_PEER, callBacFn);
    expect(closePeerReq).toHaveProperty('success');
    expect(closePeerReq.success).toBe(true);
    expect(peerMock.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
  });

  it('#nowhandleSocketRequest should make JOIN room request', async() => {
    const sendMsgReq = await instance.nowhandleSocketRequest(peerMock, ECHATMETHOD.NEW_ROOM, callBacFn);
    expect(sendMsgReq).toHaveProperty('success');
    expect(sendMsgReq.success).toBe(true);
    expect(peerMock.joined).toBe(true);
    expect(callBacFn).toHaveBeenCalled();
  });

  it('#callBacFn should call emit events for nodejs', () => {
    instance.callBacFn('event', {});
    expect(instance.emit).toHaveBeenCalled();
  });
});
