import { expect, test } from '@playwright/test'

const V5_STORAGE_KEY = 'vmls:phu-thuong:2026-08:v6'

async function openRole(page, roleId) {
  await page.goto(`/#/vai-tro/${roleId}/cong-viec`)
  await expect(page.getByTestId('app-shell')).toBeVisible()
}

async function submitDeclaration(page) {
  await completeRepresentation(page)
  await page.getByLabel('Hợp đồng chuyển nhượng đã công chứng').setInputFiles({
    name: 'hop-dong-chuyen-nhuong-cong-chung.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.7 fixture'),
  })
  await page.getByTestId('submit-transaction-declaration').click()
  await expect(page.getByTestId('object-ptid')).toContainText('PTID-HN-00062')
}

async function switchRole(page, roleId) {
  await page.getByTestId('role-switcher').selectOption(roleId)
  await expect(page).toHaveURL(new RegExp(`#\/vai-tro\/${roleId}\/cong-viec$`))
}

async function completeRepresentation(page) {
  await openRole(page, 'agent')
  await expect(page.getByTestId('object-plid')).toContainText('Chưa cấp')
  await expect(page.getByTestId('transaction-declaration-form')).toHaveCount(0)
  await page.getByTestId('request-seller-confirmation').click()
  await expect(page.getByTestId('representation-lifecycle')).toContainText('Chờ xác nhận')

  await switchRole(page, 'seller')
  await expect(page.getByTestId('notification-bell')).toHaveAccessibleName(/1 chưa đọc/)
  await page.getByTestId('role-inbox').getByRole('button', {
    name: /Có yêu cầu xác nhận quyền đại diện/,
  }).click()
  await expect(page).toHaveURL(/#\/vai-tro\/seller\/cong-viec$/)
  await expect(page.getByTestId('representation-confirmation-panel')).toBeFocused()
  await page.getByRole('checkbox', {
    name: /Tôi đã kiểm tra Bất động sản, người đại diện, phạm vi và thời hạn/,
  }).check()
  await page.getByTestId('confirm-representation').click()
  await expect(page.getByTestId('object-plid')).toContainText('PLID-HN-00208')
  await expect(page.getByTestId('listing-created-panel')).toContainText('Tin bán đã khởi tạo')

  await switchRole(page, 'agent')
  await expect(page.getByTestId('transaction-declaration-form')).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

test('landing công khai chỉ hiện Listing đã tồn tại và mở đúng năm tài khoản', async ({ page }) => {
  await expect(page.getByTestId('landing-page')).toBeVisible()
  await expect(page.getByRole('heading', {
    name: 'Một định danh. Mọi nguồn dữ liệu. Một hành trình có thể truy vết.',
  })).toBeVisible()

  await expect(page.locator('[data-testid^="public-listing-"]')).toHaveCount(4)
  await expect(page.getByRole('heading', { name: /Phú Thượng/ })).toHaveCount(0)
  await expect(page.getByText('Hành trình Phú Thượng bắt đầu trong tài khoản Môi giới')).toBeVisible()
  for (const restrictedValue of [
    'PTID-HN-00062',
    'PARTY-BUYER-HN-0518',
    'HDCN-2026-0819-PT',
    '357-GD-2026-000812',
  ]) {
    await expect(page.getByText(restrictedValue, { exact: true })).toHaveCount(0)
  }

  await page.getByTestId('landing-search').fill('NPID-HN-10421')
  await expect(page.locator('[data-testid^="public-listing-"]')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Chưa tìm thấy Tin bán phù hợp' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Xem Tin bán' })).toHaveCount(0)

  await page.getByTestId('landing-search').fill('PLID-HN-00208')
  await expect(page.locator('[data-testid^="public-listing-"]')).toHaveCount(0)
  await page.getByTestId('landing-search').fill('Long Biên')
  await expect(page.locator('[data-testid^="public-listing-"]')).toHaveCount(1)
  await expect(page.getByTestId('public-listing-PLID-HN-00210')).toBeVisible()

  await page.getByTestId('hero-demo-accounts-trigger').click()
  const accountMenu = page.getByRole('menu', { name: 'Chọn tài khoản demo' })
  await expect(accountMenu).toBeVisible()
  await expect(accountMenu.getByRole('menuitem')).toHaveCount(5)
  await accountMenu.getByRole('menuitem').first().press('End')
  await expect(accountMenu.getByRole('menuitem', { name: /Vận hành VMLS/ })).toBeFocused()
  await accountMenu.getByRole('menuitem', { name: /Vận hành VMLS/ }).press('Escape')
  await expect(accountMenu).toHaveCount(0)
  await expect(page.getByTestId('hero-demo-accounts-trigger')).toBeFocused()
  await page.getByTestId('hero-demo-accounts-trigger').click()
  await accountMenu.getByRole('menuitem', { name: /Môi giới/ }).click()

  await expect(page).toHaveURL(/#\/vai-tro\/agent\/cong-viec$/)
  await expect(page.getByTestId('app-shell')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)

  await switchRole(page, 'buyer')
  await expect(page.getByRole('heading', { name: 'Chưa có hồ sơ' })).toBeVisible()
  await expect(page.getByTestId('app-shell')).not.toContainText('NPID-HN-10421')
  await expect(page.getByTestId('app-shell')).not.toContainText('PLID-HN-00208')
  await expect(page.getByTestId('app-shell')).not.toContainText('Phú Thượng')
})

test('Môi giới xin quyền, Người bán xác nhận rồi VMLS mới khởi tạo PLID và khớp HouseNow', async ({ page }) => {
  await openRole(page, 'agent')
  await expect(page.getByTestId('representation-request-form')).toBeVisible()
  await expect(page.getByTestId('object-plid')).toContainText('Chưa cấp')
  await expect(page.getByTestId('house-now-snapshot')).toHaveCount(0)
  await expect(page.getByTestId('transaction-declaration-form')).toHaveCount(0)
  await expect(page.getByTestId('representation-request-form')).toContainText('Trần V••• A•••')
  await expect(page.getByTestId('representation-request-form')).toContainText('HouseNow')

  await page.getByTestId('request-seller-confirmation').click()
  await expect(page.getByTestId('representation-pending-summary')).toContainText('Đang chờ Người bán xác nhận')
  await expect(page.getByTestId('object-plid')).toContainText('Chưa cấp')
  await page.reload()
  await expect(page.getByTestId('representation-pending-summary')).toBeVisible()

  await switchRole(page, 'brokerage')
  await expect(page.getByTestId('representation-pending-summary')).toBeVisible()
  await expect(page.getByTestId('request-seller-confirmation')).toHaveCount(0)
  await expect(page.getByTestId('confirm-representation')).toHaveCount(0)

  await switchRole(page, 'seller')
  await expect(page.getByTestId('notification-bell')).toHaveAccessibleName(/1 chưa đọc/)
  await page.getByTestId('notification-bell').click()
  await page.getByRole('region', { name: 'Hộp thông báo' }).getByRole('button', {
    name: /Có yêu cầu xác nhận quyền đại diện/,
  }).click()
  await expect(page).toHaveURL(/#\/vai-tro\/seller\/cong-viec$/)
  await expect(page.getByTestId('representation-confirmation-panel')).toBeFocused()
  await page.getByRole('checkbox', {
    name: /Tôi đã kiểm tra Bất động sản, người đại diện, phạm vi và thời hạn/,
  }).check()
  await page.getByTestId('confirm-representation').click()

  await expect(page.getByTestId('object-plid')).toContainText('PLID-HN-00208')
  await expect(page.getByTestId('listing-created-panel')).toContainText('Đã khởi tạo')
  await expect(page.getByTestId('listing-created-panel')).toContainText('Chưa phát hành')
  await page.reload()
  await expect(page.getByTestId('object-plid')).toContainText('PLID-HN-00208')

  await switchRole(page, 'agent')
  await expect(page.getByTestId('house-now-snapshot')).toContainText('HN-LST-78421')
  await expect(page.getByTestId('house-now-snapshot')).toContainText('2026.08.19-03')
  await expect(page.getByTestId('transaction-declaration-form')).toBeVisible()

  await page.goto('/#/')
  await expect(page.locator('[data-testid^="public-listing-"]')).toHaveCount(5)
  await expect(page.getByTestId('public-listing-PLID-HN-00208')).toContainText('HouseNow')
  await expect(page.getByTestId('public-listing-PLID-HN-00208')).toContainText('2026.08.19-03')
  await expect(page.getByTestId('public-listing-PLID-HN-00208')).toContainText('Đang bán')
  await expect(page.getByTestId('public-listing-PLID-HN-00208')).not.toContainText('Đã khởi tạo')
})

test('Môi giới chỉ submit khi có PDF và hệ thống tạo đồng thời PTID cùng Tax handoff', async ({ page }) => {
  await completeRepresentation(page)
  await expect(page.getByTestId('house-now-snapshot')).toContainText('HN-LST-78421')
  await expect(page.getByTestId('house-now-snapshot')).toContainText('2026.08.19-03')
  await page.getByLabel('Hợp đồng chuyển nhượng đã công chứng').setInputFiles({
    name: 'hop-dong.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not a pdf'),
  })
  await page.getByTestId('submit-transaction-declaration').click()
  await expect(page.getByRole('alert')).toContainText('dạng PDF')
  await expect(page.getByTestId('object-ptid')).toContainText('Chưa cấp')

  await page.getByLabel('Hợp đồng chuyển nhượng đã công chứng').setInputFiles({
    name: 'hop-dong-chuyen-nhuong-cong-chung.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.7 fixture'),
  })
  await page.getByTestId('submit-transaction-declaration').click()

  await expect(page.getByTestId('object-ptid')).toContainText('PTID-HN-00062')
  await expect(page.getByTestId('declaration-summary')).toContainText('HDCN-2026-0819-PT')
  await expect(page.getByTestId('processing-panel')).toContainText('Đã chuyển hồ sơ')
  await expect(page.getByTestId('transaction-declaration-form')).toHaveCount(0)

  const persisted = await page.evaluate((storageKey) => JSON.parse(window.localStorage.getItem(storageKey)), V5_STORAGE_KEY)
  expect(persisted.actionLog).toHaveLength(4)
  expect(persisted.actionLog[3].payload.documents.transferContract).toEqual({
    fileName: 'hop-dong-chuyen-nhuong-cong-chung.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 16,
  })
  expect(JSON.stringify(persisted)).not.toContain('base64')

  await page.reload()
  await expect(page.getByTestId('object-ptid')).toContainText('PTID-HN-00062')
  await expect(page.getByTestId('declaration-summary')).toBeVisible()

  await switchRole(page, 'brokerage')
  await expect(page.getByTestId('declaration-summary')).toBeVisible()
  await expect(page.getByTestId('transaction-declaration-form')).toHaveCount(0)
  await expect(page.getByTestId('ops-controls')).toHaveCount(0)
  await expect(page.getByText('PARTY-BUYER-HN-0518', { exact: true })).toHaveCount(0)
  await expect(page.getByText('hop-dong-chuyen-nhuong-cong-chung.pdf', { exact: true })).toHaveCount(0)
  await expect(page.getByText('THUE-HN-2026-04821', { exact: true })).toHaveCount(0)
})

test('hai nút Ops độc lập: trạng thái chạy trước 357 và cả hai bền vững qua reload', async ({ page }) => {
  await submitDeclaration(page)
  await switchRole(page, 'vmls')

  await expect(page.getByTestId('sync-357')).toBeEnabled()
  await expect(page.getByTestId('advance-processing')).toBeEnabled()
  await expect(page.getByText('Thuế đã tiếp nhận hồ sơ', { exact: true })).toBeVisible()

  await page.getByTestId('advance-processing').click()
  await expect(page.getByTestId('processing-panel')).toContainText('Chờ thông báo nghĩa vụ tài chính')
  await expect(page.getByTestId('processing-panel')).toContainText('GIAYHEN-THUE-HN-2026-04821')
  await expect(page.getByTestId('sync-357')).toBeEnabled()

  await page.reload()
  await expect(page.getByText('Cần thực hiện nghĩa vụ tài chính', { exact: true })).toBeVisible()
  await page.getByTestId('sync-357').click()
  await expect(page.getByTestId('sync-357')).toBeDisabled()
  await expect(page.getByTestId('sync-357')).toContainText('Đã đồng bộ từ Hệ thống thông tin về nhà ở và thị trường bất động sản')
  await expect(page.getByTestId('reconciliation-panel')).toContainText('357-GD-2026-000812')
  await expect(page.getByTestId('reconciliation-panel').getByText('Khớp', { exact: true })).toHaveCount(7)

  await page.reload()
  await expect(page.getByTestId('sync-357')).toBeDisabled()
  await expect(page.getByTestId('reconciliation-panel')).toBeVisible()
})

test('sáu lần đồng bộ tạo đúng Seller notification, hai dòng đã đóng và Buyer notification', async ({ page }) => {
  await submitDeclaration(page)
  await switchRole(page, 'vmls')
  await page.getByTestId('sync-357').click()
  await expect(page.getByTestId('sync-357')).toContainText('Đã đồng bộ từ Hệ thống thông tin về nhà ở và thị trường bất động sản')
  await expect(page.getByTestId('reconciliation-panel').getByText('Khớp', { exact: true })).toHaveCount(7)
  const advance = page.getByTestId('advance-processing')

  await advance.click()
  await expect(page.getByTestId('processing-panel')).toContainText('Chờ thông báo nghĩa vụ tài chính')

  await advance.click()
  await expect(page.getByTestId('processing-panel')).toContainText('Cần thực hiện nghĩa vụ tài chính')
  await switchRole(page, 'seller')
  await expect(page.getByTestId('notification-bell')).toHaveAccessibleName(/1 chưa đọc/)
  await expect(page.getByTestId('role-inbox')).toContainText('Có thông báo nghĩa vụ tài chính')
  await expect(page.getByTestId('role-inbox')).toContainText('Cần thực hiện ngoài VMLS')
  await expect(page.getByText('HDCN-2026-0819-PT', { exact: true })).toHaveCount(0)
  await expect(page.getByText('18.400.000.000', { exact: true })).toHaveCount(0)

  await page.getByTestId('role-inbox').getByRole('button', { name: /Có thông báo nghĩa vụ tài chính/ }).click()
  await expect(page).toHaveURL(/#\/vai-tro\/seller\/ho-so\/PTID-HN-00062$/)
  await expect(page.locator('#dossier')).toBeFocused()
  await expect(page.getByTestId('notification-bell')).toHaveAccessibleName('Thông báo')

  await switchRole(page, 'vmls')
  await advance.click()
  await expect(page.getByTestId('processing-panel')).toContainText('Đã đóng thuế TNCN')
  await expect(page.getByTestId('processing-panel')).toContainText('Đã đóng lệ phí trước bạ')
  await expect(page.getByTestId('processing-panel')).toContainText('Chờ mã hồ sơ nguồn')
  await expect(page.getByTestId('processing-panel')).toContainText('Đã chuyển hồ sơ')

  await advance.click()
  await expect(page.getByTestId('processing-panel')).toContainText('Đã tiếp nhận')
  await advance.click()
  await expect(page.getByTestId('processing-panel')).toContainText('Đang xử lý TTHC')
  await advance.click()
  await expect(page.getByTestId('processing-panel')).toContainText('Đã hoàn thành sang tên')
  await expect(advance).toBeDisabled()

  await page.reload()
  await expect(page.getByTestId('processing-panel')).toContainText('Đã hoàn thành sang tên')
  await expect(page.getByTestId('advance-processing')).toBeDisabled()

  await switchRole(page, 'buyer')
  await expect(page.getByTestId('notification-bell')).toHaveAccessibleName(/1 chưa đọc/)
  await expect(page.getByTestId('role-inbox')).toContainText('Hồ sơ sang tên đã hoàn thành')
  await expect(page.getByTestId('role-inbox')).toContainText('Nhận Giấy chứng nhận tại VPĐKĐĐ')
  await expect(page.getByRole('button', { name: /xác nhận.*nhận/i })).toHaveCount(0)

  await page.getByTestId('notification-bell').click()
  await expect(page.getByRole('region', { name: 'Hộp thông báo' })).toBeVisible()
  await page.getByTestId('notification-bell').press('Escape')
  await expect(page.getByRole('region', { name: 'Hộp thông báo' })).toHaveCount(0)
  await expect(page.getByTestId('notification-bell')).toBeFocused()
  await page.getByTestId('notification-bell').click()
  await page.getByRole('region', { name: 'Hộp thông báo' }).getByRole('button', { name: /Hồ sơ sang tên đã hoàn thành/ }).click()
  await expect(page).toHaveURL(/#\/vai-tro\/buyer\/ho-so\/PTID-HN-00062$/)
  await expect(page.locator('#dossier')).toBeFocused()
  await expect(page.getByTestId('notification-bell')).toHaveAccessibleName('Thông báo')
  await page.reload()
  await expect(page.getByTestId('notification-bell')).toHaveAccessibleName('Thông báo')
  await expect(page.getByTestId('role-inbox').locator('.is-unread')).toHaveCount(0)
})

test('route cũ fail về landing; reset xóa tiến độ V5 nhưng giữ localStorage ngoài phạm vi', async ({ page }) => {
  await page.evaluate(() => {
    window.localStorage.setItem('vmls:operations:2026-08:v4', 'legacy-v4')
    window.localStorage.setItem('vmls:represented-market:2026-08:v2', 'legacy-market')
    window.localStorage.setItem('vmls:vneid-session:2026-08:v1', 'legacy-vneid')
    window.localStorage.setItem('vmls:phu-thuong:2026-08:v5', 'legacy-v5')
    window.localStorage.setItem('unrelated:preference', 'keep-me')
  })
  await page.reload()
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('vmls:operations:2026-08:v4'))).toBeNull()
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('vmls:represented-market:2026-08:v2'))).toBeNull()
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('vmls:vneid-session:2026-08:v1'))).toBeNull()
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('vmls:phu-thuong:2026-08:v5'))).toBeNull()
  expect(await page.evaluate(() => window.localStorage.getItem('unrelated:preference'))).toBe('keep-me')

  await page.evaluate((storageKey) => {
    window.localStorage.setItem(storageKey, JSON.stringify({
      version: 5,
      schema: 'vmls-phu-thuong-transaction-v5',
      caseId: 'phu-thuong-title-transfer',
      actionLog: [{ type: 'SUBMIT_TRANSACTION_DECLARATION', actor: 'brokerage', payload: {} }],
    }))
  }, V5_STORAGE_KEY)
  await page.goto('/#/vai-tro/agent/cong-viec')
  await page.reload()
  await expect(page.getByTestId('object-ptid')).toContainText('Chưa cấp')
  await expect(page.getByTestId('representation-request-form')).toBeVisible()
  await expect(page.getByTestId('transaction-declaration-form')).toHaveCount(0)

  await page.goto('/#/vai-tro/bank/cong-viec')
  await expect(page).toHaveURL(/#\/$/)
  await expect(page.getByTestId('landing-page')).toBeVisible()

  await page.goto('/#/vai-tro/agent/ho-so/PTID-HN-KHONG-TON-TAI')
  await expect(page).toHaveURL(/#\/$/)
  await expect(page.getByTestId('landing-page')).toBeVisible()

  await submitDeclaration(page)
  await page.goto('/#/vai-tro/agent/ho-so/PTID-HN-KHONG-TON-TAI')
  await expect(page).toHaveURL(/#\/$/)
  await openRole(page, 'agent')
  await expect(page.getByTestId('object-ptid')).toContainText('Chưa cấp')
  await expect(page.getByTestId('object-plid')).toContainText('Chưa cấp')

  await submitDeclaration(page)
  await page.getByTestId('reset-data').click()
  await expect(page).toHaveURL(/#\/$/)
  await expect(page.getByTestId('landing-page')).toBeVisible()
  const envelope = await page.evaluate((storageKey) => JSON.parse(window.localStorage.getItem(storageKey)), V5_STORAGE_KEY)
  expect(envelope.actionLog).toEqual([])
  expect(await page.evaluate(() => window.localStorage.getItem('unrelated:preference'))).toBe('keep-me')

  await openRole(page, 'agent')
  await expect(page.getByTestId('object-ptid')).toContainText('Chưa cấp')
  await expect(page.getByTestId('object-plid')).toContainText('Chưa cấp')
  await expect(page.getByTestId('representation-request-form')).toBeVisible()
  await expect(page.getByTestId('transaction-declaration-form')).toHaveCount(0)
})

test('landing không tràn ở bốn viewport và reduced motion tắt chuyển động kéo dài', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.reload()
    await expect(page.getByRole('heading', {
      name: 'Một định danh. Mọi nguồn dữ liệu. Một hành trình có thể truy vết.',
    })).toBeVisible()
    const hasHorizontalOverflow = await page.evaluate(() => (
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    ))
    expect(hasHorizontalOverflow).toBe(false)
    await page.getByTestId('header-demo-accounts-trigger').click()
    const menu = page.getByRole('menu', { name: 'Chọn tài khoản demo' })
    await expect(menu).toBeVisible()
    const box = await menu.boundingBox()
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
    await menu.getByRole('menuitem').first().press('Escape')

    await page.goto('/#/vai-tro/agent/cong-viec')
    await expect(page.getByTestId('app-shell')).toBeVisible()
    await expect(page.getByTestId('representation-request-form')).toBeVisible()
    await expect(page.getByTestId('object-npid')).toBeVisible()
    const workspaceHasHorizontalOverflow = await page.evaluate(() => (
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    ))
    expect(workspaceHasHorizontalOverflow).toBe(false)
    await page.goto('/#/')
  }

  const animationDuration = await page.locator('.landing-v5-network-node.is-npid').evaluate((node) => getComputedStyle(node).animationDuration)
  expect(Number.parseFloat(animationDuration)).toBeLessThan(0.001)
})

test('runtime dùng toàn bộ asset cục bộ, không gọi API nguồn và không phát sinh lỗi console', async ({ page }) => {
  const errors = []
  const externalRequests = []
  const runtimeOrigin = new URL(page.url()).origin
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('requestfailed', (request) => errors.push(`Request failed: ${request.url()}`))
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.origin !== runtimeOrigin) externalRequests.push(request.url())
  })

  await page.reload()
  await openRole(page, 'vmls')
  await expect(page.getByTestId('ops-controls')).toBeVisible()
  expect(errors).toEqual([])
  expect(externalRequests).toEqual([])
})
