import { expect, test } from "@playwright/test";

/**
 *
 */
test("TRANSFER: Scan device using codentify", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1682666423847&warehouse=PH00&transaction=transfer",
    { waitUntil: "domcontentloaded" },
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621AUTOMATED000240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED000 scan success")
    .click();
  await page
    .getByTestId("expand-4806504615476-AUTOMATED")
    .getByRole("button")
    .click();
  await page
    .getByTestId("remove-4806504615476-AUTOMATED000")
    .getByRole("button")
    .click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED000 removed").click();
});

/**
 *
 */
test("TRANSFER: Scan device using serial", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1682666423847&warehouse=PH00&transaction=transfer",
    { waitUntil: "domcontentloaded" },
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("AUTOMATED000");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED000 scan success")
    .click();
  await page
    .getByTestId("expand-4806504615476-AUTOMATED")
    .getByRole("button")
    .click();
  await page
    .getByTestId("remove-4806504615476-AUTOMATED000")
    .getByRole("button")
    .click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED000 removed").click();
});

/**
 *
 */
test("TRANSFER: Scan heets/accessories using valid GTIN", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1682666423847&warehouse=PH00&transaction=transfer",
    { waitUntil: "domcontentloaded" },
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("0001");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("AUTOMATED");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-0001 scan success").click();
  await page.getByTestId("remove-0001-AUTOMATED").getByRole("button").click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-0001 removed").click();
});

/**
 *
 */
test("TRANSFER: Scan invalid GTIN/Serial", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1682666423847&warehouse=PH00&transaction=transfer",
    { waitUntil: "domcontentloaded" },
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("AUTOMATED00Z");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByText("Please add batch ID").click();
});

/**
 *
 */
test("TRANSFER: Scanning codentify does not belong to the warehouse", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1682666423847&warehouse=PH00&transaction=transfer",
    { waitUntil: "domcontentloaded" },
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621AUTOMATED00Z240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-Serial is not from this warehouse")
    .click();
});

/**
 *
 */
test("TRANSFER: Scan unavailable device using serial", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1682666423847&warehouse=PH00&transaction=transfer",
    { waitUntil: "domcontentloaded" },
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("AUTOMATED003");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-AUTOMATED003 not available")
    .click();
});

/**
 *
 */
test("TRANSFER: Scan unavailable device using codentify", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1682666423847&warehouse=PH00&transaction=transfer",
    { waitUntil: "domcontentloaded" },
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621AUTOMATED003240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-AUTOMATED003 not available")
    .click();
});

/**
 *
 */
test("TRANSFER: Exceed line item quantity", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1682666423847&warehouse=PH00&transaction=transfer",
    { waitUntil: "domcontentloaded" },
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("0001");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("AUTOMATED");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-0001 scan success").click();
  await page.getByTestId("display-0001-AUTOMATED").click();
  await page.getByPlaceholder("Enter Qty").fill("1000");
  await page.getByRole("cell", { name: "HEETS" }).click();
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-Batch does not have enough inventory")
    .click();
  await page.getByTestId("remove-0001-AUTOMATED").getByRole("button").click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-0001 removed").click();
});

test("TRANSFER: Enter negative quantity on line item", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1682666423847&warehouse=PH00&transaction=transfer",
    { waitUntil: "domcontentloaded" },
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("0001");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("AUTOMATED");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-0001 scan success").click();
  await page.getByTestId("display-0001-AUTOMATED").click();
  await page.getByPlaceholder("Enter Qty").fill("-1");
  await page.getByRole("cell", { name: "HEETS" }).click();
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid Qty value").click();
  await page.getByTestId("remove-0001-AUTOMATED").getByRole("button").click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-0001 removed").click();
});
