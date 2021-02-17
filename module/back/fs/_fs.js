export * from "./fs.js";
import { Directory_Tree } from "./tree/Directory_Tree.js";
import { Directory_Tree_Root } from "./tree/Directory_Tree_Root.js";
import { Directory_Tree_Slave } from "./tree/slave/Directory_Tree_Slave.js";
export const tree = {
    Master_Root: Directory_Tree_Root,
    Master_Node: Directory_Tree,
    Slave: Directory_Tree_Slave,
};
//# sourceMappingURL=_fs.js.map