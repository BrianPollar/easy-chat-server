/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import { Socket } from 'socket.io';
import { EasyChat } from '../../src/websocket';
import * as http from 'http';
import { IsocketConfig, createMockOnlineroom } from '../../src/easy-chat';
import Onlineroom from '../../src/defines/online-room.define';

const httpServerMock = {

} as http.Server;

const socketConfigMock = {
  pingTimeout: 3000,
  pingInterval: 5000,
  transports: ['websocket'],
  allowUpgrades: false
} as Partial<IsocketConfig>;

const socketMock = {

} as Socket;

const roomMock = {

} as Onlineroom;


describe('EasyChat', () => {
  let instance: EasyChat;

  beforeEach(() => {
    instance = new EasyChat(
      httpServerMock,
      100,
      socketConfigMock
    );
  });

  it('should be a real instance EasyChat', () => {
    expect(instance).toBeInstanceOf(EasyChat);
  });

  it('should have a constructor', () => {
    expect(instance.constructor).toBeDefined();
  });

  it('#method should have properties undefined', () => {
    expect(instance.onlineRoom).toBeUndefined();
    expect(instance.io).toBeUndefined();
  });

  /*
  it('#run should run socket server', () => {
    expect(serverSocket).toBeDefined();
  });
  */

  it('#emitEvent should emit event from rooms and peers', () => {
    instance.onlineRoom = createMockOnlineroom(1000);
    const emitSpy = vi.spyOn(instance.onlineRoom, 'emit');
    instance.emitEvent('event', 'data');
    expect(emitSpy).toHaveBeenCalledWith('event', 'data');
  });

  /*
  it('#handleMainConnection should handle main room connection', () => {
    instance.handleMainConnection(socketMock);
    expect(instance.closed).toBe(true);
    // @ts-ignore
    expect(instance.closeResource).toHaveBeenCalled();
  });
  */
});
