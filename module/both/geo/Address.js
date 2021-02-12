"use strict";
import { Address_props } from "./_props/Address_props.js";
export class Address extends Address_props {
    /**
     *
     * Parameters are for this.set
     * @param {*} obj
     */
    constructor(obj = undefined) {
        super(obj);
    }
    /**
     *
     * @param {bool} include_not_enumerable_props
     * @param {bool} as_string  If true, everything is processed by
     *                          this.toJSON_as_string
     *                          => numbers are converted to string
     */
    toJSON(include_not_enumerable_props = false, as_string = false) {
        return super.toJSON(include_not_enumerable_props, as_string);
    }
    to_string() {
        let str = "";
        if (this.number != null) {
            str += this.number + " ";
            logger.debug =
                "Address#to_string number " + str + " " + typeof this.number;
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
        logger.debug = "Address#to_string " + str;
        return str;
    }
    equals(addr) {
        if (!addr || !(addr instanceof Address)) {
            logger.debug = "Address#equals addr ! Address";
            return false;
        }
        return super.equals(addr);
    }
}
//# sourceMappingURL=Address.js.map