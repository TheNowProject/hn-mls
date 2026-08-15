import { expect, test as base } from '@playwright/test'

const previewBaseUrl = process.env.PLAYWRIGHT_BASE_URL
const protectedPreviewOrigin = process.env.VERCEL_AUTOMATION_BYPASS_SECRET && previewBaseUrl
  ? new URL(previewBaseUrl).origin
  : null

const CASES = {
  developer: {
    id: 'sun-grand-thuy-khue',
    npid: 'NPID-HN-09876',
    plid: 'PLID-HN-00125',
    ptid: 'PTID-HN-00031',
    route: 'Chủ đầu tư / HĐMB',
    shareId: 'CS-8F2D1A',
    buyerRef: 'NM-HN-0031',
    price: '15600000000',
    representationStart: '2026-08-10',
    representationExpiry: '2026-09-09',
    confirmationRef: 'XN-REP-HN-00031-20260812',
    customerLabel: 'T••• M••• A•••',
    sourceReceivedOn: '10/08/2026',
    sourceIds: ['SRC-HDMB-S2-12A', 'SRC-HS-BAN-S2-12A'],
  },
  landRegistry: {
    id: 'phu-thuong-landed-home',
    npid: 'NPID-HN-10421',
    plid: 'PLID-HN-00208',
    ptid: 'PTID-HN-00044',
    route: 'Văn phòng đăng ký đất đai',
    shareId: 'CS-41C7E9',
    buyerRef: 'NM-HN-0044',
    price: '24600000000',
    representationStart: '2026-08-11',
    representationExpiry: '2026-09-10',
    confirmationRef: 'XN-REP-HN-00044-20260812',
    customerLabel: 'L••• T••• H•••',
    sourceReceivedOn: '11/08/2026',
    sourceIds: ['SRC-GCN-PTH-118', 'SRC-HS-BAN-PTH-118'],
  },
}

const FORBIDDEN_UI_WORDING = [
  /mô phỏng/i,
  /đề xuất/i,
  /\bdemo\b/i,
  /giả lập/i,
  /minh họa/i,
  /\bFACT\b/i,
  /SOURCE CLAIM/i,
  /\bPROPOSAL\b/i,
  /OPEN QUESTION/i,
  /hành trình/i,
  /bản ghi sống/i,
  /\bpilot\b/i,
]

function isProtectedPreviewInfrastructure(request) {
  if (!protectedPreviewOrigin) return false

  const url = new URL(request.url())
  const isVercelHandshake = url.origin === protectedPreviewOrigin
    && (url.pathname === '/.well-known/vercel/jwe'
      || (request.method() === 'HEAD' && url.pathname === '/'))
  const isPreviewToolbar = url.hostname === 'vercel.live'
    && url.pathname.startsWith('/_next-live/')

  return isVercelHandshake || isPreviewToolbar
}

const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const browserErrors = []

    page.on('console', (message) => {
      if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`)
    })
    page.on('pageerror', (error) => browserErrors.push(`pageerror: ${error.message}`))
    page.on('requestfailed', (request) => {
      if (isProtectedPreviewInfrastructure(request)) return
      browserErrors.push(
        `requestfailed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`,
      )
    })
    page.on('response', (response) => {
      if (response.status() >= 400 && !isProtectedPreviewInfrastructure(response.request())) {
        browserErrors.push(
          `response: ${response.status()} ${response.request().method()} ${response.url()}`,
        )
      }
    })

    await use(page)

    expect(
      browserErrors,
      `Không được có lỗi trình duyệt hoặc mạng ngoài dự kiến trong “${testInfo.title}”`,
    ).toEqual([])
  },
})

async function startFresh(page, route = '#/vai-tro/agent/cong-viec') {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.goto(`/${route}`)
  await expect(page).toHaveTitle(/VMLS/)
  await expect(page.getByTestId('app-shell')).toBeVisible()
}

async function expectNoNarrativeInjection(page) {
  const visibleCopy = await page.locator('body').innerText()
  for (const wording of FORBIDDEN_UI_WORDING) {
    expect(visibleCopy, `Không được hiển thị wording injection: ${wording}`).not.toMatch(wording)
  }
  await expect(page.getByTestId('start-demo')).toHaveCount(0)
  await expect(page.getByTestId('handoff-next-role')).toHaveCount(0)
  await expect(page.getByRole('progressbar')).toHaveCount(0)
  await expect(page.getByText(/Một tài sản\. Một định danh/i)).toHaveCount(0)
}

async function switchRole(page, roleId) {
  await page.getByTestId('role-switcher').selectOption(roleId)
  await expect(page).toHaveURL(new RegExp(`#\/vai-tro\/${roleId}\/cong-viec$`))
  await expect(page.getByTestId('role-switcher')).toHaveValue(roleId)
}

async function openCase(page, roleId, demoCase) {
  if (!new RegExp(`#\/vai-tro\/${roleId}\/cong-viec$`).test(page.url())) {
    await page.goto(`/#/vai-tro/${roleId}/cong-viec`)
  }
  const row = page.getByTestId(roleId === 'bank'
    ? `shared-case-row-${demoCase.shareId}`
    : `case-row-${demoCase.id}`)
  await expect(row).toBeVisible()
  await row.getByRole('button', { name: /Mở hồ sơ/ }).click()
  const routeToken = roleId === 'bank' ? demoCase.shareId : demoCase.id
  await expect(page).toHaveURL(new RegExp(`#\/vai-tro\/${roleId}\/ho-so\/${routeToken}`))
  if (roleId === 'bank') {
    await expect(page.getByTestId('object-npid')).toHaveCount(0)
  } else {
    await expect(page.getByTestId('object-npid')).toContainText(demoCase.npid)
  }
}

async function openTab(page, label) {
  const tabs = page.getByRole('navigation', { name: 'Nội dung hồ sơ' })
  await tabs.getByRole('button', { name: label, exact: true }).click()
}

async function expectTransferRoute(page, route) {
  const result = page.getByRole('heading', { name: 'Xử lý chuyển quyền' })
    .locator('xpath=ancestor::section[1]')
  await expect(result).toContainText(route)
}

async function submitAction(page, action) {
  const button = page.getByTestId(`action-${action}`)
  await expect(button, `Phải có hành động ${action} ở đúng vai trò`).toBeVisible()
  await expect(button).toBeEnabled()
  await button.click()
}

async function matchAndRequestRepresentation(page, demoCase) {
  await page.goto('/#/vai-tro/agent/cong-viec')
  await openCase(page, 'agent', demoCase)

  const candidate = page.getByRole('radio', { name: new RegExp(demoCase.npid) })
  await expect(candidate).toBeVisible()
  await candidate.check()

  const sourceChecklist = page.getByRole('group', { name: 'Nguồn dùng để đối chiếu' })
  await expect(sourceChecklist).toBeVisible()
  for (const sourceId of demoCase.sourceIds) {
    const source = sourceChecklist.getByRole('checkbox', { name: new RegExp(sourceId) })
    await expect(source).toBeVisible()
    await expect(source).toBeChecked()
  }
  await submitAction(page, 'match_property')

  await openTab(page, 'Dữ liệu BĐS')
  await expect(page.getByRole('columnheader', { name: 'Ngày ghi nhận' })).toBeVisible()
  for (const sourceId of demoCase.sourceIds) {
    const sourceRow = page.getByText(sourceId, { exact: true })
      .locator('xpath=ancestor::tr[1]')
    await expect(sourceRow).toContainText(demoCase.sourceReceivedOn)
  }
  await openTab(page, 'Tổng quan')

  await expect(page.getByTestId('action-request_seller_confirmation')).toBeVisible()
  await page.getByLabel('Phạm vi đại diện').selectOption('Độc quyền')
  await expect(page.getByLabel('Ngày hiệu lực')).toHaveValue(demoCase.representationStart)
  await expect(page.getByLabel('Ngày hết hạn')).toHaveValue(demoCase.representationExpiry)
  await submitAction(page, 'request_seller_confirmation')
  await expect(page.getByTestId('action-request_seller_confirmation')).toHaveCount(0)
}

async function confirmRepresentation(page, demoCase) {
  await switchRole(page, 'seller')
  await openCase(page, 'seller', demoCase)

  const acknowledgement = page.getByRole('checkbox', {
    name: /Tôi đã kiểm tra Bất động sản, người đại diện, phạm vi và thời hạn/,
  })
  const confirmationRef = page.getByLabel('Mã xác nhận')
  await expect(confirmationRef).toHaveValue(demoCase.confirmationRef)
  await confirmationRef.fill(demoCase.confirmationRef)
  await acknowledgement.check()
  await submitAction(page, 'confirm_representation')

  await expect(page.getByTestId('object-plid')).toContainText(demoCase.plid)
  await expect(page.getByTestId('action-create_listing')).toHaveCount(0)
  await openTab(page, 'Quyền đại diện')
  await expect(page.getByText(demoCase.confirmationRef, { exact: true })).toBeVisible()
  await openTab(page, 'Lịch sử')
  const history = page.getByRole('heading', { name: 'Lịch sử thay đổi' })
    .locator('xpath=ancestor::section[1]')
  for (const actionLabel of ['Gửi yêu cầu xác nhận', 'Xác nhận quyền đại diện']) {
    await expect(history.getByText(actionLabel, { exact: true })).toBeVisible()
  }
  await expect(history.getByText('Đối chiếu bất động sản', { exact: true })).toHaveCount(0)
  await expect(history.getByRole('columnheader', { name: 'Đối tượng' })).toHaveCount(0)
  await expect(history.getByRole('columnheader', { name: 'Mã tương quan' })).toHaveCount(0)
  await openTab(page, 'Tin bán')
  await expect(page.getByText('Đã khởi tạo', { exact: true })).toBeVisible()

  const houseNow = page.getByTestId('distribution-housenow')
  await expect(houseNow).toBeVisible()
  await expect(houseNow).toContainText('HouseNow')
  await expect(houseNow).toContainText('Chưa phát hành')
  const icon = houseNow.locator('img')
  await expect(icon).toHaveAttribute('src', '/assets/demo/housenow-icon.png')
  await expect.poll(() => icon.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true)
}

async function recordBuyer(page, demoCase) {
  await switchRole(page, 'agent')
  await openCase(page, 'agent', demoCase)

  await page.getByLabel('Mã Người mua').fill(demoCase.buyerRef)
  await page.getByLabel('Giá đã thống nhất (VND)').fill(demoCase.price)
  await page.getByLabel('Ngày dự kiến ký').fill('2026-08-22')
  await submitAction(page, 'record_buyer')
  await expect(page.getByTestId('action-record_buyer')).toHaveCount(0)
}

async function verifyBuyerReadiness(page, demoCase, { shareWithBank }) {
  await switchRole(page, 'buyer')
  await openCase(page, 'buyer', demoCase)

  for (const label of [
    'Thông tin định danh của tôi',
    'Phương án thanh toán',
    'Danh mục tài liệu được chia sẻ',
  ]) {
    await page.getByRole('checkbox', { name: label, exact: true }).check()
  }
  const bankConsent = page.getByRole('checkbox', {
    name: 'Chia sẻ giá, Bất động sản và lịch dự kiến với Ngân hàng',
  })
  if (shareWithBank) await bankConsent.check()
  else await bankConsent.uncheck()

  await submitAction(page, 'verify_readiness')
  await expect(page.getByTestId('action-verify_readiness')).toHaveCount(0)
}

async function submitNotaryDossier(page, demoCase, { exerciseInvalidPayload = false } = {}) {
  await switchRole(page, 'notary')
  await openCase(page, 'notary', demoCase)

  await page.getByLabel('Mã tiếp nhận').fill(
    demoCase.id === CASES.developer.id ? 'HSCC-HN-00031' : 'HSCC-HN-00044',
  )
  const documents = page.getByRole('group', { name: 'Thành phần hồ sơ' })
    .getByRole('checkbox')
  expect(await documents.count()).toBeGreaterThan(1)

  if (exerciseInvalidPayload) {
    await documents.first().uncheck()
    await submitAction(page, 'submit_notary_dossier')
    await expect(page.getByTestId('action-submit_notary_dossier')).toBeVisible()
    await expect(page.getByRole('alert')).toBeVisible()
  }

  for (const document of await documents.all()) await document.check()
  await submitAction(page, 'submit_notary_dossier')
  await expect(page.getByTestId('action-submit_notary_dossier')).toHaveCount(0)
}

async function recordNotarySigning(page, demoCase) {
  await page.getByLabel('Mã kết quả công chứng').fill(
    demoCase.id === CASES.developer.id ? 'KQCC-HN-00031' : 'KQCC-HN-00044',
  )
  await page.getByLabel('Thời điểm ký').fill(
    demoCase.id === CASES.developer.id ? '2026-08-22T15:30' : '2026-08-26T10:00',
  )
  await page.getByLabel('Mã kiểm tra tài liệu').fill(
    demoCase.id === CASES.developer.id ? 'a9048b2e113f' : 'c1729d8f482e',
  )
  await submitAction(page, 'record_notary_signing')

  await expect(page.getByTestId('object-ptid')).toContainText(demoCase.ptid)
  await expect(page.getByTestId('action-create_transaction')).toHaveCount(0)
  await switchRole(page, 'vmls')
  await openCase(page, 'vmls', demoCase)
  await openTab(page, 'Chuyển quyền')
  await expectTransferRoute(page, demoCase.route)
  await expect(page.getByTestId('object-ptid')).toContainText(demoCase.ptid)
}

async function advanceToNotary(page, demoCase, { shareWithBank, exerciseInvalidPayload = false }) {
  await matchAndRequestRepresentation(page, demoCase)
  await confirmRepresentation(page, demoCase)
  await recordBuyer(page, demoCase)
  await verifyBuyerReadiness(page, demoCase, { shareWithBank })
  await submitNotaryDossier(page, demoCase, { exerciseInvalidPayload })
}

test.beforeEach(async ({ page }) => {
  await startFresh(page)
})

test('mở thẳng hàng đợi dữ liệu, tìm kiếm và lọc bằng số liệu thật', async ({ page }) => {
  await expect(page).toHaveURL(/#\/vai-tro\/agent\/cong-viec$/)
  await expect(page.getByTestId('work-queue')).toBeVisible()
  await expect(page.getByRole('img', { name: 'VMLS' })).toBeVisible()
  await expect(page.locator('.header-brand')).not.toContainText('HouseNow')
  await expect(page.getByRole('heading', { name: 'Công việc cần xử lý' })).toBeVisible()
  await expect(page.getByRole('table')).toContainText('Bất động sản')
  await expect(page.getByRole('table')).toContainText('Việc cần làm')
  await expect(page.getByTestId('case-row-sun-grand-thuy-khue')).toContainText(CASES.developer.npid)
  await expect(page.getByTestId('case-row-phu-thuong-landed-home')).toContainText(CASES.landRegistry.npid)

  await expect(page.getByTestId('status-filter-all')).toContainText('2')
  await expect(page.getByTestId('status-filter-mine')).toContainText('2')
  await expect(page.getByTestId('status-filter-waiting')).toContainText('0')
  await expect(page.getByTestId('status-filter-blocked')).toContainText('0')

  const search = page.getByTestId('global-search')
  await search.fill(CASES.landRegistry.npid)
  await expect(page.getByTestId('case-row-phu-thuong-landed-home')).toBeVisible()
  await expect(page.getByTestId('case-row-sun-grand-thuy-khue')).toHaveCount(0)

  await search.clear()
  await page.getByTestId('status-filter-waiting').click()
  await expect(page.getByRole('heading', { name: 'Không có hồ sơ ở bộ lọc này' })).toBeVisible()
  await page.getByTestId('status-filter-all').click()
  await expect(page.getByTestId('case-row-sun-grand-thuy-khue')).toBeVisible()

  await expect(page.getByText(CASES.developer.plid, { exact: true })).toHaveCount(0)
  await expect(page.getByText(CASES.developer.ptid, { exact: true })).toHaveCount(0)
  await expectNoNarrativeInjection(page)
})

test('biểu mẫu giải thích payload nghiệp vụ sai và vai trò sai không có hành động', async ({ page }) => {
  await openCase(page, 'agent', CASES.developer)
  await page.getByRole('radio', { name: new RegExp(CASES.developer.npid) }).check()

  const sources = page.getByRole('group', { name: 'Nguồn dùng để đối chiếu' })
  const omittedSource = sources.getByRole('checkbox', {
    name: new RegExp(CASES.developer.sourceIds[0]),
  })
  await omittedSource.uncheck()
  await submitAction(page, 'match_property')
  await expect(page.getByRole('alert')).toHaveText(
    'Chọn đúng Bất động sản và đủ nguồn dùng để đối chiếu.',
  )
  await expect(page.getByTestId('action-match_property')).toBeVisible()
  await expect(page.getByTestId('object-plid')).toBeDisabled()

  await omittedSource.check()
  await submitAction(page, 'match_property')

  const start = page.getByLabel('Ngày hiệu lực')
  const expiry = page.getByLabel('Ngày hết hạn')
  await expect(start).toHaveValue(CASES.developer.representationStart)
  await expiry.fill(CASES.developer.representationStart)
  await submitAction(page, 'request_seller_confirmation')
  await expect(page.getByRole('alert')).toHaveText('Ngày hết hạn phải sau ngày hiệu lực.')
  await expect(expiry).toBeFocused()
  await expect(page.getByTestId('action-request_seller_confirmation')).toBeVisible()
  await expect(page.getByTestId('object-plid')).toBeDisabled()

  await switchRole(page, 'brokerage')
  await openCase(page, 'brokerage', CASES.developer)
  await expect(page.getByTestId('task-panel')).toContainText('Đang chờ cập nhật')
  await expect(page.locator('[data-testid^="action-"]')).toHaveCount(0)
  await expectNoNarrativeInjection(page)
})

test('Sàn điều phối bằng cột nghiệp vụ và bộ lọc có tác dụng', async ({ page }) => {
  await matchAndRequestRepresentation(page, CASES.developer)
  await switchRole(page, 'brokerage')

  await expect(page.getByRole('heading', { name: 'Điều phối hồ sơ' })).toBeVisible()
  const table = page.getByRole('table')
  for (const column of ['Môi giới', 'Việc cần làm', 'Phụ trách', 'Ưu tiên', 'Hạn xử lý', 'Hết hạn đại diện']) {
    await expect(table.getByRole('columnheader', { name: column, exact: true })).toBeVisible()
  }
  await expect(page.getByTestId('status-filter-all')).toContainText('2')
  await expect(page.getByTestId('status-filter-open')).toContainText('2')
  await expect(page.getByTestId('status-filter-blocked')).toContainText('0')
  await expect(page.getByTestId(`case-row-${CASES.developer.id}`)).toContainText('09/09/2026')

  const ownerFilter = page.getByLabel('Phụ trách')
  await expect(ownerFilter).toBeVisible()
  await ownerFilter.selectOption('seller')
  await expect(page.getByTestId(`case-row-${CASES.developer.id}`)).toBeVisible()
  await expect(page.getByTestId(`case-row-${CASES.landRegistry.id}`)).toHaveCount(0)

  await ownerFilter.selectOption('')
  await page.getByLabel('Ưu tiên').selectOption('Cao')
  await expect(page.getByTestId(`case-row-${CASES.landRegistry.id}`)).toBeVisible()
  await expect(page.getByTestId(`case-row-${CASES.developer.id}`)).toHaveCount(0)

  await page.getByLabel('Ưu tiên').selectOption('Bình thường')
  await expect(page.getByTestId(`case-row-${CASES.developer.id}`)).toBeVisible()
  await expect(page.getByTestId(`case-row-${CASES.landRegistry.id}`)).toHaveCount(0)
})

test('PLID tự sinh, consent Ngân hàng có hiệu lực và hoàn tất tuyến Chủ đầu tư', async ({ page }) => {
  await matchAndRequestRepresentation(page, CASES.developer)
  await confirmRepresentation(page, CASES.developer)

  await expect(page.getByTestId('source-357')).toHaveCount(0)
  await expect(page.getByText('thongtinbds.moc.gov.vn', { exact: false })).toHaveCount(0)
  await recordBuyer(page, CASES.developer)

  await switchRole(page, 'bank')
  await expect(page.getByRole('heading', { name: 'Chưa có hồ sơ được chia sẻ' })).toBeVisible()
  await expect(page.getByText(CASES.developer.npid, { exact: true })).toHaveCount(0)

  await verifyBuyerReadiness(page, CASES.developer, { shareWithBank: true })
  await switchRole(page, 'bank')
  const sharedDeveloper = page.getByTestId(`shared-case-row-${CASES.developer.shareId}`)
  await expect(sharedDeveloper).toBeVisible()
  await expect(sharedDeveloper).toContainText('15.600.000.000')
  await expect(sharedDeveloper).not.toContainText('15,8 tỷ đồng')
  await expect(page.getByTestId(`shared-case-row-${CASES.landRegistry.shareId}`)).toHaveCount(0)
  await expect(page.getByText(CASES.landRegistry.npid, { exact: true })).toHaveCount(0)

  await submitNotaryDossier(page, CASES.developer, { exerciseInvalidPayload: true })
  await recordNotarySigning(page, CASES.developer)

  await page.reload()
  await expect(page.getByTestId('object-ptid')).toContainText(CASES.developer.ptid)
  await expect(page.getByText(CASES.developer.route, { exact: true })).toBeVisible()
  await expect(page.getByTestId('action-record_notary_signing')).toHaveCount(0)

  await switchRole(page, 'developer')
  await openCase(page, 'developer', CASES.developer)
  await page.getByLabel('Mã tiếp nhận Chủ đầu tư').fill('TNCĐT-S2-12A-2026')
  await page.getByLabel('Thời điểm tiếp nhận').fill('2026-08-24T09:00')
  await page.getByLabel('Số tài liệu').fill('6')
  await submitAction(page, 'developer_intake')

  await page.getByLabel('Mã xác nhận chuyển nhượng').fill('XN-CDT-S2-12A-2026')
  await page.getByLabel('Thời điểm xác nhận').fill('2026-08-25T16:30')
  await submitAction(page, 'developer_confirm_transfer')

  await switchRole(page, 'buyer')
  await openCase(page, 'buyer', CASES.developer)
  await page.getByLabel('Mã biên nhận').fill('HDMB-MOI-S2-12A-2026')
  await page.getByLabel('Thời điểm nhận').fill('2026-08-26T10:30')
  await page.getByRole('checkbox', { name: 'Tôi xác nhận đã nhận đúng HĐMB mới.' }).check()
  await submitAction(page, 'buyer_receive_contract')

  await expect(page.getByTestId('task-panel')).toContainText('Không còn việc cần xử lý')
  await openTab(page, 'Chuyển quyền')
  await expectTransferRoute(page, CASES.developer.route)
  await expect(page.getByText('HDMB-MOI-S2-12A/2026', { exact: true }).first()).toBeVisible()
  await expectNoNarrativeInjection(page)
})

test('Ngân hàng chỉ tìm trong phạm vi dữ liệu được chia sẻ', async ({ page }) => {
  await switchRole(page, 'bank')

  const search = page.getByTestId('global-search')
  await expect(search).toHaveAttribute(
    'placeholder',
    'Tìm loại Bất động sản, khoảng giá, mục đích',
  )
  await search.fill('nhà phố không tồn tại')
  await expect(page.getByRole('heading', { name: 'Không tìm thấy hồ sơ' })).toBeVisible()
  await expect(page.getByText(
    'Thử tìm theo loại Bất động sản, giá hoặc mục đích chia sẻ.',
    { exact: true },
  )).toBeVisible()

  const visibleCopy = await page.getByRole('main').innerText()
  expect(visibleCopy).not.toMatch(/NPID|PLID|PTID|dự án|khu vực/i)
})

test('Người bán bổ sung tài liệu và VPĐKĐĐ hoàn tất tuyến đất ở độc lập', async ({ page }) => {
  await advanceToNotary(page, CASES.landRegistry, { shareWithBank: false })

  await page.getByLabel('Loại tài liệu').selectOption('Xác nhận tình trạng hôn nhân')
  await page.getByLabel('Lý do').selectOption('MISSING_MARITAL_STATUS')
  await page.getByLabel('Hạn bổ sung').fill('2026-08-24')
  await submitAction(page, 'request_supplement')
  await expect(page.getByTestId('action-record_notary_signing')).toHaveCount(0)

  await switchRole(page, 'seller')
  await openCase(page, 'seller', CASES.landRegistry)
  await page.getByLabel('Mã tài liệu').fill('TLBS-HN-00044')
  await page.getByLabel('Loại tài liệu').fill('Xác nhận tình trạng hôn nhân')

  const fileName = page.getByLabel('Tên tệp PDF')
  await fileName.fill('tai-lieu-bo-sung.txt')
  await submitAction(page, 'provide_supplement')
  await expect(fileName).toHaveJSProperty('validity.valid', false)
  await expect(page.getByTestId('action-provide_supplement')).toBeVisible()
  await fileName.fill('xac-nhan-tinh-trang-hon-nhan.pdf')
  await submitAction(page, 'provide_supplement')

  await switchRole(page, 'notary')
  await openCase(page, 'notary', CASES.landRegistry)
  await recordNotarySigning(page, CASES.landRegistry)

  await switchRole(page, 'landRegistry')
  await openCase(page, 'landRegistry', CASES.landRegistry)
  await page.getByLabel('Mã kết quả').fill('KQ-DKBD-260828-044')
  await page.getByLabel('Thời điểm hiệu lực').fill('2026-08-28T14:30')
  await page.getByLabel('Tham chiếu chủ mới').fill(CASES.landRegistry.buyerRef)
  await submitAction(page, 'approve_land_registry')

  await expect(page.getByTestId('task-panel')).toContainText('Không còn việc cần xử lý')
  await openTab(page, 'Chuyển quyền')
  await expectTransferRoute(page, CASES.landRegistry.route)
  await expect(page.getByTestId('object-ptid')).toContainText(CASES.landRegistry.ptid)

  await switchRole(page, 'bank')
  await expect(page.getByTestId(`shared-case-row-${CASES.landRegistry.shareId}`)).toHaveCount(0)
  await expect(page.getByText(CASES.landRegistry.npid, { exact: true })).toHaveCount(0)
  await expectNoNarrativeInjection(page)
})

test('Ngân hàng không thấy dữ liệu VPCC, blocker, owner hoặc định danh khi hồ sơ cần bổ sung', async ({ page }) => {
  await advanceToNotary(page, CASES.landRegistry, { shareWithBank: true })

  await page.getByLabel('Loại tài liệu').selectOption('Xác nhận tình trạng hôn nhân')
  await page.getByLabel('Lý do').selectOption('MISSING_MARITAL_STATUS')
  await page.getByLabel('Hạn bổ sung').fill('2026-08-20')
  await submitAction(page, 'request_supplement')

  await switchRole(page, 'bank')
  const row = page.getByTestId(`shared-case-row-${CASES.landRegistry.shareId}`)
  await expect(row).toBeVisible()
  await expect(row).toContainText('Nhà ở riêng lẻ')

  for (const restrictedValue of [
    CASES.landRegistry.npid,
    CASES.landRegistry.plid,
    CASES.landRegistry.ptid,
    'HSCC-HN-00044',
    'Văn phòng công chứng',
    'Xác nhận tình trạng hôn nhân',
    'Yêu cầu bổ sung',
    'Người bán',
    CASES.landRegistry.customerLabel,
  ]) {
    await expect(row.getByText(restrictedValue, { exact: false })).toHaveCount(0)
  }

  await row.getByRole('button', { name: 'Mở hồ sơ' }).click()
  await expect(page).toHaveURL(new RegExp(`#\/vai-tro\/bank\/ho-so\/${CASES.landRegistry.shareId}\/tong-quan$`))
  const main = page.getByRole('main')
  for (const restrictedValue of [
    CASES.landRegistry.npid,
    CASES.landRegistry.plid,
    CASES.landRegistry.ptid,
    'HSCC-HN-00044',
    'Văn phòng công chứng',
    'Xác nhận tình trạng hôn nhân',
    'Yêu cầu bổ sung',
    'Người bán',
    CASES.landRegistry.customerLabel,
  ]) {
    await expect(main.getByText(restrictedValue, { exact: false })).toHaveCount(0)
  }
  await expect(page.getByTestId('object-npid')).toHaveCount(0)
  await expect(page.getByTestId('object-plid')).toHaveCount(0)
  await expect(page.getByTestId('object-ptid')).toHaveCount(0)
  const renderedMarkup = await page.locator('body').evaluate((element) => element.outerHTML)
  expect(renderedMarkup).not.toContain(CASES.landRegistry.id)
  expect(renderedMarkup).not.toContain(CASES.developer.id)
  expect(renderedMarkup).not.toContain(CASES.landRegistry.customerLabel)
  expect(renderedMarkup).not.toContain(CASES.developer.customerLabel)
  expect(page.url()).not.toContain(CASES.landRegistry.id)
  expect(page.url()).not.toContain(CASES.landRegistry.npid)
})

test('357 chỉ nằm trong danh mục nguồn và mở ảnh trang chủ có xuất xứ', async ({ page }) => {
  await expect(page.getByTestId('source-357')).toHaveCount(0)
  await switchRole(page, 'vmls')
  await page.getByRole('navigation', { name: 'Phân hệ nghiệp vụ' })
    .getByRole('button', { name: 'Kết nối & nguồn dữ liệu' })
    .click()
  await expect(page).toHaveURL(/#\/vai-tro\/vmls\/nguon-du-lieu$/)

  const source = page.getByTestId('source-357')
  await expect(source).toBeVisible()
  await expect(source).toContainText('Bộ Xây dựng')
  await expect(source).toContainText('Thông tin nhà ở và thị trường bất động sản')
  await expect(source).toContainText('không có bản ghi thuộc hai hồ sơ đang xử lý')
  await expect(source).toContainText('Chưa cấu hình')
  await expect(source.getByRole('link')).toHaveAttribute('href', 'https://thongtinbds.moc.gov.vn/')

  const previewTrigger = source.getByRole('button', { name: 'Xem ảnh trang chủ' })
  await previewTrigger.click()
  const drawer = page.getByTestId('source-preview')
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('button', { name: 'Đóng' })).toBeFocused()
  const screenshot = drawer.getByRole('img', { name: /Trang chủ .* chụp ngày 15\/08\/2026/ })
  await expect(screenshot).toHaveAttribute('src', '/assets/demo/357-homepage-2026-08-15.png')
  await expect.poll(() => screenshot.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true)

  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(previewTrigger).toBeFocused()
  await expect(page.getByTestId('distribution-housenow')).toHaveCount(0)
  await expectNoNarrativeInjection(page)
})

test('tiến độ và hash route được lưu, còn đặt lại trả cả hai hồ sơ về ban đầu', async ({ page }) => {
  await matchAndRequestRepresentation(page, CASES.developer)
  const persistedUrl = page.url()
  await page.reload()
  await expect(page).toHaveURL(persistedUrl)
  await expect(page.getByTestId('task-panel')).toContainText('Đang chờ cập nhật')

  await switchRole(page, 'seller')
  await openCase(page, 'seller', CASES.developer)
  await expect(page.getByTestId('action-confirm_representation')).toBeVisible()

  const reset = page.getByTestId('reset-data')
  await reset.click()
  const dialog = page.getByRole('dialog', { name: 'Đặt lại 2 hồ sơ?' })
  await expect(dialog).toBeVisible()
  await dialog.getByTestId('confirm-reset').click()

  await expect(page).toHaveURL(/#\/vai-tro\/agent\/cong-viec$/)
  await expect(page.getByTestId('case-row-sun-grand-thuy-khue')).toContainText('Chờ đối chiếu')
  await expect(page.getByText(CASES.developer.plid, { exact: true })).toHaveCount(0)
  await page.reload()
  await expect(page.getByTestId('case-row-sun-grand-thuy-khue')).toContainText('Chờ đối chiếu')
})

test('bàn phím, focus dialog và reduced motion hoạt động trong app shell', async ({ page }) => {
  await page.goto('/#/vai-tro/vmls/nguon-du-lieu')
  const routeBeforeSkip = page.url()
  await page.keyboard.press('Tab')
  const skipControl = page.getByRole('button', { name: 'Bỏ qua điều hướng' })
  await expect(skipControl).toBeFocused()
  await expect(skipControl).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(routeBeforeSkip)
  await expect(page.getByRole('main')).toBeFocused()

  await page.getByTestId('reset-data').focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Đặt lại 2 hồ sơ?' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Đóng' })).toBeFocused()

  const controls = dialog.getByRole('button')
  const controlCount = await controls.count()
  for (let index = 0; index <= controlCount; index += 1) {
    await page.keyboard.press('Tab')
    await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page.getByTestId('reset-data')).toBeFocused()

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  expect(await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
  const motionOffenders = await page.locator('[data-testid="app-shell"] *').evaluateAll((elements) => {
    const milliseconds = (value) => value.endsWith('ms')
      ? Number.parseFloat(value)
      : Number.parseFloat(value) * 1000
    return elements.flatMap((element) => {
      const style = getComputedStyle(element)
      const animations = style.animationDuration.split(',').map((value) => milliseconds(value.trim()))
      const transitions = style.transitionDuration.split(',').map((value) => milliseconds(value.trim()))
      return animations.some((value) => value > 1) || transitions.some((value) => value > 1)
        ? [element.tagName]
        : []
    }).slice(0, 10)
  })
  expect(motionOffenders).toEqual([])
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')
})

for (const viewport of [
  { name: '1920×1080', width: 1920, height: 1080 },
  { name: '1440×900', width: 1440, height: 900 },
  { name: '1024×768', width: 1024, height: 768 },
  { name: '390×844', width: 390, height: 844 },
]) {
  test(`hàng đợi và chi tiết không tràn ngang ở ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.reload()
    await expect(page.getByTestId('work-queue')).toBeVisible()

    let dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)

    const queueAction = page.getByTestId(`case-row-${CASES.developer.id}`)
      .getByRole('button', { name: 'Mở hồ sơ' })
    const queueActionBounds = await queueAction.boundingBox()
    expect(queueActionBounds).not.toBeNull()
    expect(queueActionBounds.x + queueActionBounds.width).toBeLessThanOrEqual(viewport.width + 1)
    if (viewport.name === '1440×900') {
      await expect(queueAction).toBeInViewport()
      expect(queueActionBounds.y).toBeGreaterThanOrEqual(0)
      expect(queueActionBounds.y + queueActionBounds.height).toBeLessThanOrEqual(viewport.height + 1)
    }

    await openCase(page, 'agent', CASES.developer)
    await expect(page.getByTestId('task-panel')).toBeVisible()
    dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
    await expectNoNarrativeInjection(page)
  })
}
