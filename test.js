const { Entity, deepClone } = require('./deepClone');

/* Assumptions:

entities: A list of all the entities in the system. The ids are unique integers.
links: A list of all the links in the system.
entity_id: The ID of the entity to deep clone.

*/

// Entity Test

function entityUnitTest(ent) {
    let error;
    if (typeof ent !== 'object') {
        console.error('should return an object');
        error = true;
    }
    if (ent.id === undefined) {
        console.error('id property is missing');
        error = true;
    }
    if (ent.name === undefined) {
        console.error('name property is missing');
        error = true;
    }
    if (ent.description === undefined) {
        console.error('description property is missing');
        error = true;
    }
    if (typeof ent.id !== 'number') {
        console.error('id should be a number');
        error = true;
    }
    if (typeof ent.name !== 'string') {
        console.error('name should be a string');
        error = true;
    }
    if (typeof ent.description !== 'string') {
        console.error('description should be a string');
        error = true;
    }
    if (!error) console.log('Entity unit test passed');
};

// deepClone Tests

function deepCloneUnitTest(obj) {
    let error;
    if (typeof obj !== 'object') {
        console.error('should return an object');
        error = true;
    }
    if (obj.entities === undefined) {
        console.error('entities property is missing');
        error = true;
    }
    if (obj.links === undefined) {
        console.error('links property is missing');
        error = true;
    }
    if (!Array.isArray(obj.entities)) {
        console.error('entities should be an array');
        error = true;
    }
    if (!Array.isArray(obj.links)) {
        console.error('links should be an array');
        error = true;
    }
    if (!error) console.log('deepClone unit test passed');
}

function deepCloneTest(obj, answer, testName) {
    let error;
    let str1 = JSON.stringify(obj.entities);
    let ans1 = JSON.stringify(answer.entities);
    if (str1 !== ans1) {
        console.error(`expected entities do not match, expected ${ans1} but received ${str1}`);
        error = true;
    }
    let str2 = JSON.stringify(obj.links);
    let ans2 = JSON.stringify(answer.links);
    if (str2 !== ans2) {
        console.error(`expected links do not match, expected ${ans2} but received ${str2}`);
        error = true;
    }
    if (!error) console.log(`deepClone ${testName} test passed`);
}


/* ================================================================== Start testing ===================================================================*/

let testEnt = new Entity(3, 'name', 'text');

entityUnitTest(testEnt);

// Sample test

let sampleEntities = [
    new Entity(1, 'name of 1', 'description of 1'),
    new Entity(2, 'name of 2', 'description of 2'),
    new Entity(3, 'name of 3', 'description of 3'),
    new Entity(4, 'name of 4', 'description of 4'),
];

let sampleLinks = [
    [1, 2],
    [1, 3],
    [2, 3],
    [3, 4],
];

let sampleResult = deepClone(sampleEntities, sampleLinks, 2);

deepCloneUnitTest(sampleResult);

let sampleAnswer = {
    'entities': [
        {'id':1, 'name': 'name of 1', 'description': 'description of 1'},
        {'id':2, 'name': 'name of 2', 'description': 'description of 2'},
        {'id':3, 'name': 'name of 3', 'description': 'description of 3'},
        {'id':4, 'name': 'name of 4', 'description': 'description of 4'},
        {'id':5, 'name': 'name of 5', 'description': 'description of 5'},
        {'id':6, 'name': 'name of 6', 'description': 'description of 6'},
        {'id':7, 'name': 'name of 7', 'description': 'description of 7'},
    ],
    'links': [
        [1, 2],
        [1, 3],
        [2, 3],
        [3, 4],
        [1, 5], // parent link cloned
        [5, 6],
        [6, 7],
    ],
};

deepCloneTest(sampleResult, sampleAnswer, 'sample');

// Edge case: Cycle

let cycleEntities = [
    new Entity(1, 'name of 1', 'description of 1'),
    new Entity(2, 'name of 2', 'description of 2'),
    new Entity(3, 'name of 3', 'description of 3'),
    new Entity(4, 'name of 4', 'description of 4'),
];

let cycleLinks = [
    [1, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [4, 2],
];

let cycleResult = deepClone(cycleEntities, cycleLinks, 2);

let cycleAnswer = {
    'entities': [
        {'id':1, 'name': 'name of 1', 'description': 'description of 1'},
        {'id':2, 'name': 'name of 2', 'description': 'description of 2'},
        {'id':3, 'name': 'name of 3', 'description': 'description of 3'},
        {'id':4, 'name': 'name of 4', 'description': 'description of 4'},
        {'id':5, 'name': 'name of 5', 'description': 'description of 5'},
        {'id':6, 'name': 'name of 6', 'description': 'description of 6'},
        {'id':7, 'name': 'name of 7', 'description': 'description of 7'},
    ],
    'links': [
        [1, 2],
        [1, 3],
        [2, 3],
        [3, 4],
        [4, 2],
        [1, 5], // one
        [4, 5], // two parent links
        [5, 6],
        [6, 7],
        [7, 5], // cycle link cloned
    ],
};

deepCloneTest(cycleResult, cycleAnswer, 'cycle edge case');

// Edge case: No Links for the given node

let noLinksEntities = [
    new Entity(1, 'name of 1', 'description of 1'),
    new Entity(2, 'name of 2', 'description of 2'),
    new Entity(3, 'name of 3', 'description of 3'),
    new Entity(4, 'name of 4', 'description of 4'),
];

let noLinksLinks = [
    [1, 4],
    [1, 3],
    [3, 4],
];

let noLinksResult = deepClone(noLinksEntities, noLinksLinks, 2);

let noLinksAnswer = {
    'entities': [
        {'id':1, 'name': 'name of 1', 'description': 'description of 1'},
        {'id':2, 'name': 'name of 2', 'description': 'description of 2'},
        {'id':3, 'name': 'name of 3', 'description': 'description of 3'},
        {'id':4, 'name': 'name of 4', 'description': 'description of 4'},
        {'id':5, 'name': 'name of 5', 'description': 'description of 5'},  // should create a new node but no new links
    ],
    'links': [
        [1, 4],
        [1, 3],
        [3, 4],
    ],
};

deepCloneTest(noLinksResult, noLinksAnswer, 'no links edge case');

// Edge case: Given node is an end node

let endNodeEntities = [
    new Entity(1, 'name of 1', 'description of 1'),
    new Entity(2, 'name of 2', 'description of 2'),
    new Entity(3, 'name of 3', 'description of 3'),
    new Entity(4, 'name of 4', 'description of 4'),
];

let endNodeLinks = [
    [1, 2],
    [1, 4],
    [2, 3],
    [3, 4],
];

let endNodeResult = deepClone(endNodeEntities, endNodeLinks, 4);

let endNodeAnswer = {
    'entities': [
        {'id':1, 'name': 'name of 1', 'description': 'description of 1'},
        {'id':2, 'name': 'name of 2', 'description': 'description of 2'},
        {'id':3, 'name': 'name of 3', 'description': 'description of 3'},
        {'id':4, 'name': 'name of 4', 'description': 'description of 4'},
        {'id':5, 'name': 'name of 5', 'description': 'description of 5'},
    ],
    'links': [
        [1, 2],
        [1, 4],
        [2, 3],
        [3, 4],
        [1, 5],
        [3, 5],
    ],
};

deepCloneTest(endNodeResult, endNodeAnswer, 'end node edge case');