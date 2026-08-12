import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

export function backupDatabase(sourcePath, targetPath) {
  const source = new DatabaseSync(sourcePath)
  source.exec('PRAGMA wal_checkpoint(FULL)')
  source.close()
  mkdirSync(dirname(targetPath), { recursive: true })
  copyFileSync(sourcePath, targetPath)
  return verifyDatabase(targetPath)
}

export function verifyDatabase(path) {
  const database = new DatabaseSync(path, { readOnly: true })
  try {
    const propertyCount = database.prepare('SELECT COUNT(*) AS count FROM properties').get().count
    const listingCount = database.prepare('SELECT COUNT(*) AS count FROM listings').get().count
    const auditCount = database.prepare('SELECT COUNT(*) AS count FROM audit_events').get().count
    return { path, propertyCount, listingCount, auditCount }
  } finally {
    database.close()
  }
}
