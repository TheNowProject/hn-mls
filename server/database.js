import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { intelligenceSeed, properties as seedProperties, qualityIssues as seedIssues } from '../src/data/mockData.js'
import { assertTransition, initialStatusFor, projectPropertyForActor, validateListingInput } from './domain/listingLifecycle.js'

const terminalStatuses = new Set(['Closed', 'Withdrawn', 'Expired'])

function formatDisplayDate(isoDate) {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

function nowDisplay() {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date())
}

function displayDateValue(value) {
  const [datePart] = String(value ?? '').split(',')
  const parts = datePart.trim().split(/[/-]/).map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return 0
  const [first, second, third] = parts
  return first > 1900 ? Date.UTC(first, second - 1, third) : Date.UTC(third, second - 1, first)
}

function moneyLabel(value) {
  if (!Number.isFinite(Number(value))) return null
  const number = Number(value)
  if (number >= 1_000_000_000) return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(number / 1_000_000_000)} tỷ`
  if (number >= 1_000_000) return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(number / 1_000_000)} triệu`
  return new Intl.NumberFormat('vi-VN').format(number)
}

function asListing(row) {
  if (!row) return null
  return {
    id: row.id,
    status: row.status,
    price: row.price,
    priceLabel: row.price_label,
    pricePerArea: row.price_per_area,
    daysOnMarket: row.days_on_market,
    listedAt: row.listed_at,
    expiresAt: row.expires_at,
    agreement: row.agreement,
    agent: row.agent,
    brokerage: row.brokerage,
    publicRemarks: row.public_remarks,
    privateRemarks: row.private_remarks,
    distributionChannels: row.distribution_channels,
  }
}

export function createMlsStore({ dbPath = 'var/housenow-mls.sqlite' } = {}) {
  if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true })
  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;')
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      market TEXT NOT NULL DEFAULT 'hcm',
      parcel_id TEXT NOT NULL,
      title TEXT NOT NULL,
      address TEXT NOT NULL,
      project TEXT,
      unit TEXT,
      type TEXT NOT NULL,
      area REAL NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      orientation TEXT,
      verification TEXT NOT NULL,
      confidence TEXT NOT NULL,
      quality_score INTEGER NOT NULL,
      source TEXT NOT NULL,
      source_updated_at TEXT NOT NULL,
      image TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS listings (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id),
      kind TEXT NOT NULL DEFAULT 'Chào bán',
      status TEXT NOT NULL,
      price REAL,
      price_label TEXT NOT NULL,
      price_per_area TEXT,
      days_on_market INTEGER NOT NULL DEFAULT 0,
      listed_at TEXT,
      expires_at TEXT,
      agreement TEXT,
      agent TEXT,
      brokerage TEXT,
      public_remarks TEXT,
      private_remarks TEXT,
      distribution_channels INTEGER NOT NULL DEFAULT 0,
      period TEXT,
      is_current INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_listings_property ON listings(property_id, is_current);
    CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
    CREATE TABLE IF NOT EXISTS listing_status_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id TEXT NOT NULL REFERENCES listings(id),
      from_status TEXT,
      to_status TEXT NOT NULL,
      actor TEXT NOT NULL,
      role TEXT NOT NULL,
      reason TEXT NOT NULL,
      occurred_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS audit_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id TEXT NOT NULL REFERENCES properties(id),
      listing_id TEXT,
      action TEXT NOT NULL,
      actor TEXT NOT NULL,
      role TEXT NOT NULL,
      reason TEXT NOT NULL,
      occurred_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS closing_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id TEXT NOT NULL UNIQUE REFERENCES listings(id),
      close_price REAL,
      close_date TEXT NOT NULL,
      created_by TEXT NOT NULL,
      source TEXT,
      verification_state TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS listing_price_events (
      event_key TEXT PRIMARY KEY,
      listing_id TEXT NOT NULL REFERENCES listings(id),
      from_price REAL,
      to_price REAL NOT NULL,
      effective_at TEXT NOT NULL,
      actor TEXT NOT NULL,
      reason TEXT NOT NULL,
      source TEXT NOT NULL,
      confidence TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_price_events_listing ON listing_price_events(listing_id, effective_at);
    CREATE TABLE IF NOT EXISTS property_source_events (
      event_key TEXT PRIMARY KEY,
      property_id TEXT NOT NULL REFERENCES properties(id),
      event_type TEXT NOT NULL,
      summary TEXT NOT NULL,
      effective_at TEXT NOT NULL,
      source TEXT NOT NULL,
      confidence TEXT NOT NULL,
      visibility TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS quality_issues (
      code TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      record_id TEXT NOT NULL,
      type TEXT NOT NULL,
      owner TEXT NOT NULL,
      due TEXT NOT NULL,
      level TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `)

  function ensureColumn(table, column, definition) {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all()
    if (!columns.some((item) => item.name === column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  }

  ensureColumn('closing_records', 'source', 'TEXT')
  ensureColumn('closing_records', 'verification_state', 'TEXT')
  ensureColumn('properties', 'market', "TEXT NOT NULL DEFAULT 'hcm'")

  function seed() {
    const propertyInsert = db.prepare(`INSERT INTO properties
        (id, market, parcel_id, title, address, project, unit, type, area, bedrooms, bathrooms, orientation, verification, confidence, quality_score, source, source_updated_at, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      const listingInsert = db.prepare(`INSERT INTO listings
        (id, property_id, kind, status, price, price_label, price_per_area, days_on_market, listed_at, expires_at, agreement, agent, brokerage, public_remarks, private_remarks, distribution_channels, period, is_current)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      const auditInsert = db.prepare(`INSERT INTO audit_events
        (property_id, listing_id, action, actor, role, reason, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      const issueInsert = db.prepare(`INSERT OR IGNORE INTO quality_issues
        (code, title, record_id, type, owner, due, level, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)

      db.exec('BEGIN')
      try {
        for (const property of seedProperties) {
          if (db.prepare('SELECT 1 FROM properties WHERE id = ?').get(property.id)) continue
          propertyInsert.run(property.id, property.market ?? 'hcm', property.parcelId, property.title, property.address, property.project, property.unit, property.type, property.area, property.bedrooms, property.bathrooms, property.orientation, property.verification, property.confidence, property.qualityScore, property.source, property.sourceUpdatedAt, property.image)
          const current = property.currentListing
          if (current) {
            const currentHistory = property.history.find((item) => item.listingId === current.id)
            listingInsert.run(current.id, property.id, currentHistory?.type ?? 'Chào bán', current.status, current.price, current.priceLabel, current.pricePerArea, current.daysOnMarket, current.listedAt, current.expiresAt, current.agreement, current.agent, current.brokerage, current.publicRemarks, current.privateRemarks, current.distributionChannels ?? 0, currentHistory?.period ?? `${current.listedAt} đến nay`, 1)
          }
          for (const history of property.history) {
            if (history.listingId === current?.id) continue
            listingInsert.run(history.listingId, property.id, history.type, history.status, null, history.price, null, 0, null, null, null, null, null, null, null, 0, history.period, 0)
          }
          for (const event of property.audit) auditInsert.run(property.id, current?.id ?? null, event.action, event.actor, event.role, event.reason, event.time)
        }
        for (const issue of seedIssues) issueInsert.run(issue.code, issue.title, issue.record, issue.type, issue.owner, issue.due, issue.level, issue.status)
        db.exec('COMMIT')
      } catch (error) {
        db.exec('ROLLBACK')
        throw error
      }

    const priceEventInsert = db.prepare(`INSERT OR IGNORE INTO listing_price_events
      (event_key, listing_id, from_price, to_price, effective_at, actor, reason, source, confidence)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    const closingInsert = db.prepare(`INSERT OR IGNORE INTO closing_records
      (listing_id, close_price, close_date, created_by, source, verification_state)
      VALUES (?, ?, ?, ?, ?, ?)`)
    const sourceEventInsert = db.prepare(`INSERT OR IGNORE INTO property_source_events
      (event_key, property_id, event_type, summary, effective_at, source, confidence, visibility)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    for (const event of intelligenceSeed.priceEvents) priceEventInsert.run(event.key, event.listingId, event.fromPrice, event.toPrice, event.effectiveAt, event.actor, event.reason, event.source, event.confidence)
    for (const record of intelligenceSeed.closingRecords) closingInsert.run(record.listingId, record.closePrice, record.closeDate, record.createdBy, record.source, record.verification)
    for (const event of intelligenceSeed.sourceEvents) sourceEventInsert.run(event.key, event.propertyId, event.type, event.summary, event.effectiveAt, event.source, event.confidence, event.visibility)
  }

  function propertyRows() {
    return db.prepare('SELECT * FROM properties ORDER BY source_updated_at DESC, id DESC').all()
  }

  function hydrateProperty(row, { includeIntelligence = false } = {}) {
    const listingRows = db.prepare('SELECT * FROM listings WHERE property_id = ? ORDER BY is_current DESC, id DESC').all(row.id)
    const currentRow = listingRows.find((item) => item.is_current === 1)
    const auditRows = db.prepare('SELECT * FROM audit_events WHERE property_id = ? ORDER BY id DESC').all(row.id)
    const property = {
      id: row.id,
      market: row.market ?? 'hcm',
      parcelId: row.parcel_id,
      title: row.title,
      address: row.address,
      project: row.project,
      unit: row.unit,
      type: row.type,
      area: row.area,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      orientation: row.orientation,
      verification: row.verification,
      confidence: row.confidence,
      qualityScore: row.quality_score,
      source: row.source,
      sourceUpdatedAt: row.source_updated_at,
      image: row.image,
      currentListing: asListing(currentRow),
      history: listingRows.map((item) => {
        const closing = db.prepare('SELECT close_price, close_date, source, verification_state FROM closing_records WHERE listing_id = ?').get(item.id)
        const statusEvents = includeIntelligence
          ? db.prepare('SELECT from_status AS fromStatus, to_status AS toStatus, actor, role, reason, occurred_at AS occurredAt FROM listing_status_events WHERE listing_id = ? ORDER BY id DESC').all(item.id)
          : undefined
        return {
          listingId: item.id,
          type: item.kind,
          status: item.status,
          price: item.price_label,
          listPrice: item.price,
          period: item.period ?? item.listed_at ?? 'Không rõ',
          daysOnMarket: item.days_on_market,
          ...(closing ? { closingRecord: { closePrice: closing.close_price, closePriceLabel: moneyLabel(closing.close_price), closeDate: closing.close_date, source: closing.source, verification: closing.verification_state } } : {}),
          ...(statusEvents ? { statusEvents } : {}),
        }
      }),
      audit: auditRows.map((item) => ({ id: item.id, action: item.action, actor: item.actor, role: item.role, time: item.occurred_at, reason: item.reason })),
    }
    if (includeIntelligence) {
      const priceEvents = currentRow
        ? db.prepare('SELECT event_key AS key, from_price AS fromPrice, to_price AS toPrice, effective_at AS effectiveAt, actor, reason, source, confidence FROM listing_price_events WHERE listing_id = ?').all(currentRow.id).sort((a, b) => displayDateValue(b.effectiveAt) - displayDateValue(a.effectiveAt))
        : []
      const chronologicalPrices = [...priceEvents].reverse()
      const originalPrice = chronologicalPrices[0]?.toPrice ?? currentRow?.price ?? null
      const currentPrice = currentRow?.price ?? chronologicalPrices.at(-1)?.toPrice ?? null
      property.intelligence = {
        priceEvents,
        priceSummary: {
          originalPrice,
          originalPriceLabel: moneyLabel(originalPrice),
          currentPrice,
          currentPriceLabel: moneyLabel(currentPrice),
          changeAmount: currentPrice != null && originalPrice != null ? currentPrice - originalPrice : null,
          changePercent: currentPrice != null && originalPrice ? Number((((currentPrice - originalPrice) / originalPrice) * 100).toFixed(1)) : null,
          lastChangedAt: priceEvents[0]?.effectiveAt ?? currentRow?.listed_at ?? null,
        },
        relistCount: Math.max(0, listingRows.length - 1),
        cumulativeDaysOnMarket: listingRows.reduce((sum, item) => sum + Number(item.days_on_market || 0), 0),
        sourceEvents: db.prepare('SELECT event_key AS key, event_type AS type, summary, effective_at AS effectiveAt, source, confidence, visibility FROM property_source_events WHERE property_id = ?').all(row.id).sort((a, b) => displayDateValue(b.effectiveAt) - displayDateValue(a.effectiveAt)),
        marketSnapshot: {
          scope: `${row.type} tại ${row.market === 'hanoi' ? 'Hà Nội' : 'TP. Hồ Chí Minh'}`,
          comparableCount: row.market === 'hanoi' ? 11 : 8,
          lowPricePerArea: row.market === 'hanoi' ? '78 triệu/m²' : '164 triệu/m²',
          medianPricePerArea: row.market === 'hanoi' ? '96 triệu/m²' : '178 triệu/m²',
          highPricePerArea: row.market === 'hanoi' ? '132 triệu/m²' : '194 triệu/m²',
          medianDaysOnMarket: row.market === 'hanoi' ? 39 : 29,
          asOf: '13/08/2026',
          methodology: 'Candidate mô phỏng; môi giới phải review include/exclude trước khi tạo CMA.',
        },
      }
    }
    return property
  }

  function bootstrap(actor) {
    let properties = propertyRows().map((row) => hydrateProperty(row))
    if (actor.role === 'buyer') properties = properties.filter((property) => property.currentListing?.status === 'Active')
    properties = properties.map((property) => projectPropertyForActor(property, actor))
    const issues = ['broker', 'regulator', 'steward'].includes(actor.role)
      ? db.prepare('SELECT code, title, record_id AS record, type, owner, due, level, status FROM quality_issues WHERE status = ? ORDER BY code DESC').all('Open')
      : []
    return { actor, properties, qualityIssues: issues }
  }

  function publicProperties() {
    return propertyRows()
      .map(hydrateProperty)
      .filter((property) => property.currentListing?.status === 'Active')
      .map((property) => projectPropertyForActor(property, 'public'))
  }

  function propertyDetail(actor, propertyId) {
    const row = db.prepare('SELECT * FROM properties WHERE id = ?').get(propertyId)
    if (!row) {
      const error = new Error('Không tìm thấy Property.')
      error.status = 404
      error.code = 'PROPERTY_NOT_FOUND'
      throw error
    }
    return projectPropertyForActor(hydrateProperty(row, { includeIntelligence: true }), actor)
  }

  function assertListingScope(actor, listingRow) {
    const inScope = actor.role === 'steward'
      || (actor.role === 'broker' && listingRow.brokerage === actor.organization)
      || (actor.role === 'agent' && listingRow.agent === actor.name)
    if (!inScope) {
      const error = new Error('Listing nằm ngoài phạm vi tổ chức hoặc assignment hiện tại.')
      error.status = 403
      error.code = 'RESOURCE_SCOPE_FORBIDDEN'
      throw error
    }
  }

  function nextListingId() {
    const row = db.prepare("SELECT id FROM listings WHERE id LIKE 'HN-LST-2026-%' ORDER BY id DESC LIMIT 1").get()
    const next = row ? Number(row.id.split('-').at(-1)) + 1 : 1
    return `HN-LST-2026-${String(next).padStart(5, '0')}`
  }

  function createListing(actor, input) {
    const errors = validateListingInput(input)
    if (Object.keys(errors).length) {
      const error = new Error('Listing chưa đạt validation rules.')
      error.status = 422
      error.code = 'VALIDATION_FAILED'
      error.details = errors
      throw error
    }
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(input.propertyId)
    if (!property) {
      const error = new Error('Không tìm thấy Property đã chọn.')
      error.status = 404
      error.code = 'PROPERTY_NOT_FOUND'
      throw error
    }
    const conflicting = db.prepare('SELECT id, status FROM listings WHERE property_id = ? AND is_current = 1').get(input.propertyId)
    if (conflicting && !terminalStatuses.has(conflicting.status)) {
      const error = new Error(`Property đang có Listing ${conflicting.id} ở trạng thái ${conflicting.status}.`)
      error.status = 409
      error.code = 'CURRENT_LISTING_CONFLICT'
      throw error
    }

    const id = nextListingId()
    const status = initialStatusFor(actor.role, input.status)
    const price = Number(input.price)
    const priceLabel = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price).replace('₫', '').trim()
    const pricePerArea = `${Math.round(price / property.area / 1000000)} triệu/m²`
    const occurredAt = nowDisplay()
    const listedAt = formatDisplayDate(new Date().toISOString().slice(0, 10))
    db.exec('BEGIN')
    try {
      db.prepare('UPDATE listings SET is_current = 0 WHERE property_id = ?').run(input.propertyId)
      db.prepare(`INSERT INTO listings
        (id, property_id, kind, status, price, price_label, price_per_area, days_on_market, listed_at, expires_at, agreement, agent, brokerage, public_remarks, private_remarks, distribution_channels, period, is_current)
        VALUES (?, ?, 'Chào bán', ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`)
        .run(id, input.propertyId, status, price, priceLabel, pricePerArea, listedAt, formatDisplayDate(input.expiresAt), input.agreement, actor.name, actor.organization, input.publicRemarks, input.privateRemarks, status === 'Active' ? 1 : 0, `${listedAt} đến nay`)
      db.prepare('INSERT INTO listing_status_events (listing_id, from_status, to_status, actor, role, reason, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(id, null, status, actor.name, actor.roleLabel, 'Tạo từ Property hiện hữu', occurredAt)
      db.prepare('INSERT INTO audit_events (property_id, listing_id, action, actor, role, reason, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(input.propertyId, id, `Listing chuyển sang ${status}`, actor.name, actor.roleLabel, status === 'Submitted' ? 'Gửi brokerage review' : 'Đạt minimum submission rules', occurredAt)
      db.exec('COMMIT')
    } catch (error) {
      db.exec('ROLLBACK')
      throw error
    }
    return projectPropertyForActor(hydrateProperty(property, { includeIntelligence: true }), actor)
  }

  function transitionListing(actor, listingId, input) {
    const current = db.prepare('SELECT * FROM listings WHERE id = ?').get(listingId)
    if (!current) {
      const error = new Error('Không tìm thấy Listing.')
      error.status = 404
      error.code = 'LISTING_NOT_FOUND'
      throw error
    }
    assertListingScope(actor, current)
    assertTransition({ from: current.status, to: input.to, role: actor.role, reason: input.reason })
    const occurredAt = nowDisplay()
    db.exec('BEGIN')
    try {
      db.prepare('UPDATE listings SET status = ?, distribution_channels = ? WHERE id = ?')
        .run(input.to, input.to === 'Active' ? Math.max(current.distribution_channels, 1) : input.to === 'Closed' || input.to === 'Withdrawn' ? 0 : current.distribution_channels, listingId)
      db.prepare('INSERT INTO listing_status_events (listing_id, from_status, to_status, actor, role, reason, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(listingId, current.status, input.to, actor.name, actor.roleLabel, input.reason.trim(), occurredAt)
      db.prepare('INSERT INTO audit_events (property_id, listing_id, action, actor, role, reason, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(current.property_id, listingId, `${current.status} chuyển sang ${input.to}`, actor.name, actor.roleLabel, input.reason.trim(), occurredAt)
      if (input.to === 'Closed') {
        db.prepare('INSERT INTO closing_records (listing_id, close_price, close_date, created_by, source, verification_state) VALUES (?, ?, ?, ?, ?, ?)')
          .run(listingId, Number(input.closePrice) || current.price, input.effectiveDate || new Date().toISOString().slice(0, 10), actor.name, 'Brokerage closing workflow', 'Broker confirmed')
      }
      db.exec('COMMIT')
    } catch (error) {
      db.exec('ROLLBACK')
      throw error
    }
    return projectPropertyForActor(hydrateProperty(db.prepare('SELECT * FROM properties WHERE id = ?').get(current.property_id), { includeIntelligence: true }), actor)
  }

  seed()
  return { bootstrap, publicProperties, propertyDetail, createListing, transitionListing, close: () => db.close() }
}
