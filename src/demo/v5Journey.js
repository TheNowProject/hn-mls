// @ts-check

import {
  HOUSE_NOW_SNAPSHOT,
  PRIMARY_DECLARATION_PAYLOAD,
  PRIMARY_LISTING,
  PRIMARY_LISTING_ID,
  PRIMARY_PROPERTY,
  PUBLIC_LISTINGS,
  V5_EXTERNAL_MILESTONES,
  V5_PRIMARY_CASE_ID,
  V5_ROLES,
  V5_SCHEMA,
  V5_SCHEMA_VERSION,
} from './v5Data.js'

export const V5_ACTIONS = Object.freeze({
  SUBMIT_TRANSACTION_DECLARATION: 'SUBMIT_TRANSACTION_DECLARATION',
  SYNC_TRANSACTION_FROM_357: 'SYNC_TRANSACTION_FROM_357',
  ADVANCE_EXTERNAL_PROCESSING: 'ADVANCE_EXTERNAL_PROCESSING',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
})

const SUBMITTED_AT = '2026-08-21T08:45:00+07:00'
const SOURCE_357_RECEIVED_AT = '2026-08-21T09:06:00+07:00'
const TRANSACTION_ID = 'PTID-HN-00062'

function roleOrganization(roleId) {
  return V5_ROLES.find(({ id }) => id === roleId)?.organization ?? null
}

function roleAccountContext(roleId) {
  return V5_ROLES.find(({ id }) => id === roleId)?.accountContext ?? null
}

function processingAuditSnapshot(records) {
  return {
    transactionStatus: records.transaction.status,
    taxStatus: records.taxCase?.status ?? null,
    landRegistryStatus: records.landRegistryCase?.status ?? null,
  }
}

function clone(value) {
  return structuredClone(value)
}

function isPlainObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function hasExactKeys(value, keys) {
  if (!isPlainObject(value)) return false
  const actual = Object.keys(value).sort()
  const expected = [...keys].sort()
  return actual.length === expected.length && actual.every((key, index) => key === expected[index])
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() === value && value.length > 0
}

function isDate(value) {
  if (typeof value !== 'string') return false
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return false
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day
}

function isTimestamp(value) {
  if (typeof value !== 'string') return false
  const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|[+-]\d{2}:\d{2})$/)
  if (!match) return false
  const [, date, hour, minute, second] = match
  return isDate(date)
    && Number(hour) <= 23
    && Number(minute) <= 59
    && Number(second) <= 59
    && Number.isFinite(Date.parse(value))
}

function isPdfMetadata(value) {
  return hasExactKeys(value, ['fileName', 'mimeType', 'sizeBytes'])
    && isNonEmptyString(value.fileName)
    && !/[\\/]/.test(value.fileName)
    && !/^[a-z][a-z0-9+.-]*:/i.test(value.fileName)
    && value.fileName.toLowerCase().endsWith('.pdf')
    && value.mimeType === 'application/pdf'
    && Number.isSafeInteger(value.sizeBytes)
    && value.sizeBytes > 0
}

function isDeclarationPayload(payload) {
  if (!hasExactKeys(payload, [
    'listingId',
    'buyerRef',
    'transactionValue',
    'contractNumber',
    'contractDate',
    'notaryOffice',
    'notarizedAt',
    'documents',
  ])) return false
  if (payload.listingId !== PRIMARY_LISTING_ID) return false
  if (!isNonEmptyString(payload.buyerRef) || !isNonEmptyString(payload.contractNumber)) return false
  if (!Number.isSafeInteger(payload.transactionValue) || payload.transactionValue <= 0) return false
  if (!isDate(payload.contractDate) || !isTimestamp(payload.notarizedAt)) return false
  if (!isNonEmptyString(payload.notaryOffice)) return false
  if (!isPlainObject(payload.documents)) return false
  const documentKeys = Object.keys(payload.documents)
  if (!documentKeys.includes('transferContract')) return false
  if (documentKeys.some((key) => !['transferContract', 'depositContract'].includes(key))) return false
  if (!isPdfMetadata(payload.documents.transferContract)) return false
  return !('depositContract' in payload.documents) || isPdfMetadata(payload.documents.depositContract)
}

const SOURCE_357_KEYS = [
  'transactionCode',
  'npid',
  'contractNumber',
  'transactionValue',
  'buyerMasked',
  'sellerMasked',
  'notaryOffice',
  'sourceUpdatedAt',
]

function hasOnlyKeys(value, keys) {
  return isPlainObject(value) && Object.keys(value).every((key) => keys.includes(key))
}

function isOptionalString(value) {
  return value === null || value === undefined || isNonEmptyString(value)
}

function is357Payload(payload) {
  if (!hasOnlyKeys(payload, SOURCE_357_KEYS)) return false
  const optionalKeys = [
    'contractNumber',
    'transactionValue',
    'buyerMasked',
    'sellerMasked',
    'notaryOffice',
  ]
  if (optionalKeys.some((key) => Object.hasOwn(payload, key) && payload[key] === undefined)) return false
  if (!isNonEmptyString(payload.transactionCode) || !isTimestamp(payload.sourceUpdatedAt)) return false
  if (!isNonEmptyString(payload.npid)) return false
  if (!isOptionalString(payload.contractNumber)) return false
  if (!isOptionalString(payload.buyerMasked)) return false
  if (!isOptionalString(payload.sellerMasked)) return false
  if (!isOptionalString(payload.notaryOffice)) return false
  return payload.transactionValue === null
    || payload.transactionValue === undefined
    || (Number.isSafeInteger(payload.transactionValue) && payload.transactionValue > 0)
}

function isV5State(state) {
  return Boolean(
    state
    && state.version === V5_SCHEMA_VERSION
    && state.schema === V5_SCHEMA
    && state.caseId === V5_PRIMARY_CASE_ID
    && isPlainObject(state.records)
    && state.records.property?.id === PRIMARY_PROPERTY.id
    && state.records.listing?.id === PRIMARY_LISTING_ID
    && state.records.listing?.propertyId === state.records.property.id
    && state.records.listing?.seller?.reference === PRIMARY_LISTING.seller.reference
    && state.records.houseNowSnapshot?.id === HOUSE_NOW_SNAPSHOT.id
    && isPlainObject(state.records.transaction)
    && Array.isArray(state.financialObligations)
    && Array.isArray(state.notifications)
    && Array.isArray(state.workItems)
    && Array.isArray(state.auditEvents)
    && Array.isArray(state.integrationEvents)
    && Array.isArray(state.externalEvents)
    && Array.isArray(state.actionLog),
  )
}

function maskBuyer(buyerRef) {
  return buyerRef === PRIMARY_DECLARATION_PAYLOAD.buyerRef
    ? 'Nguyễn H••• M•••'
    : 'Người mua ••••'
}

function isMissing(value) {
  return value === null || value === undefined || value === ''
}

export function reconcileTransactionSources(declaration, source357) {
  const comparisons = [
    ['npid', 'propertyId', 'npid'],
    ['contractNumber', 'contractNumber', 'contractNumber'],
    ['transactionValue', 'transactionValue', 'transactionValue'],
    ['buyerMasked', 'buyerMasked', 'buyerMasked'],
    ['sellerMasked', 'sellerMasked', 'sellerMasked'],
    ['notaryOffice', 'notaryOffice', 'notaryOffice'],
  ]
  const safeDeclaration = isPlainObject(declaration) ? declaration : {}
  const safeSource = isPlainObject(source357) ? source357 : {}
  const fields = comparisons.map(([field, vmlsKey, sourceKey]) => {
    const vmlsValue = safeDeclaration[vmlsKey]
    const source357Value = safeSource[sourceKey]
    let status = 'matched'
    if (isMissing(vmlsValue)) status = 'missing_in_vmls'
    else if (isMissing(source357Value)) status = 'missing_in_357'
    else if (!Object.is(vmlsValue, source357Value)) status = 'mismatched'
    return { field, vmlsValue, source357Value, status }
  })
  const summary = {
    matched: fields.filter(({ status }) => status === 'matched').length,
    mismatched: fields.filter(({ status }) => status === 'mismatched').length,
    missingInVmls: fields.filter(({ status }) => status === 'missing_in_vmls').length,
    missingIn357: fields.filter(({ status }) => status === 'missing_in_357').length,
  }
  return {
    status: summary.matched === fields.length ? 'matched' : 'review_required',
    fields,
    summary,
  }
}

const EXTERNAL_EVENT_HISTORY_FIELDS = [
  'id',
  'sequence',
  'source',
  'label',
  'rawStatus',
  'normalizedStatus',
  'sourceUpdatedAt',
  'receivedAt',
]

function hasValidExternalEventHistory(events) {
  if (!Array.isArray(events) || events.length > V5_EXTERNAL_MILESTONES.length) return false
  return events.every((event, index) => {
    const expected = V5_EXTERNAL_MILESTONES[index]
    return expected && EXTERNAL_EVENT_HISTORY_FIELDS.every((field) => event[field] === expected[field])
  })
}

export function getNextExternalMilestone(state) {
  if (!isV5State(state) || !state.records.transaction.id) return null
  if (!hasValidExternalEventHistory(state.externalEvents)) return null
  const milestone = V5_EXTERNAL_MILESTONES[state.externalEvents.length]
  if (!milestone) return null
  return clone({
    sequence: milestone.sequence,
    id: milestone.id,
    source: milestone.source,
    label: milestone.label,
    sourceUpdatedAt: milestone.sourceUpdatedAt,
  })
}

export function getUnreadNotificationCount(state, roleId) {
  if (!isV5State(state) || !V5_ROLES.some(({ id }) => id === roleId)) return 0
  return state.notifications.filter((notification) => (
    notification.recipientRole === roleId && notification.readAt === null
  )).length
}

export function allowedV5ActionsFor(state, roleId) {
  if (!isV5State(state) || !V5_ROLES.some(({ id }) => id === roleId)) return []
  const allowed = []
  if (roleId === 'agent' && !state.records.declaration) {
    allowed.push(V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION)
  }
  if (roleId === 'vmls' && state.records.transaction.id) {
    if (!state.records.transactionSource357) {
      allowed.push(V5_ACTIONS.SYNC_TRANSACTION_FROM_357)
    }
    if (getNextExternalMilestone(state)) {
      allowed.push(V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING)
    }
  }
  if (getUnreadNotificationCount(state, roleId) > 0) {
    allowed.push(V5_ACTIONS.MARK_NOTIFICATION_READ)
  }
  return allowed
}

function projectPublicListing(listing) {
  return clone({
    id: listing.id,
    propertyId: listing.propertyId,
    title: listing.title,
    propertyType: listing.propertyType,
    location: listing.location,
    askingPrice: listing.askingPrice,
    area: listing.area,
    bedrooms: listing.bedrooms,
    status: listing.status,
    provenance: listing.provenance,
  })
}

export function projectV5Public(state) {
  if (!isV5State(state)) return { dataLabel: 'Bộ dữ liệu mẫu', listings: [] }
  return {
    dataLabel: state.dataLabel,
    listings: PUBLIC_LISTINGS.map(projectPublicListing),
  }
}

function projectProperty(property) {
  return clone({
    id: property.id,
    label: property.label,
    type: property.type,
    certificateStatus: property.certificateStatus,
    location: property.location,
  })
}

function projectTransaction(transaction) {
  return clone({
    id: transaction.id,
    propertyId: transaction.propertyId,
    listingId: transaction.listingId,
    status: transaction.status,
    createdAt: transaction.createdAt ?? null,
    completedAt: transaction.completedAt,
  })
}

function projectCase(processingCase, includeSourceDetails) {
  if (!processingCase) return null
  const projected = {
    source: processingCase.source,
    status: processingCase.status,
    updatedAt: processingCase.updatedAt,
  }
  if (includeSourceDetails) {
    Object.assign(projected, {
      id: processingCase.id,
      transactionId: processingCase.transactionId,
      sourceCaseId: processingCase.sourceCaseId,
      handedOffAt: processingCase.handedOffAt,
      appointmentRef: processingCase.appointmentRef ?? null,
    })
  }
  return clone(projected)
}

function projectMaskedDeclaration(declaration, includeDocuments) {
  if (!declaration) return null
  const projected = {
    id: declaration.id,
    listingId: declaration.listingId,
    propertyId: declaration.propertyId,
    transactionValue: declaration.transactionValue,
    contractNumber: declaration.contractNumber,
    contractDate: declaration.contractDate,
    notaryOffice: declaration.notaryOffice,
    notarizedAt: declaration.notarizedAt,
    sellerMasked: declaration.sellerMasked,
    buyerMasked: declaration.buyerMasked,
    submittedAt: declaration.submittedAt,
  }
  if (includeDocuments) projected.documents = clone(declaration.documents)
  return clone(projected)
}

function projectExternalEvents(events, roleId) {
  if (roleId === 'vmls') return clone(events)
  return events.map((event) => clone({
    source: event.source,
    label: event.label,
    status: event.normalizedStatus,
    normalizedStatus: event.normalizedStatus,
    sourceUpdatedAt: event.sourceUpdatedAt,
    receivedAt: event.receivedAt,
  }))
}

export function projectV5StateForRole(state, roleId) {
  if (!isV5State(state) || !V5_ROLES.some(({ id }) => id === roleId)) return null
  const canViewSourceDetails = roleId === 'vmls'
  const canViewObligations = roleId !== 'buyer'
  const projection = {
    roleId,
    caseId: state.caseId,
    dataLabel: state.dataLabel,
    property: projectProperty(state.records.property),
    listing: projectPublicListing(state.records.listing),
    transaction: projectTransaction(state.records.transaction),
    processing: {
      tax: projectCase(state.records.taxCase, canViewSourceDetails),
      landRegistry: projectCase(state.records.landRegistryCase, canViewSourceDetails),
      financialObligations: canViewObligations ? state.financialObligations.map((obligation) => clone({
        id: obligation.id,
        label: obligation.label,
        status: obligation.status,
        completedAt: obligation.completedAt,
      })) : [],
      externalEvents: projectExternalEvents(state.externalEvents, roleId),
    },
    notifications: clone(state.notifications.filter(({ recipientRole }) => recipientRole === roleId)),
    workItems: clone(state.workItems.filter(({ ownerRole }) => ownerRole === roleId)),
    unreadCount: getUnreadNotificationCount(state, roleId),
    availableActions: allowedV5ActionsFor(state, roleId),
  }

  if (roleId === 'agent') {
    projection.houseNowSnapshot = clone(state.records.houseNowSnapshot)
    projection.declaration = clone(state.records.declaration)
  } else if (roleId === 'brokerage') {
    projection.declaration = projectMaskedDeclaration(state.records.declaration, false)
  } else if (roleId === 'vmls') {
    projection.houseNowSnapshot = clone(state.records.houseNowSnapshot)
    projection.declaration = projectMaskedDeclaration(state.records.declaration, true)
    projection.transactionSource357 = clone(state.records.transactionSource357)
    projection.reconciliation = clone(state.records.reconciliation)
    projection.auditEvents = clone(state.auditEvents)
    projection.integrationEvents = clone(state.integrationEvents)
  }

  return projection
}

export function createV5InitialState() {
  return {
    version: V5_SCHEMA_VERSION,
    schema: V5_SCHEMA,
    caseId: V5_PRIMARY_CASE_ID,
    dataLabel: 'Bộ dữ liệu mẫu',
    records: {
      property: clone(PRIMARY_PROPERTY),
      listing: clone(PRIMARY_LISTING),
      houseNowSnapshot: HOUSE_NOW_SNAPSHOT,
      declaration: null,
      transaction: {
        id: null,
        propertyId: PRIMARY_PROPERTY.id,
        listingId: PRIMARY_LISTING_ID,
        status: 'Chờ khai báo',
        completedAt: null,
      },
      transactionSource357: null,
      reconciliation: null,
      taxCase: null,
      landRegistryCase: null,
    },
    financialObligations: [],
    notifications: [],
    workItems: [],
    auditEvents: [],
    integrationEvents: [],
    externalEvents: [],
    actionLog: [],
  }
}

function submitTransactionDeclaration(state, action) {
  if (action.actor !== 'agent' || !isDeclarationPayload(action.payload)) return state
  if (state.records.declaration || state.records.transaction.id) return state

  const payload = clone(action.payload)
  const listing = state.records.listing
  if (
    listing.id !== payload.listingId
    || listing.propertyId !== state.records.property.id
    || !isNonEmptyString(listing.seller?.reference)
    || !isNonEmptyString(listing.seller?.maskedName)
  ) return state
  const declaration = {
    id: 'DECL-PT-2026-0001',
    listingId: listing.id,
    propertyId: listing.propertyId,
    sellerRef: listing.seller.reference,
    sellerMasked: listing.seller.maskedName,
    buyerRef: payload.buyerRef,
    buyerMasked: maskBuyer(payload.buyerRef),
    transactionValue: payload.transactionValue,
    contractNumber: payload.contractNumber,
    contractDate: payload.contractDate,
    notaryOffice: payload.notaryOffice,
    notarizedAt: payload.notarizedAt,
    documents: payload.documents,
    submittedBy: 'agent',
    submittedAt: SUBMITTED_AT,
  }

  return {
    ...state,
    records: {
      ...state.records,
      declaration,
      transaction: {
        ...state.records.transaction,
        id: TRANSACTION_ID,
        status: 'Đã khai báo giao dịch',
        createdAt: SUBMITTED_AT,
      },
      taxCase: {
        id: `TAX-CASE-${TRANSACTION_ID}`,
        transactionId: TRANSACTION_ID,
        source: 'tax',
        sourceCaseId: null,
        status: 'Đã chuyển hồ sơ',
        handedOffAt: SUBMITTED_AT,
        updatedAt: SUBMITTED_AT,
      },
    },
    financialObligations: [
      {
        id: 'personal_income_tax',
        label: 'Thuế TNCN',
        status: 'Chờ thông báo',
        completedAt: null,
      },
      {
        id: 'registration_fee',
        label: 'Lệ phí trước bạ',
        status: 'Chờ thông báo',
        completedAt: null,
      },
    ],
    auditEvents: [
      ...state.auditEvents,
      {
        id: 'AUDIT-V5-001',
        type: 'transaction_declaration_submitted',
        actorRole: 'agent',
        actorOrganization: roleOrganization('agent'),
        reason: 'Khai báo giao dịch đã công chứng',
        targetType: 'TransactionDeclaration',
        targetId: declaration.id,
        before: null,
        after: {
          declarationId: declaration.id,
          transactionId: TRANSACTION_ID,
          transactionStatus: 'Đã khai báo giao dịch',
        },
        correlationId: TRANSACTION_ID,
        occurredAt: SUBMITTED_AT,
      },
    ],
    integrationEvents: [
      ...state.integrationEvents,
      {
        id: 'INTEGRATION-V5-001',
        type: 'tax_dossier_handoff_created',
        source: 'VMLS',
        destination: 'tax',
        transactionId: TRANSACTION_ID,
        correlationId: TRANSACTION_ID,
        occurredAt: SUBMITTED_AT,
      },
    ],
    actionLog: [...state.actionLog, clone(action)],
  }
}

function syncTransactionFrom357(state, action) {
  if (action.actor !== 'vmls' || !is357Payload(action.payload)) return state
  if (!state.records.declaration || state.records.transactionSource357) return state

  const transactionSource357 = {
    ...clone(action.payload),
    source: '357',
    receivedAt: SOURCE_357_RECEIVED_AT,
  }
  const result = reconcileTransactionSources(state.records.declaration, transactionSource357)
  const reconciliation = {
    id: 'RECON-PTID-HN-00062-357',
    ...result,
    reconciledAt: SOURCE_357_RECEIVED_AT,
  }
  const auditId = `AUDIT-V5-${String(state.auditEvents.length + 1).padStart(3, '0')}`
  const integrationId = `INTEGRATION-V5-${String(state.integrationEvents.length + 1).padStart(3, '0')}`

  return {
    ...state,
    records: {
      ...state.records,
      transactionSource357,
      reconciliation,
    },
    auditEvents: [
      ...state.auditEvents,
      {
        id: auditId,
        type: 'transaction_357_sync_requested',
        actorRole: 'vmls',
        actorOrganization: roleOrganization('vmls'),
        reason: 'Đồng bộ bản ghi giao dịch từ nguồn 357',
        targetType: 'Transaction',
        targetId: state.records.transaction.id,
        before: { transactionSource357: null },
        after: {
          transactionCode: transactionSource357.transactionCode,
          reconciliationStatus: reconciliation.status,
        },
        correlationId: state.records.transaction.id,
        occurredAt: SOURCE_357_RECEIVED_AT,
      },
    ],
    integrationEvents: [
      ...state.integrationEvents,
      {
        id: integrationId,
        type: 'transaction_357_synced',
        source: '357',
        destination: 'VMLS',
        sourceKey: transactionSource357.transactionCode,
        transactionId: state.records.transaction.id,
        correlationId: state.records.transaction.id,
        occurredAt: SOURCE_357_RECEIVED_AT,
      },
    ],
    actionLog: [...state.actionLog, clone(action)],
  }
}

function advanceExternalProcessing(state, action) {
  if (action.actor !== 'vmls' || !hasExactKeys(action.payload, [])) return state
  if (!state.records.transaction.id || !state.records.taxCase) return state
  if (!hasValidExternalEventHistory(state.externalEvents)) return state
  const milestone = V5_EXTERNAL_MILESTONES[state.externalEvents.length]
  if (!milestone) return state
  const before = processingAuditSnapshot(state.records)

  const sourceCaseId = milestone.source === 'tax'
    ? 'THUE-HN-2026-04821'
    : 'VPĐK-TTHC-2026-19844'
  const externalEvent = {
    id: milestone.id,
    sequence: milestone.sequence,
    source: milestone.source,
    label: milestone.label,
    sourceCaseId,
    rawStatus: milestone.rawStatus,
    normalizedStatus: milestone.normalizedStatus,
    sourceUpdatedAt: milestone.sourceUpdatedAt,
    receivedAt: milestone.receivedAt,
  }
  let transaction = state.records.transaction
  let taxCase = state.records.taxCase
  let landRegistryCase = state.records.landRegistryCase
  let financialObligations = state.financialObligations
  let notifications = state.notifications
  let workItems = state.workItems
  let integrationEvents = state.integrationEvents

  switch (milestone.sequence) {
    case 1:
      taxCase = {
        ...taxCase,
        sourceCaseId,
        status: 'Chờ thông báo nghĩa vụ tài chính',
        appointmentRef: 'GIAYHEN-THUE-HN-2026-04821',
        updatedAt: milestone.sourceUpdatedAt,
      }
      break
    case 2:
      taxCase = {
        ...taxCase,
        status: 'Cần thực hiện nghĩa vụ tài chính',
        updatedAt: milestone.sourceUpdatedAt,
      }
      financialObligations = financialObligations.map((obligation) => ({
        ...obligation,
        status: 'Cần thực hiện',
      }))
      notifications = [
        ...notifications,
        {
          id: 'NOTIF-SELLER-TAX-DUE',
          recipientRole: 'seller',
          type: 'financial_obligation_required',
          title: 'Có thông báo nghĩa vụ tài chính',
          message: 'Cơ quan Thuế đã phát hành thông báo nghĩa vụ tài chính cho hồ sơ giao dịch.',
          transactionId: TRANSACTION_ID,
          createdAt: milestone.receivedAt,
          readAt: null,
          route: `#/demo/transaction/${TRANSACTION_ID}`,
        },
      ]
      workItems = [
        ...workItems,
        {
          id: 'WORK-SELLER-TAX-DUE',
          ownerRole: 'seller',
          type: 'external_financial_obligation',
          title: 'Theo dõi thông báo nghĩa vụ tài chính',
          instruction: 'Thực hiện theo hướng dẫn của cơ quan Thuế ngoài VMLS.',
          transactionId: TRANSACTION_ID,
          status: 'open',
          createdAt: milestone.receivedAt,
          resolvedAt: null,
        },
      ]
      break
    case 3: {
      taxCase = {
        ...taxCase,
        status: 'Đã hoàn thành nghĩa vụ tài chính',
        updatedAt: milestone.sourceUpdatedAt,
      }
      financialObligations = financialObligations.map((obligation) => ({
        ...obligation,
        status: 'Đã hoàn thành',
        completedAt: milestone.sourceUpdatedAt,
      }))
      workItems = workItems.map((item) => item.id === 'WORK-SELLER-TAX-DUE'
        ? { ...item, status: 'resolved', resolvedAt: milestone.receivedAt }
        : item)
      landRegistryCase = {
        id: `LAND-CASE-${TRANSACTION_ID}`,
        transactionId: TRANSACTION_ID,
        source: 'landRegistry',
        sourceCaseId: null,
        status: 'Đã chuyển hồ sơ',
        handedOffAt: milestone.receivedAt,
        updatedAt: milestone.receivedAt,
      }
      const integrationId = `INTEGRATION-V5-${String(integrationEvents.length + 1).padStart(3, '0')}`
      integrationEvents = [
        ...integrationEvents,
        {
          id: integrationId,
          type: 'land_registry_handoff_created',
          source: 'VMLS',
          destination: 'landRegistry',
          transactionId: TRANSACTION_ID,
          correlationId: TRANSACTION_ID,
          occurredAt: milestone.receivedAt,
        },
      ]
      break
    }
    case 4:
      landRegistryCase = {
        ...landRegistryCase,
        sourceCaseId,
        status: 'Đã tiếp nhận',
        updatedAt: milestone.sourceUpdatedAt,
      }
      break
    case 5:
      landRegistryCase = {
        ...landRegistryCase,
        status: 'Đang xử lý TTHC',
        updatedAt: milestone.sourceUpdatedAt,
      }
      break
    case 6:
      landRegistryCase = {
        ...landRegistryCase,
        status: 'Đã hoàn thành',
        updatedAt: milestone.sourceUpdatedAt,
      }
      transaction = {
        ...transaction,
        status: 'Đã hoàn thành sang tên',
        completedAt: milestone.sourceUpdatedAt,
      }
      notifications = [
        ...notifications,
        {
          id: 'NOTIF-BUYER-LAND-COMPLETE',
          recipientRole: 'buyer',
          type: 'land_transfer_completed',
          title: 'Hồ sơ sang tên đã hoàn thành',
          message: 'Kết quả đã sẵn sàng. Vui lòng đến VPĐKĐĐ để nhận Giấy chứng nhận.',
          transactionId: TRANSACTION_ID,
          createdAt: milestone.receivedAt,
          readAt: null,
          route: `#/demo/transaction/${TRANSACTION_ID}`,
        },
      ]
      workItems = [
        ...workItems,
        {
          id: 'WORK-BUYER-COLLECT-CERTIFICATE',
          ownerRole: 'buyer',
          type: 'collect_certificate',
          title: 'Nhận Giấy chứng nhận tại VPĐKĐĐ',
          instruction: 'Đến VPĐKĐĐ theo hướng dẫn trong hồ sơ để nhận kết quả.',
          transactionId: TRANSACTION_ID,
          status: 'open',
          createdAt: milestone.receivedAt,
          resolvedAt: null,
        },
      ]
      break
    default:
      return state
  }

  const auditId = `AUDIT-V5-${String(state.auditEvents.length + 1).padStart(3, '0')}`
  return {
    ...state,
    records: {
      ...state.records,
      transaction,
      taxCase,
      landRegistryCase,
    },
    financialObligations,
    notifications,
    workItems,
    integrationEvents,
    externalEvents: [...state.externalEvents, externalEvent],
    auditEvents: [
      ...state.auditEvents,
      {
        id: auditId,
        type: 'external_processing_sync_requested',
        actorRole: 'vmls',
        actorOrganization: roleOrganization('vmls'),
        reason: 'Nhận event hợp lệ kế tiếp từ hệ thống nguồn',
        targetType: 'ExternalProcessingCase',
        targetId: sourceCaseId,
        before,
        after: {
          ...processingAuditSnapshot({ transaction, taxCase, landRegistryCase }),
          acceptedEventId: milestone.id,
        },
        correlationId: TRANSACTION_ID,
        occurredAt: milestone.receivedAt,
      },
    ],
    actionLog: [...state.actionLog, clone(action)],
  }
}

function markNotificationRead(state, action) {
  if (!V5_ROLES.some(({ id }) => id === action.actor)) return state
  if (!hasExactKeys(action.payload, ['notificationId'])) return state
  if (!isNonEmptyString(action.payload.notificationId)) return state
  const notification = state.notifications.find(({ id }) => id === action.payload.notificationId)
  if (!notification || notification.recipientRole !== action.actor || notification.readAt) return state
  const readAt = notification.id === 'NOTIF-SELLER-TAX-DUE'
    ? '2026-08-22T09:14:00+07:00'
    : '2026-09-04T15:03:00+07:00'
  const auditId = `AUDIT-V5-${String(state.auditEvents.length + 1).padStart(3, '0')}`

  return {
    ...state,
    notifications: state.notifications.map((item) => item.id === notification.id
      ? { ...item, readAt }
      : item),
    auditEvents: [
      ...state.auditEvents,
      {
        id: auditId,
        type: 'notification_marked_read',
        actorRole: action.actor,
        actorOrganization: roleOrganization(action.actor),
        actorContext: roleAccountContext(action.actor),
        reason: 'Người nhận mở thông báo trong hồ sơ được phép',
        targetType: 'Notification',
        targetId: notification.id,
        before: { readAt: null },
        after: { readAt },
        correlationId: notification.transactionId,
        occurredAt: readAt,
      },
    ],
    actionLog: [...state.actionLog, clone(action)],
  }
}

export function v5Reducer(state, action) {
  if (!isV5State(state)) return createV5InitialState()
  if (!hasExactKeys(action, ['type', 'actor', 'payload'])) return state

  switch (action.type) {
    case V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION:
      return submitTransactionDeclaration(state, action)
    case V5_ACTIONS.SYNC_TRANSACTION_FROM_357:
      return syncTransactionFrom357(state, action)
    case V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING:
      return advanceExternalProcessing(state, action)
    case V5_ACTIONS.MARK_NOTIFICATION_READ:
      return markNotificationRead(state, action)
    default:
      return state
  }
}

function persistenceEnvelope(state) {
  return {
    version: V5_SCHEMA_VERSION,
    schema: V5_SCHEMA,
    caseId: V5_PRIMARY_CASE_ID,
    actionLog: clone(state.actionLog),
  }
}

export function serializeV5State(state) {
  const safeState = isV5State(state) ? state : createV5InitialState()
  return JSON.stringify(persistenceEnvelope(safeState))
}

export function restoreV5State(raw) {
  const fresh = createV5InitialState()
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > 250_000) return fresh
  try {
    const parsed = JSON.parse(raw)
    if (!hasExactKeys(parsed, ['version', 'schema', 'caseId', 'actionLog'])) return fresh
    if (
      parsed.version !== V5_SCHEMA_VERSION
      || parsed.schema !== V5_SCHEMA
      || parsed.caseId !== V5_PRIMARY_CASE_ID
      || !Array.isArray(parsed.actionLog)
      || parsed.actionLog.length > 32
    ) return fresh

    let restored = fresh
    for (const action of parsed.actionLog) {
      if (!hasExactKeys(action, ['type', 'actor', 'payload'])) return fresh
      const next = v5Reducer(restored, action)
      if (next === restored) return fresh
      restored = next
    }
    return restored
  } catch {
    return fresh
  }
}
