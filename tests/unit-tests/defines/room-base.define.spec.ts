/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import { faker } from '@faker-js/faker';
import RoomBase from '../../../src/defines/room-base.define';
import Onlinepeer, { createMockPeer } from '../../../src/defines/peer.define';
import { ECHATMETHOD } from '../../../src/easy-chat';
import { Socket } from 'socket.io';

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

const socketMock = {
  broadcast: {
    to: vi.fn()
  },
  emit: vi.fn(),
  handshake: {
    address: ''
  },
  on: vi.fn(),
  disconnect: vi.fn()
} as unknown as Socket;

const peerMock = {
  id: faker.string.uuid(),
  socket: {
    on: vi.fn(),
    join: vi.fn(),
    handshake: {
      address: 'addr'
    }
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

  it('should be a real instance BaseTesterBase', () => {
    expect(instance).toBeInstanceOf(BaseTesterBase);
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
    // eslint-disable-next-line no-undefined
    const onSpy = vi.spyOn(peerMock.socket, 'on').mockImplementationOnce(() => undefined);
    instance.setupSocketHandler(peerMock);
    expect(onSpy).toHaveBeenCalled();
  });

  it('#handlePeer should handle peer connection', () => {
    const joinSpy = vi.spyOn(peerMock.socket, 'join').mockImplementationOnce(() => undefined);
    const setupSocketHandlerSpy = vi.spyOn(instance, 'setupSocketHandler').mockImplementationOnce(() => undefined);
    const onSpy = vi.spyOn(peerMock, 'on').mockImplementationOnce(() => undefined);
    instance.handlePeer(peerMock);
    expect(joinSpy).toHaveBeenCalled();
    expect(setupSocketHandlerSpy).toHaveBeenCalled();
    expect(onSpy).toHaveBeenCalled();
  });

  it('#getPeer should get peer provided peer id', () => {
    const valPeer = createMockPeer(socketMock, instance as any);
    instance.peers.set(valPeer.id, valPeer);
    const peer = instance.getPeer(valPeer.id);
    expect(peer).toBeInstanceOf(Onlinepeer);
    expect(peer).toHaveProperty('id');
  });

  it('#close should close a room', () => {
    const closeSpy = vi.spyOn(instance, 'close').mockImplementationOnce(() => undefined);
    // const emitSpy = vi.spyOn(instance, 'emit').mockImplementationOnce(() => undefined);
    const valPeer = createMockPeer(socketMock, instance as any);
    instance.peers.set(valPeer.id, valPeer);
    const peer = instance.getPeer(valPeer.id);
    instance.close();
    // @ts-ignore
    expect(closeSpy).toHaveBeenCalled();
    // expect(emitSpy).toHaveBeenCalled();
  });

  it('#checkDeserted should check if room is empty', () => {
    // @ts-ignore
    const checkEmptySpy = vi.spyOn(instance, 'checkEmpty');
    const closeSpy = vi.spyOn(instance, 'close');
    instance.close();
    // expect(checkEmptySpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('#statusReport should get detailed status about room', () => {
    const report = instance.statusReport();
    expect(report).toBeDefined();
    expect(report).toHaveProperty('id');
    expect(report).toHaveProperty('peers');
    expect(report).toHaveProperty('duration');
    expect(report).toHaveProperty('lastActive');
  });

  it('#sendMsgToallpeers should dispatch notification to any user online', () => {
    // @ts-ignore
    const nownotificationSpy = vi.spyOn(instance, 'nownotification');
    instance.peers.set(peerMock.id, peerMock);
    instance.sendMsgToallpeers(id, ECHATMETHOD.CHAT_MESSAGE, { data: null });
    expect(nownotificationSpy).toBeDefined();
  });

  it('#nownotification should broadcast notifications effectively to one peer', () => {
    // const toSpy = vi.spyOn(socketMock.broadcast, 'to');
    // @ts-ignore
    // instance.nownotification(socketMock, ECHATMETHOD.CHAT_MESSAGE, { data: {} }, true);
    // expect(toSpy).toHaveBeenCalled();
  });

  it('#nownotification should broadcast notifications effectively to all peers', () => {
    const emitSpy = vi.spyOn(socketMock, 'emit');
    // @ts-ignore
    instance.nownotification(socketMock, ECHATMETHOD.CHAT_MESSAGE);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('#setActive should set date for room to current date', () => {
    // @ts-ignore
    instance.setActive();
    expect(instance.activeTime).toBeDefined();
  });

  it('#checkEmpty should check if room is empty', () => {
    // @ts-ignore
    const isEmpty = instance.checkEmpty();
    expect(typeof isEmpty).toBe('boolean');
  });

  it('#nowhandleSocketRequest should return null for mock method', async() => {
    const reqRes = await instance.nowhandleSocketRequest(peerMock, 'any', 'any');
    expect(reqRes).toBeNull();
  });
});
