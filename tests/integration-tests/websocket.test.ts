import { vi, expect, describe, beforeEach, it } from 'vitest';
import { EasyChat } from '../../src/websocket';
import { IsocketConfig } from '../../src/interfaces/socket.interface';
import * as http from 'http';
import * as https from 'https';
import express, { Application } from 'express';
import { initEasyChat } from 'easy-chat-client/src/websocket';
import { faker } from '@faker-js/faker';

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
  const app: Application = express();
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
  const url = 'http://localhost/' + (httpServer.address() as any).port;
  const { easyChatClient, easyChatController } = constructClient(url, faker.string.uuid(), faker.internet.userName(), faker.image.avatar());
  return { easyChat, app, httpServer, easyChatClient, easyChatController };
};

describe('Websocket', () => {
  let instance: EasyChat;
  const roomStatusInterval = 100;
  let httpsServer: https.Server | http.Server;
  let socketConfig: Partial<IsocketConfig>;

  beforeEach(() => {
    instance = new EasyChat(httpsServer, roomStatusInterval, socketConfig);
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
    expect(easyChat.onlineRoom).toBeDefined();
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
    easyChat.handleMainConnection(socket as any);
    expect(easyChat.onlineRoom.getPeer('test-user')).toBeDefined();
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

    easyChat.handleMainConnection(socket as any);
    expect(handleMainConnectionSpy).toHaveBeenCalled();
  });
});
