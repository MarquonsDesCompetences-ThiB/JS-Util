import { Address_props } from "./_props/Address_props.js";
export declare class Address extends Address_props {
    /**
     *
     * Parameters are for this.set
     * @param {*} obj
     */
    constructor(obj?: any);
    /**
     *
     * @param {bool} include_not_enumerable_props
     * @param {bool} as_string  If true, everything is processed by
     *                          this.toJSON_as_string
     *                          => numbers are converted to string
     */
    toJSON(include_not_enumerable_props?: boolean, as_string?: boolean): {};
    to_string(): string;
    equals(addr: any): boolean;
}
