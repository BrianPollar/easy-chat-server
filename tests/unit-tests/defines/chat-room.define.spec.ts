import { expect, describe, beforeEach, it } from 'vitest';
import Chatroom, { createMockChatroom } from '../../../src/defines/chat-room.define';

describe('Chatroom', () => {
  const callBacFn = (...args) => {

  };

  let instance: Chatroom;

  beforeEach(() => {
    instance = createMockChatroom(callBacFn);
  });


  it('its real instance of AuthController', () => {
    expect(instance).toBeInstanceOf(Chatroom);
  });


  it('should make socialLogin', async() => {
    expect(await instance.socialLogin(userInfo as any)).toStrictEqual(mockValue);
  });
});
