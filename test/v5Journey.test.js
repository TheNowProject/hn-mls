import test from 'node:test'
import assert from 'node:assert/strict'
import {
  HOUSE_NOW_SNAPSHOT,
  PRIMARY_DECLARATION_PAYLOAD,
  PRIMARY_LISTING_ID,
  PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
  PUBLIC_LISTINGS,
  TRANSACTION_357_FIXTURE,
  V5_ROLES,
} from '../src/demo/v5Data.js'
import {
  V5_ACTIONS,
  allowedV5ActionsFor,
  createV5InitialState,
  getUnreadNotificationCount,
  getNextExternalMilestone,
  reconcileTransactionSources,
  restoreV5State,
  serializeV5State,
  v5Reducer,
} from '../src/demo/v5Journey.js'

function reduce(state, type, actor, payload) {
  return v5Reducer(state, { type, actor, payload })
}

function createListedState() {
  let state = reduce(
    createV5InitialState(),
    V5_ACTIONS.REQUEST_SELLER_CONFIRMATION,
    'agent',
    PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
  )
  state = reduce(state, V5_ACTIONS.CONFIRM_REPRESENTATION, 'seller', { accepted: true })
  return state
}

test('the V5 fixture starts before representation with unborn PLID and PTID', () => {
  const state = createV5InitialState()

  assert.deepEqual(V5_ROLES.map(({ id }) => id), [
    'agent',
    'brokerage',
    'seller',
    'buyer',
    'vmls',
  ])
  assert.equal(PUBLIC_LISTINGS.length, 5)
  assert.equal(PUBLIC_LISTINGS[0].id, PRIMARY_LISTING_ID)
  assert.equal(state.records.property.id, 'NPID-HN-10421')
  assert.equal(state.records.representation.id, 'REP-HN-00044')
  assert.equal(state.records.representation.status, 'Chưa gửi')
  assert.equal(state.records.listing, null)
  assert.equal('seller' in state.records.property, false)
  assert.equal(state.records.transaction.id, null)
  assert.equal(state.records.transaction.listingId, null)
  assert.equal(state.records.declaration, null)
  assert.equal(state.records.houseNowSnapshot, null)
  assert.equal(state.records.transactionSource357, null)
  assert.equal(state.records.taxCase, null)
  assert.equal(state.records.landRegistryCase, null)
  assert.deepEqual(state.externalEvents, [])
})

test('Agent request and Seller confirmation create the PLID seam before declaration', () => {
  const initial = createV5InitialState()

  const requested = reduce(
    initial,
    V5_ACTIONS.REQUEST_SELLER_CONFIRMATION,
    'agent',
    PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
  )
  assert.notStrictEqual(requested, initial)
  assert.equal(requested.records.representation.status, 'Chờ xác nhận')
  assert.deepEqual(requested.records.representation.request, {
    ...PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
    requestedAt: '2026-08-11T08:38:00+07:00',
  })
  assert.equal(requested.records.listing, null)
  assert.equal(requested.records.houseNowSnapshot, null)
  assert.equal(requested.records.transaction.id, null)
  assert.equal(requested.notifications[0].recipientRole, 'seller')
  assert.equal(requested.notifications[0].caseId, 'phu-thuong-title-transfer')
  assert.equal(requested.notifications[0].route, '#/vai-tro/seller/cong-viec')
  assert.equal('transactionId' in requested.notifications[0], false)
  assert.equal(requested.workItems[0].ownerRole, 'seller')
  assert.equal(requested.workItems[0].status, 'open')
  assert.deepEqual(requested.auditEvents.map(({ type }) => type), [
    'representation_confirmation_requested',
  ])
  assert.deepEqual(requested.integrationEvents.map(({ type }) => type), [
    'representation_request_sent',
  ])

  const confirmed = reduce(
    requested,
    V5_ACTIONS.CONFIRM_REPRESENTATION,
    'seller',
    { accepted: true },
  )
  assert.notStrictEqual(confirmed, requested)
  assert.equal(confirmed.records.representation.status, 'Đã xác nhận')
  assert.equal(confirmed.records.representation.confirmedAt, '2026-08-12T10:10:00+07:00')
  assert.equal(confirmed.records.listing.id, PRIMARY_LISTING_ID)
  assert.equal(confirmed.records.listing.status, 'Đã khởi tạo')
  assert.equal(confirmed.records.listing.propertyId, initial.records.property.id)
  assert.equal(confirmed.records.listing.representationId, 'REP-HN-00044')
  assert.equal(confirmed.records.houseNowSnapshot.externalListingId, HOUSE_NOW_SNAPSHOT.externalListingId)
  assert.equal(Object.isFrozen(confirmed.records.houseNowSnapshot), true)
  assert.equal(confirmed.records.transaction.id, null)
  assert.equal(confirmed.records.transaction.listingId, PRIMARY_LISTING_ID)
  assert.equal(confirmed.records.declaration, null)
  assert.equal(confirmed.records.taxCase, null)
  assert.equal(confirmed.workItems[0].status, 'resolved')
  assert.equal(confirmed.notifications[0].readAt, '2026-08-12T10:10:00+07:00')
  assert.equal(getUnreadNotificationCount(confirmed, 'seller'), 0)
  assert.deepEqual(confirmed.integrationEvents.map(({ type }) => type), [
    'representation_request_sent',
    'representation_confirmation_received',
    'listing_created',
  ])
})

test('representation commands are exact-shape, actor-scoped and one-shot', () => {
  const request = V5_ACTIONS.REQUEST_SELLER_CONFIRMATION
  const confirm = V5_ACTIONS.CONFIRM_REPRESENTATION
  const initial = createV5InitialState()
  const invalidRequests = [
    { ...PRIMARY_REPRESENTATION_REQUEST_PAYLOAD, propertyId: null },
    { ...PRIMARY_REPRESENTATION_REQUEST_PAYLOAD, propertyId: 'NPID-HN-99999' },
    { ...PRIMARY_REPRESENTATION_REQUEST_PAYLOAD, scope: 'Toàn quyền vĩnh viễn' },
    { ...PRIMARY_REPRESENTATION_REQUEST_PAYLOAD, startsOn: '2026-02-31' },
    { ...PRIMARY_REPRESENTATION_REQUEST_PAYLOAD, expiresOn: '2026-08-11' },
    { ...PRIMARY_REPRESENTATION_REQUEST_PAYLOAD, expiresOn: '2027-09-11' },
    { ...PRIMARY_REPRESENTATION_REQUEST_PAYLOAD, extra: true },
  ]

  assert.strictEqual(reduce(
    initial,
    request,
    'brokerage',
    PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
  ), initial)
  for (const payload of invalidRequests) {
    assert.doesNotThrow(() => reduce(initial, request, 'agent', payload))
    assert.strictEqual(reduce(initial, request, 'agent', payload), initial)
  }

  const requested = reduce(initial, request, 'agent', PRIMARY_REPRESENTATION_REQUEST_PAYLOAD)
  assert.strictEqual(reduce(requested, request, 'agent', PRIMARY_REPRESENTATION_REQUEST_PAYLOAD), requested)
  assert.strictEqual(reduce(requested, confirm, 'agent', { accepted: true }), requested)
  assert.strictEqual(reduce(requested, confirm, 'seller', { accepted: false }), requested)
  assert.strictEqual(reduce(requested, confirm, 'seller', { accepted: true, extra: true }), requested)
  assert.strictEqual(reduce(
    requested,
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  ), requested)

  const confirmed = reduce(requested, confirm, 'seller', { accepted: true })
  assert.strictEqual(reduce(confirmed, confirm, 'seller', { accepted: true }), confirmed)

  const expiredRequest = reduce(initial, request, 'agent', {
    ...PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
    expiresOn: '2026-08-12',
  })
  const expiredRepresentation = reduce(expiredRequest, confirm, 'seller', { accepted: true })
  assert.deepEqual(allowedV5ActionsFor(expiredRepresentation, 'agent'), [])
  assert.strictEqual(reduce(
    expiredRepresentation,
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  ), expiredRepresentation)

  const laterRequest = reduce(initial, request, 'agent', {
    ...PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
    startsOn: '2026-08-20',
  })
  const laterRepresentation = reduce(laterRequest, confirm, 'seller', { accepted: true })
  assert.deepEqual(allowedV5ActionsFor(laterRepresentation, 'agent'), [
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
  ])
  const laterDeclaration = reduce(
    laterRepresentation,
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    {
      ...PRIMARY_DECLARATION_PAYLOAD,
      contractDate: '2026-08-20',
      notarizedAt: '2026-08-20T15:30:00+07:00',
    },
  )
  assert.notStrictEqual(laterDeclaration, laterRepresentation)
})

test('the Agent declaration atomically creates PTID, audit and the Tax handoff', () => {
  const beforeRepresentation = createV5InitialState()
  const initial = createListedState()
  const submit = V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION

  assert.strictEqual(
    reduce(beforeRepresentation, submit, 'agent', PRIMARY_DECLARATION_PAYLOAD),
    beforeRepresentation,
  )
  assert.strictEqual(reduce(initial, submit, 'brokerage', PRIMARY_DECLARATION_PAYLOAD), initial)
  assert.strictEqual(reduce(initial, submit, 'agent', {
    ...PRIMARY_DECLARATION_PAYLOAD,
    listingId: 'PLID-HN-00209',
  }), initial)
  assert.strictEqual(reduce(initial, submit, 'agent', {
    ...PRIMARY_DECLARATION_PAYLOAD,
    documents: {},
  }), initial)
  assert.strictEqual(reduce(initial, submit, 'agent', {
    ...PRIMARY_DECLARATION_PAYLOAD,
    unexpected: true,
  }), initial)
  assert.strictEqual(reduce(initial, submit, 'agent', {
    ...PRIMARY_DECLARATION_PAYLOAD,
    contractDate: '2026-02-31',
  }), initial)
  assert.strictEqual(reduce(initial, submit, 'agent', {
    ...PRIMARY_DECLARATION_PAYLOAD,
    notarizedAt: '2026-02-31T15:30:00+07:00',
  }), initial)
  assert.strictEqual(reduce(initial, submit, 'agent', {
    ...PRIMARY_DECLARATION_PAYLOAD,
    contractDate: '2026-08-20',
    notarizedAt: '2026-08-19T15:30:00+07:00',
  }), initial)
  assert.strictEqual(reduce(initial, submit, 'agent', {
    ...PRIMARY_DECLARATION_PAYLOAD,
    contractDate: '2026-09-01',
    notarizedAt: '2026-09-01T15:30:00+07:00',
  }), initial)
  assert.strictEqual(reduce(initial, submit, 'agent', {
    ...PRIMARY_DECLARATION_PAYLOAD,
    documents: {
      transferContract: {
        ...PRIMARY_DECLARATION_PAYLOAD.documents.transferContract,
        mimeType: 'image/png',
      },
    },
  }), initial)
  for (const fileName of [
    '/Users/demo/secret-contract.pdf',
    'C:\\Users\\demo\\secret-contract.pdf',
    'file:///tmp/secret-contract.pdf',
  ]) {
    assert.strictEqual(reduce(initial, submit, 'agent', {
      ...PRIMARY_DECLARATION_PAYLOAD,
      documents: {
        transferContract: {
          ...PRIMARY_DECLARATION_PAYLOAD.documents.transferContract,
          fileName,
        },
      },
    }), initial)
  }
  assert.strictEqual(reduce(initial, submit, 'agent', {
    ...PRIMARY_DECLARATION_PAYLOAD,
    documents: {
      transferContract: {
        ...PRIMARY_DECLARATION_PAYLOAD.documents.transferContract,
        contents: 'data:application/pdf;base64,not-stored',
      },
    },
  }), initial)

  const submitted = reduce(initial, submit, 'agent', PRIMARY_DECLARATION_PAYLOAD)
  assert.notStrictEqual(submitted, initial)
  assert.equal(submitted.records.declaration.listingId, 'PLID-HN-00208')
  assert.equal(submitted.records.declaration.propertyId, 'NPID-HN-10421')
  assert.equal(submitted.records.declaration.sellerRef, 'PARTY-SELLER-HN-0312')
  assert.equal(submitted.records.declaration.buyerMasked, 'Nguyễn H••• M•••')
  assert.equal(submitted.records.transaction.id, 'PTID-HN-00062')
  assert.equal(submitted.records.transaction.status, 'Đã khai báo giao dịch')
  assert.deepEqual(submitted.records.taxCase, {
    id: 'TAX-CASE-PTID-HN-00062',
    transactionId: 'PTID-HN-00062',
    source: 'tax',
    sourceCaseId: null,
    status: 'Đã chuyển hồ sơ',
    handedOffAt: '2026-08-21T08:45:00+07:00',
    updatedAt: '2026-08-21T08:45:00+07:00',
  })
  assert.equal(submitted.records.landRegistryCase, null)
  assert.deepEqual(submitted.financialObligations.map(({ label, status }) => ({ label, status })), [
    { label: 'Thuế TNCN', status: 'Chờ thông báo' },
    { label: 'Lệ phí trước bạ', status: 'Chờ thông báo' },
  ])
  assert.deepEqual(submitted.auditEvents.map(({ type }) => type), [
    'representation_confirmation_requested',
    'representation_confirmed',
    'transaction_declaration_submitted',
  ])
  const declarationAudit = submitted.auditEvents.at(-1)
  assert.equal(declarationAudit.actorOrganization, 'HouseNow')
  assert.equal(declarationAudit.reason, 'Khai báo giao dịch đã công chứng')
  assert.equal(declarationAudit.correlationId, 'PTID-HN-00062')
  assert.equal(declarationAudit.before, null)
  assert.equal(declarationAudit.after.transactionStatus, 'Đã khai báo giao dịch')
  assert.deepEqual(submitted.integrationEvents.map(({ type }) => type), [
    'representation_request_sent',
    'representation_confirmation_received',
    'listing_created',
    'tax_dossier_handoff_created',
  ])
  assert.equal(submitted.integrationEvents.at(-1).correlationId, 'PTID-HN-00062')
  assert.equal(new Set(submitted.auditEvents.map(({ id }) => id)).size, submitted.auditEvents.length)
  assert.equal(
    new Set(submitted.integrationEvents.map(({ id }) => id)).size,
    submitted.integrationEvents.length,
  )
  assert.equal(submitted.actionLog.length, 3)
  assert.strictEqual(reduce(submitted, submit, 'agent', PRIMARY_DECLARATION_PAYLOAD), submitted)

  const withDeposit = reduce(initial, submit, 'agent', {
    ...PRIMARY_DECLARATION_PAYLOAD,
    documents: {
      ...PRIMARY_DECLARATION_PAYLOAD.documents,
      depositContract: {
        fileName: 'hop-dong-dat-coc.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 840_512,
      },
    },
  })
  assert.deepEqual(Object.keys(withDeposit.records.declaration.documents), [
    'transferContract',
    'depositContract',
  ])
})

test('VMLS syncs the 357 source once and preserves field-level reconciliation', () => {
  const sync = V5_ACTIONS.SYNC_TRANSACTION_FROM_357
  const initial = createListedState()
  const submitted = reduce(
    initial,
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  )

  assert.strictEqual(reduce(initial, sync, 'vmls', TRANSACTION_357_FIXTURE), initial)
  assert.strictEqual(reduce(submitted, sync, 'agent', TRANSACTION_357_FIXTURE), submitted)
  assert.strictEqual(reduce(submitted, sync, 'vmls', {
    ...TRANSACTION_357_FIXTURE,
    extraField: 'not allowed',
  }), submitted)
  assert.strictEqual(reduce(submitted, sync, 'vmls', {
    ...TRANSACTION_357_FIXTURE,
    sourceUpdatedAt: '2026-02-31T09:05:00+07:00',
  }), submitted)
  assert.strictEqual(reduce(submitted, sync, 'vmls', {
    ...TRANSACTION_357_FIXTURE,
    buyerMasked: undefined,
  }), submitted)
  const missingNpid = { ...TRANSACTION_357_FIXTURE }
  delete missingNpid.npid
  assert.strictEqual(reduce(submitted, sync, 'vmls', missingNpid), submitted)

  const synced = reduce(submitted, sync, 'vmls', TRANSACTION_357_FIXTURE)
  assert.notStrictEqual(synced, submitted)
  assert.equal(synced.records.transactionSource357.transactionCode, '357-GD-2026-000812')
  assert.equal(synced.records.transactionSource357.source, '357')
  assert.equal(synced.records.reconciliation.status, 'matched')
  assert.deepEqual(synced.records.reconciliation.summary, {
    matched: 6,
    mismatched: 0,
    missingInVmls: 0,
    missingIn357: 0,
  })
  assert.equal(
    synced.records.reconciliation.fields.every(({ status }) => status === 'matched'),
    true,
  )
  assert.deepEqual(synced.records.declaration, submitted.records.declaration)
  assert.strictEqual(reduce(synced, sync, 'vmls', TRANSACTION_357_FIXTURE), synced)
})

test('357 reconciliation distinguishes conflicts and both kinds of missing value', () => {
  const declaration = {
    propertyId: 'NPID-HN-10421',
    contractNumber: 'HDCN-2026-0819-PT',
    transactionValue: 18_400_000_000,
    buyerMasked: 'Nguyễn H••• M•••',
    sellerMasked: 'Trần V••• A•••',
    notaryOffice: null,
  }
  const source = {
    ...TRANSACTION_357_FIXTURE,
    transactionValue: 18_500_000_000,
    buyerMasked: undefined,
  }
  const result = reconcileTransactionSources(declaration, source)

  assert.equal(result.status, 'review_required')
  assert.equal(result.fields.find(({ field }) => field === 'transactionValue').status, 'mismatched')
  assert.equal(result.fields.find(({ field }) => field === 'buyerMasked').status, 'missing_in_357')
  assert.equal(result.fields.find(({ field }) => field === 'notaryOffice').status, 'missing_in_vmls')
  assert.deepEqual(result.summary, {
    matched: 3,
    mismatched: 1,
    missingInVmls: 1,
    missingIn357: 1,
  })
})

test('VMLS advances exactly one of the six external milestones per command', () => {
  const advance = V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING
  let state = createListedState()

  assert.equal(getNextExternalMilestone(state), null)
  state = reduce(
    state,
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  )
  assert.equal(getNextExternalMilestone(state).label, 'Thuế đã tiếp nhận hồ sơ')
  assert.strictEqual(reduce(state, advance, 'agent', {}), state)
  assert.strictEqual(reduce(state, advance, 'vmls', { source: 'tax' }), state)

  state = reduce(state, advance, 'vmls', {})
  assert.equal(state.externalEvents.length, 1)
  assert.equal(state.records.taxCase.status, 'Chờ thông báo nghĩa vụ tài chính')
  assert.equal(state.records.landRegistryCase, null)
  assert.equal(getNextExternalMilestone(state).label, 'Cần thực hiện nghĩa vụ tài chính')

  state = reduce(state, advance, 'vmls', {})
  assert.equal(state.externalEvents.length, 2)
  assert.equal(state.records.taxCase.status, 'Cần thực hiện nghĩa vụ tài chính')
  assert.deepEqual(state.financialObligations.map(({ status }) => status), [
    'Cần thực hiện',
    'Cần thực hiện',
  ])
  assert.deepEqual(state.notifications.map(({ recipientRole, readAt }) => ({ recipientRole, readAt })), [
    { recipientRole: 'seller', readAt: '2026-08-12T10:10:00+07:00' },
    { recipientRole: 'seller', readAt: null },
  ])
  assert.deepEqual(state.workItems.map(({ ownerRole, status }) => ({ ownerRole, status })), [
    { ownerRole: 'seller', status: 'resolved' },
    { ownerRole: 'seller', status: 'open' },
  ])
  assert.equal(state.records.landRegistryCase, null)

  state = reduce(state, advance, 'vmls', {})
  assert.equal(state.externalEvents.length, 3)
  assert.deepEqual(state.financialObligations.map(({ label, status }) => ({ label, status })), [
    { label: 'Thuế TNCN', status: 'Đã hoàn thành' },
    { label: 'Lệ phí trước bạ', status: 'Đã hoàn thành' },
  ])
  assert.equal(state.records.taxCase.status, 'Đã hoàn thành nghĩa vụ tài chính')
  assert.equal(state.records.landRegistryCase.status, 'Đã chuyển hồ sơ')
  assert.equal(state.workItems.find(({ id }) => id === 'WORK-SELLER-TAX-DUE').status, 'resolved')
  assert.equal(
    state.integrationEvents.some(({ type }) => type === 'land_registry_handoff_created'),
    true,
  )

  state = reduce(state, advance, 'vmls', {})
  assert.equal(state.externalEvents.length, 4)
  assert.equal(state.records.landRegistryCase.status, 'Đã tiếp nhận')

  state = reduce(state, advance, 'vmls', {})
  assert.equal(state.externalEvents.length, 5)
  assert.equal(state.records.landRegistryCase.status, 'Đang xử lý TTHC')

  state = reduce(state, advance, 'vmls', {})
  assert.equal(state.externalEvents.length, 6)
  assert.equal(state.records.landRegistryCase.status, 'Đã hoàn thành')
  assert.equal(state.records.transaction.status, 'Đã hoàn thành sang tên')
  assert.deepEqual(
    state.notifications.map(({ recipientRole }) => recipientRole),
    ['seller', 'seller', 'buyer'],
  )
  assert.deepEqual(state.workItems.map(({ ownerRole, status }) => ({ ownerRole, status })), [
    { ownerRole: 'seller', status: 'resolved' },
    { ownerRole: 'seller', status: 'resolved' },
    { ownerRole: 'buyer', status: 'open' },
  ])
  assert.equal(getNextExternalMilestone(state), null)
  assert.strictEqual(reduce(state, advance, 'vmls', {}), state)
})

test('357 is not a gate for external status progression', () => {
  let state = reduce(
    createListedState(),
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  )
  state = reduce(state, V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING, 'vmls', {})
  assert.equal(state.externalEvents.length, 1)
  assert.equal(state.records.transactionSource357, null)

  state = reduce(state, V5_ACTIONS.SYNC_TRANSACTION_FROM_357, 'vmls', TRANSACTION_357_FIXTURE)
  assert.equal(state.records.reconciliation.status, 'matched')
  assert.equal(state.externalEvents.length, 1)
})

test('mismatched and missing 357 fields remain warnings and never gate progression', () => {
  const variants = [
    { ...TRANSACTION_357_FIXTURE, transactionValue: 18_500_000_000 },
    Object.fromEntries(Object.entries(TRANSACTION_357_FIXTURE).filter(([key]) => key !== 'buyerMasked')),
  ]

  for (const payload of variants) {
    let state = reduce(
      createListedState(),
      V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
      'agent',
      PRIMARY_DECLARATION_PAYLOAD,
    )
    state = reduce(state, V5_ACTIONS.SYNC_TRANSACTION_FROM_357, 'vmls', payload)
    assert.equal(state.records.reconciliation.status, 'review_required')
    const advanced = reduce(state, V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING, 'vmls', {})
    assert.equal(advanced.externalEvents.length, 1)
  }
})

test('duplicate, skipped or stale event history makes external advancement an atomic no-op', () => {
  let state = reduce(
    createListedState(),
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  )
  state = reduce(state, V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING, 'vmls', {})
  const [accepted] = state.externalEvents
  const invalidHistories = [
    [accepted, accepted],
    [{ ...accepted, id: 'TAX-EVT-PT-002', sequence: 2 }],
    [{ ...accepted, sourceUpdatedAt: '2026-08-20T10:15:00+07:00' }],
  ]

  for (const externalEvents of invalidHistories) {
    const malformed = { ...state, externalEvents }
    assert.equal(getNextExternalMilestone(malformed), null)
    assert.strictEqual(reduce(
      malformed,
      V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING,
      'vmls',
      {},
    ), malformed)
  }
})

test('only the recipient account can mark its notification as read', () => {
  let state = reduce(
    createListedState(),
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  )
  state = reduce(state, V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING, 'vmls', {})
  state = reduce(state, V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING, 'vmls', {})
  const notificationId = 'NOTIF-SELLER-TAX-DUE'

  assert.equal(getUnreadNotificationCount(state, 'seller'), 1)
  assert.equal(getUnreadNotificationCount(state, 'buyer'), 0)
  assert.strictEqual(reduce(
    state,
    V5_ACTIONS.MARK_NOTIFICATION_READ,
    'buyer',
    { notificationId },
  ), state)
  assert.strictEqual(reduce(
    state,
    V5_ACTIONS.MARK_NOTIFICATION_READ,
    'seller',
    { notificationId, read: true },
  ), state)

  const read = reduce(
    state,
    V5_ACTIONS.MARK_NOTIFICATION_READ,
    'seller',
    { notificationId },
  )
  assert.notStrictEqual(read, state)
  assert.equal(
    read.notifications.find(({ id }) => id === notificationId).readAt,
    '2026-08-22T09:14:00+07:00',
  )
  assert.equal(getUnreadNotificationCount(read, 'seller'), 0)
  assert.equal(read.auditEvents.at(-1).actorOrganization, null)
  assert.equal(read.auditEvents.at(-1).actorContext, 'Tài khoản cá nhân')
  assert.strictEqual(reduce(
    read,
    V5_ACTIONS.MARK_NOTIFICATION_READ,
    'seller',
    { notificationId },
  ), read)

  let otherBuyerState = reduce(
    createListedState(),
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    { ...PRIMARY_DECLARATION_PAYLOAD, buyerRef: 'PARTY-BUYER-OTHER-9999' },
  )
  for (let index = 0; index < 6; index += 1) {
    otherBuyerState = reduce(
      otherBuyerState,
      V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING,
      'vmls',
      {},
    )
  }
  assert.equal(getUnreadNotificationCount(otherBuyerState, 'buyer'), 0)
  assert.strictEqual(reduce(
    otherBuyerState,
    V5_ACTIONS.MARK_NOTIFICATION_READ,
    'buyer',
    { notificationId: 'NOTIF-BUYER-LAND-COMPLETE' },
  ), otherBuyerState)
})

test('the action contract exposes commands only to the account that can use them', () => {
  let state = createV5InitialState()
  assert.deepEqual(allowedV5ActionsFor(state, 'agent'), [
    V5_ACTIONS.REQUEST_SELLER_CONFIRMATION,
  ])
  assert.deepEqual(allowedV5ActionsFor(state, 'seller'), [])
  assert.deepEqual(allowedV5ActionsFor(state, 'brokerage'), [])
  assert.deepEqual(allowedV5ActionsFor(state, 'vmls'), [])
  assert.deepEqual(allowedV5ActionsFor(state, 'developer'), [])

  state = reduce(
    state,
    V5_ACTIONS.REQUEST_SELLER_CONFIRMATION,
    'agent',
    PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
  )
  assert.deepEqual(allowedV5ActionsFor(state, 'agent'), [])
  assert.deepEqual(allowedV5ActionsFor(state, 'seller'), [
    V5_ACTIONS.CONFIRM_REPRESENTATION,
    V5_ACTIONS.MARK_NOTIFICATION_READ,
  ])
  state = reduce(state, V5_ACTIONS.CONFIRM_REPRESENTATION, 'seller', { accepted: true })
  assert.deepEqual(allowedV5ActionsFor(state, 'agent'), [
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
  ])
  assert.deepEqual(allowedV5ActionsFor(state, 'seller'), [])
  state = reduce(
    state,
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  )
  assert.deepEqual(allowedV5ActionsFor(state, 'agent'), [])
  assert.deepEqual(allowedV5ActionsFor(state, 'vmls'), [
    V5_ACTIONS.SYNC_TRANSACTION_FROM_357,
    V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING,
  ])
  state = reduce(state, V5_ACTIONS.SYNC_TRANSACTION_FROM_357, 'vmls', TRANSACTION_357_FIXTURE)
  assert.deepEqual(allowedV5ActionsFor(state, 'vmls'), [
    V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING,
  ])
})

test('every command is an atomic no-op for every unauthorized account', () => {
  const roleIds = [...V5_ROLES.map(({ id }) => id), 'unknown-role']
  const initial = createV5InitialState()

  for (const actor of roleIds.filter((roleId) => roleId !== 'agent')) {
    assert.strictEqual(reduce(
      initial,
      V5_ACTIONS.REQUEST_SELLER_CONFIRMATION,
      actor,
      PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
    ), initial)
  }

  const requested = reduce(
    initial,
    V5_ACTIONS.REQUEST_SELLER_CONFIRMATION,
    'agent',
    PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
  )
  for (const actor of roleIds.filter((roleId) => roleId !== 'seller')) {
    assert.strictEqual(reduce(
      requested,
      V5_ACTIONS.CONFIRM_REPRESENTATION,
      actor,
      { accepted: true },
    ), requested)
  }

  const listed = reduce(requested, V5_ACTIONS.CONFIRM_REPRESENTATION, 'seller', {
    accepted: true,
  })
  for (const actor of roleIds.filter((roleId) => roleId !== 'agent')) {
    assert.strictEqual(reduce(
      listed,
      V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
      actor,
      PRIMARY_DECLARATION_PAYLOAD,
    ), listed)
  }

  const submitted = reduce(
    listed,
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  )
  for (const actor of roleIds.filter((roleId) => roleId !== 'vmls')) {
    assert.strictEqual(reduce(
      submitted,
      V5_ACTIONS.SYNC_TRANSACTION_FROM_357,
      actor,
      TRANSACTION_357_FIXTURE,
    ), submitted)
    assert.strictEqual(reduce(
      submitted,
      V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING,
      actor,
      {},
    ), submitted)
  }

  let notified = reduce(submitted, V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING, 'vmls', {})
  notified = reduce(notified, V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING, 'vmls', {})
  for (const actor of roleIds.filter((roleId) => roleId !== 'seller')) {
    assert.strictEqual(reduce(
      notified,
      V5_ACTIONS.MARK_NOTIFICATION_READ,
      actor,
      { notificationId: 'NOTIF-SELLER-TAX-DUE' },
    ), notified)
  }
})

test('V5 persistence replays accepted commands and fails closed for old or invalid logs', () => {
  const requestOnly = reduce(
    createV5InitialState(),
    V5_ACTIONS.REQUEST_SELLER_CONFIRMATION,
    'agent',
    PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
  )
  assert.deepEqual(restoreV5State(serializeV5State(requestOnly)), requestOnly)
  const confirmedOnly = reduce(
    requestOnly,
    V5_ACTIONS.CONFIRM_REPRESENTATION,
    'seller',
    { accepted: true },
  )
  assert.deepEqual(restoreV5State(serializeV5State(confirmedOnly)), confirmedOnly)

  let state = reduce(
    confirmedOnly,
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  )
  state = reduce(state, V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING, 'vmls', {})
  state = reduce(state, V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING, 'vmls', {})
  state = reduce(state, V5_ACTIONS.MARK_NOTIFICATION_READ, 'seller', {
    notificationId: 'NOTIF-SELLER-TAX-DUE',
  })
  state = reduce(state, V5_ACTIONS.SYNC_TRANSACTION_FROM_357, 'vmls', TRANSACTION_357_FIXTURE)

  const serialized = serializeV5State(state)
  assert.deepEqual(restoreV5State(serialized), state)
  assert.deepEqual(restoreV5State('{not-json'), createV5InitialState())
  assert.deepEqual(restoreV5State(JSON.stringify({
    version: 4,
    schema: 'vmls-operations-v4',
    caseId: 'phu-thuong-title-transfer',
    actionLog: [],
  })), createV5InitialState())

  const envelope = JSON.parse(serialized)
  envelope.actionLog[0].actor = 'brokerage'
  assert.deepEqual(restoreV5State(JSON.stringify(envelope)), createV5InitialState())
  envelope.actionLog[0].actor = 'agent'
  envelope.unexpected = true
  assert.deepEqual(restoreV5State(JSON.stringify(envelope)), createV5InitialState())
})

test('a 357 record with omitted comparison fields survives an exact V5 round-trip', () => {
  let state = reduce(
    createListedState(),
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  )
  const sourceWithMissingField = { ...TRANSACTION_357_FIXTURE }
  delete sourceWithMissingField.buyerMasked
  state = reduce(
    state,
    V5_ACTIONS.SYNC_TRANSACTION_FROM_357,
    'vmls',
    sourceWithMissingField,
  )

  assert.equal(state.records.reconciliation.status, 'review_required')
  assert.deepEqual(restoreV5State(serializeV5State(state)), state)
})

test('a malformed V5 state fails closed to the fixture instead of partially progressing', () => {
  const malformed = {
    ...createV5InitialState(),
    notifications: null,
  }
  assert.deepEqual(v5Reducer(malformed, {
    type: V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    actor: 'agent',
    payload: PRIMARY_DECLARATION_PAYLOAD,
  }), createV5InitialState())

  const inconsistentListing = createListedState()
  inconsistentListing.records.listing.propertyId = 'NPID-KHONG-KHOP'
  assert.deepEqual(v5Reducer(inconsistentListing, {
    type: V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    actor: 'agent',
    payload: PRIMARY_DECLARATION_PAYLOAD,
  }), createV5InitialState())

  const inconsistentRepresentation = reduce(
    createV5InitialState(),
    V5_ACTIONS.REQUEST_SELLER_CONFIRMATION,
    'agent',
    PRIMARY_REPRESENTATION_REQUEST_PAYLOAD,
  )
  inconsistentRepresentation.records.representation.request = null
  assert.deepEqual(v5Reducer(inconsistentRepresentation, {
    type: V5_ACTIONS.CONFIRM_REPRESENTATION,
    actor: 'seller',
    payload: { accepted: true },
  }), createV5InitialState())
})
