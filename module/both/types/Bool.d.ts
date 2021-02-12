/**
 * Return if obj is a boolean/Boolean or not, strictly or not
 * @param {*} obj
 * @param {bool} strict If not strict and obj is a string or number,
 *                          check if equivalent to a boolean
 *                            ( string : {false, true}
 *                              number : {0, 1}
 *                            )
 */
export declare function is(obj: any, strict?: boolean): boolean;
