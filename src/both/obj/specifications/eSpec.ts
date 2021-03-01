export enum eSpec {
  /**
   * descriptor.enumerable = true
   */
  DESCR_CONFIGURABLE = 1,

  /**
   * descriptor.enumerable = true
   */
  DESCR_ENUMERABLE = 2,

  /**
   * descriptor.enumerable = true
   */
  DESCR_WRITABLE = 4,

  /**
   * @cyclic
   */
  CYCLIC = 8,

  /**
   * descriptor.enumerable = false
   * AND @enum
   */
  ENUM = 16,

  /**
   * @jsonify
   */
  JSONIFY = 32,

  /**
   * @jsonified
   */
  JSONIFIED = 64,

  ALL = 127,
}
