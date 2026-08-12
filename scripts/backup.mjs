import { join } from 'node:path'
import { backupDatabase } from '../server/backup.js'

const sourcePath = process.env.MLS_DB_PATH ?? 'var/housenow-mls.sqlite'
const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
const targetPath = process.env.MLS_BACKUP_PATH ?? join('var', 'backups', `housenow-mls-${timestamp}.sqlite`)
const result = backupDatabase(sourcePath, targetPath)

console.log(`Backup verified: ${result.path}`)
console.log(`Properties: ${result.propertyCount}, Listings: ${result.listingCount}, Audit events: ${result.auditCount}`)
