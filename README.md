# Chromecast Emulator Demo

A set of tools to make it easier to develop for the Chromecast / Google Cast platform.

Forked from the [Chromecast Emulator Demo](https://github.com/jaclynonacloud/chromecast-emulator-demo) project.

## Projects

- `emulator`: Web Sender with WebSocket Support - Emulates sender app messaging by wrapping intents into proper namespaces and sends them to the WebSocket server.
  - Includes example Web Receiver with WebSocket polyfill listener.
- `wss`: WebSocket Server - Mimics Chromecast’s native WebSocket server; listens for and rebroadcasts messages to the receiver.

## Prerequistites

- `corepack enable`
- `pnpm install`

## Scripts

- `pnpn run start`: concurrently run the local emulator and WebSocket Server.
- `pnpn run dev`: to run only the local emulator.
- `pnpm run wss`: to run only the WebSocket Server -- needed by the emulator to send/receive messages.
