/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi, expect, describe, beforeEach, it } from 'vitest';
import { Socket } from 'socket.io';
import { faker } from '@faker-js/faker';
import { EasyChat } from '../../src/websocket';
import * as http from 'http';
import { IsocketConfig } from '../../src/easy-chat';

const httpServerMock = {

} as http.Server;

const socketConfigMock = {

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
    expect(instance).toBeInstanceOf(EasyChat);
  });

  it('#method should have properties undefined', () => {
    expect(instance.onlineRoom).toBeDefined();
    expect(instance.io).toBeDefined();
  });

  it('#run should run socket server', () => {
    expect(serverSocket).toBeDefined();
  });

  it('#emitEvent should emit event from rooms and peers', () => {
    instance.close();
    expect(instance.closed).toBe(true);
    // @ts-ignore
    expect(instance.closeResource).toHaveBeenCalled();
  });

  it('#handleMainConnection should handle main room connection', () => {
    instance.handleMainConnection();
    expect(instance.closed).toBe(true);
    // @ts-ignore
    expect(instance.closeResource).toHaveBeenCalled();
  });
});
