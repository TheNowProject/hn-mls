import test from 'node:test'
import assert from 'node:assert/strict'
import {
  PRIMARY_DECLARATION_PAYLOAD,
  TRANSACTION_357_FIXTURE,
} from '../src/demo/v5Data.js'
import {
  V5_ACTIONS,
  createV5InitialState,
  projectV5Public,
  projectV5StateForRole,
  v5Reducer,
} from '../src/demo/v5Journey.js'

function reduce(state, type, actor, payload) {
  const next = v5Reducer(state, { type, actor, payload })
  assert.notStrictEqual(next, state, `${type} should be accepted by the fixture`)
  return next
}

function submit(state = createV5InitialState()) {
  return reduce(
    state,
    V5_ACTIONS.SUBMIT_TRANSACTION_DECLARATION,
    'agent',
    PRIMARY_DECLARATION_PAYLOAD,
  )
}

function advance(state, count) {
  let next = state
  for (let index = 0; index < count; index += 1) {
    next = reduce(next, V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING, 'vmls', {})
  }
  return next
}

test('the Public projection is a strict Listing allowlist with no transaction data', () => {
  const completed = advance(submit(), 6)
  const projected = projectV5Public(completed)

  assert.deepEqual(Object.keys(projected), ['dataLabel', 'listings'])
  assert.equal(projected.dataLabel, 'Bộ dữ liệu mẫu')
  assert.equal(projected.listings.length, 5)
  assert.deepEqual(Object.keys(projected.listings[0]), [
    'id',
    'propertyId',
    'title',
    'propertyType',
    'location',
    'askingPrice',
    'area',
    'bedrooms',
    'status',
    'provenance',
  ])
  assert.equal(projected.listings[0].id, 'PLID-HN-00208')
  assert.equal(projected.listings[0].propertyId, 'NPID-HN-10421')

  const exposed = JSON.stringify(projected)
  for (const restricted of [
    'PTID-HN-00062',
    'PARTY-BUYER-HN-0518',
    'PARTY-SELLER-HN-0312',
    'HDCN-2026-0819-PT',
    'transactionSource357',
    'Thuế TNCN',
    'Lệ phí trước bạ',
    'Đã hoàn thành sang tên',
  ]) {
    assert.equal(exposed.includes(restricted), false, `${restricted} must stay non-public`)
  }
})

test('five account projections independently allowlist operational data', () => {
  let state = submit()
  state = reduce(
    state,
    V5_ACTIONS.SYNC_TRANSACTION_FROM_357,
    'vmls',
    TRANSACTION_357_FIXTURE,
  )
  state = advance(state, 2)

  const agent = projectV5StateForRole(state, 'agent')
  assert.equal(agent.declaration.buyerRef, 'PARTY-BUYER-HN-0518')
  assert.equal(agent.declaration.documents.transferContract.mimeType, 'application/pdf')
  assert.equal(agent.houseNowSnapshot.externalListingId, 'HN-LST-78421')
  assert.equal('transactionSource357' in agent, false)
  assert.deepEqual(agent.notifications, [])
  assert.equal('sourceCaseId' in agent.processing.tax, false)
  assert.equal('appointmentRef' in agent.processing.tax, false)
  assert.equal(agent.processing.externalEvents[0].label, 'Thuế đã tiếp nhận hồ sơ')
  assert.equal(agent.processing.externalEvents[0].status, 'Chờ thông báo nghĩa vụ tài chính')
  assert.equal('id' in agent.processing.externalEvents[0], false)
  assert.equal('sequence' in agent.processing.externalEvents[0], false)

  const brokerage = projectV5StateForRole(state, 'brokerage')
  assert.equal(brokerage.declaration.buyerMasked, 'Nguyễn H••• M•••')
  assert.equal(brokerage.declaration.sellerMasked, 'Trần V••• A•••')
  assert.equal('buyerRef' in brokerage.declaration, false)
  assert.equal('sellerRef' in brokerage.declaration, false)
  assert.equal('documents' in brokerage.declaration, false)
  assert.equal('sourceCaseId' in brokerage.processing.tax, false)
  assert.equal('appointmentRef' in brokerage.processing.tax, false)

  const seller = projectV5StateForRole(state, 'seller')
  assert.equal('declaration' in seller, false)
  assert.equal('houseNowSnapshot' in seller, false)
  assert.equal('reconciliation' in seller, false)
  assert.equal(seller.notifications.length, 1)
  assert.equal(seller.notifications[0].recipientRole, 'seller')
  assert.equal(seller.workItems.length, 1)
  assert.equal(seller.unreadCount, 1)
  assert.equal('sourceCaseId' in seller.processing.tax, false)
  assert.equal('appointmentRef' in seller.processing.tax, false)
  assert.equal('id' in seller.processing.externalEvents[0], false)
  const sellerJson = JSON.stringify(seller)
  assert.equal(sellerJson.includes('Nguyễn H••• M•••'), false)
  assert.equal(sellerJson.includes('18.400'), false)

  const buyer = projectV5StateForRole(state, 'buyer')
  assert.deepEqual(buyer.notifications, [])
  assert.deepEqual(buyer.workItems, [])
  assert.deepEqual(buyer.processing.financialObligations, [])
  assert.equal(buyer.unreadCount, 0)

  const vmls = projectV5StateForRole(state, 'vmls')
  assert.equal(vmls.transactionSource357.transactionCode, '357-GD-2026-000812')
  assert.equal(vmls.reconciliation.status, 'matched')
  assert.equal(vmls.auditEvents.length > 0, true)
  assert.equal(vmls.integrationEvents.length > 0, true)
  assert.equal(vmls.processing.externalEvents[0].id, 'TAX-EVT-PT-001')
  assert.equal(vmls.processing.tax.sourceCaseId, 'THUE-HN-2026-04821')
  assert.equal(vmls.processing.tax.appointmentRef, 'GIAYHEN-THUE-HN-2026-04821')
  assert.equal(vmls.processing.externalEvents[0].rawStatus, 'Đã tiếp nhận hồ sơ xác định nghĩa vụ tài chính')
  assert.deepEqual(vmls.availableActions, [V5_ACTIONS.ADVANCE_EXTERNAL_PROCESSING])

  assert.equal(projectV5StateForRole(state, 'developer'), null)
  assert.equal(projectV5StateForRole({}, 'agent'), null)
  assert.equal(projectV5StateForRole({ ...state, notifications: null }, 'seller'), null)
})

test('Seller and Buyer inboxes never expose another account notification', () => {
  const completed = advance(submit(), 6)
  const seller = projectV5StateForRole(completed, 'seller')
  const buyer = projectV5StateForRole(completed, 'buyer')

  assert.deepEqual(seller.notifications.map(({ id }) => id), ['NOTIF-SELLER-TAX-DUE'])
  assert.deepEqual(seller.workItems.map(({ id }) => id), ['WORK-SELLER-TAX-DUE'])
  assert.deepEqual(buyer.notifications.map(({ id }) => id), ['NOTIF-BUYER-LAND-COMPLETE'])
  assert.deepEqual(buyer.workItems.map(({ id }) => id), ['WORK-BUYER-COLLECT-CERTIFICATE'])
  assert.equal(buyer.notifications[0].message.includes('VPĐKĐĐ'), true)
  assert.equal(buyer.notifications[0].message.includes('Giấy chứng nhận'), true)
  assert.equal(JSON.stringify(completed).includes('Closing Record'), false)
})
