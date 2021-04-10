import { Address_props } from "./_props/Address_props.js";
export declare class Address extends Address_props {
    /**
     *
     * Parameters are for this.set
     * @param {*} obj
     */
    constructor(obj?: any);
    to_string(): string;
    equals(addr: any): boolean;
}
