import { test, expect } from "@playwright/test";
import { waitForDebugger } from "inspector";
const { SignInPage } = require("../../pages/SignInPage");
const { UserSelectionPage } = require("../../pages/UserSelectionPage");
const { LoginNamePage } = require("../../pages/LoginNamePage");
const { WorkOrdersPage } = require("../../pages/WorkOrdersPage");
const { AllWorkOrdersPage } = require("../../pages/AllWorkOrders");
const { closeNotifications } = require("../utils/helper");
const users = require("../../data/users.json");

test("Smoke | User can login successfully", async ({ page }) => {
  const signInPage = new SignInPage(page);
  const userSelectionPage = new UserSelectionPage(page);

  const loginNamePage = new LoginNamePage(page);
  const workOrdersPage = new WorkOrdersPage(page);
  const allWorkOrdersPage = new AllWorkOrdersPage(page);

  await signInPage.open();
  await signInPage.clickSignIn();
  await userSelectionPage.enterLoginName(users.OPS.userName);
  await loginNamePage.enterPassword(users.OPS.password);
  //await page.pause();

  await workOrdersPage.assertLoggedIn();
  //await closeNotifications(page);
  //await page.pause();
  await workOrdersPage.clickAllWorkOrders();
  //await page.pause();
  //await allWorkOrdersPage.getWorkOrderId();
  await allWorkOrdersPage.cancelWorkOrder();
});
