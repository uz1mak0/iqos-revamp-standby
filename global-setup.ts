import { Browser, chromium, Page, test } from "@playwright/test";

async function globalSetup() {
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Enter Username").fill("Administrator");
  await page.getByPlaceholder("Enter Password").click();
  await page.getByPlaceholder("Enter Password").fill("Administrator");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("button", { name: "Okay" }).click();
  await page.waitForTimeout(3000);
  await page.context().storageState({ path: "./tests-auth/auth.json" });

  await page.getByTestId("user-menu").getByRole("img").click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await page.getByRole("button", { name: "Okay" }).click();

  await page.getByPlaceholder("Enter Username").click();
  await page.getByPlaceholder("Enter Username").fill("dr_testjv");
  await page.getByPlaceholder("Enter Password").click();
  await page.getByPlaceholder("Enter Password").fill("183265");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForTimeout(3000);
  await page.context().storageState({ path: "./tests-auth/drauth.json" });

  await page.getByTestId("user-menu").getByRole("img").click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await page.getByRole("button", { name: "Okay" }).click();

  await page.getByTestId("user-menu").getByRole("img").click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await page.getByRole("button", { name: "Okay" }).click();

  await page.getByPlaceholder("Enter Username").click();
  await page.getByPlaceholder("Enter Username").fill("jv_ecomcsc");
  await page.getByPlaceholder("Enter Password").click();
  await page.getByPlaceholder("Enter Password").fill("582555");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForTimeout(3000);
  await page.context().storageState({ path: "./tests-auth/cscauth.json" });

  await page.getByTestId("user-menu").getByRole("img").click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await page.getByRole("button", { name: "Okay" }).click();

  await browser.close();
}

export default globalSetup;
