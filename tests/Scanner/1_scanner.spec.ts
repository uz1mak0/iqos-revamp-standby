import { expect, test } from "@playwright/test";

/**
 *
 */
test("SCANNER: Scan using CODENTIFY", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/inventory/scanner/", {
    waitUntil: "domcontentloaded",
  });
  await page.getByPlaceholder("Enter CODENTIFY or Serial").click();
  await page
    .getByPlaceholder("Enter CODENTIFY or Serial")
    .fill("010\t480650461547621FORTESTONLY0240DK002648.00");
  await page.getByPlaceholder("Enter CODENTIFY or Serial").click();
  await page.getByPlaceholder("Enter CODENTIFY or Serial").press("Enter");
  await page
    .getByRole("row", { name: "id FORTESTONLY0" })
    .getByRole("cell", { name: "FORTESTONLY0" })
    .click();
});

/**
 *
 */
test("SCANNER: Scan using SERIAL", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/inventory/scanner/", {
    waitUntil: "domcontentloaded",
  });
  await page.getByPlaceholder("Enter CODENTIFY or Serial").click();
  await page.getByPlaceholder("Enter CODENTIFY or Serial").fill("FORTESTONLY0");
  await page.getByPlaceholder("Enter CODENTIFY or Serial").click();
  await page.getByPlaceholder("Enter CODENTIFY or Serial").press("Enter");
  await page
    .getByRole("row", { name: "id FORTESTONLY0" })
    .getByRole("cell", { name: "FORTESTONLY0" })
    .click();
});

/**
 *
 */
test("SCANNER: Scan invalid CODENTIFY/SERIAL", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/inventory/scanner/", {
    waitUntil: "domcontentloaded",
  });
  await page.getByPlaceholder("Enter CODENTIFY or Serial").click();
  await page
    .getByPlaceholder("Enter CODENTIFY or Serial")
    .fill("TESTCODENTIFYSERIAL");
  await page.getByPlaceholder("Enter CODENTIFY or Serial").press("Enter");
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-TESTCODENTIFYSERIAL not found")
    .click();
});

/**
 *
 */
test("SCANNER: Scan empty CODENTIFY/SERIAL", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/inventory/scanner/", {
    waitUntil: "domcontentloaded",
  });
  await page.getByPlaceholder("Enter CODENTIFY or Serial").click();
  await page.getByPlaceholder("Enter CODENTIFY or Serial").press("Enter");
  await page.getByText("Please add CODENTIFY/Serial").click();
});
