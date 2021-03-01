export declare enum eSpec {
    /**
     * @cyclic
     */
    CYCLIC = 1,
    /**
     * descriptor.enumerable = true
     */
    ENUM = 2,
    /**
     * descriptor.enumerable = false
     * AND @not_enum
     */
    NOT_ENUM = 4,
    /**
     * @jsonify
     */
    JSONIFY = 8,
    /**
     * @jsonified
     */
    JSONIFIED = 16,
    ALL = 31
}
