"use strict";
const NodeEnvironment = require("jest-environment-node");

class Tests_Environment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();

    this.global.util = global.util;
    this.global.tests = global.tests;
    this.global.env = this.global.tests.fixtures.env;
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }

  async handleTestEvent(event, state) {
    super.handleTestEvent(event, state);
  }
}

module.exports = Tests_Environment;
