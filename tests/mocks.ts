import { faker } from '@faker-js/faker';

// Creates a mock chatroom.
//
// The `cb` callback function is called when the chatroom is created.
export const createMockChatroom = (cb) => {
  // Creates a new chatroom with a random UUID and username.
  return new Chatroom(faker.string.uuid(), faker.internet.userName(), cb);
};

// Creates a mock chatrooms.
//
// The `length` parameter specifies the number of chatrooms to create.
//
// The `cb` callback function is called when each chatroom is created.
export const createMockChatrooms = (length: number, cb) => {
  // Creates an array of `length` chatrooms.
  return Array.from({ length }).map(() => createMockChatroom(cb));
};


export const createMockOnlineroom = (roomStatusInterval: number) => {
  return new Onlineroom(faker.string.uuid(), roomStatusInterval);
};

export const createMockOnlinerooms = (length: number, roomStatusInterval: number) => {
  return Array.from({ length }).map(() => createMockOnlineroom(roomStatusInterval));
};

export const createMockRoomBase = () => {
  return {
    id: faker.string.uuid()
  };
};

export const createMockPeer = (socket: Socket, room: Chatroom | Onlineroom) => {
  return new Onlinepeer(
    faker.string.uuid(),
    socket,
    room
  );
};

export const createMockPeers = (length: number, socket: Socket, room: Chatroom | Onlineroom) => {
  return Array.from({ length }).map(() => createMockPeer(socket, room));
};
