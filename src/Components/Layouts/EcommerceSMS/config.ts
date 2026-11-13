export interface AssignEcommerceSMSFormInput {
  sms_type_id: string | null;
  message: string | undefined;
  warehouse_ids: string[];
}

export interface CreateCustomSMSFormInput {
  type: string;
  message: string;
}

export interface FilterProps {
  by_name_id: string | undefined;
  by_sms_type: string | undefined;
  by_warehouse_type: string | undefined;
}

export const getSMSType = ["DEFAULT", "CUSTOM"];

export const ECOMM_SMS_LIMIT = 620;
