/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: string;
  AWSDateTime: string;
  AWSEmail: string;
  AWSIPAddress: string;
  AWSJSON: string;
  AWSPhone: string;
  AWSTime: string;
  AWSTimestamp: number;
  AWSURL: string;
  BigInt: any;
  Double: any;
};

export enum AppointmentReason {
  Buy = "BUY",
  Lend = "LEND",
  TryIqos = "TRY_IQOS",
}

export enum AssetType {
  Photo = "PHOTO",
  Video = "VIDEO",
}

export enum AttendanceType {
  TimeIn = "TIME_IN",
  TimeOut = "TIME_OUT",
}

export type AuditOrders = {
  __typename?: "AuditOrders";
  CASH?: Maybe<Scalars["String"]>;
  CREDIT_CARD?: Maybe<Scalars["String"]>;
  DEBIT_CARD?: Maybe<Scalars["String"]>;
  GCASH?: Maybe<Scalars["String"]>;
  TOTAL?: Maybe<Scalars["String"]>;
};

export type BatchItem = {
  __typename?: "BatchItem";
  batch_id?: Maybe<Scalars["String"]>;
  quantity?: Maybe<Scalars["String"]>;
  sku?: Maybe<Scalars["String"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
};

export type BatchItems = IBatchItems & {
  __typename?: "BatchItems";
  batch_id?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  expiration_date?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  inventory?: Maybe<InventoryItemConnection>;
  inventory_type?: Maybe<Scalars["String"]>;
  quantity?: Maybe<Scalars["Int"]>;
  sku?: Maybe<Scalars["String"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type BatchItemsConnection = {
  __typename?: "BatchItemsConnection";
  items?: Maybe<Array<Maybe<BatchItems>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type BatchItemsInput = {
  batch_id: Scalars["String"];
  expiration_date?: InputMaybe<Scalars["String"]>;
  gtin: Scalars["String"];
  manufacturing_date?: InputMaybe<Scalars["String"]>;
  quantity: Scalars["Int"];
  received?: InputMaybe<Scalars["Int"]>;
};

export type BillingAddress = {
  __typename?: "BillingAddress";
  address_extention_1?: Maybe<Scalars["String"]>;
  address_extention_2?: Maybe<Scalars["String"]>;
  address_extention_3?: Maybe<Scalars["String"]>;
  address_extention_4?: Maybe<Scalars["String"]>;
  building?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  company?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  digi_code?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  first_name?: Maybe<Scalars["String"]>;
  language?: Maybe<Scalars["String"]>;
  last_name?: Maybe<Scalars["String"]>;
  po_box?: Maybe<Scalars["String"]>;
  region?: Maybe<Scalars["String"]>;
  salutation?: Maybe<Scalars["String"]>;
  sap_number?: Maybe<Scalars["String"]>;
  street?: Maybe<Scalars["String"]>;
  street_number?: Maybe<Scalars["String"]>;
  telephone_number?: Maybe<Scalars["String"]>;
  zip?: Maybe<Scalars["String"]>;
};

export type BillingAddressInput = {
  address_extention_1?: InputMaybe<Scalars["String"]>;
  address_extention_2?: InputMaybe<Scalars["String"]>;
  address_extention_3?: InputMaybe<Scalars["String"]>;
  address_extention_4?: InputMaybe<Scalars["String"]>;
  building?: InputMaybe<Scalars["String"]>;
  city?: InputMaybe<Scalars["String"]>;
  company?: InputMaybe<Scalars["String"]>;
  country?: InputMaybe<Scalars["String"]>;
  digi_code?: InputMaybe<Scalars["String"]>;
  email?: InputMaybe<Scalars["String"]>;
  first_name?: InputMaybe<Scalars["String"]>;
  language?: InputMaybe<Scalars["String"]>;
  last_name?: InputMaybe<Scalars["String"]>;
  po_box?: InputMaybe<Scalars["String"]>;
  region?: InputMaybe<Scalars["String"]>;
  salutation?: InputMaybe<Scalars["String"]>;
  sap_number?: InputMaybe<Scalars["String"]>;
  street?: InputMaybe<Scalars["String"]>;
  street_number?: InputMaybe<Scalars["String"]>;
  telephone_number?: InputMaybe<Scalars["String"]>;
  zip?: InputMaybe<Scalars["String"]>;
};

export type Customer = {
  __typename?: "Customer";
  id?: Maybe<Scalars["String"]>;
  tag?: Maybe<Scalars["String"]>;
  telephone_number?: Maybe<Scalars["String"]>;
};

export type CustomerInfo = {
  __typename?: "CustomerInfo";
  first_name?: Maybe<Scalars["String"]>;
  last_name?: Maybe<Scalars["String"]>;
};

export type CustomerRating = {
  __typename?: "CustomerRating";
  completed?: Maybe<Scalars["Int"]>;
  orders?: Maybe<Scalars["Int"]>;
  rating?: Maybe<Scalars["Float"]>;
  retries?: Maybe<Scalars["Int"]>;
  undelivered?: Maybe<Scalars["Int"]>;
};

export enum CustomerType {
  Las = "LAS",
  Lau = "LAU",
}

export type CustomerUpdateInput = {
  tag?: InputMaybe<Scalars["String"]>;
  telephone_number?: InputMaybe<Scalars["String"]>;
};

export type DateFilter = {
  from?: InputMaybe<Scalars["String"]>;
  to?: InputMaybe<Scalars["String"]>;
};

export type DeliveredInfo = {
  __typename?: "DeliveredInfo";
  authorized_recipient_id?: Maybe<Array<Maybe<IdType>>>;
  customers_id?: Maybe<Array<Maybe<IdType>>>;
  qr?: Maybe<S3Object>;
  remarks?: Maybe<Scalars["String"]>;
  signature?: Maybe<S3Object>;
};

export type DeliveredInput = {
  authorized_recipient_id?: InputMaybe<Array<InputMaybe<IdType>>>;
  customers_id?: InputMaybe<Array<InputMaybe<IdType>>>;
  qr?: InputMaybe<S3ObjectInput>;
  remarks?: InputMaybe<Scalars["String"]>;
  signature?: InputMaybe<S3ObjectInput>;
};

export type DeliveryInfo = {
  __typename?: "DeliveryInfo";
  delivered?: Maybe<DeliveredInfo>;
  undeliverable?: Maybe<UndeliverableInfo>;
};

export enum DeliveryStatus {
  Cancelled = "CANCELLED",
  Delivered = "DELIVERED",
  Deliveredtoparcelshop = "DELIVEREDTOPARCELSHOP",
  Forpacking = "FORPACKING",
  Intransit = "INTRANSIT",
  PromoItemsAdded = "PROMO_ITEMS_ADDED",
  Readyforpickup = "READYFORPICKUP",
  Returntosender = "RETURNTOSENDER",
  TpdUpdate = "TPD_UPDATE",
  Undeliverable = "UNDELIVERABLE",
}

export type DeliveryStatusLogs = {
  __typename?: "DeliveryStatusLogs";
  assigned_rider?: Maybe<Scalars["String"]>;
  delivered?: Maybe<DeliveredInfo>;
  status?: Maybe<DeliveryStatus>;
  status_datetime?: Maybe<Scalars["AWSTimestamp"]>;
  undeliverable?: Maybe<UndeliverableInfo>;
};

export type DeliveryStatusUpdateInput = {
  delivered?: InputMaybe<DeliveredInput>;
  undeliverable?: InputMaybe<UndeliverableInput>;
};

export type DeliveryTracking = {
  __typename?: "DeliveryTracking";
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  delivery_info?: Maybe<DeliveryInfo>;
  delivery_status?: Maybe<DeliveryStatus>;
  delivery_status_logs?: Maybe<Array<Maybe<DeliveryStatusLogs>>>;
  id?: Maybe<Scalars["String"]>;
  items?: Maybe<Array<Maybe<OrderItem>>>;
  order_reason?: Maybe<Scalars["String"]>;
  order_reference_number?: Maybe<Scalars["String"]>;
  order_status?: Maybe<OrderStatus>;
  order_status_logs?: Maybe<Array<Maybe<OrderStatusLogs>>>;
  order_type?: Maybe<Scalars["String"]>;
  payment_type?: Maybe<Scalars["String"]>;
  retry_count?: Maybe<Scalars["Int"]>;
};

export type Discount = {
  __typename?: "Discount";
  discount_code?: Maybe<Scalars["String"]>;
  discount_description?: Maybe<Scalars["String"]>;
  discount_gross?: Maybe<Scalars["String"]>;
  discount_number?: Maybe<Scalars["String"]>;
  discount_type?: Maybe<Scalars["String"]>;
  discount_verified?: Maybe<Scalars["Boolean"]>;
};

export type DiscountInput = {
  discount_code?: InputMaybe<Scalars["String"]>;
  discount_description?: InputMaybe<Scalars["String"]>;
  discount_gross?: InputMaybe<Scalars["String"]>;
  discount_number?: InputMaybe<Scalars["String"]>;
  discount_type?: InputMaybe<Scalars["String"]>;
  discount_verified?: InputMaybe<Scalars["Boolean"]>;
};

export enum EngagementType {
  Mobile = "MOBILE",
  Personal = "PERSONAL",
}

export type Error = {
  __typename?: "Error";
  details?: Maybe<Scalars["String"]>;
  error?: Maybe<Scalars["String"]>;
  note?: Maybe<Scalars["String"]>;
};

export type FailedOrder = {
  __typename?: "FailedOrder";
  date_created?: Maybe<Scalars["String"]>;
  error_log?: Maybe<Scalars["String"]>;
  file_name?: Maybe<Scalars["String"]>;
  process_status?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
};

export type FilterInput = {
  attribute?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["String"]>;
};

export enum Frequency {
  Monthly = "MONTHLY",
  Weekly = "WEEKLY",
}

export type GeoLocation = {
  __typename?: "GeoLocation";
  latitude?: Maybe<Scalars["Float"]>;
  longitude?: Maybe<Scalars["Float"]>;
};

export type GeoLocationInput = {
  latitude?: InputMaybe<Scalars["Float"]>;
  longitude?: InputMaybe<Scalars["Float"]>;
};

export type HybridLead = {
  __typename?: "HybridLead";
  barangay?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  conducted_gt?: Maybe<Scalars["Boolean"]>;
  contact_no?: Maybe<Scalars["String"]>;
  created_by?: Maybe<Scalars["ID"]>;
  customer_type?: Maybe<CustomerType>;
  date_created?: Maybe<Scalars["AWSTimestamp"]>;
  decline_reason?: Maybe<Scalars["String"]>;
  ecom_order?: Maybe<Scalars["ID"]>;
  email?: Maybe<Scalars["AWSEmail"]>;
  engagement?: Maybe<EngagementType>;
  first_name?: Maybe<Scalars["String"]>;
  gt_device?: Maybe<Scalars["String"]>;
  gt_heets?: Maybe<Scalars["String"]>;
  gt_heets_qty?: Maybe<Scalars["Int"]>;
  id?: Maybe<Scalars["ID"]>;
  last_name?: Maybe<Scalars["String"]>;
  photo?: Maybe<S3Object>;
  purchased?: Maybe<Scalars["Boolean"]>;
  purchased_device?: Maybe<Scalars["String"]>;
  signature?: Maybe<S3Object>;
};

export type HybridLeadConnection = {
  __typename?: "HybridLeadConnection";
  items?: Maybe<Array<Maybe<HybridLead>>>;
  nextToken?: Maybe<Scalars["String"]>;
};

export type HybridLeadInput = {
  barangay: Scalars["String"];
  city: Scalars["String"];
  conducted_gt: Scalars["Boolean"];
  contact_no: Scalars["String"];
  customer_type?: InputMaybe<CustomerType>;
  decline_reason?: InputMaybe<Scalars["String"]>;
  ecom_order?: InputMaybe<Scalars["ID"]>;
  email: Scalars["AWSEmail"];
  engagement?: InputMaybe<EngagementType>;
  first_name: Scalars["String"];
  gt_device?: InputMaybe<Scalars["String"]>;
  gt_heets?: InputMaybe<Scalars["String"]>;
  gt_heets_qty?: InputMaybe<Scalars["Int"]>;
  last_name: Scalars["String"];
  photo?: InputMaybe<S3ObjectInput>;
  purchased?: InputMaybe<Scalars["Boolean"]>;
  purchased_device?: InputMaybe<Scalars["String"]>;
  signature?: InputMaybe<S3ObjectInput>;
};

export type HybridLeadUpdateInput = {
  barangay?: InputMaybe<Scalars["String"]>;
  city?: InputMaybe<Scalars["String"]>;
  conducted_gt?: InputMaybe<Scalars["Boolean"]>;
  contact_no?: InputMaybe<Scalars["String"]>;
  customer_type?: InputMaybe<CustomerType>;
  decline_reason?: InputMaybe<Scalars["String"]>;
  ecom_order?: InputMaybe<Scalars["ID"]>;
  email?: InputMaybe<Scalars["AWSEmail"]>;
  engagement?: InputMaybe<EngagementType>;
  first_name?: InputMaybe<Scalars["String"]>;
  gt_device?: InputMaybe<Scalars["String"]>;
  gt_heets?: InputMaybe<Scalars["String"]>;
  gt_heets_qty?: InputMaybe<Scalars["Int"]>;
  last_name?: InputMaybe<Scalars["String"]>;
  photo?: InputMaybe<S3ObjectInput>;
  purchased?: InputMaybe<Scalars["Boolean"]>;
  purchased_device?: InputMaybe<Scalars["String"]>;
  signature?: InputMaybe<S3ObjectInput>;
};

export type HyperCare = {
  __typename?: "HyperCare";
  assigned_coach?: Maybe<Scalars["String"]>;
  comments?: Maybe<Array<Maybe<HyperCareComment>>>;
  customer_information?: Maybe<ShippingAddress>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  decline_reason?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["String"]>;
  order_reference_number?: Maybe<Scalars["String"]>;
  purchase_date?: Maybe<Scalars["AWSTimestamp"]>;
  purchase_device_type?: Maybe<Scalars["String"]>;
  purchase_order_id?: Maybe<Scalars["String"]>;
  purchase_status?: Maybe<PurchaseStatus>;
  underwent_guided_trial?: Maybe<Scalars["Boolean"]>;
  update_logs?: Maybe<Array<Maybe<UpdateLog>>>;
};

export type HyperCareComment = {
  __typename?: "HyperCareComment";
  comment?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["AWSTimestamp"]>;
  day?: Maybe<Scalars["Int"]>;
};

export type HyperCareCommentInput = {
  comment?: InputMaybe<Scalars["String"]>;
  date_created?: InputMaybe<Scalars["AWSTimestamp"]>;
  day?: InputMaybe<Scalars["Int"]>;
};

export type HyperCareConnection = {
  __typename?: "HyperCareConnection";
  items?: Maybe<Array<Maybe<HyperCare>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type HyperCareInput = {
  assigned_coach?: InputMaybe<Scalars["String"]>;
  assigned_warehouse?: InputMaybe<Scalars["String"]>;
  comments?: InputMaybe<Array<InputMaybe<HyperCareCommentInput>>>;
  customer_information?: InputMaybe<ShippingAddressInput>;
  decline_reason?: InputMaybe<Scalars["String"]>;
  extend?: InputMaybe<Scalars["Boolean"]>;
  order_reference_number?: InputMaybe<Scalars["String"]>;
  purchase_date?: InputMaybe<Scalars["AWSTimestamp"]>;
  purchase_device_type?: InputMaybe<Scalars["String"]>;
  purchase_order_id?: InputMaybe<Scalars["String"]>;
  purchase_status?: InputMaybe<PurchaseStatus>;
  underwent_guided_trial?: InputMaybe<Scalars["Boolean"]>;
};

export type IBatchItems = {
  batch_id?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  expiration_date?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  inventory?: Maybe<InventoryItemConnection>;
  quantity?: Maybe<Scalars["Int"]>;
  sku?: Maybe<Scalars["String"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export enum IdType {
  AfpId = "AFP_ID",
  AlienCertificateOfRegistration = "ALIEN_CERTIFICATE_OF_REGISTRATION",
  AttyId = "ATTY_ID",
  BfpId = "BFP_ID",
  BrgyId = "BRGY_ID",
  BureauId = "BUREAU_ID",
  CityHallId = "CITY_HALL_ID",
  DriversLicense = "DRIVERS_LICENSE",
  FirearmLicense = "FIREARM_LICENSE",
  IntegratedId = "INTEGRATED_ID",
  NbiClearanceCard = "NBI_CLEARANCE_CARD",
  Ofw = "OFW",
  Others = "OTHERS",
  Pagibig = "PAGIBIG",
  Passport = "PASSPORT",
  Philhealth = "PHILHEALTH",
  PhilhealthId = "PHILHEALTH_ID",
  PhilsysNationalId = "PHILSYS_NATIONAL_ID",
  PnpId = "PNP_ID",
  PoliceId = "POLICE_ID",
  Postal = "POSTAL",
  PostalId = "POSTAL_ID",
  PrcId = "PRC_ID",
  PwdId = "PWD_ID",
  SenateId = "SENATE_ID",
  SeniorCitizen = "SENIOR_CITIZEN",
  SeniorCitizenId = "SENIOR_CITIZEN_ID",
  SosiaId = "SOSIA_ID",
  Sss = "SSS",
  SssId = "SSS_ID",
  Tin = "TIN",
  TinId = "TIN_ID",
  Umid = "UMID",
  UnifiedMultiPurposeId = "UNIFIED_MULTI_PURPOSE_ID",
  Voters = "VOTERS",
  VotersId = "VOTERS_ID",
}

export type IdentificationInfo = {
  __typename?: "IdentificationInfo";
  birthdate?: Maybe<Scalars["AWSDate"]>;
  email?: Maybe<Scalars["AWSEmail"]>;
  expiration_date?: Maybe<Scalars["AWSDate"]>;
  id_type?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  phone_number?: Maybe<Scalars["AWSPhone"]>;
  photo?: Maybe<S3Object>;
  updated_by?: Maybe<Scalars["ID"]>;
};

export type IdentificationInfoInput = {
  birthdate?: InputMaybe<Scalars["AWSDate"]>;
  email?: InputMaybe<Scalars["AWSEmail"]>;
  expiration_date?: InputMaybe<Scalars["AWSDate"]>;
  id_type?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  phone_number?: InputMaybe<Scalars["AWSPhone"]>;
  photo?: InputMaybe<S3ObjectInput>;
};

export type InventoryItem = {
  __typename?: "InventoryItem";
  batch_id?: Maybe<Scalars["String"]>;
  charger_serial?: Maybe<Scalars["String"]>;
  cycle?: Maybe<Scalars["Float"]>;
  cycle_history?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  expiration_date?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  holder_serial?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  issue_date?: Maybe<Scalars["String"]>;
  item_status?: Maybe<InventoryItemStatus>;
  location?: Maybe<Scalars["String"]>;
  manufacturing_date?: Maybe<Scalars["String"]>;
  order_history?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  order_id?: Maybe<Scalars["String"]>;
  pullout_id?: Maybe<Scalars["String"]>;
  return_id?: Maybe<Scalars["String"]>;
  serial?: Maybe<Scalars["String"]>;
  sku?: Maybe<Scalars["String"]>;
  status_date?: Maybe<Scalars["String"]>;
  tag?: Maybe<Scalars["String"]>;
  transfer_id?: Maybe<Scalars["String"]>;
  transmittal_id?: Maybe<Scalars["String"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
  usage_history?: Maybe<Array<Maybe<UsageHistory>>>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type InventoryItemConnection = {
  __typename?: "InventoryItemConnection";
  items?: Maybe<Array<Maybe<InventoryItem>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type InventoryItemInput = {
  batch_id: Scalars["String"];
  gtin: Scalars["String"];
  serial: Scalars["String"];
  tag?: InputMaybe<Scalars["String"]>;
  transmittal_id: Scalars["String"];
};

export enum InventoryItemStatus {
  Available = "AVAILABLE",
  Cancelled = "CANCELLED",
  Damaged = "DAMAGED",
  Loss = "LOSS",
  Pending = "PENDING",
  Pullout = "PULLOUT",
  Redeemed = "REDEEMED",
  Released = "RELEASED",
}

export enum LendingStatus {
  Ongoing = "ONGOING",
  Received = "RECEIVED",
  Retrieved = "RETRIEVED",
  Shipped = "SHIPPED",
}

export type Message = {
  __typename?: "Message";
  message?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  assetUpload?: Maybe<Message>;
  coachDeliveryFinish?: Maybe<Order>;
  customerUpdate?: Maybe<Customer>;
  dceOrderReply?: Maybe<Message>;
  deliveryFinish?: Maybe<Order>;
  deliveryStart?: Maybe<Rider>;
  errorCreate?: Maybe<Error>;
  generatePDF?: Maybe<Scalars["AWSURL"]>;
  hybridLeadCreate?: Maybe<HybridLead>;
  hybridLeadUpdate?: Maybe<HybridLead>;
  hyperCareCreate?: Maybe<HyperCare>;
  hyperCareUpdate?: Maybe<HyperCare>;
  identificationUpdate?: Maybe<IdentificationInfo>;
  orderAssignRider?: Maybe<Order>;
  orderAssignWarehouse?: Maybe<Order>;
  orderCreate?: Maybe<Order>;
  orderCustomerUpdate?: Maybe<Order>;
  orderReturnByRider?: Maybe<Order>;
  orderScanRider?: Maybe<Order>;
  orderStatusUpdate?: Maybe<Order>;
  orderUnAssignRider?: Maybe<Order>;
  orderUpdate?: Maybe<Order>;
  orderVerify?: Maybe<Order>;
  pickAndPackSave?: Maybe<Order>;
  pickAndPackSaveLead?: Maybe<Order>;
  pickAndPackVoid?: Maybe<Order>;
  pickAndPackVoidLead?: Maybe<Order>;
  promoItemsAdd?: Maybe<Order>;
  promoItemsAddLead?: Maybe<Order>;
  promoItemsRemove?: Maybe<Order>;
  promoItemsRemoveLead?: Maybe<Order>;
  pulloutReplacement?: Maybe<Message>;
  pulloutReplacementCancel?: Maybe<Message>;
  refundOrderCreate?: Maybe<Order>;
  replacementOrderCreate?: Maybe<Order>;
  reportDownload?: Maybe<Report>;
  reportRequest?: Maybe<Report>;
  returnOrderCreate?: Maybe<Order>;
  returnOrderStatusUpdate?: Maybe<Order>;
  returnOrderUpdate?: Maybe<Order>;
  riderAttendanceUpdate?: Maybe<Rider>;
  riderCreate?: Maybe<Rider>;
  riderLocationUpdate?: Maybe<Rider>;
  riderResetPassword?: Maybe<Rider>;
  riderStatusUpdate?: Maybe<Rider>;
  riderUpdate?: Maybe<Rider>;
  sendSMS?: Maybe<Sms>;
  setSMSTemplate?: Maybe<SmsTemplate>;
  smsAssignToWarehouses?: Maybe<Message>;
  smsTemplateCreate?: Maybe<SmsTemplate>;
  smsTemplateRemove?: Maybe<SmsTemplate>;
  smsTemplateUpdate?: Maybe<SmsTemplate>;
  smsUnassignToWarehouses?: Maybe<Message>;
  userDisable?: Maybe<Rider>;
  userEnable?: Maybe<Rider>;
  walletDeposit?: Maybe<Scalars["String"]>;
  walletRemit?: Maybe<Scalars["String"]>;
  walletTransfer?: Maybe<Scalars["String"]>;
  walletWithdraw?: Maybe<Scalars["String"]>;
};

export type MutationAssetUploadArgs = {
  asset: S3ObjectInput;
  asset_type: AssetType;
  record_no: Scalars["ID"];
  ref_id: Scalars["ID"];
};

export type MutationCoachDeliveryFinishArgs = {
  input?: InputMaybe<DeliveryStatusUpdateInput>;
  order_id: Scalars["ID"];
  order_type?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<DeliveryStatus>;
};

export type MutationConverToLendingOrderArgs = {
  lending_end_date: Scalars["AWSDate"];
  order_id: Scalars["ID"];
};

export type MutationCustomerUpdateArgs = {
  id?: InputMaybe<Scalars["String"]>;
  input?: InputMaybe<CustomerUpdateInput>;
};

export type MutationDceOrderReplyArgs = {
  id: Scalars["ID"];
  status: OrderStatus;
};

export type MutationDeliveryFinishArgs = {
  input?: InputMaybe<DeliveryStatusUpdateInput>;
  order_id: Scalars["ID"];
  order_type?: InputMaybe<Scalars["String"]>;
  rider_id: Scalars["String"];
  status?: InputMaybe<DeliveryStatus>;
};

export type MutationDeliveryStartArgs = {
  order_id: Scalars["ID"];
  order_type?: InputMaybe<Scalars["String"]>;
};

export type MutationErrorCreateArgs = {
  details?: InputMaybe<Scalars["String"]>;
  error?: InputMaybe<Scalars["String"]>;
  note?: InputMaybe<Scalars["String"]>;
};

export type MutationGeneratePdfArgs = {
  order_id: Scalars["ID"];
  type: PrintType;
};

export type MutationHybridLeadCreateArgs = {
  input: HybridLeadInput;
};

export type MutationHybridLeadUpdateArgs = {
  id: Scalars["ID"];
  input: HybridLeadUpdateInput;
};

export type MutationHyperCareCreateArgs = {
  input?: InputMaybe<HyperCareInput>;
};

export type MutationHyperCareUpdateArgs = {
  id: Scalars["ID"];
  input?: InputMaybe<HyperCareInput>;
};

export type MutationIdentificationUpdateArgs = {
  input?: InputMaybe<IdentificationInfoInput>;
};

export type MutationOrderAssignRiderArgs = {
  id: Scalars["ID"];
  order_type?: InputMaybe<Scalars["String"]>;
  rider_id: Scalars["String"];
  shipment_type?: InputMaybe<ShipmentType>;
};

export type MutationOrderAssignWarehouseArgs = {
  id?: InputMaybe<Scalars["String"]>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type MutationOrderCreateArgs = {
  input?: InputMaybe<OrderInput>;
};

export type MutationOrderCustomerUpdateArgs = {
  input: ShippingAddressInput;
  order_id: Scalars["ID"];
};

export type MutationOrderReturnByRiderArgs = {
  id?: InputMaybe<Scalars["String"]>;
};

export type MutationOrderScanRiderArgs = {
  id: Scalars["ID"];
  notification_message?: InputMaybe<Scalars["String"]>;
  order_type?: InputMaybe<Scalars["String"]>;
  rider_id: Scalars["String"];
};

export type MutationOrderStatusUpdateArgs = {
  id: Scalars["ID"];
  order_status: OrderStatus;
  order_type?: InputMaybe<Scalars["String"]>;
};

export type MutationOrderSubWarehouseTagUpdateArgs = {
  order_id: Scalars["ID"];
  tag: Scalars["String"];
};

export type MutationOrderUnAssignRiderArgs = {
  id: Scalars["ID"];
};

export type MutationOrderUpdateArgs = {
  id: Scalars["ID"];
  input?: InputMaybe<OrderUpdateInput>;
  order_type?: InputMaybe<Scalars["String"]>;
};

export type MutationOrderVerifyArgs = {
  id: Scalars["ID"];
  note?: InputMaybe<Scalars["String"]>;
  verification_reason?: InputMaybe<Scalars["String"]>;
  verification_status?: InputMaybe<VerificationStatus>;
};

export type MutationPickAndPackSaveArgs = {
  input?: InputMaybe<Array<InputMaybe<PickAndPackInput>>>;
  order_id?: InputMaybe<Scalars["String"]>;
  order_type?: InputMaybe<Scalars["String"]>;
  usage_history?: InputMaybe<UsageHistoryInput>;
};

export type MutationPickAndPackSaveLeadArgs = {
  input?: InputMaybe<Array<InputMaybe<PickAndPackInput>>>;
  order_id?: InputMaybe<Scalars["String"]>;
  order_type?: InputMaybe<Scalars["String"]>;
  trial_type: TrialType;
};

export type MutationPickAndPackVoidArgs = {
  order_id?: InputMaybe<Scalars["String"]>;
  order_type?: InputMaybe<Scalars["String"]>;
  usage_history?: InputMaybe<UsageHistoryInput>;
};

export type MutationPickAndPackVoidLeadArgs = {
  order_id?: InputMaybe<Scalars["String"]>;
  order_type?: InputMaybe<Scalars["String"]>;
  trial_type: TrialType;
};

export type MutationPromoItemsAddArgs = {
  input?: InputMaybe<Array<InputMaybe<PickAndPackInput>>>;
  order_id?: InputMaybe<Scalars["String"]>;
  order_type?: InputMaybe<Scalars["String"]>;
};

export type MutationPromoItemsAddLeadArgs = {
  input?: InputMaybe<Array<InputMaybe<PickAndPackInput>>>;
  order_id?: InputMaybe<Scalars["String"]>;
  order_type?: InputMaybe<Scalars["String"]>;
  trial_type: TrialType;
};

export type MutationPromoItemsRemoveArgs = {
  order_id?: InputMaybe<Scalars["String"]>;
  order_type?: InputMaybe<Scalars["String"]>;
};

export type MutationPromoItemsRemoveLeadArgs = {
  order_id?: InputMaybe<Scalars["String"]>;
  order_type?: InputMaybe<Scalars["String"]>;
  trial_type: TrialType;
};

export type MutationPulloutReplacementArgs = {
  input?: InputMaybe<PulloutReplacementInput>;
};

export type MutationPulloutReplacementCancelArgs = {
  input?: InputMaybe<PulloutReplacementInput>;
};

export type MutationRefundOrderCreateArgs = {
  input?: InputMaybe<OrderInput>;
};

export type MutationReplacementOrderCreateArgs = {
  input?: InputMaybe<OrderInput>;
};

export type MutationReportDownloadArgs = {
  error?: InputMaybe<Scalars["String"]>;
  request_id: Scalars["ID"];
  status?: InputMaybe<Scalars["String"]>;
  url?: InputMaybe<Scalars["AWSURL"]>;
};

export type MutationReportRequestArgs = {
  date_filter?: InputMaybe<DateFilter>;
  frequency?: InputMaybe<Frequency>;
  request_id: Scalars["ID"];
  type: ReportType;
  warehouse_id?: InputMaybe<Scalars["ID"]>;
};

export type MutationReturnLendingOrderCreateArgs = {
  serial: Scalars["ID"];
};

export type MutationReturnOrderCreateArgs = {
  input?: InputMaybe<OrderInput>;
};

export type MutationReturnOrderStatusUpdateArgs = {
  id: Scalars["ID"];
  order_status: ReturnOrderStatus;
  scanned_items?: InputMaybe<Array<InputMaybe<OrderItemInput>>>;
  usage_history?: InputMaybe<UsageHistoryInput>;
};

export type MutationReturnOrderUpdateArgs = {
  id: Scalars["ID"];
  input?: InputMaybe<OrderUpdateInput>;
};

export type MutationRiderAttendanceUpdateArgs = {
  type?: InputMaybe<AttendanceType>;
  username?: InputMaybe<Scalars["String"]>;
};

export type MutationRiderCreateArgs = {
  input?: InputMaybe<RiderInput>;
};

export type MutationRiderLocationUpdateArgs = {
  geolocation?: InputMaybe<GeoLocationInput>;
  username?: InputMaybe<Scalars["String"]>;
};

export type MutationRiderResetPasswordArgs = {
  input?: InputMaybe<RiderResetPasswordInput>;
};

export type MutationRiderStatusUpdateArgs = {
  rider_status?: InputMaybe<RiderStatus>;
  username?: InputMaybe<Scalars["String"]>;
};

export type MutationRiderUpdateArgs = {
  input?: InputMaybe<RiderUpdateInput>;
};

export type MutationSendSmsArgs = {
  message?: InputMaybe<Scalars["String"]>;
  number?: InputMaybe<Scalars["String"]>;
};

export type MutationSetSmsTemplateArgs = {
  id: Scalars["ID"];
  input: SmsTemplateInput;
};

export type MutationSmsAssignToWarehousesArgs = {
  id: Scalars["ID"];
  warehouse_ids?: InputMaybe<Array<Scalars["ID"]>>;
};

export type MutationSmsTemplateCreateArgs = {
  input?: InputMaybe<SmsTemplateInput>;
};

export type MutationSmsTemplateRemoveArgs = {
  id: Scalars["ID"];
};

export type MutationSmsTemplateUpdateArgs = {
  id: Scalars["ID"];
  input?: InputMaybe<SmsTemplateInput>;
};

export type MutationSmsUnassignToWarehousesArgs = {
  warehouse_ids?: InputMaybe<Array<Scalars["ID"]>>;
};

export type MutationUserDisableArgs = {
  username?: InputMaybe<Scalars["String"]>;
};

export type MutationUserEnableArgs = {
  username?: InputMaybe<Scalars["String"]>;
};

export type MutationWalletDepositArgs = {
  amount: Scalars["Float"];
  to_username: Scalars["ID"];
};

export type MutationWalletRemitArgs = {
  amount: Scalars["Float"];
  from_username: Scalars["ID"];
};

export type MutationWalletTransferArgs = {
  amount: Scalars["Float"];
  to_username: Scalars["ID"];
};

export type MutationWalletWithdrawArgs = {
  amount: Scalars["Float"];
  from_username: Scalars["ID"];
};

export type Order = {
  __typename?: "Order";
  appointment_reason?: Maybe<AppointmentReason>;
  assigned_coach?: Maybe<Scalars["String"]>;
  assigned_hub?: Maybe<Scalars["String"]>;
  assigned_logistics?: Maybe<Scalars["String"]>;
  assigned_rider?: Maybe<Scalars["String"]>;
  assigned_warehouse?: Maybe<Scalars["String"]>;
  awb?: Maybe<Scalars["String"]>;
  billing_address?: Maybe<BillingAddress>;
  created_by?: Maybe<Scalars["String"]>;
  customer_number?: Maybe<Scalars["String"]>;
  customer_rating?: Maybe<CustomerRating>;
  customer_type?: Maybe<Scalars["String"]>;
  cutoff_time?: Maybe<Scalars["AWSTime"]>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  delivery_date?: Maybe<Scalars["AWSTimestamp"]>;
  delivery_fee?: Maybe<Scalars["Float"]>;
  delivery_info?: Maybe<DeliveryInfo>;
  delivery_method?: Maybe<Scalars["String"]>;
  delivery_status?: Maybe<DeliveryStatus>;
  delivery_status_logs?: Maybe<Array<Maybe<DeliveryStatusLogs>>>;
  delivery_time?: Maybe<Scalars["AWSTime"]>;
  discount_verified?: Maybe<Scalars["Boolean"]>;
  doc_type?: Maybe<Scalars["String"]>;
  guided_trial_schedule_date?: Maybe<Scalars["AWSTimestamp"]>;
  guided_trial_schedule_time?: Maybe<Scalars["AWSTime"]>;
  hard_age_verified?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["String"]>;
  invoice_no?: Maybe<Scalars["String"]>;
  items?: Maybe<Array<Maybe<OrderItem>>>;
  lead_source?: Maybe<Scalars["String"]>;
  lead_type?: Maybe<Scalars["String"]>;
  lending_end_date?: Maybe<Scalars["AWSDate"]>;
  lending_purchase_status?: Maybe<Scalars["String"]>;
  lending_status?: Maybe<LendingStatus>;
  market_place_id?: Maybe<Scalars["String"]>;
  note?: Maybe<Scalars["String"]>;
  order_id?: Maybe<Scalars["String"]>;
  order_reason?: Maybe<Scalars["String"]>;
  order_reference_number?: Maybe<Scalars["String"]>;
  order_status?: Maybe<OrderStatus>;
  order_status_logs?: Maybe<Array<Maybe<OrderStatusLogs>>>;
  order_type?: Maybe<Scalars["String"]>;
  original_guided_trial_schedule_date?: Maybe<Scalars["AWSTimestamp"]>;
  original_guided_trial_schedule_time?: Maybe<Scalars["AWSTime"]>;
  paper_bag_size?: Maybe<Scalars["String"]>;
  payment_details?: Maybe<PaymentDetails>;
  payment_type?: Maybe<Scalars["String"]>;
  pickup_type?: Maybe<PickupType>;
  price?: Maybe<Price>;
  promo?: Maybe<Promo>;
  promo_items?: Maybe<Array<Maybe<OrderItem>>>;
  retry_count?: Maybe<Scalars["Int"]>;
  return_date?: Maybe<Scalars["AWSTimestamp"]>;
  shipment_type?: Maybe<ShipmentType>;
  shipping_address?: Maybe<ShippingAddress>;
  sms_logs?: Maybe<Array<Maybe<SmsLog>>>;
  underwent_guided_trial?: Maybe<Scalars["Boolean"]>;
  usage_history?: Maybe<UsageHistory>;
  verification_reason?: Maybe<Scalars["String"]>;
  verification_status?: Maybe<VerificationStatus>;
  sub_warehouse_tag?: Maybe<Scalars['String']>;
  seller_center_order_id?: Maybe<Scalars['String']>;
};


export type OrderConnection = {
  __typename?: "OrderConnection";
  items?: Maybe<Array<Maybe<Order>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type OrderDocuments = {
  __typename?: "OrderDocuments";
  return_form?: Maybe<Scalars["String"]>;
};

export type OrderFailedConnection = {
  __typename?: "OrderFailedConnection";
  items?: Maybe<Array<Maybe<FailedOrder>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type OrderInput = {
  appointment_reason?: InputMaybe<AppointmentReason>;
  assigned_coach?: InputMaybe<Scalars["String"]>;
  assigned_warehouse?: InputMaybe<Scalars["String"]>;
  billing_address: BillingAddressInput;
  created_by?: InputMaybe<Scalars["String"]>;
  customer_number?: InputMaybe<Scalars["String"]>;
  customer_type?: InputMaybe<Scalars["String"]>;
  cutoff_time?: InputMaybe<Scalars["AWSTime"]>;
  delivery_date?: InputMaybe<Scalars["AWSTimestamp"]>;
  delivery_method?: InputMaybe<Scalars["String"]>;
  delivery_time?: InputMaybe<Scalars["AWSTime"]>;
  guided_trial_schedule_date?: InputMaybe<Scalars["AWSTimestamp"]>;
  guided_trial_schedule_time?: InputMaybe<Scalars["AWSTime"]>;
  hard_age_verified?: InputMaybe<Scalars["Boolean"]>;
  invoice_no?: InputMaybe<Scalars["String"]>;
  items?: InputMaybe<Array<OrderItemInput>>;
  lead_source?: InputMaybe<Scalars["String"]>;
  lead_type?: InputMaybe<Scalars["String"]>;
  lending_purchase_status?: InputMaybe<Scalars["String"]>;
  market_place_id?: InputMaybe<Scalars["String"]>;
  note?: InputMaybe<Scalars["String"]>;
  order_id: Scalars["String"];
  order_reason?: InputMaybe<Scalars["String"]>;
  order_reference_number?: InputMaybe<Scalars["String"]>;
  order_type?: InputMaybe<Scalars["String"]>;
  original_guided_trial_schedule_date?: InputMaybe<Scalars["AWSTimestamp"]>;
  original_guided_trial_schedule_time?: InputMaybe<Scalars["AWSTime"]>;
  payment_details?: InputMaybe<PaymentDetailsInput>;
  payment_type?: InputMaybe<Scalars["String"]>;
  pickup_type?: InputMaybe<PickupType>;
  price?: InputMaybe<PriceInput>;
  promo?: InputMaybe<PromoInput>;
  promo_items?: InputMaybe<Array<InputMaybe<OrderItemInput>>>;
  return_date?: InputMaybe<Scalars["AWSTimestamp"]>;
  shipment_type?: InputMaybe<ShipmentType>;
  shipping_address: ShippingAddressInput;
  underwent_guided_trial?: InputMaybe<Scalars["Boolean"]>;
};

export type OrderInventoryItemInput = {
  batch_id?: InputMaybe<Scalars["String"]>;
  charger_serial?: InputMaybe<Scalars["String"]>;
  cycle?: InputMaybe<Scalars["Float"]>;
  gtin?: InputMaybe<Scalars["String"]>;
  holder_serial?: InputMaybe<Scalars["String"]>;
  serial?: InputMaybe<Scalars["String"]>;
  tag?: InputMaybe<Scalars["String"]>;
  unit_of_measure?: InputMaybe<Scalars["String"]>;
};

export type FreeItem = {
  __typename?: "FreeItem";
  gtin?: Maybe<Scalars["String"]>;
  sku?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  qty?: Maybe<Scalars["Int"]>;
}

export type OrderItem = {
  __typename?: "OrderItem";
  batch_items?: Maybe<Array<Maybe<BatchItem>>>;
  charger_returned?: Maybe<Scalars["Boolean"]>;
  delivery_item_number?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  device_return_status?: Maybe<InventoryItemStatus>;
  for_refund_items?: Maybe<Array<Maybe<InventoryItem>>>;
  for_replacement_items?: Maybe<Array<Maybe<InventoryItem>>>;
  gtin?: Maybe<Scalars["String"]>;
  holder_returned?: Maybe<Scalars["Boolean"]>;
  inventory_items?: Maybe<Array<Maybe<InventoryItem>>>;
  item_discounts?: Maybe<Array<Maybe<Discount>>>;
  price_per_unit?: Maybe<Scalars["Float"]>;
  price_per_unit_original?: Maybe<Scalars["Float"]>;
  quantity?: Maybe<Scalars["Int"]>;
  quantity_unit?: Maybe<Scalars["String"]>;
  scanned_quantity?: Maybe<Scalars["Int"]>;
  sku?: Maybe<Scalars["String"]>;
  total?: Maybe<Scalars["Float"]>;
  weight?: Maybe<Scalars["Float"]>;
  is_freebies?: Maybe<Scalars["Boolean"]>;
  free_items?: Maybe<Array<Maybe<FreeItem>>>;
};

export type OrderItemInput = {
  batch_items?: InputMaybe<Array<InputMaybe<BatchItemsInput>>>;
  charger_returned?: InputMaybe<Scalars["Boolean"]>;
  delivery_item_number?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  device_return_status?: InputMaybe<InventoryItemStatus>;
  for_refund_items?: InputMaybe<Array<InputMaybe<OrderInventoryItemInput>>>;
  for_replacement_items?: InputMaybe<
    Array<InputMaybe<OrderInventoryItemInput>>
  >;
  gtin?: InputMaybe<Scalars["String"]>;
  holder_returned?: InputMaybe<Scalars["Boolean"]>;
  inventory_items?: InputMaybe<Array<InputMaybe<OrderInventoryItemInput>>>;
  item_discounts?: InputMaybe<Array<InputMaybe<DiscountInput>>>;
  price_per_unit?: InputMaybe<Scalars["Float"]>;
  price_per_unit_original?: InputMaybe<Scalars["Float"]>;
  quantity?: InputMaybe<Scalars["Int"]>;
  quantity_unit?: InputMaybe<Scalars["String"]>;
  scanned_quantity?: InputMaybe<Scalars["Int"]>;
  sku?: InputMaybe<Scalars["String"]>;
  total?: InputMaybe<Scalars["Float"]>;
  weight?: InputMaybe<Scalars["Float"]>;
};

export type OrderStatistics = {
  __typename?: "OrderStatistics";
  CANCELLED?: Maybe<Scalars["Int"]>;
  COMPLETED?: Maybe<Scalars["Int"]>;
  CREATED?: Maybe<Scalars["Int"]>;
  FAILED?: Maybe<Scalars["Int"]>;
  ON_VALIDATION?: Maybe<Scalars["Int"]>;
  PROCESSED?: Maybe<Scalars["Int"]>;
  RECEIVED?: Maybe<Scalars["Int"]>;
  RETURNED?: Maybe<Scalars["Int"]>;
  SHIPPED?: Maybe<Scalars["Int"]>;
  UNDELIVERED?: Maybe<Scalars["Int"]>;
};

export enum OrderStatus {
  Cancelled = "CANCELLED",
  Completed = "COMPLETED",
  Created = "CREATED",
  Failed = "FAILED",
  OnValidation = "ON_VALIDATION",
  Processed = "PROCESSED",
  Received = "RECEIVED",
  Returned = "RETURNED",
  Shipped = "SHIPPED",
  Undelivered = "UNDELIVERED",
}

export type OrderStatusLogs = {
  __typename?: "OrderStatusLogs";
  status?: Maybe<OrderStatus>;
  status_datetime?: Maybe<Scalars["AWSTimestamp"]>;
  updated_by?: Maybe<Scalars["String"]>;
};

export type OrderUpdateInput = {
  assigned_coach?: InputMaybe<Scalars["String"]>;
  assigned_rider?: InputMaybe<Scalars["String"]>;
  billing_address?: InputMaybe<BillingAddressInput>;
  date_created?: InputMaybe<Scalars["AWSTimestamp"]>;
  date_filter?: InputMaybe<Scalars["String"]>;
  delivery_date?: InputMaybe<Scalars["AWSTimestamp"]>;
  filters?: InputMaybe<Scalars["String"]>;
  guided_trial_schedule_date?: InputMaybe<Scalars["AWSTimestamp"]>;
  guided_trial_schedule_time?: InputMaybe<Scalars["AWSTime"]>;
  invoice_no?: InputMaybe<Scalars["String"]>;
  items?: InputMaybe<Array<InputMaybe<OrderItemInput>>>;
  lead_source?: InputMaybe<Scalars["String"]>;
  lead_type?: InputMaybe<Scalars["String"]>;
  lending_purchase_status?: InputMaybe<Scalars["String"]>;
  note?: InputMaybe<Scalars["String"]>;
  original_guided_trial_schedule_date?: InputMaybe<Scalars["AWSTimestamp"]>;
  original_guided_trial_schedule_time?: InputMaybe<Scalars["AWSTime"]>;
  pickup_type?: InputMaybe<PickupType>;
  promo?: InputMaybe<PromoInput>;
  return_date?: InputMaybe<Scalars["AWSTimestamp"]>;
  shipment_type?: InputMaybe<ShipmentType>;
  shipping_address?: InputMaybe<ShippingAddressInput>;
  underwent_guided_trial?: InputMaybe<Scalars["Boolean"]>;
};

export type PaymentDetails = {
  __typename?: "PaymentDetails";
  account_number?: Maybe<Scalars["String"]>;
  auth_amount?: Maybe<Scalars["String"]>;
  authorisation_code?: Maybe<Scalars["String"]>;
  authorisation_date?: Maybe<Scalars["String"]>;
  authorisation_reference?: Maybe<Scalars["String"]>;
  authorisation_time?: Maybe<Scalars["String"]>;
  bank_account_owner?: Maybe<Scalars["String"]>;
  bank_country?: Maybe<Scalars["String"]>;
  bank_name?: Maybe<Scalars["String"]>;
  bic?: Maybe<Scalars["String"]>;
  card_owner?: Maybe<Scalars["String"]>;
  credit_card?: Maybe<Scalars["String"]>;
  iban_code?: Maybe<Scalars["String"]>;
  payment_token?: Maybe<Scalars["String"]>;
  validation?: Maybe<Scalars["String"]>;
};

export type PaymentDetailsInput = {
  account_number?: InputMaybe<Scalars["String"]>;
  auth_amount?: InputMaybe<Scalars["String"]>;
  authorisation_code?: InputMaybe<Scalars["String"]>;
  authorisation_date?: InputMaybe<Scalars["String"]>;
  authorisation_reference?: InputMaybe<Scalars["String"]>;
  authorisation_time?: InputMaybe<Scalars["String"]>;
  bank_account_owner?: InputMaybe<Scalars["String"]>;
  bank_country?: InputMaybe<Scalars["String"]>;
  bank_name?: InputMaybe<Scalars["String"]>;
  bic?: InputMaybe<Scalars["String"]>;
  card_owner?: InputMaybe<Scalars["String"]>;
  credit_card?: InputMaybe<Scalars["String"]>;
  iban_code?: InputMaybe<Scalars["String"]>;
  payment_token?: InputMaybe<Scalars["String"]>;
  validation?: InputMaybe<Scalars["String"]>;
};

export type PickAndPackInput = {
  gtin: Scalars["String"];
  scanned_quantity: Scalars["Int"];
  serials?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export enum PickupType {
  Customer = "CUSTOMER",
  Store = "STORE",
}

export type Price = {
  __typename?: "Price";
  carrier_gross?: Maybe<Scalars["String"]>;
  currency?: Maybe<Scalars["String"]>;
  discounts?: Maybe<Array<Maybe<Discount>>>;
  gross?: Maybe<Scalars["String"]>;
  gross_original?: Maybe<Scalars["String"]>;
  net?: Maybe<Scalars["String"]>;
  net_original?: Maybe<Scalars["String"]>;
  sub_total_gross?: Maybe<Scalars["String"]>;
  vat_rate?: Maybe<Scalars["String"]>;
  vat_value?: Maybe<Scalars["String"]>;
};

export type PriceInput = {
  carrier_gross?: InputMaybe<Scalars["String"]>;
  currency?: InputMaybe<Scalars["String"]>;
  discounts?: InputMaybe<Array<InputMaybe<DiscountInput>>>;
  gross?: InputMaybe<Scalars["String"]>;
  gross_original?: InputMaybe<Scalars["String"]>;
  net?: InputMaybe<Scalars["String"]>;
  net_original?: InputMaybe<Scalars["String"]>;
  sub_total_gross?: InputMaybe<Scalars["String"]>;
  vat_rate?: InputMaybe<Scalars["String"]>;
  vat_value?: InputMaybe<Scalars["String"]>;
};

export enum PrintType {
  Invoice = "INVOICE",
  Lending = "LENDING",
  LendingReturn = "LENDING_RETURN",
  Transaction = "TRANSACTION",
}

export type Promo = {
  __typename?: "Promo";
  description?: Maybe<Scalars["String"]>;
  heets?: Maybe<Scalars["Int"]>;
  tag?: Maybe<Scalars["String"]>;
  verified?: Maybe<Scalars["Boolean"]>;
};

export type PromoInput = {
  description?: InputMaybe<Scalars["String"]>;
  heets?: InputMaybe<Scalars["Int"]>;
  tag?: InputMaybe<Scalars["String"]>;
  verified?: InputMaybe<Scalars["Boolean"]>;
};

export type PulloutReplacementInput = {
  first_name?: InputMaybe<Scalars["String"]>;
  items?: InputMaybe<Array<InputMaybe<PulloutReplacementItemInput>>>;
  last_name?: InputMaybe<Scalars["String"]>;
  order_id?: InputMaybe<Scalars["String"]>;
  remarks?: InputMaybe<Scalars["String"]>;
  serials?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type PulloutReplacementItem = {
  __typename?: "PulloutReplacementItem";
  gtin?: Maybe<Scalars["String"]>;
  quantity?: Maybe<Scalars["Int"]>;
  serials?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type PulloutReplacementItemInput = {
  gtin?: InputMaybe<Scalars["String"]>;
  quantity?: InputMaybe<Scalars["Int"]>;
  serials?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export enum PurchaseStatus {
  DeclinedToBuy = "DECLINED_TO_BUY",
  InProgress = "IN_PROGRESS",
  ProceededToBuy = "PROCEEDED_TO_BUY",
}

export type Query = {
  __typename?: "Query";
  activeSMSTemplate?: Maybe<SmsTemplate>;
  auditOrders?: Maybe<AuditOrders>;
  customer?: Maybe<Customer>;
  deliveryTracking?: Maybe<DeliveryTracking>;
  fraudCheck?: Maybe<OrderConnection>;
  hybridLeads?: Maybe<HybridLeadConnection>;
  hyperCare?: Maybe<HyperCare>;
  hyperCares?: Maybe<HyperCareConnection>;
  identificationInfo?: Maybe<IdentificationInfo>;
  logisticsOrders?: Maybe<OrderConnection>;
  order?: Maybe<Order>;
  orderStatistics?: Maybe<OrderStatistics>;
  orders?: Maybe<OrderConnection>;
  ordersFailed?: Maybe<OrderFailedConnection>;
  ordersPerRider?: Maybe<OrderConnection>;
  redactLogs?: Maybe<RedactLogConnection>;
  refundOrder?: Maybe<Order>;
  refundOrders?: Maybe<OrderConnection>;
  refundOrdersPerRider?: Maybe<OrderConnection>;
  replacementOrder?: Maybe<Order>;
  replacementOrders?: Maybe<ReplacementOrderConnection>;
  replacementOrdersPerRider?: Maybe<OrderConnection>;
  returnOrder?: Maybe<Order>;
  returnOrderStatistics?: Maybe<ReturnOrderStatistics>;
  returnOrders?: Maybe<OrderConnection>;
  rider?: Maybe<Rider>;
  riders?: Maybe<RiderConnection>;
  smsTemplates?: Maybe<SmsTemplateConnection>;
  wallet?: Maybe<Wallet>;
};

export type QueryAuditOrdersArgs = {
  date_filter?: InputMaybe<DateFilter>;
  rider?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<Scalars["String"]>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryCustomerArgs = {
  id?: InputMaybe<Scalars["String"]>;
};

export type QueryDeliveryTrackingArgs = {
  id?: InputMaybe<Scalars["String"]>;
};

export type QueryFraudCheckArgs = {
  search?: InputMaybe<Scalars["String"]>;
};

export type QueryGetSubWarehouseTaggingArgs = {
  id: Scalars["ID"];
  sort: Scalars["String"];
};

export type QueryHybridLeadsArgs = {
  from: Scalars["AWSTimestamp"];
  rider?: InputMaybe<Scalars["ID"]>;
  to: Scalars["AWSTimestamp"];
};

export type QueryHyperCareArgs = {
  id?: InputMaybe<Scalars["String"]>;
};

export type QueryHyperCaresArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  purchase_status?: InputMaybe<PurchaseStatus>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryIdentificationInfoArgs = {
  email?: InputMaybe<Scalars["AWSEmail"]>;
  phone_number?: InputMaybe<Scalars["AWSPhone"]>;
};

export type QueryLendingOrdersArgs = {
  date_filter?: InputMaybe<DateFilter>;
  lending_status: LendingStatus;
  next_token?: InputMaybe<Scalars["String"]>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryLendingReturnOrdersArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  order_status: OrderStatus;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryLogisticsOrdersArgs = {
  assigned_logistics: Scalars["String"];
  order_status: OrderStatus;
};

export type QueryOrderArgs = {
  id?: InputMaybe<Scalars["String"]>;
};

export type QueryOrderStatisticsArgs = {
  date_filter?: InputMaybe<DateFilter>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryOrdersArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  order_status?: InputMaybe<OrderStatus>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryOrdersFailedArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
};

export type QueryOrdersPerRiderArgs = {
  rider_id?: InputMaybe<Scalars["ID"]>;
};

export type QueryRedactLogsArgs = {
  from?: InputMaybe<Scalars["AWSDate"]>;
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<RedactStatus>;
  to?: InputMaybe<Scalars["AWSDate"]>;
};

export type QueryRefundOrderArgs = {
  id?: InputMaybe<Scalars["String"]>;
};

export type QueryRefundOrdersArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  order_status?: InputMaybe<OrderStatus>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryRefundOrdersPerRiderArgs = {
  rider_id?: InputMaybe<Scalars["ID"]>;
};

export type QueryReplacementOrderArgs = {
  id?: InputMaybe<Scalars["String"]>;
};

export type QueryReplacementOrdersArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  order_status?: InputMaybe<OrderStatus>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryReplacementOrdersPerRiderArgs = {
  rider_id?: InputMaybe<Scalars["ID"]>;
};

export type QueryReturnOrderArgs = {
  id?: InputMaybe<Scalars["String"]>;
};

export type QueryReturnOrderStatisticsArgs = {
  date_filter?: InputMaybe<DateFilter>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryReturnOrdersArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  order_status?: InputMaybe<ReturnOrderStatus>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryRiderArgs = {
  username: Scalars["ID"];
};

export type QueryRidersArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
  rider_status?: InputMaybe<RiderStatus>;
};

export type QuerySmsTemplatesArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
  sms_channel: SmsChannel;
};

export type QueryWalletArgs = {
  username?: InputMaybe<Scalars["ID"]>;
};

export type RedactLog = {
  __typename?: "RedactLog";
  date_affected?: Maybe<Scalars["AWSDate"]>;
  error_log?: Maybe<Scalars["String"]>;
  redaction_date?: Maybe<Scalars["AWSTimestamp"]>;
  status?: Maybe<RedactStatus>;
};

export type RedactLogConnection = {
  __typename?: "RedactLogConnection";
  items?: Maybe<Array<Maybe<RedactLog>>>;
  nextToken?: Maybe<Scalars["String"]>;
};

export enum RedactStatus {
  Failed = "FAILED",
  Success = "SUCCESS",
}

export type ReplacementOrder = {
  __typename?: "ReplacementOrder";
  assigned_warehouse?: Maybe<Scalars["String"]>;
  customer?: Maybe<CustomerInfo>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  doc_type?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  items?: Maybe<Array<Maybe<PulloutReplacementItem>>>;
  order_id?: Maybe<Scalars["String"]>;
  remarks?: Maybe<Scalars["String"]>;
  serials?: Maybe<Array<Maybe<Scalars["String"]>>>;
  status?: Maybe<Scalars["String"]>;
};

export type ReplacementOrderConnection = {
  __typename?: "ReplacementOrderConnection";
  items?: Maybe<Array<Maybe<ReplacementOrder>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type Report = {
  __typename?: "Report";
  error?: Maybe<Scalars["String"]>;
  request_id: Scalars["ID"];
  status?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["AWSURL"]>;
};

export enum ReportType {
  ImsReport = "IMS_REPORT",
  Lending = "LENDING",
  LendingReturns = "LENDING_RETURNS",
  OrderSummary = "ORDER_SUMMARY",
  ReplacementOrders = "REPLACEMENT_ORDERS",
}

export type ReturnOrderStatistics = {
  __typename?: "ReturnOrderStatistics";
  FAILED?: Maybe<Scalars["Int"]>;
  RECEIVED?: Maybe<Scalars["Int"]>;
  RETURNED?: Maybe<Scalars["Int"]>;
};

export enum ReturnOrderStatus {
  Failed = "FAILED",
  Received = "RECEIVED",
  Returned = "RETURNED",
}

export type Rider = {
  __typename?: "Rider";
  address?: Maybe<Scalars["String"]>;
  current_delivery?: Maybe<Scalars["ID"]>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  device_token?: Maybe<Scalars["String"]>;
  geolocation?: Maybe<GeoLocation>;
  hybridlead_enabled?: Maybe<Scalars["Boolean"]>;
  license_expiration_date?: Maybe<Scalars["String"]>;
  license_number?: Maybe<Scalars["String"]>;
  logs?: Maybe<OrderConnection>;
  name?: Maybe<Scalars["String"]>;
  phone_number?: Maybe<Scalars["String"]>;
  rider_status?: Maybe<RiderStatus>;
  user_status?: Maybe<UserStatus>;
  username?: Maybe<Scalars["String"]>;
  wallet?: Maybe<Wallet>;
};

export type RiderConnection = {
  __typename?: "RiderConnection";
  items?: Maybe<Array<Maybe<Rider>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type RiderInput = {
  address: Scalars["String"];
  hybridlead_enabled?: InputMaybe<Scalars["Boolean"]>;
  license_expiration_date: Scalars["String"];
  license_number: Scalars["String"];
  name: Scalars["String"];
  phone_number: Scalars["String"];
  username: Scalars["String"];
};

export type RiderResetPasswordInput = {
  password?: InputMaybe<Scalars["String"]>;
  username: Scalars["String"];
};

export enum RiderStatus {
  Available = "AVAILABLE",
  Notavailable = "NOTAVAILABLE",
}

export type RiderUpdateInput = {
  address?: InputMaybe<Scalars["String"]>;
  device_token?: InputMaybe<Scalars["String"]>;
  hybridlead_enabled?: InputMaybe<Scalars["Boolean"]>;
  license_expiration_date?: InputMaybe<Scalars["String"]>;
  license_number?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  phone_number?: InputMaybe<Scalars["String"]>;
  username: Scalars["String"];
};

export type S3Object = {
  __typename?: "S3Object";
  bucket: Scalars["String"];
  key: Scalars["String"];
  region: Scalars["String"];
};

export type S3ObjectInput = {
  bucket: Scalars["String"];
  key: Scalars["String"];
  localUri?: InputMaybe<Scalars["String"]>;
  mimeType?: InputMaybe<Scalars["String"]>;
  region: Scalars["String"];
};

export type Sms = {
  __typename?: "SMS";
  message?: Maybe<Scalars["String"]>;
  number?: Maybe<Scalars["String"]>;
};

export enum SmsChannel {
  Ecomm = "ECOMM",
  Marketplace = "MARKETPLACE",
}

export type SmsLog = {
  __typename?: "SMSLog";
  message?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["AWSTimestamp"]>;
};

export type SmsTemplate = {
  __typename?: "SMSTemplate";
  created_by?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["AWSTimestamp"]>;
  date_updated?: Maybe<Scalars["AWSTimestamp"]>;
  id?: Maybe<Scalars["ID"]>;
  message?: Maybe<Scalars["String"]>;
  reference_id?: Maybe<Scalars["ID"]>;
  sms_channel?: Maybe<SmsChannel>;
  type?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
};

export type SmsTemplateConnection = {
  __typename?: "SMSTemplateConnection";
  items?: Maybe<Array<Maybe<SmsTemplate>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type SmsTemplateInput = {
  message: Scalars["String"];
  sms_channel: SmsChannel;
  type?: InputMaybe<Scalars["String"]>;
};

export enum ShipmentType {
  Coach = "COACH",
  Rider = "RIDER",
  RiderMarketplace = "RIDER_MARKETPLACE",
  ThirdParty = "THIRD_PARTY",
}

export type ShippingAddress = {
  __typename?: "ShippingAddress";
  address_extention_1?: Maybe<Scalars["String"]>;
  address_extention_2?: Maybe<Scalars["String"]>;
  address_extention_3?: Maybe<Scalars["String"]>;
  address_extention_4?: Maybe<Scalars["String"]>;
  building?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  company?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  digi_code?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  first_name?: Maybe<Scalars["String"]>;
  language?: Maybe<Scalars["String"]>;
  last_name?: Maybe<Scalars["String"]>;
  parcel_shop_id?: Maybe<Scalars["String"]>;
  po_box?: Maybe<Scalars["String"]>;
  region?: Maybe<Scalars["String"]>;
  salutation?: Maybe<Scalars["String"]>;
  sap_number?: Maybe<Scalars["String"]>;
  street?: Maybe<Scalars["String"]>;
  street_number?: Maybe<Scalars["String"]>;
  telephone_number?: Maybe<Scalars["String"]>;
  zip?: Maybe<Scalars["String"]>;
};

export type ShippingAddressInput = {
  address_extention_1?: InputMaybe<Scalars["String"]>;
  address_extention_2?: InputMaybe<Scalars["String"]>;
  address_extention_3?: InputMaybe<Scalars["String"]>;
  address_extention_4?: InputMaybe<Scalars["String"]>;
  building?: InputMaybe<Scalars["String"]>;
  city?: InputMaybe<Scalars["String"]>;
  company?: InputMaybe<Scalars["String"]>;
  country?: InputMaybe<Scalars["String"]>;
  digi_code?: InputMaybe<Scalars["String"]>;
  email?: InputMaybe<Scalars["String"]>;
  first_name?: InputMaybe<Scalars["String"]>;
  language?: InputMaybe<Scalars["String"]>;
  last_name?: InputMaybe<Scalars["String"]>;
  parcel_shop_id?: InputMaybe<Scalars["String"]>;
  po_box?: InputMaybe<Scalars["String"]>;
  region?: InputMaybe<Scalars["String"]>;
  salutation?: InputMaybe<Scalars["String"]>;
  sap_number?: InputMaybe<Scalars["String"]>;
  street?: InputMaybe<Scalars["String"]>;
  street_number?: InputMaybe<Scalars["String"]>;
  telephone_number?: InputMaybe<Scalars["String"]>;
  zip?: InputMaybe<Scalars["String"]>;
};

export type SortInput = {
  attribute?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<SortOrder>;
};

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export type SubWarehouseTagging = {
  __typename?: "SubWarehouseTagging";
  id: Scalars["ID"];
  sort: Scalars["String"];
  tags: Array<Scalars["String"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  deliveryFinished?: Maybe<Order>;
  onReportDownload?: Maybe<Report>;
  orderCreated?: Maybe<Order>;
  orderRiderAssigned?: Maybe<Order>;
};

export type SubscriptionDeliveryFinishedArgs = {
  order_id?: InputMaybe<Scalars["String"]>;
};

export type SubscriptionOnReportDownloadArgs = {
  request_id: Scalars["ID"];
};

export type SubscriptionOrderRiderAssignedArgs = {
  assigned_rider?: InputMaybe<Scalars["String"]>;
};

export enum TrialType {
  ExtendedTrialItems = "EXTENDED_TRIAL_ITEMS",
  GuidedTrialItems = "GUIDED_TRIAL_ITEMS",
  LendingItems = "LENDING_ITEMS",
  PurchaseItems = "PURCHASE_ITEMS",
  TestDriveItems = "TEST_DRIVE_ITEMS",
}

export type UndeliverableInfo = {
  __typename?: "UndeliverableInfo";
  reason?: Maybe<Scalars["String"]>;
  remarks?: Maybe<Scalars["String"]>;
};

export type UndeliverableInput = {
  reason?: InputMaybe<UndeliverableReasons>;
  remarks?: InputMaybe<Scalars["String"]>;
};

export enum UndeliverableReasons {
  AaiRejected = "AAI_REJECTED",
  AddressNotFound = "ADDRESS_NOT_FOUND",
  ChangeOfMind = "CHANGE_OF_MIND",
  CustomerCancelled = "CUSTOMER_CANCELLED",
  CustomerNotAvailable = "CUSTOMER_NOT_AVAILABLE",
  GiidNotMatchPo = "GIID_NOT_MATCH_PO",
  Minor = "MINOR",
  NoGiid = "NO_GIID",
  Others = "OTHERS",
  Rescheduled = "RESCHEDULED",
  TrFakeDevice = "TR_FAKE_DEVICE",
  TrIncomplete = "TR_INCOMPLETE",
  TrMismatch = "TR_MISMATCH",
  TrNotWorking = "TR_NOT_WORKING",
  UndeliveredThirdParty = "UNDELIVERED_THIRD_PARTY",
  Unresponsive = "UNRESPONSIVE",
}

export type UpdateLog = {
  __typename?: "UpdateLog";
  update?: Maybe<Scalars["String"]>;
  update_datetime?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
};

export type UsageData = {
  __typename?: "UsageData";
  charger_cycle?: Maybe<Scalars["Float"]>;
  device_cycle?: Maybe<Scalars["Float"]>;
  holder_cycle?: Maybe<Scalars["Float"]>;
  version?: Maybe<Scalars["String"]>;
};

export type UsageDataInput = {
  charger_cycle?: InputMaybe<Scalars["Float"]>;
  device_cycle?: InputMaybe<Scalars["Float"]>;
  holder_cycle?: InputMaybe<Scalars["Float"]>;
  version?: InputMaybe<Scalars["String"]>;
};

export type UsageHistory = {
  __typename?: "UsageHistory";
  post?: Maybe<UsageData>;
  pre?: Maybe<UsageData>;
};

export type UsageHistoryInput = {
  order_id?: InputMaybe<Scalars["String"]>;
  post?: InputMaybe<UsageDataInput>;
  pre?: InputMaybe<UsageDataInput>;
  return_order_id?: InputMaybe<Scalars["String"]>;
};

export enum UserStatus {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

export enum VerificationStatus {
  Cancelled = "CANCELLED",
  ChangeAddress = "CHANGE_ADDRESS",
  CsCancelled = "CS_CANCELLED",
  Flagged = "FLAGGED",
  Unverified = "UNVERIFIED",
  Verified = "VERIFIED",
  Vip = "VIP",
}

export type Wallet = {
  __typename?: "Wallet";
  balance?: Maybe<Scalars["Float"]>;
  logs?: Maybe<WalletTransactionConnection>;
};

export type WalletTransaction = {
  __typename?: "WalletTransaction";
  amount?: Maybe<Scalars["Float"]>;
  balance?: Maybe<Scalars["Float"]>;
  from_user?: Maybe<Scalars["ID"]>;
  prev_balance?: Maybe<Scalars["Float"]>;
  timestamp?: Maybe<Scalars["AWSTimestamp"]>;
  to_user?: Maybe<Scalars["ID"]>;
  transaction_by?: Maybe<Scalars["ID"]>;
  type?: Maybe<WalletTransactionType>;
};

export type WalletTransactionConnection = {
  __typename?: "WalletTransactionConnection";
  items?: Maybe<Array<Maybe<WalletTransaction>>>;
  nextToken?: Maybe<Scalars["String"]>;
};

export enum WalletTransactionType {
  Deposit = "DEPOSIT",
  Payment = "PAYMENT",
  Remittance = "REMITTANCE",
  Transfer = "TRANSFER",
  Withdrawal = "WITHDRAWAL",
}

