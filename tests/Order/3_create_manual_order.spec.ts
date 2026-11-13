import { test } from "@playwright/test";
var random = require("random-name");
test.use({ storageState: "./tests-auth/auth.json" });

const customOrderID =
  "MANUALORDER" + parseInt(`${new Date().getTime() / 1000}`);

test("MANUAL ORDER: Submit Manual order with empty fields", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/order-management/");
  await page.getByRole("button", { name: "Create Order" }).click();
  await page.getByRole("button", { name: "Submit" }).click();
  await page
    .getByTestId("NOTIF-ERROR-CLOSE-Please fill up required fields!")
    .click();
});

test("MANUAL ORDER: Create order without line items", async ({
  page,
}, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/order-management/");
  await page.getByRole("button", { name: "Create Order" }).click();
  await page.getByTestId("TEST-SELECT-WH").click();
  await page
    .getByRole("option", { name: "Automated Warehouse", exact: true })
    .click();
  await page.getByPlaceholder("Enter order ID").click();
  await page.getByPlaceholder("Enter order ID").fill(customOrderID);
  await page.getByPlaceholder("Enter customer name").click();
  await page
    .getByPlaceholder("Enter customer name")
    .fill(`${random.first()} ${random.last()}`);
  await page.getByPlaceholder("Select salutation").click();
  await page.getByRole("option", { name: "Mr." }).click();
  await page.getByPlaceholder("Enter first name").click();
  await page.getByPlaceholder("Enter first name").fill(`${random.first()}`);
  await page.getByPlaceholder("Enter last name").click();
  await page.getByPlaceholder("Enter last name").fill(`${random.last()}`);
  await page.getByPlaceholder("Enter company name").click();
  await page.getByPlaceholder("Enter company name").fill(`${random.place()}`);
  await page.getByPlaceholder("09xxxxxxxxx").click();
  await page.getByPlaceholder("09xxxxxxxxx").fill("09999999999");
  await page.getByPlaceholder("Enter email").click();
  await page.getByPlaceholder("Enter email").fill("email@email.com");
  await page.getByPlaceholder("Enter street").click();
  await page.getByPlaceholder("Enter street").fill(`${random.place()}`);
  await page.getByPlaceholder("Enter building").click();
  await page.getByPlaceholder("Enter building").fill(`${random.place()}`);
  await page.getByPlaceholder("Enter address extension").click();
  await page
    .getByPlaceholder("Enter address extension")
    .fill(`${random.place()}`);
  await page.getByPlaceholder("Select region").click();
  await page
    .getByRole("option", { name: "NCR : National Capital Region" })
    .click();
  await page.getByTestId("TEST-CREATE-ORDER-SELECT-SKU").click();
  await page.getByRole("option", { name: "Metro Manila" }).click();
  await page.getByPlaceholder("Select city").click();
  await page.getByRole("option", { name: "Pasig" }).click();
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByTestId("NOTIF-ERROR-CLOSE-Please add line items!").click();
});

test("Manual ORDER: Create Manual Order", async ({ page }, testInfo) => {
  testInfo.setTimeout(0);
  await page.goto("http://localhost:3000/order-management/");
  await page.getByRole("button", { name: "Create Order" }).click();
  await page.getByTestId("TEST-SELECT-WH").click();
  await page
    .getByRole("option", { name: "Automated Warehouse", exact: true })
    .click();
  await page.getByTestId("TEST-SELECT-SKU").click();
  await page.getByTestId("TEST-SELECT-SKU").fill("HEETS");
  await page
    .getByRole("option", { name: "0000048044158 - HEETS Amber Selection Pack" })
    .click();
  await page.getByPlaceholder("Enter order ID").click();
  await page.getByPlaceholder("Enter order ID").fill(customOrderID);
  await page.getByPlaceholder("Enter customer name").click();
  await page
    .getByPlaceholder("Enter customer name")
    .fill(`${random.first()} ${random.last()}`);
  await page.getByPlaceholder("Select salutation").click();
  await page.getByRole("option", { name: "Mr." }).click();
  await page.getByPlaceholder("Enter first name").click();
  await page.getByPlaceholder("Enter first name").fill(`${random.first()}`);
  await page.getByPlaceholder("Enter last name").click();
  await page.getByPlaceholder("Enter last name").fill(`${random.last()}`);
  await page.getByPlaceholder("Enter company name").click();
  await page.getByPlaceholder("Enter company name").fill(`${random.place()}`);
  await page.getByPlaceholder("09xxxxxxxxx").click();
  await page.getByPlaceholder("09xxxxxxxxx").fill("09999999999");
  await page.getByPlaceholder("Enter email").click();
  await page.getByPlaceholder("Enter email").fill("email@email.com");
  await page.getByPlaceholder("Enter street").click();
  await page.getByPlaceholder("Enter street").fill(`${random.place()}`);
  await page.getByPlaceholder("Enter building").click();
  await page.getByPlaceholder("Enter building").fill(`${random.place()}`);
  await page.getByPlaceholder("Enter address extension").click();
  await page
    .getByPlaceholder("Enter address extension")
    .fill(`${random.place()}`);
  await page.getByPlaceholder("Select region").click();
  await page
    .getByRole("option", { name: "NCR : National Capital Region" })
    .click();
  await page.getByTestId("TEST-CREATE-ORDER-SELECT-SKU").click();
  await page.getByRole("option", { name: "Metro Manila" }).click();
  await page.getByPlaceholder("Select city").click();
  await page.getByRole("option", { name: "Pasig" }).click();
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByTestId("NOTIF-INFO-CLOSE-[object Object]").click();
  await page.getByTestId("TEST-SEARCH-ORDER").click();
  await page.getByTestId("TEST-SEARCH-ORDER").fill(customOrderID);
  await page.getByTestId("TEST-SEARCH-ORDER").press("Enter");
  await page
    .getByRole("heading", { name: `Order Tracking - ${customOrderID}` })
    .click();
});
