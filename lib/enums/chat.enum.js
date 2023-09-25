"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECHATMETHOD = void 0;
/**
 * This enum defines the different chat methods that can be used.
 */
var ECHATMETHOD;
(function (ECHATMETHOD) {
    /**
     * A new peer has joined the chat room.
     */
    ECHATMETHOD["NEW_PEER"] = "newPeer";
    /**
     * A new main peer has joined the chat room.
     */
    ECHATMETHOD["NEW_MAIN_PEER"] = "newMainPeer";
    /**
     * A peer has closed their connection to the chat room.
     */
    ECHATMETHOD["PEER_CLOSE"] = "peerClosed";
    /**
     * The main peer has closed their connection to the chat room.
     */
    ECHATMETHOD["MAIN_PEER_CLOSE"] = "mainPeerClosed";
    /**
     * A peer has joined the chat room.
     */
    ECHATMETHOD["JOIN"] = "join";
    /**
     * A peer has closed their connection to the chat room.
     */
    ECHATMETHOD["CLOSE_PEER"] = "closePeer";
    /**
     * Get all messages in the chat room.
     */
    ECHATMETHOD["GET_MESSAGES"] = "getMessages";
    /**
     * Send a chat message to the chat room.
     */
    ECHATMETHOD["CHAT_MESSAGE"] = "chatMessage";
    /**
     * Delete a chat message from the chat room.
     */
    ECHATMETHOD["DELETE_MESSAGE"] = "deleteMessage";
    /**
     * Update the chat room information.
     */
    ECHATMETHOD["UPDATE_ROOM"] = "updateRoom";
    /**
     * Delete the chat room.
     */
    ECHATMETHOD["DELETE_ROOM"] = "deleteRoom";
    /**
     * Update the status of a message in the chat room.
     */
    ECHATMETHOD["UPDATE_STATUS"] = "updateStatus";
    /**
     * Update the information about a peer in the chat room.
     */
    ECHATMETHOD["PEER_UPDATE"] = "updatePeer";
    /**
     * A socket has connected to the chat server.
     */
    ECHATMETHOD["SOCKET_CONNECTED"] = "socketConnected";
    /**
     * A socket has disconnected from the chat server.
     */
    ECHATMETHOD["SOCKET_DISCONNECTED"] = "socketDisconnected";
    /**
     * A new room has been created.
     */
    ECHATMETHOD["NEW_ROOM"] = "newRoom";
    /**
     * A room has been created.
     */
    ECHATMETHOD["ROOM_CREATED"] = "roomCreated";
    /**
     * Update rooms on new peer join.
     */
    ECHATMETHOD["UPDATE_ROOMS_ON_NEW"] = "updateRoomOnNew";
})(ECHATMETHOD = exports.ECHATMETHOD || (exports.ECHATMETHOD = {}));
//# sourceMappingURL=chat.enum.js.map