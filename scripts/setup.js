import env from './config/env'

import { setupDatabase } from '../src/fauna/setup/database'
import { populateSampleData } from '../src/fauna/setup/populate'
import { handleSetupError } from '../src/fauna/helpers/errors'

import writeEnv from './modules/write-env'

import { query, Client } from 'faunadb'
const q = query
const { CreateKey, Role, Exists, Database, CreateDatabase } = q

const main = async () => {
  const childDbName = (
    (env.VERCEL_ENV === 'production')
      ? 'PRODUCTION'
      : ((env.VERCEL_ENV === 'preview')
          ? `preview__${env.VERCEL_GIT_COMMIT_REF.replace(/[^\w-]+/g, "_")}`
          : `dev__${env.VERCEL_GIT_COMMIT_SHA}`))

  let client = new Client({
    secret: env.FAUNA_ADMIN_KEY,
    domain: env.FAUNA_DB_DOMAIN
  })

  console.log(`Checking if database '${childDbName}' already exists...`)
  const childDbExists = client.query(Exists(Database(childDbName)))
  console.log(childDbExists)
  if (childDbExists) {
    console.log(`Found existing database.` )
  } else {
    console.log(`Not found. Creating Fauna database '${childDbName}'...`)
    await handleSetupError(
      client.query(CreateDatabase({ name: childDbName })),
      'database - create child database')
  }

  console.log(`Creating temporary admin key for database '${childDbName}'...`)
  const key = await handleSetupError(
    client.query(CreateKey({ database: Database(childDbName), role: 'admin' })),
    'Admin key - child db'
  )
  client = new Client({
    secret: key.secret,
    domain: env.FAUNA_DB_DOMAIN
  })

  // This script will:
  // - Setup the user defined functions 'login and register'
  // - Create roles that the user defined functions will assume
  // - Create a role for the initial key which can only call login/register
  // - Create a role for an account to assume. (Database entities can assume
  //   roles; using the Login function, a key can be retrieved for such an
  //   entity).
  console.log(`Setting up database '${childDbName}'...`)
  await setupDatabase(client)

  // Populate with sample data, if we are creating a new database.
  if (!childDbExists) {
    console.log(`Populating '${childDbName}' with sample data...`)
    await populateSampleData(key.secret)
  }

  console.log('Creating bootstrap Fauna key.')
  const clientKey = await handleSetupError(
    client.query(CreateKey({ role: Role('keyrole_calludfs') })),
    'token - bootstrap'
  )

  // Write the new REACT_APP__ environment variables to .env.
  writeEnv(clientKey.secret)
}

main()