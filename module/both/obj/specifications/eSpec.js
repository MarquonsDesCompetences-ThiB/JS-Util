export var eSpec;
(function (eSpec) {
    /**
     * descriptor.enumerable = true
     */
    eSpec[eSpec["DESCR_CONFIGURABLE"] = 1] = "DESCR_CONFIGURABLE";
    /**
     * descriptor.enumerable = true
     */
    eSpec[eSpec["DESCR_ENUMERABLE"] = 2] = "DESCR_ENUMERABLE";
    /**
     * descriptor.enumerable = true
     */
    eSpec[eSpec["DESCR_WRITABLE"] = 4] = "DESCR_WRITABLE";
    /**
     * @cyclic
     */
    eSpec[eSpec["CYCLIC"] = 8] = "CYCLIC";
    /**
     * descriptor.enumerable = false
     * AND @enum
     */
    eSpec[eSpec["ENUM"] = 16] = "ENUM";
    /**
     * @jsonify
     */
    eSpec[eSpec["JSONIFY"] = 32] = "JSONIFY";
    /**
     * @jsonified
     */
    eSpec[eSpec["JSONIFIED"] = 64] = "JSONIFIED";
    eSpec[eSpec["ALL"] = 127] = "ALL";
})(eSpec || (eSpec = {}));
//# sourceMappingURL=eSpec.js.map