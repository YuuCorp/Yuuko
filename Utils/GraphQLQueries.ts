import fs from 'node:fs'
import path from 'node:path'

const graphQLFolder = path.join(__dirname, '../GraphQL')

const queries = fs.readdirSync(graphQLFolder).filter(x => x.endsWith('.gql'))
for (const query of queries) {
  const queryStr = fs.readFileSync(path.join(graphQLFolder, query), 'utf8')
  module.exports[query.split('.')[0]] = queryStr
}
