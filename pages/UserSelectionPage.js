const { expect } = require("@playwright/test");

class UserSelectionPage {
  constructor(page) {
    this.page = page;
    this.loginNameInput = page.getByRole("textbox", { name: "Login Name" });
    this.nextBtn = page.getByRole("button", { name: /next/i });
  }

  async enterLoginName(userName) {
    await this.page.waitForURL(/\/ui\/login\/login/);

    await this.loginNameInput.waitFor({ state: "visible" });

    try {
      await expect(this.loginNameInput).toBeVisible();
      await expect(this.loginNameInput).toBeEnabled();
      await this.loginNameInput.fill(userName);

      await this.nextBtn.waitFor({ state: "visible" });
      await expect(this.nextBtn).toBeVisible();
      await expect(this.nextBtn).toBeEnabled();
      await this.nextBtn.click();
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await this.page.screenshot({
        path: `screenshots/enter-login-name-error-${timestamp}.png`,
        fullPage: true,
      });
      throw error;
    }
  }
}

module.exports = { UserSelectionPage };
