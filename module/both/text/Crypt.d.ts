/// <reference types="node" />
import crypto from "crypto";
export interface Crypted_Data {
    iv: string;
    key: string;
    encrypted: string;
}
/**
 * Members :
 *  algo {string}
 *  key {Buffer, hex}
 *  iv {Buffer, hex}
 *  cipher
 */
export declare class Crypt {
    protected algo: string;
    protected key: Buffer;
    protected iv: Buffer;
    protected cipher: crypto.Cipher;
    /**
     *
     * @param {string} password 32 bytes password
     * @param {Buffer, hex optional} iv 16 bytes initialisation vector
     * @param {string optional} algo
     */
    constructor(password: string, iv: Buffer | number[], algo?: string);
    /**
     *
     * @param {string} text Text to encrypt
     *
     * @return {object} With :
     *                    iv {string},
     *                    key {string},
     *                    encrypted {string}
     */
    encrypt(uncrypted_text: string): Crypted_Data;
    /**
     *
     * @param {string | Buffer, hex} text
     * @param {string | Buffer, hex | optional} iv
     * @param {string | Buffer, hex  | optional} key
     *
     * @return {string}
     */
    decrypt(encrypted_text: any, iv?: string | Buffer, key?: string | Buffer): string;
}
