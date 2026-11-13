import { test } from "@playwright/test";
test.use({ storageState: "./tests-auth/cscauth.json" });

test("CSC ORDER: Add HEETS and Devices then remove", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/order-management/");
  await page.getByRole("button", { name: "Create Order" }).click();
  await page.getByTestId("TEST-SELECT-SKU").click();
  await page.getByTestId("TEST-SELECT-SKU").fill("HEETS");
  await page
    .getByRole("option", { name: "0000048044141 - HEETS Green Selection Pack" })
    .click();
  await page.getByTestId("TEST-SELECT-SKU").fill("HEETS");
  await page
    .getByRole("option", { name: "0000048044103 - HEETS Purple Wave Pack" })
    .click();
  await page.getByTestId("TEST-SELECT-SKU").fill("HEETS");
  await page
    .getByRole("option", { name: "0000048044110 - HEETS Blue Selection Pack" })
    .click();
  await page.getByTestId("TEST-SELECT-SKU").fill("HEETS");
  await page
    .getByRole("option", {
      name: "0000048044127 - HEETS Yellow Selection Pack",
    })
    .click();
  await page.getByTestId("TEST-SELECT-SKU").fill("HEETS");
  await page
    .getByRole("option", {
      name: "0000048044134 - HEETS Bronze Selection Pack",
    })
    .click();
  await page.getByTestId("TEST-SELECT-SKU").fill("WARM");
  await page
    .getByRole("option", {
      name: "4806504615094 - IQOS 3.0 Duo Kit Warm White",
    })
    .click();
  await page.getByTestId("TEST-SELECT-SKU").fill("ILUMA");
  await page
    .getByRole("option", {
      name: "4806504616565 - KIT IQOS ILUMA ONE PEBBLE BEIGE OPK 1",
    })
    .click();
  await page.getByTestId("TEST-SELECT-SKU").fill("BONDS");
  await page
    .getByRole("option", {
      name: "4806504615735 - BONDS BY IQOS Kit Forest Green",
    })
    .click();
  await page.getByTestId("TEST-SELECT-SKU").fill("TEREA");
  await page
    .getByRole("option", { name: "48044493 - TEREA GREEN PACK" })
    .click();
  await page.getByTestId("TEST-SELECT-SKU").fill("HOLDER");
  await page
    .getByRole("option", {
      name: "4806504615490 - HOLDER IQOS ORIGINALS DUO SLATE",
    })
    .click();
  await page
    .getByTestId("TEST-ITEM-REMOVE-4806504615490")
    .getByRole("button")
    .click();
  await page
    .getByTestId("TEST-ITEM-REMOVE-48044493")
    .getByRole("button")
    .click();
  await page
    .getByTestId("TEST-ITEM-REMOVE-4806504615735")
    .getByRole("button")
    .click();
  await page
    .getByTestId("TEST-ITEM-REMOVE-4806504616565")
    .getByRole("button")
    .click();
  await page
    .getByTestId("TEST-ITEM-REMOVE-4806504615094")
    .getByRole("button")
    .click();
  await page
    .getByTestId("TEST-ITEM-REMOVE-0000048044134")
    .getByRole("button")
    .click();
  await page
    .getByTestId("TEST-ITEM-REMOVE-0000048044127")
    .getByRole("button")
    .click();
  await page
    .getByTestId("TEST-ITEM-REMOVE-0000048044110")
    .getByRole("button")
    .click();
  await page
    .getByTestId("TEST-ITEM-REMOVE-0000048044103")
    .getByRole("button")
    .click();
  await page
    .getByTestId("TEST-ITEM-REMOVE-0000048044141")
    .getByRole("button")
    .click();
  await page.getByRole("heading", { name: "TOTAL: 0" }).click();
});

test("CSC ORDER: Edit quantity and price", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/order-management/");
  await page.getByRole("button", { name: "Create Order" }).click();
  await page.getByTestId("TEST-SELECT-SKU").click();
  await page.getByTestId("TEST-SELECT-SKU").fill("HEETS");
  await page
    .getByRole("option", { name: "0000048044141 - HEETS Green Selection Pack" })
    .click();
  await page.getByTestId("TEST-ITEM-PRICE-0000048044141").click();
  await page.getByTestId("TEST-ITEM-PRICE-0000048044141").fill("1000");
  await page.getByTestId("TEST-ITEM-QTY-0000048044141").click();
  await page.getByTestId("TEST-ITEM-QTY-0000048044141").fill("1000");
  await page.getByTestId("TEST-SELECT-SKU").click();
  await page.getByTestId("TEST-SELECT-SKU").fill("IQOS");
  await page
    .getByRole("option", {
      name: "4806504616268 - KIT IQOS ILUMA PEBBLE BEIGE OPK 1",
    })
    .click();
  await page.getByTestId("TEST-ITEM-PRICE-4806504616268").click();
  await page.getByTestId("TEST-ITEM-PRICE-4806504616268").fill("1200");
  await page.getByTestId("TEST-ITEM-QTY-4806504616268").click();
  await page.getByTestId("TEST-ITEM-QTY-4806504616268").fill("100");
  await page.getByRole("heading", { name: "TOTAL: 1120000" }).click();
});

test("CSC ORDER: Edit quantity and price with negative value", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/order-management/");
  await page.getByRole("button", { name: "Create Order" }).click();
  await page.getByTestId("TEST-SELECT-SKU").click();
  await page.getByTestId("TEST-SELECT-SKU").fill("HEETS");
  await page
    .getByRole("option", { name: "0000048044141 - HEETS Green Selection Pack" })
    .click();
  await page.getByTestId("TEST-ITEM-PRICE-0000048044141").click();
  await page.getByTestId("TEST-ITEM-PRICE-0000048044141").fill("-1");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid Price").click();
  await page.getByTestId("TEST-ITEM-QTY-0000048044141").click();
  await page.getByTestId("TEST-ITEM-QTY-0000048044141").fill("-1");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid Quantity").click();
  await page.getByTestId("TEST-SELECT-SKU").click();
  await page.getByTestId("TEST-SELECT-SKU").fill("BONDS");
  await page
    .getByRole("option", {
      name: "4806504615711 - BONDS BY IQOS Kit Slate Grey",
    })
    .click();
  await page.getByTestId("TEST-ITEM-PRICE-4806504615711").click();
  await page.getByTestId("TEST-ITEM-PRICE-4806504615711").fill("-5");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid Price").click();
  await page.getByTestId("TEST-ITEM-QTY-4806504615711").click();
  await page.getByTestId("TEST-ITEM-QTY-4806504615711").fill("-9");
  await page.getByTestId("NOTIF-ERROR-CLOSE-Invalid Quantity").click();
  await page.getByRole("heading", { name: "TOTAL: 0" }).click();
});
