export * as jsonify from "./jsonify.js";
export * as enumerable from "./enumerable.js";
export * as meta from "./meta.js";
import { jsonify } from "./jsonify.js";
import { enumerable } from "./enumerable.js";
import { meta } from "./meta.js";
export declare const decs: {
    jsonify: typeof jsonify;
    enum: typeof enumerable;
    meta: typeof meta;
};
