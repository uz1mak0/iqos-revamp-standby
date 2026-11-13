import { test, expect } from "@playwright/test";

test("RECEIVABLE: Scan correct device and GTIN", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1683271011442&warehouse=PH010&transaction=transfer",
  );
  await page
    .getByTestId("expand-4806504615476-test")
    .getByRole("button")
    .click();
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").click();
  await page
    .getByPlaceholder("Scan CODENTIFY/GTIN receive")
    .fill("010480650461547621AUTOMATED004240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").press("Enter");
  await page
    .getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED004 scan success")
    .click();
  await page.waitForTimeout(2000);
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").click();
  await page
    .getByPlaceholder("Scan CODENTIFY/GTIN receive")
    .fill("010480650461547621AUTOMATED005240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").press("Enter");
  await page
    .getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED005 scan success")
    .click();
  await page.waitForTimeout(2000);
  await page.getByTestId("receieved-0001-AUTOMATED").click();
  await page.getByTestId("qty-0001-AUTOMATED").click();
  await page.getByPlaceholder("Enter Qty").fill("10");
  await page.getByRole("cell", { name: "HEETS" }).click();
  await page
    .getByTestId("remove-4806504615476-AUTOMATED004")
    .getByRole("button")
    .click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED004 removed").click();

  await page.waitForTimeout(1000);
  await page
    .getByTestId("remove-4806504615476-AUTOMATED005")
    .getByRole("button")
    .click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED005 removed").click();
  await page.waitForTimeout(1000);
  await page.getByTestId("receieved-0001-AUTOMATED").click();
  await page.getByPlaceholder("Enter Qty").fill("0");
  await page.getByRole("cell", { name: "HEETS" }).click();
  await page.waitForTimeout(1000);
});

/**
 *
 */
test("RECEIVABLE: Already scanned device", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1683271011442&warehouse=PH010&transaction=transfer",
  );
  await page.getByRole("cell", { name: "4806504615476" }).click();
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").click();
  await page
    .getByPlaceholder("Scan CODENTIFY/GTIN receive")
    .fill("AUTOMATED005");
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").press("Enter");
  await page
    .getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED005 scan success")
    .click();
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").click();
  await page
    .getByPlaceholder("Scan CODENTIFY/GTIN receive")
    .fill("AUTOMATED005");
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").press("Enter");
  await page.getByText("already scanned").click();
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-AUTOMATED005 already scanned")
    .click();
  await page
    .getByTestId("remove-4806504615476-AUTOMATED005")
    .getByRole("button")
    .click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-AUTOMATED005 removed").click();
});

/**
 *
 */
test("RECEIVABLE: Scan invalid GTIN", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1683271011442&warehouse=PH010&transaction=transfer",
  );
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").click();
  await page
    .getByPlaceholder("Scan CODENTIFY/GTIN receive")
    .fill("NOTGTINTEST");
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-SKU/GTIN not found").click();
});

/**
 *
 */
test("RECEIVABLE: Scan invalid serial/Codentify", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1683271011442&warehouse=PH010&transaction=transfer",
  );
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").click();
  await page
    .getByPlaceholder("Scan CODENTIFY/GTIN receive")
    .fill("AUTOMATED003");
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid serial scanned").click();
  await page.waitForTimeout(2000);
  await page
    .getByPlaceholder("Scan CODENTIFY/GTIN receive")
    .fill("010480650461547621AUTOMATED003240DK002648.00");
  await page.getByPlaceholder("Scan CODENTIFY/GTIN receive").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid serial scanned").click();
});

/**
 *
 */
test("RECEIVABLE: Exceed line item quantity", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1683271011442&warehouse=PH010&transaction=transfer",
  );
  await page.getByTestId("receieved-0001-AUTOMATED").click();
  await page.getByPlaceholder("Enter Qty").fill("01000");
  await page.getByRole("cell", { name: "HEETS" }).click();
  await page
    .getByTestId(
      "NOTIF-ERROR-CLOSE-Entered receive quantity is greater than expected",
    )
    .click();
  await page.waitForTimeout(3000);
});

/**
 *
 */
test("RECEIVABLE: Enter negative quantity on line item", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/inventory/warehouse/transaction/?transactionId=TRANSFER_1683271011442&warehouse=PH010&transaction=transfer",
  );
  await page.getByTestId("receieved-0001-AUTOMATED").click();
  await page.getByPlaceholder("Enter Qty").fill("-1");
  await page.getByRole("cell", { name: "HEETS" }).click();
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid receive quantiy").click();
  await page.waitForTimeout(3000);
});
