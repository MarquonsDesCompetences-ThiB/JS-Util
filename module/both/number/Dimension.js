"use strict";
import { obj } from "../types/_types.js";
export class Dimension extends obj.Obj {
    constructor(obj = undefined) {
        super();
        if (obj) {
            this.set(obj, undefined, true);
        }
    }
}
//# sourceMappingURL=Dimension.js.map