"use strict";
import { text } from "@src/both/_both";
import { File } from "../_files";

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
}
