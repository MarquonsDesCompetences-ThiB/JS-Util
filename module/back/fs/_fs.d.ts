import { Directory_Tree } from "./tree/Directory_Tree.js";
import { Directory_Tree_Root } from "./tree/Directory_Tree_Root.js";
import { Directory_Tree_Slave } from "./tree/slave/Directory_Tree_Slave.js";
export declare const tree: {
    Master_Root: typeof Directory_Tree_Root;
    Master_Node: typeof Directory_Tree;
    Slave: typeof Directory_Tree_Slave;
};
export { Entry_Stats_intf } from "./tree/_props/Directory_Tree_props.js";
export * from "./fs.js";
