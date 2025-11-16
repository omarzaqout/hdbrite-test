async function closeModals(page) {
  try {
    const frame = page.frameLocator(
      "#Frill_Frame_widget_61SXKd_cLOAsj_notification"
    );
    const closeBtn = frame.locator('button[aria-label="Close"]');

    // Check if the close button exists and is visible
    if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeBtn.click();
      await page.waitForTimeout(300);
    }
  } catch (error) {}
}
async function closeNotifications(page) {
  const frameSelector = "#Frill_Frame_widget_61SXKd_cLOAsj_notification";
  const timeoutTotal = 15000;
  const start = Date.now();
  const remaining = () => Math.max(1000, timeoutTotal - (Date.now() - start));
  try {
    const closeBtn = page
      .frameLocator(frameSelector)
      .getByRole("button", { name: "Close" });
    await closeBtn.waitFor({ state: "visible", timeout: remaining() });
    await closeBtn.click({ force: true, timeout: 5000 });
    return true;
  } catch (err) {}
  try {
    const textBtn = page
      .frameLocator(frameSelector)
      .locator('button:has-text("Close")');
    await textBtn.waitFor({ state: "visible", timeout: remaining() });
    await textBtn.click({ force: true, timeout: 5000 });
    return true;
  } catch (err) {}
  try {
    await page
      .locator(frameSelector)
      .waitFor({ state: "attached", timeout: remaining() });

    const frame = await page.locator(frameSelector).contentFrame();
    if (frame) {
      const candidates = [
        frame.getByRole ? frame.getByRole("button", { name: "Close" }) : null,
        frame.locator ? frame.locator('button:has-text("Close")') : null,
        frame.locator ? frame.locator("text=Close") : null,
      ].filter(Boolean);

      for (const c of candidates) {
        try {
          if ((await c.count()) > 0) {
            await c.first().click({ force: true, timeout: 5000 });
            return true;
          }
        } catch (e) {}
      }

      const bodyHtml = await frame
        .evaluate(() => document.body.innerHTML)
        .catch(() => null);
      console.log(
        "closeNotifications: frame body snapshot length =",
        bodyHtml ? bodyHtml.length : null
      );
    }
  } catch (err) {}
  try {
    await page.screenshot({
      path: "closeNotifications-fail.png",
      fullPage: true,
    });
    console.log(
      "closeNotifications: screenshot saved as closeNotifications-fail.png"
    );
  } catch (sErr) {
    console.log("closeNotifications: failed to save screenshot", sErr);
  }

  console.log("closeNotifications: modal not found/clicked");
  return false;
}

//locator('#Frill_Frame_widget_61SXKd_cLOAsj_notification').contentFrame().locator('div').filter({ hasText: '24 Oct, 2025🎉 Welcome to' }).nth(5)
//locator('#Frill_Frame_widget_61SXKd_cLOAsj_notification').contentFrame().getByRole('button', { name: 'Close' })

module.exports = { closeModals, closeNotifications };
