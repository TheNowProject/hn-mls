import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createMlsStore } from '../server/database.js'
import { backupDatabase } from '../server/backup.js'

test('SQLite backup preserves seeded properties, listings and audit records', () => {
  const directory = mkdtempSync(join(tmpdir(), 'housenow-mls-'))
  const sourcePath = join(directory, 'source.sqlite')
  const targetPath = join(directory, 'backup.sqlite')
  const store = createMlsStore({ dbPath: sourcePath })
  store.close()

  const verified = backupDatabase(sourcePath, targetPath)
  assert.equal(verified.propertyCount, 26)
  assert.ok(verified.listingCount >= 40)
  assert.ok(verified.auditCount >= 53)
})
