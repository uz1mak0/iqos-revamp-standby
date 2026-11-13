import { expect, test } from "@playwright/test";

/**
 *
 */
// test("Return: Batch does not have inventory", async ({ page }, testInfo) => {
//   testInfo.setTimeout(testInfo.timeout + 60000);
//   await page.goto(
//     "http://localhost:3000/inventory/warehouse/transaction/?transactionId=RETURN_1692249956002&warehouse=PH00&transaction=return"
//   );
//   await page.getByPlaceholder("Enter Remarks").click();
//   await page.getByPlaceholder("Enter Remarks").fill("test for return");
//   await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
//   await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("0001");
//   await page.getByPlaceholder("Enter Batch ID").click();
//   await page.getByPlaceholder("Enter Batch ID").fill("testxxxx");
//   await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
//   await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
//   await expect(page.locator(':text("Batch does not exist")')).toBeVisible();
// });

test("RETURN: Scan invalid GTIN", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=RETURN_1692249956002&warehouse=PH00&transaction=return",
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
test("RETURN: Scan HEETS/Accessories GTIN with existing batch ID", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=RETURN_1692249956002&warehouse=PH00&transaction=return",
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
test("RETURN: Scan GTIN without batch ID", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=RETURN_1692249956002&warehouse=PH00&transaction=return",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("0001");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByText("Please add batch ID").click();
});

/**
 *
 */
// test("RETURN: Exceed line item quantity", async ({ page }, testInfo) => {
//   testInfo.setTimeout(testInfo.timeout + 60000);
//   await page.goto(
//     "http://localhost:3000/inventory/warehouse/transaction/?transactionId=RETURN_1692249956002&warehouse=PH00&transaction=return"
//   );
//   await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
//   await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("0001");
//   await page.getByPlaceholder("Enter Batch ID").click();
//   await page.getByPlaceholder("Enter Batch ID").fill("test");
//   await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
//   await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
//   await expect(page.locator(':text("0001 scan success")')).toBeVisible();
//   await page.getByTestId("display-0001-test").click();
//   await page.getByPlaceholder("Enter Qty").fill("100000");
//   await page.getByRole("cell", { name: "HEETS" }).click();
//   await expect(
//     page.locator(':text("Batch does not have enough inventory")')
//   ).toBeVisible();
//   await page.getByTestId("remove-0001-test").getByRole("button").click();
//   await expect(page.locator(':text("0001 removed")')).toBeVisible();
// });

/**
 *
 */
test("RETURN: Enter negative quantity on line item", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=RETURN_1692249956002&warehouse=PH00&transaction=return",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("0001");
  await page.getByPlaceholder("Enter Batch ID").click();
  await page.getByPlaceholder("Enter Batch ID").fill("test");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-0001 scan success").click();
  await page.getByTestId("display-0001-test").click();
  await page.getByPlaceholder("Enter Qty").fill("-1");
  await page.getByRole("cell", { name: "HEETS" }).click();
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid Qty value").click();
  await page.getByTestId("remove-0001-test").getByRole("button").click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-0001 removed").click();
});

/**
 *
 */
test("RETURN: Scan device using serial", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=RETURN_1692249956002&warehouse=PH00&transaction=return",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("AUTOMATED008");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED008 scan success")
    .click();
  await page
    .getByTestId("expand-4806504615476-test")
    .getByRole("button")
    .click();
  await page
    .getByTestId("remove-4806504615476-AUTOMATED008")
    .getByRole("button")
    .click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED008 removed").click();
});

/**
 *
 */
test("RETURN: Scan device using CODENTIFY", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=RETURN_1692249956002&warehouse=PH00&transaction=return",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621AUTOMATED008240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED008 scan success")
    .click();
  await page
    .getByTestId("expand-4806504615476-test")
    .getByRole("button")
    .click();
  await page
    .getByTestId("remove-4806504615476-AUTOMATED008")
    .getByRole("button")
    .click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED008 removed").click();
});

/**
 *
 */
test("RETURN: Device already scanned", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=RETURN_1692249956002&warehouse=PH00&transaction=return",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621AUTOMATED008240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED008 scan success")
    .click();
  await page
    .getByTestId("expand-4806504615476-test")
    .getByRole("button")
    .click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page
    .getByPlaceholder("Scan CODENTIFY or GTIN")
    .fill("010480650461547621AUTOMATED008240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-AUTOMATED008 already scanned")
    .click();
  await page
    .getByTestId("remove-4806504615476-AUTOMATED008")
    .getByRole("button")
    .click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED008 removed").click();
});

/**
 *
 */
test("RETURN: Device not from warehouse", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=RETURN_1692249956002&warehouse=PH00&transaction=return",
  );
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").click();
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").fill("NU5H14WG1133");
  await page.getByPlaceholder("Scan CODENTIFY or GTIN").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-Serial is not from this warehouse")
    .click();
});
