const sessions = {
  'demo-agent': { userId: 'USR-001', name: 'Nguyễn Minh An', role: 'agent', roleLabel: 'Môi giới', organization: 'HouseNow Partners' },
  'demo-broker': { userId: 'USR-002', name: 'Lê Hoàng Phúc', role: 'broker', roleLabel: 'Sàn môi giới', organization: 'HouseNow Partners' },
  'demo-developer': { userId: 'USR-003', name: 'Phạm Thu Hà', role: 'developer', roleLabel: 'Chủ đầu tư', organization: 'Nova Habitat' },
  'demo-bank': { userId: 'USR-004', name: 'Đặng Đức Long', role: 'bank', roleLabel: 'Ngân hàng', organization: 'Ngân hàng Đại Việt' },
  'demo-regulator': { userId: 'USR-005', name: 'Vũ Minh Châu', role: 'regulator', roleLabel: 'Cơ quan quản lý', organization: 'Cơ quan quản lý mô phỏng' },
  'demo-buyer': { userId: 'USR-006', name: 'Trần Thảo Vy', role: 'buyer', roleLabel: 'Người mua', organization: 'Không gian cá nhân' },
  'demo-steward': { userId: 'USR-007', name: 'Trần Gia Hân', role: 'steward', roleLabel: 'Data Steward', organization: 'HouseNow MLS' },
}

export function createDemoSession(roleId) {
  const token = `demo-${roleId}`
  const actor = sessions[token]
  if (!actor) {
    const error = new Error('Vai trò đăng nhập không hợp lệ.')
    error.status = 400
    throw error
  }
  return { token, actor }
}

export function authenticate(request) {
  const authorization = request.headers.authorization ?? ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  const actor = sessions[token]
  if (!actor) {
    const error = new Error('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.')
    error.status = 401
    error.code = 'UNAUTHENTICATED'
    throw error
  }
  return actor
}

export function requireRole(actor, roles) {
  if (!roles.includes(actor.role)) {
    const error = new Error('Bạn không có quyền thực hiện thao tác này trong tổ chức hiện tại.')
    error.status = 403
    error.code = 'FORBIDDEN'
    throw error
  }
}
