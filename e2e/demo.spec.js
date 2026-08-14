import { expect, test as base } from '@playwright/test'

const protectedPreviewOrigin = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  ? new URL(process.env.PLAYWRIGHT_BASE_URL).origin
  : null

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

const CASES = {
  developer: {
    title: 'Chuyển nhượng HĐMB · S2-12A',
    npid: 'NPID-HN-09876',
    plid: 'PLID-HN-00125',
    ptid: 'PTID-HN-00031',
  },
  landRegistry: {
    title: 'Đăng ký biến động · Nhà ở Phú Thượng',
    npid: 'NPID-HN-10421',
  },
}

const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const browserErrors = []

    page.on('console', (message) => {
      if (message.type() === 'error') {
        browserErrors.push(`console: ${message.text()}`)
      }
    })
    page.on('pageerror', (error) => {
      browserErrors.push(`pageerror: ${error.message}`)
    })
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

async function startFresh(page) {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
  await expect(page).toHaveTitle(/VMLS/)
}

async function openCase(page, title) {
  await page.getByTestId('start-demo').click()
  const card = page
    .getByRole('heading', { name: title, exact: true })
    .locator('xpath=ancestor::article')
  await expect(card).toBeVisible()
  await card.getByRole('button', { name: 'Bắt đầu hồ sơ' }).click()
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
}

async function act(page, action) {
  const button = page.getByTestId(`action-${action}`)
  await expect(button, `Hành động ${action} phải xuất hiện đúng vai trò`).toBeVisible()
  await expect(button).toBeEnabled()
  await button.click()
}

async function handoff(page, roleLabel) {
  const button = page.getByTestId('handoff-next-role')
  await expect(button).toContainText(roleLabel)
  await button.click()
  await expect(page.getByText('Đang xem với vai trò').locator('..')).toContainText(roleLabel)
}

async function resetSampleData(page) {
  await page.getByRole('button', { name: 'Khôi phục dữ liệu mẫu' }).click()
  const dialog = page.getByRole('dialog', { name: 'Khôi phục dữ liệu mẫu?' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Khôi phục dữ liệu mẫu', exact: true }).click()
}

async function verify357Reference(page) {
  const screenshot = page.getByRole('img', {
    name: /Ảnh chụp trang chính Hệ thống thông tin về nhà ở/,
  })
  await expect(screenshot).toBeVisible()
  await expect(screenshot).toHaveAttribute(
    'src',
    '/assets/demo/357-homepage-2026-08-15.png',
  )
  await expect
    .poll(() =>
      screenshot.evaluate((image) => ({
        complete: image.complete,
        width: image.naturalWidth,
        height: image.naturalHeight,
      })),
    )
    .toEqual({ complete: true, width: 1440, height: 1000 })

  const externalLink = page.getByRole('link', { name: 'thongtinbds.moc.gov.vn' })
  await expect(externalLink).toHaveAttribute('href', 'https://thongtinbds.moc.gov.vn/')
  await expect(page.getByText(/không thể hiện kết nối kỹ thuật/i)).toBeVisible()
}

async function expectFreshCaseCard(page, title) {
  const card = page
    .getByRole('heading', { name: title, exact: true })
    .locator('xpath=ancestor::article')
  await expect(card.getByRole('button', { name: 'Bắt đầu hồ sơ' })).toBeVisible()
  await expect(card.getByText('Chưa cấp', { exact: true })).toHaveCount(2)
}

async function verifyHouseNowChannel(page) {
  const icon = page.getByRole('img', { name: 'Biểu tượng ứng dụng HouseNow' })
  await expect(icon).toBeVisible()
  await expect(icon).toHaveAttribute('src', '/assets/demo/housenow-icon.png')
  await expect
    .poll(() =>
      icon.evaluate((image) => ({
        complete: image.complete,
        width: image.naturalWidth,
        height: image.naturalHeight,
      })),
    )
    .toEqual({ complete: true, width: 1024, height: 1024 })
  await expect(page.getByText('Kênh tiếp cận thị trường', { exact: true })).toBeVisible()
}

async function advanceThroughNotaryIntake(page) {
  await act(page, 'match_property')
  await verify357Reference(page)
  await act(page, 'request_seller_confirmation')
  await handoff(page, 'Người bán')

  await act(page, 'confirm_representation')
  await handoff(page, 'VMLS')

  await act(page, 'create_listing')
  await verifyHouseNowChannel(page)
  await handoff(page, 'Môi giới')

  await act(page, 'record_buyer')
  await handoff(page, 'Người mua')

  await act(page, 'verify_readiness')
  await handoff(page, 'Văn phòng công chứng')

  await act(page, 'submit_notary_dossier')
  await expect(page.getByText('VPCC đang xử lý', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: /^HSCC-HN-/ })).toBeVisible()
  await expect(page.getByTestId('action-record_notary_signing')).toBeVisible()
}

async function finishCommonFlow(page) {
  await act(page, 'record_notary_signing')
  await expect(page.getByText('Đã ký công chứng', { exact: true }).first()).toBeVisible()
  await handoff(page, 'VMLS')

  await act(page, 'create_transaction')
  await expect(page.getByText('Trao đổi nghĩa vụ thuế tự động', { exact: true })).toBeVisible()
  await expect(page.getByText('Nhận xác nhận hoàn thành nghĩa vụ thuế', { exact: true })).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await startFresh(page)
})

test('giới thiệu, hàng đợi hai hồ sơ và khôi phục dữ liệu mẫu', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: /Một tài sản\. Một định danh\./ }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Bất động sản' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Tin bán' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Giao dịch' })).toBeVisible()

  await page.getByTestId('start-demo').click()
  await expect(
    page.getByRole('heading', { name: 'Theo một quy trình, nhìn rõ hai tuyến chuyển quyền' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: CASES.developer.title })).toBeVisible()
  await expect(page.getByRole('heading', { name: CASES.landRegistry.title })).toBeVisible()
  await expect(page.getByText(CASES.developer.npid, { exact: true })).toBeVisible()
  await expect(page.getByText(CASES.landRegistry.npid, { exact: true })).toBeVisible()

  const developerCard = page
    .getByRole('heading', { name: CASES.developer.title })
    .locator('xpath=ancestor::article')
  await developerCard.getByRole('button', { name: 'Bắt đầu hồ sơ' }).click()
  await act(page, 'match_property')

  await resetSampleData(page)
  await expect(page).toHaveURL(/#\/gioi-thieu$/)
  await expect(
    page.getByRole('heading', { name: /Một tài sản\. Một định danh\./ }),
  ).toBeVisible()
  await page.getByTestId('start-demo').click()
  await expectFreshCaseCard(page, CASES.developer.title)
})

test('hoàn tất hành trình chung và tuyến Chủ đầu tư / HĐMB', async ({ page }) => {
  await openCase(page, CASES.developer.title)
  await advanceThroughNotaryIntake(page)
  await finishCommonFlow(page)

  await expect(page.getByText(CASES.developer.ptid, { exact: true }).first()).toBeVisible()
  await expect(page.getByText('Tuyến Chủ đầu tư / HĐMB', { exact: true }).last()).toBeVisible()
  await handoff(page, 'Chủ đầu tư')

  await act(page, 'developer_intake')
  await act(page, 'developer_confirm_transfer')
  await handoff(page, 'Người mua')
  await act(page, 'buyer_receive_contract')

  await expect(page.getByText('Bản ghi sống đã cập nhật', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('HĐMB mới đã bàn giao', { exact: true })).toBeVisible()
  await expect(page.getByText(CASES.developer.npid, { exact: true }).first()).toBeVisible()
  await expect(page.getByText(CASES.developer.plid, { exact: true }).first()).toBeVisible()
  await expect(page.getByText(CASES.developer.ptid, { exact: true }).first()).toBeVisible()
})

test('hoàn tất tuyến VPĐKĐĐ với một yêu cầu bổ sung có thể phục hồi', async ({ page }) => {
  await openCase(page, CASES.landRegistry.title)
  await advanceThroughNotaryIntake(page)

  await act(page, 'request_supplement')
  await expect(page.getByText('Yêu cầu bổ sung', { exact: true }).first()).toBeVisible()
  await handoff(page, 'Môi giới')

  await act(page, 'provide_supplement')
  await handoff(page, 'Văn phòng công chứng')
  await finishCommonFlow(page)

  await expect(page.getByText('Tuyến Văn phòng đăng ký đất đai', { exact: true }).last()).toBeVisible()
  await handoff(page, 'Văn phòng đăng ký đất đai')
  await act(page, 'approve_land_registry')

  await expect(page.getByText('Bản ghi sống đã cập nhật', { exact: true }).first()).toBeVisible()
  await expect(
    page.getByText('Đã nhận kết quả phê duyệt sang tên từ API VPĐKĐĐ mô phỏng', {
      exact: true,
    }),
  ).toBeVisible()
  await expect(page.getByText('Đã sang tên', { exact: true }).first()).toBeVisible()
  await expect(page.getByText(CASES.landRegistry.npid, { exact: true }).first()).toBeVisible()
  await expect(page.getByText(/^PLID-HN-/).first()).toBeVisible()
  await expect(page.getByText(/^PTID-HN-/).first()).toBeVisible()
})

test('tiến độ được lưu qua tải lại và bị xóa khi khôi phục dữ liệu mẫu', async ({ page }) => {
  await openCase(page, CASES.developer.title)
  await act(page, 'match_property')
  await act(page, 'request_seller_confirmation')
  await expect(page.getByText('Chờ xác nhận', { exact: true }).first()).toBeVisible()

  await page.reload()
  await expect(page).toHaveURL(/sun-grand-thuy-khue\/vai-tro\/agent/)
  await expect(page.getByText('Chờ xác nhận', { exact: true }).first()).toBeVisible()
  await expect(page.getByTestId('handoff-next-role')).toContainText('Người bán')

  await resetSampleData(page)
  await expect(page).toHaveURL(/#\/gioi-thieu$/)
  await page.getByTestId('start-demo').click()
  await expectFreshCaseCard(page, CASES.developer.title)

  await page.reload()
  await expectFreshCaseCard(page, CASES.developer.title)
})

test('bàn phím hiển thị focus và giữ focus trong hộp thoại khôi phục', async ({ page }) => {
  const skipLink = page.getByRole('link', { name: 'Bỏ qua điều hướng' })
  await page.keyboard.press('Tab')
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeVisible()

  const startButton = page.getByTestId('start-demo')
  await startButton.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#\/ho-so$/)

  const resetTrigger = page.getByTestId('reset-demo')
  await resetTrigger.focus()
  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog', { name: 'Khôi phục dữ liệu mẫu?' })
  const closeButton = dialog.getByRole('button', { name: 'Đóng' })
  await expect(dialog).toBeVisible()
  await expect(closeButton).toBeFocused()
  await expect.poll(() => closeButton.evaluate((element) => element.matches(':focus-visible'))).toBe(true)

  const focusableCount = await dialog
    .locator('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
    .count()
  expect(focusableCount).toBeGreaterThanOrEqual(3)

  await page.keyboard.press('Shift+Tab')
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)

  for (let index = 0; index <= focusableCount; index += 1) {
    await page.keyboard.press('Tab')
    await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(resetTrigger).toBeFocused()
})

test('chế độ giảm chuyển động loại bỏ chuyển động không cần thiết', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()

  const reducedMotion = await page.evaluate(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  expect(reducedMotion).toBe(true)

  const motion = await page.getByTestId('start-demo').evaluate((element) => {
    const style = getComputedStyle(element)
    const toMilliseconds = (value) => value.endsWith('ms')
      ? Number.parseFloat(value)
      : Number.parseFloat(value) * 1000

    return {
      animationDurations: style.animationDuration.split(',').map((value) => toMilliseconds(value.trim())),
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      transitionDurations: style.transitionDuration.split(',').map((value) => toMilliseconds(value.trim())),
    }
  })

  expect(motion.scrollBehavior).toBe('auto')
  expect(motion.transitionDurations.every((duration) => duration <= 1)).toBe(true)
  expect(motion.animationDurations.every((duration) => duration <= 1)).toBe(true)
})

test('Sàn môi giới và Ngân hàng chỉ nhận bản chiếu hồ sơ tối thiểu', async ({ page }) => {
  await openCase(page, CASES.developer.title)
  await act(page, 'match_property')
  await act(page, 'request_seller_confirmation')
  await handoff(page, 'Người bán')
  await act(page, 'confirm_representation')
  await handoff(page, 'VMLS')
  await act(page, 'create_listing')
  await handoff(page, 'Môi giới')
  await act(page, 'record_buyer')

  await page.goto('/#/goc-nhin/brokerage')
  await expect(page.getByRole('heading', { name: 'Góc nhìn Sàn môi giới' })).toBeVisible()
  await expect(page.getByText('Tính đầy đủ của quyền đại diện', { exact: true })).toBeVisible()
  await expect(page.getByText('Hồ sơ định danh đầy đủ của các bên', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Hai hồ sơ qua lăng kính Sàn môi giới' })).toBeVisible()

  const brokerageCase = page
    .getByRole('heading', { name: 'S2-12A · Thụy Khuê', exact: true })
    .locator('xpath=ancestor::article')
  await brokerageCase.getByRole('button', { name: /Mở hồ sơ với vai trò này/ }).click()
  await expect(page).toHaveURL(/#\/ho-so\/sun-grand-thuy-khue\/vai-tro\/brokerage$/)

  const brokerageView = page.getByTestId('role-scoped-view')
  await expect(brokerageView).toBeVisible()
  await expect(
    brokerageView.getByRole('heading', { name: 'Phạm vi hồ sơ dành cho Sàn môi giới' }),
  ).toBeVisible()
  await expect(brokerageView.getByText('Tính đầy đủ của quyền đại diện', { exact: true })).toBeVisible()
  await expect(brokerageView.getByText(CASES.developer.npid, { exact: true })).toBeVisible()
  await expect(brokerageView.getByText('Đã khởi tạo', { exact: true })).toBeVisible()
  await expect(brokerageView.getByText('Đã xác nhận', { exact: true })).toBeVisible()
  await expect(brokerageView.getByText('Không có điểm nghẽn đang mở', { exact: true })).toBeVisible()
  await expect(page.getByText('Lịch sử hồ sơ nối tiếp', { exact: true })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Ghi nhận Người mua và kiểm tra sẵn sàng công chứng' })).toHaveCount(0)
  await expect(page.getByText('Các bên trong hồ sơ', { exact: true })).toHaveCount(0)
  await expect(page.getByTestId('action-verify_readiness')).toHaveCount(0)

  for (const restrictedValue of ['T••• M••• A•••', 'N••• V••• A•', '09•• ••• 218', '09•• ••• 506']) {
    await expect(page.getByText(restrictedValue, { exact: true })).toHaveCount(0)
  }

  await page.goto('/#/goc-nhin/bank')
  await expect(page).toHaveURL(/#\/goc-nhin\/bank$/)
  await expect(page.getByRole('heading', { name: 'Góc nhìn Ngân hàng' })).toBeVisible()
  await expect(page.getByText('Trạng thái đồng ý chia sẻ', { exact: true })).toBeVisible()
  await expect(page.getByText('Tài liệu công chứng', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Hai hồ sơ qua lăng kính Ngân hàng' })).toBeVisible()
  const bankTab = page.getByRole('tab', { name: /Ngân hàng/ })
  await bankTab.focus()
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(/#\/goc-nhin\/seller$/)
  await expect(page.getByRole('tab', { name: /Người bán/ })).toBeFocused()
  await page.keyboard.press('End')
  await expect(page).toHaveURL(/#\/goc-nhin\/bank$/)
  await expect(page.getByRole('tab', { name: /Ngân hàng/ })).toBeFocused()
  await expect(page.getByText(CASES.developer.npid, { exact: true })).toHaveCount(0)
  await expect(page.getByText(CASES.developer.plid, { exact: true })).toHaveCount(0)

  const bankCase = page
    .getByRole('heading', { name: 'S2-12A · Thụy Khuê', exact: true })
    .locator('xpath=ancestor::article')
  await expect(bankCase.getByText('Đã đồng ý chia sẻ ngữ cảnh tổng quan (mô phỏng)', { exact: true })).toBeVisible()
  const landedBankCase = page
    .getByRole('heading', { name: 'Nhà ở · Phú Thượng', exact: true })
    .locator('xpath=ancestor::article')
  await expect(landedBankCase.getByText('Chưa có đồng ý chia sẻ', { exact: true })).toBeVisible()
  await bankCase.getByRole('button', { name: /Mở hồ sơ với vai trò này/ }).click()
  await expect(page).toHaveURL(/#\/ho-so\/sun-grand-thuy-khue\/vai-tro\/bank$/)

  const bankView = page.getByTestId('role-scoped-view')
  await expect(bankView).toBeVisible()
  await expect(
    bankView.getByRole('heading', { name: 'Phạm vi hồ sơ dành cho Ngân hàng' }),
  ).toBeVisible()
  await expect(bankView.getByText('Trạng thái đồng ý chia sẻ', { exact: true })).toBeVisible()
  await expect(bankView.getByText('Căn hộ thuộc dự án', { exact: true })).toBeVisible()
  await expect(bankView.getByText('15,8 tỷ đồng', { exact: true })).toBeVisible()
  await expect(bankView.getByText('Đã đồng ý chia sẻ ngữ cảnh tổng quan (mô phỏng)', { exact: true })).toBeVisible()
  await expect(bankView.getByText('Chưa sẵn sàng công chứng', { exact: true })).toBeVisible()
  await expect(page.getByText(CASES.developer.npid, { exact: true })).toHaveCount(0)
  await expect(page.getByText(CASES.developer.plid, { exact: true })).toHaveCount(0)
  await expect(page.getByText('Lịch sử hồ sơ nối tiếp', { exact: true })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Ghi nhận Người mua và kiểm tra sẵn sàng công chứng' })).toHaveCount(0)
  await expect(page.getByText('Các bên trong hồ sơ', { exact: true })).toHaveCount(0)
  await expect(page.getByTestId('action-verify_readiness')).toHaveCount(0)

  for (const restrictedValue of ['T••• M••• A•••', 'N••• V••• A•', '09•• ••• 218', '09•• ••• 506']) {
    await expect(page.getByText(restrictedValue, { exact: true })).toHaveCount(0)
  }
})

test('bản thảo pilot kết thúc bằng lời mời đồng thiết kế, không phải bước đóng giả', async ({ page }) => {
  await page.goto('/#/pilot')
  await expect(
    page.getByRole('heading', { name: 'Chọn một lát cắt đủ nhỏ để kiểm chứng giá trị phối hợp' }),
  ).toBeVisible()
  await expect(page.getByText('5 quyết định cần cùng chốt', { exact: true })).toBeVisible()

  const pilotLink = page.getByRole('link', { name: 'Cùng thiết kế pilot VMLS' })
  await expect(pilotLink).toBeVisible()
  await expect(pilotLink).toHaveAttribute(
    'href',
    'mailto:pilot@housenow.com.vn?subject=Cùng%20thiết%20kế%20pilot%20VMLS',
  )
  await expect(page.getByText(/không phải cam kết triển khai/i)).toBeVisible()
})

for (const viewport of [
  { name: '1440×900', width: 1440, height: 900 },
  { name: '1920×1080', width: 1920, height: 1080 },
  { name: '1024×768', width: 1024, height: 768 },
  { name: '390×844', width: 390, height: 844 },
]) {
  test(`hiển thị hồ sơ không tràn ngang ở ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await openCase(page, CASES.developer.title)

    await expect(page.getByRole('heading', { name: CASES.developer.title })).toBeVisible()
    await expect(page.getByTestId('action-match_property')).toBeVisible()
    await expect(page.getByRole('region', { name: 'Hộ chiếu định danh hồ sơ' })).toBeVisible()

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
  })
}
