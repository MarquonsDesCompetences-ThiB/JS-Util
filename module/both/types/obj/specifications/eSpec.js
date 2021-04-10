import { Set_Array } from "../../../array/_array.js";
/**
 * For iBy_Spec
 * Because eSpec's properties cannot be used as computed properties
 */
const spec_DESCR_CONFIGURABLE = 1;
const spec_DESCR_ENUMERABLE = 2;
const spec_DESCR_WRITABLE = 4;
const spec_DESCRIPTOR = 7; // = 1 | 2 | 4
const spec_CYCLIC = 8;
const spec_ENUM = 16;
const spec_JSONIFY = 32;
const spec_JSONIFIED = 64;
const spec_META = 128;
/**
 * All existing decorators :
 *  CYCLIC, ENUM, JSONIFY, JSONIFIED, META
 */
const spec_DECORATORS = 248; // 8 | 16 | 32 | 64 | 128
/**
 * All but CONFIGURABLE and WRITABLE
 * because if keys are not decored,
 * the fetchable ones are compelled to be DESCR_ENUMERABLE
 */
const spec_ALL = 250;
/**
 * DESCR_ENUMERABLE, CYCLIC, ENUM, META, JSONIFIED
 */
const specs_ALL_NOT_JSONIFYING = 218; // = 2 | 8 | 16 | 64 | 128
/**
 * DESCR_ENUMERABLE, CYCLIC, ENUM, META, JSONIFY
 */
const specs_ALL_JSONIFYING = 186; // = 2 | 8 | 16 | 32 | 128
/**
 * DESCR_ENUMERABLE, JSONIFY
 */
const specs_JSON = 34; // = 2 | 32
/**
 * DESCR_ENUMERABLE, ENUM, JSONIFY
 */
const specs_JSON_private = 50; // = 2 | 16 | 32
export var eSpec;
(function (eSpec) {
    /**
     * descriptor.enumerable = true
     */
    eSpec[eSpec["DESCR_CONFIGURABLE"] = spec_DESCR_CONFIGURABLE] = "DESCR_CONFIGURABLE";
    /**
     * descriptor.enumerable = true
     */
    eSpec[eSpec["DESCR_ENUMERABLE"] = spec_DESCR_ENUMERABLE] = "DESCR_ENUMERABLE";
    /**
     * descriptor.enumerable = true
     */
    eSpec[eSpec["DESCR_WRITABLE"] = spec_DESCR_WRITABLE] = "DESCR_WRITABLE";
    /**
     * All descriptor's fields
     */
    eSpec[eSpec["DESCRIPTOR"] = spec_DESCRIPTOR] = "DESCRIPTOR";
    /**
     * @cyclic
     */
    eSpec[eSpec["CYCLIC"] = spec_CYCLIC] = "CYCLIC";
    /**
     * descriptor.enumerable = false
     * AND @enum
     */
    eSpec[eSpec["ENUM"] = spec_ENUM] = "ENUM";
    /**
     * @jsonify
     */
    eSpec[eSpec["JSONIFY"] = spec_JSONIFY] = "JSONIFY";
    /**
     * @jsonified
     */
    eSpec[eSpec["JSONIFIED"] = spec_JSONIFIED] = "JSONIFIED";
    /**
     * @meta
     * About the object itself
     */
    eSpec[eSpec["META"] = spec_META] = "META";
    /**
     *  CYCLIC, ENUM, JSONIFY, JSONIFIED, META
     */
    eSpec[eSpec["DECORATORS"] = spec_DECORATORS] = "DECORATORS";
    eSpec[eSpec["ALL"] = spec_ALL] = "ALL";
    //
    // === USEFUL CUMULATIVE ENUM VALUES ===
    /**
     * DESCRIPTOR, CYCLIC, ENUM, META, JSONIFIED
     */
    eSpec[eSpec["ALL_NOT_JSONIFYING"] = specs_ALL_NOT_JSONIFYING] = "ALL_NOT_JSONIFYING";
    /**
     * DESCRIPTOR, CYCLIC, ENUM, META, JSONIFY
     */
    eSpec[eSpec["ALL_JSONIFYING"] = specs_ALL_JSONIFYING] = "ALL_JSONIFYING";
    /**
     * DESCRIPTOR, JSONIFY
     */
    eSpec[eSpec["JSON"] = specs_JSON] = "JSON";
    /**
     * DESCRIPTOR, ENUM, JSONIFY
     */
    eSpec[eSpec["JSON_PRIVATE"] = specs_JSON_private] = "JSON_PRIVATE";
})(eSpec || (eSpec = {}));
export function empty_arr_By_Spec() {
    return {
        [spec_DESCR_CONFIGURABLE]: new Set_Array(),
        [spec_DESCR_ENUMERABLE]: new Set_Array(),
        [spec_DESCR_WRITABLE]: new Set_Array(),
        [spec_DESCRIPTOR]: new Set_Array(),
        [spec_CYCLIC]: new Set_Array(),
        [spec_ENUM]: new Set_Array(),
        [spec_JSONIFY]: new Set_Array(),
        [spec_JSONIFIED]: new Set_Array(),
        [spec_META]: new Set_Array(),
        [spec_ALL]: new Set_Array(),
    };
}
const str_empty_arr_By_Spec = JSON.stringify({
    [spec_DESCR_CONFIGURABLE]: [],
    [spec_DESCR_ENUMERABLE]: [],
    [spec_DESCR_WRITABLE]: [],
    [spec_DESCRIPTOR]: [],
    [spec_CYCLIC]: [],
    [spec_ENUM]: [],
    [spec_JSONIFY]: [],
    [spec_JSONIFIED]: [],
    [spec_META]: [],
    [spec_ALL]: [],
});
//# sourceMappingURL=eSpec.js.map