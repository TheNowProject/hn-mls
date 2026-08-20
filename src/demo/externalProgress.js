// @ts-check

export const EXTERNAL_SOURCES = Object.freeze({
  NOTARY: 'notary',
  LAND_REGISTRY: 'landRegistry',
  TAX: 'tax',
})

export const EXTERNAL_STATUSES = Object.freeze({
  PENDING: 'Chờ tiếp nhận',
  PROCESSING: 'Đang xử lý',
  SUPPLEMENT_REQUIRED: 'Yêu cầu bổ sung',
  COMPLETED: 'Đã xử lý',
})

const sourceIds = new Set(Object.values(EXTERNAL_SOURCES))
const normalizedStatuses = new Set(Object.values(EXTERNAL_STATUSES))
const isTimestamp = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value))
const isReference = (value) => typeof value === 'string'
  && value.trim().length >= 6
  && value.trim().length <= 100
  && !/[\r\n]/u.test(value)

export function createExternalProcessingCase({
  source,
  sourceCaseId,
  processingOrganization,
  createdAt,
}) {
  if (!sourceIds.has(source) || !isReference(sourceCaseId)
    || !isReference(processingOrganization) || !isTimestamp(createdAt)) {
    return null
  }

  return {
    source,
    sourceCaseId,
    processingOrganization,
    status: EXTERNAL_STATUSES.PENDING,
    rawStatus: 'Hồ sơ đã chuyển',
    sourceUpdatedAt: createdAt,
    receivedAt: createdAt,
    lastSequence: 0,
    history: [],
  }
}

/**
 * Applies one source-owned event without interpreting its business side effects.
 * Returning the same object is the fail-closed signal for duplicate, stale,
 * skipped or mismatched events.
 */
export function applyExternalStatusEvent(externalCase, event) {
  if (!externalCase || !event || event.source !== externalCase.source
    || event.sourceCaseId !== externalCase.sourceCaseId
    || !isReference(event.id) || !Number.isInteger(event.sequence)
    || event.sequence !== externalCase.lastSequence + 1
    || !normalizedStatuses.has(event.status)
    || !isReference(event.rawStatus)
    || !isTimestamp(event.sourceUpdatedAt) || !isTimestamp(event.receivedAt)
    || Date.parse(event.receivedAt) < Date.parse(event.sourceUpdatedAt)
    || Date.parse(event.sourceUpdatedAt) <= Date.parse(externalCase.sourceUpdatedAt)
    || Date.parse(event.receivedAt) <= Date.parse(externalCase.receivedAt)
    || externalCase.history.some(({ id }) => id === event.id)) {
    return externalCase
  }

  const acceptedEvent = structuredClone(event)
  return {
    ...externalCase,
    status: event.status,
    rawStatus: event.rawStatus,
    sourceUpdatedAt: event.sourceUpdatedAt,
    receivedAt: event.receivedAt,
    lastSequence: event.sequence,
    history: [...externalCase.history, acceptedEvent],
  }
}
