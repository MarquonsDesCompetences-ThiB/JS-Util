import { Virtual_Directory_Tree_props } from "./_props/Virtual_Directory_Tree_props.js";

export class Virtual_Directory_Tree extends Virtual_Directory_Tree_props {
  constructor(obj?) {
    super();

    if (obj) {
      this.set(obj, undefined, true);
    }
  }
}
