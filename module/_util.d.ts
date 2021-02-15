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
export declare const bool: typeof both.bool, json: typeof both.json;
export declare const text: typeof both.text, number: typeof both.number;
export declare const types: typeof both.types, obj: typeof both.obj;
export declare const geo: typeof both.geo, graphic: typeof both.graphic;
export declare const regex: typeof both.regex, time: typeof both.time;
