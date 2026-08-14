import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEMO_STAGES,
  ROLE_PROJECTIONS,
  STAGES,
  demoCases,
  externalRoles,
  marketRoles,
} from '../src/demo/demoData.js'

const EVIDENCE_LABELS = new Set([
  'FACT',
  'SOURCE CLAIM',
  'INFERENCE',
  'PROPOSAL',
  'OPEN QUESTION',
])

test('demo exposes exactly the six primary market roles in Vietnamese', () => {
  assert.deepEqual(
    marketRoles.map(({ id, label }) => ({ id, label })),
    [
      { id: 'agent', label: 'Môi giới' },
      { id: 'brokerage', label: 'Sàn môi giới' },
      { id: 'developer', label: 'Chủ đầu tư' },
      { id: 'buyer', label: 'Người mua' },
      { id: 'seller', label: 'Người bán' },
      { id: 'bank', label: 'Ngân hàng' },
    ],
  )
})

test('VMLS and legal authority workspaces remain outside the six market roles', () => {
  assert.deepEqual(
    externalRoles.map(({ id, label }) => ({ id, label })),
    [
      { id: 'vmls', label: 'VMLS' },
      { id: 'notary', label: 'Văn phòng công chứng' },
      { id: 'land_registry', label: 'Văn phòng đăng ký đất đai' },
    ],
  )

  const marketIds = new Set(marketRoles.map(({ id }) => id))
  assert.equal(externalRoles.some(({ id }) => marketIds.has(id)), false)
})

test('stage vocabulary distinguishes the common path and both transfer outcomes', () => {
  assert.deepEqual(STAGES, {
    PROPERTY_MATCH: 'property_match',
    SELLER_CONFIRMATION: 'seller_confirmation',
    LISTING_CREATED: 'listing_created',
    TRANSACTION_READINESS: 'transaction_readiness',
    NOTARY_DOSSIER: 'notary_dossier',
    NOTARY_SIGNED: 'notary_signed',
    ROUTED: 'routed',
    LAND_REGISTRY_COMPLETE: 'land_registry_complete',
    DEVELOPER_INTAKE: 'developer_intake',
    DEVELOPER_CONFIRMED: 'developer_confirmed',
    CONTRACT_RECEIVED: 'contract_received',
  })
})

test('the two dossiers use independent Property, Listing and Transaction identities', () => {
  assert.equal(demoCases.length, 2)

  for (const demoCase of demoCases) {
    assert.match(demoCase.property.id, /^NPID-/)
    assert.match(demoCase.listing.id, /^PLID-/)
    assert.match(demoCase.transaction.id, /^PTID-/)
    assert.equal(new Set([
      demoCase.property.id,
      demoCase.listing.id,
      demoCase.transaction.id,
    ]).size, 3)
  }

  assert.equal(new Set(demoCases.map(({ property }) => property.id)).size, 2)
  assert.equal(new Set(demoCases.map(({ listing }) => listing.id)).size, 2)
  assert.equal(new Set(demoCases.map(({ transaction }) => transaction.id)).size, 2)
  assert.deepEqual(new Set(demoCases.map(({ route }) => route)), new Set(['developer', 'land_registry']))
})

test('Sun Grand City dossier preserves the supplied identities and both sourced area concepts', () => {
  const developerCase = demoCases.find(({ route }) => route === 'developer')

  assert.ok(developerCase)
  assert.equal(developerCase.project, 'Sun Grand City Thụy Khuê Residence')
  assert.equal(developerCase.unit, 'S2-12A')
  assert.equal(developerCase.property.id, 'NPID-HN-09876')
  assert.equal(developerCase.listing.id, 'PLID-HN-00125')
  assert.equal(developerCase.transaction.id, 'PTID-HN-00031')

  const usableArea = developerCase.property.areas.find(({ kind }) => kind === 'usable')
  const grossArea = developerCase.property.areas.find(({ kind }) => kind === 'gross')

  assert.deepEqual(
    { label: usableArea.label, value: usableArea.value, unit: usableArea.unit },
    { label: 'Diện tích thông thủy', value: 69.2, unit: 'm²' },
  )
  assert.match(usableArea.sourceLabel, /HĐMB|Hợp đồng mua bán/i)
  assert.equal(usableArea.evidence, 'SOURCE CLAIM')

  assert.deepEqual(
    { label: grossArea.label, value: grossArea.value, unit: grossArea.unit },
    { label: 'Diện tích tim tường', value: 82.3, unit: 'm²' },
  )
  assert.match(grossArea.sourceLabel, /chủ đầu tư|HĐMB|Hợp đồng mua bán/i)
  assert.equal(grossArea.evidence, 'SOURCE CLAIM')
})

test('public demo data masks contacts and never carries the supplied full identities', () => {
  const serialized = JSON.stringify(demoCases)

  assert.doesNotMatch(serialized, /Trần Thị Minh Anh|Nguyễn Văn An|Nguyễn Hoàng Nam/)
  assert.doesNotMatch(serialized, /\b0\d{9}\b/)
  assert.doesNotMatch(serialized, /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)

  for (const demoCase of demoCases) {
    for (const role of ['seller', 'buyer', 'agent']) {
      const party = demoCase.parties[role]
      assert.equal(party.contact.masked, true)
      assert.match(
        `${party.contact.phone} ${party.contact.email} ${party.contact.identityRef}`,
        /[•*]/,
      )
    }
  }
})

test('every claim carries an allowed evidence label without promoting proposals to facts', () => {
  const evidence = demoCases.flatMap((demoCase) => [
    ...demoCase.sourceRecords.map(({ evidence, label, source }) => ({
      label: evidence,
      claim: label,
      source,
    })),
    ...demoCase.property.areas.map(({ evidence, label, sourceLabel }) => ({
      label: evidence,
      claim: label,
      source: sourceLabel,
    })),
  ])

  assert.ok(evidence.length > 0)
  assert.equal(evidence.every(({ label }) => EVIDENCE_LABELS.has(label)), true)
  assert.equal(evidence.some(({ label }) => label === 'PROPOSAL'), true)
  assert.equal(evidence.some(({ label }) => label === 'SOURCE CLAIM'), true)

  for (const item of evidence) {
    assert.equal(typeof item.claim, 'string')
    assert.ok(item.claim.length > 0)
    assert.equal(typeof item.source, 'string')
    assert.ok(item.source.length > 0)
  }
})

test('configured stage actions belong to the same actor projection enforced by the reducer', () => {
  const configuredActions = DEMO_STAGES.flatMap(({ actions }) => actions)

  for (const action of configuredActions) {
    assert.equal(typeof action.actorId, 'string')
    assert.ok(
      ROLE_PROJECTIONS[action.actorId].allowedActions.includes(action.id),
      `${action.id} must belong to ${action.actorId}`,
    )
  }

  const actionIds = configuredActions.map(({ id }) => id)
  assert.equal(new Set(actionIds).size, actionIds.length)
})
