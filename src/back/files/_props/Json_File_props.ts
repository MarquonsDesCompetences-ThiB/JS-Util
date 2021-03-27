"use strict";
import { File } from "../File.js";

export abstract class Json_File_props extends File {
  //
  // === CONTENT ===
  /**
   * Content as a json (object)
   */
  #_cntnt_bj?: any;

  get content(): any {
    return this.#_cntnt_bj;
  }

  set content(content: any) {
    this.#_cntnt_bj = content;
  }

  //
  // === CONTENT ===
  /**
   * Return the number of items in files (if read)
   * Can be a number of :
   * objects (json files)
   */

  get nb() {
    //
    {
      if (this.#_cntnt_bj) {
        return Object.keys(this.#_cntnt_bj).length;
      }
    }

    throw ReferenceError("File not read");
  }

  constructor(obj = undefined) {
    super();
    if (obj) {
      this.set(obj, undefined, true);
    }
  }
}
