//
// === Back
// all
import * as back from "./back/_back.js";
export { back };

// direct access
export const { Logger, file, fs } = back;

//
// === Both
import * as both from "./both/_both.js";
export default { both };

// direct access
export const { bool, json } = both;

export const { text, number } = both;

export const { types, obj } = both;

export const { geo, graphic } = both;

export const { regex, time } = both;
