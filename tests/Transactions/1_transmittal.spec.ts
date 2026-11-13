import { expect, test } from "@playwright/test";

/**
 *
 */
test("TRANSMITTAL: Scan valid GTIN", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSMITTAL_1682309156&warehouse=PH00&transaction=transmittal",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("0001");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-0001 scan success").click();
  await page.getByTestId("remove-0001-test").getByRole("button").click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-0001 removed").click();
});

/**
 *
 */
test("TRANSMITTAL: Scan valid codentify", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSMITTAL_1682309156&warehouse=PH00&transaction=transmittal",
  );
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Enter Remarks").click();
  await page.getByPlaceholder("Enter Remarks").fill("test");
  await page.getByPlaceholder("Enter Invoice ID").click();
  await page.getByPlaceholder("Enter Invoice ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621TEST00000000240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-SUCCESS-CLOSE-TEST00000000 scan success")
    .click();
  await page
    .getByTestId("expand-4806504615476-test")
    .getByRole("button")
    .click();
  await page
    .getByTestId("remove-4806504615476-TEST00000000")
    .getByRole("button")
    .click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-TEST00000000 removed").click();
});

/**
 *
 */
test("TRANSMITTAL: Scan existing device", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSMITTAL_1682309156&warehouse=PH00&transaction=transmittal",
  );
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Enter Remarks").click();
  await page.getByPlaceholder("Enter Remarks").fill("test");
  await page.getByPlaceholder("Enter Invoice ID").click();
  await page.getByPlaceholder("Enter Invoice ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621FORTESTONLY0240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-FORTESTONLY0 not available")
    .click();
});

/**
 *
 */
test("TRANSMITTAL: Scan device already added", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSMITTAL_1682309156&warehouse=PH00&transaction=transmittal",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621FORTESTONLY1240DK002648.00");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-SUCCESS-CLOSE-FORTESTONLY1 scan success")
    .click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621FORTESTONLY1240DK002648.00");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("test2");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-FORTESTONLY1 already scanned")
    .click();
  await page
    .getByTestId("expand-4806504615476-test")
    .getByRole("button")
    .click();
  await page
    .getByTestId("remove-4806504615476-FORTESTONLY1")
    .getByRole("button")
    .click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-FORTESTONLY1 removed").click();
});

/**
 *
 */
test("TRANSMITTAL: Scan invalid GTIN", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSMITTAL_1682309156&warehouse=PH00&transaction=transmittal",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("nogtin");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-SKU/GTIN not found").click();
});

/**
 *
 */
test("TRANSMITTAL: GTIN without batch ID", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSMITTAL_1682309156&warehouse=PH00&transaction=transmittal",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("0001");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByText("Please add batch ID").click();
});

/**
 *
 */
test("TRANSMITTAL: Scan valid voucher", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSMITTAL_1682309156&warehouse=PH00&transaction=transmittal",
  );
  await page.getByLabel("Voucher").check();
  await page.getByPlaceholder("Scan Voucher Code").click();
  await page.getByPlaceholder("Scan Voucher Code").fill("AUTOMATED");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan Voucher Code").click();
  await page.getByPlaceholder("Scan Voucher Code").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED scan success").click();
  await page.getByTestId("expand-LVC-test").getByRole("button").click();
  await page.getByTestId("remove-LVC-AUTOMATED").getByRole("button").click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED removed").click();
});

/**
 *
 */
test("TRANSMITTAL: Scan voucher without batch ID", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSMITTAL_1682309156&warehouse=PH00&transaction=transmittal",
  );
  await page.getByLabel("Voucher").check();
  await page.getByPlaceholder("Scan Voucher Code").click();
  await page.getByPlaceholder("Scan Voucher Code").fill("AUTOMATED");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("");
  await page.getByPlaceholder("Scan Voucher Code").click();
  await page.getByPlaceholder("Scan Voucher Code").press("Enter");
  await page.getByText("Please add batch ID").click();
});

/**
 *
 */
test("TRANSMITTAL: Scan voucher already added", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSMITTAL_1682309156&warehouse=PH00&transaction=transmittal",
  );
  await page.getByLabel("Voucher").check();
  await page.getByPlaceholder("Scan Voucher Code").click();
  await page.getByPlaceholder("Scan Voucher Code").fill("AUTOMATED");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan Voucher Code").click();
  await page.getByPlaceholder("Scan Voucher Code").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED scan success").click();
  await page.getByPlaceholder("Scan Voucher Code").click();
  await page.getByPlaceholder("Scan Voucher Code").fill("AUTOMATED");
  await page.getByPlaceholder("Scan Voucher Code").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-AUTOMATED already scanned").click();
  await page.getByTestId("expand-LVC-test").getByRole("button").click();
  await page.getByTestId("remove-LVC-AUTOMATED").getByRole("button").click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED removed").click();
});
