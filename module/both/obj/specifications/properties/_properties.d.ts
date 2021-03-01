export * as cyclic from "./cyclic.js";
export * as jsonified from "./jsonified.js";
export * as enumerable from "./enumerable.js";
import { cyclic } from "./cyclic.js";
import { jsonified } from "./jsonified.js";
import { enumerable } from "./enumerable.js";
export declare const decs: {
    cyclic: typeof cyclic;
    jsonified: typeof jsonified;
    enum: typeof enumerable;
};
