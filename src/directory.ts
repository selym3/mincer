import { Dirent, readdirSync } from "fs";
import { join } from "path";
import { ICollector } from "./collectors";

import { Entry, EntryLocation, EntryType } from "./entry";
import { IMatcher, Matchable } from "./matchers";

/**
 * The entry type for a directory (if the dirent can be used on the entry)
 */
const DirectoryType: EntryType = dirent => dirent.isDirectory();

/**
 * Type when comparing dirents against entries
 */
type EntryMatch = Entry | undefined;

/**
 * A class to represent a Directory entry. A directory
 * will explore itself and use sub-entries to return an object.
 */
export class Directory extends Entry {

    /**
     * sub entries that will be used to parse the contents
     * of this directory
     */
    entries: Entry[];

    /**
     * sub entries' parsed results will be accumulated 
     * in a collector
     */
    collector: ICollector;

    /**
     * Create a directory
     * 
     * @param matcher matcher to use on this directory
     * @param collector collector to accumulate responses
     * @param entries subentries to expect in the directory
     */
    constructor(matcher: Matchable, collector: ICollector, entries: Entry[]) {
        super(matcher, DirectoryType);
        this.entries = entries;
        this.collector = collector;
    }

    /**
     * Finds the most closest entry match for a dirent
     * 
     * @param dirent the dirent to compare against
     * @returns entry or undefined
     */
    private getEntry(dirent: Dirent): EntryMatch {
        let bestMatch: EntryMatch = undefined;

        for (let entry of this.entries) {
            const moreExact = bestMatch === undefined || 
                entry.matcher.priority < bestMatch.matcher.priority;

            if (moreExact && entry.isApplicable(dirent)) {
                bestMatch = entry;
            }
        }

        return bestMatch;
    }

    /**
     * Gets an object representing all the contents in the directory
     * and the given subentries 
     * 
     * @param loc location of directory
     * @returns object representing the directory
     */
    getObject(loc: EntryLocation): object {
        const path = join(loc.path, loc.target);

        const dirents = readdirSync(path, { withFileTypes: true });

        for (let dirent of dirents) {
            console.log(dirent.name);
            const entry = this.getEntry(dirent);
            
            if (entry) {
                const next = entry.getObject({ 
                    path: path, 
                    target: dirent.name 
                });

                this.collector.add(dirent, next);
            }
        }

        const object = this.collector.get();
        this.collector.reset();
        return object;
    }
}