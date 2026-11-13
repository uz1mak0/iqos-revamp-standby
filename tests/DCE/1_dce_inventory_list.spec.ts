import { expect, test } from "@playwright/test";

const selectedGTIN = "ZYN0003";
/**
 * NOTE: Make sure all this GTINs initial DCE status is LIVE/UNBLOCKED!
 */
const multipleGTIN = ["ZYN0003", "ZYN0007", "ZYN0004", "ZYN0001"];

/**
 * Checked if switch is working for single items
 */
test("DCE: Change individual DCE status", async ({ page }) => {
  await page.goto("http://localhost:3000/inventory/dce/");
  await expect(
    page.getByRole("button", { name: "Remove Stocks" }),
  ).toBeDisabled();
  await expect(page.getByRole("button", { name: "Add Stocks" })).toBeDisabled();
  await page.getByTestId(`${selectedGTIN}-UNBLOCKED`).click();
});

/**
 * Checked if multiple selected items can be add/remove
 */
test("DCE: Select multiple items", async ({ page }) => {
  await page.goto("http://localhost:3000/inventory/dce/");
  await page.getByTestId("ZYN0003-UNBLOCKED-checkbox").click();
  await page.getByTestId("ZYN0007-UNBLOCKED-checkbox").click();
  await page.getByTestId("4800000000001-UNBLOCKED-checkbox").click();
  await expect(
    page.getByRole("button", { name: "Remove Stocks" }),
  ).toBeEnabled();
  await expect(page.getByRole("button", { name: "Add Stocks" })).toBeEnabled();
});

/**
 * Change/Update DCE status of single item
 * Change/Edit selectedGTIN value for testing specific GTIN
 */
test("DCE: Change single item status from LIVE to BLOCKED vise versa", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/inventory/dce/");
  await page.getByTestId(`${selectedGTIN}-UNBLOCKED`).click();
  await page.getByRole("button", { name: "Yes" }).click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-DCE Status changed").click();
  await page.getByTestId(`${selectedGTIN}-BLOCKED`).isVisible();

  await page.getByTestId(`${selectedGTIN}-BLOCKED`).click();
  await page.getByRole("button", { name: "Yes" }).click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-DCE Status changed").click();
  await page.getByTestId(`${selectedGTIN}-UNBLOCKED`).isVisible();
});

/**
 * Change/Update DCE status of multiple items
 * Change/Edit multipleGTIN value for testing specific GTINs
 * Note: Only 4 items can be selected/edited for testing
 */
test("DCE: Change multiple item status from LIVE to BLOCKED vise versa", async ({
  page,
}, testInfo) => {
  await page.goto("http://localhost:3000/inventory/dce/");
  testInfo.setTimeout(0);
  await page.getByTestId(`${multipleGTIN[0]}-UNBLOCKED-checkbox`).click();
  await page.getByTestId(`${multipleGTIN[1]}-UNBLOCKED-checkbox`).click();
  await page.getByTestId(`${multipleGTIN[2]}-UNBLOCKED-checkbox`).click();
  await page.getByTestId(`${multipleGTIN[3]}-UNBLOCKED-checkbox`).click();

  await page.getByRole("button", { name: "Remove Stocks" }).click();
  await page.getByRole("button", { name: "Yes" }).click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-DCE Status changed").click();

  await page.getByTestId(`${multipleGTIN[0]}-BLOCKED`).isVisible();
  await page.getByTestId(`${multipleGTIN[1]}-BLOCKED`).isVisible();
  await page.getByTestId(`${multipleGTIN[2]}-BLOCKED`).isVisible();
  await page.getByTestId(`${multipleGTIN[3]}-BLOCKED`).isVisible();

  await page.getByTestId(`${multipleGTIN[0]}-BLOCKED-checkbox`).click();
  await page.getByTestId(`${multipleGTIN[1]}-BLOCKED-checkbox`).click();
  await page.getByTestId(`${multipleGTIN[2]}-BLOCKED-checkbox`).click();
  await page.getByTestId(`${multipleGTIN[3]}-BLOCKED-checkbox`).click();

  await page.getByRole("button", { name: "Add Stocks" }).click();
  await page.getByRole("button", { name: "Yes" }).click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-DCE Status changed").click();

  await page.getByTestId(`${multipleGTIN[0]}-UNBLOCKED`).isVisible();
  await page.getByTestId(`${multipleGTIN[1]}-UNBLOCKED`).isVisible();
  await page.getByTestId(`${multipleGTIN[2]}-UNBLOCKED`).isVisible();
  await page.getByTestId(`${multipleGTIN[3]}-UNBLOCKED`).isVisible();
});
