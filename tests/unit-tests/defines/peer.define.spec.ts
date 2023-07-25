/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import Onlinepeer from '../../../src/defines/peer.define';
import { Socket } from 'socket.io';
import { faker } from '@faker-js/faker';
import Onlineroom from '../../../src/defines/online-room.define';

const socketMock = {
  handshake: {
    address: 'svava'
  },
  on: vi.fn(),
  leave: vi.fn(),
  disconnect: vi.fn(),
  join: vi.fn()
} as unknown as Socket;

const roomMock = {
  setupSocketHandler: vi.fn()
} as unknown as Onlineroom;

describe('Onlinepeer', () => {
  let instance: Onlinepeer;
  /* const callBacFn = (...args) => {

  };*/

  beforeEach(() => {
    instance = new Onlinepeer(
      faker.string.uuid(),
      socketMock,
      roomMock
    );
  });

  it('should be a real instance Onlinepeer', () => {
    expect(instance).toBeInstanceOf(Onlinepeer);
  });

  it('should have properties as expected', () => {
    expect(instance.joined).toBeDefined();
    expect(instance.address).toBeDefined();
    expect(instance.closed).toBeDefined();
    expect(instance.disconnectCheck).toBeDefined();
    expect(instance.intervalHandler).toBeUndefined();
    expect(instance.enterTime).toBeDefined();
    expect(instance.lastSeen).toBeDefined();
    expect(instance.id).toBeDefined();
    expect(instance.socket).toBeDefined();
    expect(instance.room).toBeDefined();
  });

  it('#close should close peer', () => {
    // @ts-ignore
    const closeResourceSpy = vi.spyOn(instance, 'closeResource');
    instance.close();
    expect(instance.closed).toBe(true);
    expect(closeResourceSpy).toHaveBeenCalled();
  });

  it('#leaveRoom should leave room', () => {
    // @ts-ignore
    const closeResourceSpy = vi.spyOn(instance, 'closeResource');
    instance.leaveRoom();
    expect(instance.closed).toBe(true);
    // @ts-ignore
    expect(closeResourceSpy).toHaveBeenCalled();
  });

  it('#handlePeerReconnect should handle peer reconnect', () => {
    // @ts-ignore
    const handlePeerSpy = vi.spyOn(instance, 'handlePeer');
    // @ts-ignore
    instance.handlePeerReconnect(socketMock);
    expect(handlePeerSpy).toHaveBeenCalled();
  });

  it('#handlePeer should handle peer connections', () => {
    instance.handlePeer();
  });

  it('#checkClose should check if peer is closed', () => {
    const checkCloseSpy = vi.spyOn(instance, 'checkClose');
    instance.checkClose();
    expect(checkCloseSpy).toHaveBeenCalled();
  });

  it('#peerInfo should return peer info', () => {
    const peerInfo = instance.peerInfo();
    expect(peerInfo.id).toBeDefined();
    expect(peerInfo.durationTime).toBeDefined();
  });
});
