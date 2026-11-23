const { test, expect } = require('@playwright/test');
const path = require('node:path');

test('desktop journey: verified programmes, search, modes and a truthful enquiry draft', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?utm_source=qa&utm_medium=test&utm_campaign=research');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('discovery');
  await expect(page.locator('.domain-card')).toHaveCount(8);
  await page.getByRole('button', { name: 'Technology', exact: true }).click();
  await expect(page.locator('.domain-card:visible')).toHaveCount(2);
  await page.getByRole('button', { name: 'All disciplines', exact: true }).click();
  await page.getByRole('searchbox').fill('AI');
  await expect(page.locator('.domain-card:visible')).toHaveCount(1);
  await expect(page.locator('.domain-card:visible h3')).toHaveText('Computing Science');
  await page.getByRole('searchbox').fill('zzzzzz');
  await expect(page.locator('#programme-empty')).toBeVisible();
  await page.getByRole('button', { name: 'Show all disciplines' }).click();
  const computing = page.locator('[data-programme-id="computing"]');
  await computing.locator('summary').click();
  await expect(computing.getByRole('link', { name: 'Official programme details' })).toHaveAttribute('href', /doctoral\/computing-science$/);
  await computing.getByRole('button', { name: 'Enquire about this field' }).click();
  await expect(page.getByLabel('Research interest')).toHaveValue('computing');
  await expect(page.getByLabel('Your name')).toBeFocused();
  await page.getByRole('tab', { name: 'Part-time Ph.D.' }).click();
  await expect(page.locator('#panel-part')).toBeVisible();
  await expect(page.locator('#panel-full')).toBeHidden();
  await page.getByRole('tab', { name: 'Part-time Ph.D.' }).press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Full-time Ph.D.' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Ask about full-time research' }).click();
  await expect(page.getByLabel('Preferred study mode')).toHaveValue('full-time');
  await page.getByRole('button', { name: 'Prepare my enquiry' }).click();
  await expect(page.locator('#name-error')).toBeVisible();
  await expect(page.locator('#email-error')).toBeVisible();
  await expect(page.locator('#consent-error')).toBeVisible();
  await page.getByLabel('Your name').fill('Research Test');
  await page.getByLabel('Email address').fill('researcher@example.com');
  await page.locator('#enquiry-consent').check();
  await page.getByRole('button', { name: 'Prepare my enquiry' }).click();
  await expect(page.locator('#form-feedback')).toContainText('Nothing has been sent yet.');
  const draft = await page.getByRole('link', { name: 'Open email draft' }).getAttribute('href');
  expect(draft).toMatch(/^mailto:phd\.rdc@sharda\.ac\.in\?/);
  const decoded = decodeURIComponent(draft);
  expect(decoded).toContain('Computing Science');
  expect(decoded).toContain('Full-time');
  expect(decoded).toContain('utm_campaign: research');
  const analytics = await page.evaluate(() => JSON.stringify(window.dataLayer));
  expect(analytics).not.toContain('researcher@example.com');
  expect(analytics).not.toContain('Research Test');
  expect(analytics).not.toContain('enquiry_submitted');
  await page.getByLabel('Your name').fill('Another Researcher');
  await expect(page.locator('#form-feedback')).toBeHidden();
  expect(errors).toEqual([]);
});

test('mobile menu, privacy dialog, FAQ and sticky navigation remain accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.locator('#main-navigation')).toBeVisible();
  await page.locator('#main-navigation').getByRole('link', { name: 'Admissions', exact: true }).click();
  await expect(page.locator('#main-navigation')).toBeHidden();
  await expect(page.locator('.site-header')).toHaveCSS('position', 'sticky');
  await page.getByRole('button', { name: 'Enquiry privacy notice' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Enquiry privacy notice' })).toBeFocused();
  await page.locator('.faq-list summary').first().click();
  await expect(page.locator('.faq-list details').first()).toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
});

test('layout fits 320–1920px with no horizontal overflow or broken assets', async ({ page }) => {
  const failed = [];
  page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
  for (const width of [320, 360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const overflow = await page.evaluate(() => ({ viewport: window.innerWidth, width: document.documentElement.scrollWidth }));
    expect(overflow.width, `Horizontal overflow at ${width}px`).toBeLessThanOrEqual(overflow.viewport + 1);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#enquiry-email')).toHaveCSS('font-size', '16px');
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  const broken = await page.locator('img').evaluateAll(images => images.filter(image => image.complete && !image.naturalWidth).map(image => image.getAttribute('src')));
  expect(broken).toEqual([]);
  expect(failed).toEqual([]);
});

test('Why Ph.D. leads directly to the computing section and animations work', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('#whyy + #supercomputer')).toHaveCount(1);
  await expect(page.locator('.accreditation-track')).toHaveCSS('animation-name', 'accreditation-slide-right');
  await page.locator('.research-stats').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-count]').first()).toHaveText('1,300', { timeout: 15000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.accreditation-track')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.awards-section')).toHaveCSS('background-attachment', 'scroll, scroll');
});

test('page still offers programmes and admissions contact without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8080/');
  await expect(page.locator('.domain-card')).toHaveCount(8);
  await expect(page.locator('.form-fallback a').first()).toHaveAttribute('href', 'mailto:phd.rdc@sharda.ac.in');
  await expect(page.locator('.form-submit')).toBeHidden();
  await context.close();
});

test('capture desktop and mobile design previews', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('[data-count]').first()).toHaveText('1,300', { timeout: 15000 });
  await page.screenshot({ path: path.join('previews', 'desktop-hero.png') });
  await page.locator('#programmes').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join('previews', 'desktop-programmes.png') });
  await page.locator('#admissions').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join('previews', 'desktop-admissions.png') });
  await page.locator('#supercomputer').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join('previews', 'desktop-research.png') });
  await page.locator('#awards').scrollIntoViewIfNeeded();
  await expect(page.locator('.award-times img')).toHaveJSProperty('complete', true);
  await page.screenshot({ path: path.join('previews', 'desktop-awards.png') });
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await page.locator('.hero').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join('previews', 'desktop-full.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.screenshot({ path: path.join('previews', 'mobile-hero.png') });
  await page.locator('#programmes').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join('previews', 'mobile-programmes.png') });
  await page.locator('.mobile-actions a[href="#enquire"]').click();
  await expect(page.getByLabel('Your name')).toBeFocused();
  await expect(page.locator('.mobile-actions')).toHaveClass(/is-hidden/);
  await page.screenshot({ path: path.join('previews', 'mobile-enquiry.png') });
});
