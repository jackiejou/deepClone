class Entity {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

function deepClone(entities, links, copyId) {
    // create links hash table
    let linkObj = {};
    for (let link of links) {
        linkObj[link[0]] ? linkObj[link[0]].push(link[1]) : linkObj[link[0]] = [link[1]];
    }

    // find the next available id
    let newId = entities[0].id;
    for (let entity of entities) {
        if (entity.id > newId) newId = entity.id;
    }
    newId++;

    // create the new clone node and clone parent links
    entities.push(new Entity(newId, `name of ${newId}`, `description of ${newId}`));
    for (let link of links) {
        if (link[1] === copyId) links.push([link[0], newId]);
    }
    
    // BFS to create new nodes and mapping
    let queue = [copyId];
    let visited = [];
    visited[copyId] = newId;
    while (queue.length) {
        let curr = queue.shift();
        if (linkObj[curr]) {
            for (let link of linkObj[curr]) {
                if (!visited[link]) {
                    queue.push(link);
                    newId++;
                    visited[link] = newId;
                    entities.push(new Entity(newId, `name of ${newId}`, `description of ${newId}`));
                }
            }
        }
    }

    // create new links based on mapping
    let newLinks = [];
    links.forEach((link) => {
        if (visited[link[0]] && visited[link[1]]) newLinks.push([visited[link[0]], visited[link[1]]]);
    });
    links.push(...newLinks);

    return {
        entities,
        links
    };
};

module.exports = {
    Entity,
    deepClone,
}