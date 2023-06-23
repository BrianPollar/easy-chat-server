import { expect, describe, beforeEach, it } from 'vitest';
import Onlineroom, { createMockOnlineroom } from '../../../src/defines/online-room.define';


describe('Onlineroom', () => {
  let instance: Onlineroom;
  const roomStatusInterval = 100;
 
  beforeEach(() => {
    instance = createMockOnlineroom(roomStatusInterval);
  });


  it('its real instance of AuthController', () => {
    expect(instance).toBeInstanceOf(Onlineroom);
  });

  it('should make socialLogin', async() => {
    expect(await instance.socialLogin(userInfo as any)).toStrictEqual(mockValue);
  });
});
