import { Page } from "@playwright/test";
var random = require("random-name");
import dayjs from "dayjs";

const GTDevices = ["BONDS", "IQOS ORIGINALS", "IQOS 3.0", "IQOS 2.4"];
export const randomGTDeviceType =
  GTDevices[Math.floor(Math.random() * GTDevices.length)];

export const recordSalesForm = async (page: Page) => {
  await page.goto("http://localhost:3000/record-sales/");
  await page.getByPlaceholder("Select Warehouse").click();
  await page.getByRole("option", { name: "DR Automated WH1" }).click();
  await page.getByPlaceholder("Enter Invoice ID").click();
  await page
    .getByPlaceholder("Enter Invoice ID")
    .fill(`TEST-${dayjs().unix()}`);
  await page.getByPlaceholder("Enter CEGID No").click();
  await page.getByPlaceholder("Enter CEGID No").fill("cegid");
  await page.getByPlaceholder("Enter Remarks").click();
  await page.getByPlaceholder("Enter Remarks").fill("remarks");
  await page.getByPlaceholder("Select Sales Expert").click();
  await page.getByRole("option", { name: "test_user_111" }).click();
  await page.getByPlaceholder("Select Payment Type").click();
  await page.getByRole("option", { name: "Direct Debit" }).click();
  await page.getByPlaceholder("Add notes").click();
  await page.getByPlaceholder("Add notes").fill(`Notes ${random.place()}`);
  await page.getByPlaceholder("Select Lead Source").click();
  await page.getByRole("option", { name: "Walk-in" }).click();
};

export const guidedTrialForm = async (page: Page) => {
  await page.goto("http://localhost:3000/record-sales/guided-trial/");
  await page.getByPlaceholder("Select Warehouse").click();
  await page.getByRole("option", { name: "DR Automated WH1" }).click();
  await page.getByPlaceholder("Select GT device").click();
  await page.getByRole("option", { name: randomGTDeviceType }).click();
};
