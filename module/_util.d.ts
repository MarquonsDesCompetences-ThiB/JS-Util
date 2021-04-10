import * as back from "./back/_back.js";
export { back };
export declare const logger: typeof back.logger, file: typeof back.file, fs: typeof back.fs;
declare global {
    var logger: back.logger.Logger;
    var debug: any;
    var info: any;
    var error: any;
    var ex: any;
    var fatal: any;
    var log: any;
    var table: any;
    var trace: any;
    var warn: any;
}
import * as both from "./both/_both.js";
declare const _default: {
    both: typeof both;
};
export default _default;
export declare const bool: typeof both.types.bool, json: typeof both.types.json, string: typeof both.types.string;
export declare const text: typeof both.text, number: typeof both.number;
export declare const types: typeof both.types, obj: typeof both.types.obj;
export declare const geo: typeof both.geo, graphic: typeof both.graphic;
export declare const regex: typeof both.types.regex, time: typeof both.time;
