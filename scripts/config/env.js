// Environment variables
import dotenv from 'dotenv'
import defaults from './defaults'
// dotenv.config() must be called before any environment variables are accessed.
dotenv.config()

function missing(envVar) {
  console.error(`Missing required environment variable ${envVar}.`)
  process.exit(1)
}

const env = {
  // Whether this is running in CI or an interactive session.
  INTERACTIVE: process.env.CI !== 1,

  // The Fauna database domain to connect to. (E.g. 'db.fauna.com'.)
  FAUNA_DB_DOMAIN: process.env.FAUNA_DB_DOMAIN || defaults.FAUNA_DB_DOMAIN,

  // The 'root' admin key of this project's Fauna database.
  FAUNA_ADMIN_KEY: process.env.FAUNA_ADMIN_KEY || missing('FAUNA_ADMIN_KEY'),

  // Whether this is running on Vercel.
  VERCEL: process.env.VERCEL === 1,

  // Which vercel environment this is running in (one of 'production', 'preview',
  // or 'development').
  VERCEL_ENV: process.env.VERCEL_ENV,

  // URL of the Vercel deployment.
  VERCEL_URL: process.env.VERCEL_URL,

  // The git branch of the commit the deployment was triggered by.
  VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,

  // The git SHA of the commit the deployment was triggered by.
  VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA
}

export default env
