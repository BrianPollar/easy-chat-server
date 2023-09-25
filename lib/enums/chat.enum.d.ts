/**
 * This enum defines the different chat methods that can be used.
 */
export declare enum ECHATMETHOD {
    /**
     * A new peer has joined the chat room.
     */
    NEW_PEER = "newPeer",
    /**
     * A new main peer has joined the chat room.
     */
    NEW_MAIN_PEER = "newMainPeer",
    /**
     * A peer has closed their connection to the chat room.
     */
    PEER_CLOSE = "peerClosed",
    /**
     * The main peer has closed their connection to the chat room.
     */
    MAIN_PEER_CLOSE = "mainPeerClosed",
    /**
     * A peer has joined the chat room.
     */
    JOIN = "join",
    /**
     * A peer has closed their connection to the chat room.
     */
    CLOSE_PEER = "closePeer",
    /**
     * Get all messages in the chat room.
     */
    GET_MESSAGES = "getMessages",
    /**
     * Send a chat message to the chat room.
     */
    CHAT_MESSAGE = "chatMessage",
    /**
     * Delete a chat message from the chat room.
     */
    DELETE_MESSAGE = "deleteMessage",
    /**
     * Update the chat room information.
     */
    UPDATE_ROOM = "updateRoom",
    /**
     * Delete the chat room.
     */
    DELETE_ROOM = "deleteRoom",
    /**
     * Update the status of a message in the chat room.
     */
    UPDATE_STATUS = "updateStatus",
    /**
     * Update the information about a peer in the chat room.
     */
    PEER_UPDATE = "updatePeer",
    /**
     * A socket has connected to the chat server.
     */
    SOCKET_CONNECTED = "socketConnected",
    /**
     * A socket has disconnected from the chat server.
     */
    SOCKET_DISCONNECTED = "socketDisconnected",
    /**
     * A new room has been created.
     */
    NEW_ROOM = "newRoom",
    /**
     * A room has been created.
     */
    ROOM_CREATED = "roomCreated",
    /**
     * Update rooms on new peer join.
     */
    UPDATE_ROOMS_ON_NEW = "updateRoomOnNew"
}
