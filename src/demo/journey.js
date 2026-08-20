// @ts-check

import {
  DEMO_VERSION,
  demoCases,
  externalMonitoringFixtures,
  getDemoCase,
  roles,
} from './demoData.js'
import {
  EXTERNAL_SOURCES,
  EXTERNAL_STATUSES,
  applyExternalStatusEvent,
  createExternalProcessingCase,
} from './externalProgress.js'

export const ACTIONS = Object.freeze({
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
  [ACTIONS.DECLARE_BUYER]: {
    actorRoleId: 'brokerage',
    label: 'Khai báo Người mua',
    targetType: 'readiness',
  },
  [ACTIONS.VERIFY_READINESS]: {
    actorRoleId: 'buyer',
    label: 'Xác nhận sẵn sàng công chứng',
    targetType: 'readiness',
  },
  [ACTIONS.HANDOFF_NOTARY_DOSSIER]: {
    actorRoleId: 'brokerage',
    label: 'Chuyển hồ sơ công chứng',
    targetType: 'notaryDossier',
  },
  [ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF]: {
    actorRoleId: 'seller',
    label: 'Chuyển tài liệu bổ sung',
    targetType: 'notaryDossier',
  },
  [ACTIONS.RECEIVE_EXTERNAL_EVENT]: {
    actorRoleId: 'vmls',
    label: 'Nhận cập nhật',
    targetType: 'externalProcessing',
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

const SAFE_357_CLAIM_FIELDS = new Set([
  'propertyType',
  'project',
  'developer',
  'location',
  'building',
  'unit',
  'area',
])

function buyerSourceRecord357Projection(sourceRecord) {
  if (!sourceRecord || typeof sourceRecord !== 'object') return null
  return {
    sourceId: publicString(sourceRecord.sourceId),
    sourceName: publicString(sourceRecord.sourceName),
    sourceRecordId: publicString(sourceRecord.sourceRecordId),
    version: publicString(sourceRecord.version),
    npid: publicString(sourceRecord.npid),
    publicationStatus: publicString(sourceRecord.publicationStatus),
    sourceUpdatedAt: publicString(sourceRecord.sourceUpdatedAt),
    receivedAt: publicString(sourceRecord.receivedAt),
    claims: Array.isArray(sourceRecord.claims)
      ? sourceRecord.claims
          .filter((claim) => claim && SAFE_357_CLAIM_FIELDS.has(claim.field))
          .map((claim) => ({
            field: publicString(claim.field),
            label: publicString(claim.label),
            value: publicString(claim.value),
          }))
      : [],
  }
}

const SELLER_AUDIT_ACTIONS = new Set([
  ACTIONS.REQUEST_SELLER_CONFIRMATION,
  ACTIONS.CONFIRM_REPRESENTATION,
  ACTIONS.VERIFY_READINESS,
  ACTIONS.HANDOFF_NOTARY_DOSSIER,
  ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF,
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

const externalSourceIds = Object.values(EXTERNAL_SOURCES)

function nextExternalEventFor(state, source) {
  const dossier = getDemoCase(state?.caseId)
  const externalCase = state?.records?.externalProcessing?.[source]
  const configuration = dossier?.externalProcessing?.[source]
  if (!dossier || !externalCase || !configuration) return null

  const event = configuration.events[externalCase.lastSequence] ?? null
  if (event?.effect?.type === 'supplement_received'
    && state.records.notaryDossier.supplement?.status !== 'Đã chuyển VPCC') {
    return null
  }
  return event
}

export function createInitialState(caseId = demoCases[0]?.id) {
  const dossier = resolveCase(caseId)

  return {
    version: 4,
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
      externalProcessing: {
        notary: null,
        tax: null,
        landRegistry: null,
      },
    },
    parties: clone(dossier.parties),
    auditEvents: [],
    integrationEvents: [],
    externalEvents: [],
    actionLog: [],
  }
}

export function allowedActionsFor(state, roleId) {
  if (!state?.records || !roleIds.has(roleId)) return []

  const dossier = getDemoCase(state.caseId)
  if (!dossier) return []

  const { property, representation, listing, readiness, notaryDossier, transfer } = state.records

  if (roleId === 'agent') {
    if (property.status === 'Đã định danh' && representation.status === 'Chưa gửi') {
      return [ACTIONS.REQUEST_SELLER_CONFIRMATION]
    }
    return []
  }

  if (roleId === 'brokerage') {
    if (listing && !readiness.buyer) return [ACTIONS.DECLARE_BUYER]
    if (readiness.status === 'Đã sẵn sàng công chứng'
      && notaryDossier.status === 'Chưa nộp') {
      return [ACTIONS.HANDOFF_NOTARY_DOSSIER]
    }
    return []
  }

  if (roleId === 'seller') {
    if (representation.status === 'Chờ xác nhận') return [ACTIONS.CONFIRM_REPRESENTATION]
    if (notaryDossier.supplement?.status === 'Chờ người bán') {
      return [ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF]
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

  if (['notary', 'landRegistry', 'tax'].includes(roleId)) return []

  if (roleId === 'vmls') {
    return externalSourceIds.some((source) => nextExternalEventFor(state, source))
      ? [ACTIONS.RECEIVE_EXTERNAL_EVENT]
      : []
  }

  if (roleId === 'developer') {
    if (transfer.route !== 'developer') return []
    if (transfer.status === 'Chờ chủ đầu tư tiếp nhận') return [ACTIONS.DEVELOPER_INTAKE]
    if (transfer.status === 'Chủ đầu tư đang xử lý') return [ACTIONS.DEVELOPER_CONFIRM_TRANSFER]
    return []
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
  [ACTIONS.DECLARE_BUYER]: ['buyerRef', 'agreedPrice', 'expectedSigningOn'],
  [ACTIONS.VERIFY_READINESS]: ['confirmed', 'bankConsent', 'checklist'],
  [ACTIONS.HANDOFF_NOTARY_DOSSIER]: ['submissionRef', 'documentIds'],
  [ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF]: ['documentId', 'documentType', 'fileName'],
  [ACTIONS.RECEIVE_EXTERNAL_EVENT]: ['caseId', 'source'],
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
    case ACTIONS.DECLARE_BUYER:
      return payload.buyerRef === dossier.parties.buyer.reference
        && Number.isInteger(payload.agreedPrice) && payload.agreedPrice > 0
        && isAugustDate(payload.expectedSigningOn)
        && isDateOnOrAfter(payload.expectedSigningOn, dossier.actionTimes.declare_buyer)
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
    case ACTIONS.HANDOFF_NOTARY_DOSSIER:
      return hasReference(payload.submissionRef)
        && sameMembers(payload.documentIds, dossier.notary.requiredDocumentIds)
    case ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF:
      return hasReference(payload.documentId)
        && payload.documentType === dossier.notary.supplement?.documentType
        && typeof payload.fileName === 'string'
        && /^[^/\\]+\.pdf$/i.test(payload.fileName)
    case ACTIONS.RECEIVE_EXTERNAL_EVENT:
      return payload.caseId === state.caseId
        && externalSourceIds.includes(payload.source)
        && Boolean(nextExternalEventFor(state, payload.source))
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
  if ([ACTIONS.DECLARE_BUYER, ACTIONS.VERIFY_READINESS].includes(actionType)) {
    return state.records.readiness.id
  }
  if ([
    ACTIONS.HANDOFF_NOTARY_DOSSIER,
    ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF,
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

function createIntegrationEventsAt(state, at, definitions) {
  const dossier = resolveCase(state.caseId)
  return definitions.map((definition, offset) => ({
    id: `INT-${state.caseId}-${String(state.integrationEvents.length + offset + 1).padStart(2, '0')}`,
    at: new Date(Date.parse(at) + (offset + 1) * 1000).toISOString(),
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

function createIntegrationEvents(state, action, definitions) {
  const dossier = resolveCase(state.caseId)
  return createIntegrationEventsAt(state, eventAt(dossier, action), definitions)
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

function acceptExternal(state, action, records, event, integrationDefinitions = []) {
  return {
    ...state,
    records,
    integrationEvents: [
      ...state.integrationEvents,
      ...createIntegrationEventsAt(state, event.receivedAt, integrationDefinitions),
    ],
    externalEvents: [...state.externalEvents, clone(event)],
    actionLog: [...state.actionLog, clone({
      type: action.type,
      actor: action.actor,
      payload: action.payload,
    })],
  }
}

export function journeyReducer(state, action) {
  if (!state || !isPlainObject(action) || !hasExactKeys(action, ['type', 'actor', 'payload'])
    || ACTION_META[action.type]?.actorRoleId !== action.actor) return state
  const lifecycleActions = /** @type {string[]} */ (allowedActionsFor(state, action.actor))
  if (!lifecycleActions.includes(action.type)) return state
  if (!validPayload(state, action)) return state
  if (action.type !== ACTIONS.RECEIVE_EXTERNAL_EVENT && !chronologyAllows(state, action)) return state

  const dossier = resolveCase(state.caseId)
  const records = state.records
  const at = action.type === ACTIONS.RECEIVE_EXTERNAL_EVENT
    ? nextExternalEventFor(state, action.payload.source)?.receivedAt
    : eventAt(dossier, action)

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
    case ACTIONS.DECLARE_BUYER:
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
    case ACTIONS.HANDOFF_NOTARY_DOSSIER:
      return accept(state, action, {
        ...records,
        notaryDossier: {
          ...records.notaryDossier,
          status: 'Đã chuyển VPCC',
          submission: {
            ref: action.payload.submissionRef,
            reference: action.payload.submissionRef,
            handedOffAt: at,
            documentIds: [...action.payload.documentIds],
          },
          documents: records.notaryDossier.documents.map((document) => ({
            ...document,
            status: 'Đã chuyển',
          })),
        },
        externalProcessing: {
          ...records.externalProcessing,
          notary: createExternalProcessingCase({
            source: dossier.externalProcessing.notary.source,
            sourceCaseId: dossier.externalProcessing.notary.sourceCaseId,
            processingOrganization: dossier.externalProcessing.notary.processingOrganization,
            createdAt: at,
          }),
        },
      }, [{
        type: 'notary_dossier_handed_off',
        label: 'Chuyển hồ sơ công chứng',
        system: 'VPCC',
        source: 'VMLS',
        target: 'VPCC',
        targetId: dossier.notary.id,
      }])
    case ACTIONS.SUBMIT_SUPPLEMENT_HANDOFF:
      return accept(state, action, {
        ...records,
        notaryDossier: {
          ...records.notaryDossier,
          status: 'Đã chuyển bổ sung',
          supplement: {
            ...records.notaryDossier.supplement,
            status: 'Đã chuyển VPCC',
            handedOffAt: at,
            fileName: action.payload.fileName,
            document: {
              id: action.payload.documentId,
              documentType: action.payload.documentType,
              fileName: action.payload.fileName,
            },
          },
        },
      }, [{
        type: 'notary_supplement_handed_off',
        label: 'Chuyển tài liệu bổ sung',
        system: 'VPCC',
        source: 'VMLS',
        target: 'VPCC',
        targetId: dossier.notary.id,
      }])
    case ACTIONS.RECEIVE_EXTERNAL_EVENT: {
      const source = action.payload.source
      const event = nextExternalEventFor(state, source)
      const externalCase = records.externalProcessing[source]
      if (!event || !externalCase) return state

      const updatedExternalCase = applyExternalStatusEvent(externalCase, event)
      if (updatedExternalCase === externalCase) return state

      let nextRecords = {
        ...records,
        externalProcessing: {
          ...records.externalProcessing,
          [source]: updatedExternalCase,
        },
      }
      let integrationDefinitions = []

      if (source === EXTERNAL_SOURCES.NOTARY) {
        nextRecords = {
          ...nextRecords,
          notaryDossier: {
            ...records.notaryDossier,
            status: event.status,
          },
        }

        if (event.effect?.type === 'supplement_required') {
          nextRecords = {
            ...nextRecords,
            notaryDossier: {
              ...nextRecords.notaryDossier,
              supplement: {
                status: 'Chờ người bán',
                reasonCode: event.effect.reasonCode,
                documentType: event.effect.documentType,
                dueOn: event.effect.dueOn,
                requestedAt: event.sourceUpdatedAt,
                ownerRoleId: 'seller',
                document: null,
                fileName: null,
              },
            },
          }
        }

        if (event.effect?.type === 'supplement_received') {
          nextRecords = {
            ...nextRecords,
            notaryDossier: {
              ...nextRecords.notaryDossier,
              supplement: {
                ...nextRecords.notaryDossier.supplement,
                status: 'Đã tiếp nhận',
                receivedAt: event.sourceUpdatedAt,
              },
            },
          }
        }

        if (event.effect?.type === 'notary_completed') {
          const transaction = {
            id: dossier.transaction.id,
            propertyId: dossier.property.id,
            listingId: dossier.listing.id,
            notaryDossierId: dossier.notary.id,
            status: 'Đã ký công chứng',
            createdAt: event.effect.signedAt,
            route: dossier.expectedRoute,
          }
          const taxConfiguration = dossier.externalProcessing.tax
          const landConfiguration = dossier.externalProcessing.landRegistry
          const routeLabel = dossier.expectedRoute === 'developer'
            ? 'Chủ đầu tư'
            : 'Văn phòng đăng ký đất đai'

          nextRecords = {
            ...nextRecords,
            notaryDossier: {
              ...nextRecords.notaryDossier,
              status: 'Đã ký công chứng',
              supplement: nextRecords.notaryDossier.supplement
                ? { ...nextRecords.notaryDossier.supplement, status: 'Đã xử lý' }
                : null,
              signedResult: {
                contractId: event.effect.contractId,
                signedAt: event.effect.signedAt,
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
            externalProcessing: {
              ...nextRecords.externalProcessing,
              tax: createExternalProcessingCase({
                source: taxConfiguration.source,
                sourceCaseId: taxConfiguration.sourceCaseId,
                processingOrganization: taxConfiguration.processingOrganization,
                createdAt: event.receivedAt,
              }),
              landRegistry: landConfiguration
                ? createExternalProcessingCase({
                    source: landConfiguration.source,
                    sourceCaseId: landConfiguration.sourceCaseId,
                    processingOrganization: landConfiguration.processingOrganization,
                    createdAt: event.receivedAt,
                  })
                : null,
            },
          }
          integrationDefinitions = [
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
              type: 'tax_dossier_handed_off',
              label: 'Chuyển hồ sơ nghĩa vụ tài chính',
              system: 'Thuế',
              source: 'VMLS',
              target: 'Cơ quan thuế',
              targetId: taxConfiguration.sourceCaseId,
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
          ]
          if (landConfiguration) {
            integrationDefinitions.push({
              type: 'land_registry_dossier_handed_off',
              label: 'Chuyển hồ sơ đăng ký biến động',
              system: 'VPĐKĐĐ',
              source: 'VMLS',
              target: 'VPĐKĐĐ',
              targetId: landConfiguration.sourceCaseId,
              correlationId: dossier.transaction.id,
              route: 'landRegistry',
            })
          }
        }
      }

      if (source === EXTERNAL_SOURCES.LAND_REGISTRY
        && event.effect?.type === 'land_registry_completed') {
        nextRecords = {
          ...nextRecords,
          property: { ...records.property, status: 'Đã sang tên' },
          transaction: { ...records.transaction, status: 'Đã sang tên' },
          transfer: {
            ...records.transfer,
            status: 'Đã sang tên',
            resultRef: event.effect.resultRef,
            resultAt: event.effect.approvedAt,
          },
        }
      }

      return acceptExternal(state, action, nextRecords, {
        ...event,
        processingOrganization: updatedExternalCase.processingOrganization,
      }, integrationDefinitions)
    }
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
  if (['Đã chuyển VPCC', 'Đang xử lý', 'Đã chuyển bổ sung'].includes(notaryDossier.status)) {
    return { code: 'notary_processing', label: 'Đang xử lý công chứng', tone: 'info' }
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
  if (roleId === 'notary') return Boolean(state.records.externalProcessing.notary)
  if (roleId === 'developer') return state.records.transfer.route === 'developer'
  if (roleId === 'landRegistry') return Boolean(state.records.externalProcessing.landRegistry)
  if (roleId === 'tax') return Boolean(state.records.externalProcessing.tax)
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
        processing: projected.processing
          ? `${projected.processing.milestone} · ${projected.processing.status}`
          : null,
        processingOrganization: projected.processing?.processingOrganization ?? null,
      }
    })
    .filter(Boolean)
}

const processingMilestone = Object.freeze({
  notary: 'Công chứng',
  landRegistry: 'Đăng ký biến động',
  tax: 'Nghĩa vụ tài chính',
})

function marketProcessingSnapshot(externalCase) {
  if (!externalCase) return null
  return {
    source: externalCase.source,
    milestone: processingMilestone[externalCase.source],
    status: externalCase.status,
    processingOrganization: externalCase.processingOrganization,
    sourceUpdatedAt: externalCase.sourceUpdatedAt,
    receivedAt: externalCase.receivedAt,
  }
}

function marketProcessingTimeline(externalCase) {
  if (!externalCase) return []
  if (!Array.isArray(externalCase.history) || externalCase.history.length === 0) {
    const snapshot = marketProcessingSnapshot(externalCase)
    return snapshot ? [snapshot] : []
  }
  return externalCase.history.map((event) => ({
    source: externalCase.source,
    milestone: processingMilestone[externalCase.source],
    status: event.status,
    processingOrganization: externalCase.processingOrganization,
    sourceUpdatedAt: event.sourceUpdatedAt,
    receivedAt: event.receivedAt,
  }))
}

export function getProcessingProjection(state) {
  if (!state?.records?.externalProcessing) return null
  const { externalProcessing, transfer, property } = state.records
  const timeline = externalSourceIds
    .flatMap((source) => marketProcessingTimeline(externalProcessing[source]))
    .sort((left, right) => Date.parse(left.sourceUpdatedAt) - Date.parse(right.sourceUpdatedAt))

  let primary = marketProcessingSnapshot(externalProcessing.notary)
  if (externalProcessing.landRegistry) {
    primary = marketProcessingSnapshot(externalProcessing.landRegistry)
  } else if (transfer.route === 'developer') {
    const developerName = property.sourceRecord357?.claims
      ?.find(({ field }) => field === 'developer')?.value ?? 'Chủ đầu tư'
    primary = {
      source: 'developer',
      milestone: 'Chuyển nhượng HĐMB',
      status: transfer.status,
      processingOrganization: developerName,
      sourceUpdatedAt: transfer.confirmedAt ?? transfer.intakeAt
        ?? externalProcessing.notary?.sourceUpdatedAt ?? null,
      receivedAt: transfer.confirmedAt ?? transfer.intakeAt
        ?? externalProcessing.notary?.receivedAt ?? null,
    }
  }

  if (!primary) return null
  return {
    milestone: primary.milestone,
    status: primary.status,
    processingOrganization: primary.processingOrganization,
    sourceUpdatedAt: primary.sourceUpdatedAt,
    receivedAt: primary.receivedAt,
    timeline,
  }
}

const externalSourceForRole = Object.freeze({
  notary: EXTERNAL_SOURCES.NOTARY,
  landRegistry: EXTERNAL_SOURCES.LAND_REGISTRY,
  tax: EXTERNAL_SOURCES.TAX,
})

function externalQueueRow(state, source) {
  const externalCase = state.records.externalProcessing[source]
  if (!externalCase) return null
  const dossier = resolveCase(state.caseId)
  return {
    id: `MON-${source}-${externalCase.sourceCaseId}`,
    source,
    sourceCaseId: externalCase.sourceCaseId,
    caseId: state.caseId,
    propertyId: state.records.property.id,
    transactionId: state.records.transaction?.id ?? null,
    propertyLabel: dossier.title,
    status: externalCase.status,
    rawStatus: externalCase.rawStatus,
    processingOrganization: externalCase.processingOrganization,
    sourceUpdatedAt: externalCase.sourceUpdatedAt,
    receivedAt: externalCase.receivedAt,
    history: clone(externalCase.history),
    actionable: false,
  }
}

export function deriveExternalQueue(caseStatesOrState, roleId) {
  const source = externalSourceForRole[roleId]
  if (!source) return []

  const journeyRows = normalizeStates(caseStatesOrState)
    .map((state) => externalQueueRow(state, source))
    .filter(Boolean)
  return [...journeyRows, ...clone(externalMonitoringFixtures[source])]
    .sort((left, right) => Date.parse(right.receivedAt) - Date.parse(left.receivedAt))
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
    processing: getProcessingProjection(state),
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

  if (roleId === 'agent') {
    return {
      ...common,
      records: {
        property: clone(records.property),
        representation: clone(records.representation),
        listing: clone(records.listing),
        readiness: clone(records.readiness),
        notaryDossier: clone(records.notaryDossier),
        transaction: clone(records.transaction),
        transfer: clone(records.transfer),
      },
      parties: clone(state.parties),
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
        readiness: clone(records.readiness),
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
        buyer: clone(state.parties.buyer),
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
          sourceRecord357: buyerSourceRecord357Projection(records.property.sourceRecord357),
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

  if (['notary', 'landRegistry', 'tax'].includes(roleId)) {
    const source = externalSourceForRole[roleId]
    const externalCase = records.externalProcessing[source]
    return {
      caseId: common.caseId,
      roleId: common.roleId,
      title: common.title,
      status: {
        code: `external_${source}`,
        label: externalCase.status,
        tone: externalCase.status === EXTERNAL_STATUSES.COMPLETED
          ? 'success'
          : externalCase.status === EXTERNAL_STATUSES.SUPPLEMENT_REQUIRED
            ? 'warning'
            : externalCase.status === EXTERNAL_STATUSES.PROCESSING
              ? 'info'
              : 'neutral',
      },
      nextWorkItem: null,
      allowedActions: [],
      records: {
        property: {
          id: records.property.id,
          name: records.property.name,
          type: records.property.type,
          location: records.property.location,
        },
        transaction: records.transaction
          ? { id: records.transaction.id, status: records.transaction.status }
          : null,
        externalCase: clone(externalCase),
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

  return {
    ...common,
    records: clone(records),
    parties: clone(state.parties),
    auditEvents: clone(state.auditEvents),
    integrationEvents: roleId === 'vmls' ? clone(state.integrationEvents) : [],
    externalEvents: roleId === 'vmls' ? clone(state.externalEvents) : [],
  }
}

export function serializeDemoState(state) {
  return JSON.stringify({
    version: 4,
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
    if (!isPlainObject(parsed) || !hasExactKeys(parsed, ['version', 'caseId', 'actions'])
      || parsed.version !== 4 || !storedCase || !Array.isArray(parsed.actions)
      || parsed.actions.length > 30 || (expectedCase && expectedCase.id !== storedCase.id)) {
      return fallback()
    }

    let state = createInitialState(storedCase.id)
    for (const action of parsed.actions) {
      if (!isPlainObject(action) || !hasExactKeys(action, ['type', 'actor', 'payload'])
        || !isPlainObject(action.payload)) return fallback()
      const next = journeyReducer(state, action)
      if (next === state) return fallback()
      state = next
    }
    return state
  } catch {
    return fallback()
  }
}
