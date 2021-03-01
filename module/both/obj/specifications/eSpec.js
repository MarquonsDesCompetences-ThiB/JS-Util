export var eSpec;
(function (eSpec) {
    /**
     * @cyclic
     */
    eSpec[eSpec["CYCLIC"] = 1] = "CYCLIC";
    /**
     * descriptor.enumerable = true
     */
    eSpec[eSpec["ENUM"] = 2] = "ENUM";
    /**
     * descriptor.enumerable = false
     * AND @not_enum
     */
    eSpec[eSpec["NOT_ENUM"] = 4] = "NOT_ENUM";
    /**
     * @jsonify
     */
    eSpec[eSpec["JSONIFY"] = 8] = "JSONIFY";
    /**
     * @jsonified
     */
    eSpec[eSpec["JSONIFIED"] = 16] = "JSONIFIED";
    eSpec[eSpec["ALL"] = 31] = "ALL";
})(eSpec || (eSpec = {}));
//# sourceMappingURL=eSpec.js.map