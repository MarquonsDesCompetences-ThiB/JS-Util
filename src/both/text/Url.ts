"use strict";
import { Crypt } from "./Crypt.js";

export class Url {
  /**
   * Pwd and iv specified to enable the endpoint to restart
   *                                /the user to change endpoint
   */
  #crypt;

  constructor(pwd: string, iv: Buffer | number[]) {
    this.#crypt = new Crypt(pwd, iv);
  }

  /**
   *
   * @param {string} url
   *
   * @return {string} Encrypted url
   */
  encrypt(url) {
    return this.#crypt.encrypt(url).encrypted;
  }

  decrypt(encrypted_url) {
    return this.#crypt.decrypt(encrypted_url);
  }
}
