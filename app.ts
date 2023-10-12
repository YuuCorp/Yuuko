import { Client } from './Structures/Client'

require('dotenv-flow').config()
require('./Checks/Run.ts')

const client = new Client()

client.start()
