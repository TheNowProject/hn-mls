import { expect, test as base } from '@playwright/test'

const previewBaseUrl = process.env.PLAYWRIGHT_BASE_URL
const protectedPreviewOrigin = process.env.VERCEL_AUTOMATION_BYPASS_SECRET && previewBaseUrl
  ? new URL(previewBaseUrl).origin
  : null

const CASES = {
  developer: {
    id: 'sun-grand-thuy-khue',
    title: 'Căn hộ S2-12A · Thụy Khuê',
    npid: 'NPID-HN-09876',
    plid: 'PLID-HN-00125',
    ptid: 'PTID-HN-00031',
    route: 'Chủ đầu tư / HĐMB',
    shareId: 'CS-8F2D1A',
    buyerRef: 'NM-HN-0031',
    buyerName: 'N••• V••• A•',
    sellerRef: 'NB-HN-0031',
    sellerName: 'T••• M••• A•••',
    agentRef: 'MG-HN-0831',
    agentName: 'N••• H••• N••',
    representationId: 'REP-HN-00031',
    notaryContractId: 'HDCC-HN-260822-031',
    transactionType: 'Chuyển nhượng',
    price: '15600000000',
    priceLabel: '15.600.000.000',
    signingDate: '2026-08-22',
    signingDateLabel: '22/08/2026',
    representationStart: '2026-08-10',
    representationExpiry: '2026-09-09',
    customerLabel: 'T••• M••• A•••',
    sourceReceivedOn: '10/08/2026',
    sourceIds: ['SRC-HDMB-S2-12A', 'SRC-HS-BAN-S2-12A'],
  },
  landRegistry: {
    id: 'phu-thuong-landed-home',
    title: 'Nhà ở · Phú Thượng',
    npid: 'NPID-HN-10421',
    plid: 'PLID-HN-00208',
    ptid: 'PTID-HN-00044',
    route: 'Văn phòng đăng ký đất đai',
    shareId: 'CS-41C7E9',
    buyerRef: 'NM-HN-0044',
    buyerName: 'V••• T••• L•••',
    sellerRef: 'NB-HN-0044',
    sellerName: 'L••• T••• H•••',
    agentRef: 'MG-HN-0246',
    agentName: 'P••• Q••• M•••',
    representationId: 'REP-HN-00044',
    notaryContractId: 'HDCC-HN-260826-044',
    transactionType: 'Bán',
    price: '24600000000',
    priceLabel: '24.600.000.000',
    signingDate: '2026-08-26',
    signingDateLabel: '26/08/2026',
    representationStart: '2026-08-11',
    representationExpiry: '2026-09-10',
    customerLabel: 'L••• T••• H•••',
    sourceReceivedOn: '11/08/2026',
    sourceIds: ['SRC-GCN-PTH-118', 'SRC-HS-BAN-PTH-118'],
  },
}

const LANDING_CONNECTIONS = [
  {
    id: 'vneid',
    label: 'VNeID',
    action: 'Xem dữ liệu bàn giao',
    asset: '/assets/demo/vneid-google-play-2026-08-15.png',
    href: /https:\/\/play\.google\.com\/store\/apps\/details\?[^#]*id=com\.vnid/i,
    visibleUrl: 'play.google.com',
  },
  {
    id: 'source-357',
    label: 'Hệ thống thông tin về nhà ở và thị trường bất động sản',
    action: 'Xem ảnh chụp',
    asset: '/assets/demo/357-homepage-2026-08-15.png',
    href: 'https://thongtinbds.moc.gov.vn/',
    visibleUrl: 'thongtinbds.moc.gov.vn',
  },
  {
    id: 'housenow',
    label: 'HouseNow',
    action: 'Xem phạm vi phân phối',
    asset: '/assets/demo/housenow-can-ho-2026-08-15.png',
    href: 'https://www.housenow.com.vn/can-ho-chung-cu',
    visibleUrl: 'housenow.com.vn/can-ho-chung-cu',
  },
]

const FORBIDDEN_LANDING_ACTIONS = /^(?:đăng nhập(?: VNeID)?|xác nhận(?: qua VNeID)?|kết nối (?:VNeID|357|HouseNow)|mở ứng dụng VNeID|đăng tin|đăng bán|phát hành Tin bán|gửi (?:sang|lên) (?:VNeID|357|HouseNow))$/i

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

const LEGACY_IDENTIFIER_LABELS = [
  /^Mã BĐS$/i,
  /^Mã người mua$/i,
  /^Mã người bán$/i,
  /^Mã kết quả công chứng$/i,
  /^Mã kiểm tra tài liệu$/i,
  /^(?:Mã )?tham chiếu chủ mới$/i,
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

async function openLanding(page, route = '/') {
  await page.goto(route)
  await expect(page).toHaveTitle(/VMLS/)
  await expect(page.getByTestId('landing-page')).toBeVisible()
  await expect(page.getByTestId('app-shell')).toHaveCount(0)
}

async function searchLanding(page, query, expectedCase, otherCase) {
  const search = page.getByTestId('landing-search')
  await search.fill(query)
  await page.keyboard.press('Enter')
  await expect(page.getByTestId(`landing-case-${expectedCase.id}`)).toBeVisible()
  await expect(page.getByTestId(`landing-case-${otherCase.id}`)).toBeHidden()
}

function landingIdentity(page, kind) {
  return page.getByRole('region', { name: 'Tra cứu và điều phối hồ sơ' })
    .getByTestId(`landing-identity-${kind}`)
}

async function expectLandingIdentityChain(
  page,
  demoCase,
  { listingExists = false, transactionExists = false } = {},
) {
  const property = landingIdentity(page, 'npid')
  const listing = landingIdentity(page, 'plid')
  const transaction = landingIdentity(page, 'ptid')

  await expect(property).toContainText('Bất động sản')
  await expect(property).toContainText(demoCase.npid)
  await expect(property).not.toContainText(demoCase.plid)
  await expect(property).not.toContainText(demoCase.ptid)

  await expect(listing).toContainText('Tin bán')
  await expect(listing).not.toContainText(demoCase.npid)
  await expect(listing).not.toContainText(demoCase.ptid)
  if (listingExists) {
    await expect(listing).toContainText(demoCase.plid)
  } else {
    await expect(listing).toContainText('Chưa có')
    await expect(listing).not.toContainText(demoCase.plid)
    await expect(listing.getByRole('link')).toHaveCount(0)
    await expect(listing.getByRole('button')).toHaveCount(0)
  }

  await expect(transaction).toContainText('Giao dịch')
  await expect(transaction).not.toContainText(demoCase.npid)
  await expect(transaction).not.toContainText(demoCase.plid)
  if (transactionExists) {
    await expect(transaction).toContainText(demoCase.ptid)
  } else {
    await expect(transaction).toContainText('Chưa có')
    await expect(transaction).not.toContainText(demoCase.ptid)
    await expect(transaction.getByRole('link')).toHaveCount(0)
    await expect(transaction.getByRole('button')).toHaveCount(0)
  }
}

async function focusByKeyboard(page, locator, maxTabs = 24) {
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press('Tab')
    if (await locator.evaluate((element) => element === document.activeElement)) return
  }
  throw new Error(`Không thể đưa focus tới ${await locator.getAttribute('data-testid')} bằng phím Tab`)
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

async function expectNoLegacyIdentifierLabels(page) {
  for (const label of LEGACY_IDENTIFIER_LABELS) {
    await expect(
      page.getByText(label),
      `Không được hiển thị nhãn cũ ${label}`,
    ).toHaveCount(0)
    await expect(
      page.getByLabel(label),
      `Không được có trường nhập mang nhãn cũ ${label}`,
    ).toHaveCount(0)
  }
}

async function expectNoEditableConfirmationCode(page) {
  const fields = page.getByLabel(/^Mã xác nhận$/i)
  for (let index = 0; index < await fields.count(); index += 1) {
    expect(
      await fields.nth(index).evaluate((element) => (
        !element.matches('input, textarea, select') || element.readOnly || element.disabled
      )),
      'Mã xác nhận do hệ thống cấp không được cho Người bán chỉnh sửa',
    ).toBe(true)
  }
}

async function expectRepresentationParties(page, demoCase) {
  await openTab(page, 'Quyền đại diện')
  const main = page.getByRole('main')
  for (const heading of [
    'Thông tin Người bán',
    'Thông tin Người đại diện (Môi giới)',
    'Phạm vi và hiệu lực',
  ]) {
    await expect(main.getByRole('heading', { name: heading, exact: true })).toBeVisible()
  }
  for (const [label, value] of [
    ['Họ tên', demoCase.sellerName],
    ['Mã định danh Người bán', demoCase.sellerRef],
    ['Họ tên', demoCase.agentName],
    ['Mã định danh Người đại diện', demoCase.agentRef],
  ]) {
    await expect(main.getByText(label, { exact: true }).first()).toBeVisible()
    await expect(main.getByText(value, { exact: true }).first()).toBeVisible()
  }
  for (const label of ['Trạng thái', 'Kênh xác nhận', 'Phạm vi', 'Ngày bắt đầu', 'Ngày hết hạn']) {
    await expect(main.getByText(label, { exact: true }).first()).toBeVisible()
  }
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

async function requestRepresentation(page, demoCase) {
  await page.goto('/#/vai-tro/agent/cong-viec')
  await openCase(page, 'agent', demoCase)

  const propertyId = page.getByLabel('Mã định danh Bất động sản', { exact: true })
  await expect(propertyId).toBeVisible()
  await propertyId.fill(demoCase.npid)
  await expect(page.getByRole('radio')).toHaveCount(0)
  await expect(page.getByRole('group', { name: 'Nguồn dùng để đối chiếu' })).toHaveCount(0)
  await expect(page.getByTestId('action-match_property')).toHaveCount(0)

  await page.getByLabel('Phạm vi đại diện').selectOption('Độc quyền')
  await expect(page.getByLabel('Ngày hiệu lực')).toHaveValue(demoCase.representationStart)
  await expect(page.getByLabel('Ngày hết hạn')).toHaveValue(demoCase.representationExpiry)
  await expect(page.getByRole('button', { name: 'Gửi thông tin đến Người bán', exact: true })).toBeVisible()
  await submitAction(page, 'request_seller_confirmation')
  await expect(page.getByTestId('action-request_seller_confirmation')).toHaveCount(0)

  await openTab(page, 'Dữ liệu BĐS')
  await expect(page.getByRole('columnheader', { name: 'Ngày ghi nhận' })).toBeVisible()
  for (const sourceId of demoCase.sourceIds) {
    const sourceRow = page.getByText(sourceId, { exact: true })
      .locator('xpath=ancestor::tr[1]')
    await expect(sourceRow).toContainText(demoCase.sourceReceivedOn)
  }
  await openTab(page, 'Tổng quan')
  await expectNoLegacyIdentifierLabels(page)
}

async function confirmRepresentation(page, demoCase) {
  await switchRole(page, 'seller')
  await openCase(page, 'seller', demoCase)

  const acknowledgement = page.getByRole('checkbox', {
    name: /Tôi đã kiểm tra Bất động sản, người đại diện, phạm vi và thời hạn/,
  })
  await expectNoEditableConfirmationCode(page)
  await acknowledgement.check()
  await submitAction(page, 'confirm_representation')

  await expect(page.getByTestId('object-plid')).toContainText(demoCase.plid)
  await expect(page.getByTestId('action-create_listing')).toHaveCount(0)
  await openTab(page, 'Quyền đại diện')
  await expect(page.getByText(demoCase.representationId, { exact: true }).first()).toBeVisible()
  await expectRepresentationParties(page, demoCase)
  await openTab(page, 'Lịch sử')
  const history = page.getByRole('heading', { name: 'Lịch sử thay đổi' })
    .locator('xpath=ancestor::section[1]')
  for (const actionLabel of ['Gửi thông tin đến Người bán', 'Xác nhận quyền đại diện']) {
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
  await expectNoLegacyIdentifierLabels(page)
}

async function recordBuyer(page, demoCase) {
  await switchRole(page, 'agent')
  await openCase(page, 'agent', demoCase)

  await page.getByLabel('Mã định danh Người mua', { exact: true }).fill(demoCase.buyerRef)
  await page.getByLabel('Giá đã thống nhất (VND)').fill(demoCase.price)
  await page.getByLabel('Ngày dự kiến ký').fill(demoCase.signingDate)
  await submitAction(page, 'record_buyer')
  await expect(page.getByTestId('action-record_buyer')).toHaveCount(0)
}

async function verifyBuyerReadiness(page, demoCase, { shareWithBank }) {
  await switchRole(page, 'buyer')
  await openCase(page, 'buyer', demoCase)

  const task = page.getByTestId('task-panel')
  const contractSummary = task.getByRole('region', {
    name: 'Thông tin hợp đồng cần xác nhận',
    exact: true,
  })
  await expect(contractSummary).toBeVisible()
  for (const [label, value] of [
    ['Họ tên Người mua', demoCase.buyerName],
    ['Mã định danh Người mua', demoCase.buyerRef],
    ['Mã định danh Bất động sản', demoCase.npid],
    ['Loại giao dịch', demoCase.transactionType],
    ['Giá đã thống nhất', demoCase.priceLabel],
    ['Ngày dự kiến ký', demoCase.signingDateLabel],
  ]) {
    await expect(contractSummary.getByText(label, { exact: true }).first()).toBeVisible()
    await expect(contractSummary).toContainText(value)
  }
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
  await openTab(page, 'Người mua')
  await expect(page.getByText('Họ tên', { exact: true }).first()).toBeVisible()
  await expect(page.getByText(demoCase.buyerName, { exact: true }).first()).toBeVisible()
  await expect(page.getByText('Mã định danh Người mua', { exact: true }).first()).toBeVisible()
  await expect(page.getByText(demoCase.buyerRef, { exact: true }).first()).toBeVisible()
  await expectNoLegacyIdentifierLabels(page)
}

async function submitNotaryDossier(page, demoCase, { exerciseInvalidPayload = false } = {}) {
  await switchRole(page, 'notary')
  await openCase(page, 'notary', demoCase)
  await expectRepresentationParties(page, demoCase)
  await openTab(page, 'Tổng quan')

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
  await page.getByLabel('Mã hợp đồng', { exact: true }).fill(demoCase.notaryContractId)
  await page.getByLabel('Thời điểm ký').fill(
    demoCase.id === CASES.developer.id ? '2026-08-22T15:30' : '2026-08-26T10:00',
  )
  await expect(page.getByLabel('Mã kiểm tra tài liệu', { exact: true })).toHaveCount(0)
  await submitAction(page, 'record_notary_signing')

  await expect(page.getByTestId('object-ptid')).toContainText(demoCase.ptid)
  await expect(page.getByTestId('action-create_transaction')).toHaveCount(0)
  await openTab(page, 'Công chứng')
  await expect(page.getByText('Mã hợp đồng', { exact: true }).first()).toBeVisible()
  await expect(page.getByText(demoCase.notaryContractId, { exact: true }).first()).toBeVisible()
  await expectNoLegacyIdentifierLabels(page)
  await switchRole(page, 'vmls')
  await openCase(page, 'vmls', demoCase)
  await openTab(page, 'Chuyển quyền')
  await expectTransferRoute(page, demoCase.route)
  await expect(page.getByTestId('object-ptid')).toContainText(demoCase.ptid)
  await expectNoLegacyIdentifierLabels(page)
}

async function advanceToNotary(page, demoCase, { shareWithBank, exerciseInvalidPayload = false }) {
  await requestRepresentation(page, demoCase)
  await confirmRepresentation(page, demoCase)
  await recordBuyer(page, demoCase)
  await verifyBuyerReadiness(page, demoCase, { shareWithBank })
  await submitNotaryDossier(page, demoCase, { exerciseInvalidPayload })
}

test.beforeEach(async ({ page }) => {
  await startFresh(page)
})

test('đường dẫn công khai mở landing còn CTA và hash workspace vào đúng hàng đợi', async ({ page }) => {
  for (const route of ['/', '/#/']) {
    await openLanding(page, route)
    await expect(page.getByTestId('enter-workspace')).toBeVisible()
    await expect(page.getByTestId('work-queue')).toHaveCount(0)
  }

  await openLanding(page)
  await page.getByTestId('enter-workspace').click()
  await expect(page).toHaveURL(/#\/vai-tro\/agent\/cong-viec$/)
  await expect(page.getByTestId('app-shell')).toBeVisible()
  await expect(page.getByTestId('work-queue')).toBeVisible()
  await expect(page.getByTestId('landing-page')).toHaveCount(0)

  await page.goto('/#/vai-tro/agent/cong-viec')
  await expect(page.getByTestId('app-shell')).toBeVisible()
  await expect(page.getByTestId('work-queue')).toBeVisible()
  await expect(page.getByTestId('landing-page')).toHaveCount(0)
})

test('route tra cứu giữ query qua reload, browser Back và mở trực tiếp case-key', async ({ page }) => {
  await openLanding(page)

  const search = page.getByTestId('landing-search')
  await search.fill(CASES.developer.npid)
  await page.keyboard.press('Enter')
  await expect.poll(() => new URL(page.url()).hash).toBe(
    `#/tra-cuu?q=${CASES.developer.npid}`,
  )
  await expect(search).toHaveValue(CASES.developer.npid)
  await expect(page.getByTestId(`landing-case-${CASES.developer.id}`)).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expectLandingIdentityChain(page, CASES.developer)

  await page.reload()
  await expect.poll(() => new URL(page.url()).hash).toBe(
    `#/tra-cuu?q=${CASES.developer.npid}`,
  )
  await expect(page.getByTestId('landing-search')).toHaveValue(CASES.developer.npid)
  await expect(page.getByTestId(`landing-case-${CASES.developer.id}`)).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expectLandingIdentityChain(page, CASES.developer)

  const publicResult = page.getByRole('region', { name: 'Tra cứu và điều phối hồ sơ' })
  await publicResult.getByRole('button', { name: 'Mở hồ sơ · Môi giới', exact: true }).click()
  await expect(page).toHaveURL(
    new RegExp(`#\/vai-tro\/agent\/ho-so\/${CASES.developer.id}\/tong-quan$`),
  )
  await expect(page.getByTestId('app-shell')).toBeVisible()

  await page.goBack()
  await expect.poll(() => new URL(page.url()).hash).toBe(
    `#/tra-cuu?q=${CASES.developer.npid}`,
  )
  await expect(page.getByTestId('landing-page')).toBeVisible()
  await expect(page.getByTestId('landing-search')).toHaveValue(CASES.developer.npid)
  await expectLandingIdentityChain(page, CASES.developer)

  await page.goto(`/#/tra-cuu/${CASES.landRegistry.id}`)
  await expect(page.getByTestId('landing-page')).toBeVisible()
  await expect(page.getByTestId(`landing-case-${CASES.landRegistry.id}`)).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expectLandingIdentityChain(page, CASES.landRegistry)
  await expect(
    page.getByRole('region', { name: 'Tra cứu và điều phối hồ sơ' })
      .getByRole('heading', { name: CASES.landRegistry.title, exact: true }),
  ).toBeFocused()

  await page.goto('/#/tra-cuu/%E0%A4%A')
  await expect(page.getByText('Không tìm thấy hồ sơ', { exact: true })).toBeVisible()
  await expect(page.locator('[data-testid^="landing-case-"]')).toHaveCount(0)
  await page.getByRole('button', { name: 'Xóa nội dung tìm kiếm' }).click()
  await expect.poll(() => new URL(page.url()).hash).toBe('#/')
})

test('landing tìm theo state hiện tại và chỉ mở PLID, PTID sau đúng lifecycle', async ({ page }) => {
  await openLanding(page)

  for (const query of [CASES.developer.npid, 'S2-12A']) {
    await searchLanding(page, query, CASES.developer, CASES.landRegistry)
    await expectLandingIdentityChain(page, CASES.developer)
  }

  for (const query of [CASES.landRegistry.npid, 'Phú Thượng']) {
    await searchLanding(page, query, CASES.landRegistry, CASES.developer)
    await expectLandingIdentityChain(page, CASES.landRegistry)
  }

  const search = page.getByTestId('landing-search')
  for (const futureId of [
    CASES.developer.plid,
    CASES.developer.ptid,
    CASES.landRegistry.plid,
    CASES.landRegistry.ptid,
  ]) {
    await search.fill(futureId)
    await page.keyboard.press('Enter')
    await expect(page.getByText('Không tìm thấy hồ sơ', { exact: true })).toBeVisible()
    await expect(page.getByText(futureId, { exact: true })).toHaveCount(0)
  }

  await requestRepresentation(page, CASES.developer)
  await confirmRepresentation(page, CASES.developer)
  await openLanding(page)
  await searchLanding(page, CASES.developer.plid, CASES.developer, CASES.landRegistry)
  await expectLandingIdentityChain(page, CASES.developer, { listingExists: true })

  await page.goto('/#/vai-tro/agent/cong-viec')
  await recordBuyer(page, CASES.developer)
  await verifyBuyerReadiness(page, CASES.developer, { shareWithBank: false })
  await submitNotaryDossier(page, CASES.developer)
  await recordNotarySigning(page, CASES.developer)
  await openLanding(page)
  await searchLanding(page, CASES.developer.ptid, CASES.developer, CASES.landRegistry)
  await expectLandingIdentityChain(page, CASES.developer, {
    listingExists: true,
    transactionExists: true,
  })
})

test('landing chỉ tìm trường công khai và xóa query khỏi URL', async ({ page }) => {
  await openLanding(page)

  for (const query of ['Sun Grand City Thụy Khuê Residence', 'Căn hộ thuộc dự án', 'S2-12A']) {
    await searchLanding(page, query, CASES.developer, CASES.landRegistry)
  }

  const search = page.getByTestId('landing-search')
  await search.fill('HS-KB-HN-00031')
  await page.keyboard.press('Enter')
  await expect(page.getByText('Không tìm thấy hồ sơ', { exact: true })).toBeVisible()
  await expect(page.locator('body')).not.toContainText('HS-KB-HN-00031')

  await page.getByRole('button', { name: 'Xóa nội dung tìm kiếm' }).click()
  await expect.poll(() => new URL(page.url()).hash).toBe('#/')
  await expect(page.getByTestId('landing-search')).toHaveValue('')
  await expect(page.locator('[data-testid^="landing-case-"]')).toHaveCount(2)

  const markup = await page.locator('body').evaluate((element) => element.outerHTML)
  for (const restrictedValue of [
    'HS-KB-HN-00031',
    CASES.developer.customerLabel,
    'NM-HN-0031',
    'REP-HN-00031',
    CASES.developer.shareId,
    'correlationId',
    'auditEvents',
    'integrationEvents',
  ]) {
    expect(markup).not.toContain(restrictedValue)
  }
})

test('vai trò landing được giữ qua tra cứu và không fallback sang hồ sơ Môi giới', async ({ page }) => {
  await openLanding(page)
  const role = page.getByLabel('Vai trò vào không gian làm việc')
  await role.selectOption('bank')
  await expect(role).toHaveValue('bank')

  await searchLanding(page, CASES.developer.npid, CASES.developer, CASES.landRegistry)
  await expect(page.getByLabel('Vai trò vào không gian làm việc')).toHaveValue('bank')
  await page.reload()
  await expect(page.getByLabel('Vai trò vào không gian làm việc')).toHaveValue('bank')

  const publicResult = page.getByRole('region', { name: 'Tra cứu và điều phối hồ sơ' })
  await publicResult.getByRole('button', { name: 'Xem hàng đợi · Ngân hàng', exact: true }).click()
  await expect(page).toHaveURL(/#\/vai-tro\/bank\/cong-viec$/)
  await expect(page.getByTestId('work-queue')).toBeVisible()
  await expect(page).not.toHaveURL(/#\/vai-tro\/agent\/ho-so\//)
})

test('landing tiếp tục đúng không gian vận hành đã dùng gần nhất', async ({ page }) => {
  await openCase(page, 'agent', CASES.landRegistry)
  await expect(page).toHaveURL(
    new RegExp(`#\/vai-tro\/agent\/ho-so\/${CASES.landRegistry.id}\/tong-quan$`),
  )

  await openLanding(page)
  await expect(page.getByTestId('enter-workspace')).toContainText('Tiếp tục công việc')
  await page.getByTestId('enter-workspace').click()
  await expect(page).toHaveURL(
    new RegExp(`#\/vai-tro\/agent\/ho-so\/${CASES.landRegistry.id}\/tong-quan$`),
  )
})

test('landing hạ route hồ sơ hết quyền về đúng hàng đợi vai trò', async ({ page }) => {
  await openLanding(page)
  await page.evaluate(({ storageKey, staleRoute }) => {
    const envelope = JSON.parse(window.localStorage.getItem(storageKey))
    window.localStorage.setItem(storageKey, JSON.stringify({
      ...envelope,
      landingRoleId: 'bank',
      lastWorkspaceRoute: staleRoute,
    }))
  }, {
    storageKey: 'vmls:operations:2026-08:v3',
    staleRoute: `#/vai-tro/bank/ho-so/${CASES.developer.shareId}/tong-quan`,
  })
  await page.reload()

  await expect(page.getByLabel('Vai trò vào không gian làm việc')).toHaveValue('bank')
  await expect(page.getByTestId('enter-workspace')).toContainText('Tiếp tục công việc')
  await page.getByTestId('enter-workspace').click()
  await expect(page).toHaveURL(/#\/vai-tro\/bank\/cong-viec$/)
  await expect(page.getByRole('heading', { name: 'Chưa có hồ sơ được chia sẻ' })).toBeVisible()
})

test('landing mở đúng token chia sẻ khi Ngân hàng đã được đồng ý', async ({ page }) => {
  await requestRepresentation(page, CASES.developer)
  await confirmRepresentation(page, CASES.developer)
  await recordBuyer(page, CASES.developer)
  await verifyBuyerReadiness(page, CASES.developer, { shareWithBank: true })

  await openLanding(page)
  await page.getByLabel('Vai trò vào không gian làm việc').selectOption('bank')
  await searchLanding(page, CASES.developer.npid, CASES.developer, CASES.landRegistry)
  const publicResult = page.getByRole('region', { name: 'Tra cứu và điều phối hồ sơ' })
  await publicResult.getByRole('button', { name: 'Mở hồ sơ · Ngân hàng', exact: true }).click()

  await expect(page).toHaveURL(
    new RegExp(`#\/vai-tro\/bank\/ho-so\/${CASES.developer.shareId}\/tong-quan$`),
  )
  await expect(page.getByRole('heading', { name: 'Căn hộ thuộc dự án' })).toBeVisible()
  await expect(page.getByText(CASES.developer.npid, { exact: true })).toHaveCount(0)
})

test('landing chỉ trình bày bản chụp local và metadata đọc cho VNeID, 357, HouseNow', async ({ page }) => {
  await openLanding(page)

  await expect(page.getByRole('button', { name: FORBIDDEN_LANDING_ACTIONS })).toHaveCount(0)
  await expect(page.getByRole('link', { name: FORBIDDEN_LANDING_ACTIONS })).toHaveCount(0)

  for (const connection of LANDING_CONNECTIONS) {
    const card = page.getByTestId(`landing-connection-${connection.id}`)
    await expect(card).toBeVisible()
    await expect(card).toContainText(connection.label)
    await expect(card).not.toContainText(/Đã kết nối|Đã đồng bộ|Thành công/i)

    const trigger = card.getByRole('button', { name: connection.action, exact: true })
    await trigger.click()

    const drawer = page.getByTestId('landing-connection-drawer')
    await expect(drawer).toBeVisible()
    await expect(drawer).toContainText(connection.label)
    await expect(drawer).toContainText(connection.visibleUrl)
    await expect(drawer).toContainText('15/08/2026')
    await expect(drawer.locator('form, input, select, textarea, [contenteditable="true"]')).toHaveCount(0)
    await expect(drawer.getByRole('button', { name: FORBIDDEN_LANDING_ACTIONS })).toHaveCount(0)
    await expect(drawer.getByRole('link', { name: FORBIDDEN_LANDING_ACTIONS })).toHaveCount(0)

    const sourceLink = drawer.locator('a[href]').first()
    await expect(sourceLink).toHaveAttribute('href', connection.href)

    const screenshot = drawer.locator(`img[src="${connection.asset}"]`)
    await expect(screenshot).toBeVisible()
    await expect(screenshot).toHaveAttribute('alt', /\S+/)
    await expect.poll(
      () => screenshot.evaluate((image) => image.complete && image.naturalWidth > 0),
    ).toBe(true)

    await expect(drawer.getByRole('heading').first()).toBeFocused()
    await expect(drawer.getByRole('button', { name: 'Đóng' })).toBeVisible()
    await expect(drawer.getByRole('button')).toHaveCount(1)
    await page.keyboard.press('Shift+Tab')
    await expect(drawer.locator(':focus')).toHaveCount(1)
    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()
    await expect(trigger).toBeFocused()
  }
})

test('landing thao tác được bằng bàn phím và hiển thị focus rõ ràng', async ({ page }) => {
  await openLanding(page)

  const search = page.getByTestId('landing-search')
  await focusByKeyboard(page, search)
  await expect(search).toBeFocused()
  expect(await search.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none')

  await page.keyboard.type(CASES.developer.npid)
  await page.keyboard.press('Enter')
  const result = page.getByTestId(`landing-case-${CASES.developer.id}`)
  await expect(result).toBeVisible()
  await expect(page.getByRole('heading', { name: CASES.developer.title, exact: true })).toBeFocused()

  const connectionTrigger = page.getByTestId('landing-connection-vneid')
    .getByRole('button', { name: 'Xem dữ liệu bàn giao', exact: true })
  await connectionTrigger.focus()
  await page.keyboard.press('Enter')
  const drawer = page.getByTestId('landing-connection-drawer')
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('heading').first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(connectionTrigger).toBeFocused()

  const enterWorkspace = page.getByTestId('enter-workspace')
  await enterWorkspace.focus()
  expect(await enterWorkspace.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#\/vai-tro\/agent\/cong-viec$/)
  await expect(page.getByTestId('work-queue')).toBeVisible()
})

for (const viewport of [
  { name: '1440×900', width: 1440, height: 900 },
  { name: '1024×768', width: 1024, height: 768 },
  { name: '390×844', width: 390, height: 844 },
]) {
  test(`landing không tràn ngang và giữ control chính ở ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await openLanding(page)
    await searchLanding(page, CASES.developer.npid, CASES.developer, CASES.landRegistry)

    for (const testId of ['landing-search', 'enter-workspace']) {
      await expect(page.getByTestId(testId)).toBeVisible()
    }
    for (const kind of ['npid', 'plid', 'ptid']) {
      await expect(landingIdentity(page, kind)).toBeVisible()
    }

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)

    for (const locator of [page.getByTestId('landing-search'), page.getByTestId('enter-workspace')]) {
      const bounds = await locator.boundingBox()
      expect(bounds).not.toBeNull()
      expect(bounds.x).toBeGreaterThanOrEqual(-1)
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width + 1)
    }

    if (viewport.width === 390) {
      const searchBounds = await page.getByTestId('landing-search').boundingBox()
      const ctaBounds = await page.getByTestId('enter-workspace').boundingBox()
      expect(searchBounds.height).toBeGreaterThanOrEqual(44)
      expect(ctaBounds.height).toBeGreaterThanOrEqual(44)

      const propertyBounds = await landingIdentity(page, 'npid').boundingBox()
      const listingBounds = await landingIdentity(page, 'plid').boundingBox()
      const transactionBounds = await landingIdentity(page, 'ptid').boundingBox()
      expect(listingBounds.y).toBeGreaterThan(propertyBounds.y)
      expect(transactionBounds.y).toBeGreaterThan(listingBounds.y)
    } else {
      await expect(page.getByTestId('landing-search')).toBeInViewport()
      await expect(landingIdentity(page, 'npid')).toBeInViewport()
      await expect(landingIdentity(page, 'plid')).toBeInViewport()
      await expect(landingIdentity(page, 'ptid')).toBeInViewport()
      await expect(page.getByTestId('enter-workspace')).toBeInViewport()
    }
  })
}

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

test('Môi giới có điểm Khởi tạo không làm thay đổi hai hồ sơ tạo sẵn', async ({ page }) => {
  const createAction = page.getByRole('button', { name: 'Khởi tạo', exact: true })
  const caseRows = page.locator('[data-testid^="case-row-"]')

  await expect(page).toHaveURL(/#\/vai-tro\/agent\/cong-viec$/)
  await expect(createAction).toBeVisible()
  await expect(createAction).toBeDisabled()
  await expect(caseRows).toHaveCount(2)
  await expect(page.getByTestId(`case-row-${CASES.developer.id}`)).toBeVisible()
  await expect(page.getByTestId(`case-row-${CASES.landRegistry.id}`)).toBeVisible()

  const beforeAttempt = await page.evaluate(() => ({
    hash: window.location.hash,
    storage: { ...window.localStorage },
  }))
  await createAction.evaluate((element) => element.click())
  const afterAttempt = await page.evaluate(() => ({
    hash: window.location.hash,
    storage: { ...window.localStorage },
  }))

  expect(afterAttempt).toEqual(beforeAttempt)
  await expect(caseRows).toHaveCount(2)
  await expect(page.getByTestId(`case-row-${CASES.developer.id}`)).toBeVisible()
  await expect(page.getByTestId(`case-row-${CASES.landRegistry.id}`)).toBeVisible()

  await switchRole(page, 'brokerage')
  await expect(page.getByRole('button', { name: 'Khởi tạo', exact: true })).toHaveCount(0)
})

for (const demoCase of Object.values(CASES)) {
  test(`quyền đại diện dùng mã định danh và luôn đủ hai bên · ${demoCase.title}`, async ({ page }) => {
    await openCase(page, 'agent', demoCase)
    const task = page.getByTestId('task-panel')
    const propertyId = task.getByLabel('Mã định danh Bất động sản', { exact: true })

    await expect(propertyId).toBeVisible()
    await expect(page.getByRole('button', {
      name: 'Gửi thông tin đến Người bán',
      exact: true,
    })).toBeVisible()
    await expect(task.getByRole('radio')).toHaveCount(0)
    await expect(task.getByRole('group', { name: 'Nguồn dùng để đối chiếu' })).toHaveCount(0)
    await expect(task).not.toContainText('Chọn một bản ghi')
    await expect(task).not.toContainText('Khớp Bất động sản')
    await expectRepresentationParties(page, demoCase)
    await expectNoLegacyIdentifierLabels(page)

    await requestRepresentation(page, demoCase)
    await switchRole(page, 'seller')
    await openCase(page, 'seller', demoCase)
    await expectRepresentationParties(page, demoCase)
    await openTab(page, 'Tổng quan')
    await expectNoEditableConfirmationCode(page)
    await expectNoLegacyIdentifierLabels(page)

    await confirmRepresentation(page, demoCase)
    await expectRepresentationParties(page, demoCase)
    await expectNoLegacyIdentifierLabels(page)
  })
}

test('các vai trò được phép đều thấy đủ Người bán và Người đại diện', async ({ page }) => {
  await requestRepresentation(page, CASES.developer)

  for (const roleId of ['agent', 'brokerage', 'seller', 'vmls']) {
    await openCase(page, roleId, CASES.developer)
    await expectRepresentationParties(page, CASES.developer)
    await expectNoLegacyIdentifierLabels(page)
  }
})

test('biểu mẫu giải thích payload nghiệp vụ sai và vai trò sai không có hành động', async ({ page }) => {
  await openCase(page, 'agent', CASES.developer)
  const propertyId = page.getByLabel('Mã định danh Bất động sản', { exact: true })
  await propertyId.fill('NPID-HN-00000')
  await expect(page.getByRole('radio')).toHaveCount(0)
  await expect(page.getByRole('group', { name: 'Nguồn dùng để đối chiếu' })).toHaveCount(0)
  await submitAction(page, 'request_seller_confirmation')
  await expect(page.getByRole('alert')).toHaveText(
    'Kiểm tra mã định danh Bất động sản, phạm vi và thời hạn của quyền đại diện.',
  )
  await expect(page.getByTestId('action-request_seller_confirmation')).toBeVisible()
  await expect(page.getByTestId('object-plid')).toBeDisabled()

  await propertyId.fill(CASES.developer.npid)
  const start = page.getByLabel('Ngày hiệu lực')
  const expiry = page.getByLabel('Ngày hết hạn')
  await expect(start).toHaveValue(CASES.developer.representationStart)
  await expiry.fill(CASES.developer.representationStart)
  await submitAction(page, 'request_seller_confirmation')
  await expect(page.getByRole('alert')).toHaveText('Ngày hết hạn phải sau ngày hiệu lực.')
  await expect(expiry).toBeFocused()
  await expect(page.getByTestId('action-request_seller_confirmation')).toBeVisible()
  await expect(page.getByTestId('object-plid')).toBeDisabled()
  await expectNoLegacyIdentifierLabels(page)

  await switchRole(page, 'brokerage')
  await openCase(page, 'brokerage', CASES.developer)
  await expect(page.getByTestId('task-panel')).toContainText('Đang chờ cập nhật')
  await expect(page.locator('[data-testid^="action-"]')).toHaveCount(0)
  await expectNoNarrativeInjection(page)
})

test('Người mua bỏ trống checklist nhận lỗi tiếng Việt mà không đổi trạng thái', async ({ page }) => {
  await requestRepresentation(page, CASES.developer)
  await confirmRepresentation(page, CASES.developer)
  await recordBuyer(page, CASES.developer)
  await switchRole(page, 'buyer')
  await openCase(page, 'buyer', CASES.developer)

  const checklist = page.getByRole('group', { name: 'Nội dung Người mua xác nhận' })
  const requiredChecks = checklist.getByRole('checkbox')
  await expect(requiredChecks).toHaveCount(3)
  for (const checkbox of await requiredChecks.all()) {
    await expect(checkbox).not.toBeChecked()
  }
  await expect(page.getByText('Chờ người mua xác nhận', { exact: true }).first()).toBeVisible()

  const storageBefore = await page.evaluate((storageKey) => (
    window.localStorage.getItem(storageKey)
  ), 'vmls:operations:2026-08:v3')
  expect(storageBefore).not.toBeNull()

  async function observeNativeInvalidEvents() {
    const form = page.getByTestId('action-verify_readiness').locator('xpath=ancestor::form[1]')
    await form.evaluate((element) => {
      window.__vmlsNativeInvalidEvents = []
      element.addEventListener('invalid', (event) => {
        window.__vmlsNativeInvalidEvents.push(event.target.type)
      }, true)
    })
  }

  async function expectVietnameseApplicationError() {
    const alert = page.getByRole('alert')
    await expect(alert).toHaveText('Xác nhận đủ ba nội dung sẵn sàng trước công chứng.')
    expect(await alert.innerText()).not.toMatch(/please|fill out|check this box|required field/i)
    expect(await page.evaluate(() => window.__vmlsNativeInvalidEvents)).toEqual([])
    await expect(page.getByTestId('action-verify_readiness')).toBeVisible()
    await expect(page.getByText('Chờ người mua xác nhận', { exact: true }).first()).toBeVisible()
    for (const checkbox of await requiredChecks.all()) {
      await expect(checkbox).not.toBeChecked()
    }
    expect(await page.evaluate((storageKey) => (
      window.localStorage.getItem(storageKey)
    ), 'vmls:operations:2026-08:v3')).toBe(storageBefore)
  }

  await observeNativeInvalidEvents()
  await page.getByTestId('action-verify_readiness').click()
  await expectVietnameseApplicationError()

  await page.reload()
  await expect(page.getByTestId('action-verify_readiness')).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)
  await observeNativeInvalidEvents()
  await page.getByTestId('action-verify_readiness').focus()
  await page.keyboard.press('Enter')
  await expectVietnameseApplicationError()
})

test('Sàn điều phối bằng cột nghiệp vụ và bộ lọc có tác dụng', async ({ page }) => {
  await requestRepresentation(page, CASES.developer)
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
  await requestRepresentation(page, CASES.developer)
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
  await expect(page.getByLabel(/^(?:Mã )?tham chiếu chủ mới$/i)).toHaveCount(0)
  await submitAction(page, 'approve_land_registry')

  await expect(page.getByTestId('task-panel')).toContainText('Không còn việc cần xử lý')
  await openTab(page, 'Chuyển quyền')
  await expectTransferRoute(page, CASES.landRegistry.route)
  await expect(page.getByTestId('object-ptid')).toContainText(CASES.landRegistry.ptid)
  await expect(page.getByText(/^(?:Mã )?tham chiếu chủ mới$/i)).toHaveCount(0)
  await expectNoLegacyIdentifierLabels(page)

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

test('registry nguồn có ba điểm nối và 357 không được gắn vào dossier', async ({ page }) => {
  await expect(page.getByTestId('source-357')).toHaveCount(0)
  await switchRole(page, 'vmls')
  await page.getByRole('navigation', { name: 'Phân hệ nghiệp vụ' })
    .getByRole('button', { name: 'Kết nối & nguồn dữ liệu' })
    .click()
  await expect(page).toHaveURL(/#\/vai-tro\/vmls\/nguon-du-lieu$/)

  await expect(page.getByText('3 điểm nối', { exact: true })).toBeVisible()
  await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(3)

  const vneid = page.getByTestId('vneid')
  await expect(vneid).toContainText('VNeID')
  await expect(vneid).toContainText('Trung tâm dữ liệu quốc gia về dân cư')
  await expect(vneid).toContainText('Điểm xác nhận người bán')
  await expect(vneid).toContainText('Chưa kết nối')
  await expect(vneid).toContainText('15/08/2026')

  const housenow = page.getByTestId('housenow')
  await expect(housenow).toContainText('HouseNow')
  await expect(housenow).toContainText('Kênh phân phối Tin bán')
  await expect(housenow).toContainText('Chưa phát hành')
  await expect(housenow).toContainText('15/08/2026')
  await expect(housenow.getByRole('link')).toHaveAttribute(
    'href',
    'https://www.housenow.com.vn/can-ho-chung-cu',
  )

  const source = page.getByTestId('source-357')
  await expect(source).toBeVisible()
  await expect(source).toContainText('Bộ Xây dựng')
  await expect(source).toContainText('Nguồn tham chiếu công khai')
  await expect(source).toContainText('Chưa cấu hình')
  await expect(source).toContainText('15/08/2026')
  await expect(source.getByRole('link')).toHaveAttribute('href', 'https://thongtinbds.moc.gov.vn/')
  for (const demoCase of Object.values(CASES)) {
    await expect(source).not.toContainText(demoCase.npid)
  }

  const previewTrigger = source.getByRole('button', { name: 'Xem bản chụp' })
  await previewTrigger.click()
  const drawer = page.getByTestId('source-preview')
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('button', { name: 'Đóng' })).toBeFocused()
  await expect(drawer).toContainText('Chưa có dữ liệu cấp hồ sơ')
  for (const demoCase of Object.values(CASES)) {
    await expect(drawer).not.toContainText(demoCase.npid)
  }
  const screenshot = drawer.getByRole('img', { name: /chụp ngày 15\/08\/2026/ })
  await expect(screenshot).toHaveAttribute('src', '/assets/demo/357-homepage-2026-08-15.png')
  await expect.poll(() => screenshot.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true)

  await page.keyboard.press('Escape')
  await expect(drawer).toBeHidden()
  await expect(previewTrigger).toBeFocused()
  await expect(page.getByTestId('distribution-housenow')).toHaveCount(0)
  await expectNoNarrativeInjection(page)
})

test('tiến độ và hash route được lưu, còn đặt lại trả cả hai hồ sơ về ban đầu', async ({ page }) => {
  await requestRepresentation(page, CASES.developer)
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
  await expect(page.getByTestId('case-row-sun-grand-thuy-khue')).toContainText('Chờ gửi')
  await expect(page.getByText(CASES.developer.plid, { exact: true })).toHaveCount(0)
  await page.reload()
  await expect(page.getByTestId('case-row-sun-grand-thuy-khue')).toContainText('Chờ gửi')
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

    const createAction = page.getByRole('button', { name: 'Khởi tạo', exact: true })
    await expect(createAction).toBeVisible()
    await expect(createAction).toBeDisabled()
    await expect(createAction).toBeInViewport()

    const createActionBounds = await createAction.boundingBox()
    expect(createActionBounds).not.toBeNull()
    expect(createActionBounds.x).toBeGreaterThanOrEqual(-1)
    expect(createActionBounds.x + createActionBounds.width).toBeLessThanOrEqual(viewport.width + 1)

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
