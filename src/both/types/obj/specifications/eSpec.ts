import { Set_Array } from "@both_array/_array.js";

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

export enum eSpec {
  /**
   * descriptor.enumerable = true
   */
  DESCR_CONFIGURABLE = spec_DESCR_CONFIGURABLE,

  /**
   * descriptor.enumerable = true
   */
  DESCR_ENUMERABLE = spec_DESCR_ENUMERABLE,

  /**
   * descriptor.enumerable = true
   */
  DESCR_WRITABLE = spec_DESCR_WRITABLE,

  /**
   * All descriptor's fields
   */
  DESCRIPTOR = spec_DESCRIPTOR,

  /**
   * @cyclic
   */
  CYCLIC = spec_CYCLIC,

  /**
   * descriptor.enumerable = false
   * AND @enum
   */
  ENUM = spec_ENUM,

  /**
   * @jsonify
   */
  JSONIFY = spec_JSONIFY,

  /**
   * @jsonified
   */
  JSONIFIED = spec_JSONIFIED,

  /**
   * @meta
   * About the object itself
   */
  META = spec_META,

  /**
   *  CYCLIC, ENUM, JSONIFY, JSONIFIED, META
   */
  DECORATORS = spec_DECORATORS,

  ALL = spec_ALL,

  //
  // === USEFUL CUMULATIVE ENUM VALUES ===
  /**
   * DESCRIPTOR, CYCLIC, ENUM, META, JSONIFIED
   */
  ALL_NOT_JSONIFYING = specs_ALL_NOT_JSONIFYING,

  /**
   * DESCRIPTOR, CYCLIC, ENUM, META, JSONIFY
   */
  ALL_JSONIFYING = specs_ALL_JSONIFYING,

  /**
   * DESCRIPTOR, JSONIFY
   */
  JSON = specs_JSON,

  /**
   * DESCRIPTOR, ENUM, JSONIFY
   */
  JSON_PRIVATE = specs_JSON_private,
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

export function empty_arr_By_Spec(): iBy_Spec {
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
