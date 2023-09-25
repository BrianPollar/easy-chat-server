/**
 * This interface defines the configuration options for the socket.io client.
 */
export interface IsocketConfig {
    /**
     * The number of milliseconds to wait for a ping response before disconnecting.
     */
    pingTimeout: number;
    /**
     * The number of milliseconds between pings.
     */
    pingInterval: number;
    /**
     * The transports that the socket.io client should use.
     */
    transports: ('polling' | 'websocket')[];
    /**
     * Whether the socket.io client should allow upgrades to websockets.
     */
    allowUpgrades: boolean;
}
