import { createServer as createNodeServer } from 'node:http'
import { authenticate, createDemoSession, requireRole } from './auth.js'

function json(response, status, body) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'access-control-allow-origin': 'http://127.0.0.1:5180',
    'access-control-allow-headers': 'authorization, content-type',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
  })
  response.end(JSON.stringify(body))
}

async function readBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 1_000_000) {
      const error = new Error('Request body vượt quá giới hạn 1 MB.')
      error.status = 413
      throw error
    }
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    const error = new Error('Request body phải là JSON hợp lệ.')
    error.status = 400
    throw error
  }
}

function errorResponse(error) {
  return {
    error: {
      code: error.code ?? 'INTERNAL_ERROR',
      message: error.status ? error.message : 'Hệ thống không thể hoàn tất yêu cầu.',
      details: error.details,
    },
  }
}

export function createHttpServer({ store }) {
  return createNodeServer(async (request, response) => {
    try {
      if (request.method === 'OPTIONS') return json(response, 204, {})
      const url = new URL(request.url, 'http://localhost')

      if (request.method === 'GET' && url.pathname === '/api/health') {
        return json(response, 200, { ok: true, database: 'connected', time: new Date().toISOString() })
      }

      if (request.method === 'POST' && url.pathname === '/api/session') {
        const body = await readBody(request)
        return json(response, 200, createDemoSession(body.roleId))
      }

      if (request.method === 'GET' && url.pathname === '/api/public/properties') {
        return json(response, 200, { properties: store.publicProperties() })
      }

      const actor = authenticate(request)

      if (request.method === 'GET' && url.pathname === '/api/bootstrap') {
        return json(response, 200, store.bootstrap(actor))
      }

      const propertyDetailMatch = url.pathname.match(/^\/api\/properties\/([^/]+)\/intelligence$/)
      if (request.method === 'GET' && propertyDetailMatch) {
        return json(response, 200, { property: store.propertyDetail(actor, decodeURIComponent(propertyDetailMatch[1])) })
      }

      if (request.method === 'POST' && url.pathname === '/api/listings') {
        requireRole(actor, ['agent', 'broker', 'steward'])
        return json(response, 201, { property: store.createListing(actor, await readBody(request)) })
      }

      const transitionMatch = url.pathname.match(/^\/api\/listings\/([^/]+)\/transitions$/)
      if (request.method === 'POST' && transitionMatch) {
        requireRole(actor, ['agent', 'broker', 'steward'])
        return json(response, 200, { property: store.transitionListing(actor, decodeURIComponent(transitionMatch[1]), await readBody(request)) })
      }

      return json(response, 404, { error: { code: 'NOT_FOUND', message: 'Endpoint không tồn tại.' } })
    } catch (error) {
      if (!error.status && ['TRANSITION_FORBIDDEN', 'REASON_REQUIRED'].includes(error.code)) error.status = error.code === 'TRANSITION_FORBIDDEN' ? 403 : 422
      if (!error.status) console.error(error)
      return json(response, error.status ?? 500, errorResponse(error))
    }
  })
}
