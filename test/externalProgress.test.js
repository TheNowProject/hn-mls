import test from 'node:test'
import assert from 'node:assert/strict'
import {
  EXTERNAL_SOURCES,
  EXTERNAL_STATUSES,
  applyExternalStatusEvent,
  createExternalProcessingCase,
} from '../src/demo/externalProgress.js'

const baseCase = () => createExternalProcessingCase({
  source: EXTERNAL_SOURCES.NOTARY,
  sourceCaseId: 'HSCC-HN-00044',
  processingOrganization: 'Văn phòng công chứng Minh Tâm',
  createdAt: '2026-08-18T10:30:00+07:00',
})

const acceptedEvent = {
  id: 'VPCC-EVT-00044-01',
  source: EXTERNAL_SOURCES.NOTARY,
  sourceCaseId: 'HSCC-HN-00044',
  sequence: 1,
  status: EXTERNAL_STATUSES.PROCESSING,
  rawStatus: 'Đã tiếp nhận và phân công xử lý',
  sourceUpdatedAt: '2026-08-18T11:00:00+07:00',
  receivedAt: '2026-08-18T11:02:00+07:00',
}

test('external processing applies only the next valid source event', () => {
  const initial = baseCase()
  assert.deepEqual(initial, {
    source: 'notary',
    sourceCaseId: 'HSCC-HN-00044',
    processingOrganization: 'Văn phòng công chứng Minh Tâm',
    status: 'Chờ tiếp nhận',
    rawStatus: 'Hồ sơ đã chuyển',
    sourceUpdatedAt: '2026-08-18T10:30:00+07:00',
    receivedAt: '2026-08-18T10:30:00+07:00',
    lastSequence: 0,
    history: [],
  })

  const accepted = applyExternalStatusEvent(initial, acceptedEvent)
  assert.notStrictEqual(accepted, initial)
  assert.equal(accepted.status, 'Đang xử lý')
  assert.equal(accepted.rawStatus, 'Đã tiếp nhận và phân công xử lý')
  assert.equal(accepted.lastSequence, 1)
  assert.deepEqual(accepted.history, [acceptedEvent])
})

test('external processing ignores duplicate, skipped, stale and mismatched events', () => {
  const initial = baseCase()
  const accepted = applyExternalStatusEvent(initial, acceptedEvent)

  assert.strictEqual(applyExternalStatusEvent(accepted, acceptedEvent), accepted)
  assert.strictEqual(applyExternalStatusEvent(initial, { ...acceptedEvent, sequence: 2 }), initial)
  assert.strictEqual(applyExternalStatusEvent(initial, {
    ...acceptedEvent,
    sourceCaseId: 'HSCC-KHAC',
  }), initial)
  assert.strictEqual(applyExternalStatusEvent(initial, {
    ...acceptedEvent,
    sourceUpdatedAt: '2026-08-18T10:29:00+07:00',
  }), initial)
  assert.strictEqual(applyExternalStatusEvent(initial, {
    ...acceptedEvent,
    receivedAt: '2026-08-18T10:29:00+07:00',
  }), initial)
  assert.strictEqual(applyExternalStatusEvent(initial, {
    ...acceptedEvent,
    status: 'Trạng thái tùy ý',
  }), initial)
})
