import { expect, test } from "@playwright/test";
test.use({ storageState: "./tests-auth/drauth.json" });

test("TRANSMITTAL: Scan GTIN with .00 format", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSMITTAL_1682309156&warehouse=PH00&transaction=transmittal",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("4806504616794.00");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid GTIN format").click();
});

test("PULLOUT: Scan GTIN with .00 format", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=PULLOUT_1683175348338&warehouse=PH00&transaction=pullout",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("4806504616794.00");
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid GTIN format").click();
});

test("TRANSFER: Scan GTIN with .00 format", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1682666423847&warehouse=PH00&transaction=transfer",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("4806504616794.00");
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid GTIN format").click();
});

test("RETURN: Scan GTIN with .00 format", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=RETURN_1692249956002&warehouse=PH00&transaction=return",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("4806504616794.00");
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid GTIN format").click();
});

test("DIRECT TRANSFER: Scan GTIN with .00 format", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=DIRECT_TRANSFER_1710141310257&warehouse=PH00&transaction=direct_transfer",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("4806504616794.00");
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid GTIN format").click();
});
