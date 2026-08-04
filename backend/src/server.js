/**
 * Backend entry point.
 *
 * The Atlas connection string comes from the environment and is never committed.
 * See .env.example for the shape; .env is gitignored.
 */

import { MongoClient } from 'mongodb'
import { createApp } from './app.js'

const uri = process.env.MONGO_URI
const dbName = process.env.MONGO_DB ?? 'snapcamp'
const sessionSecret = process.env.SESSION_SECRET
const port = Number(process.env.PORT ?? 3000)

if (!uri) {
  console.error('MONGO_URI is not set. Copy .env.example to .env and fill it in.')
  process.exit(1)
}
if (!sessionSecret) {
  console.error('SESSION_SECRET is not set.')
  process.exit(1)
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 })
await client.connect()

const app = createApp({ db: client.db(dbName), sessionSecret, logger: true })
await app.listen({ port, host: '127.0.0.1' })

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await app.close()
    await client.close()
    process.exit(0)
  })
}
