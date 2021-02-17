var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
  };
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
  };
var __p;
import { obj } from "../../../_util";
export class Directory_Tree_props extends obj.Obj {
  constructor(obj) {
    super(obj);
    /**
     * Path
     */
    __p.set(this, void 0);
  }
  //
  // === PATH ===
  get path() {
    return __classPrivateFieldGet(this, __p);
  }
  set path(path) {
    //
    // Remove eventual starting/ending spaces
    {
      path = path.replace(/^\s+/, "");
      path = path.replace(/\s+$/, "");
    }
    //
    // Add ending slash if missing
    {
      if (!/\\|\/$/.test(path)) {
        path += "/";
      }
    }
    __classPrivateFieldSet(this, __p, path);
  }
}
__p = new WeakMap();
//# sourceMappingURL=Directory_Tree_props.js.map
