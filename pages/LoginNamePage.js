const { expect } = require("@playwright/test");
const { closeModals } = require("../tests/utils/helper");

class LoginNamePage {
  constructor(page) {
    this.page = page;
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.nextBtn = page.getByRole("button", { name: "Next" });
  }

  async enterPassword(password) {
    await this.page.waitForURL("**/ui/login/loginname");
    await this.passwordInput.waitFor({ state: "visible" });

    try {
      await expect(this.passwordInput).toBeVisible();
      await expect(this.passwordInput).toBeEnabled();
      await this.passwordInput.fill(password);

      await this.nextBtn.waitFor({ state: "visible" });
      await expect(this.nextBtn).toBeVisible();
      await expect(this.nextBtn).toBeEnabled();
      await this.nextBtn.click();

      await this.page.waitForURL("**/quotes-and-orders/work-orders");
      await expect(this.page).toHaveURL(/quotes-and-orders\/work-orders$/);

      //await closeModals(this.page);
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await this.page.screenshot({
        path: `screenshots/enter-password-error-${timestamp}.png`,
        fullPage: true,
      });
      throw error;
    }
  }
}

module.exports = { LoginNamePage };
