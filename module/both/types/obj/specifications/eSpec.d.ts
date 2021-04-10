/**
 * For iBy_Spec
 * Because eSpec's properties cannot be used as computed properties
 */
declare const spec_DESCR_CONFIGURABLE = 1;
declare const spec_DESCR_ENUMERABLE = 2;
declare const spec_DESCR_WRITABLE = 4;
declare const spec_DESCRIPTOR = 7;
declare const spec_CYCLIC = 8;
declare const spec_ENUM = 16;
declare const spec_JSONIFY = 32;
declare const spec_JSONIFIED = 64;
declare const spec_META = 128;
/**
 * All but CONFIGURABLE and WRITABLE
 * because if keys are not decored,
 * the fetchable ones are compelled to be DESCR_ENUMERABLE
 */
declare const spec_ALL = 250;
export declare enum eSpec {
    /**
     * descriptor.enumerable = true
     */
    DESCR_CONFIGURABLE,
    /**
     * descriptor.enumerable = true
     */
    DESCR_ENUMERABLE,
    /**
     * descriptor.enumerable = true
     */
    DESCR_WRITABLE,
    /**
     * All descriptor's fields
     */
    DESCRIPTOR,
    /**
     * @cyclic
     */
    CYCLIC,
    /**
     * descriptor.enumerable = false
     * AND @enum
     */
    ENUM,
    /**
     * @jsonify
     */
    JSONIFY,
    /**
     * @jsonified
     */
    JSONIFIED,
    /**
     * @meta
     * About the object itself
     */
    META,
    /**
     *  CYCLIC, ENUM, JSONIFY, JSONIFIED, META
     */
    DECORATORS,
    ALL,
    /**
     * DESCRIPTOR, CYCLIC, ENUM, META, JSONIFIED
     */
    ALL_NOT_JSONIFYING,
    /**
     * DESCRIPTOR, CYCLIC, ENUM, META, JSONIFY
     */
    ALL_JSONIFYING,
    /**
     * DESCRIPTOR, JSONIFY
     */
    JSON,
    /**
     * DESCRIPTOR, ENUM, JSONIFY
     */
    JSON_PRIVATE
}
export interface iBy_Spec {
    [spec_DESCR_CONFIGURABLE]?: any;
    [spec_DESCR_ENUMERABLE]?: any;
    [spec_DESCR_WRITABLE]?: any;
    [spec_DESCRIPTOR]?: any;
    [spec_CYCLIC]?: any;
    [spec_ENUM]?: any;
    [spec_JSONIFY]?: any;
    [spec_JSONIFIED]?: any;
    [spec_META]?: any;
    [spec_ALL]?: any;
}
export declare function empty_arr_By_Spec(): iBy_Spec;
export {};
