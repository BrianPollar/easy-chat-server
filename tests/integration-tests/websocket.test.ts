import { vi, expect, describe, beforeEach, it } from 'vitest';
import { EasyChat } from '../../src/websocket';
import { IsocketConfig } from '../../src/interfaces/socket.interface';
import * as http from 'http';
import * as https from 'https';
import express, { Application } from 'express';
import { initEasyChat } from 'easy-chat-client/src/websocket';
import { faker } from '@faker-js/faker';
import { Socket } from 'socket.io';

const expressMock = {
  listen: vi.fn()
} as Partial<express>;

const httpServerMock = {
  address: vi.fn().mockImplementation(() => ({
    port: 4000
  }))
};

const socketMock = {
  handshake: {
    address: 'svava',
    query: {
      userId: 'dhdj'
    }
  },
  on: vi.fn(),
  leave: vi.fn(),
  disconnect: vi.fn(),
  join: vi.fn(),
  broadcast: {
    to: vi.fn().mockImplementation(() => ({
      emit: vi.fn()
    }))
  }
} as unknown as Socket;


export const constructClient = (
  url: string,
  userId: string,
  userNames: string,
  userPhotoUrl: string
) => {
  return initEasyChat(url, userId, userNames, userPhotoUrl);
};

export const constructSocketServer = (
  port = 4000,
  roomStatusInterval = 100
) => {
  const app: Application = expressMock;
  app.listen(port);
  const httpServer = http.createServer(app);
  const socketConfig: IsocketConfig = {
    pingTimeout: 3000,
    pingInterval: 5000,
    transports: ['websocket'],
    allowUpgrades: false
  };
  const easyChat = new EasyChat(httpServer, roomStatusInterval, socketConfig);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const url = 'http://localhost/' + (httpServerMock.address()).port;
  const { easyChatClient, easyChatController } = constructClient(url, faker.string.uuid(), faker.internet.userName(), faker.image.avatar());
  return { easyChat, app, httpServerMock, easyChatClient, easyChatController };
};

describe('Websocket', () => {
  let instance: EasyChat;
  const roomStatusInterval = 100;
  let httpsServer: https.Server | http.Server;
  const socketConfig: Partial<IsocketConfig> = {
    pingTimeout: 3000,
    pingInterval: 5000,
    transports: ['websocket'],
    allowUpgrades: false
  };

  beforeEach(() => {
    instance = new EasyChat(httpsServer, roomStatusInterval, socketConfig);
    instance.emitEvent = vi.fn().mockImplementation(() => EasyChat.prototype.emitEvent);
  });

  it('its real instance of AuthController', () => {
    expect(instance).toBeInstanceOf(EasyChat);
    expect(instance.io).toBeUndefined();
  });

  it('should have properties undefined', () => {
    expect(instance.onlineRoom).toBeUndefined();
  });

  it('should run wb socket server', () => {
    instance.run(['/']);
    expect(instance.io).toBeDefined();
  });

  it('should create a new Onlineroom', () => {
    const socketConfig: IsocketConfig = {
      pingTimeout: 3000,
      pingInterval: 5000,
      transports: ['websocket'],
      allowUpgrades: false
    };
    const easyChat = new EasyChat(null as any, 1000, socketConfig);
    // expect(easyChat.onlineRoom).toBeDefined();
  });

  it('should handle a new connection', () => {
    const socketConfig: IsocketConfig = {
      pingTimeout: 3000,
      pingInterval: 5000,
      transports: ['websocket'],
      allowUpgrades: false
    };
    const easyChat = new EasyChat(null as any, 1000, socketConfig);
    const socket = {
      handshake: {
        query: {
          userId: 'test-user'
        }
      }
    };
    easyChat.handleMainConnection(socketMock);
    expect(easyChat.onlineRoom.getPeer('test-user')).toBeUndefined();
  });

  it('should handle a peer reconnect', () => {
    const socketConfig: IsocketConfig = {
      pingTimeout: 3000,
      pingInterval: 5000,
      transports: ['websocket'],
      allowUpgrades: false
    };
    const easyChat = new EasyChat(null as any, 1000, socketConfig);
    const socket = {
      handshake: {
        query: {
          userId: 'test-user'
        }
      }
    };
    const handleMainConnectionSpy = vi.spyOn(easyChat, 'handleMainConnection');

    easyChat.handleMainConnection(socketMock);
    expect(handleMainConnectionSpy).toHaveBeenCalled();
  });
});
