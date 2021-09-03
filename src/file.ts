import { readFileSync } from "fs";
import { join } from "path";
import { Entry, EntryLocation, EntryType } from "./entry";
import { Matchable } from "./matchers";

/**
 * Entry type for files (based on dirent)
 */
const FileType: EntryType = dirent => dirent.isFile();

/**
 * Type for file entries that converts a string into an object
 */
export type FileParser = (contents: string) => object;

export const DefaultParser: FileParser = (e: string) => { return {contents: e }; };

/**
 * Class that represents a file entry. A file entry will
 * parse a file and return its contents in an object
 */
export class File extends Entry {

    /** converts contents to javascript object */
    parser: FileParser;

    /**
     * Creates a file entry
     * 
     * @param matcher file name matcher
     * @param parser file parser
     */
    constructor(matcher: Matchable, parser: FileParser = DefaultParser) {
        super(matcher, FileType);
        this.parser = parser;
    }

    /**
     * Creats object from file contents
     * 
     * @param loc file location
     * @returns object parsed by file
     */
    getObject(loc: EntryLocation): object {
        const filePath = join(loc.path, loc.target);
        
        return this.parser(String.fromCharCode(...readFileSync(filePath)));
    }
}