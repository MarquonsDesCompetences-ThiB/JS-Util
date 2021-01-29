"use strict";
const { Worker, workerData } = require("worker_threads");

const io_server = require("socket.io");
const io_client = require("socket.io-client");

const server = {
  host: "localhost",
  port: 3777,
};

class TestsServer_Environment {
  static async load_globals(server_endpoint = server) {
    const client = io_client(
      "http://" + server_endpoint.host + ":" + server_endpoint.port
    );

    return new Promise((success) => {
      client.on("global", (data) => {
        Object.assign(global, data.global);
        success();
      });

      client.emit("global");
    });
  }

  constructor() {}

  launch_server(server_endpoint = server) {
    this.server = io_server();

    this.server.on("connection", (client) => {
      logger.log = "Client connected : " + client.id;

      client.on("global", (socket) => {
        client.emit("global", {
          global: {
            tests: workerData.tests,
            util: workerData.util,
          },
        });
      });
    });

    this.server.listen(server_endpoint.port);
    //TestsServer_Environment.load_globals();
  }
}

if (workerData) {
  let server = new TestsServer_Environment();
  server.launch_server();

  loop();
  function loop() {
    setTimeout(loop, 500);
  }
}

module.exports = TestsServer_Environment;
