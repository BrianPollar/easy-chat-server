import { expect, describe, beforeEach, it } from 'vitest';
import Onlinepeer, { createMockPeer } from '../../../src/defines/peer.define';

describe('Onlinepeer', () => {
  let instance: Onlinepeer;

  beforeEach(() => {
    instance = createMockPeer();
  });

  it('should confirm user', async() => {
    expect(await instance.confirm(userInfo as any, '/')).toStrictEqual(mockValue);
  });

  it('should make socialLogin', async() => {
    expect(await instance.socialLogin(userInfo as any)).toStrictEqual(mockValue);
  });
});
