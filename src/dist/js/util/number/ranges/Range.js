'use strict'

/**
 * Use '' for infinite
 */
class Range {
    constructor(obj = {}) {
        this.min = obj.min;
        this.max = obj.max;
        this.val = obj.val; //val to use when in this range
    }

    get_JSON() {
        return {
            min: this.min,
            max: this.max,
            val: this.val
        };
    }

    /**
     * 
     * @param {*} val 
     * @rturn {boolean} True if val is in [min; max[ 
     */
    in_range(val) {
        if (this.min === undefined) {
            return false;
        }
        if (this.max === undefined) {
            return false;
        }

        // val is in [min; infinite[
        if (this.max === '' && val >= this.min) {
            logger.log='Range#in_range Value (' +
                val + ') is in [' + this.min + '; infinite[ => return true');
            return true;
        }

        return val >= this.min && val < this.max;
    }
}