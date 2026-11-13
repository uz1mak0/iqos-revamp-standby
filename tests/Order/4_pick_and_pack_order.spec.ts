import { test } from "@playwright/test";
var random = require("random-name");
test.use({ storageState: "./tests-auth/auth.json" });

const testOrderID = "AUTOMATEDTESTORDER";
const gtinScanList = [
  "LP02",
  "5410706851458",
  "4806504615261",
  "4806504615292",
  "4806504615285",
  "010480650461509421AUTOPP00DONT240DK001210.00",
];

const invalidGTIN = "0000000000";
const invalidCodentify = "010480650461509421AUTOPP000007240DK001210.00";

test("ORDER Pick & Pack: Scan all line items", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/order-management/order-details/orderID/?orderID=AUTOMATEDTESTORDER",
  );
  await page
    .getByRole("heading", { name: `Order Tracking - ${testOrderID}` })
    .click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[0]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[1]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[2]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[3]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[4]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[5]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
});

test("ORDER Pick & Pack: Scan item already exceeded", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/order-management/order-details/orderID/?orderID=AUTOMATEDTESTORDER",
  );
  await page
    .getByRole("heading", { name: `Order Tracking - ${testOrderID}` })
    .click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[0]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[0]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page
    .getByTestId("NOTIF-INFO-CLOSE-Scanned quantity already exceeded")
    .click();
});

test("ORDER Pick & Pack: Scan invalid GTIN/Codentify", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/order-management/order-details/orderID/?orderID=AUTOMATEDTESTORDER",
  );
  await page
    .getByRole("heading", { name: `Order Tracking - ${testOrderID}` })
    .click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(invalidGTIN);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid GTIN/Codentify").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(invalidCodentify);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Serial already scanned").click();
});

test("ORDER Pick & Pack: Save then void", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/order-management/order-details/orderID/?orderID=AUTOMATEDTESTORDER",
  );
  await page
    .getByRole("heading", { name: `Order Tracking - ${testOrderID}` })
    .click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[0]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[1]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[2]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[3]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[4]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill(gtinScanList[5]);
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SAVE").click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Pick & Pack saved").click();
  await page.getByTestId("TEST-PICKANDPACK-VOID").click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item void success").click();
});

test("ORDER Pick & Pack: Scan non GTIN items with multiple quantity", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto(
    "http://localhost:3000/order-management/order-details/orderID/?orderID=AUTOMATEDTESTORDER1",
  );
  await page
    .getByRole("heading", { name: `Order Tracking - ${"AUTOMATEDTESTORDER1"}` })
    .click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill("0000048044141");
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill("0000048044141");
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill("0000048044141");
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill("0000048044141");
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SCAN").fill("0000048044141");
  await page.getByTestId("TEST-PICKANDPACK-SCAN").press("Enter");
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item scan success").click();
  await page.getByTestId("TEST-PICKANDPACK-SAVE").click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Pick & Pack saved").click();
  await page.getByTestId("TEST-PICKANDPACK-VOID").click();
  await page.getByTestId("NOTIF-SUCCESS-CLOSE-Item void success").click();
});
