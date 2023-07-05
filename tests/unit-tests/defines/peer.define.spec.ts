/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import Onlinepeer from '../../../src/defines/peer.define';
import { Socket } from 'socket.io';
import { faker } from '@faker-js/faker';

const socketMock = {

} as Socket;

const roomMock = {

} as Onlineroom;

describe('Onlinepeer', () => {
  let instance: Onlinepeer;
  let serverSocket: Socket;
  const callBacFn = (...args) => {

  };

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

  it('#close should close peer', () => {
    instance.close();
    expect(instance.closed).toBe(true);
    // @ts-ignore
    expect(instance.closeResource).toHaveBeenCalled();
  });

  it('#leaveRoom should leave room', () => {
    instance.leaveRoom();
    expect(instance.closed).toBe(true);
    // @ts-ignore
    expect(instance.closeResource).toHaveBeenCalled();
  });

  it('#handlePeerReconnect should handle peer reconnect', () => {
    instance.handlePeerReconnect();
    expect(instance.handlePeer).toHaveBeenCalled();
  });

  it('#handlePeer should handle peer connections', () => {
    instance.handlePeer();
  });

  it('#checkClose should check if peer is closed', () => {
    instance.checkClose();
    expect(instance.checkClose).toHaveBeenCalled();
  });

  it('#peerInfo should return peer info', () => {
    const peerInfo = instance.peerInfo();
    expect(peerInfo.id).toBeDefined();
    expect(peerInfo.durationTime).toBeDefined();
  });
});
