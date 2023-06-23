import { vi, expect, describe, beforeEach, it } from 'vitest';
import { EasyChat } from '../../src/websocket';
import { IsocketConfig } from '../../src/interfaces/socket.interface';
import * as http from 'http';
import * as https from 'https';
import { Server, Socket } from 'socket.io';


describe('AuthController', () => {
  let instance: EasyChat;
  const roomStatusInterval = 100;
  let httpsServer: https.Server | http.Server;
  let socketConfig: Partial<IsocketConfig>;

  beforeEach(() => {
    instance = new EasyChat(httpsServer, roomStatusInterval, socketConfig);
    instance.run(['/']);
  });


  it('its real instance of AuthController', () => {
    expect(instance).toBeInstanceOf(AuthController);
  });

  it('check authenticated', () => {
    expect(instance.isLoggedIn).toBe(false);
  });

  it('chech confirm enabled', () => {
    expect(instance.confirmEnabled).toBe(false);
  });

  it('should make socialLogin', async() => {
    expect(await instance.socialLogin(userInfo as any)).toStrictEqual(mockValue);
  });
});
