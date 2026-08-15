import test from 'node:test'
import assert from 'node:assert/strict'
import { getDemoCase } from '../src/demo/demoData.js'
import {
  ACTIONS,
  createInitialState,
  journeyReducer,
  projectStateForPublic,
} from '../src/demo/journey.js'

const DEVELOPER_CASE_ID = 'sun-grand-thuy-khue'
const LAND_CASE_ID = 'phu-thuong-landed-home'

function apply(state, type, actor, payload) {
  const next = journeyReducer(state, { type, actor, payload })
  assert.notStrictEqual(next, state, `${type} should be accepted by the test fixture`)
  return next
}

function advanceToNotarySubmission(caseId) {
  const dossier = getDemoCase(caseId)
  assert.ok(dossier)

  let state = createInitialState(caseId)
  state = apply(state, ACTIONS.MATCH_PROPERTY, 'agent', {
    candidateId: dossier.property.id,
    sourceIds: dossier.property.sourceRecords.map(({ id }) => id),
  })
  state = apply(state, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent', {
    scope: 'Độc quyền',
    startsOn: dossier.actionTimes.request_seller_confirmation.slice(0, 10),
    expiresOn: '2026-11-11',
  })
  state = apply(state, ACTIONS.CONFIRM_REPRESENTATION, 'seller', {
    accepted: true,
    confirmationRef: `XN-${dossier.representation.id}`,
  })
  state = apply(state, ACTIONS.RECORD_BUYER, 'agent', {
    buyerRef: dossier.parties.buyer.reference,
    agreedPrice: dossier.listing.askingPrice.value - 200_000_000,
    expectedSigningOn: dossier.actionTimes.record_notary_signing.slice(0, 10),
  })
  state = apply(state, ACTIONS.VERIFY_READINESS, 'buyer', {
    confirmed: true,
    bankConsent: false,
    checklist: {
      identityReviewed: true,
      paymentPlanReviewed: true,
      documentsReviewed: true,
    },
  })
  state = apply(state, ACTIONS.SUBMIT_NOTARY_DOSSIER, 'notary', {
    submissionRef: `NOP-${dossier.notary.id}`,
    documentIds: [...dossier.notary.requiredDocumentIds],
  })

  return state
}

function advanceToTransaction(caseId) {
  const dossier = getDemoCase(caseId)
  assert.ok(dossier)
  let state = advanceToNotarySubmission(caseId)

  if (dossier.notary.requiresSupplement) {
    state = apply(state, ACTIONS.REQUEST_SUPPLEMENT, 'notary', {
      reasonCode: dossier.notary.supplement.reasonCode,
      documentType: dossier.notary.supplement.documentType,
      dueOn: '2026-08-21',
    })
    state = apply(state, ACTIONS.PROVIDE_SUPPLEMENT, 'seller', {
      documentId: 'DOC-BOSUNG-HN-0044',
      documentType: dossier.notary.supplement.documentType,
      fileName: 'xac-nhan-tinh-trang-hon-nhan.pdf',
    })
  }

  return apply(state, ACTIONS.RECORD_NOTARY_SIGNING, 'notary', {
    resultRef: `KQ-${dossier.notary.id}`,
    signedAt: dossier.actionTimes.record_notary_signing,
    documentDigest: 'a1b2c3d4e5f60718',
  })
}

function completeDeveloperCase() {
  const dossier = getDemoCase(DEVELOPER_CASE_ID)
  assert.ok(dossier)
  let state = advanceToTransaction(DEVELOPER_CASE_ID)
  state = apply(state, ACTIONS.DEVELOPER_INTAKE, 'developer', {
    intakeRef: dossier.transfer.intakeRef,
    receivedAt: dossier.actionTimes.developer_intake,
    documentCount: dossier.notary.requiredDocumentIds.length,
  })
  state = apply(state, ACTIONS.DEVELOPER_CONFIRM_TRANSFER, 'developer', {
    confirmationRef: 'XN-CDT-HN-00031',
    confirmedAt: dossier.actionTimes.developer_confirm_transfer,
  })
  return apply(state, ACTIONS.BUYER_RECEIVE_CONTRACT, 'buyer', {
    receiptRef: dossier.transfer.resultRef,
    receivedAt: dossier.actionTimes.buyer_receive_contract,
    acknowledged: true,
  })
}

test('public projection is a strict nested allowlist and withholds unborn identifiers', () => {
  const projected = projectStateForPublic(createInitialState(DEVELOPER_CASE_ID))
  assert.ok(projected)

  assert.deepEqual(Object.keys(projected), [
    'caseId',
    'title',
    'property',
    'listing',
    'transaction',
    'transfer',
    'status',
    'nextWork',
    'latestMaterialAt',
  ])
  assert.deepEqual(Object.keys(projected.property), [
    'id',
    'status',
    'name',
    'type',
    'project',
    'unit',
    'parcelRef',
    'location',
  ])
  assert.deepEqual(Object.keys(projected.transfer), ['route', 'basis', 'status'])
  assert.deepEqual(Object.keys(projected.status), ['code', 'label', 'tone'])
  assert.deepEqual(Object.keys(projected.nextWork), ['label', 'ownerLabel', 'dueAt'])
  assert.equal(projected.listing, null)
  assert.equal(projected.transaction, null)
  assert.equal(projected.latestMaterialAt, null)
  assert.equal(projected.property.parcelRef, null)
  assert.equal(projected.title, 'Căn hộ S2-12A · Thụy Khuê')
})

test('public projection exposes PLID and PTID only after their lifecycle creation', () => {
  const dossier = getDemoCase(DEVELOPER_CASE_ID)
  assert.ok(dossier)
  let state = createInitialState(DEVELOPER_CASE_ID)
  state = apply(state, ACTIONS.MATCH_PROPERTY, 'agent', {
    candidateId: dossier.property.id,
    sourceIds: dossier.property.sourceRecords.map(({ id }) => id),
  })
  const afterMatch = projectStateForPublic(state)
  assert.equal(afterMatch.listing, null)
  assert.equal(afterMatch.transaction, null)
  assert.equal(afterMatch.latestMaterialAt, dossier.actionTimes.match_property)

  state = apply(state, ACTIONS.REQUEST_SELLER_CONFIRMATION, 'agent', {
    scope: 'Độc quyền',
    startsOn: '2026-08-10',
    expiresOn: '2026-11-11',
  })
  state = apply(state, ACTIONS.CONFIRM_REPRESENTATION, 'seller', {
    accepted: true,
    confirmationRef: `XN-${dossier.representation.id}`,
  })
  const afterListing = projectStateForPublic(state)
  assert.deepEqual(afterListing.listing, { id: 'PLID-HN-00125', status: 'Đã khởi tạo' })
  assert.equal(afterListing.transaction, null)
  assert.equal(afterListing.latestMaterialAt, dossier.actionTimes.confirm_representation)

  const afterTransaction = projectStateForPublic(advanceToTransaction(DEVELOPER_CASE_ID))
  assert.deepEqual(afterTransaction.transaction, {
    id: 'PTID-HN-00031',
    status: 'Đã ký công chứng',
  })
  assert.equal(afterTransaction.latestMaterialAt, dossier.actionTimes.record_notary_signing)
})

test('public projection generalizes restricted notary exceptions', () => {
  const dossier = getDemoCase(LAND_CASE_ID)
  assert.ok(dossier)
  let state = advanceToNotarySubmission(LAND_CASE_ID)
  state = apply(state, ACTIONS.REQUEST_SUPPLEMENT, 'notary', {
    reasonCode: dossier.notary.supplement.reasonCode,
    documentType: dossier.notary.supplement.documentType,
    dueOn: '2026-08-21',
  })

  const projected = projectStateForPublic(state)
  assert.deepEqual(projected.status, {
    code: 'notary_processing',
    label: 'Đang xử lý công chứng',
    tone: 'info',
  })
  assert.deepEqual(projected.nextWork, {
    label: 'Hoàn tất công chứng',
    ownerLabel: 'Văn phòng công chứng',
    dueAt: dossier.slaDueAt,
  })

  const exposed = JSON.stringify(projected)
  for (const restrictedValue of [
    'Cần bổ sung hồ sơ',
    'Cung cấp tài liệu bổ sung',
    dossier.notary.supplement.reasonCode,
    dossier.notary.supplement.documentType,
    '2026-08-21',
    'Người bán',
  ]) {
    assert.equal(exposed.includes(restrictedValue), false)
  }
})

test('public transfer projections cover both routes without operational references', () => {
  const developer = projectStateForPublic(completeDeveloperCase())
  assert.deepEqual(developer.transfer, {
    route: 'developer',
    basis: 'Hợp đồng mua bán với chủ đầu tư',
    status: 'Đã bàn giao HĐMB mới',
  })
  assert.equal(developer.latestMaterialAt, '2026-08-26T10:30:00+07:00')
  assert.equal(developer.nextWork, null)

  const dossier = getDemoCase(LAND_CASE_ID)
  assert.ok(dossier)
  const routedLand = advanceToTransaction(LAND_CASE_ID)
  const completedLand = apply(routedLand, ACTIONS.APPROVE_LAND_REGISTRY, 'landRegistry', {
    resultRef: dossier.transfer.resultRef,
    approvedAt: dossier.actionTimes.approve_land_registry,
    newOwnerRef: dossier.parties.buyer.reference,
  })
  const land = projectStateForPublic(completedLand)
  assert.deepEqual(land.transfer, {
    route: 'landRegistry',
    basis: 'Giấy chứng nhận quyền sử dụng đất',
    status: 'Đã sang tên',
  })
  assert.equal(land.latestMaterialAt, '2026-08-28T14:30:00+07:00')
})

test('private state, references and event histories cannot cross the public boundary', () => {
  const state = completeDeveloperCase()
  state.secretContact = 'public-projection-secret-contact'
  state.records.readiness.secretFinance = 'public-projection-secret-finance'
  state.records.notaryDossier.secretDocument = 'public-projection-secret-document'
  state.auditEvents.push({ at: '2099-01-01T00:00:00Z', secret: 'public-projection-secret-audit' })
  state.integrationEvents.push({
    at: '2099-01-02T00:00:00Z',
    secret: 'public-projection-secret-integration',
  })
  state.actionLog.push({ secret: 'public-projection-secret-action-log' })

  const projected = projectStateForPublic(state)
  const exposed = JSON.stringify(projected)
  const dossier = getDemoCase(DEVELOPER_CASE_ID)
  assert.ok(dossier)

  for (const privateValue of [
    dossier.dossierId,
    dossier.parties.seller.displayName,
    dossier.parties.seller.phone,
    dossier.parties.seller.identityRef,
    state.records.representation.id,
    state.records.readiness.id,
    state.records.notaryDossier.id,
    state.records.notaryDossier.correlationId,
    state.records.notaryDossier.documents[0].id,
    String(state.records.readiness.agreedPrice),
    state.records.transfer.resultRef,
    state.records.transfer.receiptRef,
    state.auditEvents[0].id,
    state.integrationEvents[0].id,
    'public-projection-secret-contact',
    'public-projection-secret-finance',
    'public-projection-secret-document',
    'public-projection-secret-audit',
    'public-projection-secret-integration',
    'public-projection-secret-action-log',
  ]) {
    assert.doesNotMatch(exposed, new RegExp(privateValue, 'u'))
  }

  for (const forbiddenKey of [
    'dossierId',
    'parties',
    'representation',
    'readiness',
    'notaryDossier',
    'documents',
    'financeSharing',
    'auditEvents',
    'integrationEvents',
    'actionLog',
    'correlationId',
    'confirmationRef',
    'resultRef',
    'receiptRef',
  ]) {
    assert.equal(exposed.includes(`"${forbiddenKey}"`), false)
  }

  assert.equal(projected.latestMaterialAt, '2026-08-26T10:30:00+07:00')
})

test('public projection rejects unknown or incomplete state', () => {
  assert.equal(projectStateForPublic(null), null)
  assert.equal(projectStateForPublic({ caseId: 'unknown', records: {} }), null)
  assert.equal(projectStateForPublic({ caseId: DEVELOPER_CASE_ID, records: {} }), null)
})
