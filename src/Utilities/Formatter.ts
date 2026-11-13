import dayjs from "dayjs";
import { ORDER } from "../GraphQL";
export const formatSalutation = (salutation: any) => {
  switch (salutation) {
    case "0001":
      return "MRS.";
    case "0002":
      return "MR.";
    case "0003":
      return "Company";
    default:
      return "";
  }
};
export const formatCustomerName = (
  record:
    | ORDER.Maybe<ORDER.BillingAddress>
    | undefined
    | ORDER.Maybe<ORDER.ShippingAddress>,
) => {
  const salute = formatSalutation(record?.salutation) || "";
  const first_name = record?.first_name;
  const last_name = record?.last_name;
  return salute + " " + first_name + " " + last_name;
};

export const formatCustomerAddress = (
  record:
    | ORDER.Maybe<ORDER.BillingAddress>
    | undefined
    | ORDER.Maybe<ORDER.ShippingAddress>,
) => {
  var street = record?.street || "";
  var city = record?.city || "";
  var region = record?.region || "";
  return street + " " + city + " " + region;
};

export const formatCustomerDiscount = (
  record: ORDER.Maybe<ORDER.Maybe<ORDER.Discount>[]> | undefined | null,
) => {
  var discounts: string[] = [];
  record?.map((discount: ORDER.Maybe<ORDER.Discount>) => {
    if (discount?.discount_description)
      discounts.push(discount?.discount_description);
  });
  return discounts;
};

export const getReturnSerials = (order: ORDER.Maybe<ORDER.Order>) => {
  var set: string[] = [];
  var serials: ORDER.Maybe<string | undefined>[] = [];
  order?.items?.map((item) => {
    if (item?.inventory_items && item.inventory_items.length > 0) {
      if (item.inventory_items) {
        item.inventory_items.map((item) => {
          serials.push(item?.serial);
        });
        set.push(serials.join(", "));
      }
    }
  });
  return set.join("| ") || "-";
};

export const formatLendingOrderStatus = (record: any) => {
  var isComplete =
    record?.items?.filter((item: any) => {
      if (item?.scanned_quantity != null)
        return item?.scanned_quantity == item?.quantity;
      return true;
    })?.length == record?.items?.length;
  if (record?.order_status == "RETURNED") {
    return isComplete ? "COMPLETE" : "PARTIAL RETURN";
  }
  return record?.order_status;
};

export const formatCycleCount = (record: any) => {
  if (record?.inventory_items) {
    var cycle = record?.inventory_items?.[0]?.cycle + 1 || 1;
    if (cycle >= 20) {
      return `20th cycle FOR PULLOUT`;
    }
    return cycle;
  }
};

export const isRiderForCancel = (order: any) => {
  var return_users = ["kpuzon", "return", "Jvelez"];
  return (
    return_users.includes(order?.assigned_rider) ||
    order?.assigned_rider?.indexOf("cancel") >= 0
  );
};

export const formatOriginalGuidedTrialSchedule = (record: any) => {
  var date = record.original_guided_trial_schedule_date;
  date = date
    ? date
    : record?.guided_trial_schedule_date
    ? record?.guided_trial_schedule_date
    : undefined;
  var time = date
    ? dayjs(Number(record?.original_guided_trial_schedule_date)).format(
        "hh:mm A",
      )
    : record?.guided_trial_schedule_time
    ? dayjs(record?.guided_trial_schedule_time).format("hh:mm A")
    : "";
  if (date) return dayjs(Number(date)).format("MMM-DD-YYYY") + " " + time;
};

export const formatGuidedTrialSchedule = (record: any) => {
  var time = record?.guided_trial_schedule_time
    ? dayjs(
        `${dayjs().format("YYYY-MM-DD")} ${record?.guided_trial_schedule_time}`,
      ).format("hh:mm A")
    : "";
  if (record.guided_trial_schedule_date)
    return (
      dayjs(Number(record.guided_trial_schedule_date)).format("MMM-DD-YYYY") +
      " " +
      time
    );
};

export const formatLastDeliveryReason = (record: any) => {
  if (record?.order_status == "SHIPPED") {
    var lastIndex = record?.delivery_status_logs.length - 1;
    return record?.delivery_status_logs?.[lastIndex]?.undeliverable?.reason;
  }
};

export const isTabletMobileView = 995;

export const formatFileSize = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const formatProductionDate = (productCode: string) => {
  /*
    Production date start at 2020-01-01;
    The 5th character is the year number (0-9) where 0 = 2020, 1 = 2021, ..., 9 = 2029.
    The next 3 characters are the day number (001-366) of the year.
  */
  const yearNumber = productCode[4];
  const dayNumber = productCode.slice(5, 8);
  if (!dayNumber || isNaN(Number(dayNumber))) {
    return null;
  }
  return dayjs(`${2020 + Number(yearNumber)}-01-01`)
    .add(Number(dayNumber) - 1, "day")
    .toDate();
};

export const onScanProductCode = (product_code: string) => {
  const productCode = product_code.trim();
  const productionDate = formatProductionDate(productCode);
  if (productCode === "" || !productCode) return null;

  if (productCode.length != 10 || !productionDate) return null;

  return dayjs(productionDate).add(1, "year").toDate();
};
