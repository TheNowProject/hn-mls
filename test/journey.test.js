import test from 'node:test'
import assert from 'node:assert/strict'
import { demoCases, getDemoCase } from '../src/demo/demoData.js'
import {
  ACTIONS,
  allowedActionsFor,
  createInitialState,
  deriveExternalQueue,
  deriveWorkItems,
  filterWorkItems,
  getCaseStatus,
  getNextWorkItem,
  getProcessingProjection,
  journeyReducer,
  projectStateForRole,
  restoreDemoState,
  serializeDemoState,
} from '../src/demo/journey.js'

const DEVELOPER_CASE_ID = 'sun-grand-thuy-khue'
const LAND_CASE_ID = 'phu-thuong-landed-home'

function payloadFor(caseId, type, source = 'notary') {
  const dossier = getDemoCase(caseId)
  assert.ok(dossier)

  switch (type) {
    case ACTIONS.REQUEST_SELLER_CONFIRMATION:
      return {
        propertyId: dossier.property.id,
        scope: 'Độc quyền',
        startsOn: dossier.actionTimes.request_seller_confirmation.slice(0, 10),
        expiresOn: '2026-11-11',
      }
    case ACTIONS.CONFIRM_REPRESENTATION:
      return { accepted: true }
    case ACTIONS.DECLARE_BUYER:
      return {
        buyerRef: dossier.parties.buyer.reference,
        agreedPrice: dossier.listing.askingPrice.value - 200_000_000,
        expectedSigningOn: dossier.externalProcessing.notary.events
          .at(-1).effect.signedAt.slice(0, 10),
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
    case ACTIONS.HANDOFF_NOTARY_DOSSIER:
      return {
        submissionRef: `NOP-${dossier.notary.id}`,
        documentIds: [...dossier.notary.requiredDocumentIds],
      }
    case ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF:
      return {
        documentId: 'DOC-BOSUNG-HN-0044',
        documentType: dossier.notary.supplement?.documentType,
        fileName: 'xac-nhan-tinh-trang-hon-nhan.pdf',
      }
    case ACTIONS.RECEIVE_EXTERNAL_EVENT:
      return { caseId, source }
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

function accepted(state, type, actor, payload = payloadFor(state.caseId, type)) {
  const next = act(state, type, actor, payload)
  assert.notStrictEqual(next, state, `${type} should be accepted`)
  return next
}

function receive(state, source = 'notary') {
  return accepted(
    state,
    ACTIONS.RECEIVE_EXTERNAL_EVENT,
    'vmls',
    payloadFor(state.caseId, ACTIONS.RECEIVE_EXTERNAL_EVENT, source),
  )
}

function advanceToListing(caseId = DEVELOPER_CASE_ID) {
  let state = createInitialState(caseId)
  state = accepted(state, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent')
  return accepted(state, ACTIONS.CONFIRM_REPRESENTATION, 'seller')
}

function advanceToReady(caseId = DEVELOPER_CASE_ID, bankConsent = caseId === DEVELOPER_CASE_ID) {
  let state = advanceToListing(caseId)
  state = accepted(state, ACTIONS.DECLARE_BUYER, 'brokerage')
  return accepted(state, ACTIONS.VERIFY_READINESS, 'buyer', {
    ...payloadFor(caseId, ACTIONS.VERIFY_READINESS),
    bankConsent,
  })
}

function advanceToNotary(caseId = DEVELOPER_CASE_ID) {
  return accepted(advanceToReady(caseId), ACTIONS.HANDOFF_NOTARY_DOSSIER, 'brokerage')
}

function advanceToTransaction(caseId = DEVELOPER_CASE_ID) {
  let state = advanceToNotary(caseId)
  state = receive(state)
  if (caseId === LAND_CASE_ID) {
    state = receive(state)
    state = accepted(state, ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF, 'seller')
    state = receive(state)
  }
  return receive(state)
}

function completeTax(state) {
  state = receive(state, 'tax')
  return receive(state, 'tax')
}

function completeDeveloperCase() {
  let state = advanceToTransaction(DEVELOPER_CASE_ID)
  state = accepted(state, ACTIONS.DEVELOPER_INTAKE, 'developer')
  state = accepted(state, ACTIONS.DEVELOPER_CONFIRM_TRANSFER, 'developer')
  state = accepted(state, ACTIONS.BUYER_RECEIVE_CONTRACT, 'buyer')
  return completeTax(state)
}

function completeLandCase() {
  let state = advanceToTransaction(LAND_CASE_ID)
  state = receive(state, 'landRegistry')
  state = receive(state, 'landRegistry')
  return completeTax(state)
}

test('a v4 dossier starts from the canonical 357 NPID with separate lifecycle records', () => {
  const state = createInitialState(DEVELOPER_CASE_ID)

  assert.equal(state.version, 4)
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
    'externalProcessing',
  ])
  assert.equal(state.records.property.id, 'NPID-HN-09876')
  assert.equal(state.records.property.sourceRecord357.npid, state.records.property.id)
  assert.equal(state.records.property.status, 'Đã định danh')
  assert.equal(state.records.listing, null)
  assert.equal(state.records.transaction, null)
  assert.deepEqual(state.records.externalProcessing, {
    notary: null,
    tax: null,
    landRegistry: null,
  })
  assert.deepEqual(state.auditEvents, [])
  assert.deepEqual(state.externalEvents, [])
  assert.deepEqual(getCaseStatus(state), {
    code: 'representation_request_pending',
    label: 'Chờ gửi thông tin đến Người bán',
    tone: 'neutral',
  })
})

test('the public command contract removes direct authority actions', () => {
  assert.deepEqual(ACTIONS, {
    REQUEST_SELLER_CONFIRMATION: 'request_seller_confirmation',
    CONFIRM_REPRESENTATION: 'confirm_representation',
    DECLARE_BUYER: 'declare_buyer',
    VERIFY_READINESS: 'verify_readiness',
    HANDOFF_NOTARY_DOSSIER: 'handoff_notary_dossier',
    SUBMIT_SUPPLEMENT_HANDOFF: 'submit_supplement_handoff',
    RECEIVE_EXTERNAL_EVENT: 'receive_external_event',
    DEVELOPER_INTAKE: 'developer_intake',
    DEVELOPER_CONFIRM_TRANSFER: 'developer_confirm_transfer',
    BUYER_RECEIVE_CONTRACT: 'buyer_receive_contract',
  })

  const state = advanceToNotary(DEVELOPER_CASE_ID)
  for (const roleId of ['notary', 'landRegistry', 'tax']) {
    assert.deepEqual(allowedActionsFor(state, roleId), [])
  }
  for (const deprecated of [
    'record_buyer',
    'submit_notary_dossier',
    'request_supplement',
    'record_notary_signing',
    'approve_land_registry',
  ]) {
    assert.strictEqual(journeyReducer(state, { type: deprecated, actor: 'notary', payload: {} }), state)
  }
})

test('the Agent requests representation using only the existing NPID', () => {
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
  assert.strictEqual(act(initial, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'brokerage', correct), initial)

  const requested = accepted(initial, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent', {
    ...correct,
    propertyId: '  npid-hn-09876  ',
  })
  assert.equal(requested.records.representation.status, 'Chờ xác nhận')
  assert.equal(requested.records.representation.request.propertyId, 'NPID-HN-09876')
  assert.equal(requested.records.listing, null)
  assert.equal(requested.integrationEvents[0].type, 'representation_request_sent')
})

test('Seller confirmation creates a distinct PLID without activating the Listing', () => {
  const listed = advanceToListing(DEVELOPER_CASE_ID)
  assert.deepEqual(
    [listed.records.property.id, listed.records.listing.id, listed.records.transaction],
    ['NPID-HN-09876', 'PLID-HN-00125', null],
  )
  assert.equal(listed.records.representation.status, 'Đã xác nhận')
  assert.equal(listed.records.listing.status, 'Đã khởi tạo')
  assert.equal(listed.records.listing.distributionConsent.status, 'Chưa ghi nhận')
  assert.equal(listed.records.listing.channels[0].status, 'Chưa phát hành')
  assert.strictEqual(act(listed, ACTIONS.CONFIRM_REPRESENTATION, 'seller'), listed)
})

test('only the Brokerage declares the Buyer and the Buyer confirms readiness', () => {
  let state = advanceToListing(DEVELOPER_CASE_ID)
  const declaration = payloadFor(DEVELOPER_CASE_ID, ACTIONS.DECLARE_BUYER)

  assert.deepEqual(allowedActionsFor(state, 'agent'), [])
  assert.deepEqual(allowedActionsFor(state, 'brokerage'), [ACTIONS.DECLARE_BUYER])
  assert.strictEqual(act(state, ACTIONS.DECLARE_BUYER, 'agent', declaration), state)
  assert.strictEqual(act(state, ACTIONS.DECLARE_BUYER, 'brokerage', {
    ...declaration,
    buyerName: 'Không được nhập lặp',
  }), state)

  state = accepted(state, ACTIONS.DECLARE_BUYER, 'brokerage')
  assert.equal(state.records.readiness.buyer.reference, 'NM-HN-0031')
  assert.equal(state.records.readiness.buyer.displayName, 'N••• V••• A•')
  assert.deepEqual(state.records.readiness.contractConfirmation.property, {
    id: 'NPID-HN-09876',
    name: 'Căn hộ S2-12A',
    location: 'Thụy Khuê, Tây Hồ, Hà Nội',
  })
  assert.deepEqual(allowedActionsFor(state, 'buyer'), [ACTIONS.VERIFY_READINESS])

  const incomplete = payloadFor(DEVELOPER_CASE_ID, ACTIONS.VERIFY_READINESS)
  incomplete.checklist.documentsReviewed = false
  assert.strictEqual(act(state, ACTIONS.VERIFY_READINESS, 'buyer', incomplete), state)
  state = accepted(state, ACTIONS.VERIFY_READINESS, 'buyer')
  assert.equal(state.records.readiness.status, 'Đã sẵn sàng công chứng')
})

test('only the Brokerage hands off a complete notary dossier', () => {
  const ready = advanceToReady(DEVELOPER_CASE_ID)
  const payload = payloadFor(DEVELOPER_CASE_ID, ACTIONS.HANDOFF_NOTARY_DOSSIER)
  assert.strictEqual(act(ready, ACTIONS.HANDOFF_NOTARY_DOSSIER, 'notary', payload), ready)
  assert.strictEqual(act(ready, ACTIONS.HANDOFF_NOTARY_DOSSIER, 'brokerage', {
    ...payload,
    documentIds: payload.documentIds.slice(1),
  }), ready)

  const handedOff = accepted(ready, ACTIONS.HANDOFF_NOTARY_DOSSIER, 'brokerage')
  assert.equal(handedOff.records.notaryDossier.status, 'Đã chuyển VPCC')
  assert.equal(handedOff.records.externalProcessing.notary.sourceCaseId, 'HSCC-HN-00031')
  assert.equal(handedOff.records.externalProcessing.notary.status, 'Chờ tiếp nhận')
  assert.equal(handedOff.integrationEvents.at(-1).type, 'notary_dossier_handed_off')
  assert.deepEqual(allowedActionsFor(handedOff, 'notary'), [])
})

test('VMLS consumes the next configured external event and rejects wrong or exhausted sources', () => {
  let state = advanceToNotary(DEVELOPER_CASE_ID)
  const auditCount = state.auditEvents.length
  assert.deepEqual(allowedActionsFor(state, 'vmls'), [ACTIONS.RECEIVE_EXTERNAL_EVENT])
  assert.strictEqual(act(state, ACTIONS.RECEIVE_EXTERNAL_EVENT, 'notary'), state)
  assert.strictEqual(act(state, ACTIONS.RECEIVE_EXTERNAL_EVENT, 'vmls', {
    caseId: LAND_CASE_ID,
    source: 'notary',
  }), state)
  assert.strictEqual(act(state, ACTIONS.RECEIVE_EXTERNAL_EVENT, 'vmls', {
    caseId: DEVELOPER_CASE_ID,
    source: 'notary',
    eventId: 'VPCC-EVT-00031-02',
  }), state)

  state = receive(state)
  assert.equal(state.records.notaryDossier.status, 'Đang xử lý')
  assert.equal(state.externalEvents.length, 1)
  assert.equal(state.auditEvents.length, auditCount)
  state = receive(state)
  assert.equal(state.records.externalProcessing.notary.status, 'Đã xử lý')
  assert.strictEqual(act(state, ACTIONS.RECEIVE_EXTERNAL_EVENT, 'vmls', {
    caseId: DEVELOPER_CASE_ID,
    source: 'notary',
  }), state)
})

test('the Seller hands off a requested supplement while VPCC remains read-only', () => {
  let state = advanceToNotary(LAND_CASE_ID)
  state = receive(state)
  state = receive(state)
  assert.equal(state.records.notaryDossier.status, 'Yêu cầu bổ sung')
  assert.equal(state.records.notaryDossier.supplement.status, 'Chờ người bán')
  assert.deepEqual(allowedActionsFor(state, 'seller'), [ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF])
  assert.deepEqual(allowedActionsFor(state, 'notary'), [])
  assert.strictEqual(act(state, ACTIONS.RECEIVE_EXTERNAL_EVENT, 'vmls'), state)

  const wrongDocument = {
    ...payloadFor(LAND_CASE_ID, ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF),
    documentType: 'Tài liệu khác',
  }
  assert.strictEqual(act(state, ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF, 'seller', wrongDocument), state)
  state = accepted(state, ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF, 'seller')
  assert.equal(state.records.notaryDossier.supplement.status, 'Đã chuyển VPCC')
  state = receive(state)
  assert.equal(state.records.notaryDossier.supplement.status, 'Đã tiếp nhận')
  assert.equal(state.records.notaryDossier.status, 'Đang xử lý')
})

test('the final notary event atomically creates PTID, route and outbound source cases', () => {
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
  assert.equal(developer.records.externalProcessing.tax.sourceCaseId, 'HST-HN-00031')
  assert.equal(developer.records.externalProcessing.landRegistry, null)
  assert.equal(land.records.externalProcessing.tax.sourceCaseId, 'HST-HN-00044')
  assert.equal(
    land.records.externalProcessing.landRegistry.sourceCaseId,
    'VPDKDD-HN-260826-044',
  )

  for (const state of [developer, land]) {
    const types = state.integrationEvents.map(({ type }) => type)
    assert.ok(types.includes('transaction_created'))
    assert.ok(types.includes('tax_dossier_handed_off'))
    assert.ok(types.includes('route_determined'))
    assert.equal(state.externalEvents.at(-1).effect.type, 'notary_completed')
    assert.deepEqual(allowedActionsFor(state, 'tax'), [])
  }
  assert.ok(land.integrationEvents.some(({ type }) => type === 'land_registry_dossier_handed_off'))
})

test('Tax progresses in parallel and never gates either transfer route', () => {
  let developer = advanceToTransaction(DEVELOPER_CASE_ID)
  assert.deepEqual(allowedActionsFor(developer, 'developer'), [ACTIONS.DEVELOPER_INTAKE])
  developer = receive(developer, 'tax')
  assert.equal(developer.records.externalProcessing.tax.status, 'Đang xử lý')
  assert.deepEqual(allowedActionsFor(developer, 'developer'), [ACTIONS.DEVELOPER_INTAKE])

  let land = advanceToTransaction(LAND_CASE_ID)
  land = receive(land, 'landRegistry')
  land = receive(land, 'landRegistry')
  assert.equal(land.records.transfer.status, 'Đã sang tên')
  assert.equal(land.records.externalProcessing.tax.status, 'Chờ tiếp nhận')
  assert.equal(getCaseStatus(land).code, 'transfer_complete')
})

test('Developer interactions and Buyer receipt finish the HĐMB route', () => {
  let state = advanceToTransaction(DEVELOPER_CASE_ID)
  assert.deepEqual(allowedActionsFor(state, 'developer'), [ACTIONS.DEVELOPER_INTAKE])
  state = accepted(state, ACTIONS.DEVELOPER_INTAKE, 'developer')
  state = accepted(state, ACTIONS.DEVELOPER_CONFIRM_TRANSFER, 'developer')
  assert.deepEqual(allowedActionsFor(state, 'buyer'), [ACTIONS.BUYER_RECEIVE_CONTRACT])
  state = accepted(state, ACTIONS.BUYER_RECEIVE_CONTRACT, 'buyer')
  assert.equal(state.records.property.status, 'Đã cập nhật bên mua HĐMB')
  assert.equal(state.records.transaction.status, 'Đã nhận HĐMB mới')
  assert.equal(getCaseStatus(state).code, 'transfer_complete')
})

test('accepted commands and external events keep separate append-only histories', () => {
  let state = advanceToNotary(LAND_CASE_ID)
  const beforeReceive = state
  state = receive(state)
  state = receive(state)

  assert.equal(state.auditEvents.length, beforeReceive.auditEvents.length)
  assert.equal(state.externalEvents.length, 2)
  assert.equal(state.actionLog.length, beforeReceive.actionLog.length + 2)
  assert.equal(new Set(state.auditEvents.map(({ id }) => id)).size, state.auditEvents.length)
  assert.equal(new Set(state.externalEvents.map(({ id }) => id)).size, state.externalEvents.length)
  assert.ok(state.externalEvents.every(({ source }) => source === 'notary'))
  assert.ok(state.auditEvents.every(({ actorRoleId }) => actorRoleId !== 'notary'))

  const afterSupplement = accepted(state, ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF, 'seller')
  assert.equal(afterSupplement.auditEvents.length, state.auditEvents.length + 1)
  assert.equal(afterSupplement.externalEvents.length, state.externalEvents.length)
})

test('market roles receive safe progress while agencies get read-only source detail', () => {
  let state = advanceToNotary(LAND_CASE_ID)
  state = receive(state)
  state = receive(state)

  const expectedProcessing = {
    milestone: 'Công chứng',
    status: 'Yêu cầu bổ sung',
    processingOrganization: 'Văn phòng công chứng Minh Tâm',
    sourceUpdatedAt: '2026-08-19T14:40:00+07:00',
    receivedAt: '2026-08-19T14:42:00+07:00',
    timeline: [
      {
        source: 'notary',
        milestone: 'Công chứng',
        status: 'Đang xử lý',
        processingOrganization: 'Văn phòng công chứng Minh Tâm',
        sourceUpdatedAt: '2026-08-18T10:45:00+07:00',
        receivedAt: '2026-08-18T10:47:00+07:00',
      },
      {
        source: 'notary',
        milestone: 'Công chứng',
        status: 'Yêu cầu bổ sung',
        processingOrganization: 'Văn phòng công chứng Minh Tâm',
        sourceUpdatedAt: '2026-08-19T14:40:00+07:00',
        receivedAt: '2026-08-19T14:42:00+07:00',
      },
    ],
  }
  assert.deepEqual(getProcessingProjection(state), expectedProcessing)

  for (const roleId of ['agent', 'brokerage', 'seller', 'buyer']) {
    const projected = projectStateForRole(state, roleId)
    assert.deepEqual(projected.processing, expectedProcessing)
    assert.doesNotMatch(JSON.stringify(projected.processing), /rawStatus|sourceCaseId/u)
  }

  const brokerage = projectStateForRole(state, 'brokerage')
  assert.equal(brokerage.records.readiness.buyer.reference, 'NM-HN-0044')
  assert.equal(brokerage.parties.buyer.masked, true)
  const seller = projectStateForRole(state, 'seller')
  assert.deepEqual(seller.records.readiness, { status: 'Đã sẵn sàng công chứng' })
  assert.equal('buyer' in seller.parties, false)

  const notary = projectStateForRole(state, 'notary')
  assert.deepEqual(notary.allowedActions, [])
  assert.deepEqual(Object.keys(notary.records), ['property', 'transaction', 'externalCase'])
  assert.equal(notary.records.externalCase.sourceCaseId, 'HSCC-HN-00044')
  assert.equal(notary.records.externalCase.rawStatus, 'Chờ bổ sung xác nhận tình trạng hôn nhân')
  assert.equal('parties' in notary, false)
  assert.doesNotMatch(JSON.stringify(notary), /CCCD|identityRef|buyer|Người mua/iu)

  const routed = advanceToTransaction(LAND_CASE_ID)
  const sourceCases = {
    notary: 'HSCC-HN-00044',
    tax: 'HST-HN-00044',
    landRegistry: 'VPDKDD-HN-260826-044',
  }
  for (const [roleId, sourceCaseId] of Object.entries(sourceCases)) {
    const sourceProjection = projectStateForRole(routed, roleId)
    assert.equal(sourceProjection.records.externalCase.sourceCaseId, sourceCaseId)
    assert.equal(sourceProjection.status.label, sourceProjection.records.externalCase.status)
    assert.equal(Object.hasOwn(sourceProjection, 'processing'), false)
    assert.equal(sourceProjection.nextWorkItem, null)
    for (const foreignCaseId of Object.values(sourceCases).filter((id) => id !== sourceCaseId)) {
      assert.doesNotMatch(JSON.stringify(sourceProjection), new RegExp(foreignCaseId, 'u'))
    }
  }
})

test('Buyer projection includes safe 357 provenance without other party identities', () => {
  const state = advanceToReady(DEVELOPER_CASE_ID)
  state.records.property.sourceRecord357.ownerIdentity = 'CCCD-PRIVATE-001'
  state.records.property.sourceRecord357.claims.push({
    field: 'ownerIdentity',
    label: 'Định danh chủ sở hữu',
    value: 'CCCD-PRIVATE-001',
    evidenceId: 'PRIVATE-EVIDENCE',
  })
  state.records.property.sourceRecord357.claims[0].internalNote = 'PRIVATE-NOTE'
  const buyer = projectStateForRole(state, 'buyer')
  const source = buyer.records.property.sourceRecord357
  assert.equal(source.npid, 'NPID-HN-09876')
  assert.equal(source.sourceRecordId, '357-HN-09876')
  assert.equal(source.version, '2026-08-10.1')
  assert.ok(source.claims.some(({ field }) => field === 'area'))
  assert.deepEqual(Object.keys(source), [
    'sourceId',
    'sourceName',
    'sourceRecordId',
    'version',
    'npid',
    'publicationStatus',
    'sourceUpdatedAt',
    'receivedAt',
    'claims',
  ])
  assert.ok(source.claims.every((claim) => (
    Object.keys(claim).join(',') === 'field,label,value'
  )))
  assert.deepEqual(Object.keys(buyer.parties), ['buyer'])
  assert.doesNotMatch(
    JSON.stringify(buyer),
    new RegExp(`${state.parties.seller.displayName}|CCCD-PRIVATE|PRIVATE-EVIDENCE|PRIVATE-NOTE`, 'u'),
  )
})

test('Bank projection remains consent-scoped and omits source and dossier details', () => {
  const denied = advanceToReady(LAND_CASE_ID, false)
  assert.equal(projectStateForRole(denied, 'bank'), null)
  assert.deepEqual(deriveWorkItems(denied, 'bank'), [])

  const state = advanceToReady(DEVELOPER_CASE_ID, true)
  const bank = projectStateForRole(state, 'bank')
  assert.deepEqual(Object.keys(bank), ['shareId', 'roleId', 'allowedActions', 'records'])
  assert.deepEqual(Object.keys(bank.records.property), ['type'])
  assert.equal(bank.records.readiness.financeSharing.status, 'Đã đồng ý')
  const exposed = JSON.stringify(bank)
  for (const forbidden of ['NPID-HN-09876', 'PLID-HN-00125', '357-HN-09876', 'CCCD', 'VPCC']) {
    assert.doesNotMatch(exposed, new RegExp(forbidden, 'u'))
  }
})

test('agency queues combine five fixtures with active journey rows and never expose identity', () => {
  let land = advanceToNotary(LAND_CASE_ID)
  land = receive(land)
  const notaryQueue = deriveExternalQueue([land], 'notary')
  assert.equal(notaryQueue.length, 6)
  assert.deepEqual(Object.keys(notaryQueue[0]), [
    'id',
    'source',
    'sourceCaseId',
    'caseId',
    'propertyId',
    'transactionId',
    'propertyLabel',
    'status',
    'rawStatus',
    'processingOrganization',
    'sourceUpdatedAt',
    'receivedAt',
    'history',
    'actionable',
  ])
  assert.ok(notaryQueue.every(({ actionable }) => actionable === false))

  const routed = advanceToTransaction(LAND_CASE_ID)
  assert.equal(deriveExternalQueue([routed], 'landRegistry').length, 6)
  assert.equal(deriveExternalQueue([routed], 'tax').length, 6)
  assert.equal(deriveExternalQueue([routed], 'buyer').length, 0)
  assert.doesNotMatch(JSON.stringify({
    notary: notaryQueue,
    land: deriveExternalQueue([routed], 'landRegistry'),
    tax: deriveExternalQueue([routed], 'tax'),
  }), /CCCD|identityRef|Người mua|Người bán/iu)
})

test('work queues expose progress and retain operational filters', () => {
  const initialStates = demoCases.map(({ id }) => createInitialState(id))
  const agentQueue = deriveWorkItems(initialStates, 'agent')
  const brokerageQueue = deriveWorkItems(initialStates, 'brokerage')
  assert.equal(agentQueue.length, 2)
  assert.ok(agentQueue.every(({ nextAction }) => nextAction === ACTIONS.REQUEST_SELLER_CONFIRMATION))
  assert.equal(brokerageQueue.length, 2)
  assert.ok(brokerageQueue.every(({ actionable }) => actionable === false))

  const processing = advanceToNotary(DEVELOPER_CASE_ID)
  const row = deriveWorkItems(processing, 'brokerage')[0]
  assert.equal(row.processing, 'Công chứng · Chờ tiếp nhận')
  assert.equal(row.processingOrganization, 'Văn phòng công chứng Minh Tâm')
  assert.equal(filterWorkItems(agentQueue, { query: 'NPID-HN-10421' }).length, 1)
  assert.equal(filterWorkItems(agentQueue, { priority: 'Cao' }).length, 1)
  assert.equal(filterWorkItems(agentQueue, { actionable: false }).length, 0)
})

test('next work is derived from independent records including parallel source updates', () => {
  let state = createInitialState(DEVELOPER_CASE_ID)
  assert.deepEqual(
    { roleId: getNextWorkItem(state).roleId, action: getNextWorkItem(state).action },
    { roleId: 'agent', action: ACTIONS.REQUEST_SELLER_CONFIRMATION },
  )
  state = advanceToNotary(DEVELOPER_CASE_ID)
  assert.deepEqual(
    { roleId: getNextWorkItem(state).roleId, action: getNextWorkItem(state).action },
    { roleId: 'vmls', action: ACTIONS.RECEIVE_EXTERNAL_EVENT },
  )
  state = advanceToTransaction(DEVELOPER_CASE_ID)
  assert.equal(getNextWorkItem(state).roleId, 'developer')
  state = accepted(state, ACTIONS.DEVELOPER_INTAKE, 'developer')
  state = accepted(state, ACTIONS.DEVELOPER_CONFIRM_TRANSFER, 'developer')
  state = accepted(state, ACTIONS.BUYER_RECEIVE_CONTRACT, 'buyer')
  assert.equal(getNextWorkItem(state).roleId, 'vmls')
  state = completeTax(state)
  assert.equal(getNextWorkItem(state), null)
})

test('v4 persistence replays deterministic external events and fails closed', () => {
  const progressed = advanceToTransaction(LAND_CASE_ID)
  const serialized = serializeDemoState(progressed)
  const stored = JSON.parse(serialized)

  assert.deepEqual(Object.keys(stored), ['version', 'caseId', 'actions'])
  assert.equal(stored.version, 4)
  assert.equal(stored.caseId, LAND_CASE_ID)
  assert.ok(stored.actions.some(({ type }) => type === ACTIONS.RECEIVE_EXTERNAL_EVENT))
  assert.deepEqual(restoreDemoState(serialized), progressed)
  assert.deepEqual(restoreDemoState(serialized, LAND_CASE_ID), progressed)
  assert.deepEqual(
    restoreDemoState(serialized, DEVELOPER_CASE_ID),
    createInitialState(DEVELOPER_CASE_ID),
  )
  assert.deepEqual(
    restoreDemoState(JSON.stringify({ ...stored, version: 3 }), LAND_CASE_ID),
    createInitialState(LAND_CASE_ID),
  )
  assert.deepEqual(
    restoreDemoState(JSON.stringify({ ...stored, private: 'accepted' }), LAND_CASE_ID),
    createInitialState(LAND_CASE_ID),
  )

  const actionWithExtraKey = {
    type: ACTIONS.REQUEST_SELLER_CONFIRMATION,
    actor: 'agent',
    payload: payloadFor(LAND_CASE_ID, ACTIONS.REQUEST_SELLER_CONFIRMATION),
    unexpected: 'accepted',
  }
  const initial = createInitialState(LAND_CASE_ID)
  assert.strictEqual(journeyReducer(initial, actionWithExtraKey), initial)

  const actionEnvelopeWithExtraKey = structuredClone(stored)
  actionEnvelopeWithExtraKey.actions[0].unexpected = 'accepted'
  assert.deepEqual(
    restoreDemoState(JSON.stringify(actionEnvelopeWithExtraKey), LAND_CASE_ID),
    createInitialState(LAND_CASE_ID),
  )

  const wrongSource = structuredClone(stored)
  const receiveAction = wrongSource.actions.find(({ type }) => type === ACTIONS.RECEIVE_EXTERNAL_EVENT)
  receiveAction.payload.source = 'tax'
  assert.deepEqual(
    restoreDemoState(JSON.stringify(wrongSource), LAND_CASE_ID),
    createInitialState(LAND_CASE_ID),
  )

  const injected = structuredClone(stored)
  injected.actions[0].payload.candidateId = 'NPID-HN-10421'
  assert.deepEqual(
    restoreDemoState(JSON.stringify(injected), LAND_CASE_ID),
    createInitialState(LAND_CASE_ID),
  )
  assert.deepEqual(
    restoreDemoState('{not json', LAND_CASE_ID),
    createInitialState(LAND_CASE_ID),
  )
})

test('both routes complete while retaining distinct NPID, PLID and PTID histories', () => {
  const developer = completeDeveloperCase()
  const land = completeLandCase()
  assert.equal(getCaseStatus(developer).code, 'transfer_complete')
  assert.equal(getCaseStatus(land).code, 'transfer_complete')
  assert.equal(developer.records.externalProcessing.tax.status, 'Đã xử lý')
  assert.equal(land.records.externalProcessing.tax.status, 'Đã xử lý')
  assert.equal(land.records.externalProcessing.landRegistry.status, 'Đã xử lý')
  assert.equal(getNextWorkItem(developer), null)
  assert.equal(getNextWorkItem(land), null)

  for (const state of [developer, land]) {
    assert.equal(new Set([
      state.records.property.id,
      state.records.listing.id,
      state.records.transaction.id,
    ]).size, 3)
    assert.equal(
      new Set(state.actionLog.map((action, index) => `${index}:${action.type}`)).size,
      state.actionLog.length,
    )
  }
})
