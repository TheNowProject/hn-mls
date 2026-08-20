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
    buyerRef: 'NM-HN-0031',
    buyerName: 'N••• V••• A•',
    price: '15600000000',
    signingOn: '2026-08-22',
    notaryCaseId: 'HSCC-HN-00031',
    taxCaseId: 'HST-HN-00031',
    notaryContractId: 'HDCC-HN-260822-031',
    routeLabel: 'Chủ đầu tư / HĐMB',
    source357: '357-HN-09876',
    sourceVersion: '2026-08-10.1',
  },
  landRegistry: {
    id: 'phu-thuong-landed-home',
    title: 'Nhà ở · Phú Thượng',
    npid: 'NPID-HN-10421',
    plid: 'PLID-HN-00208',
    ptid: 'PTID-HN-00044',
    buyerRef: 'NM-HN-0044',
    buyerName: 'V••• T••• L•••',
    price: '24600000000',
    signingOn: '2026-08-26',
    notaryCaseId: 'HSCC-HN-00044',
    taxCaseId: 'HST-HN-00044',
    landCaseId: 'VPDKDD-HN-260826-044',
    notaryContractId: 'HDCC-HN-260826-044',
    routeLabel: 'Văn phòng đăng ký đất đai',
    source357: '357-HN-10421',
    sourceVersion: '2026-08-11.1',
  },
}

const SELLER_LISTING = {
  id: 'PLID-HN-31001',
  npid: 'NPID-HN-21001',
  title: 'A2-1208 · Tây Hồ Garden',
  detailedLocation: 'Phú Thượng',
  originalPrice: '7.680.000.000',
  correctedPrice: '7850000000',
  correctedPriceLabel: '7.850.000.000',
}

const INTERNAL_WORDING = [
  /mô phỏng đề xuất/i,
  /context injection/i,
  /\bFACT\b/i,
  /SOURCE CLAIM/i,
  /\bPROPOSAL\b/i,
  /OPEN QUESTION/i,
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

async function clearBrowserState(page) {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
}

async function startFresh(page, route = '#/vai-tro/agent/cong-viec') {
  await clearBrowserState(page)
  await page.goto(`/${route}`)
  await expect(page).toHaveTitle(/VMLS/)
  await expect(page.getByTestId('app-shell')).toBeVisible()
}

async function openLanding(page) {
  await clearBrowserState(page)
  await page.goto('/')
  await expect(page).toHaveTitle(/VMLS/)
  await expect(page.getByTestId('landing-page')).toBeVisible()
}

async function switchRole(page, roleId) {
  const switcher = page.getByTestId('role-switcher')
  await expect(switcher).toBeVisible()
  await switcher.selectOption(roleId)
  await expect(page).toHaveURL(new RegExp(`#\/vai-tro\/${roleId}\/cong-viec$`))
  await expect(page.getByTestId('role-switcher')).toHaveValue(roleId)
}

async function openCase(page, roleId, demoCase) {
  if (!new RegExp(`#\/vai-tro\/${roleId}\/cong-viec$`).test(page.url())) {
    await page.goto(`/#/vai-tro/${roleId}/cong-viec`)
  }
  const row = page.getByTestId(`case-row-${demoCase.id}`)
  await expect(row).toBeVisible()
  await row.getByRole('button', { name: /Mở hồ sơ/ }).click()
  await expect(page).toHaveURL(new RegExp(`#\/vai-tro\/${roleId}\/ho-so\/${demoCase.id}`))
  await expect(page.getByTestId('object-npid')).toContainText(demoCase.npid)
}

async function openTab(page, name) {
  const tabs = page.getByRole('navigation', { name: 'Nội dung hồ sơ' })
  await tabs.getByRole('button', { name, exact: true }).click()
}

async function submitAction(page, actionId) {
  const action = page.getByTestId(`action-${actionId}`)
  await expect(action).toBeVisible()
  await expect(action).toBeEnabled()
  await action.click()
}

async function requestAndConfirmRepresentation(page, demoCase) {
  await page.goto('/#/vai-tro/agent/cong-viec')
  await openCase(page, 'agent', demoCase)
  await page.getByLabel('Mã định danh Bất động sản', { exact: true }).fill(demoCase.npid)
  await page.getByLabel('Phạm vi đại diện').selectOption('Độc quyền')
  await submitAction(page, 'request_seller_confirmation')

  await switchRole(page, 'seller')
  await openCase(page, 'seller', demoCase)
  await page.getByRole('checkbox', {
    name: /Tôi đã kiểm tra Bất động sản, người đại diện, phạm vi và thời hạn/,
  }).check()
  await submitAction(page, 'confirm_representation')
  await expect(page.getByTestId('object-plid')).toContainText(demoCase.plid)
}

async function declareBuyerAsBrokerage(page, demoCase) {
  await page.goto('/#/vai-tro/brokerage/cong-viec')
  await openCase(page, 'brokerage', demoCase)
  await expect(page.getByTestId('action-declare_buyer')).toBeVisible()
  await page.getByLabel('Mã định danh Người mua', { exact: true }).fill(demoCase.buyerRef)
  await page.getByLabel('Giá đã thống nhất (VND)').fill(demoCase.price)
  await expect(page.getByLabel('Ngày dự kiến ký')).toHaveValue(demoCase.signingOn)
  await submitAction(page, 'declare_buyer')
}

async function verifyBuyerReadiness(page, demoCase) {
  await page.goto('/#/vai-tro/buyer/cong-viec')
  await openCase(page, 'buyer', demoCase)

  const contract = page.getByRole('region', { name: 'Thông tin hợp đồng cần xác nhận' })
  await expect(contract).toContainText(demoCase.buyerName)
  await expect(contract).toContainText(demoCase.buyerRef)
  await expect(contract).toContainText(demoCase.npid)

  for (const name of [
    'Thông tin định danh của tôi',
    'Phương án thanh toán',
    'Danh mục tài liệu được chia sẻ',
  ]) {
    await page.getByRole('checkbox', { name, exact: true }).check()
  }
  const bankConsent = page.getByRole('checkbox', { name: /Chia sẻ giá.+Ngân hàng/ })
  await expect(bankConsent).not.toBeChecked()
  await submitAction(page, 'verify_readiness')
}

async function handoffNotaryDossier(page, demoCase) {
  await page.goto('/#/vai-tro/brokerage/cong-viec')
  await openCase(page, 'brokerage', demoCase)
  const submissionRef = page.getByLabel('Mã bàn giao hồ sơ', { exact: true })
  if (await submissionRef.isVisible()) await submissionRef.fill(`NOP-${demoCase.notaryCaseId}`)
  await submitAction(page, 'handoff_notary_dossier')
  await openTab(page, 'Công chứng')
  await expect(page.getByText('Đã chuyển VPCC', { exact: true })).toBeVisible()
}

async function advanceToNotaryHandoff(page, demoCase) {
  await requestAndConfirmRepresentation(page, demoCase)
  await declareBuyerAsBrokerage(page, demoCase)
  await verifyBuyerReadiness(page, demoCase)
  await handoffNotaryDossier(page, demoCase)
}

function sourceCard(page, sourceName) {
  return page.getByRole('heading', { name: sourceName, exact: true })
    .locator('xpath=ancestor::article[1]')
}

async function receiveExternalUpdate(page, demoCase, sourceName) {
  if (!new RegExp(`#\/vai-tro\/vmls\/ho-so\/${demoCase.id}`).test(page.url())) {
    await page.goto('/#/vai-tro/vmls/cong-viec')
    await openCase(page, 'vmls', demoCase)
  }
  const card = sourceCard(page, sourceName)
  await expect(card).toBeVisible()
  await card.getByRole('button', { name: 'Nhận cập nhật', exact: true }).click()
  return card
}

async function expectNoInternalWording(page) {
  const text = await page.locator('body').innerText()
  for (const wording of INTERNAL_WORDING) {
    expect(text, `Không được hiển thị wording nội bộ ${wording}`).not.toMatch(wording)
  }
}

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
}

async function expectOneMain(page) {
  await expect(page.locator('main')).toHaveCount(1)
}

test('VNeID tạo phiên masked riêng, giữ qua reload/logout và không bị reset cùng hồ sơ', async ({ page }) => {
  const requests = []
  page.on('request', (request) => requests.push(request.url()))
  await openLanding(page)

  await page.getByRole('button', { name: 'Đăng nhập bằng VNeID', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Đăng nhập bằng VNeID' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('list', { name: 'Phạm vi thông tin được chia sẻ' })).toContainText(
    'Họ tên đã che',
  )
  await expect(dialog).toContainText('không thay đổi vai trò làm việc hoặc quyền xem hồ sơ')
  await dialog.getByRole('button', { name: 'Tiếp tục', exact: true }).click()

  const identityDialog = page.getByRole('dialog', { name: 'Xác nhận thông tin VNeID' })
  await expect(identityDialog).toContainText('N••• H••• N••')
  await expect(identityDialog).toContainText('VNEID-HN-0001')
  await identityDialog.getByRole('button', { name: 'Xác nhận đăng nhập', exact: true }).click()
  await expect(page.getByText('Đã đăng nhập VNeID', { exact: true })).toBeVisible()

  await page.reload()
  await expect(page.getByText('Đã đăng nhập VNeID', { exact: true })).toBeVisible()
  await page.getByTestId('enter-workspace').click()
  await expect(page.getByTestId('app-shell')).toBeVisible()
  await expect(page.getByText('Đã đăng nhập VNeID', { exact: true })).toBeVisible()

  await openCase(page, 'agent', CASES.developer)
  await submitAction(page, 'request_seller_confirmation')
  await page.evaluate(() => {
    const key = 'vmls:operations:2026-08:v4'
    const envelope = JSON.parse(localStorage.getItem(key))
    envelope.version = 3
    localStorage.setItem(key, JSON.stringify(envelope))
  })
  await page.reload()
  await expect(page.getByTestId('action-request_seller_confirmation')).toBeVisible()
  await expect(page.getByText('Đã đăng nhập VNeID', { exact: true })).toBeVisible()

  await page.getByTestId('reset-data').click()
  await page.getByTestId('confirm-reset').click()
  await expect(page.getByText('Đã đăng nhập VNeID', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Đăng xuất khỏi phiên VNeID' }).click()
  await expect(page.getByRole('button', { name: 'Đăng nhập bằng VNeID', exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Đăng nhập bằng VNeID', exact: true })).toBeVisible()

  const origin = new URL(page.url()).origin
  const unexpectedExternalRequests = requests.filter((url) => {
    if (/^(?:data|blob):/.test(url)) return false
    return new URL(url).origin !== origin && !url.startsWith('https://vercel.live/_next-live/')
  })
  expect(unexpectedExternalRequests, 'Đăng nhập VNeID local không được gọi endpoint ngoài').toEqual([])
})

test('357 cấp NPID với provenance và landing chỉ dùng dữ liệu công khai để tra cứu', async ({ page }) => {
  await openLanding(page)

  const search = page.getByTestId('landing-search')
  await search.fill(CASES.developer.npid)
  await page.keyboard.press('Enter')
  const result = page.getByTestId(`landing-case-${CASES.developer.id}`)
  await expect(result).toBeVisible()
  await expect(result).not.toContainText('NB-HN-0031')
  await expect(result).not.toContainText('NM-HN-0031')

  await result.click()
  await expect(page.getByRole('group', { name: 'Không gian dữ liệu Hà Nội' })).toBeVisible()
  const identityTrace = page.getByRole('group', { name: 'Quan hệ định danh' })
  await expect(identityTrace).toBeVisible()
  await expect(identityTrace.getByRole('group', { name: new RegExp(`Bất động sản · NPID: ${CASES.developer.npid}`) })).toBeVisible()
  const publicDetail = page.getByRole('region', { name: 'Tra cứu và điều phối hồ sơ' })
  await expect(publicDetail).toContainText('Bất động sản')
  await expect(publicDetail).toContainText(CASES.developer.npid)

  await page.getByRole('button', { name: /Mở hồ sơ · Môi giới/ }).click()
  await expect(page.getByRole('navigation', { name: 'Bản ghi liên quan' })).toBeVisible()
  await openTab(page, 'Người mua')
  const sourcePanel = page.getByRole('heading', { name: 'Dữ liệu Bất động sản từ 357' })
    .locator('xpath=ancestor::section[1]')
  await expect(sourcePanel).toContainText(CASES.developer.npid)
  await expect(sourcePanel).toContainText(CASES.developer.source357)
  await expect(sourcePanel).toContainText(CASES.developer.sourceVersion)
  await expect(sourcePanel).toContainText('Cập nhật tại nguồn')
  await expect(sourcePanel).toContainText('VMLS nhận lúc')
  await expect(sourcePanel).not.toContainText('CCCD')
  await expectNoInternalWording(page)
})

test('Người bán áp dụng Public profile; HouseNow nhận payload đã lọc; Sàn áp dụng sửa giá', async ({ page }) => {
  await startFresh(page, '#/vai-tro/seller/tin-ban-cua-toi')
  const sellerWorkspace = page.getByTestId('seller-listing-workspace')
  await expect(sellerWorkspace).toBeVisible()
  await expect(sellerWorkspace).toContainText(SELLER_LISTING.id)

  const preview = sellerWorkspace.getByRole('region', {
    name: 'Thông tin được công khai',
    exact: true,
  })
  await expect(preview).toContainText(SELLER_LISTING.detailedLocation)
  await expect(preview).toContainText('14 ảnh')
  await expect(sellerWorkspace.getByTestId('publication-save')).toBeDisabled()
  await expect(sellerWorkspace.getByTestId('publication-apply')).toBeDisabled()
  await sellerWorkspace.getByRole('checkbox', { name: /Dự án và căn/ }).uncheck()
  await sellerWorkspace.getByRole('checkbox', { name: /Vị trí chi tiết/ }).uncheck()
  await sellerWorkspace.getByRole('checkbox', { name: /Hình ảnh/ }).uncheck()
  await expect(sellerWorkspace.getByTestId('publication-save')).toBeEnabled()
  await expect(sellerWorkspace.getByTestId('publication-apply')).toBeDisabled()
  await sellerWorkspace.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()

  await expect(preview).toContainText(SELLER_LISTING.detailedLocation)
  await expect(preview).toContainText('14 ảnh')
  await expect(sellerWorkspace.getByTestId('publication-save')).toBeDisabled()
  await expect(sellerWorkspace.getByTestId('publication-apply')).toBeEnabled()
  await sellerWorkspace.getByRole('button', { name: /Áp dụng cấu hình/ }).click()
  await expect(preview).not.toContainText(SELLER_LISTING.detailedLocation)
  await expect(preview).not.toContainText('14 ảnh')
  await expect(preview).not.toContainText('A2-1208')
  await expect(preview).not.toContainText('Tây Hồ Garden')
  await expect(sellerWorkspace.getByTestId('publication-save')).toBeDisabled()
  await expect(sellerWorkspace.getByTestId('publication-apply')).toBeDisabled()
  await expect(sellerWorkspace).toContainText('Cấu hình đang áp dụng · v2')

  await page.goto('/#/vai-tro/agent/nguon-hang')
  const inventory = page.getByTestId('represented-inventory')
  await inventory.getByLabel('Mã định danh Bất động sản').fill(SELLER_LISTING.npid)
  const row = inventory.locator('tbody tr').filter({ hasText: SELLER_LISTING.id })
  await expect(row).toContainText(SELLER_LISTING.npid)
  await row.getByRole('button', { name: 'Đăng ký hợp tác bán', exact: true }).click()
  const industryDetail = page.getByTestId('represented-listing-detail')
  await expect(industryDetail).toContainText('14 ảnh được chọn cho phạm vi thị trường')
  await industryDetail.getByRole('button', { name: 'Đăng ký hợp tác bán', exact: true }).click()
  await page.getByRole('button', { name: 'Chuẩn bị phân phối', exact: true }).click()

  const distribution = page.getByTestId('distribution-workspace')
  const distributionPreview = distribution.getByTestId('distribution-preview')
  await expect(distributionPreview).not.toContainText(SELLER_LISTING.detailedLocation)
  await expect(distributionPreview).not.toContainText('14 ảnh')
  await expect(distributionPreview).not.toContainText('A2-1208')
  await expect(distributionPreview).not.toContainText('Tây Hồ Garden')
  await expect(distribution).toContainText('HouseNow')
  await distribution.getByRole('button', { name: /Gửi Tin bán đến HouseNow/ }).click()
  await expect(distribution).toContainText('Đã gửi')

  await page.goto('/#/vai-tro/seller/tin-ban-cua-toi')
  await page.getByLabel('Giá đề nghị (VND)').fill(SELLER_LISTING.correctedPrice)
  await page.getByLabel('Lý do chỉnh sửa').fill('Điều chỉnh theo giá chào bán đã thống nhất')
  await page.getByRole('button', { name: 'Gửi yêu cầu chỉnh sửa', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã gửi yêu cầu chỉnh sửa đến Sàn.')
  await expect(page.getByTestId('seller-listing-workspace')).toContainText('Chờ Sàn xử lý')

  await page.goto('/#/vai-tro/brokerage/cong-viec')
  const correction = page.getByTestId('listing-correction-queue')
    .getByText(SELLER_LISTING.id, { exact: true })
    .locator('xpath=ancestor::tr[1]')
  await expect(correction).toContainText(SELLER_LISTING.originalPrice)
  await expect(correction).toContainText(SELLER_LISTING.correctedPriceLabel)
  await correction.getByRole('button', { name: /Đối chiếu và áp dụng|Áp dụng điều chỉnh/ }).click()
  await expect(correction).toHaveCount(0)
  await expect(page.getByRole('status')).toContainText('Đã áp dụng yêu cầu chỉnh sửa Tin bán.')

  await page.goto('/#/vai-tro/seller/tin-ban-cua-toi')
  await expect(page.getByTestId('seller-listing-workspace')).toContainText('Đã áp dụng')
  await expect(page.getByTestId('seller-listing-workspace')).toContainText(
    SELLER_LISTING.correctedPriceLabel,
  )
  await page.goto(`/#/vai-tro/agent/phan-phoi/${SELLER_LISTING.id}`)
  await expect(page.getByTestId('distribution-workspace')).toContainText('Cần cập nhật')
  await expectNoInternalWording(page)
})

test('Sàn độc quyền khai báo Người mua; Buyer xem hợp đồng, dữ liệu 357 và tiến độ liên cơ quan', async ({ page }) => {
  await startFresh(page)
  await requestAndConfirmRepresentation(page, CASES.developer)

  await page.goto('/#/vai-tro/agent/cong-viec')
  await openCase(page, 'agent', CASES.developer)
  await expect(page.getByTestId('action-declare_buyer')).toHaveCount(0)
  await expect(page.getByLabel('Mã định danh Người mua', { exact: true })).toHaveCount(0)

  await declareBuyerAsBrokerage(page, CASES.developer)
  await openTab(page, 'Người mua')
  await expect(page.getByText(CASES.developer.buyerRef, { exact: true }).first()).toBeVisible()

  await page.goto('/#/vai-tro/buyer/cong-viec')
  const queue = page.getByTestId('work-queue')
  await expect(queue.getByRole('columnheader', { name: 'Tiến độ hồ sơ' })).toBeVisible()
  await expect(queue.getByRole('columnheader', { name: 'Đơn vị đang xử lý' })).toBeVisible()
  await openCase(page, 'buyer', CASES.developer)
  await openTab(page, 'Người mua')

  const source357 = page.getByRole('heading', { name: 'Dữ liệu Bất động sản từ 357' })
    .locator('xpath=ancestor::section[1]')
  await expect(source357).toContainText(CASES.developer.npid)
  await expect(source357).toContainText(CASES.developer.source357)
  await expect(source357).toContainText(CASES.developer.sourceVersion)
  await expect(source357).not.toContainText('Người bán')
  await expect(source357).not.toContainText('CCCD')

  await verifyBuyerReadiness(page, CASES.developer)
  await handoffNotaryDossier(page, CASES.developer)

  for (const roleId of ['agent', 'brokerage', 'seller', 'buyer']) {
    await page.goto(`/#/vai-tro/${roleId}/cong-viec`)
    const roleQueue = page.getByTestId('work-queue')
    await expect(roleQueue.getByRole('columnheader', { name: 'Tiến độ hồ sơ' })).toBeVisible()
    await expect(roleQueue.getByRole('columnheader', { name: 'Đơn vị đang xử lý' })).toBeVisible()
    await expect(roleQueue.getByTestId(`case-row-${CASES.developer.id}`)).toContainText(
      'Văn phòng công chứng Minh Tâm',
    )
  }

  await page.goto('/#/vai-tro/buyer/cong-viec')
  await openCase(page, 'buyer', CASES.developer)
  const processing = page.getByText('Tiến độ hồ sơ', { exact: true })
    .locator('xpath=ancestor::section[1]')
  await expect(processing).toContainText('Văn phòng công chứng Minh Tâm')
  await expect(processing).not.toContainText('%')
})

test('VPCC yêu cầu bổ sung qua bản tin; ba hàng đợi cơ quan chỉ đọc; Thuế không gate tuyến VPĐKĐĐ', async ({ page }) => {
  await startFresh(page)
  await advanceToNotaryHandoff(page, CASES.landRegistry)

  await page.goto('/#/vai-tro/vmls/cong-viec')
  await openCase(page, 'vmls', CASES.landRegistry)
  let notary = await receiveExternalUpdate(page, CASES.landRegistry, 'Văn phòng công chứng')
  await expect(notary).toContainText('Đang xử lý')
  notary = await receiveExternalUpdate(page, CASES.landRegistry, 'Văn phòng công chứng')
  await expect(notary).toContainText('Yêu cầu bổ sung')

  await page.goto('/#/vai-tro/agent/cong-viec')
  await expect(
    page.getByTestId(`case-row-${CASES.landRegistry.id}`).locator('[data-label="Cập nhật"]'),
  ).toContainText('19/08/2026')
  await openCase(page, 'agent', CASES.landRegistry)
  await expect(
    page.getByText('Cập nhật', { exact: true }).locator('xpath=parent::*'),
  ).toContainText('19/08/2026')

  await page.goto('/#/vai-tro/notary/cong-viec')
  const notaryWorkspace = page.getByTestId('external-workspace-notary')
  await expect(notaryWorkspace).toBeVisible()
  await expect(notaryWorkspace.locator('tbody tr')).toHaveCount(6)
  await expect(notaryWorkspace).toContainText(CASES.landRegistry.notaryCaseId)
  await expect(notaryWorkspace).toContainText('Yêu cầu bổ sung')

  await page.goto('/#/vai-tro/seller/cong-viec')
  await openCase(page, 'seller', CASES.landRegistry)
  await expect(page.getByTestId('action-submit_supplement_handoff')).toBeVisible()
  await submitAction(page, 'submit_supplement_handoff')

  await page.goto('/#/vai-tro/vmls/cong-viec')
  await openCase(page, 'vmls', CASES.landRegistry)
  await receiveExternalUpdate(page, CASES.landRegistry, 'Văn phòng công chứng')
  notary = await receiveExternalUpdate(page, CASES.landRegistry, 'Văn phòng công chứng')
  await expect(notary).toContainText('Đã xử lý')
  await expect(page.getByTestId('object-ptid')).toContainText(CASES.landRegistry.ptid)
  await openTab(page, 'Chuyển quyền')
  await expect(page.getByRole('main')).toContainText(CASES.landRegistry.routeLabel)
  await openTab(page, 'Tổng quan')

  const tax = sourceCard(page, 'Cơ quan thuế')
  const land = sourceCard(page, 'Văn phòng đăng ký đất đai')
  await expect(tax).toContainText('Chờ tiếp nhận')
  await expect(land).toContainText('Chờ tiếp nhận')
  await land.getByRole('button', { name: 'Nhận cập nhật', exact: true }).click()
  await expect(land).toContainText('Đang xử lý')
  await land.getByRole('button', { name: 'Nhận cập nhật', exact: true }).click()
  await expect(land).toContainText('Đã xử lý')
  await expect(tax).toContainText('Chờ tiếp nhận')
  await openTab(page, 'Chuyển quyền')
  await expect(page.getByRole('main')).toContainText('Đã sang tên')

  for (const agency of [
    {
      roleId: 'notary',
      testId: 'external-workspace-notary',
      label: 'Văn phòng công chứng',
      journeyId: CASES.landRegistry.notaryCaseId,
    },
    {
      roleId: 'landRegistry',
      testId: 'external-workspace-landRegistry',
      label: 'Văn phòng đăng ký đất đai',
      journeyId: CASES.landRegistry.landCaseId,
    },
    {
      roleId: 'tax',
      testId: 'external-workspace-tax',
      label: 'Cơ quan thuế',
      journeyId: CASES.landRegistry.taxCaseId,
    },
  ]) {
    await page.goto(`/#/vai-tro/${agency.roleId}/cong-viec`)
    const workspace = page.getByTestId(agency.testId)
    await expect(workspace).toBeVisible()
    await expect(workspace.getByRole('heading', { name: agency.label, exact: true })).toBeVisible()
    await expect(page.getByTestId('global-search')).toHaveCount(0)
    const agencySearch = workspace.getByPlaceholder(/Mã hồ sơ, NPID, PTID/)
    await expect(agencySearch).toBeVisible()
    await agencySearch.fill('')
    await expect(workspace.locator('tbody tr')).toHaveCount(6)
    await expect(workspace).toContainText(agency.journeyId)
    await agencySearch.fill(agency.journeyId)
    await expect(workspace.locator('tbody tr')).toHaveCount(1)
    await workspace.getByRole('button', { name: 'Xem chi tiết', exact: true }).click()
    await expect(workspace).toContainText('Lịch sử trạng thái')
    await agencySearch.fill('KHONG-CO-HO-SO')
    await expect(workspace.locator('tbody tr')).toHaveCount(0)
    await expect(workspace).toContainText('Chọn một hồ sơ để xem chi tiết')
    await agencySearch.fill(agency.journeyId)
    for (const forbiddenAction of [
      /Tiếp nhận hồ sơ/,
      /Ký công chứng/,
      /Phê duyệt/,
      /Yêu cầu bổ sung tài liệu/,
      /Nhận cập nhật/,
    ]) {
      await expect(workspace.getByRole('button', { name: forbiddenAction })).toHaveCount(0)
    }

    await page.goto('/')
    await page.locator('#landing-role').selectOption(agency.roleId)
    await page.getByTestId('landing-search').fill(CASES.landRegistry.npid)
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: `Mở hồ sơ · ${agency.label}`, exact: true }).click()
    const routedWorkspace = page.getByTestId(agency.testId)
    await expect(routedWorkspace.getByRole('heading', { name: agency.journeyId, exact: true })).toBeVisible()
  }

  await page.goto('/#/vai-tro/vmls/cong-viec')
  await openCase(page, 'vmls', CASES.landRegistry)
  await receiveExternalUpdate(page, CASES.landRegistry, 'Cơ quan thuế')
  const completedTax = await receiveExternalUpdate(page, CASES.landRegistry, 'Cơ quan thuế')
  await expect(completedTax).toContainText('Đã xử lý')
})

test('kết quả VPCC tự tạo PTID và tuyến Chủ đầu tư hoàn tất độc lập với Thuế', async ({ page }) => {
  await startFresh(page)
  await advanceToNotaryHandoff(page, CASES.developer)

  await page.goto('/#/vai-tro/vmls/cong-viec')
  await openCase(page, 'vmls', CASES.developer)
  await receiveExternalUpdate(page, CASES.developer, 'Văn phòng công chứng')
  await receiveExternalUpdate(page, CASES.developer, 'Văn phòng công chứng')
  await expect(page.getByTestId('object-ptid')).toContainText(CASES.developer.ptid)
  await openTab(page, 'Công chứng')
  await expect(page.getByText('Mã hợp đồng', { exact: true })).toBeVisible()
  await expect(page.getByText(CASES.developer.notaryContractId, { exact: true })).toBeVisible()
  await openTab(page, 'Chuyển quyền')
  await expect(page.getByRole('main')).toContainText(CASES.developer.routeLabel)
  await openTab(page, 'Tổng quan')
  await expect(sourceCard(page, 'Cơ quan thuế')).toContainText('Chờ tiếp nhận')

  await page.goto('/#/vai-tro/developer/cong-viec')
  await openCase(page, 'developer', CASES.developer)
  await submitAction(page, 'developer_intake')
  await submitAction(page, 'developer_confirm_transfer')

  await page.goto('/#/vai-tro/buyer/cong-viec')
  await openCase(page, 'buyer', CASES.developer)
  await page.getByRole('checkbox', { name: 'Tôi xác nhận đã nhận đúng HĐMB mới.' }).check()
  await submitAction(page, 'buyer_receive_contract')
  await openTab(page, 'Chuyển quyền')
  await expect(page.getByRole('main')).toContainText('Đã bàn giao HĐMB mới')
  await expect(page.getByRole('main')).toContainText('HDMB-MOI-S2-12A/2026')

  await page.goto('/#/vai-tro/vmls/cong-viec')
  const mineFilter = page.getByTestId('status-filter-mine')
  await expect(mineFilter).toContainText('1')
  await mineFilter.click()
  await expect(page.getByTestId(`case-row-${CASES.developer.id}`)).toContainText('Nhận cập nhật')
})

test('sidebar desktop phủ toàn chiều cao trang ứng dụng dài và giữ điều hướng sticky', async ({ page }) => {
  await clearBrowserState(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#/vai-tro/agent/ung-dung')
  await expect(page.getByTestId('app-shell')).toBeVisible()

  const dimensions = await page.evaluate(() => {
    const frame = document.querySelector('.app-frame')
    const sidebar = document.querySelector('.app-sidebar')
    const main = document.querySelector('.app-frame > main')
    return {
      frame: frame?.getBoundingClientRect().height ?? 0,
      sidebar: sidebar?.getBoundingClientRect().height ?? 0,
      main: main?.getBoundingClientRect().height ?? 0,
      viewport: window.innerHeight,
    }
  })

  expect(dimensions.sidebar).toBeGreaterThan(dimensions.viewport)
  expect(Math.abs(dimensions.sidebar - dimensions.frame)).toBeLessThanOrEqual(1)
  expect(Math.abs(dimensions.sidebar - dimensions.main)).toBeLessThanOrEqual(1)

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  const stickyTop = await page.locator('.app-sidebar__inner').evaluate((element) => element.getBoundingClientRect().top)
  expect(stickyTop).toBeGreaterThanOrEqual(67)
  expect(stickyTop).toBeLessThanOrEqual(69)
  await expectNoHorizontalOverflow(page)
})

test('responsive, bàn phím, focus trap, reduced motion và wording vận hành đạt gate', async ({ page }) => {
  await clearBrowserState(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })

  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await expect(page.getByTestId('landing-page')).toBeVisible()
    await expectNoHorizontalOverflow(page)
    await expectOneMain(page)
    await expectNoInternalWording(page)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  const login = page.getByRole('button', { name: 'Đăng nhập bằng VNeID', exact: true })
  await login.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Đăng nhập bằng VNeID' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Tiếp tục', exact: true })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('button', { name: 'Hủy', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(login).toBeFocused()

  await page.goto('/#/vai-tro/agent/cong-viec')
  await expect(page.getByTestId('app-shell')).toBeVisible()
  await expect(page.getByRole('group', { name: 'Lọc theo trạng thái công việc' })).toBeVisible()
  await expect(page.getByRole('group', { name: 'Bộ lọc nghiệp vụ' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await expectOneMain(page)
  await expectNoInternalWording(page)
  const motion = await page.locator('[data-testid="app-shell"]').evaluate((element) => {
    const style = getComputedStyle(element)
    return { animationDuration: style.animationDuration, transitionDuration: style.transitionDuration }
  })
  const durationInSeconds = (value) => value.split(',').reduce((maximum, duration) => {
    const trimmed = duration.trim()
    const seconds = trimmed.endsWith('ms')
      ? Number.parseFloat(trimmed) / 1000
      : Number.parseFloat(trimmed)
    return Math.max(maximum, seconds)
  }, 0)
  expect(durationInSeconds(motion.animationDuration)).toBeLessThanOrEqual(0.001)
  expect(durationInSeconds(motion.transitionDuration)).toBeLessThanOrEqual(0.001)
})
