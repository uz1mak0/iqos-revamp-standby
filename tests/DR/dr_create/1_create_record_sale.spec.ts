import { expect, test } from "@playwright/test";
import { recordSalesForm } from "../config";
import dayjs from "dayjs";
test.use({ storageState: "./tests-auth/drauth.json" });
var random = require("random-name");

const mentholVariants = ["MENTHOL", "NON-MENTHOL"];
const validNonDeviceGTIN = "48044370";
const validGTNonDeviceGTIN = "GT_48044141";
const randomMentholVariant =
  mentholVariants[Math.floor(Math.random() * mentholVariants.length)];

/**
 * Create record sale without entering values on input fields.
 */
test("DR Record Sales: Save with empty required fields", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/record-sales/");
  await page.getByRole("button", { name: "Record Sale", exact: true }).click();
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-Please fill up required fields!")
    .click();
});

/**
 * Scanning invalid device Codentify
 * A notification pops out with an error message SKU/GTIN not found
 */
test("DR Record Sales: Scan invalid GTIN/Codntify", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await recordSalesForm(page);
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").click();
  await page
    .getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY")
    .fill("010480650461504921DRAUTOMATED0240DK001TEST.00");
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-SKU/GTIN not found").click();
});

/**
 * Creating record sale without scanning/adding line items
 * Should fail on creating record sale
 * A notification pops out with an error message Please add scanned items!
 */
test("DR Record Sales: No Scanned items", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await recordSalesForm(page);
  await page.getByRole("button", { name: "Record Sale", exact: true }).click();
  await page.getByTestId("NOTIF-ERROR-CLOSE-Please add scanned items!").click();
});

/**
 * Creating record sale using GT device when scanning
 * Should fail on creating record sale
 * A notification pops out with an error message Please add scanned items!
 * Only device with status AVAILABLE and not a GT device can be added on the line items
 */
test("DR Record Sales: Scan GT device on Record Sales", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await recordSalesForm(page);
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").click();
  await page
    .getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY")
    .fill("GTAUTO000000");
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-Cannot scan device used for GT")
    .click();
});

/**
 * Scanning device from different warehouse using serial
 * Should only use codentify or serial from the selected warehouse when scanning
 * A notification pops out with an error message: Scanned device not belong to selected warehouse
 */
test("DR Record Sales: Scan device not belong to the warehouse", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await recordSalesForm(page);
  await page.getByPlaceholder("Select Warehouse").click();
  await page.getByRole("option", { name: "Shiela Warehouse" }).click();
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").click();
  await page
    .getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY")
    .fill("DRAUTOMATED0");
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").press("Enter");
  await page
    .getByTestId(
      "NOTIF-ERROR-CLOSE-Scanned device not belong to selected warehouse",
    )
    .click();
});

/**
 * Scan device using a valid codentify when adding line item
 * Codentify device must belong to the selected warehouse
 * A notification pops out with a message: Device scan success
 */
test("DR Record Sales: Scan device using a valid codentify", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await recordSalesForm(page);
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").click();
  await page
    .getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY")
    .fill("010480650461504921DRAUTOMATED0240DK001213.00");
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Device scan success").click();
});

/**
 * Scan device using a valid serial when adding line item
 * Device serial must belong to the selected warehouse
 * A notification pops out with a message: Device scan success
 */
test("DR Record Sales: Scan device using serial", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await recordSalesForm(page);
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").click();
  await page
    .getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY")
    .fill("DRAUTOMATED0");
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Device scan success").click();
});

/**
 * Scan HEETS/Accessories GTIN when adding line items
 * Changed validNonDeviceGTIN value when testing other non device gtin
 * Scanned Heets/Accessories must be added on the line items table
 */
test("DR Record Sales: Scan HEETS/Accessories", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await recordSalesForm(page);
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").click();
  await page
    .getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY")
    .fill(validNonDeviceGTIN);
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").press("Enter");
  await page.getByRole("cell", { name: validNonDeviceGTIN }).click();
});

/**
 * Scan GT HEETS/Accessories GTIN when adding line items
 * Changed validGTNonDeviceGTIN value when testing other non device gtin
 * A notification pops out with a message: Cannot scan GT items for record sales
 * Must failed to add GT HEETS/Accessories on line items for creating record sale
 */
test("DR Record Sales: Scan GT HEETS/Accessories", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await recordSalesForm(page);
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").click();
  await page
    .getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY")
    .fill(validGTNonDeviceGTIN);
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-Cannot scan GT items for record sales")
    .click();
});

/**
 * Scan TDSK with menthol variant
 * A random menthol variant will be selected
 * After creating record sales, check on sales log if methol variant applied.
 */
test("DR Record Sales: Scan TDSK with menthol variant", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  const invoiceID = `ATID-${dayjs().unix()}`;
  await recordSalesForm(page);
  await page.getByPlaceholder("Enter Invoice ID").click();
  await page.getByPlaceholder("Enter Invoice ID").fill(invoiceID);
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").click();
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").fill("0001");
  await page.getByPlaceholder("SCAN OR INPUT GTIN/CODENTIFY").press("Enter");
  await page.getByPlaceholder("Select menthol variant").click();

  if (randomMentholVariant === "MENTHOL") {
    await page
      .getByRole("option", { name: randomMentholVariant, exact: true })
      .click();
  } else {
    await page.getByRole("option", { name: randomMentholVariant }).click();
  }
  await page.getByRole("button", { name: "Record Sale", exact: true }).click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Record Sales created").click();
  await page.goto("http://localhost:3000/record-sales/sales-logs");
  await page.getByRole("searchbox", { name: "Select warehouse" }).click();
  await page.getByRole("option", { name: "DR Automated WH1" }).click();
  await page.getByRole("cell", { name: invoiceID, exact: true }).click();
});
