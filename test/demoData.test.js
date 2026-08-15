import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEMO_VERSION,
  STORAGE_KEY,
  demoCases,
  ecosystemConnections,
  externalRoles,
  getActionTime,
  getDemoCase,
  marketRoles,
  roles,
  sourceRegistry,
  workspaceDefinitions,
} from '../src/demo/demoData.js'

test('the operational fixture has a v2 storage contract and nine explicit roles', () => {
  assert.equal(DEMO_VERSION, 'vmls-operations-2026-08-v2')
  assert.equal(STORAGE_KEY, 'vmls:operations:2026-08:v2')
  assert.deepEqual(
    roles.map(({ id }) => id),
    ['agent', 'brokerage', 'seller', 'buyer', 'bank', 'developer', 'vmls', 'notary', 'landRegistry'],
  )
  assert.deepEqual(
    marketRoles.map(({ id }) => id),
    ['agent', 'brokerage', 'seller', 'buyer', 'bank', 'developer'],
  )
  assert.deepEqual(
    externalRoles.map(({ id }) => id),
    ['vmls', 'notary', 'landRegistry'],
  )
})

test('each role opens a work surface with operational navigation', () => {
  assert.equal(Object.keys(workspaceDefinitions).length, roles.length)
  for (const role of roles) {
    const workspaces = workspaceDefinitions[role.id]
    assert.ok(Array.isArray(workspaces) && workspaces.length > 0)
    assert.ok(workspaces.some(({ id }) => id === role.defaultWorkspace))
    assert.equal(new Set(workspaces.map(({ id }) => id)).size, workspaces.length)
  }
})

test('the two dossiers keep NPID, PLID and PTID as independent identities', () => {
  assert.equal(demoCases.length, 2)
  assert.deepEqual(demoCases.map(({ id }) => id), [
    'sun-grand-thuy-khue',
    'phu-thuong-landed-home',
  ])

  for (const dossier of demoCases) {
    assert.match(dossier.property.id, /^NPID-/)
    assert.match(dossier.listing.id, /^PLID-/)
    assert.match(dossier.transaction.id, /^PTID-/)
    assert.equal(new Set([
      dossier.property.id,
      dossier.listing.id,
      dossier.transaction.id,
    ]).size, 3)
    assert.equal(dossier.expectedRoute, dossier.transfer.route)
  }

  assert.equal(new Set(demoCases.map(({ property }) => property.id)).size, 2)
  assert.equal(new Set(demoCases.map(({ listing }) => listing.id)).size, 2)
  assert.equal(new Set(demoCases.map(({ transaction }) => transaction.id)).size, 2)
  assert.deepEqual(new Set(demoCases.map(({ expectedRoute }) => expectedRoute)), new Set([
    'developer',
    'landRegistry',
  ]))
})

test('Sun Grand City keeps the two sourced area concepts without merging them', () => {
  const dossier = getDemoCase('sun-grand-thuy-khue')
  assert.ok(dossier)
  assert.equal(dossier.property.project, 'Sun Grand City Thụy Khuê Residence')
  assert.equal(dossier.property.unit, 'S2-12A')

  const usable = dossier.property.areas.find(({ kind }) => kind === 'usable')
  const gross = dossier.property.areas.find(({ kind }) => kind === 'gross')
  assert.deepEqual(
    { label: usable.label, value: usable.value, unit: usable.unit },
    { label: 'Diện tích thông thủy', value: 69.2, unit: 'm²' },
  )
  assert.deepEqual(
    { label: gross.label, value: gross.value, unit: gross.unit },
    { label: 'Diện tích tim tường', value: 82.3, unit: 'm²' },
  )
  assert.equal(usable.sourceId, gross.sourceId)
  assert.ok(dossier.property.sourceRecords.some(({ id }) => id === usable.sourceId))
})

test('Phú Thượng uses the normalized land and total floor areas', () => {
  const dossier = getDemoCase('phu-thuong-landed-home')
  assert.ok(dossier)
  assert.deepEqual(
    dossier.property.areas.map(({ label, value, unit }) => ({ label, value, unit })),
    [
      { label: 'Diện tích đất', value: 72, unit: 'm²' },
      { label: 'Tổng diện tích sàn', value: 216, unit: 'm²' },
    ],
  )
})

test('each dossier has consistent candidates, sources, documents, parties and transfer references', () => {
  for (const dossier of demoCases) {
    assert.ok(dossier.property.candidates.length >= 2)
    assert.ok(dossier.property.candidates.some(({ id }) => id === dossier.property.id))

    const sourceIds = new Set(dossier.property.sourceRecords.map(({ id }) => id))
    assert.ok(dossier.property.areas.every(({ sourceId }) => sourceIds.has(sourceId)))

    const documentIds = dossier.notary.documents.map(({ id }) => id)
    assert.deepEqual(new Set(documentIds), new Set(dossier.notary.requiredDocumentIds))
    assert.equal(documentIds.length, new Set(documentIds).size)

    assert.ok(dossier.transfer.intakeRef)
    assert.ok(dossier.transfer.resultRef)
    for (const party of Object.values(dossier.parties)) {
      assert.equal(party.masked, true)
      assert.match(`${party.displayName} ${party.phone} ${party.identityRef}`, /[•]/)
    }
  }
})

test('each configured August chronology is strictly ordered and finishes before its SLA', () => {
  const paths = {
    developer: [
      'match_property',
      'request_seller_confirmation',
      'confirm_representation',
      'record_buyer',
      'verify_readiness',
      'submit_notary_dossier',
      'record_notary_signing',
      'developer_intake',
      'developer_confirm_transfer',
      'buyer_receive_contract',
    ],
    landRegistry: [
      'match_property',
      'request_seller_confirmation',
      'confirm_representation',
      'record_buyer',
      'verify_readiness',
      'submit_notary_dossier',
      'request_supplement',
      'provide_supplement',
      'record_notary_signing',
      'approve_land_registry',
    ],
  }

  for (const dossier of demoCases) {
    const timestamps = paths[dossier.expectedRoute].map((action) => dossier.actionTimes[action])
    assert.ok(timestamps.every((value) => /^2026-08-/.test(value)))
    for (let index = 1; index < timestamps.length; index += 1) {
      assert.ok(Date.parse(timestamps[index]) > Date.parse(timestamps[index - 1]))
    }
    assert.ok(Date.parse(dossier.slaDueAt) > Date.parse(timestamps.at(-1)))
    assert.match(dossier.slaDueAt, /^2026-08-/)
  }

  assert.equal(
    getActionTime('sun-grand-thuy-khue', 'record_notary_signing'),
    '2026-08-22T15:30:00+07:00',
  )
  assert.equal(
    getActionTime('phu-thuong-landed-home', 'record_notary_signing'),
    '2026-08-26T10:00:00+07:00',
  )
  assert.equal(getActionTime('unknown-case', 'record_notary_signing'), null)
})

test('representation, finance sharing and listing distribution are separate data concepts', () => {
  const developer = getDemoCase('sun-grand-thuy-khue')
  const land = getDemoCase('phu-thuong-landed-home')

  assert.ok(developer)
  assert.ok(land)
  assert.equal(developer.representation.id, 'REP-HN-00031')
  assert.equal(developer.listing.channel.name, 'HouseNow')
  assert.equal(developer.listing.channel.status, 'Chưa phát hành')
  assert.equal(developer.readiness.financeSharing.purpose, 'Trao đổi nhu cầu tài chính')
  assert.equal(land.readiness.financeSharing.purpose, 'Trao đổi nhu cầu tài chính')
  assert.match(developer.readiness.financeSharing.shareId, /^CS-[A-Z0-9]+$/)
  assert.match(land.readiness.financeSharing.shareId, /^CS-[A-Z0-9]+$/)
  assert.notEqual(developer.readiness.financeSharing.shareId, land.readiness.financeSharing.shareId)
  assert.equal('distributionConsent' in developer.representation, false)
  assert.equal('financeSharing' in developer.representation, false)
})

test('the 357 capture is registered as a source, not attached to either dossier', () => {
  assert.deepEqual(sourceRegistry.map(({ id }) => id), ['source-357'])
  assert.equal(sourceRegistry[0].connectionStatus, 'Chưa cấu hình')
  assert.equal(sourceRegistry[0].dataCategory, 'Thông tin nhà ở và thị trường bất động sản')
  assert.equal(sourceRegistry[0].capturedOn, '15/08/2026')
  assert.equal(sourceRegistry[0].screenshot, '/assets/demo/357-homepage-2026-08-15.png')

  const dossiers = JSON.stringify(demoCases)
  assert.doesNotMatch(dossiers, /thongtinbds\.moc\.gov\.vn|357-homepage/)
})

test('external touchpoints have explicit data contracts and local reference captures', () => {
  assert.deepEqual(
    ecosystemConnections.map(({ id }) => id),
    ['vneid', 'source-357', 'housenow'],
  )

  for (const connection of ecosystemConnections) {
    assert.match(connection.url, /^https:\/\//)
    assert.equal(connection.capturedOn, '15/08/2026')
    assert.match(connection.screenshot, /^\/assets\/demo\/.+\.png$/)
    assert.ok(connection.inputFields.length > 0)
    assert.ok(connection.outputFields.length > 0)
    assert.ok(['Chưa kết nối', 'Chưa cấu hình', 'Chưa phát hành'].includes(connection.status))
  }

  assert.equal(
    ecosystemConnections.find(({ id }) => id === 'source-357')?.url,
    'https://thongtinbds.moc.gov.vn/',
  )
  assert.equal(
    ecosystemConnections.find(({ id }) => id === 'housenow')?.url,
    'https://www.housenow.com.vn/can-ho-chung-cu',
  )
})

test('all public identities remain masked', () => {
  const serialized = JSON.stringify(demoCases)
  assert.doesNotMatch(serialized, /Trần Thị Minh Anh|Nguyễn Văn An|Nguyễn Hoàng Nam/)
  assert.doesNotMatch(serialized, /\b0\d{9}\b/)
  assert.doesNotMatch(serialized, /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)
})

test('visible operational copy excludes presentation and evidence-label vocabulary', () => {
  const technicalFields = new Set(['id', 'screenshot', 'icon', 'url', 'actionTimes'])
  const collectVisibleStrings = (value, field = '') => {
    if (technicalFields.has(field)) return []
    if (typeof value === 'string') return [value]
    if (Array.isArray(value)) return value.flatMap((item) => collectVisibleStrings(item, field))
    if (!value || typeof value !== 'object') return []
    return Object.entries(value).flatMap(([key, item]) => collectVisibleStrings(item, key))
  }
  const visibleCopy = collectVisibleStrings({
    roles,
    workspaces: workspaceDefinitions,
    sources: sourceRegistry,
    connections: ecosystemConnections,
    dossiers: demoCases,
  }).join(' ')

  for (const term of [
    'mô phỏng',
    'demo',
    'đề xuất',
    'giả lập',
    'minh họa',
    'FACT',
    'SOURCE CLAIM',
    'PROPOSAL',
    'OPEN QUESTION',
    'hành trình',
    'bản ghi sống',
    'pilot',
  ]) {
    assert.doesNotMatch(visibleCopy, new RegExp(term, 'iu'))
  }
})
