# easy-chat

## Features

easy-chat-server implements real-time bidirectional event-based communication. It consists of:

- a Node.js server (this repository)
- a [Javascript client library](https://github.com/BrianPollar/easy-chat-client) for the browser (or a Node.js client)

Its main features are:

#### Reliability

Connections are established even in the presence of:

- proxies and load balancers.
- personal firewall and antivirus software.

For this purpose, it relies on [socket io](https://github.com/socketio), which first establishes connection to the backend server using the best possible transports.

#### Minimalistic chat implementation support

You do not need to understand the internal structures and operation of websockets and chat systems.
All you need to do is call create a room, heck you not need to destroy a room as this is handled intelligently and automatically;

Sample code:

```ts
import { EasyChat, IsocketConfig } from "easy-chat-server";
const httpsServer; // your node server instance
const roomStatusInterval = 1000; // logging update interval
const socketConfig: IsocketConfig = {
  pingTimeout: 3000,
  pingInterval: 5000,
  transports: ["websocket"],
  allowUpgrades: false,
};
const easyChat = new EasyChat(httpsServer, roomStatusInterval, socketConfig);
easyChat.run();
```

## Installation

```bash
// with npm
npm install easy-chat-server

// with yarn
yarn add easy-chat-server
```

## How to use

The following creates an instance of easyChat.

```ts
import { EasyChat, IsocketConfig } from "easy-chat-server";
const httpsServer; // your node server instance
const roomStatusInterval = 1000; // logging update interval
// the config properties can be optional
const socketConfig: IsocketConfig = {
  pingTimeout: 3000,
  pingInterval: 5000,
  transports: ["websocket"],
  allowUpgrades: false,
};
const easyChat = new EasyChat(httpsServer, roomStatusInterval, socketConfig);
easyChat.run();

/**
 *  get data from event incase you
 * you want to process it futher,say my be save
 * in database or file*/
easyChat.onlineRoom.on("CHAT_MESSAGE", () => {
  // do stuffs
});

// for full event list see enum ECHATMETHOD
import { ECHATMETHOD } from "easy-chat-server";
```

### In conjunction with Express

You need to pass the `Server` to `easy-chat`, and not the express application function. The rest of the listening is done automatically.

```js
const app = require("express")();
const httpsServer = require("http").createServer(app);
const roomStatusInterval = 1000; // logging update interval
const socketConfig = {
  pingTimeout: 3000,
  pingInterval: 5000,
  transports: ["websocket"],
  allowUpgrades: false,
};
const easyChat = new EasyChat(httpsServer, roomStatusInterval, socketConfig);
```

## Documentation

The source code of the website can be found [here](https://github.com/BrianPolar/easy-chat-server). Contributions are welcome!

## Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site.

## License

[MIT](LICENSE)
