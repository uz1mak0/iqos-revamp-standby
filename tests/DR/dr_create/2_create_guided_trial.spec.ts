import { expect, test } from "@playwright/test";
import { guidedTrialForm } from "../config";

test.use({ storageState: "./tests-auth/drauth.json" });

const validGTNonDeviceGTIN = "GT_48044141";

/**
 * Create guided trial without entering values on input fields.
 */
test("DR Guided Trial: Save with empty required fields", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/record-sales/guided-trial/");
  await page.getByRole("button", { name: "Proceed to Record Sale" }).click();
  await page.getByRole("button", { name: "Submit Lead" }).click();
});

/**
 * Scanning invalid GT GTIN/Accessories
 * A notification pops out with an error message SKU/GTIN not found
 */
test("DR Guided Trial: Scan invalid GT GTIN/Accessories", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await guidedTrialForm(page);
  await page.getByPlaceholder("SCAN GTIN").click();
  await page.getByPlaceholder("SCAN GTIN").fill("asdasdasdasd");
  await page.getByPlaceholder("SCAN GTIN").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-SKU/GTIN not found").click();
});

/**
 * Scan GT HEETS/Accessories GTIN when adding line items
 * Changed validGTNonDeviceGTIN value when testing other GT non device GTIN
 * Must add GT HEETS/Accessories on line items for creating guided trial
 */
test("DR Guided Trial: Scan GT GTIN/Accessories", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await guidedTrialForm(page);
  await page.getByPlaceholder("SCAN GTIN").click();
  await page.getByPlaceholder("SCAN GTIN").fill(validGTNonDeviceGTIN);
  await page.getByPlaceholder("SCAN GTIN").press("Enter");
  await page.getByRole("cell", { name: validGTNonDeviceGTIN }).click();
});

/**
 * To proceed to record sale, fill up the guided trial form first.
 * Changed validGTNonDeviceGTIN value when testing other GT non device GTIN
 */
test("DR Guided Trial: Proceed to record sales", async ({ page }, testInfo) => {
  await guidedTrialForm(page);
  testInfo.setTimeout(0);
  await page.getByPlaceholder("SCAN GTIN").click();
  await page.getByPlaceholder("SCAN GTIN").fill(validGTNonDeviceGTIN);
  await page.getByPlaceholder("SCAN GTIN").press("Enter");
  await page.getByRole("cell", { name: validGTNonDeviceGTIN }).click();
  await page.getByRole("button", { name: "Proceed to Record Sale" }).click();
  await page.getByRole("heading", { name: "Record Information" }).click();
});

/**
 * TO proceed to record sale from guided trial, add/scan atleast 1 GT line item.
 */
test("DR Guided Trial: Proceed to record sale without scanned items", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await guidedTrialForm(page);
  await page.getByRole("button", { name: "Proceed to Record Sale" }).click();
  await page.getByTestId("NOTIF-ERROR-CLOSE-Please add scanned items!").click();
});
