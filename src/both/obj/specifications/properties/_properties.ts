export * as cyclic from "./cyclic.js";
export * as jsonified from "./jsonified.js";
export * as enumerable from "./enumerable.js";

//
// === DECORATORS DIRECT ACCESS ===
import { cyclic } from "./cyclic.js";
import { jsonified } from "./jsonified.js";
import { enumerable } from "./enumerable.js";
export const decs = {
  cyclic,
  jsonified,
  enum: enumerable,
};
