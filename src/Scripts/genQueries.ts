import fs from 'node:fs'
import path from 'node:path';

(async () => {
  const fileNames = fs.readdirSync('./GraphQL').filter(x => x.endsWith('.gql'))

  const out = {} as any

  fileNames.forEach((file) => {
    const queryStr = fs.readFileSync(`./GraphQL/${file}`, 'utf8')
    out[file.split('.')[0]!] = queryStr
  })

  await Bun.write('./GraphQL/types/queries.ts', `export default ${JSON.stringify(out, null, 2)} as const`)

  const fullPath = path.join(__dirname, '../GraphQL/types/queries.ts')

  console.log(`Finished generating queries. ${fullPath}`)
})()
