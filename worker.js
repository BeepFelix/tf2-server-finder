const Worker = require("worker_threads");
const Gamedig = require("gamedig");

if (Worker.isMainThread) {
	console.log("You are not suppose to run this on your own. Please run index.js");
	process.exit();
}

Worker.parentPort.postMessage({ status: 0, worker: Worker.threadId, msg: "Worker " + Worker.threadId + " launched" });

const servers = Worker.workerData;
(async () => {
	for (let server of servers) {
		let data = await Gamedig.query({
			type: "tf2",
			host: server.addr.split(":")[0],
			port: server.addr.split(":")[1],
			maxAttempts: 3,
			attemptTimeout: 10000
		}).catch((err) => {
			Worker.parentPort.postMessage({ status: 1, worker: Worker.threadId, error: err });
		});

		if (typeof data === "undefined") {
			continue;
		}

		Worker.parentPort.postMessage({ status: 2, worker: Worker.threadId, short: server, serverInfo: data });
	}

	process.exit(1337);
})();
