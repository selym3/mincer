import { Dirent } from 'fs';
import { IMatcher, Matchable, toMatcher } from './matchers';

/**
 * Structure that tells an entry where it is
 * when its generating an object
 */
export interface EntryLocation {

    /**
     * The path leading up to the entry based on
     * the previous entries
     */
    path: string;

    /**
     * the real name of the entry that its matcher 
     * determined
     */
    target: string;
}

/**
 * Describes the type of dirent the entry works
 * on
 */
export type EntryType = (dirent: Dirent) => boolean;

/**
 * An entry represents an entity that can be 
 * parsed 
 */
export abstract class Entry {

    // Having two different validators for dirents (one for name
    // and one for dirent type) allows matchers to conveniently work on 
    // any Entry. 

    /**
     * every entry should be able to match against
     * dirent names
     */
    matcher: IMatcher;

    /**
     * The type of entry (the dirent type that this entry
     * works on)
     */
    type: EntryType;

    /**
     * Create an entry, subclasses must always provide
     * a matcher and entry type.
     * 
     * @param matcher matcher implementation
     * @param type entry type
     */
    constructor(matcher: Matchable, type: EntryType) {
        this.matcher = toMatcher(matcher);
        this.type = type;
    }


    /**
     * Tests if dirent is applicaple with the entry's matcher
     * and entry type
     * 
     * @param dirent dirent to dest
     * @returns if entry applies to dirent
     */
    isApplicable(dirent: Dirent) {
        return this.matcher.test(dirent.name) && 
            this.type(dirent);
    }

    /**
     * Generates a javascript object based on the entry's contents
     * at a location
     * 
     * @param loc entry location
     */
    abstract getObject(loc: EntryLocation): object;
}