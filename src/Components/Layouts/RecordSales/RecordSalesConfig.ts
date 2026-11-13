import { FileWithPath } from "@mantine/dropzone";
import { WMS } from "../../../GraphQL";
import { RecordSalesItemsProps } from "./RecordSaleItems";

export interface RecordSalesFormInputs {
  warehouse_id: string;
  date_created: Date;
  transaction_number: string;
  cegid_no: string;
  type: string;
  remarks: string;
  created_by: string;
  sales_expert: string;
  payment_type: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  scanned_items: RecordSalesItemsProps[];
  scanner: string;
  receipt: FileWithPath[];
  remittance: FileWithPath[];
  additional_attachment: FileWithPath[];
  return_notes: string;
  lead_source: string;
  club_status: string;
  link_tags: string[];
  ir_error_tags: string[];
  incident_report_id: string;
}

export const getRecordSalesType = [
  {
    value: "Sellable",
    label: "Sellable",
  },
  {
    value: "Replacement",
    label: "Replacement",
  },
];

export const getICRecordSalesType = [
  {
    value: "Sampling",
    label: "Sampling",
  },
  {
    value: "Device Sales",
    label: "Device Sales",
  },
];

export const getKCRecordSalesType = [
  {
    value: "Sampling",
    label: "Sampling",
  },
  {
    value: "Sales",
    label: "Sales",
  },
];

export const getPaymentType = [
  "Direct Debit",
  "Credit Card",
  "Sofort",
  "PayPal",
  "Cash",
  "P24",
  "POS",
  "COD",
  "Free Order",
  "GCASH",
];

export const getICPaymentType = [
  "Sampling - Free Order",
  "Guided Trial - Free Order",
  "Cash",
  "GCash",
  "Credit Card",
  "Debit Card",
  "QRPH",
];
export const getPromoGoodsType = [
  "PROMO DISCOUNT",
  "PROMO GOODS",
  "PROMO GOODS + DISCOUNT",
];

export const getLeadSource = [
  {
    value: WMS.LeadSource.WalkIn,
    label: "Local",
  },
  {
    value: WMS.LeadSource.PersonalNetwork,
    label: "Foreigner",
  },
];

export const getClubStatuses = [
  {
    value: WMS.ClubStatus.NotAMember,
    label: "Not a Member",
  },
  {
    value: WMS.ClubStatus.Silver,
    label: "Silver",
  },
  {
    value: WMS.ClubStatus.Gold,
    label: "Gold",
  },
  {
    value: WMS.ClubStatus.Platinum,
    label: "Platinum",
  },
  {
    value: WMS.ClubStatus.Na,
    label: "NA",
  },
];
