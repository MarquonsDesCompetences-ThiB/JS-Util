import { Directory_Tree_props } from "./_props/Directory_Tree_props";
export declare class Directory_Tree extends Directory_Tree_props {
  scan(entries_matching_path?: string): Promise<Directory_Tree>;
}
