// @ts-check

import { ROLE_PROJECTIONS, STAGES, demoCases } from './demoData.js'

export const ACTIONS = Object.freeze({
  MATCH_PROPERTY: 'match_property',
  REQUEST_SELLER_CONFIRMATION: 'request_seller_confirmation',
  CONFIRM_REPRESENTATION: 'confirm_representation',
  CREATE_LISTING: 'create_listing',
  RECORD_BUYER: 'record_buyer',
  VERIFY_READINESS: 'verify_readiness',
  SUBMIT_NOTARY_DOSSIER: 'submit_notary_dossier',
  REQUEST_SUPPLEMENT: 'request_supplement',
  PROVIDE_SUPPLEMENT: 'provide_supplement',
  RECORD_NOTARY_SIGNING: 'record_notary_signing',
  CREATE_TRANSACTION: 'create_transaction',
  APPROVE_LAND_REGISTRY: 'approve_land_registry',
  DEVELOPER_INTAKE: 'developer_intake',
  DEVELOPER_CONFIRM_TRANSFER: 'developer_confirm_transfer',
  BUYER_RECEIVE_CONTRACT: 'buyer_receive_contract',
})

export const ACTION_META = Object.freeze({
  [ACTIONS.MATCH_PROPERTY]: {
    actor: 'agent',
    label: 'Đối chiếu Bất động sản',
    description: 'Khớp địa chỉ, dự án và bằng chứng nguồn với NPID hiện có.',
  },
  [ACTIONS.REQUEST_SELLER_CONFIRMATION]: {
    actor: 'agent',
    label: 'Gửi xác nhận cho Người bán',
    description: 'Tạo yêu cầu xác nhận quyền đại diện, không tạo Tin bán ngay.',
  },
  [ACTIONS.CONFIRM_REPRESENTATION]: {
    actor: 'seller',
    label: 'Xác nhận quyền đại diện',
    description: 'Mô phỏng bàn giao trung lập qua VNeID và ghi lại sự đồng ý.',
  },
  [ACTIONS.CREATE_LISTING]: {
    actor: 'vmls',
    label: 'Khởi tạo Tin bán',
    description: 'Tạo PLID riêng biệt ở trạng thái Đã khởi tạo.',
  },
  [ACTIONS.RECORD_BUYER]: {
    actor: 'agent',
    label: 'Ghi nhận Người mua',
    description: 'Bổ sung bên mua đã được che danh tính vào hồ sơ giao dịch.',
  },
  [ACTIONS.VERIFY_READINESS]: {
    actor: 'buyer',
    label: 'Xác nhận sẵn sàng công chứng',
    description: 'Người mua xác nhận thông tin và sự sẵn sàng trước khi nộp hồ sơ.',
  },
  [ACTIONS.SUBMIT_NOTARY_DOSSIER]: {
    actor: 'notary',
    label: 'Tiếp nhận hồ sơ công chứng',
    description: 'VPCC mô phỏng kiểm tra thành phần hồ sơ và tiếp nhận.',
  },
  [ACTIONS.REQUEST_SUPPLEMENT]: {
    actor: 'notary',
    label: 'Mô phỏng yêu cầu bổ sung',
    description: 'Tạo một ngoại lệ có thể khôi phục để minh họa lịch sử không bị mất.',
  },
  [ACTIONS.PROVIDE_SUPPLEMENT]: {
    actor: 'agent',
    label: 'Bổ sung tài liệu',
    description: 'Nộp phần còn thiếu và nối tiếp đúng hồ sơ đã tiếp nhận.',
  },
  [ACTIONS.RECORD_NOTARY_SIGNING]: {
    actor: 'notary',
    label: 'Ghi nhận kết quả ký',
    description: 'VPCC trả kết quả ký qua kết nối mô phỏng.',
  },
  [ACTIONS.CREATE_TRANSACTION]: {
    actor: 'vmls',
    label: 'Tạo tham chiếu Giao dịch',
    description: 'Tạo PTID mô phỏng, nối sự kiện thuế và tự động xác định tuyến.',
  },
  [ACTIONS.APPROVE_LAND_REGISTRY]: {
    actor: 'land_registry',
    label: 'Ghi nhận kết quả sang tên',
    description: 'Mô phỏng kết quả API từ VPĐKĐĐ và cập nhật bản ghi sống.',
  },
  [ACTIONS.DEVELOPER_INTAKE]: {
    actor: 'developer',
    label: 'Tiếp nhận hồ sơ chuyển nhượng',
    description: 'Chủ đầu tư tiếp nhận đúng bộ bằng chứng đã được định tuyến.',
  },
  [ACTIONS.DEVELOPER_CONFIRM_TRANSFER]: {
    actor: 'developer',
    label: 'Xác nhận chuyển nhượng HĐMB',
    description: 'Chủ đầu tư ghi nhận thay đổi bên mua trong hồ sơ mô phỏng.',
  },
  [ACTIONS.BUYER_RECEIVE_CONTRACT]: {
    actor: 'buyer',
    label: 'Xác nhận nhận HĐMB mới',
    description: 'Người mua nhận kết quả; VMLS đã đồng bộ bản ghi trước đó.',
  },
})

const CHRONOLOGY_ACTION = Object.freeze({
  [ACTIONS.MATCH_PROPERTY]: 'match-property',
  [ACTIONS.REQUEST_SELLER_CONFIRMATION]: 'match-property',
  [ACTIONS.CONFIRM_REPRESENTATION]: 'confirm-representation',
  [ACTIONS.CREATE_LISTING]: 'create-listing',
  [ACTIONS.RECORD_BUYER]: 'record-buyer',
  [ACTIONS.VERIFY_READINESS]: 'confirm-readiness',
  [ACTIONS.SUBMIT_NOTARY_DOSSIER]: 'submit-notary-dossier',
  [ACTIONS.REQUEST_SUPPLEMENT]: 'request-supplement',
  [ACTIONS.PROVIDE_SUPPLEMENT]: 'provide-supplement',
  [ACTIONS.RECORD_NOTARY_SIGNING]: 'record-signing',
  [ACTIONS.CREATE_TRANSACTION]: 'create-transaction',
  [ACTIONS.APPROVE_LAND_REGISTRY]: 'approve-land-transfer',
  [ACTIONS.DEVELOPER_INTAKE]: 'accept-developer-dossier',
  [ACTIONS.DEVELOPER_CONFIRM_TRANSFER]: 'confirm-developer-transfer',
  [ACTIONS.BUYER_RECEIVE_CONTRACT]: 'deliver-new-contract',
})

const clone = (value) => structuredClone(value)

function getCase(caseId) {
  return demoCases.find((item) => item.id === caseId) ?? demoCases[0]
}

function addMinutes(isoTime, minutes) {
  if (!minutes) return isoTime
  const minute = Number(isoTime.slice(14, 16)) + minutes
  return `${isoTime.slice(0, 14)}${String(minute).padStart(2, '0')}${isoTime.slice(16)}`
}

function eventTimeFor(state, actionType, offset = 0) {
  const demoCase = getCase(state.caseId)
  const chronologyId = CHRONOLOGY_ACTION[actionType]
  const matched = demoCase.chronology.find(({ actionId }) => actionId === chronologyId)
  const fallback = demoCase.chronology.at(-1)?.at ?? '2026-08-15T09:00:00+07:00'
  const actionOffset = actionType === ACTIONS.REQUEST_SELLER_CONFIRMATION ? 2 : 0
  return addMinutes(matched?.at ?? fallback, actionOffset + offset)
}

export function createInitialState(caseId = demoCases[0]?.id) {
  const demoCase = getCase(caseId)

  return {
    version: 1,
    caseId: demoCase.id,
    stage: STAGES.PROPERTY_MATCH,
    route: null,
    records: {
      property: clone(demoCase.property),
      listing: null,
      transaction: null,
    },
    flags: {
      propertyMatched: false,
      sellerRequestSent: false,
      representationConfirmed: false,
      buyerRecorded: false,
      readinessVerified: false,
      notarySubmitted: false,
    },
    supplement: {
      status: 'none',
      count: 0,
    },
    auditEvents: [],
    integrationEvents: [],
  }
}

export function allowedActionsFor(state, actor) {
  if (!state || !actor) return []

  if (state.stage === STAGES.PROPERTY_MATCH) {
    if (actor !== 'agent') return []
    return state.flags.propertyMatched
      ? [ACTIONS.REQUEST_SELLER_CONFIRMATION]
      : [ACTIONS.MATCH_PROPERTY]
  }

  if (state.stage === STAGES.SELLER_CONFIRMATION) {
    if (!state.flags.representationConfirmed && actor === 'seller') {
      return [ACTIONS.CONFIRM_REPRESENTATION]
    }
    if (state.flags.representationConfirmed && actor === 'vmls') {
      return [ACTIONS.CREATE_LISTING]
    }
    return []
  }

  if (state.stage === STAGES.LISTING_CREATED) {
    return actor === 'agent' ? [ACTIONS.RECORD_BUYER] : []
  }

  if (state.stage === STAGES.TRANSACTION_READINESS) {
    if (!state.flags.readinessVerified && actor === 'buyer') return [ACTIONS.VERIFY_READINESS]
    if (state.flags.readinessVerified && actor === 'notary') return [ACTIONS.SUBMIT_NOTARY_DOSSIER]
    return []
  }

  if (state.stage === STAGES.NOTARY_DOSSIER) {
    if (state.supplement.status === 'required') {
      return actor === 'agent' ? [ACTIONS.PROVIDE_SUPPLEMENT] : []
    }
    if (actor !== 'notary') return []
    if (state.supplement.status === 'none' && state.supplement.count === 0) {
      return [ACTIONS.RECORD_NOTARY_SIGNING, ACTIONS.REQUEST_SUPPLEMENT]
    }
    return [ACTIONS.RECORD_NOTARY_SIGNING]
  }

  if (state.stage === STAGES.NOTARY_SIGNED) {
    return actor === 'vmls' ? [ACTIONS.CREATE_TRANSACTION] : []
  }

  if (state.stage === STAGES.ROUTED) {
    if (state.route === 'land_registry' && actor === 'land_registry') {
      return [ACTIONS.APPROVE_LAND_REGISTRY]
    }
    if (state.route === 'developer' && actor === 'developer') {
      return [ACTIONS.DEVELOPER_INTAKE]
    }
    return []
  }

  if (state.stage === STAGES.DEVELOPER_INTAKE) {
    return actor === 'developer' ? [ACTIONS.DEVELOPER_CONFIRM_TRANSFER] : []
  }

  if (state.stage === STAGES.DEVELOPER_CONFIRMED) {
    return actor === 'buyer' ? [ACTIONS.BUYER_RECEIVE_CONTRACT] : []
  }

  return []
}

function lifecycleSnapshot(state) {
  return {
    stage: state.stage,
    route: state.route,
    flags: { ...state.flags },
    property: {
      id: state.records.property.id,
      status: state.records.property.status,
    },
    listing: state.records.listing ? { ...state.records.listing } : null,
    transaction: state.records.transaction ? { ...state.records.transaction } : null,
    supplement: { ...state.supplement },
  }
}

function actionTarget(state, actionType) {
  const demoCase = getCase(state.caseId)

  if ([ACTIONS.MATCH_PROPERTY, ACTIONS.REQUEST_SELLER_CONFIRMATION].includes(actionType)) {
    return { targetType: 'property', targetId: demoCase.property.id }
  }
  if (actionType === ACTIONS.CONFIRM_REPRESENTATION) {
    return { targetType: 'representation', targetId: `REP-${state.caseId}` }
  }
  if (actionType === ACTIONS.CREATE_LISTING) {
    return { targetType: 'listing', targetId: demoCase.listing.id }
  }
  if ([ACTIONS.RECORD_BUYER, ACTIONS.VERIFY_READINESS].includes(actionType)) {
    return { targetType: 'transactionReadiness', targetId: `READY-${state.caseId}` }
  }
  if ([
    ACTIONS.SUBMIT_NOTARY_DOSSIER,
    ACTIONS.REQUEST_SUPPLEMENT,
    ACTIONS.PROVIDE_SUPPLEMENT,
    ACTIONS.RECORD_NOTARY_SIGNING,
  ].includes(actionType)) {
    return { targetType: 'notaryDossier', targetId: demoCase.notary.dossierId }
  }
  return { targetType: 'transaction', targetId: demoCase.transaction.id }
}

function correlationFor(state, actionType) {
  const demoCase = getCase(state.caseId)
  if ([
    ACTIONS.SUBMIT_NOTARY_DOSSIER,
    ACTIONS.REQUEST_SUPPLEMENT,
    ACTIONS.PROVIDE_SUPPLEMENT,
    ACTIONS.RECORD_NOTARY_SIGNING,
  ].includes(actionType)) {
    return demoCase.notary.correlationId
  }
  return actionTarget(state, actionType).targetId
}

function auditEvent(state, nextState, action) {
  const meta = ACTION_META[action.type]
  const index = state.auditEvents.length
  const evidence = action.type === ACTIONS.MATCH_PROPERTY ? 'SOURCE CLAIM' : 'PROPOSAL'
  const target = actionTarget(state, action.type)
  return {
    id: `AUD-${state.caseId}-${String(index + 1).padStart(2, '0')}`,
    at: eventTimeFor(state, action.type),
    actor: action.actor,
    action: action.type,
    label: meta.label,
    reason: meta.description,
    ...target,
    correlationId: correlationFor(state, action.type),
    before: lifecycleSnapshot(state),
    after: lifecycleSnapshot(nextState),
    evidence,
    evidenceLabel: evidence,
  }
}

function integrationEvent(state, actionType, type, label, extra = {}, offset = 0) {
  const demoCase = getCase(state.caseId)
  const evidence = type.startsWith('tax_') ? 'OPEN QUESTION' : 'PROPOSAL'
  return {
    id: `INT-${state.caseId}-${String(state.integrationEvents.length + offset + 1).padStart(2, '0')}`,
    at: eventTimeFor(state, actionType, offset + 1),
    type,
    label,
    status: 'Mô phỏng',
    correlationId: type.startsWith('vneid_')
      ? `REP-${state.caseId}`
      : type.startsWith('notary_')
        ? demoCase.notary.correlationId
        : demoCase.transaction.id,
    evidence,
    evidenceLabel: evidence,
    disclaimer: type.startsWith('tax_')
      ? 'Cơ chế trao đổi và xác nhận thuế thật vẫn cần cơ quan có thẩm quyền quyết định.'
      : 'Sự kiện được cấu hình cho bản demo; không chứng minh kết nối hoặc kết quả từ hệ thống thật.',
    ...extra,
  }
}

function accepted(state, action, changes, integrations = []) {
  const changedState = {
    ...state,
    ...changes,
  }
  const next = {
    ...changedState,
    auditEvents: [...state.auditEvents, auditEvent(state, changedState, action)],
  }

  if (integrations.length > 0) {
    next.integrationEvents = [
      ...state.integrationEvents,
      ...integrations.map(({ type, label, ...extra }, offset) => integrationEvent(state, action.type, type, label, extra, offset)),
    ]
  }

  return next
}

export function journeyReducer(state, action) {
  const configuredActions = /** @type {readonly string[]} */ (
    ROLE_PROJECTIONS[action?.actor]?.allowedActions ?? []
  )
  const lifecycleActions = /** @type {readonly string[]} */ (
    allowedActionsFor(state, action?.actor)
  )
  if (!state || !action || !configuredActions.includes(action.type)
    || !lifecycleActions.includes(action.type)) {
    return state
  }

  const demoCase = getCase(state.caseId)

  switch (action.type) {
    case ACTIONS.MATCH_PROPERTY:
      return accepted(state, action, {
        flags: { ...state.flags, propertyMatched: true },
      })
    case ACTIONS.REQUEST_SELLER_CONFIRMATION:
      return accepted(state, action, {
        stage: STAGES.SELLER_CONFIRMATION,
        flags: { ...state.flags, sellerRequestSent: true },
      })
    case ACTIONS.CONFIRM_REPRESENTATION:
      return accepted(state, action, {
        flags: { ...state.flags, representationConfirmed: true },
      }, [{
        type: 'vneid_consent_received',
        label: 'Đã nhận xác nhận quyền đại diện qua bàn giao VNeID mô phỏng',
      }])
    case ACTIONS.CREATE_LISTING:
      return accepted(state, action, {
        stage: STAGES.LISTING_CREATED,
        records: {
          ...state.records,
          listing: { id: demoCase.listing.id, status: 'Đã khởi tạo' },
        },
      })
    case ACTIONS.RECORD_BUYER:
      return accepted(state, action, {
        stage: STAGES.TRANSACTION_READINESS,
        flags: { ...state.flags, buyerRecorded: true },
      })
    case ACTIONS.VERIFY_READINESS:
      return accepted(state, action, {
        flags: { ...state.flags, readinessVerified: true },
      })
    case ACTIONS.SUBMIT_NOTARY_DOSSIER:
      return accepted(state, action, {
        stage: STAGES.NOTARY_DOSSIER,
        flags: { ...state.flags, notarySubmitted: true },
      }, [{
        type: 'notary_dossier_received',
        label: 'VPCC đã tiếp nhận hồ sơ qua kết nối mô phỏng',
      }])
    case ACTIONS.REQUEST_SUPPLEMENT:
      return accepted(state, action, {
        supplement: { status: 'required', count: 1 },
      })
    case ACTIONS.PROVIDE_SUPPLEMENT:
      return accepted(state, action, {
        supplement: { ...state.supplement, status: 'provided' },
      })
    case ACTIONS.RECORD_NOTARY_SIGNING:
      return accepted(state, action, {
        stage: STAGES.NOTARY_SIGNED,
        supplement: {
          ...state.supplement,
          status: state.supplement.status === 'provided' ? 'resolved' : state.supplement.status,
        },
      }, [{
        type: 'notary_result_received',
        label: 'VMLS đã nhận kết quả ký từ VPCC mô phỏng',
      }])
    case ACTIONS.CREATE_TRANSACTION:
      return accepted(state, action, {
        stage: STAGES.ROUTED,
        route: demoCase.route,
        records: {
          ...state.records,
          transaction: { id: demoCase.transaction.id, status: 'Đã ký công chứng' },
        },
      }, [
        {
          type: 'tax_obligation_exchange',
          label: 'Trao đổi nghĩa vụ thuế tự động',
        },
        {
          type: 'tax_payment_confirmation',
          label: 'Nhận xác nhận hoàn thành nghĩa vụ thuế',
        },
        {
          type: 'route_determined',
          label: demoCase.route === 'developer'
            ? 'Tự động xác định tuyến Chủ đầu tư / HĐMB'
            : 'Tự động xác định tuyến VPĐKĐĐ',
          route: demoCase.route,
        },
      ])
    case ACTIONS.APPROVE_LAND_REGISTRY:
      return accepted(state, action, {
        stage: STAGES.LAND_REGISTRY_COMPLETE,
        records: {
          ...state.records,
          transaction: { ...state.records.transaction, status: 'Đã sang tên' },
        },
      }, [{
        type: 'land_registry_approved',
        label: 'Đã nhận kết quả phê duyệt sang tên từ API VPĐKĐĐ mô phỏng',
      }])
    case ACTIONS.DEVELOPER_INTAKE:
      return accepted(state, action, {
        stage: STAGES.DEVELOPER_INTAKE,
      }, [{
        type: 'developer_dossier_received',
        label: 'Chủ đầu tư đã tiếp nhận hồ sơ chuyển nhượng',
      }])
    case ACTIONS.DEVELOPER_CONFIRM_TRANSFER:
      return accepted(state, action, {
        stage: STAGES.DEVELOPER_CONFIRMED,
        records: {
          ...state.records,
          transaction: { ...state.records.transaction, status: 'Đã xác nhận chuyển nhượng' },
        },
      }, [{
        type: 'developer_transfer_confirmed',
        label: 'Chủ đầu tư đã xác nhận chuyển nhượng HĐMB',
      }])
    case ACTIONS.BUYER_RECEIVE_CONTRACT:
      return accepted(state, action, {
        stage: STAGES.CONTRACT_RECEIVED,
        records: {
          ...state.records,
          transaction: { ...state.records.transaction, status: 'Đã nhận HĐMB mới' },
        },
      }, [{
        type: 'new_contract_received',
        label: 'Người mua đã nhận HĐMB mới; bản ghi VMLS đã đồng bộ',
      }])
    default:
      return state
  }
}

export function serializeDemoState(state) {
  return JSON.stringify(state)
}

export function projectStateForRole(state, roleId) {
  const projection = ROLE_PROJECTIONS[roleId] ?? ROLE_PROJECTIONS.agent
  const demoCase = getCase(state.caseId)
  const common = {
    caseId: state.caseId,
    roleId,
    stage: state.stage,
    route: state.route,
    scope: {
      headline: projection.headline,
      cards: [...projection.cards],
      hidden: [...projection.hidden],
    },
    allowedActions: allowedActionsFor(state, roleId),
  }

  if (roleId === 'brokerage') {
    return {
      ...common,
      records: {
        property: { id: state.records.property.id },
        listing: state.records.listing
          ? { id: state.records.listing.id, status: state.records.listing.status }
          : null,
        transaction: state.records.transaction
          ? { status: state.records.transaction.status }
          : null,
      },
      indicators: {
        representation: state.flags.representationConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận',
        listing: state.records.listing?.status ?? 'Chưa khởi tạo',
        bottleneck: state.supplement.status === 'required' ? 'Cần bổ sung hồ sơ' : 'Không có điểm nghẽn đang mở',
      },
    }
  }

  if (roleId === 'bank') {
    return {
      ...common,
      records: {
        property: { type: demoCase.property.type },
        listing: state.records.listing
          ? { askingPrice: demoCase.listing.askingPrice.displayValue, status: state.records.listing.status }
          : null,
        transaction: null,
      },
      indicators: {
        consent: demoCase.readiness.financeConsent.label,
        readiness: state.flags.readinessVerified ? 'Đã sẵn sàng công chứng' : 'Chưa sẵn sàng công chứng',
        financeContext: demoCase.readiness.financeContext,
      },
    }
  }

  return {
    ...common,
    records: clone(state.records),
    indicators: {
      auditCount: state.auditEvents.length,
      integrationCount: state.integrationEvents.length,
    },
  }
}

export function restoreDemoState(serialized, expectedCaseId) {
  const validExpectedCase = demoCases.some(({ id }) => id === expectedCaseId)
  const fallbackCaseId = validExpectedCase ? expectedCaseId : demoCases[0]?.id
  const fallback = () => createInitialState(fallbackCaseId)

  if (typeof serialized !== 'string') return fallback()

  try {
    const parsed = JSON.parse(serialized)
    const demoCase = demoCases.find(({ id }) => id === parsed.caseId)
    const matchesExpectedCase = !validExpectedCase || parsed.caseId === expectedCaseId
    const knownStage = Object.values(STAGES).includes(parsed.stage)
    const validRecords = parsed.records?.property?.id === demoCase?.property.id
      && (!parsed.records.listing || parsed.records.listing.id === demoCase?.listing.id)
      && (!parsed.records.transaction || parsed.records.transaction.id === demoCase?.transaction.id)
    const validFlags = parsed.flags && [
      'propertyMatched',
      'sellerRequestSent',
      'representationConfirmed',
      'buyerRecorded',
      'readinessVerified',
      'notarySubmitted',
    ].every((key) => typeof parsed.flags[key] === 'boolean')
    const validSupplement = parsed.supplement && Number.isInteger(parsed.supplement.count)
      && ['none', 'required', 'provided', 'resolved'].includes(parsed.supplement.status)
    const validHistory = Array.isArray(parsed.auditEvents) && Array.isArray(parsed.integrationEvents)
    const validRoute = parsed.route === null || parsed.route === demoCase?.route

    if (parsed.version !== 1 || !demoCase || !matchesExpectedCase || !knownStage || !validRecords || !validFlags
      || !validSupplement || !validHistory || !validRoute) {
      return fallback()
    }

    let replayed = createInitialState(parsed.caseId)
    for (const event of parsed.auditEvents) {
      const next = journeyReducer(replayed, { type: event.action, actor: event.actor })
      if (next === replayed) return fallback()
      replayed = next
    }

    if (JSON.stringify(replayed) !== JSON.stringify(parsed)) {
      return fallback()
    }

    return parsed
  } catch {
    return fallback()
  }
}
