"use strict";
import { Address_props } from "./_props/Address_props.js";
export class Address extends Address_props {
    /**
     *
     * Parameters are for this.set
     * @param {*} obj
     */
    constructor(obj = undefined) {
        super();
        if (obj) {
            this.set(obj, undefined, true);
        }
    }
    to_string() {
        let str = "";
        if (this.number != null) {
            str += this.number + " ";
            logger.debug = "number " + str + " " + typeof this.number;
        }
        if (this.address != null) {
            str += this.address + " ";
        }
        if (this.address2 != null) {
            str += this.address2 + " ";
        }
        if (this.zip_code != null) {
            str += this.zip_code + " ";
        }
        if (this.city != null) {
            str += this.city + " ";
        }
        if (this.country != null) {
            str += this.country + " ";
        }
        logger.debug = str;
        return str;
    }
    equals(addr) {
        if (!addr || !(addr instanceof Address)) {
            logger.debug = "addr ! Address";
            return false;
        }
        return super.equals(addr);
    }
}
//# sourceMappingURL=Address.js.map