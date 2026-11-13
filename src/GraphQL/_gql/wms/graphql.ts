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

export type Accounts = {
  __typename?: "Accounts";
  cod?: Maybe<Scalars["String"]>;
  non_cod?: Maybe<Scalars["String"]>;
};

export type AccountsInput = {
  cod?: InputMaybe<Scalars["String"]>;
  non_cod?: InputMaybe<Scalars["String"]>;
};

export type Admin = {
  __typename?: "Admin";
  channel?: Maybe<ChannelType>;
  email?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  office_id?: Maybe<Scalars["String"]>;
  office_ids?: Maybe<Array<Maybe<Scalars["String"]>>>;
  office_name?: Maybe<Scalars["String"]>;
  phone_number?: Maybe<Scalars["String"]>;
  roles?: Maybe<Array<Maybe<Role>>>;
  user_status?: Maybe<UserStatus>;
  username?: Maybe<Scalars["String"]>;
  wallet?: Maybe<Wallet>;
};

export type FOMLogs = {
  id?: Maybe<Scalars["String"]>;
  action?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  fom_username?: Maybe<Scalars["String"]>;
  se_username?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["String"]>;
  from_warehouse?: Maybe<FOMLogsWarehouse>;
  to_warehouse?: Maybe<FOMLogsWarehouse>;
  __typename?: "LOGS";
};

export type FOMLogsWarehouse = {
  id?: Maybe<Scalars["String"]>;
  warehouse_name?: Maybe<Scalars["String"]>;
  __typename?: "Warehouse";
};

export type AdminConnection = {
  __typename?: "AdminConnection";
  items?: Maybe<Array<Maybe<Admin>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type AdminInput = {
  channel?: InputMaybe<ChannelType>;
  email: Scalars["String"];
  name: Scalars["String"];
  office_id: Scalars["String"];
  office_ids?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  office_name: Scalars["String"];
  phone_number: Scalars["String"];
  roles: Array<InputMaybe<Role>>;
  username?: InputMaybe<Scalars["String"]>;
};

export type AdminUpdateInput = {
  channel?: InputMaybe<ChannelType>;
  email?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  office_id?: InputMaybe<Scalars["String"]>;
  office_ids?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  office_name?: InputMaybe<Scalars["String"]>;
  phone_number?: InputMaybe<Scalars["String"]>;
  roles?: InputMaybe<Array<InputMaybe<Role>>>;
  username: Scalars["String"];
};

export enum AssetType {
  Photo = "PHOTO",
  Video = "VIDEO",
}

export enum AttendanceType {
  TimeIn = "TIME_IN",
  TimeOut = "TIME_OUT",
}

export type Batch = {
  __typename?: "Batch";
  available?: Maybe<Scalars["Int"]>;
  batch_no?: Maybe<Scalars["String"]>;
  blocked?: Maybe<Scalars["Int"]>;
  quantity?: Maybe<Scalars["Int"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
};

export type BatchConversionItems = IBatchItems & {
  __typename?: "BatchConversionItems";
  batch_id?: Maybe<Scalars["String"]>;
  batches?: Maybe<Array<Maybe<BatchItems>>>;
  conversion_id?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  destination_sku?: Maybe<DestinationSku>;
  expiration_date?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  inventory?: Maybe<InventoryItemConnection>;
  multiplier?: Maybe<Scalars["Float"]>;
  quantity?: Maybe<Scalars["Int"]>;
  sku?: Maybe<Scalars["String"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type BatchItems = IBatchItems & {
  __typename?: "BatchItems";
  batch_id?: Maybe<Scalars["String"]>;
  committed?: Maybe<Scalars["Int"]>;
  description?: Maybe<Scalars["String"]>;
  expiration_date?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  inventory?: Maybe<InventoryItemConnection>;
  inventory_type?: Maybe<Scalars["String"]>;
  pullout?: Maybe<Scalars["Int"]>;
  quantity?: Maybe<Scalars["Int"]>;
  released?: Maybe<Scalars["Int"]>;
  returned?: Maybe<Scalars["Int"]>;
  sku?: Maybe<Scalars["String"]>;
  transferred?: Maybe<Scalars["Int"]>;
  transferred_out?: Maybe<Scalars["Int"]>;
  transmittal?: Maybe<Scalars["Int"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type BatchItemsConnection = {
  __typename?: "BatchItemsConnection";
  items?: Maybe<Array<Maybe<BatchItems>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type BatchItemsInput = {
  batch_id: Scalars["String"];
  channel?: InputMaybe<ChannelType>;
  expiration_date?: InputMaybe<Scalars["String"]>;
  gtin: Scalars["String"];
  input_by?: InputMaybe<Scalars["String"]>;
  manufacturing_date?: InputMaybe<Scalars["String"]>;
  quantity: Scalars["Int"];
  received?: InputMaybe<Scalars["Int"]>;
};

export type BatchPulloutItems = IBatchItems & {
  __typename?: "BatchPulloutItems";
  batch_id?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  expiration_date?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  inventory?: Maybe<InventoryItemConnection>;
  pullout_id?: Maybe<Scalars["String"]>;
  quantity?: Maybe<Scalars["Int"]>;
  sku?: Maybe<Scalars["String"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type BatchReturnItems = IBatchItems & {
  __typename?: "BatchReturnItems";
  batch_id?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  expiration_date?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  inventory?: Maybe<InventoryItemConnection>;
  quantity?: Maybe<Scalars["Int"]>;
  return_id?: Maybe<Scalars["String"]>;
  sku?: Maybe<Scalars["String"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type BatchTransferItems = IBatchItems & {
  __typename?: "BatchTransferItems";
  batch_id?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  expiration_date?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  inventory?: Maybe<InventoryItemConnection>;
  quantity?: Maybe<Scalars["Int"]>;
  received?: Maybe<Scalars["Int"]>;
  sku?: Maybe<Scalars["String"]>;
  transfer_id?: Maybe<Scalars["String"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type BatchTransmittalItems = IBatchItems & {
  __typename?: "BatchTransmittalItems";
  batch_id?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  expiration_date?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  inventory?: Maybe<InventoryItemConnection>;
  quantity?: Maybe<Scalars["Int"]>;
  recon_id?: Maybe<Scalars["String"]>;
  sku?: Maybe<Scalars["String"]>;
  transmittal_id?: Maybe<Scalars["String"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type CategoryItem = {
  __typename?: "CategoryItem";
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  value?: Maybe<Scalars["String"]>;
};

export type CategoryItemInput = {
  title?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["String"]>;
};

export enum ChannelType {
  DirectRetail = "DIRECT_RETAIL",
  IndirectChannel = "INDIRECT_CHANNEL",
  Ecomm = "ECOMM",
  FullAdmin = "FULL_ADMIN",
  HRChannel = "HR_CHANNEL",
}

export enum ClubStatus {
  Gold = "GOLD",
  Na = "NA",
  NotAMember = "NOT_A_MEMBER",
  Platinum = "PLATINUM",
  Silver = "SILVER",
}

export type Coach = {
  __typename?: "Coach";
  coach_id?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  phone_number?: Maybe<Scalars["String"]>;
  user_status?: Maybe<UserStatus>;
};

export type CoachConnection = {
  __typename?: "CoachConnection";
  items?: Maybe<Array<Maybe<Coach>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type CoachInput = {
  coach_id: Scalars["String"];
  email: Scalars["String"];
  name: Scalars["String"];
  phone_number: Scalars["String"];
};

export type CoachUpdateInput = {
  coach_id: Scalars["String"];
  email: Scalars["String"];
  name: Scalars["String"];
  phone_number: Scalars["String"];
  user_status: UserStatus;
};

export type Conversion = ITransaction & {
  __typename?: "Conversion";
  batch_items?: Maybe<Array<Maybe<BatchConversionItems>>>;
  created_by?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  invoice_id?: Maybe<Scalars["String"]>;
  remarks?: Maybe<Scalars["String"]>;
  status?: Maybe<TransactionStatus>;
  time?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type ConversionConnection = {
  __typename?: "ConversionConnection";
  items?: Maybe<Array<Maybe<Conversion>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type ConversionInput = {
  date?: InputMaybe<Scalars["String"]>;
  invoice_id?: InputMaybe<Scalars["String"]>;
  remarks?: InputMaybe<Scalars["String"]>;
  time?: InputMaybe<Scalars["String"]>;
  warehouse_id: Scalars["ID"];
};

export type ConversionUpdateInput = {
  channel?: InputMaybe<ChannelType>;
  date?: InputMaybe<Scalars["String"]>;
  id: Scalars["String"];
  invoice_id?: InputMaybe<Scalars["String"]>;
  remarks?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
  time?: InputMaybe<Scalars["String"]>;
};

export type ConvertItemsInput = {
  channel: ChannelType;
  destination_gtin: Scalars["String"];
  gtin: Scalars["String"];
  input_by?: InputMaybe<Scalars["String"]>;
  multiplier: Scalars["Float"];
  quantity: Scalars["Int"];
};

export type CustomDateFilter = {
  attribute?: InputMaybe<Scalars["String"]>;
  from?: InputMaybe<Scalars["String"]>;
  to?: InputMaybe<Scalars["String"]>;
};

export type CustomFilter = {
  attribute?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["String"]>;
};

export type CustomerInformation = {
  __typename?: "CustomerInformation";
  email?: Maybe<Scalars["String"]>;
  first_name?: Maybe<Scalars["String"]>;
  last_name?: Maybe<Scalars["String"]>;
  mobile_number?: Maybe<Scalars["String"]>;
};

export type CustomerInformationInput = {
  email?: InputMaybe<Scalars["String"]>;
  first_name?: InputMaybe<Scalars["String"]>;
  last_name?: InputMaybe<Scalars["String"]>;
  mobile_number?: InputMaybe<Scalars["String"]>;
};

export type DateFilter = {
  from?: InputMaybe<Scalars["String"]>;
  to?: InputMaybe<Scalars["String"]>;
};

export type DeleteResponse = {
  __typename?: "DeleteResponse";
  message?: Maybe<Scalars["String"]>;
};

export type DestinationSku = {
  __typename?: "DestinationSku";
  description?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  sku?: Maybe<Scalars["String"]>;
  unit_of_measure?: Maybe<Scalars["String"]>;
};

export type DirectTransfer = ITransaction & {
  __typename?: "DirectTransfer";
  batch_items?: Maybe<Array<Maybe<BatchTransferItems>>>;
  bundle_count?: Maybe<Scalars["Int"]>;
  created_by?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  invoice_id?: Maybe<Scalars["String"]>;
  logs?: Maybe<Array<Maybe<TransactionLog>>>;
  reason_for_cancel?: Maybe<Scalars["String"]>;
  remarks?: Maybe<Scalars["String"]>;
  status?: Maybe<TransactionStatus>;
  to_warehouse_id?: Maybe<Scalars["String"]>;
  transfer_type?: Maybe<DirectTransferType>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
  delivery_type: Maybe<Scalars["String"]>;
  box_count: Maybe<Scalars["Int"]>;
};

export type DirectTransferConnection = {
  __typename?: "DirectTransferConnection";
  items?: Maybe<Array<Maybe<DirectTransfer>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type DirectTransferInput = {
  box_count?: InputMaybe<Scalars["Int"]>;
  bundle_count?: InputMaybe<Scalars["Int"]>;
  delivery_type?: InputMaybe<Scalars["String"]>;
  remarks?: InputMaybe<Scalars["String"]>;
  to_warehouse_id?: InputMaybe<Scalars["String"]>;
  transfer_type: DirectTransferType;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export enum DirectTransferType {
  EcommToRetail = "ECOMM_TO_RETAIL",
  RetailToEcomm = "RETAIL_TO_ECOMM",
}

export enum DiscountType {
  Cart = "CART",
  LineItem = "LINE_ITEM",
}

export type EndOfDay = {
  __typename?: "EndOfDay";
  created_by?: Maybe<Scalars["ID"]>;
  date_created?: Maybe<Scalars["AWSTimestamp"]>;
  datetime?: Maybe<Scalars["AWSTimestamp"]>;
  finance_declarations?: Maybe<FinanceDecarations>;
  id?: Maybe<Scalars["ID"]>;
  invoice_id?: Maybe<Scalars["ID"]>;
  non_sellable_declarations?: Maybe<Array<Maybe<NonSellableItem>>>;
  warehouse_id?: Maybe<Scalars["ID"]>;
};

export type EndOfDayConnection = {
  __typename?: "EndOfDayConnection";
  items?: Maybe<Array<Maybe<EndOfDay>>>;
  nextToken?: Maybe<Scalars["String"]>;
};

export type EndOfDayInput = {
  created_by: Scalars["ID"];
  datetime: Scalars["AWSTimestamp"];
  finance_declarations?: InputMaybe<FinanceDecarationsInput>;
  invoice_id: Scalars["ID"];
  non_sellable_declarations?: InputMaybe<
    Array<InputMaybe<NonSellableItemInput>>
  >;
  warehouse_id: Scalars["ID"];
};

export type FilterInput = {
  attribute?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["String"]>;
};

export type FinanceDecarations = {
  __typename?: "FinanceDecarations";
  proof_of_payment?: Maybe<ProofOfPayment>;
  sales_summary?: Maybe<SalesSummary>;
  upload_slip?: Maybe<UploadSlip>;
  uploads?: Maybe<UploadReceipts>;
};

export type FinanceDecarationsInput = {
  proof_of_payment?: InputMaybe<ProofOfPaymentInput>;
  sales_summary?: InputMaybe<SalesSummaryInput>;
  upload_slip?: InputMaybe<UploadSlipInput>;
  uploads?: InputMaybe<UploadReceiptsInput>;
};

export type FootTraffic = {
  __typename?: "FootTraffic";
  count?: Maybe<Scalars["Int"]>;
  date?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["ID"]>;
};

export type FootTrafficConnection = {
  __typename?: "FootTrafficConnection";
  items?: Maybe<Array<Maybe<FootTraffic>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type GeoLocation = {
  __typename?: "GeoLocation";
  latitude?: Maybe<Scalars["Float"]>;
  longitude?: Maybe<Scalars["Float"]>;
};

export type GeoLocationInput = {
  latitude?: InputMaybe<Scalars["Float"]>;
  longitude?: InputMaybe<Scalars["Float"]>;
};

export type GuidedTrial = {
  __typename?: "GuidedTrial";
  created_by?: Maybe<Scalars["ID"]>;
  customer_information?: Maybe<CustomerInformation>;
  date_created?: Maybe<Scalars["AWSTimestamp"]>;
  date_updated?: Maybe<Scalars["AWSTimestamp"]>;
  device?: Maybe<Scalars["String"]>;
  first_time_gt?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["ID"]>;
  items?: Maybe<Array<Maybe<LineItem>>>;
  sales_transaction?: Maybe<SaleTransaction>;
  sales_transaction_id?: Maybe<Scalars["ID"]>;
  sgt?: Maybe<Scalars["Boolean"]>;
  type?: Maybe<GuidedTrialType>;
  updated_by?: Maybe<Scalars["ID"]>;
  warehouse_id?: Maybe<Scalars["ID"]>;
};

export type GuidedTrialConnection = {
  __typename?: "GuidedTrialConnection";
  items?: Maybe<Array<Maybe<GuidedTrial>>>;
  nextToken?: Maybe<Scalars["String"]>;
};

export type GuidedTrialInput = {
  created_by?: InputMaybe<Scalars["String"]>;
  customer_information?: InputMaybe<CustomerInformationInput>;
  date_created?: InputMaybe<Scalars["AWSTimestamp"]>;
  device?: InputMaybe<Scalars["String"]>;
  first_time_gt?: InputMaybe<Scalars["Boolean"]>;
  items?: InputMaybe<Array<InputMaybe<LineItemInput>>>;
  remarks?: InputMaybe<Scalars["String"]>;
  sales_expert?: InputMaybe<Scalars["String"]>;
  sales_transaction?: InputMaybe<SaleTransactionInput>;
  sgt?: InputMaybe<Scalars["Boolean"]>;
  type?: InputMaybe<GuidedTrialType>;
  warehouse_id?: InputMaybe<Scalars["ID"]>;
};

export enum GuidedTrialType {
  Gt = "GT",
  GtRs = "GT_RS",
}

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

export type ITransaction = {
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  invoice_id?: Maybe<Scalars["String"]>;
  remarks?: Maybe<Scalars["String"]>;
  status?: Maybe<TransactionStatus>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type InventoryCheckInput = {
  gtin?: InputMaybe<Scalars["String"]>;
  quantity?: InputMaybe<Scalars["Int"]>;
  warehouse_id: Scalars["ID"];
};

export type InventoryItem = {
  __typename?: "InventoryItem";
  batch_id?: Maybe<Scalars["String"]>;
  charger_serial?: Maybe<Scalars["String"]>;
  cycle?: Maybe<Scalars["Float"]>;
  cycle_history?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  delivery_source?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  expiration_date?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  holder_serial?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  issue_date?: Maybe<Scalars["String"]>;
  item_status?: Maybe<InventoryItemStatus>;
  lead_id?: Maybe<Scalars["String"]>;
  location?: Maybe<Scalars["String"]>;
  manufacturing_date?: Maybe<Scalars["String"]>;
  order_history?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  order_id?: Maybe<Scalars["String"]>;
  pullout_id?: Maybe<Scalars["String"]>;
  recon_id?: Maybe<Scalars["String"]>;
  reconcile_count?: Maybe<Scalars["Int"]>;
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
  charger_serial?: InputMaybe<Scalars["String"]>;
  gtin: Scalars["String"];
  holder_serial?: InputMaybe<Scalars["String"]>;
  serial: Scalars["String"];
  tag?: InputMaybe<Scalars["String"]>;
  transmittal_id: Scalars["String"];
  type?: InputMaybe<Scalars["String"]>;
};

export enum InventoryItemStatus {
  Available = "AVAILABLE",
  Damaged = "DAMAGED",
  Loss = "LOSS",
  Pending = "PENDING",
  Pullout = "PULLOUT",
  Redeemed = "REDEEMED",
  Released = "RELEASED",
}

export type ItemStocks = {
  __typename?: "ItemStocks";
  gtin?: Maybe<Scalars["String"]>;
  quantity?: Maybe<Scalars["Int"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export enum LeadSource {
  PersonalNetwork = "PERSONAL_NETWORK",
  WalkIn = "WALK_IN",
}

export enum LendingSalesType {
  Lending = "LENDING",
  ReturnLending = "RETURN_LENDING",
}

export type LineItem = {
  __typename?: "LineItem";
  discount?: Maybe<Scalars["Float"]>;
  input?: Maybe<Scalars["String"]>;
  inputs?: Maybe<Array<Maybe<Scalars["String"]>>>;
  is_promo_good?: Maybe<Scalars["Boolean"]>;
  menthol_variant?: Maybe<MentholVariant>;
  price?: Maybe<Scalars["Float"]>;
  promo?: Maybe<Scalars["ID"]>;
  promo_discount?: Maybe<Scalars["Float"]>;
  promo_type?: Maybe<Scalars["String"]>;
  quantity?: Maybe<Scalars["Int"]>;
  serials?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  sku?: Maybe<Sku>;
};

export type LineItemInput = {
  discount?: InputMaybe<Scalars["Float"]>;
  gtin: Scalars["ID"];
  inputs?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  is_promo_good?: InputMaybe<Scalars["Boolean"]>;
  lead_source?: InputMaybe<LeadSource>;
  menthol_variant?: InputMaybe<MentholVariant>;
  price?: InputMaybe<Scalars["Float"]>;
  promo?: InputMaybe<Scalars["ID"]>;
  promo_discount?: InputMaybe<Scalars["Float"]>;
  promo_type?: InputMaybe<Scalars["String"]>;
  quantity?: InputMaybe<Scalars["Int"]>;
  serials?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  sku?: InputMaybe<SkuInput>;
};

export type Material = {
  __typename?: "Material";
  material_number?: Maybe<Scalars["String"]>;
  plants?: Maybe<Array<Maybe<Plant>>>;
  sellable?: Maybe<Scalars["Int"]>;
};

export enum MentholVariant {
  Menthol = "MENTHOL",
  NonMenthol = "NON_MENTHOL",
}

export type Message = {
  __typename?: "Message";
  message?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  adminCreate?: Maybe<Admin>;
  adminUpdate?: Maybe<Admin>;
  assetUpload?: Maybe<Message>;
  coachCreate?: Maybe<Coach>;
  coachUpdate?: Maybe<Coach>;
  conversionCreate?: Maybe<Conversion>;
  conversionUpdate?: Maybe<Conversion>;
  convertByBatch?: Maybe<Conversion>;
  convertByBatchVoid?: Maybe<Conversion>;
  directTransferCreate?: Maybe<DirectTransfer>;
  directTransferUpdate?: Maybe<DirectTransfer>;
  endOfDayCreate?: Maybe<EndOfDay>;
  footTrafficCreate?: Maybe<FootTraffic>;
  guidedTrialCreate?: Maybe<GuidedTrial>;
  inventoryReconcile?: Maybe<InventoryItem>;
  promoCreate?: Maybe<Promo>;
  promoUpdate?: Maybe<Promo>;
  pulloutByBatch?: Maybe<Pullout>;
  pulloutByBatches?: Maybe<Pullout>;
  pulloutCreate?: Maybe<Pullout>;
  pulloutItem?: Maybe<InventoryItem>;
  pulloutItemVoid?: Maybe<Pullout>;
  pulloutUpdate?: Maybe<Pullout>;
  reconByBatch?: Maybe<Transmittal>;
  reconByBatches?: Maybe<Pullout>;
  reconCreate?: Maybe<Transmittal>;
  reconUpdate?: Maybe<Transmittal>;
  refundTransactionRecord?: Maybe<SaleTransaction>;
  refundTransactionRemove?: Maybe<SaleTransaction>;
  refundTransactionUpdate?: Maybe<SaleTransaction>;
  reportDownload?: Maybe<Report>;
  reportRequest?: Maybe<Report>;
  returnByBatch?: Maybe<Return>;
  returnByBatches?: Maybe<Return>;
  returnCreate?: Maybe<Return>;
  returnItem?: Maybe<InventoryItem>;
  returnItemVoid?: Maybe<Return>;
  returnUpdate?: Maybe<Return>;
  saleTransactionRecord?: Maybe<SaleTransaction>;
  saleTransactionRemove?: Maybe<SaleTransaction>;
  saleTransactionUpdate?: Maybe<SaleTransaction>;
  salesExpertCreate?: Maybe<SalesExpert>;
  salesExpertDelete?: Maybe<SalesExpert>;
  salesExpertUpdate?: Maybe<SalesExpert>;
  sftpStocks?: Maybe<Message>;
  skuBlockUpdate?: Maybe<SkuBlockLogs>;
  skuCreate?: Maybe<Sku>;
  skuUpdate?: Maybe<Sku>;
  theftCreate?: Maybe<Theft>;
  thresholdConfigCreate?: Maybe<ThresholdConfig>;
  thresholdConfigRemove?: Maybe<ThresholdConfig>;
  thresholdConfigUpdate?: Maybe<ThresholdConfig>;
  transactionRemove?: Maybe<Transmittal>;
  transferByBatch?: Maybe<Transfer>;
  transferByBatchReceive?: Maybe<Transfer>;
  transferCancel?: Maybe<Transfer>;
  transferCreate?: Maybe<Transfer>;
  transferItem?: Maybe<InventoryItem>;
  transferItemReceive?: Maybe<InventoryItem>;
  transferItemReceiveVoid?: Maybe<Transfer>;
  transferItemVoid?: Maybe<Transfer>;
  transferUpdate?: Maybe<Transfer>;
  transmitByBatch?: Maybe<Transmittal>;
  transmitItem?: Maybe<InventoryItem>;
  transmitItemVoid?: Maybe<Transmittal>;
  transmittalCreate?: Maybe<Transmittal>;
  transmittalUpdate?: Maybe<Transmittal>;
  updateDeviceExpiration?: Maybe<BatchItems>;
  updateWarehouseStatus?: Maybe<Warehouse>;
  uploadSales?: Maybe<Scalars["ID"]>;
  userDisable?: Maybe<Admin>;
  userEnable?: Maybe<Admin>;
  validateUpload?: Maybe<SalesUpload>;
  voucherRedeem?: Maybe<Message>;
  voucherRequest?: Maybe<VoucherRequest>;
  voucherRequestUpdate?: Maybe<VoucherRequest>;
  warehouseCreate?: Maybe<Warehouse>;
  warehouseUpdate?: Maybe<Warehouse>;
};

export type MutationAdminCreateArgs = {
  input?: InputMaybe<AdminInput>;
};

export type MutationAdminUpdateArgs = {
  input?: InputMaybe<AdminUpdateInput>;
};

export type MutationAssetUploadArgs = {
  asset: S3ObjectInput;
  asset_type: AssetType;
  record_no: Scalars["ID"];
  ref_id: Scalars["ID"];
};

export type MutationCoachCreateArgs = {
  input?: InputMaybe<CoachInput>;
};

export type MutationCoachUpdateArgs = {
  input?: InputMaybe<CoachUpdateInput>;
};

export type MutationConversionCreateArgs = {
  id?: InputMaybe<Scalars["String"]>;
  input?: InputMaybe<ConversionInput>;
};

export type MutationConversionUpdateArgs = {
  input?: InputMaybe<ConversionUpdateInput>;
};

export type MutationConvertByBatchArgs = {
  conversion_id: Scalars["String"];
  input?: InputMaybe<ConvertItemsInput>;
};

export type MutationConvertByBatchVoidArgs = {
  conversion_id: Scalars["String"];
  input?: InputMaybe<ConvertItemsInput>;
};

export type MutationDeleteDraftedTransactionArgs = {
  id: Scalars["String"];
};

export type MutationDirectTransferCreateArgs = {
  id?: InputMaybe<Scalars["String"]>;
  input?: InputMaybe<DirectTransferInput>;
};

export type MutationDirectTransferUpdateArgs = {
  input?: InputMaybe<TransferUpdateInput>;
};

export type MutationEndOfDayCreateArgs = {
  input: EndOfDayInput;
};

export type MutationFootTrafficCreateArgs = {
  count: Scalars["Int"];
  date: Scalars["String"];
  warehouse_id: Scalars["ID"];
};

export type MutationGuidedTrialCreateArgs = {
  input: GuidedTrialInput;
};

export type MutationInventoryReconcileArgs = {
  input?: InputMaybe<ReconcileInput>;
};

export type MutationPromoCreateArgs = {
  code: Scalars["ID"];
  description?: InputMaybe<Scalars["String"]>;
  discount?: InputMaybe<Scalars["Float"]>;
  discount_type?: InputMaybe<DiscountType>;
  name: Scalars["String"];
  type?: InputMaybe<PromoType>;
};

export type MutationPromoUpdateArgs = {
  code: Scalars["ID"];
  description?: InputMaybe<Scalars["String"]>;
  discount?: InputMaybe<Scalars["Float"]>;
  discount_type?: InputMaybe<DiscountType>;
  name?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<PromoStatus>;
  type?: InputMaybe<PromoType>;
};

export type MutationPulloutByBatchArgs = {
  input?: InputMaybe<BatchItemsInput>;
  pullout_id: Scalars["String"];
};

export type MutationPulloutByBatchesArgs = {
  input?: InputMaybe<Array<InputMaybe<BatchItemsInput>>>;
  pullout_id: Scalars["String"];
};

export type MutationPulloutCreateArgs = {
  id?: InputMaybe<Scalars["String"]>;
  input?: InputMaybe<PulloutInput>;
};

export type MutationPulloutItemArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  pullout_id: Scalars["String"];
  serial: Scalars["String"];
  type?: InputMaybe<Scalars["String"]>;
};

export type MutationPulloutItemVoidArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  pullout_id: Scalars["String"];
  serial?: InputMaybe<Scalars["String"]>;
};

export type MutationPulloutUpdateArgs = {
  input?: InputMaybe<PulloutUpdateInput>;
};

export type MutationReconByBatchArgs = {
  input?: InputMaybe<BatchItemsInput>;
  recon_id: Scalars["String"];
};

export type MutationReconByBatchesArgs = {
  input?: InputMaybe<Array<InputMaybe<BatchItemsInput>>>;
  recon_id: Scalars["String"];
};

export type MutationReconCreateArgs = {
  id?: InputMaybe<Scalars["String"]>;
  input?: InputMaybe<TransmittalInput>;
};

export type MutationReconUpdateArgs = {
  input?: InputMaybe<TransmittalUpdateInput>;
};

export type MutationRefundTransactionRecordArgs = {
  input: RefundTransactionInput;
};

export type MutationRefundTransactionRemoveArgs = {
  transaction_id: Scalars["ID"];
};

export type MutationRefundTransactionUpdateArgs = {
  input: RefundTransactionInput;
  transaction_id: Scalars["ID"];
};

export type MutationReportDownloadArgs = {
  error?: InputMaybe<Scalars["String"]>;
  request_id: Scalars["ID"];
  status?: InputMaybe<Scalars["String"]>;
  url?: InputMaybe<Scalars["AWSURL"]>;
};

export type MutationReportRequestArgs = {
  channel?: InputMaybe<ChannelType>;
  date_filter?: InputMaybe<DateFilter>;
  request_id: Scalars["ID"];
  status?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<ReportType>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
  warehouse_ids?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type MutationReturnByBatchArgs = {
  input?: InputMaybe<BatchItemsInput>;
  return_id: Scalars["String"];
};

export type MutationReturnByBatchesArgs = {
  input?: InputMaybe<Array<InputMaybe<BatchItemsInput>>>;
  return_id: Scalars["String"];
};

export type MutationReturnCreateArgs = {
  id?: InputMaybe<Scalars["String"]>;
  input?: InputMaybe<ReturnInput>;
};

export type MutationReturnItemArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  return_id: Scalars["String"];
  serial: Scalars["String"];
};

export type MutationReturnItemVoidArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  return_id: Scalars["String"];
  serial?: InputMaybe<Scalars["String"]>;
};

export type MutationReturnLendingSaleTransactionCreateArgs = {
  serial: Scalars["ID"];
  warehouse_id: Scalars["ID"];
};

export type MutationReturnUpdateArgs = {
  input?: InputMaybe<ReturnUpdateInput>;
};

export type MutationSaleTransactionRecordArgs = {
  input: SaleTransactionInput;
};

export type MutationSaleTransactionRemoveArgs = {
  transaction_id: Scalars["ID"];
};

export type MutationSaleTransactionUpdateArgs = {
  input: SaleTransactionInput;
  transaction_id: Scalars["ID"];
};

export type MutationSalesExpertCreateArgs = {
  input?: InputMaybe<SalesExpertInput>;
};

export type MutationSalesExpertDeleteArgs = {
  sales_expert_id: Scalars["String"];
};

export type MutationSalesExpertUpdateArgs = {
  input?: InputMaybe<SalesExpertUpdateInput>;
};

export type MutationSkuBlockUpdateArgs = {
  input?: InputMaybe<SkuBlockInput>;
};

export type MutationSkuCreateArgs = {
  input: SkuInput;
};

export type MutationSkuUpdateArgs = {
  input: SkuInput;
};

export type MutationTheftCreateArgs = {
  input?: InputMaybe<TheftInput>;
  warehouse_id: Scalars["ID"];
};

export type MutationThresholdConfigCreateArgs = {
  input?: InputMaybe<ThresholdConfigInput>;
};

export type MutationThresholdConfigRemoveArgs = {
  warehouse_id: Scalars["ID"];
};

export type MutationThresholdConfigUpdateArgs = {
  input?: InputMaybe<ThresholdConfigInput>;
};

export type MutationTransactionRemoveArgs = {
  id?: InputMaybe<Scalars["String"]>;
};

export type MutationTransferByBatchArgs = {
  input?: InputMaybe<BatchItemsInput>;
  transfer_id: Scalars["String"];
};

export type MutationTransferByBatchReceiveArgs = {
  input?: InputMaybe<BatchItemsInput>;
  transfer_id: Scalars["String"];
};

export type MutationTransferCancelArgs = {
  id: Scalars["String"];
  reason_for_cancel?: InputMaybe<Scalars["String"]>;
};

export type MutationTransferCreateArgs = {
  id?: InputMaybe<Scalars["String"]>;
  input?: InputMaybe<TransferInput>;
};

export type MutationTransferItemArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  serial: Scalars["String"];
  transfer_id: Scalars["String"];
  type?: InputMaybe<Scalars["String"]>;
};

export type MutationTransferItemReceiveArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  serial: Scalars["String"];
  transfer_id: Scalars["String"];
  type?: InputMaybe<Scalars["String"]>;
};

export type MutationTransferItemReceiveVoidArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  serial?: InputMaybe<Scalars["String"]>;
  transfer_id: Scalars["String"];
};

export type MutationTransferItemVoidArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  serial?: InputMaybe<Scalars["String"]>;
  transfer_id: Scalars["String"];
};

export type MutationTransferUpdateArgs = {
  input?: InputMaybe<TransferUpdateInput>;
};

export type MutationTransmitByBatchArgs = {
  input?: InputMaybe<BatchItemsInput>;
  transmittal_id: Scalars["String"];
};

export type MutationTransmitItemArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  input?: InputMaybe<InventoryItemInput>;
  transmittal_id: Scalars["String"];
};

export type MutationTransmitItemVoidArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  serial?: InputMaybe<Scalars["String"]>;
  transmittal_id: Scalars["String"];
};

export type MutationTransmittalCreateArgs = {
  id?: InputMaybe<Scalars["String"]>;
  input?: InputMaybe<TransmittalInput>;
};

export type MutationTransmittalUpdateArgs = {
  input?: InputMaybe<TransmittalUpdateInput>;
};

export type MutationUpdateDeviceExpirationArgs = {
  batch_id: Scalars["String"];
  gtin: Scalars["String"];
  warehouse_id: Scalars["String"];
};

export type MutationUpdateWarehouseStatusArgs = {
  id: Scalars["String"];
  status: Scalars["Boolean"];
};

export type MutationUploadSalesArgs = {
  date: Scalars["AWSDate"];
  file?: InputMaybe<S3ObjectInput>;
  request_id: Scalars["ID"];
  warehouse_id: Scalars["ID"];
  uno_template_type: Scalars["String"];
};

export type MutationUserDisableArgs = {
  username?: InputMaybe<Scalars["String"]>;
};

export type MutationUserEnableArgs = {
  username?: InputMaybe<Scalars["String"]>;
};

export type MutationValidateUploadArgs = {
  error_logs?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  error_url?: InputMaybe<Scalars["AWSURL"]>;
  uno_project_url?: InputMaybe<Scalars["AWSURL"]>;
  errors?: InputMaybe<Scalars["Int"]>;
  processed_file?: InputMaybe<S3ObjectInput>;
  request_id?: InputMaybe<Scalars["ID"]>;
  rows?: InputMaybe<Scalars["Int"]>;
  valid?: InputMaybe<Scalars["Int"]>;
};

export type MutationVoucherRedeemArgs = {
  input?: InputMaybe<VoucherRedeemInput>;
};

export type MutationVoucherRequestArgs = {
  input?: InputMaybe<VoucherRequestInput>;
};

export type MutationVoucherRequestUpdateArgs = {
  input?: InputMaybe<VoucherRequestUpdateInput>;
};

export type MutationWarehouseCreateArgs = {
  input?: InputMaybe<WarehouseInput>;
};

export type MutationWarehouseUpdateArgs = {
  input?: InputMaybe<WarehouseInput>;
};

export type NonSellableItem = {
  __typename?: "NonSellableItem";
  category?: Maybe<Scalars["String"]>;
  category_items?: Maybe<Array<Maybe<CategoryItem>>>;
};

export type NonSellableItemInput = {
  category?: InputMaybe<Scalars["String"]>;
  category_items?: InputMaybe<Array<InputMaybe<CategoryItemInput>>>;
};

export type PaymentInfo = {
  __typename?: "PaymentInfo";
  price?: Maybe<Scalars["Float"]>;
  type?: Maybe<Scalars["String"]>;
};

export type Plant = {
  __typename?: "Plant";
  plant_number?: Maybe<Scalars["String"]>;
  storages?: Maybe<Array<Maybe<Storage>>>;
};

export type Promo = {
  __typename?: "Promo";
  code?: Maybe<Scalars["ID"]>;
  description?: Maybe<Scalars["String"]>;
  discount?: Maybe<Scalars["Float"]>;
  discount_type?: Maybe<DiscountType>;
  name?: Maybe<Scalars["String"]>;
  status?: Maybe<PromoStatus>;
  type?: Maybe<PromoType>;
};

export type PromoConnection = {
  __typename?: "PromoConnection";
  items?: Maybe<Array<Maybe<Promo>>>;
  nextToken?: Maybe<Scalars["String"]>;
};

export type PromoInput = {
  code?: InputMaybe<Scalars["ID"]>;
  description?: InputMaybe<Scalars["String"]>;
  discount?: InputMaybe<Scalars["Float"]>;
  discount_type?: InputMaybe<DiscountType>;
  name?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<PromoStatus>;
  type?: InputMaybe<PromoType>;
};

export enum PromoStatus {
  Disabled = "DISABLED",
  Enabled = "ENABLED",
}

export enum PromoType {
  Erp = "ERP",
  FreeGoods = "FREE_GOODS",
  FreeHeets = "FREE_HEETS",
  Lvc = "LVC",
  Raf = "RAF",
  StarterKit = "STARTER_KIT",
  Voucher = "VOUCHER",
}

export type ProofOfPayment = {
  __typename?: "ProofOfPayment";
  date_of_deposit?: Maybe<Scalars["AWSDate"]>;
  deposit_reference_number?: Maybe<Scalars["String"]>;
  total_cash_deposit?: Maybe<Scalars["Float"]>;
};

export type ProofOfPaymentInput = {
  date_of_deposit?: InputMaybe<Scalars["AWSDate"]>;
  deposit_reference_number?: InputMaybe<Scalars["String"]>;
  total_cash_deposit?: InputMaybe<Scalars["Float"]>;
};

export type Pullout = ITransaction & {
  __typename?: "Pullout";
  batch_items?: Maybe<Array<Maybe<BatchPulloutItems>>>;
  box_count?: Maybe<Scalars["Int"]>;
  bundle_count?: Maybe<Scalars["Int"]>;
  created_by?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  delivery_type?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  invoice_id?: Maybe<Scalars["String"]>;
  logs?: Maybe<Array<Maybe<TransactionLog>>>;
  pullout_to?: Maybe<Scalars["String"]>;
  pullout_type?: Maybe<PulloutType>;
  remarks?: Maybe<Scalars["String"]>;
  status?: Maybe<TransactionStatus>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type PulloutConnection = {
  __typename?: "PulloutConnection";
  items?: Maybe<Array<Maybe<Pullout>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type PulloutInput = {
  box_count?: InputMaybe<Scalars["Int"]>;
  bundle_count?: InputMaybe<Scalars["Int"]>;
  delivery_type?: InputMaybe<Scalars["String"]>;
  pullout_type?: InputMaybe<PulloutType>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type PulloutItemInput = {
  pullout_id: Scalars["String"];
  serial: Scalars["String"];
};

export enum PulloutType {
  Activation = "Activation",
  BadInventory = "BadInventory",
  ForSelling = "ForSelling",
  FreebiesSample = "FreebiesSample",
  SalesExpert = "SalesExpert",
}

export type PulloutUpdateInput = {
  box_count?: InputMaybe<Scalars["Int"]>;
  bundle_count?: InputMaybe<Scalars["Int"]>;
  delivery_type?: InputMaybe<Scalars["String"]>;
  id: Scalars["String"];
  invoice_id?: InputMaybe<Scalars["String"]>;
  pullout_to?: InputMaybe<Scalars["String"]>;
  pullout_type?: InputMaybe<PulloutType>;
  remarks?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
};

export type Query = {
  __typename?: "Query";
  admin?: Maybe<Admin>;
  admins?: Maybe<AdminConnection>;
  batch?: Maybe<BatchItems>;
  batchesPerWarehouse?: Maybe<BatchItemsConnection>;
  batchesPerWarehouse2?: Maybe<BatchItemsConnection>;
  coach?: Maybe<Coach>;
  coaches?: Maybe<CoachConnection>;
  conversion?: Maybe<Conversion>;
  conversions?: Maybe<ConversionConnection>;
  directTransfer?: Maybe<DirectTransfer>;
  directTransfers?: Maybe<DirectTransferConnection>;
  directTransfersToWarehouse?: Maybe<DirectTransferConnection>;
  endOfDay?: Maybe<EndOfDay>;
  endOfDayList?: Maybe<EndOfDayConnection>;
  footTraffic?: Maybe<FootTrafficConnection>;
  gtInventoryItems?: Maybe<InventoryItemConnection>;
  guidedTrial?: Maybe<GuidedTrial>;
  guidedTrials?: Maybe<GuidedTrialConnection>;
  inventoryCheck?: Maybe<Message>;
  inventoryItem?: Maybe<InventoryItem>;
  inventoryItems?: Maybe<InventoryItemConnection>;
  inventoryPerBatchPullout?: Maybe<InventoryItemConnection>;
  inventoryPerBatchTransfer?: Maybe<InventoryItemConnection>;
  inventoryPerBatchTransmittal?: Maybe<InventoryItemConnection>;
  itemStocks?: Maybe<ItemStocks>;
  promos?: Maybe<PromoConnection>;
  pullout?: Maybe<Pullout>;
  pullouts?: Maybe<PulloutConnection>;
  recon?: Maybe<Transmittal>;
  recons?: Maybe<TransmittalConnection>;
  refundTransactions?: Maybe<SaleTransactionConnection>;
  return?: Maybe<Return>;
  saleTransaction?: Maybe<SaleTransaction>;
  saleTransactions?: Maybe<SaleTransactionConnection>;
  saleTransactionsAggregate?: Maybe<SaleTransactionConnection>;
  salesExpert?: Maybe<SalesExpert>;
  salesExperts?: Maybe<SalesExpertConnection>;
  sku?: Maybe<Sku>;
  skuBlockLogs?: Maybe<SkuBlockLogsConnection>;
  skuBlocks?: Maybe<SkuConnection>;
  skuInventory?: Maybe<SkuInventoryConnection>;
  skus?: Maybe<SkuConnection>;
  stocks?: Maybe<Stocks>;
  thefts?: Maybe<TheftsConnection>;
  thresholdConfig?: Maybe<ThresholdConfig>;
  thresholdConfigs?: Maybe<ThresholdConfigConnection>;
  transactionsPerWarehouse?: Maybe<TransactionConnection>;
  transfer?: Maybe<Transfer>;
  transfers?: Maybe<TransferConnection>;
  transfersToWarehouse?: Maybe<TransferConnection>;
  transmittal?: Maybe<Transmittal>;
  transmittals?: Maybe<TransmittalConnection>;
  voucherInventoryItems?: Maybe<InventoryItemConnection>;
  voucherRequests?: Maybe<VoucherRequestConnection>;
  warehouse?: Maybe<Warehouse>;
  warehouses?: Maybe<WarehouseConnection>;
};

export type QueryAdminArgs = {
  username: Scalars["String"];
};

export type QueryAdminsArgs = {
  channel?: InputMaybe<ChannelType>;
  next_token?: InputMaybe<Scalars["String"]>;
};

export type QueryBatchArgs = {
  batch_id: Scalars["String"];
  gtin: Scalars["String"];
  warehouse_id: Scalars["String"];
};

export type QueryBatchesPerWarehouseArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  next_token?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<Scalars["String"]>;
  warehouse_id: Scalars["String"];
};

export type QueryBatchesPerWarehouse2Args = {
  next_token?: InputMaybe<Scalars["String"]>;
  warehouse_id: Scalars["String"];
};

export type QueryCoachArgs = {
  coach_id: Scalars["String"];
};

export type QueryCoachesArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
  user_status?: InputMaybe<UserStatus>;
};

export type QueryConversionArgs = {
  id: Scalars["String"];
};

export type QueryConversionsArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
  warehouse_id: Scalars["String"];
};

export type QueryDirectTransferArgs = {
  id: Scalars["String"];
};

export type QueryDirectTransfersArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
};

export type QueryDirectTransfersToWarehouseArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
  warehouse_id: Scalars["String"];
};

export type QueryEndOfDayArgs = {
  id: Scalars["ID"];
};

export type QueryEndOfDayListArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  warehouse_id?: InputMaybe<Scalars["ID"]>;
};

export type QueryFootTrafficArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
};

export type QueryGtInventoryItemsArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryGuidedTrialArgs = {
  id: Scalars["ID"];
};

export type QueryGuidedTrialsArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
};

export type QueryInventoryCheckArgs = {
  input: InventoryCheckInput;
};

export type QueryInventoryItemArgs = {
  serial: Scalars["String"];
};

export type QueryInventoryItemsArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<InventoryItemStatus>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryInventoryPerBatchPulloutArgs = {
  batch_id: Scalars["String"];
  next_token?: InputMaybe<Scalars["String"]>;
  pullout_id: Scalars["String"];
};

export type QueryInventoryPerBatchTransferArgs = {
  batch_id: Scalars["String"];
  gtin: Scalars["String"];
  next_token?: InputMaybe<Scalars["String"]>;
  transfer_id: Scalars["String"];
};

export type QueryInventoryPerBatchTransmittalArgs = {
  batch_id: Scalars["String"];
  gtin: Scalars["String"];
  next_token?: InputMaybe<Scalars["String"]>;
  transmittal_id: Scalars["String"];
};

export type QueryItemStocksArgs = {
  gtin: Scalars["String"];
  type: Scalars["String"];
  warehouse_id: Scalars["String"];
};

export type QueryLendingSaleTransactionsArgs = {
  date_filter?: InputMaybe<TimestampFilter>;
  type: LendingSalesType;
  warehouse_id: Scalars["ID"];
};

export type QueryPromosArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
};

export type QueryPulloutArgs = {
  id: Scalars["String"];
};

export type QueryPulloutsArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
};

export type QueryReconArgs = {
  id: Scalars["String"];
};

export type QueryReconsArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
};

export type QueryRefundTransactionsArgs = {
  date_filter?: InputMaybe<TimestampFilter>;
  warehouse_id: Scalars["ID"];
};

export type QueryReturnArgs = {
  id: Scalars["String"];
};

export type QuerySaleTransactionArgs = {
  id: Scalars["ID"];
};

export type QuerySaleTransactionsArgs = {
  date_filter?: InputMaybe<TimestampFilter>;
  warehouse_id: Scalars["ID"];
};

export type QuerySaleTransactionsAggregateArgs = {
  date_filters?: InputMaybe<Array<InputMaybe<CustomDateFilter>>>;
  filters?: InputMaybe<Array<InputMaybe<CustomFilter>>>;
  from?: InputMaybe<Scalars["Int"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  search?: InputMaybe<CustomFilter>;
};

export type QuerySalesExpertArgs = {
  sales_expert_id: Scalars["String"];
};

export type QuerySalesExpertsArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
  user_status?: InputMaybe<UserStatus>;
};

export type QuerySkuArgs = {
  id: Scalars["String"];
};

export type QuerySkuBlockLogsArgs = {
  from?: InputMaybe<Scalars["AWSTimestamp"]>;
  to?: InputMaybe<Scalars["AWSTimestamp"]>;
};

export type QuerySkusArgs = {
  channel?: InputMaybe<ChannelType>;
  next_token?: InputMaybe<Scalars["String"]>;
};

export type QueryTheftsArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
};

export type QueryThresholdConfigArgs = {
  warehouse_id: Scalars["ID"];
};

export type QueryTransactionsPerWarehouseArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
  type?: InputMaybe<TransactionType>;
  warehouse_id: Scalars["String"];
};

export type QueryTransactionsPerWarehousePaginationArgs = {
  limit?: InputMaybe<Scalars["Int"]>;
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
  type?: InputMaybe<TransactionType>;
  warehouse_id: Scalars["String"];
};

export type QueryTransferArgs = {
  id: Scalars["String"];
};

export type QueryTransfersArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
};

export type QueryTransfersToWarehouseArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
  warehouse_id: Scalars["String"];
};

export type QueryTransmittalArgs = {
  id: Scalars["String"];
};

export type QueryTransmittalsArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
};

export type QueryVoucherInventoryItemsArgs = {
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<InventoryItemStatus>;
  type?: InputMaybe<PromoType>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type QueryVoucherRequestsArgs = {
  coach_id?: InputMaybe<Scalars["String"]>;
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<VoucherRequestStatus>;
};

export type QueryWarehouseArgs = {
  id?: InputMaybe<Scalars["String"]>;
};

export type QueryWarehousesArgs = {
  channel?: InputMaybe<ChannelType>;
  next_token?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<WarehouseType>;
};

export type ReconcileInput = {
  serial: Scalars["String"];
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type RefundTransactionInput = {
  created_by?: InputMaybe<Scalars["String"]>;
  customer_information?: InputMaybe<CustomerInformationInput>;
  items?: InputMaybe<Array<InputMaybe<LineItemInput>>>;
  remarks?: InputMaybe<Scalars["String"]>;
  transaction_id: Scalars["ID"];
  transaction_no?: InputMaybe<Scalars["ID"]>;
  warehouse_id?: InputMaybe<Scalars["ID"]>;
};

export type Report = {
  __typename?: "Report";
  error?: Maybe<Scalars["String"]>;
  request_id: Scalars["ID"];
  status?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["AWSURL"]>;
};

export enum ReportType {
  Devices = "DEVICES",
  Eod = "EOD",
  GuidedTrial = "GUIDED_TRIAL",
  Inventory = "INVENTORY",
  Pullout = "PULLOUT",
  Sales = "SALES",
  SalesZip = "SALES_ZIP",
  StockData = "STOCK_DATA",
  Transactions = "TRANSACTIONS",
  Transmittal = "TRANSMITTAL",
  PO = "PO",
  SRF = "SRF",
  osa = "OSA",
  NEW_EOD = "NEW_EOD",
  EOD_FINANCE = "EOD_FINANCE",
}

export type Return = ITransaction & {
  __typename?: "Return";
  batch_items?: Maybe<Array<Maybe<BatchReturnItems>>>;
  box_count?: Maybe<Scalars["Int"]>;
  bundle_count?: Maybe<Scalars["Int"]>;
  created_by?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  delivery_type?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  invoice_id?: Maybe<Scalars["String"]>;
  logs?: Maybe<Array<Maybe<TransactionLog>>>;
  remarks?: Maybe<Scalars["String"]>;
  return_from?: Maybe<Scalars["String"]>;
  return_type?: Maybe<ReturnType>;
  status?: Maybe<TransactionStatus>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type ReturnInput = {
  box_count?: InputMaybe<Scalars["Int"]>;
  bundle_count?: InputMaybe<Scalars["Int"]>;
  delivery_type?: InputMaybe<Scalars["String"]>;
  return_type?: InputMaybe<ReturnType>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type ReturnItemInput = {
  return_id: Scalars["String"];
  serial: Scalars["String"];
};

export enum ReturnType {
  Activation = "Activation",
  ReturnInventory = "ReturnInventory",
  SalesExpert = "SalesExpert",
}

export type ReturnUpdateInput = {
  box_count?: InputMaybe<Scalars["Int"]>;
  bundle_count?: InputMaybe<Scalars["Int"]>;
  delivery_type?: InputMaybe<Scalars["String"]>;
  id: Scalars["String"];
  invoice_id?: InputMaybe<Scalars["String"]>;
  remarks?: InputMaybe<Scalars["String"]>;
  return_from?: InputMaybe<Scalars["String"]>;
  return_type?: InputMaybe<ReturnType>;
  status?: InputMaybe<TransactionStatus>;
};

export enum Role {
  //ECOM roles
  AdministratorEC = "AdministratorEC",
  EcomAdmin = "EcomAdmin",
  Packer = "Packer",
  Dispatch = "Dispatch",
  AdminCSC = "CSC",

  //DC
  AdminDC = "AdminDC",
  AdminDR = "AdminDR",
  WHFullAdmin = "WHFullAdmin",
  SCFullAdmin = "SCFullAdmin",
  ASM = "ASM",
  StoreManager = "StoreManager",
  StoreAdmin = "StoreAdmin",

  //IC roles
  AdminIC = "AdminIC",
  FOM = "FOM",

  //DC, ECOM and IC roles
  PmftcAdministrator = "PMFTCAdministrator",

  //DC and IC roles
  Admin = "Admin",
  SE = "SE",

  HR = "HR",

  //old roles
  AdminCrm = "AdminCRM",
  AdminCsc = "AdminCSC",
  AdminViewOnly = "AdminViewOnly",
  Coach = "Coach",
  Dispatcher = "Dispatcher",
  Executive = "Executive",
  External = "External",
  WarehousePersonnel = "WarehousePersonnel",
  Csc = "CSC",
}

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

export type Sku = {
  __typename?: "SKU";
  channel?: Maybe<ChannelType>;
  dce_status?: Maybe<SkuBlockStatus>;
  description?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  price?: Maybe<Scalars["Float"]>;
  price_gross?: Maybe<Scalars["Float"]>;
  promo?: Maybe<Promo>;
  sku?: Maybe<Scalars["String"]>;
  type?: Maybe<SkuType>;
  unit_of_measure?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export type SkuBlockInput = {
  skus?: InputMaybe<Array<InputMaybe<SkuInput>>>;
  status?: InputMaybe<SkuBlockStatus>;
};

export type SkuBlockLogs = {
  __typename?: "SKUBlockLogs";
  date_created?: Maybe<Scalars["AWSTimestamp"]>;
  id?: Maybe<Scalars["ID"]>;
  log?: Maybe<Scalars["String"]>;
  modified_by?: Maybe<Scalars["String"]>;
  skus?: Maybe<Array<Maybe<Sku>>>;
};

export type SkuBlockLogsConnection = {
  __typename?: "SKUBlockLogsConnection";
  items?: Maybe<Array<Maybe<SkuBlockLogs>>>;
};

export enum SkuBlockStatus {
  Blocked = "BLOCKED",
  Unblocked = "UNBLOCKED",
}

export enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

export type SkuConnection = {
  __typename?: "SKUConnection";
  items?: Maybe<Array<Maybe<Sku>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type SkuInput = {
  channel?: InputMaybe<ChannelType>;
  description?: InputMaybe<Scalars["String"]>;
  gtin: Scalars["String"];
  name?: InputMaybe<Scalars["String"]>;
  price?: InputMaybe<Scalars["Float"]>;
  price_gross?: InputMaybe<Scalars["Float"]>;
  promo?: InputMaybe<PromoInput>;
  sku: Scalars["String"];
  type?: InputMaybe<SkuType>;
  unit_of_measure?: InputMaybe<Scalars["String"]>;
};

export type SkuInventory = {
  __typename?: "SKUInventory";
  committed?: Maybe<Scalars["Int"]>;
  gtin?: Maybe<Scalars["String"]>;
  pullout?: Maybe<Scalars["Int"]>;
  released?: Maybe<Scalars["Int"]>;
  returned?: Maybe<Scalars["Int"]>;
  sku?: Maybe<Scalars["String"]>;
  transferred?: Maybe<Scalars["Int"]>;
  transferred_out?: Maybe<Scalars["Int"]>;
  transmittal?: Maybe<Scalars["Int"]>;
};

export type SkuInventoryConnection = {
  __typename?: "SKUInventoryConnection";
  items?: Maybe<Array<Maybe<SkuInventory>>>;
};

export enum SkuType {
  Accessories = "ACCESSORIES",
  Devices = "DEVICES",
  Heets = "HEETS",
  Voucher = "VOUCHER",
  Zyn = "ZYN",
}

export type SmsTemplate = {
  __typename?: "SMSTemplate";
  id?: Maybe<Scalars["ID"]>;
  message?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
};

export type SaleTransaction = {
  __typename?: "SaleTransaction";
  cegid_no?: Maybe<Scalars["String"]>;
  club_status?: Maybe<ClubStatus>;
  created_by?: Maybe<Scalars["ID"]>;
  customer_information?: Maybe<CustomerInformation>;
  date_created?: Maybe<Scalars["AWSTimestamp"]>;
  date_inputted?: Maybe<Scalars["AWSTimestamp"]>;
  date_updated?: Maybe<Scalars["AWSTimestamp"]>;
  id?: Maybe<Scalars["ID"]>;
  is_refunded?: Maybe<Scalars["Boolean"]>;
  items?: Maybe<Array<Maybe<LineItem>>>;
  lead_source?: Maybe<LeadSource>;
  order_date?: Maybe<Scalars["String"]>;
  payment_type?: Maybe<Scalars["String"]>;
  payments_info?: Maybe<Array<Maybe<PaymentInfo>>>;
  reference_order_id?: Maybe<Scalars["ID"]>;
  remarks?: Maybe<Scalars["String"]>;
  remittance_slip?: Maybe<S3Object>;
  return_notes?: Maybe<Scalars["String"]>;
  sales_expert?: Maybe<Scalars["String"]>;
  signature?: Maybe<S3Object>;
  additional_attachment?: Maybe<S3Object>;
  total_price?: Maybe<Scalars["Float"]>;
  transaction_id?: Maybe<Scalars["ID"]>;
  transaction_no: Scalars["ID"];
  type?: Maybe<Scalars["String"]>;
  underwent_guided_trial?: Maybe<Scalars["Boolean"]>;
  updated_by?: Maybe<Scalars["ID"]>;
  warehouse_id?: Maybe<Scalars["ID"]>;
  status?: Maybe<Scalars["String"]>;

  //IC IR attributes
  incident_report_id?: Maybe<Scalars["String"]>;
  ir_error_tags?: Maybe<Array<Maybe<IrErrorTags>>>;

  //IC linked Tagging only
  link_tags?: Maybe<Array<Maybe<LinkedTags>>>;
};

export enum IrErrorTags {
  EgmError = "EGM_ERROR",
  SsrError = "SSR_ERROR",
  SamplingRegError = "SAMPLING_REG_ERROR",
}

export enum LinkedTags {
  LinkedEgm = "LINKED_EGM",
  LinkedSsr = "LINKED_SSR",
  SamplingRegistered = "SAMPLING_REGISTERED",
}

export type SaleTransactionConnection = {
  __typename?: "SaleTransactionConnection";
  items?: Maybe<Array<Maybe<SaleTransaction>>>;
  nextToken?: Maybe<Scalars["String"]>;
  total?: Maybe<Scalars["Int"]>;
};

export type SaleTransactionInput = {
  cegid_no?: InputMaybe<Scalars["String"]>;
  club_status?: InputMaybe<ClubStatus>;
  created_by?: InputMaybe<Scalars["String"]>;
  customer_information?: InputMaybe<CustomerInformationInput>;
  date_created?: InputMaybe<Scalars["AWSTimestamp"]>;
  items?: InputMaybe<Array<InputMaybe<LineItemInput>>>;
  lead_source?: InputMaybe<LeadSource>;
  payment_type?: InputMaybe<Scalars["String"]>;
  remarks?: InputMaybe<Scalars["String"]>;
  remittance_slip?: InputMaybe<S3ObjectInput>;
  return_notes?: InputMaybe<Scalars["String"]>;
  sales_expert?: InputMaybe<Scalars["String"]>;
  signature?: InputMaybe<S3ObjectInput>;
  total_price?: InputMaybe<Scalars["Float"]>;
  transaction_no?: InputMaybe<Scalars["ID"]>;
  type?: InputMaybe<Scalars["String"]>;
  underwent_guided_trial?: InputMaybe<Scalars["Boolean"]>;
  warehouse_id?: InputMaybe<Scalars["ID"]>;
};

export type SalesExpert = {
  __typename?: "SalesExpert";
  email?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  office_ids?: Maybe<Array<Maybe<Scalars["String"]>>>;
  phone_number?: Maybe<Scalars["String"]>;
  sales_expert_id?: Maybe<Scalars["String"]>;
  user_status?: Maybe<UserStatus>;
};

export type SalesExpertConnection = {
  __typename?: "SalesExpertConnection";
  items?: Maybe<Array<Maybe<SalesExpert>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type SalesExpertInput = {
  email?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
  office_ids?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  phone_number?: InputMaybe<Scalars["String"]>;
  sales_expert_id: Scalars["String"];
};

export type SalesExpertUpdateInput = {
  email?: InputMaybe<Scalars["String"]>;
  name: Scalars["String"];
  office_ids?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  phone_number?: InputMaybe<Scalars["String"]>;
  sales_expert_id: Scalars["String"];
  user_status?: InputMaybe<UserStatus>;
};

export type SalesSummary = {
  __typename?: "SalesSummary";
  declared_sales_amount?: Maybe<Scalars["Float"]>;
  final_sales_amount?: Maybe<Scalars["Float"]>;
  total_cash_sales?: Maybe<Scalars["Float"]>;
  total_cc_sales?: Maybe<Scalars["Float"]>;
  total_dc_sales?: Maybe<Scalars["Float"]>;
  total_gcash_sales?: Maybe<Scalars["Float"]>;
  total_sales?: Maybe<Scalars["Float"]>;
  x_reading_total_sales?: Maybe<Scalars["Float"]>;
};

export type SalesSummaryInput = {
  declared_sales_amount?: InputMaybe<Scalars["Float"]>;
  final_sales_amount?: InputMaybe<Scalars["Float"]>;
  total_cash_sales?: InputMaybe<Scalars["Float"]>;
  total_cc_sales?: InputMaybe<Scalars["Float"]>;
  total_dc_sales?: InputMaybe<Scalars["Float"]>;
  total_gcash_sales?: InputMaybe<Scalars["Float"]>;
  total_sales?: InputMaybe<Scalars["Float"]>;
  x_reading_total_sales?: InputMaybe<Scalars["Float"]>;
};

export type SalesUpload = {
  __typename?: "SalesUpload";
  error_logs?: Maybe<Array<Maybe<Scalars["String"]>>>;
  error_url?: Maybe<Scalars["AWSURL"]>;
  uno_project_url?: Maybe<Scalars["AWSURL"]>;
  errors?: Maybe<Scalars["Int"]>;
  processed_file?: Maybe<S3Object>;
  request_id?: Maybe<Scalars["ID"]>;
  rows?: Maybe<Scalars["Int"]>;
  valid?: Maybe<Scalars["Int"]>;
};

export type SortInput = {
  attribute?: InputMaybe<Scalars["String"]>;
  order?: InputMaybe<SortOrder>;
};

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export type Stocks = {
  __typename?: "Stocks";
  materials?: Maybe<Array<Maybe<Material>>>;
  shop_number?: Maybe<Scalars["String"]>;
};

export type Storage = {
  __typename?: "Storage";
  batches?: Maybe<Array<Maybe<Batch>>>;
  location?: Maybe<Scalars["String"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  onReportDownload?: Maybe<Report>;
  onUpload?: Maybe<SalesUpload>;
};

export type SubscriptionOnReportDownloadArgs = {
  request_id: Scalars["ID"];
};

export type SubscriptionOnUploadArgs = {
  request_id: Scalars["ID"];
};

export type Theft = {
  __typename?: "Theft";
  accessories?: Maybe<Scalars["Int"]>;
  date?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  devices?: Maybe<Scalars["Int"]>;
  heets?: Maybe<Scalars["Int"]>;
  time?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["ID"]>;
};

export type TheftInput = {
  accessories?: InputMaybe<Scalars["Int"]>;
  date?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  devices?: InputMaybe<Scalars["Int"]>;
  heets?: InputMaybe<Scalars["Int"]>;
  time?: InputMaybe<Scalars["String"]>;
};

export type TheftsConnection = {
  __typename?: "TheftsConnection";
  items?: Maybe<Array<Maybe<Theft>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type Threshold = {
  __typename?: "Threshold";
  gtin?: Maybe<Scalars["String"]>;
  sku?: Maybe<Scalars["String"]>;
  value?: Maybe<Scalars["Int"]>;
};

export type ThresholdConfig = {
  __typename?: "ThresholdConfig";
  id?: Maybe<Scalars["ID"]>;
  recipients?: Maybe<Array<Maybe<Scalars["AWSEmail"]>>>;
  thresholds?: Maybe<Array<Maybe<Threshold>>>;
  warehouse_id?: Maybe<Scalars["ID"]>;
};

export type ThresholdConfigConnection = {
  __typename?: "ThresholdConfigConnection";
  items?: Maybe<Array<Maybe<ThresholdConfig>>>;
};

export type ThresholdConfigInput = {
  recipients?: InputMaybe<Array<InputMaybe<Scalars["AWSEmail"]>>>;
  thresholds?: InputMaybe<Array<InputMaybe<ThresholdInput>>>;
  warehouse_id: Scalars["ID"];
};

export type ThresholdInput = {
  gtin?: InputMaybe<Scalars["String"]>;
  sku?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["Int"]>;
};

export type TimestampFilter = {
  from: Scalars["AWSTimestamp"];
  to: Scalars["AWSTimestamp"];
};

export type Transaction = ITransaction & {
  __typename?: "Transaction";
  batch_items?: Maybe<Array<Maybe<BatchItems>>>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  invoice_id?: Maybe<Scalars["String"]>;
  pullout_type?: Maybe<PulloutType>;
  remarks?: Maybe<Scalars["String"]>;
  return_type?: Maybe<ReturnType>;
  status?: Maybe<TransactionStatus>;
  to_warehouse_id?: Maybe<Scalars["String"]>;
  type?: Maybe<TransactionType>;
  warehouse_id?: Maybe<Scalars["String"]>;
};

export type TransactionConnection = {
  __typename?: "TransactionConnection";
  items?: Maybe<Array<Maybe<Transaction>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type TransactionLog = {
  __typename?: "TransactionLog";
  date_updated?: Maybe<Scalars["String"]>;
  item?: Maybe<BatchItems>;
  updated_by?: Maybe<Scalars["String"]>;
};

export enum TransactionStatus {
  Cancelled = "CANCELLED",
  Completed = "COMPLETED",
  Declined = "DECLINED",
  Delete = "DELETE",
  Floating = "FLOATING",
  Pending = "PENDING",
}

export enum TransactionType {
  Conversion = "CONVERSION",
  DirectTransfer = "DIRECT_TRANSFER",
  Pullout = "PULLOUT",
  Recon = "RECON",
  Return = "RETURN",
  Transfer = "TRANSFER",
  Transmittal = "TRANSMITTAL",
}

export type Transfer = ITransaction & {
  __typename?: "Transfer";
  batch_items?: Maybe<Array<Maybe<BatchTransferItems>>>;
  created_by?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  invoice_id?: Maybe<Scalars["String"]>;
  logs?: Maybe<Array<Maybe<TransactionLog>>>;
  reason_for_cancel?: Maybe<Scalars["String"]>;
  remarks?: Maybe<Scalars["String"]>;
  status?: Maybe<TransactionStatus>;
  to_warehouse_id?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
  delivery_type?: Maybe<Scalars["String"]>;
  box_count?: Maybe<Scalars["Int"]>;
  bundle_count?: Maybe<Scalars["Int"]>;
  bag_count?: Maybe<Scalars["Int"]>;
};

export type TransferConnection = {
  __typename?: "TransferConnection";
  items?: Maybe<Array<Maybe<Transfer>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type TransferInput = {
  box_count?: InputMaybe<Scalars["Int"]>;
  bundle_count?: InputMaybe<Scalars["Int"]>;
  delivery_type?: InputMaybe<Scalars["String"]>;
  remarks?: InputMaybe<Scalars["String"]>;
  to_warehouse_id?: InputMaybe<Scalars["String"]>;
  warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type TransferItemInput = {
  serial: Scalars["String"];
  transfer_id: Scalars["String"];
};

export type TransferUpdateInput = {
  box_count?: InputMaybe<Scalars["Int"]>;
  bundle_count?: InputMaybe<Scalars["Int"]>;
  delivery_type?: InputMaybe<Scalars["String"]>;
  id: Scalars["String"];
  invoice_id?: InputMaybe<Scalars["String"]>;
  remarks?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
  to_warehouse_id?: InputMaybe<Scalars["String"]>;
};

export type Transmittal = ITransaction & {
  __typename?: "Transmittal";
  batch_items?: Maybe<Array<Maybe<BatchTransmittalItems>>>;
  bundle_count?: Maybe<Scalars["Int"]>;
  created_by?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["String"]>;
  delivery_source?: Maybe<Scalars["String"]>;
  from_warehouse_id?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
  invoice_id?: Maybe<Scalars["String"]>;
  logs?: Maybe<Array<Maybe<TransactionLog>>>;
  remarks?: Maybe<Scalars["String"]>;
  status?: Maybe<TransactionStatus>;
  time?: Maybe<Scalars["String"]>;
  updated_by?: Maybe<Scalars["String"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
  delivery_type?: Maybe<Scalars["String"]>;
  box_count?: Maybe<Scalars["Int"]>;
  sales_invoice?: Maybe<Scalars["String"]>;
};

export type TransmittalConnection = {
  __typename?: "TransmittalConnection";
  items?: Maybe<Array<Maybe<Transmittal>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type TransmittalInput = {
  date?: InputMaybe<Scalars["String"]>;
  delivery_source?: InputMaybe<Scalars["String"]>;
  invoice_id?: InputMaybe<Scalars["String"]>;
  remarks?: InputMaybe<Scalars["String"]>;
  time?: InputMaybe<Scalars["String"]>;
  warehouse_id: Scalars["String"];
  sales_invoice?: Maybe<Scalars["String"]>;
};

export type TransmittalUpdateInput = {
  box_count?: InputMaybe<Scalars["Int"]>;
  bundle_count?: InputMaybe<Scalars["Int"]>;
  date?: InputMaybe<Scalars["String"]>;
  delivery_source?: InputMaybe<Scalars["String"]>;
  delivery_type?: InputMaybe<Scalars["String"]>;
  from_warehouse_id?: InputMaybe<Scalars["String"]>;
  id: Scalars["String"];
  invoice_id?: InputMaybe<Scalars["String"]>;
  remarks?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<TransactionStatus>;
  time?: InputMaybe<Scalars["String"]>;
  sales_invoice?: Maybe<Scalars["String"]>;
};

export type UploadReceipts = {
  __typename?: "UploadReceipts";
  excess_amount?: Maybe<Scalars["Float"]>;
  reason?: Maybe<Scalars["String"]>;
  receipt?: Maybe<S3Object>;
  x_receipt?: Maybe<S3Object>;
};

export type UploadReceiptsInput = {
  excess_amount?: InputMaybe<Scalars["Float"]>;
  reason?: InputMaybe<Scalars["String"]>;
  receipt?: InputMaybe<S3ObjectInput>;
  x_receipt?: InputMaybe<S3ObjectInput>;
};

export type UploadSlip = {
  __typename?: "UploadSlip";
  additional?: Maybe<S3Object>;
  reason?: Maybe<Scalars["String"]>;
  remittance?: Maybe<S3Object>;
};

export type UploadSlipInput = {
  additional?: InputMaybe<S3ObjectInput>;
  reason?: InputMaybe<Scalars["String"]>;
  remittance?: InputMaybe<S3ObjectInput>;
};

export type UsageData = {
  __typename?: "UsageData";
  charger_cycle?: Maybe<Scalars["Float"]>;
  device_cycle?: Maybe<Scalars["Float"]>;
  holder_cycle?: Maybe<Scalars["Float"]>;
  version?: Maybe<Scalars["String"]>;
};

export type UsageHistory = {
  __typename?: "UsageHistory";
  post?: Maybe<UsageData>;
  pre?: Maybe<UsageData>;
};

export type User = {
  __typename?: "User";
  user_status?: Maybe<UserStatus>;
  username?: Maybe<Scalars["String"]>;
};

export enum UserStatus {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

export type VoucherRedeemInput = {
  lead_id?: InputMaybe<Scalars["String"]>;
  promo_type?: InputMaybe<Scalars["String"]>;
};

export type VoucherRequest = {
  __typename?: "VoucherRequest";
  lead_id?: Maybe<Scalars["String"]>;
  requested_purchase_code?: Maybe<Scalars["String"]>;
  requested_purchase_code_type?: Maybe<PromoType>;
};

export type VoucherRequestConnection = {
  __typename?: "VoucherRequestConnection";
  items?: Maybe<Array<Maybe<VoucherRequest>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type VoucherRequestInput = {
  code?: InputMaybe<Scalars["String"]>;
  lead_id?: InputMaybe<Scalars["String"]>;
  promo_type?: InputMaybe<PromoType>;
};

export enum VoucherRequestStatus {
  Approved = "APPROVED",
  Declined = "DECLINED",
  Pending = "PENDING",
}

export type VoucherRequestUpdateInput = {
  code?: InputMaybe<Scalars["String"]>;
  id?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<VoucherRequestStatus>;
};

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

export type Warehouse = {
  __typename?: "Warehouse";
  accounts?: Maybe<Accounts>;
  area?: Maybe<Scalars["String"]>;
  channel?: Maybe<ChannelType>;
  cutoff_time?: Maybe<Scalars["AWSTime"]>;
  ecomm_sms?: Maybe<SmsTemplate>;
  id?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["Boolean"]>;
  total_items?: Maybe<Scalars["Int"]>;
  type?: Maybe<WarehouseType>;
  with_caveat?: Maybe<Scalars["Boolean"]>;
  zip_codes?: Maybe<Array<Maybe<ZipCode>>>;
};

export type WarehouseConnection = {
  __typename?: "WarehouseConnection";
  items?: Maybe<Array<Maybe<Warehouse>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type WarehouseInput = {
  accounts?: InputMaybe<AccountsInput>;
  area?: InputMaybe<Scalars["String"]>;
  channel?: InputMaybe<ChannelType>;
  cutoff_time?: InputMaybe<Scalars["AWSTime"]>;
  id: Scalars["String"];
  name?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<Scalars["Boolean"]>;
  type?: InputMaybe<WarehouseType>;
  with_caveat?: InputMaybe<Scalars["Boolean"]>;
  zip_codes?: InputMaybe<Array<InputMaybe<ZipCodeInput>>>;
};

export enum WarehouseType {
  Csc = "CSC",
  Lending = "LENDING",
  Roadshow = "ROADSHOW",
  Store = "STORE",
  Warehouse = "WAREHOUSE",
}

export type ZipCode = {
  __typename?: "ZipCode";
  from?: Maybe<Scalars["Int"]>;
  to?: Maybe<Scalars["Int"]>;
};

export type ZipCodeInput = {
  from?: InputMaybe<Scalars["Int"]>;
  to?: InputMaybe<Scalars["Int"]>;
};

export enum POStatus {
  Open = "Open",
  Close = "Close",
}

export type POs = {
  __typename?: "POs";
  id?: Maybe<Scalars["ID"]>;
  warehouse_id?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["Int"]>;
  sales_invoice?: Maybe<Scalars["String"]>;
  amount_in_si?: Maybe<Scalars["Int"]>;
  attachments?: Maybe<Array<Maybe<S3Object>>>;
  status?: Maybe<POStatus>;
  channel?: Maybe<ChannelType>;
  created_by?: Maybe<Scalars["String"]>;
  order_id?: Maybe<Scalars["String"]>;
  cust_ref_no?: Maybe<Scalars["String"]>;
  delivery_note?: Maybe<Scalars["String"]>;
  receive_by?: Maybe<Scalars["String"]>;
  remarks?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["Int"]>;
  date_created?: Maybe<Scalars["Int"]>;
  updated_by?: Maybe<Scalars["String"]>;
};

export type POsConnection = {
  __typename?: "POsConnection";
  items?: Maybe<Array<Maybe<POs>>>;
  nextToken?: Maybe<Scalars["String"]>;
};

export type POsInput = {
  warehouse_id?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["Int"]>;
  sales_invoice?: Maybe<Scalars["String"]>;
  amount_in_si?: Maybe<Scalars["Int"]>;
  attachments?: Maybe<Array<Maybe<S3ObjectInput>>>;
  channel?: Maybe<ChannelType>;
  created_by?: Maybe<Scalars["String"]>;
  order_id?: Maybe<Scalars["String"]>;
  cust_ref_no?: Maybe<Scalars["String"]>;
  delivery_note?: Maybe<Scalars["String"]>;
};

export enum Reason {
  CRITICAL = "CRITICAL",
  OOS = "OOS",
  LOW_STOCK = "LOW_STOCK",
  NEW_REQUEST = "NEW_REQUEST",
}

export enum StockRequestStatus {
  FOR_REVIEW_SC = "FOR_REVIEW_SC",
  FOR_REVIEW_WH = "FOR_REVIEW_WH",
  AVAILABLE = "AVAILABLE",
  REJECT = "REJECT",
  CLOSED = "CLOSED",
}

export type StockRequestItemInput = {
  batch_id?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  sku?: Maybe<Scalars["String"]>;
  req_qty?: Maybe<Scalars["Int"]>;
  curr_qty?: Maybe<Scalars["Int"]>;
  sc_qty?: Maybe<Scalars["Int"]>;
  wh_qty?: Maybe<Scalars["Int"]>;
  reason?: Maybe<Reason>;
  requested_by?: Maybe<Scalars["String"]>;
  serial?: Maybe<Array<Scalars["String"]>>;
  inventory_type?: Maybe<Scalars["String"]>;
  is_new?:Maybe<Scalars["Boolean"]>;

  __typename?: "SRF";
};

export type WarehouseData = {
  id?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
};

export type StockRequestItem = {
  batch_id?: Maybe<Scalars["String"]>;
  gtin?: Maybe<Scalars["String"]>;
  sku?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  curr_qty?: Maybe<Scalars["Int"]>;
  req_qty?: Maybe<Scalars["Int"]>;
  sc_qty?: Maybe<Scalars["Int"]>;
  wh_qty?: Maybe<Scalars["Int"]>;
  reason?: Maybe<Reason>;
  serial?: Maybe<Array<Scalars["String"]>>;
  inventory_type?: Maybe<Scalars["String"]>;
  is_new?:Maybe<Scalars["Boolean"]>;
  __typename?: "SRF";
};

export type SRFs = {
  __typename?: "SRF";
  id?: Maybe<Scalars["ID"]>;
  transfer_id?: Maybe<String>;
  warehouse_id?: Maybe<String>;
  date?: Maybe<Scalars["Int"]>;
  transaction_id?: Maybe<Scalars["String"]>;
  reason?: Maybe<Reason>;
  status?: Maybe<StockRequestStatus>;
  items?: Maybe<Array<Maybe<StockRequestItem>>>;
  channel?: Maybe<ChannelType>;
  created_by?: Maybe<Scalars["String"]>;
  date_updated?: Maybe<Scalars["Int"]>;
  date_created?: Maybe<Scalars["Int"]>;
  date_input?: Maybe<Scalars["Int"]>;
  updated_by?: Maybe<Scalars["String"]>;
};

export type OSA = {
  __typename?: "OSA";
  created_by?: Maybe<Scalars["ID"]>;
  date_created?: Maybe<Scalars["AWSTimestamp"]>;
  datetime?: Maybe<Scalars["AWSTimestamp"]>;
  id?: Maybe<Scalars["ID"]>;
  items?: Maybe<Array<Maybe<items>>>;
  warehouse_id?: Maybe<Scalars["ID"]>;
};

export type items = {
  __typename?: "NonSellableItem";
  title?: Maybe<Scalars["String"]>;
  items?: Maybe<Array<Maybe<CategoryItem>>>;
};

//EOD declaration type
export enum DeclarationType {
  EOD = "EOD",
  EOD_FINANCE = "EOD_FINANCE",
}
