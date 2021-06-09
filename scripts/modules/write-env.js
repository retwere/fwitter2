import env from '../config/env'
import { writeFileSync } from 'fs'
import { parseFileSync, stringifySync } from 'envfile'

const envPath = '.env'

export default function writeEnv(bootstrapKey) {
  let json = null
  try {
    console.log(`Trying to read ${envPath} ...`)
    json = parseFileSync(envPath)
  } catch (err) {
    console.log(`${envPath} not found. Using empty envfile ...`)
    json = {}
  }
  json.REACT_APP__BOOTSTRAP_FAUNADB_KEY = bootstrapKey
  json.REACT_APP__FAUNA_DB_DOMAIN = env.FAUNA_DB_DOMAIN
  writeFileSync(envPath, stringifySync(json))
}
