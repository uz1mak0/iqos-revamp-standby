import { expect, test } from "@playwright/test";

/**
 *
 */
test("PULLOUT: Batch does not have inventory", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=PULLOUT_1683175348338&warehouse=PH00&transaction=pullout",
  );
  await page.getByPlaceholder("Enter Remarks").click();
  await page.getByPlaceholder("Enter Remarks").fill("test for selling");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("0001");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("testxxxx");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
});

/**
 *
 */
test("PULLOUT: Scan invalid GTIN", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=PULLOUT_1683175348338&warehouse=PH00&transaction=pullout",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("testssssssss");
  await page.getByPlaceholder("Enter Batch ID").fill("t");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-SKU/GTIN not found").click();
});

/**
 *
 */
test("PULLOUT: Scan HEETS/Accessories GTIN with existing batch ID", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=PULLOUT_1683175348338&warehouse=PH00&transaction=pullout",
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
test("PULLOUT: Scan GTIN without batch ID", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=PULLOUT_1683175348338&warehouse=PH00&transaction=pullout",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("0001");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByText("Please add batch ID").click();
});

/**
 *
 */
test("PULLOUT: Exceed line item quantity", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=PULLOUT_1683175348338&warehouse=PH00&transaction=pullout",
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

/**
 *
 */
test("PULLOUT: Enter negative quantity on line item", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=PULLOUT_1683175348338&warehouse=PH00&transaction=pullout",
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

/**
 *
 */
test("PULLOUT: Scan device using serial", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=PULLOUT_1683175348338&warehouse=PH00&transaction=pullout",
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
test("PULLOUT: Scan device using CODENTIFY", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=PULLOUT_1683175348338&warehouse=PH00&transaction=pullout",
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
test("PULLOUT: Device already scanned", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=PULLOUT_1683175348338&warehouse=PH00&transaction=pullout",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621AUTOMATED000240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED000 scan success")
    .click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621AUTOMATED000240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-AUTOMATED000 already scanned")
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
test("PULLOUT: Device not from warehouse", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=PULLOUT_1683175348338&warehouse=PH00&transaction=pullout",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("NU5H14WG1133");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-Serial is not from this warehouse")
    .click();
});
