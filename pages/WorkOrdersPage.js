const { expect } = require("@playwright/test");
const { closeNotifications, closeModals } = require("../tests/utils/helper");

class WorkOrdersPage {
  constructor(page) {
    this.page = page;
    this.header = page.getByText("Work Orders");
    this.modal = page
      .locator("#Frill_Frame_widget_61SXKd_cLOAsj_notification")
      .contentFrame()
      .locator("div")
      .filter({ hasText: "24 Oct, 2025🎉 Welcome to" })
      .nth(5);
    this.allWorkOrdersBtn = page.getByRole("menuitem", {
      name: "All Work Orders",
    });
  }

  async assertLoggedIn() {
    try {
      await this.page.waitForURL("**/quotes-and-orders/work-orders");
      await expect(this.page).toHaveURL(/quotes-and-orders\/work-orders/);

      const browserName = this.page.context().browser()?.browserType().name();

      if (browserName === "webkit") {
        await this.page.waitForTimeout(1200);

        if (this.page.url().includes("400")) {
          console.log("⚠️ WebKit stuck on 400 → navigating manually...");
          await this.page.goto(
            "https://dev.hdbrite.com/quotes-and-orders/work-orders",
            {
              waitUntil: "domcontentloaded",
            }
          );
        }
      }
      await this.modal.waitFor({ state: "visible" });
      await expect(this.modal).toBeVisible();
      await closeNotifications(this.page);
      //await this.header.waitFor({ state: "visible" }); // Ensure page is fully loaded
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await this.page.screenshot({
        path: `screenshots/assert-logged-in-error-${timestamp}.png`,
        fullPage: true,
      });
      throw error;
    }
  }

  async clickAllWorkOrders() {
    //  await closeNotifications(this.page);
    await this.allWorkOrdersBtn.waitFor({ state: "visible" });

    try {
      await expect(this.allWorkOrdersBtn).toBeVisible();
      await expect(this.allWorkOrdersBtn).toBeEnabled();
      await this.allWorkOrdersBtn.click();

      await this.page.waitForURL(
        "**/quotes-and-orders/work-orders#all-work-order"
      );
      await expect(this.page).toHaveURL(
        /quotes-and-orders\/work-orders#all-work-order/
      );
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await this.page.screenshot({
        path: `screenshots/click-all-work-orders-error-${timestamp}.png`,
        fullPage: true,
      });
      throw error;
    }
  }
}

module.exports = { WorkOrdersPage };
