import { useMemo, useState } from 'react'
import { Button } from '@fluentui/react-components'
import {
  ArrowRight,
  CalendarCheck,
  ChartLineUp,
  Check,
  CheckCircle,
  Clock,
  Database,
  Funnel,
  HouseLine,
  LockKey,
  MagnifyingGlass,
  Plus,
  ShieldCheck,
  SquaresFour,
  Warning,
  X,
} from '@phosphor-icons/react'

const contactsByMarket = {
  hcm: [
    { id: 'CL-2408', name: 'Trần Thảo Vy', initials: 'TV', need: 'Căn hộ 2-3 PN · Thủ Thiêm', budget: '12-16 tỷ', matches: 8, stage: 'Đang xem nhà', next: 'Hôm nay · 17:30', saved: 5 },
    { id: 'CL-2391', name: 'Nguyễn Quốc Khánh', initials: 'QK', need: 'Nhà phố · Thảo Điền, An Phú', budget: '25-40 tỷ', matches: 12, stage: 'Đã qualification', next: 'Ngày mai · 09:00', saved: 4 },
    { id: 'CL-2377', name: 'Lê Thanh Hà', initials: 'TH', need: 'Căn hộ cho thuê · Quận 1-3', budget: '35-55 triệu/tháng', matches: 6, stage: 'Chờ feedback', next: '15/08 · 14:00', saved: 3 },
    { id: 'CL-2356', name: 'Phạm Gia Minh', initials: 'GM', need: 'Shophouse trung tâm', budget: '120-200 tỷ', matches: 3, stage: 'NDA đã ký', next: '16/08 · 10:30', saved: 2 },
  ],
  hanoi: [
    { id: 'CL-HN-812', name: 'Vũ Minh Trang', initials: 'MT', need: 'Căn hộ 3 PN · Ba Đình', budget: '14-20 tỷ', matches: 9, stage: 'Đang xem nhà', next: 'Hôm nay · 18:00', saved: 6 },
    { id: 'CL-HN-798', name: 'Đặng Hoàng Nam', initials: 'HN', need: 'Biệt thự · Tây Hồ', budget: '55-90 tỷ', matches: 7, stage: 'Đã qualification', next: 'Ngày mai · 10:00', saved: 4 },
    { id: 'CL-HN-774', name: 'Bùi Thu Hương', initials: 'TH', need: 'Căn hộ · Cầu Giấy, Nam Từ Liêm', budget: '6-10 tỷ', matches: 14, stage: 'Shortlist', next: '15/08 · 15:30', saved: 7 },
    { id: 'CL-HN-751', name: 'Phan Đức Long', initials: 'ĐL', need: 'Nhà phố · Hoàn Kiếm', budget: '40-65 tỷ', matches: 5, stage: 'Chờ feedback', next: '17/08 · 09:00', saved: 3 },
  ],
}

const members = [
  { name: 'Nguyễn Minh An', initials: 'MA', role: 'Môi giới', scope: 'Assigned listings · HCM', status: 'Đang hoạt động', last: '7 phút trước' },
  { name: 'Lê Hoàng Phúc', initials: 'HP', role: 'Quản lý sàn', scope: 'HouseNow Partners', status: 'Đang hoạt động', last: '18 phút trước' },
  { name: 'Trần Gia Hân', initials: 'GH', role: 'Data Steward', scope: 'HCM + Hà Nội', status: 'Đang hoạt động', last: '32 phút trước' },
  { name: 'Phạm Khánh Linh', initials: 'KL', role: 'Môi giới', scope: 'Assigned listings · HCM', status: 'Đang hoạt động', last: '1 giờ trước' },
  { name: 'Vũ Thanh Tâm', initials: 'TT', role: 'Môi giới', scope: 'Assigned listings · Hà Nội', status: 'Đang hoạt động', last: '2 giờ trước' },
  { name: 'Hoàng Đức Anh', initials: 'ĐA', role: 'Reviewer', scope: 'Quality Queue · Hà Nội', status: 'Tạm khóa', last: '12/08/2026' },
]

const apps = [
  { id: 'core', icon: HouseLine, title: 'MLS Core', label: 'Property & Listing', body: 'Tìm canonical Property, quản lý Listing lifecycle và xem audit timeline.', target: 'discover', action: 'Mở Property discovery', tone: 'green' },
  { id: 'cma', icon: ChartLineUp, title: 'CMA Studio', label: 'Pricing workflow', body: 'Chọn comparable, ghi rationale và lưu báo cáo định giá có thể giải thích.', target: 'analytics', action: 'Tạo báo cáo CMA', tone: 'blue' },
  { id: 'showing', icon: CalendarCheck, title: 'Showing Desk', label: 'Lịch xem', body: 'Điều phối lịch, người tham gia và yêu cầu riêng của từng Listing.', flow: 'showing', action: 'Tạo lịch xem', tone: 'amber' },
  { id: 'distribution', icon: SquaresFour, title: 'Distribution Monitor', label: 'Syndication', body: 'Theo dõi trạng thái phát hành theo từng kênh và consent hiện hành.', target: 'listings', action: 'Xem phân phối', tone: 'violet' },
]

export function ActorWorkspace({ experience, roleId, onOpenFlow }) {
  const [filter, setFilter] = useState('Tất cả')
  if (!experience) return null
  const rows = filter === 'Tất cả' ? experience.rows : experience.rows.filter((row) => row.some((cell) => cell.toLocaleLowerCase('vi').includes(filter.toLocaleLowerCase('vi'))))
  return <section className="work-panel actor-workspace">
    <div className="panel-heading"><div><span className="section-kicker">{experience.kicker}</span><h2>{experience.queueTitle}</h2><p>{experience.description}</p></div><label className="compact-filter"><Funnel /><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>Tất cả</option>{[...new Set(experience.rows.map((row) => row[2]))].map((item) => <option key={item}>{item}</option>)}</select></label></div>
    <ActorTable rows={rows} roleId={roleId} onOpenFlow={onOpenFlow} />
    <div className="governance-note"><ShieldCheck weight="fill" /><span><strong>Governance guardrail</strong>{experience.note}</span></div>
  </section>
}

export function ActorTable({ rows, roleId, onOpenFlow }) {
  return <div className="actor-table"><div className="actor-table-head"><span>Đối tượng</span><span>Giá trị / trạng thái</span><span>Xác minh</span><span>Tín hiệu</span><span>Hành động</span><span /></div>{rows.map((row) => <button key={row.join('-')} onClick={() => onOpenFlow({ type: 'record', title: row[0], eyebrow: 'Hồ sơ theo vai trò', data: row, roleId, success: 'Đã lưu cập nhật vào nhật ký làm việc trong phiên.' })}>{row.map((cell, index) => <span key={`${cell}-${index}`}>{cell}</span>)}<ArrowRight /></button>)}</div>
}

export function ContactsWorkspace({ marketId, onOpenFlow }) {
  const [contacts, setContacts] = useState(contactsByMarket[marketId])
  const [selectedId, setSelectedId] = useState(contacts[0]?.id)
  const [query, setQuery] = useState('')
  const visible = contacts.filter((contact) => `${contact.name} ${contact.need} ${contact.stage}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')))
  const selected = contacts.find((contact) => contact.id === selectedId) ?? visible[0]
  const createClient = () => onOpenFlow({
    type: 'new-client', title: 'Tạo hồ sơ khách hàng', eyebrow: 'Khách hàng mới', success: 'Đã tạo khách hàng và gắn saved search ban đầu.',
    onComplete: (form) => {
      const newContact = { id: `CL-${Date.now().toString().slice(-4)}`, name: form.name, initials: form.name.split(' ').slice(-2).map((part) => part[0]).join(''), need: form.need, budget: form.budget, matches: 0, stage: 'Mới tạo', next: 'Chưa có lịch', saved: 0 }
      setContacts((current) => [newContact, ...current])
      setSelectedId(newContact.id)
    },
  })
  return <div className="module-workspace split-workspace">
    <section className="work-panel workspace-list-panel">
      <div className="workspace-toolbar"><label className="inline-search"><MagnifyingGlass /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm khách hàng hoặc nhu cầu" /></label><Button appearance="primary" icon={<Plus />} onClick={createClient}>Tạo khách hàng</Button></div>
      <div className="contact-list">{visible.map((contact) => <button key={contact.id} className={selected?.id === contact.id ? 'contact-row selected' : 'contact-row'} onClick={() => setSelectedId(contact.id)}><span className="contact-avatar">{contact.initials}</span><span><strong>{contact.name}</strong><small>{contact.need}</small></span><span><strong>{contact.matches} match</strong><small>{contact.stage}</small></span><ArrowRight /></button>)}</div>
    </section>
    {selected && <aside className="work-panel context-panel"><div className="context-hero"><span className="contact-avatar large">{selected.initials}</span><div><span className="section-kicker">{selected.id}</span><h2>{selected.name}</h2><p>{selected.stage}</p></div></div><dl className="context-facts"><div><dt>Nhu cầu</dt><dd>{selected.need}</dd></div><div><dt>Ngân sách</dt><dd>{selected.budget}</dd></div><div><dt>Shortlist</dt><dd>{selected.saved} Property</dd></div><div><dt>Lịch tiếp theo</dt><dd>{selected.next}</dd></div></dl><div className="mini-timeline"><span><CheckCircle weight="fill" /><strong>Nhu cầu đã qualification</strong><small>Budget và khu vực đã được xác nhận</small></span><span><Clock /><strong>{selected.matches} Property đang khớp</strong><small>Saved search cập nhật theo MLS Core</small></span></div><div className="context-actions"><Button appearance="secondary" onClick={() => onOpenFlow({ type: 'record', title: `Cập nhật ${selected.name}`, eyebrow: 'Client note', data: [selected.need, selected.budget, selected.stage, `${selected.saved} Property`, selected.next], success: 'Đã lưu ghi chú và cập nhật next step.' })}>Thêm ghi chú</Button><Button appearance="primary" icon={<CalendarCheck />} onClick={() => onOpenFlow({ type: 'showing', title: `Đặt lịch cho ${selected.name}`, eyebrow: 'Showing Desk', success: 'Đã xác nhận lịch và thêm vào hồ sơ khách hàng.' })}>Đặt lịch xem</Button></div></aside>}
  </div>
}

export function CmaWorkspace({ listings, onSelectProperty }) {
  const eligible = listings.filter((property) => property.currentListing)
  const [subjectId, setSubjectId] = useState(eligible[0]?.id ?? listings[0]?.id)
  const [included, setIncluded] = useState(() => new Set(eligible.slice(1, 4).map((property) => property.id)))
  const [rationale, setRationale] = useState('Ưu tiên cùng loại tài sản, khu vực và khoảng diện tích; loại trừ record thiếu xác minh nguồn.')
  const [report, setReport] = useState(null)
  const subject = listings.find((property) => property.id === subjectId)
  const candidates = useMemo(() => listings.filter((property) => property.id !== subjectId && property.currentListing).slice(0, 7), [listings, subjectId])
  const toggle = (id) => setIncluded((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next })
  const median = candidates.filter((item) => included.has(item.id)).map((item) => item.currentListing.price / item.area).sort((a, b) => a - b)
  const estimate = median.length ? median[Math.floor(median.length / 2)] * subject.area : subject.currentListing?.price
  if (report) return <section className="work-panel cma-report"><header><div><span className="section-kicker">CMA-2026-{String(subject.id).slice(-4)}</span><h2>Khoảng giá tham chiếu đã sẵn sàng</h2><p>Bản phân tích được lưu cùng candidate set và rationale để founder/team review.</p></div><span className="complete-seal"><CheckCircle weight="fill" />Đã lưu draft</span></header><div className="cma-price-band"><span><small>Khoảng thấp</small><strong>{formatMoney(estimate * .94)}</strong></span><span><small>Giá tham chiếu</small><strong>{formatMoney(estimate)}</strong></span><span><small>Khoảng cao</small><strong>{formatMoney(estimate * 1.07)}</strong></span></div><div className="cma-report-grid"><div><span>Subject Property</span><strong>{subject.title}</strong><small>{subject.area} m² · {subject.address}</small></div><div><span>Comparable đã chọn</span><strong>{included.size} record</strong><small>Khoảng cách, loại tài sản và nguồn đã review</small></div><div><span>Độ tin cậy</span><strong>{included.size >= 3 ? 'Trung bình - cao' : 'Trung bình'}</strong><small>Cần agent xác nhận trước khi chia sẻ</small></div></div><div className="rationale-card"><ShieldCheck /><span><strong>Rationale của người phân tích</strong>{rationale}</span></div><div className="report-actions"><Button appearance="secondary" onClick={() => setReport(null)}>Điều chỉnh candidate</Button><Button appearance="primary" onClick={() => onSelectProperty(subject.id)}>Mở Property 360</Button></div></section>
  return <div className="module-workspace cma-workspace">
    <section className="work-panel cma-setup"><div className="panel-heading"><div><span className="section-kicker">Bước 1 · Subject</span><h2>Chọn tài sản cần phân tích</h2><p>CMA không tự publish; candidate và rationale luôn do con người quyết định.</p></div></div><div className="field"><label>Subject Property</label><select value={subjectId} onChange={(event) => { setSubjectId(event.target.value); setIncluded(new Set()) }}>{listings.map((property) => <option key={property.id} value={property.id}>{property.title}</option>)}</select></div>{subject && <button className="cma-subject" onClick={() => onSelectProperty(subject.id)}><img src={subject.image} alt="" /><span><strong>{subject.title}</strong><small>{subject.address}</small><em>{subject.currentListing?.priceLabel ?? 'Chưa có giá chào'} · {subject.area} m²</em></span><ArrowRight /></button>}<div className="field"><label>Rationale và giả định</label><textarea value={rationale} onChange={(event) => setRationale(event.target.value)} /></div></section>
    <section className="work-panel cma-candidates"><div className="panel-heading"><div><span className="section-kicker">Bước 2 · Comparable</span><h2>Review candidate set</h2><p>{included.size} / {candidates.length} record được include.</p></div><Button appearance="primary" disabled={!included.size || rationale.trim().length < 12} onClick={() => setReport({ createdAt: Date.now() })}>Tạo CMA draft <ArrowRight /></Button></div><div className="candidate-list">{candidates.map((property) => <label key={property.id} className={included.has(property.id) ? 'candidate-row selected' : 'candidate-row'}><input type="checkbox" checked={included.has(property.id)} onChange={() => toggle(property.id)} /><img src={property.image} alt="" /><span><strong>{property.title}</strong><small>{property.type} · {property.area} m² · {property.verification}</small></span><span><strong>{property.currentListing.priceLabel}</strong><small>{property.currentListing.pricePerArea}</small></span></label>)}</div></section>
  </div>
}

export function OrganizationWorkspace({ onOpenFlow }) {
  const [selected, setSelected] = useState(members[0])
  const [scope, setScope] = useState('Tất cả')
  const visible = members.filter((member) => scope === 'Tất cả' || member.role === scope)
  return <div className="module-workspace split-workspace">
    <section className="work-panel workspace-list-panel"><div className="workspace-toolbar"><label className="compact-filter"><Funnel /><select value={scope} onChange={(event) => setScope(event.target.value)}><option>Tất cả</option>{[...new Set(members.map((member) => member.role))].map((role) => <option key={role}>{role}</option>)}</select></label><Button appearance="primary" icon={<Plus />} onClick={() => onOpenFlow({ type: 'invite', title: 'Mời thành viên', eyebrow: 'Organization access', success: 'Đã tạo lời mời và gắn phạm vi truy cập ban đầu.' })}>Mời thành viên</Button></div><div className="member-table"><div className="member-head"><span>Thành viên</span><span>Vai trò</span><span>Phạm vi</span><span>Trạng thái</span><span /></div>{visible.map((member) => <button key={member.name} onClick={() => setSelected(member)} className={selected.name === member.name ? 'selected' : ''}><span><i>{member.initials}</i><strong>{member.name}</strong></span><span>{member.role}</span><span>{member.scope}</span><span><b className={member.status === 'Tạm khóa' ? 'status-dot paused' : 'status-dot'} />{member.status}</span><ArrowRight /></button>)}</div></section>
    <aside className="work-panel context-panel"><div className="context-hero"><span className="contact-avatar large">{selected.initials}</span><div><span className="section-kicker">Member entitlement</span><h2>{selected.name}</h2><p>{selected.role}</p></div></div><dl className="context-facts"><div><dt>Tổ chức</dt><dd>HouseNow Partners</dd></div><div><dt>Resource scope</dt><dd>{selected.scope}</dd></div><div><dt>Phiên gần nhất</dt><dd>{selected.last}</dd></div><div><dt>Trạng thái</dt><dd>{selected.status}</dd></div></dl><div className="rationale-card"><LockKey /><span><strong>Quyền hiệu lực</strong>Quyền = vai trò × tổ chức × resource scope × purpose của phiên hiện tại.</span></div><div className="context-actions"><Button appearance="secondary" onClick={() => onOpenFlow({ type: 'record', title: `Điều chỉnh quyền · ${selected.name}`, eyebrow: 'Entitlement review', data: [selected.role, selected.scope, selected.status, selected.last, 'Audit bắt buộc'], success: 'Đã lưu đề xuất thay đổi quyền vào hàng đợi duyệt.' })}>Điều chỉnh quyền</Button></div></aside>
  </div>
}

export function AppsWorkspace({ onNavigate, onOpenFlow }) {
  const [active, setActive] = useState(apps[0])
  const ActiveIcon = active.icon
  const open = () => active.target ? onNavigate(active.target) : onOpenFlow({ type: active.flow, title: 'Tạo lịch xem mới', eyebrow: active.title, success: 'Đã xác nhận lịch xem và gửi thông báo cho người tham gia.' })
  return <div className="apps-workspace"><div className="app-grid">{apps.map((app) => { const Icon = app.icon; return <button key={app.id} className={active.id === app.id ? 'app-card active' : 'app-card'} onClick={() => setActive(app)}><span className={`app-icon ${app.tone}`}><Icon weight="duotone" /></span><span className="section-kicker">{app.label}</span><strong>{app.title}</strong><p>{app.body}</p><em>Mở chi tiết <ArrowRight /></em></button> })}</div><section className="work-panel app-preview"><div className={`app-preview-visual ${active.tone}`}><ActiveIcon weight="duotone" /></div><div><span className="section-kicker">Ứng dụng đang chọn</span><h2>{active.title}</h2><p>{active.body}</p><ul><li><Check /> Dùng chung canonical Property ID</li><li><Check /> Tôn trọng projection theo vai trò</li><li><Check /> Ghi lại hành động quan trọng trong audit</li></ul><Button appearance="primary" onClick={open}>{active.action} <ArrowRight /></Button></div></section></div>
}

export function FlowDialog({ flow, onClose, onComplete }) {
  const [form, setForm] = useState({ name: '', phone: '', need: '', budget: '', datetime: '2026-08-14T17:30', attendee: '', note: '', category: 'Sai địa chỉ / định danh', detail: '', assignee: 'Quality router', decision: 'Đã xử lý', evidence: '', email: '', role: 'Môi giới', scope: 'Assigned listings', update: '' })
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const required = flow.type === 'new-client' ? form.name && form.phone && form.need && form.budget
    : flow.type === 'showing' ? form.datetime && form.attendee
      : flow.type === 'report' ? form.detail.trim().length >= 12
        : flow.type === 'issue' ? form.evidence.trim().length >= 12
          : flow.type === 'invite' ? form.email.includes('@')
            : form.update.trim().length >= 8
  const submit = (event) => { event.preventDefault(); if (required) onComplete(flow, form) }
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="flow-dialog" role="dialog" aria-modal="true" onSubmit={submit}><header className="composer-header"><div><span>{flow.eyebrow}</span><h2>{flow.title}</h2></div><button type="button" onClick={onClose} aria-label="Đóng"><X /></button></header><div className="flow-body">
    {flow.type === 'new-client' && <><Field label="Họ và tên"><input value={form.name} onChange={(event) => set('name', event.target.value)} placeholder="Nguyễn Minh Anh" /></Field><div className="flow-columns"><Field label="Số điện thoại"><input value={form.phone} onChange={(event) => set('phone', event.target.value)} placeholder="090 123 4567" /></Field><Field label="Ngân sách"><input value={form.budget} onChange={(event) => set('budget', event.target.value)} placeholder="12-16 tỷ" /></Field></div><Field label="Nhu cầu"><textarea value={form.need} onChange={(event) => set('need', event.target.value)} placeholder="Loại tài sản, khu vực, diện tích..." /></Field></>}
    {flow.type === 'showing' && <><Field label="Ngày và giờ"><input type="datetime-local" value={form.datetime} onChange={(event) => set('datetime', event.target.value)} /></Field><Field label="Khách tham gia"><input value={form.attendee} onChange={(event) => set('attendee', event.target.value)} placeholder="Tên khách hàng / buyer representative" /></Field><Field label="Yêu cầu và ghi chú"><textarea value={form.note} onChange={(event) => set('note', event.target.value)} placeholder="Điểm hẹn, xác nhận trước, yêu cầu riêng..." /></Field></>}
    {flow.type === 'report' && <><Field label="Loại vấn đề"><select value={form.category} onChange={(event) => set('category', event.target.value)}><option>Sai địa chỉ / định danh</option><option>Sai diện tích</option><option>Sai giá hoặc trạng thái</option><option>Nguồn không còn hiệu lực</option></select></Field><Field label="Mô tả và bằng chứng"><textarea value={form.detail} onChange={(event) => set('detail', event.target.value)} placeholder="Mô tả điểm sai và nguồn có thể đối chiếu..." /></Field><div className="flow-assurance"><Database /><span><strong>Snapshot được giữ lại</strong>Báo cáo tạo issue mới; dữ liệu hiện tại không bị tự động ghi đè.</span></div></>}
    {flow.type === 'issue' && <><div className="issue-dialog-summary"><Warning /><span><strong>{flow.issue.code} · {flow.issue.type}</strong>{flow.issue.title}<small>{flow.issue.record} · {flow.issue.due}</small></span></div><div className="flow-columns"><Field label="Người phụ trách"><select value={form.assignee} onChange={(event) => set('assignee', event.target.value)}><option>Quality router</option><option>Data Steward</option><option>Listing agent</option><option>Broker reviewer</option></select></Field><Field label="Kết luận"><select value={form.decision} onChange={(event) => set('decision', event.target.value)}><option>Đã xử lý</option><option>Yêu cầu bổ sung</option><option>Chuyển chuyên gia</option></select></Field></div><Field label="Căn cứ xử lý"><textarea value={form.evidence} onChange={(event) => set('evidence', event.target.value)} placeholder="Nguồn đã kiểm tra, quyết định và lý do..." /></Field></>}
    {flow.type === 'invite' && <><Field label="Email thành viên"><input type="email" value={form.email} onChange={(event) => set('email', event.target.value)} placeholder="member@company.vn" /></Field><div className="flow-columns"><Field label="Vai trò"><select value={form.role} onChange={(event) => set('role', event.target.value)}><option>Môi giới</option><option>Quản lý sàn</option><option>Data Steward</option><option>Reviewer</option></select></Field><Field label="Phạm vi"><select value={form.scope} onChange={(event) => set('scope', event.target.value)}><option>Assigned listings</option><option>Brokerage-wide</option><option>Quality Queue</option><option>HCM + Hà Nội</option></select></Field></div></>}
    {flow.type === 'record' && <><div className="record-snapshot">{flow.data.map((value, index) => <span key={`${value}-${index}`}><small>{['Đối tượng', 'Giá trị', 'Xác minh', 'Tín hiệu', 'Hành động'][index]}</small><strong>{value}</strong></span>)}</div><Field label="Cập nhật và next step"><textarea value={form.update} onChange={(event) => set('update', event.target.value)} placeholder="Ghi nhận quyết định, lý do hoặc bước tiếp theo..." /></Field><div className="flow-assurance"><ShieldCheck /><span><strong>Có audit context</strong>Cập nhật được gắn actor, thời gian và resource scope hiện tại.</span></div></>}
  </div><footer className="composer-footer"><Button type="button" appearance="secondary" onClick={onClose}>Hủy</Button><Button type="submit" appearance="primary" disabled={!required}>{flow.type === 'issue' ? 'Lưu kết luận' : flow.type === 'report' ? 'Gửi báo cáo' : flow.type === 'showing' ? 'Xác nhận lịch' : flow.type === 'invite' ? 'Gửi lời mời' : 'Lưu cập nhật'} <Check /></Button></footer></form></div>
}

function Field({ label, children }) { return <label className="field"><span>{label}</span>{children}</label> }

function formatMoney(value) {
  if (!value) return 'Chưa đủ dữ liệu'
  return value >= 1_000_000_000 ? `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value / 1_000_000_000)} tỷ` : `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value / 1_000_000)} triệu`
}
