const fs = require('fs'),
    path = require('path'),
    graphQLFolder = path.join(__dirname, "../GraphQL");

let queries = fs.readdirSync(graphQLFolder).filter(x => x.endsWith('.gql'));
for (let query of queries) {
    const queryStr = fs.readFileSync(path.join(graphQLFolder, query), 'utf8');
    module.exports[query.split('.')[0]] = queryStr;
}