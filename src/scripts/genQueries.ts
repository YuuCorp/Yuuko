import fs from 'node:fs'
import { srcPath } from '#utils/paths'

(async () => {
  const fileNames = fs.readdirSync('./src/graphQL').filter(x => x.endsWith('.gql'))

  const out: Record<string, string> = {};

  fileNames.forEach((file) => {
    const queryStr = fs.readFileSync(`./src/graphQL/${file}`, 'utf8')
    out[file.split('.')[0]!] = queryStr
  })

  await Bun.write('./src/graphQL/types/queries.ts', `export default ${JSON.stringify(out, null, 2)} as const`)

  console.log(`Finished generating queries. ${srcPath('graphQL', 'types', 'queries.ts')}`)
})()
