"use strict";
import crypto from "crypto";
import { string } from "../types/_types.js";
/**
 * Members :
 *  algo {string}
 *  key {Buffer, hex}
 *  iv {Buffer, hex}
 *  cipher
 */
export class Crypt {
    /**
     *
     * @param {string} password 32 bytes password
     * @param {Buffer, hex optional} iv 16 bytes initialisation vector
     * @param {string optional} algo
     */
    constructor(password, iv, algo = "aes-256-cbc") {
        this.algo = algo;
        //
        // Create key from password
        {
            this.key = Buffer.alloc(32); // key should be 32 bytes
            this.key = Buffer.concat([Buffer.from(password)], this.key.length);
        }
        //
        // Create the iv
        if (iv instanceof Buffer) {
            this.iv = iv;
        }
        else {
            this.iv = Buffer.alloc(16); // iv should be 16
            // Randomize for best results
            this.iv = Buffer.from(Array.prototype.map.call(iv, () => {
                return Math.floor(Math.random() * 256);
            }));
        }
        //
        // Make the cipher with algo, key, and iv
        this.cipher = crypto.createCipheriv(this.algo, this.key, this.iv);
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
    encrypt(uncrypted_text) {
        let encrypted = this.cipher.update(uncrypted_text);
        encrypted = Buffer.concat([encrypted, this.cipher.final()]);
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
    decrypt(encrypted_text, iv = this.iv, key = this.key) {
        //
        // Fetch iv as buffer
        if (string.is(iv)) {
            iv = Buffer.from(iv, "hex");
        }
        //
        // Fetch key as buffer
        if (string.is(key)) {
            key = Buffer.from(key, "hex");
        }
        //
        // Fetch text as buffer
        if (string.is(encrypted_text)) {
            encrypted_text = Buffer.from(encrypted_text, "hex");
        }
        let decipher = crypto.createDecipheriv(this.algo, key, iv);
        let decrypted = decipher.update(encrypted_text);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
//# sourceMappingURL=Crypt.js.map