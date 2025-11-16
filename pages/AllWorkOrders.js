const { expect } = require("@playwright/test");
const { closeNotifications, closeModals } = require("../tests/utils/helper");

class AllWorkOrdersPage {
  constructor(page) {
    this.page = page;
    this.header = page.getByText("Work Orders");
  }

  async assertLoggedIn() {
    try {
      await this.page.waitForURL("**/quotes-and-orders/work-orders");
      await expect(this.page).toHaveURL(/quotes-and-orders\/work-orders/);
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await this.page.screenshot({
        path: `screenshots/all-work-orders-assert-logged-in-error-${timestamp}.png`,
        fullPage: true,
      });
      throw error;
    }
  }

  async getWorkOrderId() {
    try {
      const unassignedRow = this.page
        .locator("tbody tr", {
          has: this.page.locator("td", { hasText: "Unassigned" }),
        })
        .first();

      await unassignedRow.waitFor({ state: "visible" });
      await expect(unassignedRow).toBeVisible();

      const workNo = (
        await unassignedRow.locator("td a").textContent()
      )?.trim();
      console.log("Work No:", workNo);

      const assignBtn = unassignedRow.locator("button", { hasText: "Assign" });
      await expect(assignBtn).toBeVisible();
      await expect(assignBtn).toBeEnabled();
      await assignBtn.click();

      return workNo;
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await this.page.screenshot({
        path: `screenshots/get-work-order-id-error-${timestamp}.png`,
        fullPage: true,
      });
      throw error;
    }
  }

  async cancelWorkOrder() {
    //await closeNotifications(this.page);

    try {
      const row = this.page
        .locator("tbody tr", {
          has: this.page.locator("td", { hasText: "Unassigned" }),
        })
        .first();

      await row.waitFor();
      await expect(row).toBeVisible();

      const menuBtn = row.locator('button[aria-haspopup="menu"]');
      await expect(menuBtn).toBeVisible();
      await expect(menuBtn).toBeEnabled();
      await menuBtn.click();

      const cancelItem = this.page.getByRole("menuitem", {
        name: "Cancel",
        exact: true,
      });
      await cancelItem.waitFor({ state: "visible" });
      await expect(cancelItem).toBeVisible();
      await expect(cancelItem).toBeEnabled();
      await cancelItem.click();

      const dialog = this.page.getByRole("dialog", {
        name: /request cancel work no\./i,
      });
      await dialog.waitFor({ state: "visible" });
      await expect(dialog).toBeVisible();

      const otherRadio = this.page.getByRole("radio", { name: "Other" });
      await expect(otherRadio).toBeVisible();
      await expect(otherRadio).toBeEnabled();
      await otherRadio.click();

      const textarea = this.page.getByTestId("optionNote-textarea-field");
      await expect(textarea).toBeVisible();
      await expect(textarea).toBeEnabled();
      await textarea.fill("Automated cancellation reason");
      // await this.page.getByRole("button", { name: "Submit Request" }).click();
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await this.page.screenshot({
        path: `screenshots/cancel-work-order-error-${timestamp}.png`,
        fullPage: true,
      });
      throw error;
    }
  }
}

module.exports = { AllWorkOrdersPage };
