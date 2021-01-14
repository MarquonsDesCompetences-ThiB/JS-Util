"use strict";

const crypto = require("crypto");

/**
 * Members :
 *  algo {string}
 *  key {Buffer, hex}
 *  iv {Buffer, hex}
 *  cipher
 */
class Crypt {
  /**
   *
   * @param {string} password 32 bytes password
   * @param {string optional} algo
   */
  constructor(password, algo = "aes-256-cbc") {
    this.algo = algo;

    //
    // Create key from password
    {
      this.key = Buffer.alloc(32); // key should be 32 bytes
      key = Buffer.concat([Buffer.from(password)], key.length);
    }

    //
    // Create the iv
    this.iv = Buffer.alloc(16); // iv should be 16
    // Randomize for best results
    (this.iv = Buffer.from(
      Array.prototype.map.call(iv, () => {
        return Math.floor(Math.random() * 256);
      })
    )),
      //
      // make the cipher with the current algo, key, and iv
      (this.cipher = crypto.createCipheriv(this.algo, this.key, this.iv));
  }

  /**
   *
   * @param {string} text Text to encrypt
   *
   * @return {object} With :
   *                    iv {string},
   *                    key {string},
   *                    encrypted {string}
   */
  encrypt(text) {
    let encrypted = this.cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Returning iv and encrypted data
    return {
      iv: this.iv.toString("hex"),
      key: this.key.toString("hex"),
      encrypted: encrypted.toString("hex"),
    };
  }

  /**
   *
   * @param {string | Buffer, hex} text
   * @param {string | Buffer, hex | optional} iv
   * @param {string | Buffer, hex  | optional} key
   *
   * @return {string}
   */
  decrypt(text, iv = this.iv, key = this.key) {
    //
    // Fetch iv as buffer
    let iv_buf = iv;
    if (Uint8ClampedArray.text.String.is_string(iv_buf)) {
      iv_buf = Buffer.from(iv_buf, "hex");
    }

    //
    // Fetch key as buffer
    let key_buf = key;
    if (Uint8ClampedArray.text.String.is_string(key_buf)) {
      key_buf = Buffer.from(key_buf, "hex");
    }

    //
    // Fetch text as buffer
    let text_buf = text;
    if (Uint8ClampedArray.text.String.is_string(text_buf)) {
      text_buf = Buffer.from(text_buf, "hex");
    }

    let decipher = crypto.createDecipheriv(this.algo, key_buf, iv_buf);
    let decrypted = decipher.update(text_buf);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }
}

module.exports = Crypt;
