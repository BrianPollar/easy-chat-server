/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import { faker } from '@faker-js/faker';
import RoomBase from '../../../src/defines/room-base.define';
import Onlinepeer from '../../../src/defines/peer.define';

class BaseTesterBase extends RoomBase {
  nowhandleSocketRequest(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    peer: Onlinepeer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cb
  ): Promise<any> {
    return Promise.resolve(null);
  }
}

const peerMock = {
  socket: {
    on: vi.fn(),
    join: vi.fn()
  },
  on: vi.fn(),
  close: vi.fn()
} as unknown as Onlinepeer;

describe('RoomBase', () => {
  let instance: BaseTesterBase;
  const id = faker.string.uuid();
  const callBacFn = (...args) => {

  };

  beforeEach(() => {
    instance = new BaseTesterBase(id);
  });

  it('should be a real instance Onlinepeer', () => {
    expect(instance).toBeInstanceOf(Onlinepeer);
  });

  it('should have properties defined', () => {
    expect(instance.peers).toBeDefined();
    expect(instance.rooms).toBeDefined();
    expect(instance.closed).toBeDefined();
    expect(instance.activeTime).toBeDefined();
    // @ts-ignore
    expect(instance.bornTime).toBeDefined();
    // @ts-ignore
    expect(instance.reqString).toBeDefined();
    // @ts-ignore
    expect(instance.notifString).toBeDefined();
    expect(instance.id).toBeDefined();
  });

  it('#setupSocketHandler should set up socket handler', () => {
    instance.setupSocketHandler(peerMock);
    expect(peerMock.socket.on).toHaveBeenCalled();
  });

  it('#handlePeer should handle peer connection', () => {
    instance.handlePeer(peerMock);
    expect(peerMock.on).toHaveBeenCalled();
  });

  it('#getPeer should get peer provided peer id', () => {
    const id = faker.string.uuid();
    const peer = instance.getPeer(id);
    expect(peer).toBeInstanceOf(Onlinepeer);
  });

  it('#close should close a room', () => {
    instance.close();
    expect(instance.closed).toBe(true);
    // @ts-ignore
    expect(instance.closeResource).toHaveBeenCalled();
  });

  it('#checkDeserted should check if room is empty', () => {
    instance.checkDeserted();
    expect(instance.closed).toBe();
  });

  it('#statusReport should get detailed status about room', () => {
    const report = instance.statusReport();
    expect(report).toBeDefined();
  });

  it('#sendMsgToallpeers should dispatch notification to any user online', () => {
    const id = faker.string.uuid();
    instance.sendMsgToallpeers();
  });

  it('#nownotification should broadcast notifications effectively to peers', () => {
    instance.nownotification();
  });

  it('#setActive should set date for room to current date', () => {
    instance.setActive();
  });

  it('#checkEmpty should check if room is empty', () => {
    const isEmpty = instance.checkEmpty();
    expect(isEmpty).toBe(true);
  });

  it('#nowhandleSocketRequest should return null for mock method', () => {
    const reqRes = instance.nowhandleSocketRequest(peerMock, 'any', 'any');
    expect(reqRes).toBeNull();
  });
});
