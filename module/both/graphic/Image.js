"use strict";
import { Image_props } from "./_props/Image_props.js";
export class Image extends Image_props {
    constructor(obj) {
        super();
        if (obj) {
            this.set(obj, undefined, true);
        }
    }
}
//# sourceMappingURL=Image.js.map