import test from 'node:test'
import assert from 'node:assert/strict'
import { demoCases, getDemoCase } from '../src/demo/demoData.js'
import {
  ACTIONS,
  allowedActionsFor,
  createInitialState,
  deriveWorkItems,
  filterWorkItems,
  getCaseStatus,
  getNextWorkItem,
  journeyReducer,
  projectStateForRole,
  restoreDemoState,
  serializeDemoState,
} from '../src/demo/journey.js'

const DEVELOPER_CASE_ID = 'sun-grand-thuy-khue'
const LAND_CASE_ID = 'phu-thuong-landed-home'

function payloadFor(caseId, type) {
  const dossier = getDemoCase(caseId)
  assert.ok(dossier)

  switch (type) {
    case ACTIONS.REQUEST_SELLER_CONFIRMATION:
      return {
        propertyId: dossier.property.id,
        scope: 'Độc quyền',
        startsOn: '2026-08-11',
        expiresOn: '2026-11-11',
      }
    case ACTIONS.CONFIRM_REPRESENTATION:
      return { accepted: true }
    case ACTIONS.RECORD_BUYER:
      return {
        buyerRef: dossier.parties.buyer.reference,
        agreedPrice: dossier.listing.askingPrice.value - 200_000_000,
        expectedSigningOn: dossier.actionTimes.record_notary_signing.slice(0, 10),
      }
    case ACTIONS.VERIFY_READINESS:
      return {
        confirmed: true,
        bankConsent: caseId === DEVELOPER_CASE_ID,
        checklist: {
          identityReviewed: true,
          paymentPlanReviewed: true,
          documentsReviewed: true,
        },
      }
    case ACTIONS.SUBMIT_NOTARY_DOSSIER:
      return {
        submissionRef: `NOP-${dossier.notary.id}`,
        documentIds: [...dossier.notary.requiredDocumentIds],
      }
    case ACTIONS.REQUEST_SUPPLEMENT:
      return {
        reasonCode: dossier.notary.supplement?.reasonCode,
        documentType: dossier.notary.supplement?.documentType,
        dueOn: '2026-08-21',
      }
    case ACTIONS.PROVIDE_SUPPLEMENT:
      return {
        documentId: 'DOC-BOSUNG-HN-0044',
        documentType: dossier.notary.supplement?.documentType,
        fileName: 'xac-nhan-tinh-trang-hon-nhan.pdf',
      }
    case ACTIONS.RECORD_NOTARY_SIGNING:
      return {
        contractId: dossier.notary.contractId,
        signedAt: dossier.actionTimes.record_notary_signing,
      }
    case ACTIONS.APPROVE_LAND_REGISTRY:
      return {
        resultRef: dossier.transfer.resultRef,
        approvedAt: dossier.actionTimes.approve_land_registry,
      }
    case ACTIONS.DEVELOPER_INTAKE:
      return {
        intakeRef: dossier.transfer.intakeRef,
        receivedAt: dossier.actionTimes.developer_intake,
        documentCount: dossier.notary.requiredDocumentIds.length,
      }
    case ACTIONS.DEVELOPER_CONFIRM_TRANSFER:
      return {
        confirmationRef: 'XN-CDT-HN-00031',
        confirmedAt: dossier.actionTimes.developer_confirm_transfer,
      }
    case ACTIONS.BUYER_RECEIVE_CONTRACT:
      return {
        receiptRef: dossier.transfer.resultRef,
        receivedAt: dossier.actionTimes.buyer_receive_contract,
        acknowledged: true,
      }
    default:
      return {}
  }
}

function act(state, type, actor, payload = payloadFor(state.caseId, type)) {
  return journeyReducer(state, { type, actor, payload })
}

function advanceToListing(caseId = DEVELOPER_CASE_ID) {
  let state = createInitialState(caseId)
  state = act(state, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent')
  return act(state, ACTIONS.CONFIRM_REPRESENTATION, 'seller')
}

function advanceToReady(caseId = DEVELOPER_CASE_ID, bankConsent = caseId === DEVELOPER_CASE_ID) {
  let state = advanceToListing(caseId)
  state = act(state, ACTIONS.RECORD_BUYER, 'agent')
  return act(state, ACTIONS.VERIFY_READINESS, 'buyer', {
    ...payloadFor(caseId, ACTIONS.VERIFY_READINESS),
    bankConsent,
  })
}

function advanceToNotary(caseId = DEVELOPER_CASE_ID) {
  return act(advanceToReady(caseId), ACTIONS.SUBMIT_NOTARY_DOSSIER, 'notary')
}

function advanceToTransaction(caseId = DEVELOPER_CASE_ID) {
  let state = advanceToNotary(caseId)
  if (caseId === LAND_CASE_ID) {
    state = act(state, ACTIONS.REQUEST_SUPPLEMENT, 'notary')
    state = act(state, ACTIONS.PROVIDE_SUPPLEMENT, 'seller')
  }
  return act(state, ACTIONS.RECORD_NOTARY_SIGNING, 'notary')
}

test('a dossier starts as per-record operational state with no global stage or flags', () => {
  const state = createInitialState(DEVELOPER_CASE_ID)

  assert.equal(state.version, 3)
  assert.equal(state.caseId, DEVELOPER_CASE_ID)
  assert.equal('stage' in state, false)
  assert.equal('flags' in state, false)
  assert.deepEqual(Object.keys(state.records), [
    'property',
    'representation',
    'listing',
    'readiness',
    'notaryDossier',
    'transaction',
    'transfer',
  ])
  assert.equal(state.records.property.id, 'NPID-HN-09876')
  assert.equal(state.records.property.status, 'Đã định danh')
  assert.equal('candidates' in state.records.property, false)
  assert.equal(state.records.representation.status, 'Chưa gửi')
  assert.equal(state.records.representation.parties.seller.roleLabel, 'Người bán')
  assert.equal(state.records.representation.parties.representative.roleLabel, 'Người đại diện')
  assert.equal(state.records.listing, null)
  assert.equal(state.records.transaction, null)
  assert.equal(state.records.transfer.route, null)
  assert.deepEqual(state.auditEvents, [])
  assert.deepEqual(state.integrationEvents, [])
  assert.deepEqual(getCaseStatus(state), {
    code: 'representation_request_pending',
    label: 'Chờ gửi thông tin đến Người bán',
    tone: 'neutral',
  })
})

test('every command enforces actor, lifecycle order and a meaningful payload', () => {
  const developerSteps = [
    [ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent'],
    [ACTIONS.CONFIRM_REPRESENTATION, 'seller'],
    [ACTIONS.RECORD_BUYER, 'agent'],
    [ACTIONS.VERIFY_READINESS, 'buyer'],
    [ACTIONS.SUBMIT_NOTARY_DOSSIER, 'notary'],
    [ACTIONS.RECORD_NOTARY_SIGNING, 'notary'],
    [ACTIONS.DEVELOPER_INTAKE, 'developer'],
    [ACTIONS.DEVELOPER_CONFIRM_TRANSFER, 'developer'],
    [ACTIONS.BUYER_RECEIVE_CONTRACT, 'buyer'],
  ]

  let state = createInitialState(DEVELOPER_CASE_ID)
  for (const [type, actor] of developerSteps) {
    assert.deepEqual(allowedActionsFor(state, actor), [type])
    assert.strictEqual(act(state, type, actor, {}), state, `${type} must reject an empty payload`)
    assert.strictEqual(act(state, type, actor, {
      ...payloadFor(state.caseId, type),
      unexpected: true,
    }), state, `${type} must reject additional payload fields`)
    assert.strictEqual(act(state, type, 'vmls'), state, `${type} must reject the wrong actor`)
    const next = act(state, type, actor)
    assert.notStrictEqual(next, state, `${type} must accept its complete payload`)
    state = next
  }

  const completed = state
  assert.strictEqual(act(completed, 'unknown_action', 'agent', {}), completed)
  assert.deepEqual(allowedActionsFor(completed, 'vmls'), [])
})

test('the first command accepts only the existing NPID and sends the seller request directly', () => {
  const initial = createInitialState(DEVELOPER_CASE_ID)
  const correct = payloadFor(DEVELOPER_CASE_ID, ACTIONS.REQUEST_SELLER_CONFIRMATION)

  assert.strictEqual(act(initial, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent', {
    ...correct,
    propertyId: 'NPID-HN-09341',
  }), initial)
  assert.strictEqual(act(initial, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent', {
    ...correct,
    candidateId: 'NPID-HN-09876',
  }), initial)
  assert.strictEqual(act(initial, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent', {
    ...correct,
    sourceIds: ['SRC-HDMB-S2-12A'],
  }), initial)
  assert.doesNotMatch(serializeDemoState(initial), /candidateId|sourceIds/u)

  const requested = act(initial, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent', {
    ...correct,
    propertyId: '  npid-hn-09876  ',
  })
  assert.equal(requested.records.property.status, 'Đã định danh')
  assert.equal(requested.records.representation.status, 'Chờ xác nhận')
  assert.equal(requested.records.representation.request.propertyId, 'NPID-HN-09876')
  assert.deepEqual(requested.records.representation.confirmation, {
    id: 'XND-HN-00031',
    requestedAt: '2026-08-10T09:07:00+07:00',
    confirmedAt: null,
  })
  assert.equal(requested.integrationEvents[0].type, 'representation_request_sent')
})

test('seller confirmation automatically creates a separate PLID in Đã khởi tạo status', () => {
  const beforeConfirmation = act(
    createInitialState(DEVELOPER_CASE_ID),
    ACTIONS.REQUEST_SELLER_CONFIRMATION,
    'agent',
  )
  const confirmed = act(beforeConfirmation, ACTIONS.CONFIRM_REPRESENTATION, 'seller')

  assert.equal(confirmed.records.property.id, 'NPID-HN-09876')
  assert.equal(confirmed.records.representation.status, 'Đã xác nhận')
  assert.equal(confirmed.records.representation.confirmation.id, 'XND-HN-00031')
  assert.deepEqual(
    {
      id: confirmed.records.listing.id,
      status: confirmed.records.listing.status,
      propertyId: confirmed.records.listing.propertyId,
    },
    {
      id: 'PLID-HN-00125',
      status: 'Đã khởi tạo',
      propertyId: 'NPID-HN-09876',
    },
  )
  assert.equal(confirmed.records.transaction, null)
  assert.deepEqual(confirmed.records.listing.distributionConsent, {
    status: 'Chưa ghi nhận',
    grantedChannelIds: [],
  })
  assert.equal(confirmed.records.listing.channels[0].name, 'HouseNow')
  assert.equal(confirmed.records.listing.channels[0].status, 'Chưa phát hành')
  assert.ok(confirmed.integrationEvents.some(({ type }) => type === 'listing_created'))
  assert.equal('CREATE_LISTING' in ACTIONS, false)
  assert.strictEqual(act(confirmed, ACTIONS.CONFIRM_REPRESENTATION, 'seller'), confirmed)
})

test('representation dates and buyer readiness reject incomplete confirmations', () => {
  let state = createInitialState(DEVELOPER_CASE_ID)
  const invalidRepresentation = payloadFor(DEVELOPER_CASE_ID, ACTIONS.REQUEST_SELLER_CONFIRMATION)
  assert.strictEqual(act(state, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent', {
    ...invalidRepresentation,
    expiresOn: invalidRepresentation.startsOn,
  }), state)

  state = act(state, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent')
  assert.strictEqual(act(state, ACTIONS.CONFIRM_REPRESENTATION, 'seller', {
    accepted: false,
  }), state)

  assert.strictEqual(act(state, ACTIONS.CONFIRM_REPRESENTATION, 'seller', {
    accepted: true,
    confirmationRef: 'XND-GIA-MAO-KHONG-DUOC-GHI',
  }), state)
  assert.doesNotMatch(serializeDemoState(state), /confirmationRef/u)
  assert.equal(state.records.representation.confirmation.id, 'XND-HN-00031')
  state = act(state, ACTIONS.CONFIRM_REPRESENTATION, 'seller')
  assert.strictEqual(act(state, ACTIONS.RECORD_BUYER, 'agent', {
    ...payloadFor(DEVELOPER_CASE_ID, ACTIONS.RECORD_BUYER),
    buyerRef: 'NM-KHAC',
  }), state)

  state = act(state, ACTIONS.RECORD_BUYER, 'agent')
  assert.deepEqual(state.records.readiness.contractConfirmation, {
    agreement: {
      reference: 'TTCN-HDMB-HN-00031',
      type: 'Thỏa thuận chuyển nhượng HĐMB',
    },
    transactionType: 'Chuyển nhượng',
    property: {
      id: 'NPID-HN-09876',
      name: 'Căn hộ S2-12A',
      location: 'Thụy Khuê, Tây Hồ, Hà Nội',
    },
    buyer: {
      reference: 'NM-HN-0031',
      displayName: 'N••• V••• A•',
      identityRef: 'CCCD •••• 5076',
    },
    agreedPrice: 15_600_000_000,
    expectedSigningOn: '2026-08-22',
  })
  assert.strictEqual(act(state, ACTIONS.VERIFY_READINESS, 'buyer', {
    ...payloadFor(DEVELOPER_CASE_ID, ACTIONS.VERIFY_READINESS),
    checklist: {
      ...payloadFor(DEVELOPER_CASE_ID, ACTIONS.VERIFY_READINESS).checklist,
      unexpected: true,
    },
  }), state)
  assert.strictEqual(act(state, ACTIONS.VERIFY_READINESS, 'buyer', {
    confirmed: true,
    bankConsent: true,
    checklist: {
      identityReviewed: true,
      paymentPlanReviewed: false,
      documentsReviewed: true,
    },
  }), state)

  const ready = act(state, ACTIONS.VERIFY_READINESS, 'buyer')
  assert.equal(ready.records.readiness.status, 'Đã sẵn sàng công chứng')
})

test('VPCC accepts only a complete required-document set', () => {
  const ready = advanceToReady(DEVELOPER_CASE_ID)
  const payload = payloadFor(DEVELOPER_CASE_ID, ACTIONS.SUBMIT_NOTARY_DOSSIER)
  const incomplete = { ...payload, documentIds: payload.documentIds.slice(1) }

  assert.strictEqual(act(ready, ACTIONS.SUBMIT_NOTARY_DOSSIER, 'notary', incomplete), ready)
  const submitted = act(ready, ACTIONS.SUBMIT_NOTARY_DOSSIER, 'notary', payload)
  assert.equal(submitted.records.notaryDossier.status, 'Đã tiếp nhận')
  assert.ok(submitted.records.notaryDossier.documents.every(({ status }) => status === 'Đã nhận'))
})

test('the landed-home exception requires one supplement from the seller', () => {
  const submitted = advanceToNotary(LAND_CASE_ID)

  assert.deepEqual(allowedActionsFor(submitted, 'notary'), [ACTIONS.REQUEST_SUPPLEMENT])
  assert.deepEqual(allowedActionsFor(submitted, 'agent'), [])
  assert.strictEqual(act(submitted, ACTIONS.RECORD_NOTARY_SIGNING, 'notary'), submitted)

  const requested = act(submitted, ACTIONS.REQUEST_SUPPLEMENT, 'notary')
  assert.equal(requested.records.notaryDossier.status, 'Yêu cầu bổ sung')
  assert.equal(requested.records.notaryDossier.supplement.status, 'Chờ người bán')
  assert.deepEqual(allowedActionsFor(requested, 'seller'), [ACTIONS.PROVIDE_SUPPLEMENT])
  assert.deepEqual(allowedActionsFor(requested, 'agent'), [])
  assert.strictEqual(act(requested, ACTIONS.PROVIDE_SUPPLEMENT, 'agent'), requested)

  const provided = act(requested, ACTIONS.PROVIDE_SUPPLEMENT, 'seller')
  assert.equal(provided.records.notaryDossier.status, 'Đủ hồ sơ ký')
  assert.equal(provided.records.notaryDossier.supplement.status, 'Đã bổ sung')
  assert.deepEqual(allowedActionsFor(provided, 'notary'), [ACTIONS.RECORD_NOTARY_SIGNING])
  assert.strictEqual(act(provided, ACTIONS.REQUEST_SUPPLEMENT, 'notary'), provided)
})

test('a signed VPCC result atomically creates PTID, tax events and the correct route', () => {
  const developer = advanceToTransaction(DEVELOPER_CASE_ID)
  const land = advanceToTransaction(LAND_CASE_ID)

  assert.deepEqual(
    [developer.records.property.id, developer.records.listing.id, developer.records.transaction.id],
    ['NPID-HN-09876', 'PLID-HN-00125', 'PTID-HN-00031'],
  )
  assert.deepEqual(
    [land.records.property.id, land.records.listing.id, land.records.transaction.id],
    ['NPID-HN-10421', 'PLID-HN-00208', 'PTID-HN-00044'],
  )
  assert.equal(developer.records.transfer.route, 'developer')
  assert.equal(land.records.transfer.route, 'landRegistry')
  assert.equal(developer.records.notaryDossier.signedResult.contractId, 'HDCC-HN-260822-031')
  assert.equal(land.records.notaryDossier.signedResult.contractId, 'HDCC-HN-260826-044')
  assert.equal('documentDigest' in developer.records.notaryDossier.signedResult, false)

  for (const state of [developer, land]) {
    const types = state.integrationEvents.map(({ type }) => type)
    assert.ok(types.includes('notary_result_received'))
    assert.ok(types.includes('transaction_created'))
    assert.ok(types.includes('tax_obligation_recorded'))
    assert.ok(types.includes('tax_payment_status_recorded'))
    assert.ok(types.includes('route_determined'))
    assert.equal(
      state.integrationEvents.find(({ type }) => type === 'route_determined').route,
      state.records.transfer.route,
    )
    assert.equal('CREATE_TRANSACTION' in ACTIONS, false)

    const repeated = act(state, ACTIONS.RECORD_NOTARY_SIGNING, 'notary')
    assert.strictEqual(repeated, state)
  }
})

test('legacy VPCC and VPĐKĐĐ fields are rejected atomically and never persisted', () => {
  const notaryReady = advanceToNotary(DEVELOPER_CASE_ID)
  const signingWithDigest = {
    ...payloadFor(DEVELOPER_CASE_ID, ACTIONS.RECORD_NOTARY_SIGNING),
    documentDigest: 'a1b2c3d4e5f60718',
  }
  assert.strictEqual(
    act(notaryReady, ACTIONS.RECORD_NOTARY_SIGNING, 'notary', signingWithDigest),
    notaryReady,
  )
  assert.doesNotMatch(serializeDemoState(notaryReady), /documentDigest/u)

  const landRouted = advanceToTransaction(LAND_CASE_ID)
  const approvalWithOwner = {
    ...payloadFor(LAND_CASE_ID, ACTIONS.APPROVE_LAND_REGISTRY),
    newOwnerRef: getDemoCase(LAND_CASE_ID).parties.buyer.reference,
  }
  assert.strictEqual(
    act(landRouted, ACTIONS.APPROVE_LAND_REGISTRY, 'landRegistry', approvalWithOwner),
    landRouted,
  )
  assert.doesNotMatch(serializeDemoState(landRouted), /newOwnerRef/u)
})

test('each transfer route accepts only its receiving organization', () => {
  const land = advanceToTransaction(LAND_CASE_ID)
  assert.deepEqual(allowedActionsFor(land, 'landRegistry'), [ACTIONS.APPROVE_LAND_REGISTRY])
  assert.deepEqual(allowedActionsFor(land, 'developer'), [])
  assert.strictEqual(act(land, ACTIONS.APPROVE_LAND_REGISTRY, 'landRegistry', {
    ...payloadFor(LAND_CASE_ID, ACTIONS.APPROVE_LAND_REGISTRY),
    resultRef: '',
  }), land)

  const landComplete = act(land, ACTIONS.APPROVE_LAND_REGISTRY, 'landRegistry')
  assert.equal(landComplete.records.property.status, 'Đã sang tên')
  assert.equal(landComplete.records.transaction.status, 'Đã sang tên')
  assert.equal('newOwnerRef' in landComplete.records.transfer, false)
  assert.equal(getCaseStatus(landComplete).code, 'transfer_complete')

  let developer = advanceToTransaction(DEVELOPER_CASE_ID)
  assert.deepEqual(allowedActionsFor(developer, 'developer'), [ACTIONS.DEVELOPER_INTAKE])
  assert.deepEqual(allowedActionsFor(developer, 'landRegistry'), [])
  developer = act(developer, ACTIONS.DEVELOPER_INTAKE, 'developer')
  developer = act(developer, ACTIONS.DEVELOPER_CONFIRM_TRANSFER, 'developer')
  assert.deepEqual(allowedActionsFor(developer, 'buyer'), [ACTIONS.BUYER_RECEIVE_CONTRACT])
  developer = act(developer, ACTIONS.BUYER_RECEIVE_CONTRACT, 'buyer')
  assert.equal(developer.records.property.status, 'Đã cập nhật bên mua HĐMB')
  assert.equal(developer.records.transaction.status, 'Đã nhận HĐMB mới')
  assert.equal(getCaseStatus(developer).code, 'transfer_complete')
})

test('accepted commands append immutable audit, integration and command histories', () => {
  const initial = createInitialState(DEVELOPER_CASE_ID)
  const requested = act(initial, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent')

  assert.deepEqual(initial.auditEvents, [])
  assert.deepEqual(initial.actionLog, [])
  assert.equal(requested.auditEvents.length, 1)
  assert.equal(requested.actionLog.length, 1)
  assert.equal(requested.auditEvents[0].actorRoleId, 'agent')
  assert.equal(requested.auditEvents[0].targetId, 'REP-HN-00031')
  assert.equal(requested.integrationEvents[0].type, 'representation_request_sent')

  const transaction = advanceToTransaction(DEVELOPER_CASE_ID)
  assert.equal(new Set(transaction.auditEvents.map(({ id }) => id)).size, transaction.auditEvents.length)
  assert.equal(
    new Set(transaction.integrationEvents.map(({ id }) => id)).size,
    transaction.integrationEvents.length,
  )
  assert.ok(transaction.auditEvents.every(({ at }) => at.startsWith('2026-08-')))
  assert.ok(transaction.integrationEvents.every(({ at }) => at.startsWith('2026-08-')))
})

test('business dates and recorded timestamps cannot move a dossier backward in time', () => {
  let land = createInitialState(LAND_CASE_ID)
  const request = payloadFor(LAND_CASE_ID, ACTIONS.REQUEST_SELLER_CONFIRMATION)
  assert.strictEqual(act(land, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent', {
    ...request,
    startsOn: '2026-08-10',
  }), land)

  let developer = advanceToListing(DEVELOPER_CASE_ID)
  const buyer = payloadFor(DEVELOPER_CASE_ID, ACTIONS.RECORD_BUYER)
  assert.strictEqual(act(developer, ACTIONS.RECORD_BUYER, 'agent', {
    ...buyer,
    expectedSigningOn: '2026-08-13',
  }), developer)

  land = advanceToNotary(LAND_CASE_ID)
  const supplement = payloadFor(LAND_CASE_ID, ACTIONS.REQUEST_SUPPLEMENT)
  assert.strictEqual(act(land, ACTIONS.REQUEST_SUPPLEMENT, 'notary', {
    ...supplement,
    dueOn: '2026-08-19',
  }), land)
  assert.strictEqual(act(land, ACTIONS.REQUEST_SUPPLEMENT, 'notary', {
    ...supplement,
    dueOn: '2026-08-27',
  }), land)

  const submitted = advanceToNotary(DEVELOPER_CASE_ID)
  const signing = payloadFor(DEVELOPER_CASE_ID, ACTIONS.RECORD_NOTARY_SIGNING)
  assert.strictEqual(act(submitted, ACTIONS.RECORD_NOTARY_SIGNING, 'notary', {
    ...signing,
    signedAt: '2026-08-20T15:30:00+07:00',
  }), submitted)
  assert.strictEqual(act(submitted, ACTIONS.RECORD_NOTARY_SIGNING, 'notary', {
    ...signing,
    signedAt: '2026-08-28T09:00:00+07:00',
  }), submitted)

  const delayedSigningAt = '2026-08-23T08:00:00+07:00'
  const signed = act(submitted, ACTIONS.RECORD_NOTARY_SIGNING, 'notary', {
    ...signing,
    signedAt: delayedSigningAt,
  })
  assert.equal(signed.records.transaction.createdAt, delayedSigningAt)
  assert.equal(signed.auditEvents.at(-1).at, delayedSigningAt)
  assert.ok(Date.parse(signed.integrationEvents.at(-1).at) > Date.parse(delayedSigningAt))

  const intake = payloadFor(DEVELOPER_CASE_ID, ACTIONS.DEVELOPER_INTAKE)
  assert.strictEqual(act(signed, ACTIONS.DEVELOPER_INTAKE, 'developer', {
    ...intake,
    receivedAt: '2026-08-23T07:59:00+07:00',
  }), signed)
  const received = act(signed, ACTIONS.DEVELOPER_INTAKE, 'developer', intake)
  const confirmation = payloadFor(DEVELOPER_CASE_ID, ACTIONS.DEVELOPER_CONFIRM_TRANSFER)
  assert.strictEqual(act(received, ACTIONS.DEVELOPER_CONFIRM_TRANSFER, 'developer', {
    ...confirmation,
    confirmedAt: received.records.transfer.intakeAt,
  }), received)
  const confirmed = act(received, ACTIONS.DEVELOPER_CONFIRM_TRANSFER, 'developer', confirmation)
  const receipt = payloadFor(DEVELOPER_CASE_ID, ACTIONS.BUYER_RECEIVE_CONTRACT)
  assert.strictEqual(act(confirmed, ACTIONS.BUYER_RECEIVE_CONTRACT, 'buyer', {
    ...receipt,
    receivedAt: confirmed.records.transfer.confirmedAt,
  }), confirmed)

  const routedLand = advanceToTransaction(LAND_CASE_ID)
  const approval = payloadFor(LAND_CASE_ID, ACTIONS.APPROVE_LAND_REGISTRY)
  assert.strictEqual(act(routedLand, ACTIONS.APPROVE_LAND_REGISTRY, 'landRegistry', {
    ...approval,
    approvedAt: routedLand.records.transaction.createdAt,
  }), routedLand)
})

test('role projections enforce consent and minimize unrelated fields', () => {
  const developerInitial = createInitialState(DEVELOPER_CASE_ID)
  for (const roleId of ['agent', 'brokerage']) {
    const representation = projectStateForRole(developerInitial, roleId).records.representation
    assert.deepEqual(Object.keys(representation.parties), ['seller', 'representative'])
  }
  assert.equal(projectStateForRole(developerInitial, 'bank'), null)
  assert.equal(projectStateForRole(developerInitial, 'buyer'), null)
  assert.equal(projectStateForRole(developerInitial, 'notary'), null)

  const developer = advanceToReady(DEVELOPER_CASE_ID)
  const bank = projectStateForRole(developer, 'bank')
  assert.ok(bank)
  assert.deepEqual(Object.keys(bank.records), ['property', 'readiness'])
  assert.equal(bank.records.property.type, 'Căn hộ thuộc dự án')
  assert.equal(bank.records.readiness.agreedPrice, 15_600_000_000)
  assert.notEqual(
    bank.records.readiness.agreedPrice,
    getDemoCase(DEVELOPER_CASE_ID).listing.askingPrice.value,
  )
  assert.equal(bank.records.readiness.financeSharing.status, 'Đã đồng ý')
  assert.match(bank.shareId, /^CS-[A-Z0-9]+$/)
  assert.doesNotMatch(bank.shareId, /sun|grand|thuy|khue|phu|thuong/i)
  assert.equal('caseId' in bank, false)
  assert.equal('title' in bank, false)
  assert.equal('customerLabel' in bank, false)
  assert.equal('dossierId' in bank, false)
  assert.equal('status' in bank, false)
  assert.equal('nextWorkItem' in bank, false)
  assert.equal('parties' in bank, false)
  assert.equal('auditEvents' in bank, false)
  assert.equal('integrationEvents' in bank, false)

  const land = advanceToReady(LAND_CASE_ID)
  assert.equal(projectStateForRole(land, 'bank'), null)

  const brokerage = projectStateForRole(developer, 'brokerage')
  assert.ok(brokerage)
  assert.deepEqual(Object.keys(brokerage.parties), ['seller', 'agent'])
  assert.equal(brokerage.parties.seller.masked, true)
  assert.equal(brokerage.parties.agent.masked, true)
  assert.equal('buyer' in brokerage.parties, false)
  assert.equal('buyer' in brokerage.records.readiness, false)

  const waitingForSeller = act(
    createInitialState(DEVELOPER_CASE_ID),
    ACTIONS.REQUEST_SELLER_CONFIRMATION,
    'agent',
  )
  const seller = projectStateForRole(waitingForSeller, 'seller')
  assert.deepEqual(Object.keys(seller.parties), ['seller', 'agent'])
  assert.deepEqual(Object.keys(seller.records.representation.parties), ['seller', 'representative'])
  assert.deepEqual(seller.auditEvents.map(({ action }) => action), [ACTIONS.REQUEST_SELLER_CONFIRMATION])
  assert.ok(seller.auditEvents.every((event) => !('targetId' in event) && !('correlationId' in event)))

  const readySeller = projectStateForRole(developer, 'seller')
  assert.deepEqual(readySeller.auditEvents.map(({ action }) => action), [
    ACTIONS.REQUEST_SELLER_CONFIRMATION,
    ACTIONS.CONFIRM_REPRESENTATION,
    ACTIONS.VERIFY_READINESS,
  ])
  assert.ok(readySeller.auditEvents.every((event) => !('targetId' in event) && !('correlationId' in event)))

  const buyer = projectStateForRole(developer, 'buyer')
  assert.equal('customerLabel' in buyer, false)
  assert.doesNotMatch(JSON.stringify(buyer), new RegExp(developer.parties.seller.displayName, 'u'))
})

test('bank work items remain consent-scoped even while a notary supplement is open', () => {
  let state = advanceToReady(LAND_CASE_ID, true)
  state = act(state, ACTIONS.SUBMIT_NOTARY_DOSSIER, 'notary')
  state = act(state, ACTIONS.REQUEST_SUPPLEMENT, 'notary')

  const bank = projectStateForRole(state, 'bank')
  const queue = deriveWorkItems(state, 'bank')
  assert.ok(bank)
  assert.deepEqual(Object.keys(bank), ['shareId', 'roleId', 'allowedActions', 'records'])
  assert.deepEqual(Object.keys(bank.records.property), ['type'])
  assert.deepEqual(Object.keys(bank.records.readiness), ['status', 'agreedPrice', 'financeSharing'])
  assert.deepEqual(Object.keys(queue[0]), [
    'id',
    'shareId',
    'roleId',
    'propertyType',
    'agreedPrice',
    'status',
    'statusCode',
    'financePurpose',
    'visibleFields',
    'actionable',
  ])
  assert.equal(queue[0].status, 'Đã sẵn sàng công chứng')
  assert.equal(filterWorkItems(queue, { query: 'Nhà ở riêng lẻ' }).length, 1)
  assert.equal(filterWorkItems(queue, { query: 'NPID-HN-10421' }).length, 0)

  const exposed = JSON.stringify({ bank, queue })
  for (const forbidden of [
    'Nhà ở · Phú Thượng',
    'L••• T••• H•••',
    'NPID-HN-10421',
    'PLID-HN-00208',
    'PTID-HN-00044',
    'HSCC-HN-00044',
    'VPCC',
    'MISSING_MARITAL_STATUS',
    'Xác nhận tình trạng hôn nhân',
    'Yêu cầu bổ sung',
    'Cần bổ sung hồ sơ',
  ]) {
    assert.doesNotMatch(exposed, new RegExp(forbidden, 'u'))
  }

  const notary = projectStateForRole(state, 'notary')
  assert.deepEqual(Object.keys(notary.records.readiness), [
    'status',
    'buyer',
    'agreedPrice',
    'expectedSigningOn',
    'contractConfirmation',
    'checklist',
  ])
  assert.deepEqual(
    Object.keys(notary.records.representation.parties),
    ['seller', 'representative'],
  )
  assert.deepEqual(Object.keys(notary.parties), ['seller', 'agent', 'buyer'])
  assert.equal('financeSharing' in notary.records.readiness, false)
})

test('integration correlations follow REP, VPCC and PTID object boundaries', () => {
  const listed = advanceToListing(LAND_CASE_ID)
  const representationEvents = listed.integrationEvents.filter(({ type }) => [
    'representation_confirmation_received',
    'listing_created',
  ].includes(type))
  assert.ok(representationEvents.length > 0)
  assert.ok(representationEvents.every(({ correlationId }) => correlationId === 'REP-HN-00044'))

  const submitted = advanceToNotary(LAND_CASE_ID)
  assert.equal(
    submitted.integrationEvents.find(({ type }) => type === 'notary_dossier_received').correlationId,
    'VPCC-HN-260818-044',
  )

  const transaction = advanceToTransaction(LAND_CASE_ID)
  assert.equal(
    transaction.integrationEvents.find(({ type }) => type === 'notary_result_received').correlationId,
    'VPCC-HN-260818-044',
  )
  for (const type of ['tax_obligation_recorded', 'tax_payment_status_recorded', 'route_determined']) {
    assert.equal(
      transaction.integrationEvents.find((event) => event.type === type).correlationId,
      'PTID-HN-00044',
    )
  }
})

test('derived queues use real visibility, owners, statuses and filters', () => {
  const initialStates = demoCases.map(({ id }) => createInitialState(id))
  const agentQueue = deriveWorkItems(initialStates, 'agent')
  const brokerageQueue = deriveWorkItems(initialStates, 'brokerage')

  assert.equal(agentQueue.length, 2)
  assert.ok(agentQueue.every(({ actionable }) => actionable))
  assert.ok(agentQueue.every(({ nextAction }) => nextAction === ACTIONS.REQUEST_SELLER_CONFIRMATION))
  assert.equal(brokerageQueue.length, 2)
  assert.ok(brokerageQueue.every(({ actionable }) => !actionable))
  assert.deepEqual(deriveWorkItems(initialStates, 'seller'), [])
  assert.deepEqual(deriveWorkItems(initialStates, 'bank'), [])

  const waitingForSeller = act(
    initialStates[0],
    ACTIONS.REQUEST_SELLER_CONFIRMATION,
    'agent',
  )
  const sellerQueue = deriveWorkItems([waitingForSeller, initialStates[1]], 'seller')
  assert.equal(sellerQueue.length, 1)
  assert.equal(sellerQueue[0].ownerRoleId, 'seller')
  assert.equal(sellerQueue[0].nextAction, ACTIONS.CONFIRM_REPRESENTATION)
  assert.equal(sellerQueue[0].statusCode, 'seller_confirmation_pending')

  assert.equal(filterWorkItems(agentQueue, { query: 'NPID-HN-10421' }).length, 1)
  assert.equal(filterWorkItems(agentQueue, { priority: 'Cao' }).length, 1)
  assert.equal(filterWorkItems(agentQueue, { status: 'representation_request_pending' }).length, 2)
  assert.equal(filterWorkItems(agentQueue, { actionable: false }).length, 0)
})

test('next work item is derived from record states and disappears on completion', () => {
  const initial = createInitialState(DEVELOPER_CASE_ID)
  assert.deepEqual(
    { roleId: getNextWorkItem(initial).roleId, action: getNextWorkItem(initial).action },
    { roleId: 'agent', action: ACTIONS.REQUEST_SELLER_CONFIRMATION },
  )

  let completed = advanceToTransaction(DEVELOPER_CASE_ID)
  completed = act(completed, ACTIONS.DEVELOPER_INTAKE, 'developer')
  completed = act(completed, ACTIONS.DEVELOPER_CONFIRM_TRANSFER, 'developer')
  completed = act(completed, ACTIONS.BUYER_RECEIVE_CONTRACT, 'buyer')
  assert.equal(getNextWorkItem(completed), null)
})

test('v3 persistence replays valid actions and rejects other cases or tampered commands', () => {
  const progressed = advanceToListing(DEVELOPER_CASE_ID)
  const serialized = serializeDemoState(progressed)
  const stored = JSON.parse(serialized)

  assert.deepEqual(Object.keys(stored), ['version', 'caseId', 'actions'])
  assert.equal(stored.version, 3)
  assert.equal(stored.caseId, DEVELOPER_CASE_ID)
  assert.doesNotMatch(serialized, /match_property|confirmationRef|documentDigest|newOwnerRef/u)
  assert.deepEqual(restoreDemoState(serialized), progressed)
  assert.deepEqual(restoreDemoState(serialized, DEVELOPER_CASE_ID), progressed)

  assert.deepEqual(
    restoreDemoState(serialized, LAND_CASE_ID),
    createInitialState(LAND_CASE_ID),
  )
  assert.deepEqual(
    restoreDemoState(JSON.stringify({ ...stored, version: 2 }), DEVELOPER_CASE_ID),
    createInitialState(DEVELOPER_CASE_ID),
  )
  assert.deepEqual(
    restoreDemoState(JSON.stringify({
      ...stored,
      actions: [
        {
          ...stored.actions[0],
          payload: { ...stored.actions[0].payload, propertyId: 'NPID-GIA-MAO' },
        },
      ],
    }), DEVELOPER_CASE_ID),
    createInitialState(DEVELOPER_CASE_ID),
  )

  const landCompleted = act(
    advanceToTransaction(LAND_CASE_ID),
    ACTIONS.APPROVE_LAND_REGISTRY,
    'landRegistry',
  )
  const injectedReplays = [
    {
      state: progressed,
      actionType: ACTIONS.REQUEST_SELLER_CONFIRMATION,
      field: 'candidateId',
      value: 'NPID-HN-09876',
    },
    {
      state: progressed,
      actionType: ACTIONS.REQUEST_SELLER_CONFIRMATION,
      field: 'sourceIds',
      value: ['SRC-HDMB-S2-12A'],
    },
    {
      state: progressed,
      actionType: ACTIONS.CONFIRM_REPRESENTATION,
      field: 'confirmationRef',
      value: 'XND-GIA-MAO',
    },
    {
      state: advanceToTransaction(DEVELOPER_CASE_ID),
      actionType: ACTIONS.RECORD_NOTARY_SIGNING,
      field: 'documentDigest',
      value: 'a1b2c3d4e5f60718',
    },
    {
      state: landCompleted,
      actionType: ACTIONS.APPROVE_LAND_REGISTRY,
      field: 'newOwnerRef',
      value: 'NM-HN-0044',
    },
  ]
  for (const injected of injectedReplays) {
    const envelope = JSON.parse(serializeDemoState(injected.state))
    const storedAction = envelope.actions.find(({ type }) => type === injected.actionType)
    assert.ok(storedAction)
    storedAction.payload[injected.field] = injected.value
    assert.deepEqual(
      restoreDemoState(JSON.stringify(envelope), injected.state.caseId),
      createInitialState(injected.state.caseId),
    )
  }
  assert.deepEqual(restoreDemoState('{not json', DEVELOPER_CASE_ID), createInitialState(DEVELOPER_CASE_ID))
})
