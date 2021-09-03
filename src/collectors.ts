import { Dirent } from "fs";

/**
 * A collector is used by a director to accumulate 
 * its subentries 
 */
export interface ICollector {

    /**
     * Adds an object from a directory subentry
     * 
     * @param dirent dirent related to an entry
     * @param object object from an entry
     */
    add(dirent: Dirent, object: object): void;

    /**
     * Retrieves the collectors data
     */
    get(): object;

    /**
     * Resets the collector
     */
    reset(): void;
}

interface IObject {
    [key: string]: any;
}

/**
 * A class based on a javascript object
 */
export class ObjectCollector implements ICollector {
    object: IObject;

    constructor() {
        this.object = {};
    }
    
    add(dirent: Dirent, object: object): void {
        this.object[dirent.name] = object;
    }

    get(): object {
        return this.object;
    }

    reset(): void {
        this.object = {};
    }
}

/**
 * A collector based on a javascript array
 */
export class ArrayCollector implements ICollector {
    buffer: object[];

    constructor() {
        this.buffer = [];
    }

    add(dirent: Dirent, object: IObject): void {
        object['_name'] = dirent.name;
        this.buffer.push(object);
    }

    get(): object {
        return this.buffer;
    }

    reset(): void {
        this.buffer = [];
    }
}

