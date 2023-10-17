import dotenvFlow from 'dotenv-flow'
import { Client } from './Structures/Client'
dotenvFlow.config()

await import('./Checks/Run')

const client = new Client()

client.start()
