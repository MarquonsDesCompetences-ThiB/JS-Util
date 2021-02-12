/// <reference types="node" />
export declare class Url {
    #private;
    constructor(pwd: string, iv: Buffer | number[]);
    /**
     *
     * @param {string} url
     *
     * @return {string} Encrypted url
     */
    encrypt(url: any): any;
    decrypt(encrypted_url: any): any;
}
