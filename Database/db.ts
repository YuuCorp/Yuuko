import fs from 'node:fs'
import path from 'node:path'
import { Sequelize } from 'sequelize'

// If the database does not exist yet,
// we create it so it can accessed.
if (!fs.existsSync(path.join(__dirname, 'db.sqlite')))
  fs.writeFileSync(path.join(__dirname, 'db.sqlite'), '')

export const db = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'db.sqlite'),
  logging: false,
});
// console.log("Hello Sequelize!");

(async () => {
  try {
    console.log('Hello Sequelize!')
    await db.authenticate()
    console.log('[Sequelize] Database connection has been established successfully.')
    // User when altering
    // await db.sync({ alter: true });
    // User when creating
    await db.sync()
    console.log('[Sequelize] Database has been synced.')
  }
  catch (error) {
    console.error('[Sequelize] Unable to connect to the database')
    throw error
  }
})()
