// @ts-check

const CORE_CAPABILITIES = Object.freeze([
  {
    id: 'work-queue',
    group: 'Công việc VMLS',
    name: 'Công việc theo vai trò',
    description: 'Hồ sơ, việc cần làm, phụ trách và hạn xử lý trong phạm vi của vai trò.',
    roles: ['agent', 'brokerage', 'seller', 'buyer', 'bank', 'developer', 'vmls'],
    mode: 'interactive',
    page: 'cong-viec',
    iconName: 'document',
  },
  {
    id: 'property-registry',
    group: 'Công việc VMLS',
    name: 'Bất động sản & định danh',
    description: 'Tra cứu NPID, dữ liệu Bất động sản và quan hệ với Tin bán, Giao dịch.',
    roles: ['agent', 'brokerage', 'seller', 'vmls'],
    mode: 'interactive',
    page: 'bat-dong-san',
    iconName: 'property',
  },
  {
    id: 'represented-inventory',
    group: 'Công việc VMLS',
    name: 'Nguồn hàng được đại diện',
    description: 'Tra cứu Tin bán còn hiệu lực, đã xác nhận đại diện và mở hợp tác bán.',
    roles: ['agent', 'brokerage'],
    mode: 'interactive',
    page: 'nguon-hang',
    iconName: 'listing',
  },
  {
    id: 'listing-registry',
    group: 'Công việc VMLS',
    name: 'Danh sách Tin bán',
    description: 'Theo dõi PLID, trạng thái và quan hệ với Bất động sản trong phạm vi vai trò.',
    roles: ['agent', 'brokerage', 'seller', 'vmls'],
    mode: 'interactive',
    page: 'tin-ban',
    iconName: 'listing',
  },
  {
    id: 'seller-listing-governance',
    group: 'Công việc VMLS',
    name: 'Tin bán của tôi',
    description: 'Chọn dữ liệu được công khai và gửi yêu cầu chỉnh sửa Tin bán đến Sàn.',
    roles: ['seller'],
    mode: 'interactive',
    page: 'tin-ban-cua-toi',
    iconName: 'listing',
  },
  {
    id: 'buyer-declaration',
    group: 'Công việc VMLS',
    name: 'Khai báo Người mua & bàn giao VPCC',
    description: 'Khai báo Người mua, kiểm tra mức sẵn sàng và chuyển hồ sơ đến hệ thống công chứng.',
    roles: ['brokerage'],
    mode: 'interactive',
    page: 'cong-viec',
    iconName: 'document',
  },
  {
    id: 'co-broker-registration',
    group: 'Công việc VMLS',
    name: 'Đăng ký cùng bán',
    description: 'Ghi nhận Môi giới hợp tác trên một PLID mà không thay thế quyền đại diện gốc.',
    roles: ['agent'],
    mode: 'interactive',
    page: 'nguon-hang',
    iconName: 'representation',
  },
  {
    id: 'listing-distribution',
    group: 'Công việc VMLS',
    name: 'Phân phối Tin bán',
    description: 'Kiểm tra quyền, dữ liệu công khai và trạng thái gửi theo từng kênh.',
    roles: ['agent', 'brokerage'],
    mode: 'interactive',
    modeByRole: { agent: 'interactive', brokerage: 'eventOnly' },
    page: 'nguon-hang',
    iconName: 'listing-distribution',
  },
  {
    id: 'transactions',
    group: 'Công việc VMLS',
    name: 'Giao dịch & chuyển quyền',
    description: 'Theo dõi PTID, kết quả công chứng và tuyến xử lý chuyển quyền.',
    roles: ['agent', 'buyer', 'vmls'],
    mode: 'interactive',
    iconName: 'transactions',
    pageByRole: {
      agent: 'giao-dich',
      buyer: 'giao-dich',
      vmls: 'giao-dich',
    },
  },
  {
    id: 'notary-dossiers',
    group: 'Công việc VMLS',
    name: 'Theo dõi hồ sơ công chứng',
    description: 'Xem trạng thái hồ sơ được đồng bộ từ hệ thống nghiệp vụ công chứng.',
    roles: ['notary'],
    mode: 'interactive',
    page: 'cong-viec',
    iconName: 'notary',
  },
  {
    id: 'seller-representation',
    group: 'Công việc VMLS',
    name: 'Quyền đại diện bán',
    description: 'Xem yêu cầu, Người đại diện, phạm vi, thời hạn và ghi nhận xác nhận.',
    roles: ['seller'],
    mode: 'interactive',
    page: 'cong-viec',
    iconName: 'representation',
  },
  {
    id: 'buyer-readiness',
    group: 'Công việc VMLS',
    name: 'Sẵn sàng công chứng',
    description: 'Kiểm tra thông tin hợp đồng, định danh và danh mục xác nhận trước công chứng.',
    roles: ['buyer'],
    mode: 'interactive',
    page: 'cong-viec',
    iconName: 'document',
  },
  {
    id: 'finance-projection',
    group: 'Công việc VMLS',
    name: 'Hồ sơ tài chính được chia sẻ',
    description: 'Xem đúng phần dữ liệu tài chính mà Người mua đã đồng ý chia sẻ.',
    roles: ['bank'],
    mode: 'interactive',
    page: 'cong-viec',
    iconName: 'bank',
  },
  {
    id: 'developer-transfers',
    group: 'Công việc VMLS',
    name: 'Chuyển nhượng HĐMB',
    description: 'Tiếp nhận hồ sơ, xác nhận chuyển nhượng và bàn giao HĐMB mới.',
    roles: ['developer'],
    mode: 'interactive',
    page: 'chuyen-quyen',
    iconName: 'developer-contract',
  },
  {
    id: 'land-registration',
    group: 'Công việc VMLS',
    name: 'Theo dõi đăng ký biến động',
    description: 'Xem trạng thái hồ sơ được đồng bộ từ hệ thống đăng ký đất đai.',
    roles: ['landRegistry'],
    mode: 'interactive',
    page: 'cong-viec',
    iconName: 'land-registry',
  },
  {
    id: 'tax-dossiers',
    group: 'Công việc VMLS',
    name: 'Theo dõi nghĩa vụ tài chính',
    description: 'Xem trạng thái hồ sơ được đồng bộ từ hệ thống của Cơ quan thuế.',
    roles: ['tax'],
    mode: 'interactive',
    page: 'cong-viec',
    iconName: 'tax',
  },
  {
    id: 'integration-registry',
    group: 'Công việc VMLS',
    name: 'Kết nối & nguồn dữ liệu',
    description: 'Kiểm tra nguồn, chiều dữ liệu, phạm vi trao đổi và ảnh chụp tham chiếu.',
    roles: ['vmls'],
    mode: 'interactive',
    page: 'nguon-du-lieu',
    iconName: 'database',
  },
  {
    id: 'processing-audit',
    group: 'Công việc VMLS',
    name: 'Nhật ký xử lý',
    description: 'Đối chiếu các mốc trạng thái và lịch sử thao tác trên hồ sơ.',
    roles: ['vmls'],
    mode: 'interactive',
    page: 'nhat-ky',
    iconName: 'document',
  },
])

const CONNECTION_CAPABILITIES = Object.freeze([
  {
    id: 'vneid',
    group: 'Kết nối theo hồ sơ',
    name: 'VNeID',
    description: 'Điểm nhận kết quả xác nhận của Người bán.',
    roles: ['agent', 'seller', 'vmls'],
    mode: 'readOnly',
    connectionId: 'vneid',
    iconName: 'vneid',
    actionLabel: 'Xem dữ liệu bàn giao',
  },
  {
    id: 'source-357',
    group: 'Kết nối theo hồ sơ',
    name: 'Hệ thống thông tin 357',
    description: 'Nguồn cấp NPID và dữ liệu Bất động sản có thông tin xuất xứ.',
    roles: ['agent', 'brokerage', 'seller', 'buyer', 'developer', 'vmls'],
    mode: 'readOnly',
    connectionId: 'source-357',
    iconName: 'source-357',
    actionLabel: 'Xem ảnh chụp',
  },
  {
    id: 'housenow',
    group: 'Kết nối theo hồ sơ',
    name: 'HouseNow',
    description: 'Kênh nhận dữ liệu công khai của Tin bán khi đủ điều kiện phân phối.',
    roles: ['agent', 'brokerage', 'vmls'],
    mode: 'readOnly',
    connectionId: 'housenow',
    iconName: 'housenow',
    actionLabel: 'Xem phạm vi phân phối',
  },
  {
    id: 'notary',
    group: 'Kết nối theo hồ sơ',
    name: 'Văn phòng công chứng',
    description: 'Tiếp nhận thành phần hồ sơ và trả mã hợp đồng đã ký.',
    roles: ['agent', 'brokerage', 'seller', 'buyer', 'notary', 'vmls'],
    mode: 'eventOnly',
    iconName: 'notary',
    owner: 'Văn phòng công chứng',
    direction: 'Gửi hồ sơ · Nhận mã hợp đồng',
  },
  {
    id: 'tax',
    group: 'Kết nối theo hồ sơ',
    name: 'Thuế',
    description: 'Tiếp nhận sự kiện nghĩa vụ tài chính của Giao dịch.',
    roles: ['agent', 'brokerage', 'seller', 'buyer', 'tax', 'vmls'],
    mode: 'eventOnly',
    iconName: 'tax',
    owner: 'Cơ quan thuế',
    direction: 'Gửi sự kiện · Nhận trạng thái',
  },
  {
    id: 'land-registry',
    group: 'Kết nối theo hồ sơ',
    name: 'Văn phòng đăng ký đất đai',
    description: 'Nhận hồ sơ đã định tuyến và trả kết quả đăng ký biến động.',
    roles: ['agent', 'seller', 'buyer', 'landRegistry', 'vmls'],
    mode: 'eventOnly',
    iconName: 'land-registry',
    owner: 'Văn phòng đăng ký đất đai',
    direction: 'Gửi hồ sơ · Nhận kết quả',
  },
  {
    id: 'developer-contract',
    group: 'Kết nối theo hồ sơ',
    name: 'Chủ đầu tư · HĐMB',
    description: 'Tiếp nhận và xác nhận chuyển nhượng hợp đồng mua bán.',
    roles: ['agent', 'seller', 'buyer', 'developer', 'vmls'],
    mode: 'eventOnly',
    iconName: 'developer-contract',
    owner: 'Chủ đầu tư dự án',
    direction: 'Gửi hồ sơ · Nhận xác nhận',
  },
])

const EXPANSION_CAPABILITIES = Object.freeze([
  ['maps', 'Bản đồ & thửa đất', 'Tra cứu lớp bản đồ và quan hệ thửa đất.'],
  ['showings', 'Đặt lịch xem', 'Điều phối lịch xem và phản hồi sau buổi xem.'],
  ['cma', 'CMA & báo cáo', 'Lập bộ so sánh và báo cáo phân tích thị trường.'],
  ['transaction-room', 'Hồ sơ giao dịch', 'Không gian tài liệu và phối hợp giao dịch.'],
].map(([id, name, description]) => ({
  id,
  group: 'Mở rộng',
  name,
  description,
  roles: [],
  mode: 'unconfigured',
})))

export const capabilityCatalog = Object.freeze([
  ...CORE_CAPABILITIES,
  ...CONNECTION_CAPABILITIES,
  ...EXPANSION_CAPABILITIES,
])

/**
 * Project the catalog for one active role. Unavailable modules remain visible
 * as plain records so the hub explains the wider system without fake actions.
 * @param {string} roleId
 * @param {{represented?: number, registered?: number, distributed?: number}} [counts]
 */
export function projectCapabilitiesForRole(roleId, counts = {}) {
  return capabilityCatalog.map((capability) => {
    const configured = /** @type {Record<string, any>} */ (capability)
    const allowed = capability.roles.includes(roleId)
    const configuredMode = configured.modeByRole?.[roleId] ?? capability.mode
    const mode = allowed ? configuredMode : capability.mode === 'unconfigured' ? 'unconfigured' : 'eventOnly'
    const page = configured.pageByRole?.[roleId] ?? configured.page
    const status = capability.id === 'represented-inventory'
      ? `${counts.represented ?? 0} Tin bán`
      : capability.id === 'co-broker-registration'
        ? allowed ? `${counts.registered ?? 0} đã đăng ký` : 'Không thuộc vai trò'
        : capability.id === 'listing-distribution'
          ? roleId === 'brokerage'
            ? 'Theo dõi trạng thái'
            : `${counts.distributed ?? 0} đã gửi`
          : mode === 'interactive'
            ? 'Sẵn sàng'
            : mode === 'readOnly'
              ? 'Xem dữ liệu'
              : mode === 'unconfigured'
                ? 'Chưa cấu hình'
                : allowed
                  ? 'Theo dõi theo hồ sơ'
                  : 'Không thuộc vai trò'

    return {
      ...capability,
      mode,
      status,
      route: mode === 'interactive' && page ? `#/vai-tro/${roleId}/${page}` : null,
      relevant: allowed,
    }
  })
}
