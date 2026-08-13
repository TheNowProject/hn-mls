const transitionRules = {
  Incoming: {
    agent: ['Withdrawn'],
    broker: ['Active', 'Needs correction', 'Withdrawn'],
    steward: ['Active', 'Needs correction', 'Withdrawn'],
  },
  Submitted: {
    broker: ['Active', 'Needs correction'],
    steward: ['Active', 'Needs correction'],
  },
  'Needs correction': {
    agent: ['Incoming', 'Withdrawn'],
    broker: ['Incoming', 'Withdrawn'],
    steward: ['Incoming', 'Withdrawn'],
  },
  Active: {
    agent: ['Pending', 'On hold', 'Withdrawn'],
    broker: ['Pending', 'On hold', 'Withdrawn'],
    steward: ['Pending', 'On hold', 'Withdrawn'],
  },
  'On hold': {
    agent: ['Active', 'Withdrawn'],
    broker: ['Active', 'Withdrawn'],
    steward: ['Active', 'Withdrawn'],
  },
  Pending: {
    agent: ['Active'],
    broker: ['Active', 'Closed'],
    steward: ['Active', 'Closed'],
  },
  Closed: {},
  Withdrawn: {},
  Expired: {},
}

export const allowedTransitions = (status, role) => transitionRules[status]?.[role] ?? []

export function validateListingInput(input) {
  const errors = {}
  if (!input.propertyId) errors.propertyId = 'Property ID là bắt buộc.'
  if (!Number.isFinite(Number(input.price)) || Number(input.price) < 100000000) errors.price = 'Giá chào phải từ 100 triệu đồng.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.expiresAt ?? '')) errors.expiresAt = 'Ngày hết hiệu lực không hợp lệ.'
  if (!input.agreement) errors.agreement = 'Cần chọn căn cứ đại diện.'
  if (!['Incoming', 'Active'].includes(input.status)) errors.status = 'Trạng thái khởi tạo không hợp lệ.'
  if (input.status === 'Active' && String(input.publicRemarks ?? '').trim().length < 20) errors.publicRemarks = 'Listing gửi duyệt Active cần mô tả công khai tối thiểu 20 ký tự.'
  if (!input.consent) errors.consent = 'Cần ghi nhận consent trước khi submit.'
  return errors
}

export function assertTransition({ from, to, role, reason }) {
  if (!String(reason ?? '').trim()) {
    const error = new Error('Lý do chuyển trạng thái là bắt buộc.')
    error.code = 'REASON_REQUIRED'
    throw error
  }
  if (!allowedTransitions(from, role).includes(to)) {
    const error = new Error(`Vai trò ${role} không được chuyển ${from} sang ${to}.`)
    error.code = 'TRANSITION_FORBIDDEN'
    throw error
  }
  return { from, to, reason: String(reason).trim() }
}

export function initialStatusFor(actorRole, requestedStatus) {
  if (requestedStatus !== 'Active') return 'Incoming'
  return actorRole === 'broker' || actorRole === 'steward' ? 'Active' : 'Submitted'
}

export function projectPropertyForActor(property, actorOrRole) {
  const projected = structuredClone(property)
  const role = typeof actorOrRole === 'string' ? actorOrRole : actorOrRole.role
  const actorName = typeof actorOrRole === 'string' ? null : actorOrRole.name
  const listing = projected.currentListing
  const responsibleAgent = role === 'agent' && listing?.agent === actorName

  if (role === 'public' || role === 'buyer') {
    if (listing) delete listing.privateRemarks
    delete projected.audit
    projected.history = projected.history.filter((item) => ['Active', 'Closed'].includes(item.status))
    for (const item of projected.history) {
      delete item.statusEvents
      if (item.closingRecord) delete item.closingRecord.source
    }
    if (projected.intelligence) delete projected.intelligence.sourceEvents
  } else if (['bank', 'developer'].includes(role)) {
    if (listing) delete listing.privateRemarks
    delete projected.audit
  } else if (role === 'seller') {
    if (listing) delete listing.privateRemarks
    delete projected.audit
    for (const item of projected.history) {
      delete item.statusEvents
      if (item.closingRecord) delete item.closingRecord.source
    }
    if (projected.intelligence) {
      projected.intelligence.sourceEvents = projected.intelligence.sourceEvents.filter((event) => event.visibility === 'Public')
    }
  } else if (role === 'regulator') {
    if (listing) delete listing.privateRemarks
  } else if (role === 'agent' && !responsibleAgent) {
    if (listing) delete listing.privateRemarks
  }

  if (listing) projected.allowedTransitions = allowedTransitions(listing.status, role)
  return projected
}
