export interface IsocketConfig {
    pingTimeout: number;
    pingInterval: number;
    transports: ('polling' | 'websocket')[];
    allowUpgrades: boolean;
}
