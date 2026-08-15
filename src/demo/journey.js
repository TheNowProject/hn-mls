// @ts-check

import { DEMO_VERSION, demoCases, getDemoCase, roles } from './demoData.js'

export const ACTIONS = Object.freeze({
  REQUEST_SELLER_CONFIRMATION: 'request_seller_confirmation',
  CONFIRM_REPRESENTATION: 'confirm_representation',
  RECORD_BUYER: 'record_buyer',
  VERIFY_READINESS: 'verify_readiness',
  SUBMIT_NOTARY_DOSSIER: 'submit_notary_dossier',
  REQUEST_SUPPLEMENT: 'request_supplement',
  PROVIDE_SUPPLEMENT: 'provide_supplement',
  RECORD_NOTARY_SIGNING: 'record_notary_signing',
  APPROVE_LAND_REGISTRY: 'approve_land_registry',
  DEVELOPER_INTAKE: 'developer_intake',
  DEVELOPER_CONFIRM_TRANSFER: 'developer_confirm_transfer',
  BUYER_RECEIVE_CONTRACT: 'buyer_receive_contract',
})

export const ACTION_META = Object.freeze({
  [ACTIONS.REQUEST_SELLER_CONFIRMATION]: {
    actorRoleId: 'agent',
    label: 'Gửi thông tin đến Người bán',
    targetType: 'representation',
  },
  [ACTIONS.CONFIRM_REPRESENTATION]: {
    actorRoleId: 'seller',
    label: 'Xác nhận quyền đại diện',
    targetType: 'representation',
  },
  [ACTIONS.RECORD_BUYER]: {
    actorRoleId: 'agent',
    label: 'Ghi nhận người mua',
    targetType: 'readiness',
  },
  [ACTIONS.VERIFY_READINESS]: {
    actorRoleId: 'buyer',
    label: 'Xác nhận sẵn sàng công chứng',
    targetType: 'readiness',
  },
  [ACTIONS.SUBMIT_NOTARY_DOSSIER]: {
    actorRoleId: 'notary',
    label: 'Tiếp nhận hồ sơ công chứng',
    targetType: 'notaryDossier',
  },
  [ACTIONS.REQUEST_SUPPLEMENT]: {
    actorRoleId: 'notary',
    label: 'Yêu cầu bổ sung',
    targetType: 'notaryDossier',
  },
  [ACTIONS.PROVIDE_SUPPLEMENT]: {
    actorRoleId: 'seller',
    label: 'Cung cấp tài liệu bổ sung',
    targetType: 'notaryDossier',
  },
  [ACTIONS.RECORD_NOTARY_SIGNING]: {
    actorRoleId: 'notary',
    label: 'Ghi nhận kết quả công chứng',
    targetType: 'notaryDossier',
  },
  [ACTIONS.APPROVE_LAND_REGISTRY]: {
    actorRoleId: 'landRegistry',
    label: 'Ghi nhận kết quả sang tên',
    targetType: 'transfer',
  },
  [ACTIONS.DEVELOPER_INTAKE]: {
    actorRoleId: 'developer',
    label: 'Tiếp nhận hồ sơ chuyển nhượng',
    targetType: 'transfer',
  },
  [ACTIONS.DEVELOPER_CONFIRM_TRANSFER]: {
    actorRoleId: 'developer',
    label: 'Xác nhận chuyển nhượng HĐMB',
    targetType: 'transfer',
  },
  [ACTIONS.BUYER_RECEIVE_CONTRACT]: {
    actorRoleId: 'buyer',
    label: 'Xác nhận nhận HĐMB mới',
    targetType: 'transfer',
  },
})

const clone = (value) => structuredClone(value)
const roleIds = new Set(roles.map(({ id }) => id))

const SELLER_AUDIT_ACTIONS = new Set([
  ACTIONS.REQUEST_SELLER_CONFIRMATION,
  ACTIONS.CONFIRM_REPRESENTATION,
  ACTIONS.VERIFY_READINESS,
  ACTIONS.SUBMIT_NOTARY_DOSSIER,
  ACTIONS.REQUEST_SUPPLEMENT,
  ACTIONS.PROVIDE_SUPPLEMENT,
  ACTIONS.RECORD_NOTARY_SIGNING,
  ACTIONS.APPROVE_LAND_REGISTRY,
  ACTIONS.DEVELOPER_CONFIRM_TRANSFER,
  ACTIONS.BUYER_RECEIVE_CONTRACT,
])

function resolveCase(caseId) {
  return getDemoCase(caseId) ?? demoCases[0]
}

function blankChecklist() {
  return {
    identityReviewed: false,
    paymentPlanReviewed: false,
    documentsReviewed: false,
  }
}

export function createInitialState(caseId = demoCases[0]?.id) {
  const dossier = resolveCase(caseId)

  return {
    version: 3,
    dataVersion: DEMO_VERSION,
    caseId: dossier.id,
    records: {
      property: {
        ...clone(dossier.property),
        status: 'Đã định danh',
        sources: clone(dossier.property.sourceRecords),
      },
      representation: {
        id: dossier.representation.id,
        propertyId: dossier.property.id,
        status: 'Chưa gửi',
        confirmationChannel: dossier.representation.confirmationChannel,
        scope: null,
        startsOn: null,
        expiresOn: null,
        requestedAt: null,
        confirmedAt: null,
        request: null,
        confirmation: null,
        parties: {
          seller: clone(dossier.parties.seller),
          representative: clone(dossier.parties.agent),
        },
      },
      listing: null,
      readiness: {
        id: `READY-${dossier.dossierId}`,
        status: 'Chưa ghi nhận người mua',
        buyer: null,
        contractConfirmation: null,
        agreedPrice: null,
        expectedSigningOn: null,
        checklist: blankChecklist(),
        financeSharing: {
          shareId: null,
          status: 'Chưa áp dụng',
          purpose: null,
          visibleFields: [],
          scope: null,
          recordedAt: null,
        },
      },
      notaryDossier: {
        id: dossier.notary.id,
        office: dossier.notary.office,
        correlationId: dossier.notary.correlationId,
        status: 'Chưa nộp',
        requiredDocumentIds: [...dossier.notary.requiredDocumentIds],
        documents: dossier.notary.documents.map((document) => ({
          ...document,
          status: 'Chưa nộp',
        })),
        submission: null,
        supplement: null,
        signedResult: null,
      },
      transaction: null,
      transfer: {
        basis: dossier.transfer.basis,
        route: null,
        status: 'Chưa xác định',
        intakeRef: null,
        intakeAt: null,
        documentCount: null,
        confirmationRef: null,
        confirmedAt: null,
        resultRef: null,
        resultAt: null,
        contractReference: null,
        receiptRef: null,
        receivedAt: null,
      },
    },
    parties: clone(dossier.parties),
    auditEvents: [],
    integrationEvents: [],
    actionLog: [],
  }
}

export function allowedActionsFor(state, roleId) {
  if (!state?.records || !roleIds.has(roleId)) return []

  const dossier = getDemoCase(state.caseId)
  if (!dossier) return []

  const { property, representation, listing, readiness, notaryDossier, transaction, transfer } = state.records

  if (roleId === 'agent') {
    if (property.status === 'Đã định danh' && representation.status === 'Chưa gửi') {
      return [ACTIONS.REQUEST_SELLER_CONFIRMATION]
    }
    if (listing && !readiness.buyer) return [ACTIONS.RECORD_BUYER]
    return []
  }

  if (roleId === 'seller') {
    if (representation.status === 'Chờ xác nhận') return [ACTIONS.CONFIRM_REPRESENTATION]
    if (notaryDossier.supplement?.status === 'Chờ người bán') {
      return [ACTIONS.PROVIDE_SUPPLEMENT]
    }
    return []
  }

  if (roleId === 'buyer') {
    if (readiness.buyer && readiness.status === 'Chờ người mua xác nhận') {
      return [ACTIONS.VERIFY_READINESS]
    }
    if (transfer.status === 'Chờ người mua nhận HĐMB') {
      return [ACTIONS.BUYER_RECEIVE_CONTRACT]
    }
    return []
  }

  if (roleId === 'notary') {
    if (readiness.status === 'Đã sẵn sàng công chứng'
      && notaryDossier.status === 'Chưa nộp') {
      return [ACTIONS.SUBMIT_NOTARY_DOSSIER]
    }
    if (notaryDossier.status === 'Đã tiếp nhận') {
      return dossier.notary.requiresSupplement
        ? [ACTIONS.REQUEST_SUPPLEMENT]
        : [ACTIONS.RECORD_NOTARY_SIGNING]
    }
    if (notaryDossier.status === 'Đủ hồ sơ ký') {
      return [ACTIONS.RECORD_NOTARY_SIGNING]
    }
    return []
  }

  if (roleId === 'developer') {
    if (transfer.route !== 'developer') return []
    if (transfer.status === 'Chờ chủ đầu tư tiếp nhận') return [ACTIONS.DEVELOPER_INTAKE]
    if (transfer.status === 'Chủ đầu tư đang xử lý') return [ACTIONS.DEVELOPER_CONFIRM_TRANSFER]
    return []
  }

  if (roleId === 'landRegistry') {
    return transaction && transfer.route === 'landRegistry'
      && transfer.status === 'Chờ đăng ký biến động'
      ? [ACTIONS.APPROVE_LAND_REGISTRY]
      : []
  }

  return []
}

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const hasReference = (value) => typeof value === 'string'
  && value.trim().length >= 6
  && value.trim().length <= 100
  && !/[\r\n]/.test(value)
const isDateOnly = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}
const isAugustDate = (value) => isDateOnly(value) && value.startsWith('2026-08-')
const isAugustDateTime = (value) => typeof value === 'string'
  && /^2026-08-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
  && !Number.isNaN(Date.parse(value))
const isDateOnOrAfter = (value, boundary) => isDateOnly(value) && value >= boundary.slice(0, 10)
const isDateOnOrBefore = (value, boundary) => isDateOnly(value) && value <= boundary.slice(0, 10)
const sameMembers = (actual, expected) => Array.isArray(actual)
  && actual.length === expected.length
  && new Set(actual).size === actual.length
  && expected.every((value) => actual.includes(value))
const normalizeIdentity = (value) => typeof value === 'string'
  ? value.trim().toLocaleUpperCase('vi')
  : ''
const PAYLOAD_KEYS = Object.freeze({
  [ACTIONS.REQUEST_SELLER_CONFIRMATION]: ['propertyId', 'scope', 'startsOn', 'expiresOn'],
  [ACTIONS.CONFIRM_REPRESENTATION]: ['accepted'],
  [ACTIONS.RECORD_BUYER]: ['buyerRef', 'agreedPrice', 'expectedSigningOn'],
  [ACTIONS.VERIFY_READINESS]: ['confirmed', 'bankConsent', 'checklist'],
  [ACTIONS.SUBMIT_NOTARY_DOSSIER]: ['submissionRef', 'documentIds'],
  [ACTIONS.REQUEST_SUPPLEMENT]: ['reasonCode', 'documentType', 'dueOn'],
  [ACTIONS.PROVIDE_SUPPLEMENT]: ['documentId', 'documentType', 'fileName'],
  [ACTIONS.RECORD_NOTARY_SIGNING]: ['contractId', 'signedAt'],
  [ACTIONS.APPROVE_LAND_REGISTRY]: ['resultRef', 'approvedAt'],
  [ACTIONS.DEVELOPER_INTAKE]: ['intakeRef', 'receivedAt', 'documentCount'],
  [ACTIONS.DEVELOPER_CONFIRM_TRANSFER]: ['confirmationRef', 'confirmedAt'],
  [ACTIONS.BUYER_RECEIVE_CONTRACT]: ['receiptRef', 'receivedAt', 'acknowledged'],
})
const hasExactKeys = (value, expectedKeys) => {
  const actualKeys = Reflect.ownKeys(value)
  return actualKeys.length === expectedKeys.length
    && expectedKeys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
}

function validPayload(state, action) {
  if (!isPlainObject(action?.payload)) return false
  const payload = action.payload
  const dossier = getDemoCase(state.caseId)
  const expectedKeys = PAYLOAD_KEYS[action.type]
  if (!dossier || !expectedKeys || !hasExactKeys(payload, expectedKeys)) return false

  switch (action.type) {
    case ACTIONS.REQUEST_SELLER_CONFIRMATION: {
      if (normalizeIdentity(payload.propertyId) !== dossier.property.id
        || !dossier.representation.allowedScopes.includes(payload.scope)
        || !isDateOnly(payload.startsOn) || !isDateOnly(payload.expiresOn)) return false
      const startsAt = Date.parse(`${payload.startsOn}T00:00:00Z`)
      const expiresAt = Date.parse(`${payload.expiresOn}T00:00:00Z`)
      return isDateOnOrAfter(payload.startsOn, dossier.actionTimes.request_seller_confirmation)
        && expiresAt > startsAt
        && expiresAt - startsAt <= 366 * 24 * 60 * 60 * 1000
    }
    case ACTIONS.CONFIRM_REPRESENTATION:
      return payload.accepted === true
    case ACTIONS.RECORD_BUYER:
      return payload.buyerRef === dossier.parties.buyer.reference
        && Number.isInteger(payload.agreedPrice) && payload.agreedPrice > 0
        && isAugustDate(payload.expectedSigningOn)
        && isDateOnOrAfter(payload.expectedSigningOn, dossier.actionTimes.record_buyer)
        && isDateOnOrBefore(payload.expectedSigningOn, dossier.slaDueAt)
    case ACTIONS.VERIFY_READINESS:
      return payload.confirmed === true
        && typeof payload.bankConsent === 'boolean'
        && isPlainObject(payload.checklist)
        && hasExactKeys(payload.checklist, [
          'identityReviewed',
          'paymentPlanReviewed',
          'documentsReviewed',
        ])
        && ['identityReviewed', 'paymentPlanReviewed', 'documentsReviewed']
          .every((key) => payload.checklist[key] === true)
    case ACTIONS.SUBMIT_NOTARY_DOSSIER:
      return hasReference(payload.submissionRef)
        && sameMembers(payload.documentIds, dossier.notary.requiredDocumentIds)
    case ACTIONS.REQUEST_SUPPLEMENT:
      return Boolean(dossier.notary.supplement)
        && payload.reasonCode === dossier.notary.supplement?.reasonCode
        && payload.documentType === dossier.notary.supplement?.documentType
        && isAugustDate(payload.dueOn)
        && isDateOnOrAfter(payload.dueOn, dossier.actionTimes.provide_supplement)
        && isDateOnOrBefore(payload.dueOn, dossier.actionTimes.record_notary_signing)
    case ACTIONS.PROVIDE_SUPPLEMENT:
      return hasReference(payload.documentId)
        && payload.documentType === dossier.notary.supplement?.documentType
        && typeof payload.fileName === 'string'
        && /^[^/\\]+\.pdf$/i.test(payload.fileName)
    case ACTIONS.RECORD_NOTARY_SIGNING:
      return hasReference(payload.contractId)
        && isAugustDateTime(payload.signedAt)
    case ACTIONS.APPROVE_LAND_REGISTRY:
      return hasReference(payload.resultRef)
        && isAugustDateTime(payload.approvedAt)
    case ACTIONS.DEVELOPER_INTAKE:
      return hasReference(payload.intakeRef)
        && isAugustDateTime(payload.receivedAt)
        && Number.isInteger(payload.documentCount)
        && payload.documentCount >= dossier.notary.requiredDocumentIds.length
    case ACTIONS.DEVELOPER_CONFIRM_TRANSFER:
      return hasReference(payload.confirmationRef) && isAugustDateTime(payload.confirmedAt)
    case ACTIONS.BUYER_RECEIVE_CONTRACT:
      return payload.acknowledged === true
        && hasReference(payload.receiptRef)
        && isAugustDateTime(payload.receivedAt)
    default:
      return false
  }
}

const ACTION_TIMESTAMP_FIELDS = Object.freeze({
  [ACTIONS.RECORD_NOTARY_SIGNING]: 'signedAt',
  [ACTIONS.APPROVE_LAND_REGISTRY]: 'approvedAt',
  [ACTIONS.DEVELOPER_INTAKE]: 'receivedAt',
  [ACTIONS.DEVELOPER_CONFIRM_TRANSFER]: 'confirmedAt',
  [ACTIONS.BUYER_RECEIVE_CONTRACT]: 'receivedAt',
})

function actionTimestamp(dossier, action) {
  const field = ACTION_TIMESTAMP_FIELDS[action.type]
  return field ? action.payload?.[field] : dossier.actionTimes[action.type]
}

function eventAt(dossier, action, offset = 0) {
  const base = actionTimestamp(dossier, action)
  if (!offset) return base
  return new Date(Date.parse(base) + offset * 1000).toISOString()
}

function chronologyAllows(state, action) {
  const dossier = getDemoCase(state.caseId)
  if (!dossier) return false
  const occurredAt = actionTimestamp(dossier, action)
  const configuredAt = dossier.actionTimes[action.type]
  const occurredTime = Date.parse(occurredAt)
  const configuredTime = Date.parse(configuredAt)
  const slaTime = Date.parse(dossier.slaDueAt)
  if (!Number.isFinite(occurredTime) || !Number.isFinite(configuredTime)
    || occurredTime < configuredTime || occurredTime > slaTime) return false

  const previousTimes = [...state.auditEvents, ...state.integrationEvents]
    .map(({ at }) => Date.parse(at))
    .filter(Number.isFinite)
  return previousTimes.length === 0 || occurredTime > Math.max(...previousTimes)
}

function targetIdFor(state, actionType) {
  if ([ACTIONS.REQUEST_SELLER_CONFIRMATION, ACTIONS.CONFIRM_REPRESENTATION].includes(actionType)) {
    return state.records.representation.id
  }
  if ([ACTIONS.RECORD_BUYER, ACTIONS.VERIFY_READINESS].includes(actionType)) {
    return state.records.readiness.id
  }
  if ([
    ACTIONS.SUBMIT_NOTARY_DOSSIER,
    ACTIONS.REQUEST_SUPPLEMENT,
    ACTIONS.PROVIDE_SUPPLEMENT,
    ACTIONS.RECORD_NOTARY_SIGNING,
  ].includes(actionType)) return state.records.notaryDossier.id
  return state.records.transaction?.id ?? state.caseId
}

function createAuditEvent(state, changedState, action) {
  const dossier = resolveCase(state.caseId)
  const meta = ACTION_META[action.type]
  return {
    id: `AUD-${state.caseId}-${String(state.auditEvents.length + 1).padStart(2, '0')}`,
    at: eventAt(dossier, action),
    actorRoleId: action.actor,
    action: action.type,
    label: meta.label,
    targetType: meta.targetType,
    targetId: targetIdFor(changedState, action.type),
    correlationId: targetIdFor(changedState, action.type),
    beforeStatus: getCaseStatus(state).label,
    afterStatus: getCaseStatus(changedState).label,
    reason: `${getCaseStatus(state).label} → ${getCaseStatus(changedState).label}`,
  }
}

function createIntegrationEvents(state, action, definitions) {
  const dossier = resolveCase(state.caseId)
  return definitions.map((definition, offset) => ({
    id: `INT-${state.caseId}-${String(state.integrationEvents.length + offset + 1).padStart(2, '0')}`,
    at: eventAt(dossier, action, offset + 1),
    type: definition.type,
    label: definition.label,
    system: definition.system,
    source: definition.source ?? definition.system,
    target: definition.target ?? 'VMLS',
    status: definition.status ?? 'Đã ghi nhận',
    targetId: definition.targetId,
    correlationId: definition.correlationId ?? dossier.notary.correlationId,
    route: definition.route ?? null,
  }))
}

function accept(state, action, records, integrationDefinitions = []) {
  const changedState = { ...state, records }
  const audit = createAuditEvent(state, changedState, action)
  const integrations = createIntegrationEvents(state, action, integrationDefinitions)
  return {
    ...changedState,
    auditEvents: [...state.auditEvents, audit],
    integrationEvents: [...state.integrationEvents, ...integrations],
    actionLog: [...state.actionLog, clone({
      type: action.type,
      actor: action.actor,
      payload: action.payload,
    })],
  }
}

export function journeyReducer(state, action) {
  if (!state || !action || ACTION_META[action.type]?.actorRoleId !== action.actor) return state
  const lifecycleActions = /** @type {string[]} */ (allowedActionsFor(state, action.actor))
  if (!lifecycleActions.includes(action.type)) return state
  if (!validPayload(state, action)) return state
  if (!chronologyAllows(state, action)) return state

  const dossier = resolveCase(state.caseId)
  const records = state.records
  const at = eventAt(dossier, action)

  switch (action.type) {
    case ACTIONS.REQUEST_SELLER_CONFIRMATION:
      return accept(state, action, {
        ...records,
        representation: {
          ...records.representation,
          status: 'Chờ xác nhận',
          scope: action.payload.scope,
          startsOn: action.payload.startsOn,
          expiresOn: action.payload.expiresOn,
          requestedAt: at,
          request: {
            propertyId: normalizeIdentity(action.payload.propertyId),
            scope: action.payload.scope,
            startsOn: action.payload.startsOn,
            expiresOn: action.payload.expiresOn,
            requestedAt: at,
          },
          confirmation: {
            id: dossier.representation.confirmationId,
            requestedAt: at,
            confirmedAt: null,
          },
        },
      }, [{
        type: 'representation_request_sent',
        label: 'Gửi thông tin xác nhận quyền đại diện',
        system: dossier.representation.confirmationChannel,
        source: 'VMLS',
        target: 'Người bán',
        targetId: dossier.representation.id,
        correlationId: dossier.representation.id,
      }])
    case ACTIONS.CONFIRM_REPRESENTATION: {
      const listing = {
        id: dossier.listing.id,
        propertyId: dossier.property.id,
        representationId: dossier.representation.id,
        transactionType: dossier.listing.transactionType,
        status: 'Đã khởi tạo',
        createdAt: at,
        askingPrice: clone(dossier.listing.askingPrice),
        distributionConsent: {
          status: 'Chưa ghi nhận',
          grantedChannelIds: [],
        },
        channels: [clone(dossier.listing.channel)],
      }
      return accept(state, action, {
        ...records,
        representation: {
          ...records.representation,
          status: 'Đã xác nhận',
          confirmedAt: at,
          confirmation: {
            ...records.representation.confirmation,
            confirmedAt: at,
          },
        },
        listing,
      }, [
        {
          type: 'representation_confirmation_received',
          label: 'Nhận xác nhận quyền đại diện',
          system: dossier.representation.confirmationChannel,
          source: dossier.representation.confirmationChannel,
          target: 'VMLS',
          targetId: dossier.representation.id,
          correlationId: dossier.representation.id,
        },
        {
          type: 'listing_created',
          label: 'Cấp PLID và khởi tạo tin bán',
          system: 'VMLS',
          source: 'VMLS',
          target: 'Tin bán',
          targetId: dossier.listing.id,
          correlationId: dossier.representation.id,
        },
      ])
    }
    case ACTIONS.RECORD_BUYER:
      return accept(state, action, {
        ...records,
        readiness: {
          ...records.readiness,
          status: 'Chờ người mua xác nhận',
          buyer: {
            ref: dossier.parties.buyer.reference,
            reference: dossier.parties.buyer.reference,
            displayName: dossier.parties.buyer.displayName,
            identityRef: dossier.parties.buyer.identityRef,
            agreedPrice: action.payload.agreedPrice,
            expectedSigningOn: action.payload.expectedSigningOn,
          },
          contractConfirmation: {
            agreement: clone(dossier.readiness.agreement),
            transactionType: dossier.listing.transactionType,
            property: {
              id: dossier.property.id,
              name: dossier.property.name,
              location: dossier.property.location,
            },
            buyer: {
              reference: dossier.parties.buyer.reference,
              displayName: dossier.parties.buyer.displayName,
              identityRef: dossier.parties.buyer.identityRef,
            },
            agreedPrice: action.payload.agreedPrice,
            expectedSigningOn: action.payload.expectedSigningOn,
          },
          agreedPrice: action.payload.agreedPrice,
          expectedSigningOn: action.payload.expectedSigningOn,
          financeSharing: {
            shareId: null,
            status: 'Chưa ghi nhận',
            purpose: null,
            visibleFields: [],
            scope: null,
            recordedAt: null,
          },
        },
      })
    case ACTIONS.VERIFY_READINESS:
      return accept(state, action, {
        ...records,
        readiness: {
          ...records.readiness,
          status: 'Đã sẵn sàng công chứng',
          checklist: clone(action.payload.checklist),
          verifiedAt: at,
          financeSharing: action.payload.bankConsent
            ? {
                shareId: dossier.readiness.financeSharing.shareId,
                status: 'Đã đồng ý',
                purpose: dossier.readiness.financeSharing.purpose,
                visibleFields: [...dossier.readiness.financeSharing.visibleFields],
                scope: dossier.readiness.financeSharing.visibleFields.join(' · '),
                recordedAt: at,
              }
            : {
                shareId: null,
                status: 'Chưa đồng ý',
                purpose: null,
                visibleFields: [],
                scope: null,
                recordedAt: at,
              },
        },
      })
    case ACTIONS.SUBMIT_NOTARY_DOSSIER:
      return accept(state, action, {
        ...records,
        notaryDossier: {
          ...records.notaryDossier,
          status: 'Đã tiếp nhận',
          submission: {
            ref: action.payload.submissionRef,
            reference: action.payload.submissionRef,
            receivedAt: at,
            documentIds: [...action.payload.documentIds],
          },
          documents: records.notaryDossier.documents.map((document) => ({
            ...document,
            status: 'Đã nhận',
          })),
        },
      }, [{
        type: 'notary_dossier_received',
        label: 'Hồ sơ công chứng đã được tiếp nhận',
        system: 'VPCC',
        source: 'VPCC',
        target: 'VMLS',
        targetId: dossier.notary.id,
      }])
    case ACTIONS.REQUEST_SUPPLEMENT:
      return accept(state, action, {
        ...records,
        notaryDossier: {
          ...records.notaryDossier,
          status: 'Yêu cầu bổ sung',
          supplement: {
            status: 'Chờ người bán',
            reasonCode: action.payload.reasonCode,
            documentType: action.payload.documentType,
            dueOn: action.payload.dueOn,
            requestedAt: at,
            ownerRoleId: 'seller',
            document: null,
            fileName: null,
          },
        },
      })
    case ACTIONS.PROVIDE_SUPPLEMENT:
      return accept(state, action, {
        ...records,
        notaryDossier: {
          ...records.notaryDossier,
          status: 'Đủ hồ sơ ký',
          supplement: {
            ...records.notaryDossier.supplement,
            status: 'Đã bổ sung',
            providedAt: at,
            fileName: action.payload.fileName,
            document: {
              id: action.payload.documentId,
              documentType: action.payload.documentType,
              fileName: action.payload.fileName,
            },
          },
        },
      })
    case ACTIONS.RECORD_NOTARY_SIGNING: {
      const transaction = {
        id: dossier.transaction.id,
        propertyId: dossier.property.id,
        listingId: dossier.listing.id,
        notaryDossierId: dossier.notary.id,
        status: 'Đã ký công chứng',
        createdAt: action.payload.signedAt,
        route: dossier.expectedRoute,
      }
      const routeLabel = dossier.expectedRoute === 'developer'
        ? 'Chủ đầu tư'
        : 'Văn phòng đăng ký đất đai'
      return accept(state, action, {
        ...records,
        notaryDossier: {
          ...records.notaryDossier,
          status: 'Đã ký công chứng',
          supplement: records.notaryDossier.supplement
            ? { ...records.notaryDossier.supplement, status: 'Đã xử lý' }
            : null,
          signedResult: {
            contractId: action.payload.contractId,
            signedAt: action.payload.signedAt,
          },
        },
        transaction,
        transfer: {
          ...records.transfer,
          route: dossier.expectedRoute,
          status: dossier.expectedRoute === 'developer'
            ? 'Chờ chủ đầu tư tiếp nhận'
            : 'Chờ đăng ký biến động',
        },
      }, [
        {
          type: 'notary_result_received',
          label: 'Nhận kết quả công chứng',
          system: 'VPCC',
          source: 'VPCC',
          target: 'VMLS',
          targetId: dossier.notary.id,
        },
        {
          type: 'transaction_created',
          label: 'Cấp PTID cho giao dịch',
          system: 'VMLS',
          source: 'VMLS',
          target: 'Giao dịch',
          targetId: dossier.transaction.id,
          correlationId: dossier.notary.correlationId,
        },
        {
          type: 'tax_obligation_recorded',
          label: 'Ghi nhận nghĩa vụ thuế',
          system: 'Thuế',
          source: 'VMLS',
          target: 'Thuế',
          targetId: dossier.transaction.id,
          correlationId: dossier.transaction.id,
        },
        {
          type: 'tax_payment_status_recorded',
          label: 'Ghi nhận trạng thái nghĩa vụ thuế',
          system: 'Thuế',
          source: 'Thuế',
          target: 'VMLS',
          targetId: dossier.transaction.id,
          correlationId: dossier.transaction.id,
        },
        {
          type: 'route_determined',
          label: `Chuyển hồ sơ tới ${routeLabel}`,
          system: 'VMLS',
          source: 'VMLS',
          target: routeLabel,
          targetId: dossier.transaction.id,
          correlationId: dossier.transaction.id,
          route: dossier.expectedRoute,
        },
      ])
    }
    case ACTIONS.APPROVE_LAND_REGISTRY:
      return accept(state, action, {
        ...records,
        property: { ...records.property, status: 'Đã sang tên' },
        transaction: { ...records.transaction, status: 'Đã sang tên' },
        transfer: {
          ...records.transfer,
          status: 'Đã sang tên',
          resultRef: action.payload.resultRef,
          resultAt: action.payload.approvedAt,
        },
      }, [{
        type: 'land_registry_result_received',
        label: 'Nhận kết quả đăng ký biến động',
        system: 'VPĐKĐĐ',
        source: 'VPĐKĐĐ',
        target: 'VMLS',
        targetId: dossier.transaction.id,
        correlationId: dossier.transaction.id,
        route: 'landRegistry',
      }])
    case ACTIONS.DEVELOPER_INTAKE:
      return accept(state, action, {
        ...records,
        transfer: {
          ...records.transfer,
          status: 'Chủ đầu tư đang xử lý',
          intakeRef: action.payload.intakeRef,
          intakeAt: action.payload.receivedAt,
          documentCount: action.payload.documentCount,
        },
      }, [{
        type: 'developer_dossier_received',
        label: 'Chủ đầu tư tiếp nhận hồ sơ',
        system: 'Chủ đầu tư',
        source: 'VMLS',
        target: 'Chủ đầu tư',
        targetId: dossier.transaction.id,
        correlationId: dossier.transaction.id,
        route: 'developer',
      }])
    case ACTIONS.DEVELOPER_CONFIRM_TRANSFER:
      return accept(state, action, {
        ...records,
        transaction: { ...records.transaction, status: 'Đã xác nhận chuyển nhượng' },
        transfer: {
          ...records.transfer,
          status: 'Chờ người mua nhận HĐMB',
          confirmationRef: action.payload.confirmationRef,
          confirmedAt: action.payload.confirmedAt,
          contractReference: dossier.transfer.contractReference,
        },
      }, [{
        type: 'developer_transfer_confirmed',
        label: 'Chủ đầu tư xác nhận chuyển nhượng',
        system: 'Chủ đầu tư',
        source: 'Chủ đầu tư',
        target: 'VMLS',
        targetId: dossier.transaction.id,
        correlationId: dossier.transaction.id,
        route: 'developer',
      }])
    case ACTIONS.BUYER_RECEIVE_CONTRACT:
      return accept(state, action, {
        ...records,
        property: { ...records.property, status: 'Đã cập nhật bên mua HĐMB' },
        transaction: { ...records.transaction, status: 'Đã nhận HĐMB mới' },
        transfer: {
          ...records.transfer,
          status: 'Đã bàn giao HĐMB mới',
          resultRef: dossier.transfer.resultRef,
          receiptRef: action.payload.receiptRef,
          receivedAt: action.payload.receivedAt,
        },
      }, [{
        type: 'contract_receipt_recorded',
        label: 'Ghi nhận người mua đã nhận HĐMB mới',
        system: 'VMLS',
        source: 'Người mua',
        target: 'VMLS',
        targetId: dossier.transaction.id,
        correlationId: dossier.transaction.id,
        route: 'developer',
      }])
    default:
      return state
  }
}

export function getCaseStatus(state) {
  const { representation, listing, readiness, notaryDossier, transaction, transfer } = state.records

  if (transfer.status === 'Đã sang tên' || transfer.status === 'Đã bàn giao HĐMB mới') {
    return { code: 'transfer_complete', label: 'Hoàn tất chuyển quyền', tone: 'success' }
  }
  if (transfer.status === 'Chờ người mua nhận HĐMB') {
    return { code: 'contract_receipt_pending', label: 'Chờ nhận HĐMB mới', tone: 'warning' }
  }
  if (transfer.status === 'Chủ đầu tư đang xử lý') {
    return { code: 'developer_processing', label: 'Chủ đầu tư đang xử lý', tone: 'info' }
  }
  if (transfer.status === 'Chờ chủ đầu tư tiếp nhận') {
    return { code: 'developer_intake_pending', label: 'Chờ chủ đầu tư tiếp nhận', tone: 'warning' }
  }
  if (transfer.status === 'Chờ đăng ký biến động') {
    return { code: 'land_registry_pending', label: 'Chờ đăng ký biến động', tone: 'warning' }
  }
  if (transaction) return { code: 'transaction_created', label: 'Đã tạo giao dịch', tone: 'info' }
  if (notaryDossier.status === 'Đã ký công chứng') {
    return { code: 'notary_signed', label: 'Đã ký công chứng', tone: 'success' }
  }
  if (notaryDossier.status === 'Yêu cầu bổ sung') {
    return { code: 'supplement_required', label: 'Cần bổ sung hồ sơ', tone: 'danger' }
  }
  if (notaryDossier.status === 'Đủ hồ sơ ký') {
    return { code: 'notary_ready_to_sign', label: 'Đủ hồ sơ ký', tone: 'success' }
  }
  if (notaryDossier.status === 'Đã tiếp nhận') {
    return { code: 'notary_received', label: 'VPCC đã tiếp nhận', tone: 'info' }
  }
  if (readiness.status === 'Đã sẵn sàng công chứng') {
    return { code: 'notary_submission_pending', label: 'Sẵn sàng công chứng', tone: 'success' }
  }
  if (readiness.buyer) {
    return { code: 'buyer_confirmation_pending', label: 'Chờ người mua xác nhận', tone: 'warning' }
  }
  if (listing) return { code: 'listing_created', label: 'Tin bán đã khởi tạo', tone: 'info' }
  if (representation.status === 'Chờ xác nhận') {
    return { code: 'seller_confirmation_pending', label: 'Chờ người bán xác nhận', tone: 'warning' }
  }
  return {
    code: 'representation_request_pending',
    label: 'Chờ gửi thông tin đến Người bán',
    tone: 'neutral',
  }
}

export function getNextWorkItem(state) {
  for (const role of roles) {
    const action = allowedActionsFor(state, role.id)[0]
    if (!action) continue
    const dossier = resolveCase(state.caseId)
    return {
      id: `TASK-${state.caseId}-${action}`,
      caseId: state.caseId,
      roleId: role.id,
      ownerLabel: role.label,
      action,
      label: ACTION_META[action].label,
      dueAt: state.records.notaryDossier.supplement?.dueOn ?? dossier.slaDueAt,
      priority: dossier.priority,
    }
  }
  return null
}

const publicString = (value) => typeof value === 'string' ? value : null

function getPublicLifecycle(state) {
  const { representation, listing, readiness, notaryDossier, transaction, transfer } = state.records
  const dueAt = getDemoCase(state.caseId)?.slaDueAt ?? null

  if (transfer.status === 'Đã sang tên' || transfer.status === 'Đã bàn giao HĐMB mới') {
    return {
      status: { code: 'transfer_complete', label: 'Hoàn tất chuyển quyền', tone: 'success' },
      nextWork: null,
    }
  }
  if (transfer.status === 'Chờ người mua nhận HĐMB') {
    return {
      status: { code: 'contract_delivery_pending', label: 'Chờ bàn giao HĐMB mới', tone: 'warning' },
      nextWork: { label: 'Bàn giao HĐMB mới', ownerLabel: 'Các bên giao dịch', dueAt },
    }
  }
  if (transfer.status === 'Chủ đầu tư đang xử lý') {
    return {
      status: { code: 'developer_processing', label: 'Đang xử lý chuyển nhượng', tone: 'info' },
      nextWork: { label: 'Xác nhận chuyển nhượng', ownerLabel: 'Chủ đầu tư', dueAt },
    }
  }
  if (transfer.status === 'Chờ chủ đầu tư tiếp nhận') {
    return {
      status: { code: 'developer_intake_pending', label: 'Chờ tiếp nhận chuyển nhượng', tone: 'warning' },
      nextWork: { label: 'Tiếp nhận hồ sơ chuyển nhượng', ownerLabel: 'Chủ đầu tư', dueAt },
    }
  }
  if (transfer.status === 'Chờ đăng ký biến động') {
    return {
      status: { code: 'land_registry_pending', label: 'Chờ đăng ký biến động', tone: 'warning' },
      nextWork: { label: 'Đăng ký biến động', ownerLabel: 'Văn phòng đăng ký đất đai', dueAt },
    }
  }
  if (transaction) {
    return {
      status: { code: 'transaction_created', label: 'Đã tạo giao dịch', tone: 'info' },
      nextWork: { label: 'Xử lý chuyển quyền', ownerLabel: 'Đơn vị tiếp nhận', dueAt },
    }
  }
  if (notaryDossier.status !== 'Chưa nộp') {
    return {
      status: { code: 'notary_processing', label: 'Đang xử lý công chứng', tone: 'info' },
      nextWork: { label: 'Hoàn tất công chứng', ownerLabel: 'Văn phòng công chứng', dueAt },
    }
  }
  if (readiness.status === 'Đã sẵn sàng công chứng') {
    return {
      status: { code: 'notary_submission_pending', label: 'Sẵn sàng công chứng', tone: 'success' },
      nextWork: { label: 'Tiếp nhận hồ sơ công chứng', ownerLabel: 'Văn phòng công chứng', dueAt },
    }
  }
  if (readiness.buyer) {
    return {
      status: { code: 'transaction_readiness', label: 'Đang chuẩn bị công chứng', tone: 'warning' },
      nextWork: { label: 'Hoàn tất điều kiện công chứng', ownerLabel: 'Các bên giao dịch', dueAt },
    }
  }
  if (listing) {
    return {
      status: { code: 'listing_created', label: 'Tin bán đã khởi tạo', tone: 'info' },
      nextWork: { label: 'Ghi nhận người mua', ownerLabel: 'Đơn vị môi giới', dueAt },
    }
  }
  if (representation.status === 'Chờ xác nhận') {
    return {
      status: { code: 'representation_pending', label: 'Đang thiết lập quyền đại diện', tone: 'warning' },
      nextWork: { label: 'Hoàn tất quyền đại diện', ownerLabel: 'Các bên đại diện', dueAt },
    }
  }
  return {
    status: {
      code: 'representation_request_pending',
      label: 'Chờ gửi thông tin đến Người bán',
      tone: 'neutral',
    },
    nextWork: {
      label: 'Gửi thông tin đến Người bán',
      ownerLabel: 'Đơn vị môi giới',
      dueAt,
    },
  }
}

function latestPublicMaterialTime(records) {
  const candidates = [
    records.representation?.requestedAt,
    records.listing?.createdAt,
    records.transaction?.createdAt,
    records.transfer?.intakeAt,
    records.transfer?.confirmedAt,
    records.transfer?.resultAt,
    records.transfer?.receivedAt,
  ]
    .filter((value) => typeof value === 'string' && Number.isFinite(Date.parse(value)))

  if (!candidates.length) return null
  return candidates.reduce((latest, value) => (
    Date.parse(value) > Date.parse(latest) ? value : latest
  ))
}

/**
 * Return the deliberately small, public-safe projection used by the landing page.
 *
 * This is an allowlist, not a clone-and-delete sanitizer. In particular, it never
 * exposes dossier, party, representation, readiness, notary, document, finance,
 * audit, integration, command, reference or correlation data from the operational
 * state. New operational fields therefore stay private unless explicitly added
 * here and covered by the projection contract tests.
 */
export function projectStateForPublic(state) {
  const dossier = getDemoCase(state?.caseId)
  const records = state?.records
  if (!dossier || !records?.property || !records?.transfer) return null

  const publicLifecycle = getPublicLifecycle(state)

  return {
    caseId: dossier.id,
    title: dossier.title,
    property: {
      id: publicString(records.property.id),
      status: publicString(records.property.status),
      name: publicString(records.property.name),
      type: publicString(records.property.type),
      project: publicString(records.property.project),
      unit: publicString(records.property.unit),
      parcelRef: publicString(records.property.parcelRef),
      location: publicString(records.property.location),
    },
    listing: records.listing
      ? {
          id: publicString(records.listing.id),
          status: publicString(records.listing.status),
        }
      : null,
    transaction: records.transaction
      ? {
          id: publicString(records.transaction.id),
          status: publicString(records.transaction.status),
        }
      : null,
    transfer: {
      route: publicString(records.transfer.route),
      basis: publicString(records.transfer.basis),
      status: publicString(records.transfer.status),
    },
    status: {
      code: publicString(publicLifecycle.status.code),
      label: publicString(publicLifecycle.status.label),
      tone: publicString(publicLifecycle.status.tone),
    },
    nextWork: publicLifecycle.nextWork
      ? {
          label: publicString(publicLifecycle.nextWork.label),
          ownerLabel: publicString(publicLifecycle.nextWork.ownerLabel),
          dueAt: publicString(publicLifecycle.nextWork.dueAt),
        }
      : null,
    latestMaterialAt: latestPublicMaterialTime(records),
  }
}

function isVisibleToRole(state, roleId) {
  if (!roleIds.has(roleId)) return false
  if (['agent', 'brokerage', 'vmls'].includes(roleId)) return true
  if (roleId === 'seller') return state.records.representation.status !== 'Chưa gửi'
  if (roleId === 'buyer') return Boolean(state.records.readiness.buyer)
  if (roleId === 'bank') return state.records.readiness.financeSharing.status === 'Đã đồng ý'
  if (roleId === 'notary') {
    return state.records.readiness.status === 'Đã sẵn sàng công chứng'
      || state.records.notaryDossier.status !== 'Chưa nộp'
  }
  if (roleId === 'developer') return state.records.transfer.route === 'developer'
  if (roleId === 'landRegistry') return state.records.transfer.route === 'landRegistry'
  return false
}

function normalizeStates(input) {
  if (Array.isArray(input)) return input
  if (input?.caseId) return [input]
  if (input && typeof input === 'object') return Object.values(input).filter((value) => value?.caseId)
  return []
}

export function deriveWorkItems(caseStatesOrState, roleId) {
  if (!roleIds.has(roleId)) return []

  return normalizeStates(caseStatesOrState)
    .map((state) => {
      const projected = /** @type {any} */ (projectStateForRole(state, roleId))
      if (!projected) return null

      if (roleId === 'bank') {
        return {
          id: `WORK-bank-${projected.shareId}`,
          shareId: projected.shareId,
          roleId,
          propertyType: projected.records.property.type,
          agreedPrice: projected.records.readiness.agreedPrice,
          status: projected.records.readiness.status,
          statusCode: 'readiness',
          financePurpose: projected.records.readiness.financeSharing.purpose,
          visibleFields: [...projected.records.readiness.financeSharing.visibleFields],
          actionable: false,
        }
      }

      const records = projected.records
      const status = projected.status
      const next = projected.nextWorkItem
      return {
        id: `WORK-${roleId}-${state.caseId}`,
        caseId: projected.caseId,
        dossierId: projected.dossierId ?? null,
        title: projected.title ?? records.property?.name ?? records.property?.type ?? null,
        propertyId: records.property?.id ?? null,
        listingId: records.listing?.id ?? null,
        transactionId: records.transaction?.id ?? null,
        status: status.label,
        statusCode: status.code,
        statusTone: status.tone,
        priority: projected.priority ?? null,
        slaDueAt: next?.dueAt ?? projected.slaDueAt ?? null,
        route: records.transfer?.route ?? null,
        ownerRoleId: next?.roleId ?? null,
        ownerLabel: next?.ownerLabel ?? '—',
        nextAction: next?.action ?? null,
        nextActionLabel: next?.label ?? 'Không có việc đang chờ',
        actionable: next?.roleId === roleId,
      }
    })
    .filter(Boolean)
}

function searchable(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi')
}

export function filterWorkItems(items, filters = {}) {
  if (!Array.isArray(items)) return []
  const query = searchable(filters.query).trim()
  return items.filter((item) => {
    const haystack = searchable([
      item.dossierId,
      item.title,
      item.propertyId,
      item.listingId,
      item.transactionId,
      item.propertyType,
      item.agreedPrice,
      item.status,
    ].join(' '))
    return (!query || haystack.includes(query))
      && (!filters.status || item.statusCode === filters.status || item.status === filters.status)
      && (!filters.ownerRoleId || item.ownerRoleId === filters.ownerRoleId)
      && (!filters.route || item.route === filters.route)
      && (!filters.priority || item.priority === filters.priority)
      && (typeof filters.actionable !== 'boolean' || item.actionable === filters.actionable)
  })
}

function commonProjection(state, roleId) {
  const dossier = resolveCase(state.caseId)
  return {
    caseId: state.caseId,
    dossierId: dossier.dossierId,
    roleId,
    title: dossier.title,
    priority: dossier.priority,
    slaDueAt: dossier.slaDueAt,
    status: getCaseStatus(state),
    nextWorkItem: getNextWorkItem(state),
    allowedActions: allowedActionsFor(state, roleId),
  }
}

function sellerAuditProjection(events) {
  return events
    .filter((event) => SELLER_AUDIT_ACTIONS.has(event.action))
    .map((event) => ({
      id: event.id,
      at: event.at,
      actorRoleId: event.actorRoleId,
      action: event.action,
      label: event.label,
      beforeStatus: event.beforeStatus,
      afterStatus: event.afterStatus,
      reason: event.reason,
    }))
}

export function projectStateForRole(state, roleId) {
  if (!state || !isVisibleToRole(state, roleId)) return null
  const common = commonProjection(state, roleId)
  const records = state.records

  if (roleId === 'bank') {
    return {
      shareId: records.readiness.financeSharing.shareId,
      roleId,
      allowedActions: common.allowedActions,
      records: {
        property: { type: records.property.type },
        readiness: {
          status: records.readiness.status,
          agreedPrice: records.readiness.agreedPrice,
          financeSharing: clone(records.readiness.financeSharing),
        },
      },
    }
  }

  if (roleId === 'brokerage') {
    return {
      ...common,
      records: {
        property: {
          id: records.property.id,
          type: records.property.type,
          location: records.property.location,
          status: records.property.status,
        },
        representation: clone(records.representation),
        listing: clone(records.listing),
        readiness: { status: records.readiness.status },
        notaryDossier: {
          id: records.notaryDossier.id,
          status: records.notaryDossier.status,
          supplement: clone(records.notaryDossier.supplement),
        },
        transaction: clone(records.transaction),
        transfer: clone(records.transfer),
      },
      parties: {
        seller: clone(state.parties.seller),
        agent: clone(state.parties.agent),
      },
    }
  }

  if (roleId === 'seller') {
    return {
      ...common,
      records: {
        property: clone(records.property),
        representation: clone(records.representation),
        listing: clone(records.listing),
        readiness: { status: records.readiness.status },
        notaryDossier: {
          id: records.notaryDossier.id,
          status: records.notaryDossier.status,
          supplement: clone(records.notaryDossier.supplement),
        },
        transaction: clone(records.transaction),
        transfer: clone(records.transfer),
      },
      parties: {
        seller: clone(state.parties.seller),
        agent: clone(state.parties.agent),
      },
      auditEvents: sellerAuditProjection(state.auditEvents),
    }
  }

  if (roleId === 'buyer') {
    return {
      ...common,
      records: {
        property: {
          id: records.property.id,
          name: records.property.name,
          type: records.property.type,
          location: records.property.location,
          areas: clone(records.property.areas),
        },
        listing: clone(records.listing),
        readiness: clone(records.readiness),
        notaryDossier: {
          id: records.notaryDossier.id,
          office: records.notaryDossier.office,
          status: records.notaryDossier.status,
          signedResult: clone(records.notaryDossier.signedResult),
        },
        transaction: clone(records.transaction),
        transfer: clone(records.transfer),
      },
      parties: { buyer: clone(state.parties.buyer) },
    }
  }

  if (roleId === 'notary') {
    return {
      ...common,
      records: {
        property: {
          id: records.property.id,
          name: records.property.name,
          type: records.property.type,
          location: records.property.location,
        },
        representation: clone(records.representation),
        listing: records.listing ? { id: records.listing.id } : null,
        readiness: {
          status: records.readiness.status,
          buyer: records.readiness.buyer
            ? {
                reference: records.readiness.buyer.reference,
                displayName: records.readiness.buyer.displayName,
              }
            : null,
          agreedPrice: records.readiness.agreedPrice,
          expectedSigningOn: records.readiness.expectedSigningOn,
          contractConfirmation: clone(records.readiness.contractConfirmation),
          checklist: clone(records.readiness.checklist),
        },
        notaryDossier: clone(records.notaryDossier),
        transaction: clone(records.transaction),
      },
      parties: {
        seller: clone(state.parties.seller),
        agent: clone(state.parties.agent),
        buyer: clone(state.parties.buyer),
      },
    }
  }

  if (roleId === 'developer') {
    return {
      ...common,
      records: {
        property: {
          id: records.property.id,
          project: records.property.project,
          unit: records.property.unit,
          areas: clone(records.property.areas),
        },
        listing: records.listing ? { id: records.listing.id } : null,
        notaryDossier: {
          id: records.notaryDossier.id,
          status: records.notaryDossier.status,
          signedResult: clone(records.notaryDossier.signedResult),
        },
        transaction: clone(records.transaction),
        transfer: clone(records.transfer),
      },
      parties: { buyer: clone(state.parties.buyer) },
    }
  }

  if (roleId === 'landRegistry') {
    return {
      ...common,
      records: {
        property: {
          id: records.property.id,
          location: records.property.location,
          areas: clone(records.property.areas),
        },
        notaryDossier: {
          id: records.notaryDossier.id,
          status: records.notaryDossier.status,
          signedResult: clone(records.notaryDossier.signedResult),
        },
        transaction: clone(records.transaction),
        transfer: clone(records.transfer),
      },
      parties: { buyer: clone(state.parties.buyer) },
    }
  }

  return {
    ...common,
    records: clone(records),
    parties: clone(state.parties),
    auditEvents: clone(state.auditEvents),
    integrationEvents: roleId === 'vmls' ? clone(state.integrationEvents) : [],
  }
}

export function serializeDemoState(state) {
  return JSON.stringify({
    version: 3,
    caseId: state.caseId,
    actions: clone(state.actionLog),
  })
}

export function restoreDemoState(serialized, expectedCaseId) {
  const expectedCase = getDemoCase(expectedCaseId)
  const fallback = () => createInitialState(expectedCase?.id ?? demoCases[0]?.id)
  if (typeof serialized !== 'string') return fallback()

  try {
    const parsed = JSON.parse(serialized)
    const storedCase = getDemoCase(parsed?.caseId)
    if (parsed?.version !== 3 || !storedCase || !Array.isArray(parsed.actions)
      || parsed.actions.length > 20 || (expectedCase && expectedCase.id !== storedCase.id)) {
      return fallback()
    }

    let state = createInitialState(storedCase.id)
    for (const action of parsed.actions) {
      if (!isPlainObject(action) || !isPlainObject(action.payload)) return fallback()
      const next = journeyReducer(state, action)
      if (next === state) return fallback()
      state = next
    }
    return state
  } catch {
    return fallback()
  }
}
