export var eProp_Spec;
(function (eProp_Spec) {
    /**
     * @cyclic
     */
    eProp_Spec[eProp_Spec["CYCLIC"] = 1] = "CYCLIC";
    /**
     * descriptor.enumerable = true
     */
    eProp_Spec[eProp_Spec["ENUM"] = 2] = "ENUM";
    /**
     * descriptor.enumerable = false
     * AND @not_enum
     */
    eProp_Spec[eProp_Spec["NOT_ENUM"] = 4] = "NOT_ENUM";
    /**
     * @jsonify
     */
    eProp_Spec[eProp_Spec["JSONIFY"] = 8] = "JSONIFY";
    /**
     * @jsonified
     */
    eProp_Spec[eProp_Spec["JSONIFIED"] = 16] = "JSONIFIED";
    eProp_Spec[eProp_Spec["ALL"] = 31] = "ALL";
})(eProp_Spec || (eProp_Spec = {}));
//# sourceMappingURL=specs.js.map