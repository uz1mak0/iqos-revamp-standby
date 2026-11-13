import { expect, test } from "@playwright/test";
test.use({ storageState: "./tests-auth/drauth.json" });

test("DR Reports: Download Tramsaction report", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/reports/download/");
  await page
    .getByRole("button", { name: "Download Transaction Report" })
    .click();
});

test("DR Reports: Download inventory snapshot", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/reports/download/");
  await page
    .getByRole("button", { name: "Download Inventory Snapshot" })
    .click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Success").click();
});

test("DR Reports: Download sales report", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/reports/download/");
  await page
    .getByTestId("sales-select-wh")
    .getByPlaceholder("Select Warehouse")
    .click();
  await page.getByRole("option", { name: "DR Automated WH1" }).click();
  await expect(
    page.getByRole("button", { name: "Download Sales Report" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Download Sales Report" }).click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Success").click();
});

test("DR Reports: Download guided trial report", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/reports/download/");
  await page
    .getByTestId("gt-select-wh")
    .getByPlaceholder("Select Warehouse")
    .click();
  await page.getByRole("option", { name: "DR Automated WH1" }).click();
  await expect(
    page.getByRole("button", { name: "Download GT Report" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Download GT Report" }).click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Success").click();
});

test("DR Reports: Download sales zip report", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/reports/download/");
  await page
    .getByTestId("sales-zip-select-wh")
    .getByPlaceholder("Select Warehouse")
    .click();
  await page.getByRole("option", { name: "DR Automated WH1" }).click();
  await expect(
    page.getByRole("button", { name: "Download Sales Zip Report" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Download Sales Zip Report" }).click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Success").click();
});
