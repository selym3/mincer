const { 
    Directory,
    ArrayCollector,
    ObjectCollector,

    File,
    Matcher

} = require('../lib');

// A conference of type other is represented by a file and can be any type of file
const OtherConferece = new File(Matcher.all());

// The other conferences folder holds OtherConference
const OtherConferences = new Directory(
    'other', // folder name
    new ArrayCollector(), // collects other conferences into list
    [OtherConferece]
);

/**
 */

const Details = new File('details.md');
const Committees = new File(Matcher.extension('.json'), JSON.parse);

const StuyConference = new Directory(
    Matcher.all(), // can be any folder
    new ArrayCollector(), // collects conference parts into a map
    [Details, Committees] // describes what to check in each folder
)

const StuyConferences = new Directory(
    'stuy', // folder name 
    new ArrayCollector(), // collects each conferences and all its data into a list
    [StuyConference]
)

/**
 */

const Conferences = new Directory(
    'conferences', // folder name,
    new ObjectCollector(), // collect each type of conference (other/stuy) into a map
    [OtherConferences, StuyConferences]
)

/**
 */

// this is the root directory
const builder = new Directory(
    'data/',
    new ObjectCollector(),
    [
        Conferences,
        new File(Matcher.match('about.md')),
        new File(Matcher.match('our-team.json'), JSON.parse)
    ]
);

const root = {
    path: '',
    target: 'data/'
};

/**
 */

const data = builder.getObject(root);
console.log(JSON.stringify(data, null, '    '));