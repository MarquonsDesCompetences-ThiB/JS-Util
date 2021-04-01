import { Directory_Tree } from "./common/Directory_Tree.js";
import {
  iDirectory_Tree_Node,
  iDirectory_Tree_Root_or_Node,
  tDirectory_Tree_Node,
} from "./iDirectory_Tree_Node.js";

export class Directory_Tree_Node
  extends Directory_Tree
  implements iDirectory_Tree_Node {
  readonly is_root = false;

  parent: iDirectory_Tree_Root_or_Node;
  dirs: Map<string, iDirectory_Tree_Node>;

  /**
   *
   * @param obj Required if Directory_Tree_Node is the final class of this
   */
  constructor(obj?: tDirectory_Tree_Node | Directory_Tree_Node) {
    super();

    if (obj) {
      this.set(obj, undefined, true);
    }

    //
    // Check postconds
    {
      //
      // Final Directory_Tree must have an obj and parent argument
      if (
        Object.getPrototypeOf(this).constructor.name === "Directory_Tree_Node"
      ) {
        if (!obj) {
          throw new TypeError("Missing argument obj{iDirectory_Tree_Node}");
        }

        if (!this.parent) {
          throw new TypeError(
            "Directory " + this.name + " : Parent is missing"
          );
        }
      }
    }
  }

  get virtual_root() {
    return this.root.virtual_root;
  }
}

/**
 * Set Directory_Tree.make_node
 */
Directory_Tree.make_node = function (
  node_dir: tDirectory_Tree_Node | iDirectory_Tree_Node
) {
  return new Directory_Tree_Node(node_dir);
};
