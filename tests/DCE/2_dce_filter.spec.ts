import { test, expect } from "@playwright/test";

const searchByGTIN = "4800000000001";
const searchBySKU = "ME001693.00";
const searchByDescprition = "KIT IQOS ILUMA PRIME OBSIDIAN BLACK OPK 1";
const searchByInvalidValues = "fasdf4235234tgadbf45yhfg{}";

test("DCE: Search by GTIN", async ({ page }) => {
  await page.goto("http://localhost:3000/inventory/dce/");
  await page.getByPlaceholder("Search by GTIN/SKU/Description").click();
  await page
    .getByPlaceholder("Search by GTIN/SKU/Description")
    .fill(searchByGTIN);
  await expect(page.getByTestId(`GTIN-${searchByGTIN}`)).toBeVisible();
});

test("DCE: Search by SKU", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/inventory/dce/");
  await page.getByPlaceholder("Search by GTIN/SKU/Description").click();
  await page
    .getByPlaceholder("Search by GTIN/SKU/Description")
    .fill(searchBySKU);
  await expect(page.getByTestId(`SKU-${searchBySKU}`)).toBeVisible();
});

test("DCE: Search by description", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/inventory/dce/");
  await page.getByPlaceholder("Search by GTIN/SKU/Description").click();
  await page
    .getByPlaceholder("Search by GTIN/SKU/Description")
    .fill(searchByDescprition);
  await expect(page.getByTestId(`DESC-${searchByDescprition}`)).toBeVisible();
});

test("DCE: Search invalid values", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/inventory/dce/");
  await page.getByPlaceholder("Search by GTIN/SKU/Description").click();
  await page
    .getByPlaceholder("Search by GTIN/SKU/Description")
    .fill(searchByInvalidValues);
  await expect(page.getByTestId(`SKU-${searchByInvalidValues}`)).toBeHidden();
  await expect(page.getByTestId(`GTIN-${searchByInvalidValues}`)).toBeHidden();
  await expect(page.getByTestId(`DESC-${searchByInvalidValues}`)).toBeHidden();
});

test("DCE: Filter by type", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/inventory/dce/");
  await page.getByPlaceholder("Filter by type").click();
  await page.getByRole("option", { name: "DEVICES" }).click();
  await page.getByPlaceholder("Filter by type").click();
  await page.getByRole("option", { name: "ACCESSORIES" }).click();
  await page.getByPlaceholder("Filter by type").click();
  await page.getByRole("option", { name: "HEETS" }).click();
  await page.getByPlaceholder("Filter by type").click();
  await page.getByRole("option", { name: "ZYN" }).click();
});

test("DCE: Filter by status", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/inventory/dce/");
  await page.getByPlaceholder("Filter by status").click();
  await page.getByRole("option", { name: "BLOCKED" }).click();
  await page.getByPlaceholder("Filter by status").click();
  await page.getByRole("option", { name: "LIVE" }).click();
});
