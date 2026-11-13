import { test, expect } from "@playwright/test";
var random = require("random-name");

test.use({ storageState: "./tests-auth/noauth.json" });
test("LOGIN: DR User login", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000");
  await page.getByPlaceholder("Enter Username").click();
  await page.getByPlaceholder("Enter Username").fill("dr_testjv");
  await page.getByPlaceholder("Enter Username").press("Tab");
  await page.getByPlaceholder("Enter Password").fill("183265");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("button").first().click();
  await page.getByTestId("user-menu").getByRole("img").click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await page.getByRole("button", { name: "Okay" }).click();
  await page.getByRole("heading", { name: "Login" }).click();
});

test("LOGIN: Ecom User login", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000");
  await page.getByPlaceholder("Enter Username").click();
  await page.getByPlaceholder("Enter Username").fill("Administrator");
  await page.getByPlaceholder("Enter Username").press("Tab");
  await page.getByPlaceholder("Enter Password").fill("Administrator");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("button").first().click();
  await page.getByTestId("user-menu").getByRole("img").click();
  await page.getByRole("menuitem", { name: "Logout" }).click();
  await page.getByRole("button", { name: "Okay" }).click();
});

test("LOGIN: User does not exist", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000");
  await page.getByPlaceholder("Enter Username").click();
  await page.getByPlaceholder("Enter Username").fill(random.first());
  await page.getByPlaceholder("Enter Password").click();
  await page.getByPlaceholder("Enter Password").fill(random.last());
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByText("User does not exist.").click();
});

test("LOGIN: Incorrect username/password", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000");
  await page.getByPlaceholder("Enter Username").click();
  await page.getByPlaceholder("Enter Username").fill("Administrator");
  await page.getByPlaceholder("Enter Password").click();
  await page.getByPlaceholder("Enter Password").fill(random.last());
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByText("Incorrect username or password.").click();
});
