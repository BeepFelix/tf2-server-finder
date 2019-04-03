const Worker = require("worker_threads");
const vmsq = require("vmsq");
require("events").EventEmitter.defaultMaxListeners = 200;

const config = require("./config.json");

let servers = [];
let serverInfo = [];

console.log("Collection server ips...");

let options = { appid: 440 };
if (config.serverName && config.serverName.length >= 1) {
	options.name_match = config.serverName;
}

let stream = vmsq("hl2master.steampowered.com:27011", vmsq.ALL, options);

stream.on("data", (ip) => {
	servers.push(ip);

	if (servers.length % 100 === 0) {
		console.log("Got " + servers.length + "...");
	}
});
stream.on("error", ending);
stream.on("end", ending);

async function ending(err) {
	if (err) {
		console.error(err);
	}

	console.log("Got " + servers.length + " server" + (servers.length === 1 ? "" : "s"));
	console.log("Getting server information...");

	let chunks = chunkArrayInGroups(servers, config.serversPerWorker);
	let exitedWorkers = 0;

	console.log("Spawning " + chunks.length + " worker" + (chunks.length === 1 ? "" : "s") + " each doing " + config.serversPerWorker + " server" + (config.serversPerWorker === 1 ? "" : "s"));
	console.log("Expected wait time: " + (config.serversPerWorker * 5) + " seconds");

	// Create worker for each chunk
	for (let i = 0; i < chunks.length; i++) {
		const worker = new Worker.Worker("./worker.js", { workerData: chunks[i] });

		worker.on("message", (msg) => {
			if (msg.status === 0) {
				console.log(msg.msg);
				return;
			}

			if (msg.status === 1) {
				// Don't log errors if they are "UDP Watchdog Timeout"
				if (msg.error === "UDP Watchdog Timeout") {
					return;
				}

				console.error(msg.error);
				return;
			}

			if (msg.status === 2) {
				serverInfo.push(msg.serverInfo);
			}
		});

		worker.on("exit", (code) => {
			exitedWorkers += 1;

			if (code === 1337) {
				console.log("Worker exited. " + exitedWorkers + "/" + chunks.length);
			} else {
				console.log("Worker exited with invalid exit code " + code);
			}
		});
	}

	// Wait until all the workers have finished and exited
	await new Promise((resolve, reject) => {
		let interval = setInterval(() => {
			if (exitedWorkers >= chunks.length) {
				clearInterval(interval);
				resolve();
			}
		}, 500);
	});

	// Continue as normal
	console.log("Got information about " + serverInfo.length + " server" + (serverInfo.length === 1 ? "" : "s"));

	console.log("Filtering according to arguments");
	let validServers = serverInfo.filter(s => {
		let players = s.players.map(p => p.name);
		for (let i = 0; i < config.playersInServer.length; i++) {
			if (players.includes(config.playersInServer[i]) === false) {
				return false;
			}
		}
		return true;
	});

	if (validServers.length <= 0) {
		console.log("No server found matching our arguments");
	} else {
		console.log("All servers which match our desired arguments:\n" + validServers.map(s => s.name + ": " + s.query.host + ":" + s.query.port).join("\n"));
	}
}

function chunkArrayInGroups(arr, size) {
	let myArray = [];

	for (let i = 0; i < arr.length; i += size) {
		myArray.push(arr.slice(i, i + size));
	}

	return myArray;
}
