import { Directory_Tree } from "./common/Directory_Tree.js";
import { iDirectory_Tree_Node, iDirectory_Tree_Root_or_Node, tDirectory_Tree_Node } from "./iDirectory_Tree_Node.js";
export declare class Directory_Tree_Node extends Directory_Tree implements iDirectory_Tree_Node {
    readonly is_root = false;
    parent: iDirectory_Tree_Root_or_Node;
    dirs: Map<string, iDirectory_Tree_Node>;
    /**
     *
     * @param obj Required if Directory_Tree_Node is the final class of this
     */
    constructor(obj?: tDirectory_Tree_Node | Directory_Tree_Node);
    get virtual_root(): import("./_directory.js").Virtual;
}
