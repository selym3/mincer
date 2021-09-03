////////////////////
// BASE INTERFACE //
////////////////////

/**
 * A matcher is used to determine if an Entry 
 * can be applied to a certain dirent based on the dirent
 * name. 
 * 
 * Matchers also have a measure of exactness / priority to 
 * allow multiple matchers in certain contexts.
 */
export interface IMatcher {

    /**
     * The priority number used to compare exactness with
     * other matchers
     */
    priority: number;

    /**
     * Tests if this matcher fits a name
     * 
     * @param name the dirent name
     */
    test(name: string): boolean;
}

//////////////////// 
// LAMBDA MATCHER //
////////////////////

/**
 * The lambda type used by the lambda Matcher
 */
export type MatcherFunction = (name: string) => boolean;

// export enum MatchPriority {
//     HIGH = 0,
//     MEDIUM = 1,
//     LOW = 2
// };

/**
 * A matcher class that works with a lambda 
 */
export class Matcher implements IMatcher {
    
    static match(matchName: string): Matcher {
        return new Matcher(
            1,
            (name: string) => name === matchName
        );
    }

    static extension(fileExtension: string): Matcher {
        fileExtension = fileExtension.toLowerCase().replace('.', '[.]');
        return Matcher.regex(`^.*${fileExtension}$`);
    }

    static regex(regexString: string): Matcher {
        const regex = new RegExp(regexString);

        return new Matcher(
            2,
            (name: string) => regex.test(name)
        );
    }

    static lambda(priority: number, tester: MatcherFunction) {
        return new Matcher(priority, tester);
    }
    
    static all(): Matcher {
        return new Matcher(
            3,
            (name: String) => true
        );
    }

    /**
     * matcher priority
     */
    priority: number;

    /**
     * Internal test function for a matcher
     */
    tester: MatcherFunction;

    /**
     * Creates a matcher with a lambda
     * 
     * @param priority a custom priority for this matcher
     * @param tester determines if a dirent name fits this matcher
     */
    private constructor(priority: number, tester: MatcherFunction) {
        this.priority = priority;
        this.tester = tester;
    }

    /**
     * 
     * @param name dirent name
     * @returns 
     */
    test(name: string): boolean {
        return this.tester(name);
    }
}

export type Matchable = IMatcher | string;

export function toMatcher(matchable: Matchable): IMatcher {
    if (typeof matchable === "string")
        return Matcher.match(matchable);
    else 
        return (matchable as IMatcher);
}
