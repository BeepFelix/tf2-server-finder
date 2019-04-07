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

- serversPerWorker: Amount of servers each worker does - The lower the more workers get spawaned and the more RAM you are using (10 had me using 8 GB ram with `serverName` set to `"*"` and `mapName` set to `""`)
- steamWebAPIKey: Your [Steam Web API Key](https://steamcommunity.com/dev)
- serverName: Only get servers which match this string (Can use * as a wildcard). Use `"*"` for all servers.
- mapName: Only get servers which are running this map (Like `cp_process_final`). Use `""` for all servers.
- playersInServer: Array of strings containing **case sensitive** names we will use for filtering at the end.
- extraOptions: Object containing more filters following [Master Server Query Protcol](https://developer.valvesoftware.com/wiki/Master_Server_Query_Protocol#Filter).

**Example:**
```
"extraOptions": {
	"gametype": "surf",
	"secure": 0
}
```

These parameters are already used:

- `appid`: `440` (Hardcoded)
- `name_match`: `serverName` (config)
- `map`: `mapName` (config)

Use `{}` for no extra options

---

Getting too many servers is not good, I recommend setting `empty` to `1` in the `extraOptions`.
