"use strict";
const config = require(process.env.SRC_ROOT + "config/config");
const redis = require("redis");

class Redis_Client {
  static last_ids = {
    default: -1,
  };

  static states = ["end", "error", "ready", "reconnecting", "off", "warning"];

  constructor(id_prefix) {
    this.id = id_prefix + Redis_Client.next_id(id_prefix);
    this.client = redis.createClient({
      url: config.redis.url,
    });

    this.state = Redis_Client.states.indexOf("off");

    this.init_redis_events();
  }

  static next_id(id_prefix) {
    if (id_prefix === undefined || id_prefix.length === 0) {
      return Redis_Client.last_ids.default++;
    }

    if (Redis_Client.last_ids[id_prefix] === undefined) {
      Redis_Client.last_ids[id_prefix] = 0;
      return Redis_Client.last_ids[id_prefix];
    }
    return Redis_Client.last_ids[id_prefix]++;
  }

  get_client() {
    return this.client;
  }

  init_redis_events() {
    let that = this;

    this.client.on("end", function (err) {
      that.state = Redis_Client.states.indexOf("end");
      logger.info =
        "Redis_Client#client::end Redis client " +
        that.id +
        " has closed connection : " +
        err;
    });

    this.client.on("error", function (err) {
      that.state = Redis_Client.states.indexOf("error");
      logger.error =
        "Redis_Client#client::error Redis client: " + that.id + " : " + err;
    });

    this.client.on("ready", function (err) {
      that.state = Redis_Client.states.indexOf("ready");
      logger.info =
        "Redis_Client#client::ready Redis client " +
        that.id +
        " is ready : " +
        err;
    });

    this.client.on("reconnecting", function (err) {
      that.state = Redis_Client.states.indexOf("reconnecting");
      logger.info =
        "Redis_Client#client::reconnecting Redis client " +
        that.id +
        " is trying to reconnect : " +
        err;
    });

    this.client.on("warning", function (err) {
      that.state = Redis_Client.states.indexOf("warning");
      logger.warn =
        "Redis_Client#client::warning Redis client " +
        that.id +
        " used a password without need or used a deprecated option/function/similar : " +
        err;
    });
  }

  is_ready() {
    return this.state === Redis_Client.states.indexOf("ready");
  }
}

module.exports = Redis_Client;
