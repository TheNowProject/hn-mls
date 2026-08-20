import test from 'node:test'
import assert from 'node:assert/strict'
import {
  VNEID_SESSION_ACTIONS,
  VNEID_SESSION_STORAGE_KEY,
  createVneidSession,
  restoreVneidSession,
  serializeVneidSession,
  vneidSessionReducer,
} from '../src/demo/vneidSession.js'

test('VNeID session starts signed out and authenticates only through the confirmed local handoff', () => {
  const initial = createVneidSession()

  assert.equal(VNEID_SESSION_STORAGE_KEY, 'vmls:vneid-session:2026-08:v1')
  assert.deepEqual(initial, { version: 1, status: 'signedOut' })

  const authenticated = vneidSessionReducer(initial, {
    type: VNEID_SESSION_ACTIONS.CONFIRM_LOGIN,
    payload: { accepted: true },
  })

  assert.equal(authenticated.status, 'authenticated')
  assert.deepEqual(authenticated.identity, {
    reference: 'VNEID-HN-0001',
    displayName: 'N••• H••• N••',
  })
  assert.equal(authenticated.authenticatedAt, '2026-08-20T08:30:00+07:00')
  assert.deepEqual(authenticated.sharedFields, [
    'Mã phiên định danh',
    'Họ tên đã che',
    'Kết quả xác thực',
  ])
})

test('VNeID session rejects malformed commands and logout does not need dossier state', () => {
  const initial = createVneidSession()
  const valid = {
    type: VNEID_SESSION_ACTIONS.CONFIRM_LOGIN,
    payload: { accepted: true },
  }

  assert.strictEqual(vneidSessionReducer(initial, { ...valid, actor: 'agent' }), initial)
  assert.strictEqual(vneidSessionReducer(initial, {
    ...valid,
    payload: { accepted: true, identityReference: 'INJECTED' },
  }), initial)
  assert.strictEqual(vneidSessionReducer(initial, {
    ...valid,
    payload: { accepted: false },
  }), initial)

  const authenticated = vneidSessionReducer(initial, valid)
  assert.deepEqual(vneidSessionReducer(authenticated, {
    type: VNEID_SESSION_ACTIONS.LOGOUT,
  }), initial)
})

test('VNeID session persists independently and restores fail-closed', () => {
  const authenticated = vneidSessionReducer(createVneidSession(), {
    type: VNEID_SESSION_ACTIONS.CONFIRM_LOGIN,
    payload: { accepted: true },
  })
  const serialized = serializeVneidSession(authenticated)

  assert.deepEqual(restoreVneidSession(serialized), authenticated)
  assert.deepEqual(restoreVneidSession(null), createVneidSession())
  assert.deepEqual(restoreVneidSession('{bad-json'), createVneidSession())
  assert.deepEqual(restoreVneidSession(JSON.stringify({ ...authenticated, version: 0 })), createVneidSession())
  assert.deepEqual(restoreVneidSession(JSON.stringify({ ...authenticated, identity: { ...authenticated.identity, cccd: 'hidden' } })), createVneidSession())
})
