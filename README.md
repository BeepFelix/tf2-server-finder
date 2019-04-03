# TF2 Server Finder

Find server IPs based on server name and players in server.

**Requires [NodeJS](https://nodejs.org/) v11 or newer**

# Installation

1. Clone repository
2. Extract into a folder
3. Open command prompt inside the folder
4. Enter `npm install`
5. Make a duplicate of the `config.json.example` and remove the `.example`
6. Adjust your now called `config.json` - [See Config](#config)
7. Run with `node index.js`

# Config

- serversPerWorker: Amount of servers each worker does - The higher the less workers get spawned
- playersInServer: Array of strings containing **case sensitive** names we will use for filtering
- serverName: Only get servers with this server name (**Case sensitive**). Use `""` to get all servers.
