"use strict";

const Scripted_File = require(process.env.SRC_ROOT +
  "js/util/files/scripted/Scripted_File");

class UI_Fixtures_Scripted_File extends Scripted_File {
  static owned_members = [];

  constructor(obj = undefined, child_owned_members = []) {
    super(UI_Fixtures_Scripted_File.owned_members.concat(child_owned_members));

    this.set(obj);
  }

  parse(cbk) {
    let that = this;
    super.parse(on_parsed);

    function on_parsed(err) {
      if (err) {
        const msg = "Error(s) parsing file : " + err;
        logger.error("UI_Fixtures_Scripted_File#parse " + msg);
        return cbk(msg);
      }

      cbk();
    }
  }
}

module.exports = UI_Fixtures_Scripted_File;
