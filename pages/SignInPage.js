const { expect } = require("@playwright/test");

class SignInPage {
  constructor(page) {
    this.page = page;
    this.signInBtn = page.getByRole("button", { name: /sign in/i });
  }

  async open() {
    const url = process.env.BASE_URL
      ? `${process.env.BASE_URL}/login`
      : "https://dev.hdbrite.com/login";

    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await this.signInBtn.waitFor({ state: "visible" });

    try {
      await expect(this.signInBtn).toBeVisible();
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await this.page.screenshot({
        path: `screenshots/signin-page-error-${timestamp}.png`,
        fullPage: true,
      });
      throw error;
    }
  }

  async clickSignIn() {
    await this.signInBtn.waitFor({ state: "visible" });

    try {
      await expect(this.signInBtn).toBeVisible();
      await expect(this.signInBtn).toBeEnabled();
      await this.signInBtn.click();
    } catch (error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await this.page.screenshot({
        path: `screenshots/click-signin-error-${timestamp}.png`,
        fullPage: true,
      });
      throw error;
    }
  }
}

module.exports = { SignInPage };
