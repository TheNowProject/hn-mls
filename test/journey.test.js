import test from 'node:test'
import assert from 'node:assert/strict'
import { demoCases } from '../src/demo/demoData.js'
import {
  ACTIONS,
  allowedActionsFor,
  createInitialState,
  journeyReducer,
  projectStateForRole,
  restoreDemoState,
  serializeDemoState,
} from '../src/demo/journey.js'

const DEVELOPER_CASE_ID = demoCases.find(({ route }) => route === 'developer')?.id
const LAND_REGISTRY_CASE_ID = demoCases.find(({ route }) => route === 'land_registry')?.id

const act = (state, type, actor) => journeyReducer(state, { type, actor })

function advanceToSellerConfirmation(caseId = DEVELOPER_CASE_ID) {
  let state = createInitialState(caseId)
  state = act(state, ACTIONS.MATCH_PROPERTY, 'agent')
  return act(state, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent')
}

function advanceToListing(caseId = DEVELOPER_CASE_ID) {
  let state = advanceToSellerConfirmation(caseId)
  state = act(state, ACTIONS.CONFIRM_REPRESENTATION, 'seller')
  return act(state, ACTIONS.CREATE_LISTING, 'vmls')
}

function advanceToNotaryDossier(caseId = DEVELOPER_CASE_ID) {
  let state = advanceToListing(caseId)
  state = act(state, ACTIONS.RECORD_BUYER, 'agent')
  state = act(state, ACTIONS.VERIFY_READINESS, 'buyer')
  return act(state, ACTIONS.SUBMIT_NOTARY_DOSSIER, 'notary')
}

function advanceThroughCommonPath(caseId = DEVELOPER_CASE_ID) {
  let state = advanceToNotaryDossier(caseId)
  state = act(state, ACTIONS.RECORD_NOTARY_SIGNING, 'notary')
  return act(state, ACTIONS.CREATE_TRANSACTION, 'vmls')
}

test('a dossier starts with only its durable Property identity in the matching stage', () => {
  const state = createInitialState(DEVELOPER_CASE_ID)

  assert.equal(state.version, 1)
  assert.equal(state.caseId, DEVELOPER_CASE_ID)
  assert.equal(state.stage, 'property_match')
  assert.equal(state.records.property.id, 'NPID-HN-09876')
  assert.equal(state.records.listing, null)
  assert.equal(state.records.transaction, null)
  assert.equal(state.route, null)
  assert.deepEqual(state.auditEvents, [])
  assert.deepEqual(state.integrationEvents, [])
})

test('allowed actions expose the next action only to the responsible actor', () => {
  const initial = createInitialState(DEVELOPER_CASE_ID)
  assert.deepEqual(allowedActionsFor(initial, 'agent'), [ACTIONS.MATCH_PROPERTY])
  assert.deepEqual(allowedActionsFor(initial, 'seller'), [])
  assert.deepEqual(allowedActionsFor(initial, 'vmls'), [])

  const waitingForSeller = advanceToSellerConfirmation()
  assert.deepEqual(allowedActionsFor(waitingForSeller, 'seller'), [ACTIONS.CONFIRM_REPRESENTATION])
  assert.deepEqual(allowedActionsFor(waitingForSeller, 'agent'), [])

  const confirmed = act(waitingForSeller, ACTIONS.CONFIRM_REPRESENTATION, 'seller')
  assert.deepEqual(allowedActionsFor(confirmed, 'vmls'), [ACTIONS.CREATE_LISTING])
  assert.deepEqual(allowedActionsFor(confirmed, 'seller'), [])
})

test('the common journey keeps Property, Listing and Transaction as separate lifecycle records', () => {
  const listed = advanceToListing()

  assert.equal(listed.stage, 'listing_created')
  assert.equal(listed.records.property.id, 'NPID-HN-09876')
  assert.deepEqual(listed.records.listing, {
    id: 'PLID-HN-00125',
    status: 'Đã khởi tạo',
  })
  assert.equal(listed.records.transaction, null)

  const routed = advanceThroughCommonPath()
  assert.equal(routed.stage, 'routed')
  assert.equal(routed.records.property.id, 'NPID-HN-09876')
  assert.equal(routed.records.listing.id, 'PLID-HN-00125')
  assert.equal(routed.records.listing.status, 'Đã khởi tạo')
  assert.deepEqual(routed.records.transaction, {
    id: 'PTID-HN-00031',
    status: 'Đã ký công chứng',
  })
})

test('transaction readiness is gated by recording the buyer before buyer verification', () => {
  const listed = advanceToListing()

  assert.deepEqual(allowedActionsFor(listed, 'agent'), [ACTIONS.RECORD_BUYER])
  assert.deepEqual(allowedActionsFor(listed, 'buyer'), [])

  const buyerRecorded = act(listed, ACTIONS.RECORD_BUYER, 'agent')
  assert.equal(buyerRecorded.stage, 'transaction_readiness')
  assert.deepEqual(allowedActionsFor(buyerRecorded, 'buyer'), [ACTIONS.VERIFY_READINESS])
  assert.deepEqual(allowedActionsFor(buyerRecorded, 'notary'), [])

  const ready = act(buyerRecorded, ACTIONS.VERIFY_READINESS, 'buyer')
  assert.deepEqual(allowedActionsFor(ready, 'notary'), [ACTIONS.SUBMIT_NOTARY_DOSSIER])
})

test('VPCC can request and recover from one supplement without losing dossier history', () => {
  const submitted = advanceToNotaryDossier()
  const requested = act(submitted, ACTIONS.REQUEST_SUPPLEMENT, 'notary')

  assert.equal(requested.stage, 'notary_dossier')
  assert.equal(requested.supplement.status, 'required')
  assert.equal(requested.supplement.count, 1)
  assert.deepEqual(allowedActionsFor(requested, 'agent'), [ACTIONS.PROVIDE_SUPPLEMENT])
  assert.deepEqual(allowedActionsFor(requested, 'notary'), [])

  const provided = act(requested, ACTIONS.PROVIDE_SUPPLEMENT, 'agent')
  assert.equal(provided.supplement.status, 'provided')
  assert.equal(provided.supplement.count, 1)
  assert.deepEqual(allowedActionsFor(provided, 'notary'), [ACTIONS.RECORD_NOTARY_SIGNING])

  const secondRequest = act(provided, ACTIONS.REQUEST_SUPPLEMENT, 'notary')
  assert.strictEqual(secondRequest, provided)

  const signed = act(provided, ACTIONS.RECORD_NOTARY_SIGNING, 'notary')
  assert.equal(signed.stage, 'notary_signed')
  assert.equal(signed.supplement.status, 'resolved')
  assert.equal(signed.supplement.count, 1)
})

test('creating PTID appends simulated integrations and automatically selects each dossier route', () => {
  const developer = advanceThroughCommonPath(DEVELOPER_CASE_ID)
  const landRegistry = advanceThroughCommonPath(LAND_REGISTRY_CASE_ID)

  assert.equal(developer.route, 'developer')
  assert.equal(landRegistry.route, 'land_registry')

  for (const state of [developer, landRegistry]) {
    const types = state.integrationEvents.map(({ type }) => type)
    assert.ok(types.includes('notary_result_received'))
    assert.ok(types.includes('tax_obligation_exchange'))
    assert.ok(types.includes('tax_payment_confirmation'))
    assert.ok(types.includes('route_determined'))
    assert.equal(state.integrationEvents.find(({ type }) => type === 'route_determined').route, state.route)
  }
})

test('VPĐKĐĐ result completes only the land-registry route', () => {
  const routed = advanceThroughCommonPath(LAND_REGISTRY_CASE_ID)

  assert.deepEqual(allowedActionsFor(routed, 'land_registry'), [ACTIONS.APPROVE_LAND_REGISTRY])
  assert.deepEqual(allowedActionsFor(routed, 'developer'), [])

  const completed = act(routed, ACTIONS.APPROVE_LAND_REGISTRY, 'land_registry')
  assert.equal(completed.stage, 'land_registry_complete')
  assert.equal(completed.records.transaction.status, 'Đã sang tên')
  assert.equal(completed.integrationEvents.at(-1).type, 'land_registry_approved')
  assert.deepEqual(allowedActionsFor(completed, 'land_registry'), [])
})

test('developer route requires intake, transfer confirmation and buyer contract receipt', () => {
  const routed = advanceThroughCommonPath(DEVELOPER_CASE_ID)
  assert.deepEqual(allowedActionsFor(routed, 'developer'), [ACTIONS.DEVELOPER_INTAKE])

  const received = act(routed, ACTIONS.DEVELOPER_INTAKE, 'developer')
  assert.equal(received.stage, 'developer_intake')
  assert.deepEqual(allowedActionsFor(received, 'developer'), [ACTIONS.DEVELOPER_CONFIRM_TRANSFER])

  const confirmed = act(received, ACTIONS.DEVELOPER_CONFIRM_TRANSFER, 'developer')
  assert.equal(confirmed.stage, 'developer_confirmed')
  assert.equal(confirmed.records.transaction.status, 'Đã xác nhận chuyển nhượng')
  assert.deepEqual(allowedActionsFor(confirmed, 'buyer'), [ACTIONS.BUYER_RECEIVE_CONTRACT])

  const completed = act(confirmed, ACTIONS.BUYER_RECEIVE_CONTRACT, 'buyer')
  assert.equal(completed.stage, 'contract_received')
  assert.equal(completed.records.transaction.status, 'Đã nhận HĐMB mới')
  assert.equal(completed.integrationEvents.at(-1).type, 'new_contract_received')
  assert.deepEqual(allowedActionsFor(completed, 'buyer'), [])
})

test('accepted actions append audit and integration history without mutating prior states', () => {
  const initial = createInitialState(DEVELOPER_CASE_ID)
  const matched = act(initial, ACTIONS.MATCH_PROPERTY, 'agent')
  const requested = act(matched, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent')

  assert.deepEqual(initial.auditEvents, [])
  assert.equal(matched.auditEvents.length, 1)
  assert.equal(requested.auditEvents.length, 2)
  assert.deepEqual(requested.auditEvents.slice(0, 1), matched.auditEvents)
  assert.notStrictEqual(requested.auditEvents, matched.auditEvents)
  assert.deepEqual(requested.auditEvents.map(({ actor }) => actor), ['agent', 'agent'])
  assert.deepEqual(matched.auditEvents[0].before.flags.propertyMatched, false)
  assert.deepEqual(matched.auditEvents[0].after.flags.propertyMatched, true)
  assert.equal(matched.auditEvents[0].targetId, initial.records.property.id)
  assert.equal(matched.auditEvents[0].correlationId, initial.records.property.id)
  assert.equal(matched.auditEvents[0].evidence, 'SOURCE CLAIM')

  const beforeTransaction = act(advanceToNotaryDossier(), ACTIONS.RECORD_NOTARY_SIGNING, 'notary')
  const integrationPrefix = structuredClone(beforeTransaction.integrationEvents)
  const routed = act(beforeTransaction, ACTIONS.CREATE_TRANSACTION, 'vmls')

  assert.deepEqual(beforeTransaction.integrationEvents, integrationPrefix)
  assert.deepEqual(routed.integrationEvents.slice(0, integrationPrefix.length), integrationPrefix)
  assert.ok(routed.integrationEvents.length > integrationPrefix.length)
  assert.equal(
    new Set(routed.integrationEvents.map(({ id }) => id)).size,
    routed.integrationEvents.length,
  )
  assert.equal(routed.integrationEvents.every(({ disclaimer }) => typeof disclaimer === 'string'), true)
  assert.equal(routed.integrationEvents.every(({ evidence }) => typeof evidence === 'string'), true)
})

test('supplemental role projections expose only their configured minimum data', () => {
  const routed = advanceThroughCommonPath(DEVELOPER_CASE_ID)
  const brokerage = projectStateForRole(routed, 'brokerage')
  const bank = projectStateForRole(routed, 'bank')

  assert.equal(brokerage.records.property.id, routed.records.property.id)
  assert.equal(brokerage.records.transaction.id, undefined)
  assert.equal(brokerage.indicators.representation, 'Đã xác nhận')
  assert.equal('auditEvents' in brokerage, false)
  assert.equal('integrationEvents' in brokerage, false)

  assert.equal(bank.records.property.type, 'Căn hộ thuộc dự án')
  assert.equal(bank.records.listing.askingPrice, '15,8 tỷ đồng')
  assert.equal(bank.records.transaction, null)
  assert.equal('parties' in bank, false)

  const landSellerConfirmed = act(
    advanceToSellerConfirmation(LAND_REGISTRY_CASE_ID),
    ACTIONS.CONFIRM_REPRESENTATION,
    'seller',
  )
  const landBank = projectStateForRole(landSellerConfirmed, 'bank')
  assert.equal(landBank.indicators.consent, 'Chưa có đồng ý chia sẻ')
  assert.equal(landSellerConfirmed.integrationEvents[0].correlationId, `REP-${LAND_REGISTRY_CASE_ID}`)
})

test('event timestamps stay inside each dossier fixed August 2026 chronology', () => {
  const developerMatched = act(createInitialState(DEVELOPER_CASE_ID), ACTIONS.MATCH_PROPERTY, 'agent')
  const landMatched = act(createInitialState(LAND_REGISTRY_CASE_ID), ACTIONS.MATCH_PROPERTY, 'agent')
  const developerRouted = advanceThroughCommonPath(DEVELOPER_CASE_ID)
  const landRouted = advanceThroughCommonPath(LAND_REGISTRY_CASE_ID)

  assert.match(developerMatched.auditEvents[0].at, /^2026-08-10T/)
  assert.match(landMatched.auditEvents[0].at, /^2026-08-11T/)
  assert.equal(developerRouted.auditEvents.every(({ at }) => at.startsWith('2026-08-')), true)
  assert.equal(landRouted.integrationEvents.every(({ at }) => at.startsWith('2026-08-')), true)
})

test('wrong actor, invalid order, repeats and unknown actions leave state unchanged', () => {
  const initial = createInitialState(DEVELOPER_CASE_ID)

  assert.strictEqual(act(initial, ACTIONS.MATCH_PROPERTY, 'seller'), initial)
  assert.strictEqual(act(initial, ACTIONS.CREATE_LISTING, 'vmls'), initial)
  assert.strictEqual(act(initial, 'unknown_demo_action', 'agent'), initial)

  const matched = act(initial, ACTIONS.MATCH_PROPERTY, 'agent')
  assert.strictEqual(act(matched, ACTIONS.MATCH_PROPERTY, 'agent'), matched)
  assert.strictEqual(act(matched, ACTIONS.CONFIRM_REPRESENTATION, 'seller'), matched)
})

test('serialized browser state round-trips with version 1 and resets invalid payloads', () => {
  const progressed = advanceToListing()
  const serialized = serializeDemoState(progressed)

  assert.equal(typeof serialized, 'string')
  assert.equal(JSON.parse(serialized).version, 1)
  assert.deepEqual(restoreDemoState(serialized), progressed)

  assert.deepEqual(restoreDemoState('{not json'), createInitialState())
  assert.deepEqual(
    restoreDemoState(JSON.stringify({ ...progressed, version: 0 })),
    createInitialState(),
  )
  assert.deepEqual(
    restoreDemoState(JSON.stringify({
      ...progressed,
      records: { ...progressed.records, property: { id: 'NPID-GIA-MAO' } },
    })),
    createInitialState(),
  )
  assert.deepEqual(
    restoreDemoState(JSON.stringify({
      ...progressed,
      stage: 'routed',
      route: 'developer',
      records: { ...progressed.records, transaction: null },
    })),
    createInitialState(),
  )
  assert.deepEqual(
    restoreDemoState(serializeDemoState(progressed), LAND_REGISTRY_CASE_ID),
    createInitialState(LAND_REGISTRY_CASE_ID),
  )
  assert.deepEqual(restoreDemoState(null), createInitialState())
})
