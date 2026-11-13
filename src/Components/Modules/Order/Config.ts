import { Maybe } from "graphql/jsutils/Maybe";
import { ORDER, WMS } from "../../../GraphQL";

export const shipmentType = [
  {
    label: "RIDER",
    value: "RIDER",
  },
  {
    label: "RIDER MARKETPLACE",
    value: "RIDER_MARKETPLACE",
  },
  {
    label: "THIRD PARTY",
    value: "THIRD_PARTY",
  },
];

export const getPaperBagSizes = ["SMALL", "LARGE"];

export const getCustomerSMSType = (order: any) => [
  {
    value: "IN_TRANSIT",
    label: "In Transit",
    message: `IQOS: Your IQOS order #${order?.order_id} is now being shipped.
Tracking https://iqos.activasia.com/delivery-tracking/order/?orderID=${order?.order_id}`,
  },
  {
    value: "IN_TRANSIT_MARKETPLACE",
    label: "In Transit Marketplace",
    message: `IQOS: Your IQOS order #${order?.order_id} is now being shipped.
Tracking https://iqos.activasia.com/delivery-tracking/order/?orderID=${order?.order_id}
        
Enjoy a hassle-free activation of your warranty upon receipt of your IQOS device when you create an account in http://iqos.buzz/phReg1 before delivery. IMPORTANT INFORMATION: IQOS is not risk-free and delivers nicotine, which is addictive.`,
  },
  {
    value: "REJECTED_VIOLATION",
    label: "Cancellation due to potential violation/fraud",
    message:
      order.payment_type === "COD"
        ? `Dear Customer. Unfortunately, your order with confirmation #${order?.order_id} has been rejected by our system as it goes against certain conditions/provisions of our General Terms and Conditions of Sale. Please check our Terms and Conditions to know more.

If you have questions regarding your order, please contact IQOS Sales Team. For other concerns, please contact IQOS Customer Care at Facebook.com/ph.iqos or #983838. Thank you!`
        : `Dear Customer. Unfortunately, your order with confirmation #${order?.order_id} has been rejected by our system as it goes against certain conditions/provisions of our General Terms and Conditions of Sale. Please check our Terms and Conditions to know more. Don’t worry though, as we will process your full refund - subject to issuing bank lead times.

If you have questions regarding your order, please contact IQOS Sales Team. For other concerns, please contact IQOS Customer Care at Facebook.com/ph.iqos or #983838. Thank you!`,
  },
  {
    value: "REJECTED_LOCATION",
    label: "Cancellation due to location (outside NCR)",
    message:
      order?.payment_type === "COD"
        ? `Dear Customer, it seems that your location is outside of our delivery coverage area and thus we cannot process your order. IQOS.com only offers delivery within Metro Manila for now. Please check our Terms and Conditions to know more.

If you have questions regarding your order, please contact IQOS Sales Team. For other concerns, please contact IQOS Customer Care at Facebook.com/ph.iqos or #983838. Thank you!`
        : `Dear Customer, it seems that your location is outside of our delivery coverage area and thus we cannot process your order.  IQOS.com only offers delivery within Metro Manila for now. Please check our Terms and Conditions to know more. Don’t worry though, as we will process your full refund - subject to issuing bank lead times. 

If you have questions regarding your order, please contact IQOS Sales Team. For other concerns, please contact IQOS Customer Care at Facebook.com/ph.iqos or #983838. Thank you!`,
  },
  {
    value: "REJECTED_INCORRECT",
    label: "Cancellation due to incorrect order details",
    message:
      order?.payment_type === "COD"
        ? `Dear Customer, it seems that some inputs in your shipping details are incorrect and thus, we cannot process your order.

If you have questions regarding your order, please contact IQOS Sales Team. For other concerns, please contact IQOS Customer Care at Facebook.com/ph.iqos or #983838. Thank you!`
        : `Dear Customer, it seems that some inputs in your shipping details are incorrect and thus, we cannot process your order. Don't worry though, as we will process your full refund - which will reflect on your SOA within 30-60 days, subject to issuing bank lead time.

If you have questions regarding your order, please contact IQOS Sales Team. For other concerns, please contact IQOS Customer Care at Facebook.com/ph.iqos or #983838. Thank you!`,
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

export const getZynCustomerSMSType = (order: any) => [
  {
    value: "IN_TRANSIT",
    label: "In Transit",
    message: `Your ZYN order #${order?.order_id} is now being shipped.
Track your order here: https://iqos.activasia.com/delivery-tracking/order/?orderID=${order?.order_id}`,
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

export const getZynCancelSMSType = (order: any) => [
  {
    value: "OUTSIDE_COVERED_AREA",
    label: "Outside covered area",
    message: `Hi ${order?.billing_address?.first_name || ""} ${
      order?.billing_address?.last_name || ""
    }. We regret to inform you that your order with confirmation #${
      order?.order_id
    } has been rejected by our system as your delivery address is outside our current service area.
We’d love to help you - you may visit ZYN.com to find a store near you or contact Customer Care at contact@zyn.com for any concerns. Thank you!`,
  },
  {
    value: "EXCEED_LIMIT",
    label: "Exceeding transaction limit (15K)",
    message: `Dear ${order?.billing_address?.first_name || ""} ${
      order?.billing_address?.last_name || ""
    }, we regret to inform you that your order with confirmation  #${
      order?.order_id
    } has been rejected by our system because of consecutive multiple orders made. 
If you are ordering for your adult family or friends, kindly request them to order directly from ZYN.com so we may verify their details and ensure that we are selling only to customers who are 18 years old and above. 
We apologize for the inconvenience this has caused. For any concerns about your order, please contact Customer Care at contact@zyn.com. Thank you!`,
  },
  {
    value: "EXCEED_CAP",
    label: "Exceeding Device Cap",
    message: `Dear ${order?.billing_address?.first_name || ""} ${
      order?.billing_address?.last_name || ""
    }, we regret to inform you that your order with confirmation  #${
      order?.order_id
    } has been rejected by our system because of consecutive multiple orders made.
If you are ordering for your adult family or friends, kindly request them to order directly from ZYN.com so we may verify their details and ensure that we are selling only to customers who are 18 years old and above.
We apologize for the inconvenience this has caused. For any concerns about your order, please contact Customer Care at contact@zyn.com. Thank you!`,
  },
  {
    value: "FRAUDULENT",
    label: "Fraudulent transaction/activity",
    message: `Dear ${order?.billing_address?.first_name || ""} ${
      order?.billing_address?.last_name || ""
    }, we regret to inform you that your order with confirmation  #${
      order?.order_id
    } has been rejected by our system as it potentially violates certain provisions of our General Terms & Conditions of Sale.
We apologize for the inconvenience this has caused. Please check our Terms and Conditions at ZYN.com to know more.
If you have any questions, please contact Customer Care at contact@zyn.com. We are happy to be of help. Thank you!`,
  },
];

export const getCancelSMSType = (order: any) => [
  {
    value: "OUTSIDE_COVERED_AREA",
    label: "Outside covered area",
    message: `Hi ${order?.billing_address?.first_name || ""} ${
      order?.billing_address?.last_name || ""
    }. We regret to inform you that your order with confirmation #${
      order?.order_id
    } has been rejected by our system as your delivery address is outside our current service area.
We’d love to help you - you may visit IQOS.ph to find a store near you or contact IQOS Customer Care at #983838 for any concerns. Thank you!`,
  },
  {
    value: "EXCEED_LIMIT",
    label: "Exceeding transaction limit (15K)",
    message: `Dear ${order?.billing_address?.first_name || ""} ${
      order?.billing_address?.last_name || ""
    }, we regret to inform you that your order with confirmation  #${
      order?.order_id
    } has been rejected by our system because of consecutive multiple orders made. 
If you are ordering for your adult family or friends, kindly request them to order directly from IQOS.com so we may verify their details and ensure that we are selling only to adult customers. 
We apologize for the inconvenience this has caused. For any concerns about your order, please contact IQOS Customer Care at #983838. Thank you! This product is not risk free & provides nicotine, which is addictive. For 18+only`,
  },
  {
    value: "EXCEED_CAP",
    label: "Exceeding Device Cap",
    message: `Dear ${order?.billing_address?.first_name || ""} ${
      order?.billing_address?.last_name || ""
    }, we regret to inform you that your order with confirmation  #${
      order?.order_id
    } has been rejected by our system because of consecutive multiple orders made.
If you are ordering for your adult family or friends, kindly request them to order directly from IQOS.com so we may verify their details and ensure that we are selling only to adult customers.
We apologize for the inconvenience this has caused. For any concerns about your order, please contact IQOS Customer Care at #983838. Thank you! This product is not risk free & provides nicotine, which is addictive. For 18+only`,
  },
  {
    value: "FRAUDULENT",
    label: "Fraudulent transaction/activity",
    message: `Dear ${order?.billing_address?.first_name || ""} ${
      order?.billing_address?.last_name || ""
    }, we regret to inform you that your order with confirmation  #${
      order?.order_id
    } has been rejected by our system as it potentially violates certain provisions of our General Terms & Conditions of Sale.
We apologize for the inconvenience this has caused. Please check our Terms and Conditions at IQOS.com to know more.
If you have any questions, please contact IQOS Customer Care at #983838. We are happy to be of help. Thank you!`,
  },
];

export const getCustomOrderSMS = [
  {
    value: "DELAY_DUE_TO_TIMING",
    label: "Delay due to timing",
    message: `Dear Customer, unfortunately, your order is delayed. But don’t worry, your order will be delivered in (insert number of days) days. 
If you have questions regarding your order, please contact IQOS Sales Team. For other concerns, please contact IQOS Customer Care at Facebook.com/ph.iqos or #983838. Thank you!`,
  },
  {
    value: "DELAY_DUE_TO_WEATHER",
    label: "Delay due to weather",
    message: `Dear Customer, unfortunately, your order is delayed due to bad weather. But don’t worry, your order will be delivered when it is safe to do so. 
If you have questions regarding your order, please contact IQOS Sales Team. For other concerns, please contact IQOS Customer Care at Facebook.com/ph.iqos or #983838. Thank you!`,
  },
  {
    value: "LUZON_GHW",
    label: "LUZON GHW",
    message: `Please be advised that due to increased demand, our usual delivery timeline is not available for the time being. Rest assured that your order will arrive as soon as possible. Thank you for your understanding
This product us not risk-free and is addictive. It is only for use by adults at least 21 years old and above. By engaging with us, you confirm that you are over 21 years of age and are a smoker or user of other nicotine products
GOVERNMENT WARNING: CIGARETTE SMOKING IS DANGEROUS TO YOUR HEALTH
        `,
  },
  {
    value: "VISMIN_GHW",
    label: "VISMIN GHW",
    message: `Please be advised that due to increased demand, our usual delivery timeline is not available for the time being. Rest assured that your order will arrive as soon as possible, with expected maximum delays of up to 13 days. Thank you for your understanding. 
This product us not risk-free and is addictive. It is only for use by adults at least 21 years old and above. By engaging with us, you confirm that you are over 21 years of age and are a smoker or user of other nicotine products.
GOVERNMENT WARNING: CIGARETTE SMOKING IS DANGEROUS TO YOUR HEALTH`,
  },
];

const getHeetsGTIN = (
  item: ORDER.Maybe<ORDER.OrderItem> | undefined,
  skus: WMS.Sku[]
) => {
  if (!item?.sku) return null;

  const base = item.sku.split(".")[0];

  const matchByBase = (e: WMS.Sku) => e.sku?.split(".")[0] === base;

  if (
    item.sku.includes("G000") ||
    item.sku.includes("HP0000") ||
    item.description?.toUpperCase().includes("TEREA") ||
    item.description?.toUpperCase().includes("BLENDS")
  ) {
    console.log(item.sku);

    if (
      item.description?.toUpperCase().includes("TEREA") ||
      item.description?.toUpperCase().includes("BLENDS")
    ) {
      return skus.find(
        (e) => matchByBase(e) && item.quantity_unit === e.unit_of_measure
      )?.gtin;
    } else {
      return skus.find(matchByBase)?.gtin;
    }
  } else {
    return skus.find((e) => matchByBase(e) && e.unit_of_measure !== "PK")?.gtin;
  }
};

const getZynGTIN = (
  item: ORDER.Maybe<ORDER.OrderItem> | undefined,
  skus: WMS.Sku[]
) => {
  if (!item?.sku) return null;

  const base = item.sku.split(".")[0];
  const matchByBase = (e: WMS.Sku) => e.sku?.split(".")[0] === base;

  switch (item.quantity_unit) {
    case "CAN":
      return skus.find((e) => matchByBase(e) && e.unit_of_measure === "CAN")
        ?.gtin;
    case "ROLL":
      return skus.find((e) => matchByBase(e) && e.unit_of_measure === "ROL")
        ?.gtin;
    default:
      return skus.find(
        (e) => matchByBase(e) && e.unit_of_measure === item.quantity_unit
      )?.gtin;
  }
};

export const updateGTIN = (
  item: ORDER.Maybe<ORDER.OrderItem> | undefined,
  skus: WMS.Sku[]
) => {
  if (!item?.sku) return null;

  const base = item.sku.split(".")[0];

  const matchedSku = skus.find((e) => e.sku?.split(".")[0] === base);

  const itemType = matchedSku?.type;
  switch (itemType) {
    case "HEETS":
      return getHeetsGTIN(item, skus);
    case "ZYN":
      return getZynGTIN(item, skus);
    default:
      return matchedSku?.gtin || null;
  }
};

export const getVerificationReasons = [
  "ZYN is currently available in NCR only",
  "BONDS & BLENDS is currently available in NCR only",
  "Outside Serviceable Area",
  "Multiple used of Promo code (for all promo w/ 1 time used only)",
  "Exceed used of promo code (for those promo with limit of 2 & 4 time used per month or quarter)",
  "End of promo period (usage of promo code which is pass due of promo duration)",
  "Trade in promo outside serviceable area (Trade in not applicable no nearby Hub to cater trade in promo)",
  "Customer cancelled the order in 3rd party marketplace seller center",
  "Exceed maximum amount per transaction",
  "Exceed device limit per quarter",
  "Exceed device limit per year",
  "Exceed maximum Godfather promo",
  "Exceed maximum consumable limit per quarter",
  "Exceed maximum Zyn limit per month",
  "Flagged user/Suspected reseller",
];

export const getScanTags = ["NONE", "GT", "PG"];
