import test from 'node:test'
import assert from 'node:assert/strict'
import { allowedTransitions, assertTransition, initialStatusFor, validateListingInput } from '../server/domain/listingLifecycle.js'

test('agent submission requesting Active is routed to Submitted', () => {
  assert.equal(initialStatusFor('agent', 'Active'), 'Submitted')
  assert.equal(initialStatusFor('broker', 'Active'), 'Active')
})

test('transition interface enforces role and reason', () => {
  assert.deepEqual(allowedTransitions('Incoming', 'broker'), ['Active', 'Needs correction', 'Withdrawn'])
  assert.throws(() => assertTransition({ from: 'Incoming', to: 'Active', role: 'agent', reason: 'ready' }), { code: 'TRANSITION_FORBIDDEN' })
  assert.throws(() => assertTransition({ from: 'Incoming', to: 'Active', role: 'broker', reason: '' }), { code: 'REASON_REQUIRED' })
})

test('listing validation returns field-addressable errors', () => {
  const errors = validateListingInput({ status: 'Active', publicRemarks: 'Ngắn' })
  assert.deepEqual(Object.keys(errors).sort(), ['agreement', 'consent', 'expiresAt', 'price', 'propertyId', 'publicRemarks'])
})
