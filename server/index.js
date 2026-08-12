import { createMlsStore } from './database.js'
import { createHttpServer } from './http.js'

const port = Number(process.env.MLS_API_PORT ?? 5181)
const store = createMlsStore({ dbPath: process.env.MLS_DB_PATH ?? 'var/housenow-mls.sqlite' })
const server = createHttpServer({ store })

server.listen(port, '127.0.0.1', () => {
  console.log(`HouseNow MLS API listening on http://127.0.0.1:${port}`)
})

function shutdown() {
  server.close(() => {
    store.close()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
