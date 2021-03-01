export * as cyclic from "./cyclic.js";
export * as jsonified from "./jsonified.js";
export * as not_enum from "./not_enum.js";

//
// === DECORATORS DIRECT ACCESS ===
import { cyclic } from "./cyclic.js";
import { jsonified } from "./jsonified.js";
import { not_enum } from "./not_enum.js";
export const decs = {
  cyclic,
  jsonified,
  not_enum,
};
