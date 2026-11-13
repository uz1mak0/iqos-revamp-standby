/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

export type Activation = {
  __typename?: 'Activation';
  date?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  outlets?: Maybe<Array<Maybe<Outlet>>>;
};

export type ActivationConnection = {
  __typename?: 'ActivationConnection';
  items?: Maybe<Array<Maybe<Activation>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type ActivationInput = {
  date?: InputMaybe<Scalars['String']>;
  date_filter?: InputMaybe<Scalars['String']>;
  outlets?: InputMaybe<Array<InputMaybe<OutletInput>>>;
};

export type ActivationOutlet = {
  __typename?: 'ActivationOutlet';
  activation_id?: Maybe<Scalars['String']>;
  booth_setup?: Maybe<S3Object>;
  booth_setup_timestamp?: Maybe<Scalars['AWSTimestamp']>;
  date_updated?: Maybe<Scalars['String']>;
  decline_users?: Maybe<Scalars['Int']>;
  iqos_users?: Maybe<Scalars['Int']>;
  last_updated_by?: Maybe<Scalars['String']>;
  outlet_id?: Maybe<Scalars['String']>;
  previous_engagement?: Maybe<Scalars['Int']>;
};

export type ActivationOutletUpdate = {
  activation_id?: InputMaybe<Scalars['String']>;
  booth_setup?: InputMaybe<S3ObjectInput>;
  booth_setup_timestamp?: InputMaybe<Scalars['AWSTimestamp']>;
  decline_users?: InputMaybe<Scalars['Int']>;
  iqos_users?: InputMaybe<Scalars['Int']>;
  outlet_id?: InputMaybe<Scalars['String']>;
  previous_engagement?: InputMaybe<Scalars['Int']>;
};

export type ActivationUpdateInput = {
  id: Scalars['String'];
  outlets?: InputMaybe<Array<InputMaybe<OutletInput>>>;
};

export type AdditionalCustomerInformation = {
  __typename?: 'AdditionalCustomerInformation';
  birth_date?: Maybe<Scalars['String']>;
  civil_status?: Maybe<Scalars['String']>;
  industry_profession?: Maybe<Scalars['String']>;
  industry_profession_others?: Maybe<Scalars['String']>;
  smoking_preference?: Maybe<Scalars['String']>;
  smoking_preference_others?: Maybe<Scalars['String']>;
  work_location?: Maybe<Scalars['String']>;
};

export type AdditionalCustomerInformationInput = {
  birth_date?: InputMaybe<Scalars['String']>;
  civil_status?: InputMaybe<Scalars['String']>;
  industry_profession?: InputMaybe<Scalars['String']>;
  industry_profession_others?: InputMaybe<Scalars['String']>;
  smoking_preference?: InputMaybe<Scalars['String']>;
  smoking_preference_others?: InputMaybe<Scalars['String']>;
  work_location?: InputMaybe<Scalars['String']>;
};

export type AdditionalFiles = {
  __typename?: 'AdditionalFiles';
  collection_summary?: Maybe<S3Object>;
  deposit_slip?: Maybe<S3Object>;
  order_number?: Maybe<S3Object>;
  sales_invoice?: Maybe<S3Object>;
};

export type AdditionalFilesInput = {
  collection_summary?: InputMaybe<S3ObjectInput>;
  deposit_slip?: InputMaybe<S3ObjectInput>;
  order_number?: InputMaybe<S3ObjectInput>;
  sales_invoice?: InputMaybe<S3ObjectInput>;
};

export type Admin = {
  __typename?: 'Admin';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  office_id?: Maybe<Scalars['String']>;
  office_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  office_name?: Maybe<Scalars['String']>;
  phone_number?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<Role>>>;
  user_status?: Maybe<UserStatus>;
  username?: Maybe<Scalars['String']>;
  wallet?: Maybe<Wallet>;
};

export type AdminConnection = {
  __typename?: 'AdminConnection';
  items?: Maybe<Array<Maybe<Admin>>>;
  total?: Maybe<Scalars['Int']>;
};

export type AdminInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  office_id?: InputMaybe<Scalars['String']>;
  office_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  office_name: Scalars['String'];
  phone_number?: InputMaybe<Scalars['String']>;
  roles: Array<InputMaybe<Role>>;
  username?: InputMaybe<Scalars['String']>;
};

export type AdminUpdateInput = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  office_id?: InputMaybe<Scalars['String']>;
  office_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  office_name?: InputMaybe<Scalars['String']>;
  phone_number?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<InputMaybe<Role>>>;
  username: Scalars['String'];
};

export enum AppointmentReason {
  Buy = 'BUY',
  Lend = 'LEND',
  TryIqos = 'TRY_IQOS'
}

export enum AppointmentStatus {
  Cancelled = 'CANCELLED',
  Contacted = 'CONTACTED',
  Pending = 'PENDING',
  Rescheduled = 'RESCHEDULED',
  Unresponsive = 'UNRESPONSIVE'
}

export enum AssetType {
  Photo = 'PHOTO',
  Video = 'VIDEO'
}

export enum AttendanceType {
  TimeIn = 'TIME_IN',
  TimeOut = 'TIME_OUT'
}

export type Batch = {
  __typename?: 'Batch';
  available?: Maybe<Scalars['Int']>;
  batch_no?: Maybe<Scalars['String']>;
  blocked?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
  unit_of_measure?: Maybe<Scalars['String']>;
};

export type BatchItem = {
  __typename?: 'BatchItem';
  batch_id?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
  unit_of_measure?: Maybe<Scalars['String']>;
};

export type BatchItems = IBatchItems & {
  __typename?: 'BatchItems';
  batch_id?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  expiration_date?: Maybe<Scalars['String']>;
  gtin?: Maybe<Scalars['String']>;
  inventory?: Maybe<InventoryItemConnection>;
  inventory_type?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  unit_of_measure?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type BatchItemsConnection = {
  __typename?: 'BatchItemsConnection';
  items?: Maybe<Array<Maybe<BatchItems>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type BatchItemsInput = {
  batch_id: Scalars['String'];
  expiration_date?: InputMaybe<Scalars['String']>;
  gtin: Scalars['String'];
  manufacturing_date?: InputMaybe<Scalars['String']>;
  quantity: Scalars['Int'];
  received?: InputMaybe<Scalars['Int']>;
};

export type BatchPulloutItems = IBatchItems & {
  __typename?: 'BatchPulloutItems';
  batch_id?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  expiration_date?: Maybe<Scalars['String']>;
  gtin?: Maybe<Scalars['String']>;
  inventory?: Maybe<InventoryItemConnection>;
  pullout_id?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  unit_of_measure?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type BatchReturnItems = IBatchItems & {
  __typename?: 'BatchReturnItems';
  batch_id?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  expiration_date?: Maybe<Scalars['String']>;
  gtin?: Maybe<Scalars['String']>;
  inventory?: Maybe<InventoryItemConnection>;
  quantity?: Maybe<Scalars['Int']>;
  return_id?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
  unit_of_measure?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type BatchTransferItems = IBatchItems & {
  __typename?: 'BatchTransferItems';
  batch_id?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  expiration_date?: Maybe<Scalars['String']>;
  gtin?: Maybe<Scalars['String']>;
  inventory?: Maybe<InventoryItemConnection>;
  quantity?: Maybe<Scalars['Int']>;
  received?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  transfer_id?: Maybe<Scalars['String']>;
  unit_of_measure?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type BatchTransmittalItems = IBatchItems & {
  __typename?: 'BatchTransmittalItems';
  batch_id?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  expiration_date?: Maybe<Scalars['String']>;
  gtin?: Maybe<Scalars['String']>;
  inventory?: Maybe<InventoryItemConnection>;
  quantity?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  transmittal_id?: Maybe<Scalars['String']>;
  unit_of_measure?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type Coach = {
  __typename?: 'Coach';
  coach_id?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  office_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  phone_number?: Maybe<Scalars['String']>;
  user_status?: Maybe<UserStatus>;
};

export type CoachConnection = {
  __typename?: 'CoachConnection';
  items?: Maybe<Array<Maybe<Coach>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type CoachInput = {
  coach_id: Scalars['String'];
  email?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  office_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  phone_number?: InputMaybe<Scalars['String']>;
};

export type CoachSchedule = {
  __typename?: 'CoachSchedule';
  created_by?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  max?: Maybe<Scalars['Int']>;
};

export type CoachScheduleConnection = {
  __typename?: 'CoachScheduleConnection';
  items?: Maybe<Array<Maybe<CoachSchedule>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type CoachScheduleInput = {
  date?: InputMaybe<Scalars['String']>;
  max?: InputMaybe<Scalars['Int']>;
};

export type CoachUpdateInput = {
  coach_id: Scalars['String'];
  email?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  office_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  phone_number?: InputMaybe<Scalars['String']>;
  user_status?: InputMaybe<UserStatus>;
};

export enum ConductedStatus {
  DecidedToBuy = 'DECIDED_TO_BUY',
  OutrightDeclined = 'OUTRIGHT_DECLINED',
  PendingConfirmation = 'PENDING_CONFIRMATION',
  WillingToLend = 'WILLING_TO_LEND'
}

export type CustomerInformation = {
  __typename?: 'CustomerInformation';
  address_extention_1?: Maybe<Scalars['String']>;
  address_extention_2?: Maybe<Scalars['String']>;
  address_extention_3?: Maybe<Scalars['String']>;
  address_extention_4?: Maybe<Scalars['String']>;
  age?: Maybe<Scalars['Int']>;
  barangay?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  digi_code?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  parcel_shop_id?: Maybe<Scalars['String']>;
  po_box?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  salutation?: Maybe<Scalars['String']>;
  sap_number?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  street_number?: Maybe<Scalars['String']>;
  telephone_number?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
};

export type CustomerInformationInput = {
  address_extention_1?: InputMaybe<Scalars['String']>;
  address_extention_2?: InputMaybe<Scalars['String']>;
  address_extention_3?: InputMaybe<Scalars['String']>;
  address_extention_4?: InputMaybe<Scalars['String']>;
  age?: InputMaybe<Scalars['Int']>;
  barangay?: InputMaybe<Scalars['String']>;
  building?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  digi_code?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  language?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  parcel_shop_id?: InputMaybe<Scalars['String']>;
  po_box?: InputMaybe<Scalars['String']>;
  province?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['String']>;
  salutation?: InputMaybe<Scalars['String']>;
  sap_number?: InputMaybe<Scalars['String']>;
  street?: InputMaybe<Scalars['String']>;
  street_number?: InputMaybe<Scalars['String']>;
  telephone_number?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
};

export type DateFilter = {
  from?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
};

export type FilterInput = {
  attribute?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export enum FilterStatus {
  Cancelled = 'CANCELLED',
  CompletedNoSale = 'COMPLETED_NO_SALE',
  CompletedSale = 'COMPLETED_SALE',
  Contacted = 'CONTACTED',
  Pending = 'PENDING',
  Rescheduled = 'RESCHEDULED',
  Unresponsive = 'UNRESPONSIVE'
}

export type FootTraffic = {
  __typename?: 'FootTraffic';
  count?: Maybe<Scalars['Int']>;
  date?: Maybe<Scalars['String']>;
  date_created?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['ID']>;
};

export type FootTrafficConnection = {
  __typename?: 'FootTrafficConnection';
  items?: Maybe<Array<Maybe<FootTraffic>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type GeoLocation = {
  __typename?: 'GeoLocation';
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
};

export type GeoLocationInput = {
  latitude?: InputMaybe<Scalars['Float']>;
  longitude?: InputMaybe<Scalars['Float']>;
};

export type HyperCareComment = {
  __typename?: 'HyperCareComment';
  comment?: Maybe<Scalars['String']>;
  date_created?: Maybe<Scalars['AWSTimestamp']>;
  day?: Maybe<Scalars['Int']>;
};

export type HyperCareCommentInput = {
  comment?: InputMaybe<Scalars['String']>;
  date_created?: InputMaybe<Scalars['AWSTimestamp']>;
  day?: InputMaybe<Scalars['Int']>;
};

export type IBatchItems = {
  batch_id?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  expiration_date?: Maybe<Scalars['String']>;
  gtin?: Maybe<Scalars['String']>;
  inventory?: Maybe<InventoryItemConnection>;
  quantity?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  unit_of_measure?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type ITransaction = {
  date_created?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  status?: Maybe<TransactionStatus>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type InventoryCheckInput = {
  gtin?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Int']>;
  warehouse_id: Scalars['ID'];
};

export type InventoryItem = {
  __typename?: 'InventoryItem';
  batch_id?: Maybe<Scalars['String']>;
  charger_serial?: Maybe<Scalars['String']>;
  cycle?: Maybe<Scalars['Float']>;
  cycle_history?: Maybe<Array<Maybe<Scalars['Float']>>>;
  date_created?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  expiration_date?: Maybe<Scalars['String']>;
  gtin?: Maybe<Scalars['String']>;
  holder_serial?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  issue_date?: Maybe<Scalars['String']>;
  item_status?: Maybe<InventoryItemStatus>;
  location?: Maybe<Scalars['String']>;
  manufacturing_date?: Maybe<Scalars['String']>;
  order_history?: Maybe<Array<Maybe<Scalars['ID']>>>;
  order_id?: Maybe<Scalars['String']>;
  pullout_id?: Maybe<Scalars['String']>;
  return_id?: Maybe<Scalars['String']>;
  serial?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
  status_date?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
  transfer_id?: Maybe<Scalars['String']>;
  transmittal_id?: Maybe<Scalars['String']>;
  unit_of_measure?: Maybe<Scalars['String']>;
  usage_history?: Maybe<Array<Maybe<UsageHistory>>>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type InventoryItemConnection = {
  __typename?: 'InventoryItemConnection';
  items?: Maybe<Array<Maybe<InventoryItem>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type InventoryItemInput = {
  batch_id: Scalars['String'];
  charger_serial?: InputMaybe<Scalars['String']>;
  gtin: Scalars['String'];
  holder_serial?: InputMaybe<Scalars['String']>;
  serial: Scalars['String'];
  tag?: InputMaybe<Scalars['String']>;
  transmittal_id: Scalars['String'];
  type?: InputMaybe<Scalars['String']>;
};

export enum InventoryItemStatus {
  Available = 'AVAILABLE',
  Pending = 'PENDING',
  Pullout = 'PULLOUT',
  Released = 'RELEASED'
}

export type LampsLog = {
  __typename?: 'LampsLog';
  decline_extended_trial_comments?: Maybe<Scalars['String']>;
  decline_extended_trial_reason?: Maybe<Scalars['String']>;
  decline_test_drive_comments?: Maybe<Scalars['String']>;
  decline_test_drive_reason?: Maybe<Scalars['String']>;
  extended_provided_id?: Maybe<Scalars['String']>;
  extended_trial_signature?: Maybe<S3Object>;
  lamps_extended_trial?: Maybe<Scalars['String']>;
  lamps_guided_trial?: Maybe<Scalars['String']>;
  lamps_sa_number?: Maybe<Scalars['String']>;
  lamps_test_drive?: Maybe<Scalars['String']>;
  outright_decline_comments?: Maybe<Scalars['String']>;
  outright_decline_reason?: Maybe<Scalars['String']>;
  test_drive_provided_id?: Maybe<Scalars['String']>;
  test_drive_signature?: Maybe<S3Object>;
};

export type LampsLogInput = {
  decline_extended_trial_comments?: InputMaybe<Scalars['String']>;
  decline_extended_trial_reason?: InputMaybe<Scalars['String']>;
  decline_test_drive_comments?: InputMaybe<Scalars['String']>;
  decline_test_drive_reason?: InputMaybe<Scalars['String']>;
  extended_provided_id?: InputMaybe<Scalars['String']>;
  extended_trial_signature?: InputMaybe<S3ObjectInput>;
  lamps_extended_trial?: InputMaybe<Scalars['String']>;
  lamps_guided_trial?: InputMaybe<Scalars['String']>;
  lamps_sa_number?: InputMaybe<Scalars['String']>;
  lamps_test_drive?: InputMaybe<Scalars['String']>;
  outright_decline_comments?: InputMaybe<Scalars['String']>;
  outright_decline_reason?: InputMaybe<Scalars['String']>;
  test_drive_provided_id?: InputMaybe<Scalars['String']>;
  test_drive_signature?: InputMaybe<S3ObjectInput>;
};

export type Lead = {
  __typename?: 'Lead';
  activation_id?: Maybe<Scalars['String']>;
  actual_delivery_date?: Maybe<Scalars['AWSTimestamp']>;
  additional_customer_information?: Maybe<AdditionalCustomerInformation>;
  additional_files?: Maybe<AdditionalFiles>;
  allow_duplicate_status?: Maybe<Scalars['String']>;
  appointment_id?: Maybe<Scalars['String']>;
  appointment_reason?: Maybe<AppointmentReason>;
  appointment_schedule_date?: Maybe<Scalars['AWSTimestamp']>;
  appointment_schedule_time?: Maybe<Scalars['AWSTime']>;
  appointment_status?: Maybe<AppointmentStatus>;
  approved_by?: Maybe<Scalars['String']>;
  assigned_coach?: Maybe<Scalars['String']>;
  cancel_comments?: Maybe<Scalars['String']>;
  cancel_reason?: Maybe<Scalars['String']>;
  clientelling_screenshot?: Maybe<S3Object>;
  closed_date?: Maybe<Scalars['AWSTimestamp']>;
  comments?: Maybe<Array<Maybe<HyperCareComment>>>;
  conducted_status?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['String']>;
  csc_status?: Maybe<Scalars['String']>;
  customer_information?: Maybe<CustomerInformation>;
  customer_number?: Maybe<Scalars['String']>;
  date_created?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['String']>;
  decline_comments?: Maybe<Scalars['String']>;
  decline_reason?: Maybe<Scalars['String']>;
  delivery_date?: Maybe<Scalars['AWSTimestamp']>;
  delivery_method?: Maybe<Scalars['String']>;
  delivery_time?: Maybe<Scalars['AWSTime']>;
  extended_trial?: Maybe<Scalars['Boolean']>;
  extended_trial_items?: Maybe<Array<Maybe<OrderItem>>>;
  extended_trial_items_promo_items?: Maybe<Array<Maybe<OrderItem>>>;
  field_executive?: Maybe<Scalars['String']>;
  followup_date?: Maybe<Scalars['AWSTimestamp']>;
  followup_time?: Maybe<Scalars['AWSTime']>;
  guided_trial_date?: Maybe<Scalars['AWSTimestamp']>;
  guided_trial_items?: Maybe<Array<Maybe<OrderItem>>>;
  guided_trial_items_promo_items?: Maybe<Array<Maybe<OrderItem>>>;
  guided_trial_schedule_date?: Maybe<Scalars['AWSTimestamp']>;
  guided_trial_schedule_time?: Maybe<Scalars['AWSTime']>;
  guided_trial_status?: Maybe<Scalars['String']>;
  guided_trial_time?: Maybe<Scalars['AWSTime']>;
  id?: Maybe<Scalars['ID']>;
  is_virtual_guided_trial?: Maybe<Scalars['Boolean']>;
  lamp_date?: Maybe<Scalars['AWSTimestamp']>;
  lamps_codentify?: Maybe<Scalars['String']>;
  lamps_extended_trial?: Maybe<Scalars['Boolean']>;
  lamps_guided_trial?: Maybe<Scalars['Boolean']>;
  lamps_log?: Maybe<LampsLog>;
  last_updated_by?: Maybe<Scalars['String']>;
  last_updated_hypercare?: Maybe<Scalars['String']>;
  last_updated_unresponsive?: Maybe<Scalars['String']>;
  lead_id?: Maybe<Scalars['String']>;
  lead_source?: Maybe<Scalars['String']>;
  lead_status?: Maybe<LeadStatus>;
  lead_type?: Maybe<Scalars['String']>;
  lending_codentify?: Maybe<Scalars['String']>;
  lending_items?: Maybe<Array<Maybe<OrderItem>>>;
  lending_items_promo_items?: Maybe<Array<Maybe<OrderItem>>>;
  lending_log?: Maybe<LendingLog>;
  lending_order_status?: Maybe<Scalars['String']>;
  order_reference_number?: Maybe<Scalars['String']>;
  original_guided_trial_schedule_date?: Maybe<Scalars['AWSTimestamp']>;
  original_guided_trial_schedule_time?: Maybe<Scalars['AWSTime']>;
  outlet_id?: Maybe<Scalars['String']>;
  payment_type?: Maybe<Scalars['String']>;
  provided_id?: Maybe<Scalars['String']>;
  purchase_code?: Maybe<Scalars['String']>;
  purchase_code_type?: Maybe<Scalars['String']>;
  purchase_date?: Maybe<Scalars['AWSTimestamp']>;
  purchase_device_codentify?: Maybe<Scalars['String']>;
  purchase_device_type?: Maybe<Scalars['String']>;
  purchase_items?: Maybe<Array<Maybe<OrderItem>>>;
  purchase_items_promo_items?: Maybe<Array<Maybe<OrderItem>>>;
  purchase_order_id?: Maybe<Scalars['String']>;
  purchase_order_status?: Maybe<Scalars['String']>;
  purchase_status?: Maybe<Scalars['String']>;
  purchase_type?: Maybe<Scalars['String']>;
  requested_purchase_code?: Maybe<Scalars['String']>;
  requested_purchase_code_type?: Maybe<Scalars['String']>;
  return_date?: Maybe<Scalars['AWSTimestamp']>;
  special_instructions?: Maybe<Scalars['String']>;
  special_request?: Maybe<Scalars['String']>;
  test_drive_items?: Maybe<Array<Maybe<OrderItem>>>;
  test_drive_items_promo_items?: Maybe<Array<Maybe<OrderItem>>>;
  unresponsive?: Maybe<Scalars['Boolean']>;
  unresponsive_count?: Maybe<Scalars['Int']>;
  unresponsive_day?: Maybe<Scalars['Int']>;
  unresponsive_remarks?: Maybe<Scalars['String']>;
  unresponsive_status?: Maybe<Scalars['String']>;
  update_logs?: Maybe<Array<Maybe<UpdateLog>>>;
};

export type LeadConnection = {
  __typename?: 'LeadConnection';
  items?: Maybe<Array<Maybe<Lead>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type LeadInput = {
  activation_id?: InputMaybe<Scalars['String']>;
  additional_customer_information?: InputMaybe<AdditionalCustomerInformationInput>;
  additional_files?: InputMaybe<AdditionalFilesInput>;
  allow_duplicate_status?: InputMaybe<Scalars['String']>;
  appointment_id?: InputMaybe<Scalars['String']>;
  appointment_reason?: InputMaybe<AppointmentReason>;
  appointment_schedule_date?: InputMaybe<Scalars['AWSTimestamp']>;
  appointment_schedule_time?: InputMaybe<Scalars['AWSTime']>;
  appointment_status?: InputMaybe<AppointmentStatus>;
  approved_by?: InputMaybe<Scalars['String']>;
  assigned_coach?: InputMaybe<Scalars['String']>;
  cancel_comments?: InputMaybe<Scalars['String']>;
  cancel_reason?: InputMaybe<Scalars['String']>;
  clientelling_screenshot?: InputMaybe<S3ObjectInput>;
  closed_date?: InputMaybe<Scalars['AWSTimestamp']>;
  comments?: InputMaybe<Array<InputMaybe<HyperCareCommentInput>>>;
  conducted_status?: InputMaybe<Scalars['String']>;
  created_by?: InputMaybe<Scalars['String']>;
  csc_status?: InputMaybe<Scalars['String']>;
  customer_information?: InputMaybe<CustomerInformationInput>;
  customer_number?: InputMaybe<Scalars['String']>;
  decline_comments?: InputMaybe<Scalars['String']>;
  decline_reason?: InputMaybe<Scalars['String']>;
  delivery_date?: InputMaybe<Scalars['AWSTimestamp']>;
  delivery_method?: InputMaybe<Scalars['String']>;
  delivery_time?: InputMaybe<Scalars['AWSTime']>;
  extended_trial?: InputMaybe<Scalars['Boolean']>;
  field_executive?: InputMaybe<Scalars['String']>;
  followup_date?: InputMaybe<Scalars['AWSTimestamp']>;
  followup_time?: InputMaybe<Scalars['AWSTime']>;
  guided_trial_date?: InputMaybe<Scalars['AWSTimestamp']>;
  guided_trial_schedule_date?: InputMaybe<Scalars['AWSTimestamp']>;
  guided_trial_schedule_time?: InputMaybe<Scalars['AWSTime']>;
  guided_trial_status?: InputMaybe<Scalars['String']>;
  guided_trial_time?: InputMaybe<Scalars['AWSTime']>;
  is_virtual_guided_trial?: InputMaybe<Scalars['Boolean']>;
  lamps_extended_trial?: InputMaybe<Scalars['Boolean']>;
  lamps_guided_trial?: InputMaybe<Scalars['Boolean']>;
  lamps_log?: InputMaybe<LampsLogInput>;
  last_updated_hypercare?: InputMaybe<Scalars['String']>;
  last_updated_unresponsive?: InputMaybe<Scalars['String']>;
  lead_id: Scalars['String'];
  lead_source?: InputMaybe<Scalars['String']>;
  lead_status?: InputMaybe<LeadStatus>;
  lead_type?: InputMaybe<Scalars['String']>;
  lending_log?: InputMaybe<LendingLogInput>;
  lending_order_status?: InputMaybe<Scalars['String']>;
  original_guided_trial_schedule_date?: InputMaybe<Scalars['AWSTimestamp']>;
  original_guided_trial_schedule_time?: InputMaybe<Scalars['AWSTime']>;
  outlet_id?: InputMaybe<Scalars['String']>;
  payment_type?: InputMaybe<Scalars['String']>;
  provided_id?: InputMaybe<Scalars['String']>;
  purchase_code?: InputMaybe<Scalars['String']>;
  purchase_code_type?: InputMaybe<Scalars['String']>;
  purchase_date?: InputMaybe<Scalars['AWSTimestamp']>;
  purchase_device_codentify?: InputMaybe<Scalars['String']>;
  purchase_device_type?: InputMaybe<Scalars['String']>;
  purchase_order_id?: InputMaybe<Scalars['String']>;
  purchase_order_status?: InputMaybe<Scalars['String']>;
  purchase_status?: InputMaybe<Scalars['String']>;
  purchase_type?: InputMaybe<Scalars['String']>;
  return_date?: InputMaybe<Scalars['AWSTimestamp']>;
  special_instructions?: InputMaybe<Scalars['String']>;
  special_request?: InputMaybe<Scalars['String']>;
  unresponsive?: InputMaybe<Scalars['Boolean']>;
  unresponsive_count?: InputMaybe<Scalars['Int']>;
  unresponsive_day?: InputMaybe<Scalars['Int']>;
  unresponsive_remarks?: InputMaybe<Scalars['String']>;
  unresponsive_status?: InputMaybe<Scalars['String']>;
};

export enum LeadStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Pending = 'PENDING',
  Scheduled = 'SCHEDULED'
}

export type LendingLog = {
  __typename?: 'LendingLog';
  decline_lending_comments?: Maybe<Scalars['String']>;
  decline_lending_reason?: Maybe<Scalars['String']>;
  guided_trial?: Maybe<Scalars['String']>;
  lending?: Maybe<Scalars['String']>;
  lending_provided_id?: Maybe<Scalars['String']>;
  lending_signature?: Maybe<S3Object>;
  outright_decline_comments?: Maybe<Scalars['String']>;
  outright_decline_reason?: Maybe<Scalars['String']>;
  purchase?: Maybe<Scalars['String']>;
  sa_number?: Maybe<Scalars['String']>;
  sales_invoice_number?: Maybe<Scalars['String']>;
};

export type LendingLogInput = {
  decline_lending_comments?: InputMaybe<Scalars['String']>;
  decline_lending_reason?: InputMaybe<Scalars['String']>;
  guided_trial?: InputMaybe<Scalars['String']>;
  lending?: InputMaybe<Scalars['String']>;
  lending_provided_id?: InputMaybe<Scalars['String']>;
  lending_signature?: InputMaybe<S3ObjectInput>;
  outright_decline_comments?: InputMaybe<Scalars['String']>;
  outright_decline_reason?: InputMaybe<Scalars['String']>;
  purchase?: InputMaybe<Scalars['String']>;
  sa_number?: InputMaybe<Scalars['String']>;
  sales_invoice_number?: InputMaybe<Scalars['String']>;
};

export type LineItem = {
  __typename?: 'LineItem';
  input?: Maybe<Scalars['String']>;
  inputs?: Maybe<Array<Maybe<Scalars['String']>>>;
  quantity?: Maybe<Scalars['Int']>;
  serials?: Maybe<Array<Maybe<Scalars['ID']>>>;
  sku?: Maybe<Sku>;
};

export type LineItemInput = {
  gtin: Scalars['ID'];
  info?: InputMaybe<SkuInput>;
  inputs?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  quantity?: InputMaybe<Scalars['Int']>;
  serials?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  sku?: InputMaybe<Scalars['String']>;
};

export type Material = {
  __typename?: 'Material';
  material_number?: Maybe<Scalars['String']>;
  plants?: Maybe<Array<Maybe<Plant>>>;
  sellable?: Maybe<Scalars['Int']>;
};

export type MemberActivationOutlet = {
  __typename?: 'MemberActivationOutlet';
  activation_id?: Maybe<Scalars['String']>;
  coach_id?: Maybe<Scalars['String']>;
  fsr_manday?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['String']>;
  outlet_id?: Maybe<Scalars['String']>;
  user_type?: Maybe<Scalars['String']>;
};

export type MemberActivationOutletConnection = {
  __typename?: 'MemberActivationOutletConnection';
  items?: Maybe<Array<Maybe<MemberActivationOutlet>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type MemberActivationOutletInput = {
  activation_id?: InputMaybe<Scalars['String']>;
  coach_id?: InputMaybe<Scalars['String']>;
  outlet_id?: InputMaybe<Scalars['String']>;
  user_type?: InputMaybe<Scalars['String']>;
};

export type MemberActivationOutletUpdateInput = {
  activation_id?: InputMaybe<Scalars['String']>;
  coach_id?: InputMaybe<Scalars['String']>;
  fsr_manday?: InputMaybe<Scalars['Float']>;
  outlet_id?: InputMaybe<Scalars['String']>;
};

export type Message = {
  __typename?: 'Message';
  message?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  activationCreate?: Maybe<Activation>;
  activationOutletUpdate?: Maybe<ActivationOutlet>;
  activationUpdate?: Maybe<Activation>;
  adminCreate?: Maybe<Admin>;
  adminUpdate?: Maybe<Admin>;
  arSend?: Maybe<Scalars['String']>;
  assetUpload?: Maybe<Message>;
  coachCreate?: Maybe<Coach>;
  coachDelete?: Maybe<Coach>;
  coachScheduleCreate?: Maybe<Array<Maybe<CoachSchedule>>>;
  coachUpdate?: Maybe<Coach>;
  footTrafficCreate?: Maybe<FootTraffic>;
  leadBatchUpload?: Maybe<Message>;
  leadCreate?: Maybe<Lead>;
  leadUpdate?: Maybe<Lead>;
  memberActivationOutletAdd?: Maybe<MemberActivationOutlet>;
  memberActivationOutletRemove?: Maybe<MemberActivationOutlet>;
  memberActivationOutletUpdate?: Maybe<MemberActivationOutlet>;
  outletCreate?: Maybe<Outlet>;
  outletUpdate?: Maybe<Outlet>;
  pickAndPackSaveLead?: Maybe<Lead>;
  pickAndPackVoidLead?: Maybe<Lead>;
  promoCreate?: Maybe<Promo>;
  promoItemsAddLead?: Maybe<Lead>;
  promoItemsRemoveLead?: Maybe<Lead>;
  promoUpdate?: Maybe<Promo>;
  pulloutByBatch?: Maybe<Pullout>;
  pulloutByBatches?: Maybe<Pullout>;
  pulloutCreate?: Maybe<Pullout>;
  pulloutItem?: Maybe<InventoryItem>;
  pulloutItemVoid?: Maybe<Pullout>;
  pulloutUpdate?: Maybe<Pullout>;
  refundTransactionRecord?: Maybe<SaleTransaction>;
  refundTransactionRemove?: Maybe<SaleTransaction>;
  refundTransactionUpdate?: Maybe<SaleTransaction>;
  resetPassword?: Maybe<Admin>;
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
  skuCreate?: Maybe<Sku>;
  skuUpdate?: Maybe<Sku>;
  theftCreate?: Maybe<Theft>;
  transactionRemove?: Maybe<Transmittal>;
  transferByBatch?: Maybe<Transfer>;
  transferByBatchReceive?: Maybe<Transfer>;
  transferCreate?: Maybe<Transfer>;
  transferItem?: Maybe<InventoryItem>;
  transferItemReceive?: Maybe<InventoryItem>;
  transferItemReceiveVoid?: Maybe<InventoryItem>;
  transferItemVoid?: Maybe<Transfer>;
  transferUpdate?: Maybe<Transfer>;
  transmitByBatch?: Maybe<Transmittal>;
  transmitItem?: Maybe<InventoryItem>;
  transmitItemVoid?: Maybe<Transmittal>;
  transmittalCreate?: Maybe<Transmittal>;
  transmittalUpdate?: Maybe<Transmittal>;
  userDisable?: Maybe<Admin>;
  userEnable?: Maybe<Admin>;
  viberCommunityMemberCreate?: Maybe<ViberCommunityMember>;
  viberCommunityMemberUpdate?: Maybe<ViberCommunityMember>;
  warehouseCreate?: Maybe<Warehouse>;
  warehouseUpdate?: Maybe<Warehouse>;
};


export type MutationActivationCreateArgs = {
  input?: InputMaybe<ActivationInput>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationActivationOutletUpdateArgs = {
  input?: InputMaybe<ActivationOutletUpdate>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationActivationUpdateArgs = {
  input?: InputMaybe<ActivationUpdateInput>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationAdminCreateArgs = {
  input?: InputMaybe<AdminInput>;
};


export type MutationAdminUpdateArgs = {
  input?: InputMaybe<AdminUpdateInput>;
};


export type MutationArSendArgs = {
  email?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<S3ObjectInput>;
};


export type MutationAssetUploadArgs = {
  asset: S3ObjectInput;
  asset_type: AssetType;
  record_no: Scalars['ID'];
  ref_id: Scalars['ID'];
};


export type MutationCoachCreateArgs = {
  input?: InputMaybe<CoachInput>;
};


export type MutationCoachDeleteArgs = {
  coach_id: Scalars['String'];
};


export type MutationCoachScheduleCreateArgs = {
  input?: InputMaybe<Array<InputMaybe<CoachScheduleInput>>>;
};


export type MutationCoachUpdateArgs = {
  input?: InputMaybe<CoachUpdateInput>;
};


export type MutationFootTrafficCreateArgs = {
  count: Scalars['Int'];
  date: Scalars['String'];
  warehouse_id: Scalars['ID'];
};


export type MutationLeadBatchUploadArgs = {
  input?: InputMaybe<S3ObjectInput>;
};


export type MutationLeadCreateArgs = {
  activation_type?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<LeadInput>;
};


export type MutationLeadUpdateArgs = {
  id: Scalars['ID'];
  input?: InputMaybe<LeadInput>;
};


export type MutationMemberActivationOutletAddArgs = {
  input?: InputMaybe<MemberActivationOutletInput>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationMemberActivationOutletRemoveArgs = {
  input?: InputMaybe<MemberActivationOutletInput>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationMemberActivationOutletUpdateArgs = {
  input?: InputMaybe<MemberActivationOutletUpdateInput>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationOutletCreateArgs = {
  input?: InputMaybe<OutletInput>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationOutletUpdateArgs = {
  input?: InputMaybe<OutletInput>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationPickAndPackSaveLeadArgs = {
  input?: InputMaybe<Array<InputMaybe<PickAndPackInput>>>;
  order_id?: InputMaybe<Scalars['String']>;
  order_type?: InputMaybe<Scalars['String']>;
  trial_type: TrialType;
};


export type MutationPickAndPackVoidLeadArgs = {
  order_id?: InputMaybe<Scalars['String']>;
  order_type?: InputMaybe<Scalars['String']>;
  trial_type: TrialType;
};


export type MutationPromoCreateArgs = {
  code: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  type?: InputMaybe<PromoType>;
};


export type MutationPromoItemsAddLeadArgs = {
  input?: InputMaybe<Array<InputMaybe<PickAndPackInput>>>;
  order_id?: InputMaybe<Scalars['String']>;
  order_type?: InputMaybe<Scalars['String']>;
  trial_type: TrialType;
};


export type MutationPromoItemsRemoveLeadArgs = {
  order_id?: InputMaybe<Scalars['String']>;
  order_type?: InputMaybe<Scalars['String']>;
  trial_type: TrialType;
};


export type MutationPromoUpdateArgs = {
  code: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<PromoStatus>;
  type?: InputMaybe<PromoType>;
};


export type MutationPulloutByBatchArgs = {
  input?: InputMaybe<BatchItemsInput>;
  pullout_id: Scalars['String'];
};


export type MutationPulloutByBatchesArgs = {
  input?: InputMaybe<Array<InputMaybe<BatchItemsInput>>>;
  pullout_id: Scalars['String'];
};


export type MutationPulloutCreateArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<PulloutInput>;
};


export type MutationPulloutItemArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  pullout_id: Scalars['String'];
  serial: Scalars['String'];
  type?: InputMaybe<Scalars['String']>;
};


export type MutationPulloutItemVoidArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  pullout_id: Scalars['String'];
  serial?: InputMaybe<Scalars['String']>;
};


export type MutationPulloutUpdateArgs = {
  input?: InputMaybe<PulloutUpdateInput>;
};


export type MutationRefundTransactionRecordArgs = {
  input: RefundTransactionInput;
};


export type MutationRefundTransactionRemoveArgs = {
  transaction_id: Scalars['ID'];
};


export type MutationRefundTransactionUpdateArgs = {
  input: RefundTransactionInput;
  transaction_id: Scalars['ID'];
};


export type MutationResetPasswordArgs = {
  input?: InputMaybe<ResetPasswordInput>;
};


export type MutationReturnByBatchArgs = {
  input?: InputMaybe<BatchItemsInput>;
  return_id: Scalars['String'];
};


export type MutationReturnByBatchesArgs = {
  input?: InputMaybe<Array<InputMaybe<BatchItemsInput>>>;
  return_id: Scalars['String'];
};


export type MutationReturnCreateArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<ReturnInput>;
};


export type MutationReturnItemArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  return_id: Scalars['String'];
  serial: Scalars['String'];
};


export type MutationReturnItemVoidArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  return_id: Scalars['String'];
  serial?: InputMaybe<Scalars['String']>;
};


export type MutationReturnUpdateArgs = {
  input?: InputMaybe<ReturnUpdateInput>;
};


export type MutationSaleTransactionRecordArgs = {
  input: SaleTransactionInput;
};


export type MutationSaleTransactionRemoveArgs = {
  transaction_id: Scalars['ID'];
};


export type MutationSaleTransactionUpdateArgs = {
  input: SaleTransactionInput;
  transaction_id: Scalars['ID'];
};


export type MutationSalesExpertCreateArgs = {
  input?: InputMaybe<SalesExpertInput>;
};


export type MutationSalesExpertDeleteArgs = {
  sales_expert_id: Scalars['String'];
};


export type MutationSalesExpertUpdateArgs = {
  input?: InputMaybe<SalesExpertUpdateInput>;
};


export type MutationSkuCreateArgs = {
  input: SkuInput;
};


export type MutationSkuUpdateArgs = {
  input: SkuInput;
};


export type MutationTheftCreateArgs = {
  input?: InputMaybe<TheftInput>;
  warehouse_id: Scalars['ID'];
};


export type MutationTransactionRemoveArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type MutationTransferByBatchArgs = {
  input?: InputMaybe<BatchItemsInput>;
  transfer_id: Scalars['String'];
};


export type MutationTransferByBatchReceiveArgs = {
  input?: InputMaybe<BatchItemsInput>;
  transfer_id: Scalars['String'];
};


export type MutationTransferCreateArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<TransferInput>;
};


export type MutationTransferItemArgs = {
  serial: Scalars['String'];
  transfer_id: Scalars['String'];
};


export type MutationTransferItemReceiveArgs = {
  serial: Scalars['String'];
  transfer_id: Scalars['String'];
};


export type MutationTransferItemReceiveVoidArgs = {
  serial: Scalars['String'];
  transfer_id: Scalars['String'];
};


export type MutationTransferItemVoidArgs = {
  serial?: InputMaybe<Scalars['String']>;
  transfer_id?: InputMaybe<Scalars['String']>;
};


export type MutationTransferUpdateArgs = {
  input?: InputMaybe<TransferUpdateInput>;
};


export type MutationTransmitByBatchArgs = {
  input?: InputMaybe<BatchItemsInput>;
  transmittal_id: Scalars['String'];
};


export type MutationTransmitItemArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  input?: InputMaybe<InventoryItemInput>;
  transmittal_id: Scalars['String'];
};


export type MutationTransmitItemVoidArgs = {
  batch_input?: InputMaybe<BatchItemsInput>;
  serial?: InputMaybe<Scalars['String']>;
  transmittal_id: Scalars['String'];
};


export type MutationTransmittalCreateArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<TransmittalInput>;
};


export type MutationTransmittalUpdateArgs = {
  input?: InputMaybe<TransmittalUpdateInput>;
};


export type MutationUserDisableArgs = {
  username?: InputMaybe<Scalars['String']>;
};


export type MutationUserEnableArgs = {
  username?: InputMaybe<Scalars['String']>;
};


export type MutationViberCommunityMemberCreateArgs = {
  input?: InputMaybe<ViberCommunityMemberInput>;
};


export type MutationViberCommunityMemberUpdateArgs = {
  input?: InputMaybe<ViberCommunityMemberInput>;
};


export type MutationWarehouseCreateArgs = {
  input?: InputMaybe<WarehouseInput>;
};


export type MutationWarehouseUpdateArgs = {
  input?: InputMaybe<WarehouseInput>;
};

export type OrderInventoryItemInput = {
  batch_id?: InputMaybe<Scalars['String']>;
  charger_serial?: InputMaybe<Scalars['String']>;
  cycle?: InputMaybe<Scalars['Float']>;
  gtin?: InputMaybe<Scalars['String']>;
  holder_serial?: InputMaybe<Scalars['String']>;
  serial?: InputMaybe<Scalars['String']>;
  tag?: InputMaybe<Scalars['String']>;
  unit_of_measure?: InputMaybe<Scalars['String']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  batch_items?: Maybe<Array<Maybe<BatchItem>>>;
  description?: Maybe<Scalars['String']>;
  inventory_items?: Maybe<Array<Maybe<InventoryItem>>>;
  price_per_unit?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Int']>;
  quantity_unit?: Maybe<Scalars['String']>;
  scanned_quantity?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Float']>;
};

export type OrderItemInput = {
  batch_items?: InputMaybe<Array<InputMaybe<BatchItemsInput>>>;
  description?: InputMaybe<Scalars['String']>;
  inventory_items?: InputMaybe<Array<InputMaybe<OrderInventoryItemInput>>>;
  price_per_unit?: InputMaybe<Scalars['Float']>;
  quantity?: InputMaybe<Scalars['Int']>;
  quantity_unit?: InputMaybe<Scalars['String']>;
  scanned_quantity?: InputMaybe<Scalars['Int']>;
  sku?: InputMaybe<Scalars['String']>;
  total?: InputMaybe<Scalars['Float']>;
};

export type Outlet = {
  __typename?: 'Outlet';
  barangay?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type OutletConnection = {
  __typename?: 'OutletConnection';
  items?: Maybe<Array<Maybe<Outlet>>>;
  scroll_id?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type OutletInput = {
  barangay?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type PickAndPackInput = {
  gtin: Scalars['String'];
  scanned_quantity: Scalars['Int'];
  serials?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Plant = {
  __typename?: 'Plant';
  plant_number?: Maybe<Scalars['String']>;
  storages?: Maybe<Array<Maybe<Storage>>>;
};

export type Promo = {
  __typename?: 'Promo';
  code?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<PromoStatus>;
  type?: Maybe<PromoType>;
};

export type PromoConnection = {
  __typename?: 'PromoConnection';
  items?: Maybe<Array<Maybe<Promo>>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type PromoInput = {
  code?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<PromoStatus>;
  type?: InputMaybe<PromoType>;
};

export enum PromoStatus {
  Disabled = 'DISABLED',
  Enabled = 'ENABLED'
}

export enum PromoType {
  FreeGoods = 'FREE_GOODS',
  FreeHeets = 'FREE_HEETS',
  StarterKit = 'STARTER_KIT',
  Voucher = 'VOUCHER'
}

export type Pullout = ITransaction & {
  __typename?: 'Pullout';
  batch_items?: Maybe<Array<Maybe<BatchPulloutItems>>>;
  date_created?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  pullout_to?: Maybe<Scalars['String']>;
  pullout_type?: Maybe<PulloutType>;
  remarks?: Maybe<Scalars['String']>;
  status?: Maybe<TransactionStatus>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type PulloutInput = {
  pullout_type?: InputMaybe<PulloutType>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};

export type PulloutItemInput = {
  pullout_id: Scalars['String'];
  serial: Scalars['String'];
};

export enum PulloutType {
  BadInventory = 'BadInventory',
  FieldSalesRepresentative = 'FieldSalesRepresentative',
  ForSelling = 'ForSelling',
  FreebiesSample = 'FreebiesSample',
  SalesExpert = 'SalesExpert'
}

export type PulloutUpdateInput = {
  id: Scalars['String'];
  invoice_id?: InputMaybe<Scalars['String']>;
  pullout_to?: InputMaybe<Scalars['String']>;
  pullout_type?: InputMaybe<PulloutType>;
  remarks?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<TransactionStatus>;
};

export enum PurchaseStatus {
  Cancelled = 'CANCELLED',
  CompletedNoSale = 'COMPLETED_NO_SALE',
  CompletedSale = 'COMPLETED_SALE',
  Ongoing = 'ONGOING'
}

export type Query = {
  __typename?: 'Query';
  activation?: Maybe<Activation>;
  activationOutlet?: Maybe<ActivationOutlet>;
  activationOutletsPerMember?: Maybe<MemberActivationOutletConnection>;
  activations?: Maybe<ActivationConnection>;
  admin?: Maybe<Admin>;
  admins?: Maybe<AdminConnection>;
  batchesPerWarehouse?: Maybe<BatchItemsConnection>;
  coach?: Maybe<Coach>;
  coachSchedules?: Maybe<CoachScheduleConnection>;
  coaches?: Maybe<CoachConnection>;
  footTraffic?: Maybe<FootTrafficConnection>;
  hyperCares?: Maybe<LeadConnection>;
  inventoryCheck?: Maybe<Message>;
  inventoryItem?: Maybe<InventoryItem>;
  inventoryItems?: Maybe<InventoryItemConnection>;
  inventoryPerBatchPullout?: Maybe<InventoryItemConnection>;
  inventoryPerBatchTransfer?: Maybe<InventoryItemConnection>;
  inventoryPerBatchTransmittal?: Maybe<InventoryItemConnection>;
  lead?: Maybe<Lead>;
  leads?: Maybe<LeadConnection>;
  leadsByGuidedTrialSchedule?: Maybe<LeadConnection>;
  leadsDuplicate?: Maybe<LeadConnection>;
  leadsPerActivation?: Maybe<LeadConnection>;
  leadsPerCoachFilter?: Maybe<LeadConnection>;
  membersPerActivationOutlet?: Maybe<MemberActivationOutletConnection>;
  outlet?: Maybe<Outlet>;
  outlets?: Maybe<OutletConnection>;
  promos?: Maybe<PromoConnection>;
  pullout?: Maybe<Pullout>;
  pulloutToItems?: Maybe<InventoryItemConnection>;
  refundTransactions?: Maybe<SaleTransactionConnection>;
  reportWarehouse?: Maybe<Scalars['AWSURL']>;
  return?: Maybe<Return>;
  saleTransactions?: Maybe<SaleTransactionConnection>;
  salesExpert?: Maybe<SalesExpert>;
  salesExperts?: Maybe<SalesExpertConnection>;
  sku?: Maybe<Sku>;
  skus?: Maybe<SkuConnection>;
  stocks?: Maybe<Stocks>;
  thefts?: Maybe<TheftsConnection>;
  transactionsPerWarehouse?: Maybe<TransactionConnection>;
  transfer?: Maybe<Transfer>;
  transfersToWarehouse?: Maybe<TransferConnection>;
  transmittal?: Maybe<Transmittal>;
  transmittals?: Maybe<TransmittalConnection>;
  users?: Maybe<UsersConnection>;
  viberCommunityMember?: Maybe<ViberCommunityMember>;
  viberCommunityMembers?: Maybe<ViberCommunityMemberConnection>;
  viberCommunityMembersReport?: Maybe<Scalars['AWSURL']>;
  warehouse?: Maybe<Warehouse>;
  warehouses?: Maybe<WarehouseConnection>;
};


export type QueryActivationArgs = {
  id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryActivationOutletArgs = {
  activation_id?: InputMaybe<Scalars['String']>;
  outlet_id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryActivationOutletsPerMemberArgs = {
  coach_id: Scalars['String'];
  next_token?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryActivationsArgs = {
  date_filter?: InputMaybe<DateFilter>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryAdminArgs = {
  username: Scalars['String'];
};


export type QueryAdminsArgs = {
  filters?: InputMaybe<Array<InputMaybe<FilterInput>>>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<FilterInput>;
};


export type QueryBatchesPerWarehouseArgs = {
  type?: InputMaybe<Scalars['String']>;
  warehouse_id: Scalars['String'];
};


export type QueryCoachArgs = {
  coach_id: Scalars['String'];
};


export type QueryCoachSchedulesArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type QueryCoachesArgs = {
  next_token?: InputMaybe<Scalars['String']>;
  user_status?: InputMaybe<UserStatus>;
};


export type QueryFootTrafficArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type QueryHyperCaresArgs = {
  assigned_coach?: InputMaybe<Scalars['String']>;
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars['String']>;
  purchase_status?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryInventoryCheckArgs = {
  input: InventoryCheckInput;
};


export type QueryInventoryItemArgs = {
  serial: Scalars['String'];
};


export type QueryInventoryItemsArgs = {
  warehouse_id?: InputMaybe<Scalars['String']>;
};


export type QueryInventoryPerBatchPulloutArgs = {
  batch_id: Scalars['String'];
  next_token?: InputMaybe<Scalars['String']>;
  pullout_id: Scalars['String'];
};


export type QueryInventoryPerBatchTransferArgs = {
  batch_id: Scalars['String'];
  gtin: Scalars['String'];
  next_token?: InputMaybe<Scalars['String']>;
  transfer_id: Scalars['String'];
};


export type QueryInventoryPerBatchTransmittalArgs = {
  batch_id: Scalars['String'];
  gtin: Scalars['String'];
  next_token?: InputMaybe<Scalars['String']>;
  transmittal_id: Scalars['String'];
};


export type QueryLeadArgs = {
  lead_id: Scalars['String'];
};


export type QueryLeadsArgs = {
  assigned_coach?: InputMaybe<Scalars['String']>;
  date_filter?: InputMaybe<DateFilter>;
  filter_status?: InputMaybe<FilterStatus>;
  next_token?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryLeadsByGuidedTrialScheduleArgs = {
  assigned_coach?: InputMaybe<Scalars['String']>;
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryLeadsDuplicateArgs = {
  birth_date?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryLeadsPerActivationArgs = {
  activation_id?: InputMaybe<Scalars['String']>;
  next_token?: InputMaybe<Scalars['String']>;
  outlet_id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryLeadsPerCoachFilterArgs = {
  assigned_coach?: InputMaybe<Scalars['String']>;
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars['String']>;
  purchase_status?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryMembersPerActivationOutletArgs = {
  activation_id: Scalars['String'];
  next_token?: InputMaybe<Scalars['String']>;
  outlet_id: Scalars['String'];
  type?: InputMaybe<Scalars['String']>;
};


export type QueryOutletArgs = {
  id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryOutletsArgs = {
  filters?: InputMaybe<Array<InputMaybe<FilterInput>>>;
  from?: InputMaybe<Scalars['AWSTimestamp']>;
  limit?: InputMaybe<Scalars['Int']>;
  scroll_id?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Array<InputMaybe<FilterInput>>>;
  to?: InputMaybe<Scalars['AWSTimestamp']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryPromosArgs = {
  next_token?: InputMaybe<Scalars['String']>;
};


export type QueryPulloutArgs = {
  id: Scalars['String'];
};


export type QueryPulloutToItemsArgs = {
  pullout_to?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};


export type QueryRefundTransactionsArgs = {
  date_filter?: InputMaybe<TimestampFilter>;
  warehouse_id: Scalars['ID'];
};


export type QueryReportWarehouseArgs = {
  filter?: InputMaybe<ReportFilter>;
  type?: InputMaybe<ReportType>;
};


export type QueryReturnArgs = {
  id: Scalars['String'];
};


export type QuerySaleTransactionsArgs = {
  date_filter?: InputMaybe<TimestampFilter>;
  warehouse_id: Scalars['ID'];
};


export type QuerySalesExpertArgs = {
  sales_expert_id: Scalars['String'];
};


export type QuerySalesExpertsArgs = {
  next_token?: InputMaybe<Scalars['String']>;
  user_status?: InputMaybe<UserStatus>;
};


export type QuerySkuArgs = {
  id: Scalars['String'];
};


export type QuerySkusArgs = {
  next_token?: InputMaybe<Scalars['String']>;
};


export type QueryTheftsArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type QueryTransactionsPerWarehouseArgs = {
  status?: InputMaybe<TransactionStatus>;
  type?: InputMaybe<TransactionType>;
  warehouse_id: Scalars['String'];
};


export type QueryTransferArgs = {
  id: Scalars['String'];
};


export type QueryTransfersToWarehouseArgs = {
  status?: InputMaybe<TransactionStatus>;
  warehouse_id: Scalars['String'];
};


export type QueryTransmittalArgs = {
  id: Scalars['String'];
};


export type QueryTransmittalsArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<TransactionStatus>;
};


export type QueryUsersArgs = {
  next_token?: InputMaybe<Scalars['String']>;
};


export type QueryViberCommunityMemberArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryViberCommunityMembersArgs = {
  coach?: InputMaybe<Scalars['String']>;
  date_filter?: InputMaybe<DateFilter>;
};


export type QueryViberCommunityMembersReportArgs = {
  coach?: InputMaybe<Scalars['String']>;
  date_filter?: InputMaybe<DateFilter>;
};


export type QueryWarehouseArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryWarehousesArgs = {
  next_token?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<WarehouseType>;
};

export type RefundTransactionInput = {
  created_by?: InputMaybe<Scalars['String']>;
  items?: InputMaybe<Array<InputMaybe<LineItemInput>>>;
  remarks?: InputMaybe<Scalars['String']>;
  transaction_no?: InputMaybe<Scalars['ID']>;
  warehouse_id?: InputMaybe<Scalars['ID']>;
};

export type ReportFilter = {
  date_filter?: InputMaybe<DateFilter>;
  warehouse_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export enum ReportType {
  Brgy = 'BRGY',
  Inventory = 'INVENTORY',
  Lamps = 'LAMPS',
  Leads = 'LEADS',
  LeadsRaw = 'LEADS_RAW',
  Sales = 'SALES',
  Tbyb = 'TBYB',
  Transactions = 'TRANSACTIONS',
  Transmittal = 'TRANSMITTAL'
}

export type ResetPasswordInput = {
  password?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type Return = ITransaction & {
  __typename?: 'Return';
  batch_items?: Maybe<Array<Maybe<BatchReturnItems>>>;
  date_created?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  return_from?: Maybe<Scalars['String']>;
  return_type?: Maybe<ReturnType>;
  status?: Maybe<TransactionStatus>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type ReturnInput = {
  return_type?: InputMaybe<ReturnType>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};

export type ReturnItemInput = {
  return_id: Scalars['String'];
  serial: Scalars['String'];
};

export enum ReturnType {
  FieldSalesRepresentative = 'FieldSalesRepresentative',
  ReturnInventory = 'ReturnInventory',
  SalesExpert = 'SalesExpert'
}

export type ReturnUpdateInput = {
  id: Scalars['String'];
  invoice_id?: InputMaybe<Scalars['String']>;
  remarks?: InputMaybe<Scalars['String']>;
  return_from?: InputMaybe<Scalars['String']>;
  return_type?: InputMaybe<ReturnType>;
  status?: InputMaybe<TransactionStatus>;
};

export enum Role {
  Admin = 'Admin',
  CscRepresentative = 'CSCRepresentative',
  CscSupervisor = 'CSCSupervisor',
  Coach = 'Coach',
  CoachExecutive = 'CoachExecutive',
  Executive = 'Executive',
  FieldExecutive = 'FieldExecutive',
  FieldSalesRepresentative = 'FieldSalesRepresentative',
  FieldSupervisor = 'FieldSupervisor',
  LendingCoordinator = 'LendingCoordinator',
  PmftcAdministrator = 'PMFTCAdministrator'
}

export type S3Object = {
  __typename?: 'S3Object';
  bucket: Scalars['String'];
  key: Scalars['String'];
  region: Scalars['String'];
};

export type S3ObjectInput = {
  bucket: Scalars['String'];
  key: Scalars['String'];
  localUri?: InputMaybe<Scalars['String']>;
  mimeType?: InputMaybe<Scalars['String']>;
  region: Scalars['String'];
};

export type Sku = {
  __typename?: 'SKU';
  description?: Maybe<Scalars['String']>;
  gtin?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  price_gross?: Maybe<Scalars['Float']>;
  promo?: Maybe<Promo>;
  sku?: Maybe<Scalars['String']>;
  type?: Maybe<SkuType>;
  unit_of_measure?: Maybe<Scalars['String']>;
};

export type SkuConnection = {
  __typename?: 'SKUConnection';
  items?: Maybe<Array<Maybe<Sku>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type SkuInput = {
  description?: InputMaybe<Scalars['String']>;
  gtin: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  promo?: InputMaybe<PromoInput>;
  promo_code?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
  type?: InputMaybe<SkuType>;
  unit_of_measure?: InputMaybe<Scalars['String']>;
};

export enum SkuType {
  Accessories = 'ACCESSORIES',
  Devices = 'DEVICES',
  Heets = 'HEETS',
  Promo = 'PROMO'
}

export type SaleTransaction = {
  __typename?: 'SaleTransaction';
  cegid_no?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['ID']>;
  date_created?: Maybe<Scalars['AWSTimestamp']>;
  date_updated?: Maybe<Scalars['AWSTimestamp']>;
  id?: Maybe<Scalars['ID']>;
  items?: Maybe<Array<Maybe<LineItem>>>;
  order_date?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  sales_expert?: Maybe<Scalars['String']>;
  signature?: Maybe<S3Object>;
  transaction_id?: Maybe<Scalars['ID']>;
  transaction_no: Scalars['ID'];
  underwent_guided_trial?: Maybe<Scalars['Boolean']>;
  updated_by?: Maybe<Scalars['ID']>;
  warehouse_id?: Maybe<Scalars['ID']>;
};

export type SaleTransactionConnection = {
  __typename?: 'SaleTransactionConnection';
  items?: Maybe<Array<Maybe<SaleTransaction>>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type SaleTransactionInput = {
  cegid_no?: InputMaybe<Scalars['String']>;
  created_by?: InputMaybe<Scalars['String']>;
  date_created?: InputMaybe<Scalars['AWSTimestamp']>;
  items?: InputMaybe<Array<InputMaybe<LineItemInput>>>;
  remarks?: InputMaybe<Scalars['String']>;
  sales_expert?: InputMaybe<Scalars['String']>;
  signature?: InputMaybe<S3ObjectInput>;
  transaction_no?: InputMaybe<Scalars['ID']>;
  underwent_guided_trial?: InputMaybe<Scalars['Boolean']>;
  warehouse_id?: InputMaybe<Scalars['ID']>;
};

export type SalesExpert = {
  __typename?: 'SalesExpert';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  office_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  phone_number?: Maybe<Scalars['String']>;
  sales_expert_id?: Maybe<Scalars['String']>;
  user_status?: Maybe<UserStatus>;
};

export type SalesExpertConnection = {
  __typename?: 'SalesExpertConnection';
  items?: Maybe<Array<Maybe<SalesExpert>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type SalesExpertInput = {
  email?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  office_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  phone_number?: InputMaybe<Scalars['String']>;
  sales_expert_id: Scalars['String'];
};

export type SalesExpertUpdateInput = {
  email?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  office_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  phone_number?: InputMaybe<Scalars['String']>;
  sales_expert_id: Scalars['String'];
  user_status?: InputMaybe<UserStatus>;
};

export type SortInput = {
  attribute?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<SortOrder>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type Stocks = {
  __typename?: 'Stocks';
  materials?: Maybe<Array<Maybe<Material>>>;
  shop_number?: Maybe<Scalars['String']>;
};

export type Storage = {
  __typename?: 'Storage';
  batches?: Maybe<Array<Maybe<Batch>>>;
  location?: Maybe<Scalars['String']>;
};

export type Theft = {
  __typename?: 'Theft';
  accessories?: Maybe<Scalars['Int']>;
  date?: Maybe<Scalars['String']>;
  date_created?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  devices?: Maybe<Scalars['Int']>;
  heets?: Maybe<Scalars['Int']>;
  time?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['ID']>;
};

export type TheftInput = {
  accessories?: InputMaybe<Scalars['Int']>;
  date?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  devices?: InputMaybe<Scalars['Int']>;
  heets?: InputMaybe<Scalars['Int']>;
  time?: InputMaybe<Scalars['String']>;
};

export type TheftsConnection = {
  __typename?: 'TheftsConnection';
  items?: Maybe<Array<Maybe<Theft>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type TimestampFilter = {
  from: Scalars['AWSTimestamp'];
  to: Scalars['AWSTimestamp'];
};

export type Transaction = ITransaction & {
  __typename?: 'Transaction';
  batch_items?: Maybe<Array<Maybe<BatchItems>>>;
  date_created?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  pullout_type?: Maybe<PulloutType>;
  remarks?: Maybe<Scalars['String']>;
  return_type?: Maybe<ReturnType>;
  status?: Maybe<TransactionStatus>;
  type?: Maybe<TransactionType>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type TransactionConnection = {
  __typename?: 'TransactionConnection';
  items?: Maybe<Array<Maybe<Transaction>>>;
  next_token?: Maybe<Scalars['String']>;
};

export enum TransactionStatus {
  Completed = 'COMPLETED',
  Declined = 'DECLINED',
  Delete = 'DELETE',
  Floating = 'FLOATING',
  Pending = 'PENDING'
}

export enum TransactionType {
  Pullout = 'PULLOUT',
  Return = 'RETURN',
  Transfer = 'TRANSFER',
  Transmittal = 'TRANSMITTAL'
}

export type Transfer = ITransaction & {
  __typename?: 'Transfer';
  batch_items?: Maybe<Array<Maybe<BatchTransferItems>>>;
  date_created?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  status?: Maybe<TransactionStatus>;
  to_warehouse_id?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type TransferConnection = {
  __typename?: 'TransferConnection';
  items?: Maybe<Array<Maybe<Transfer>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type TransferInput = {
  remarks?: InputMaybe<Scalars['String']>;
  to_warehouse_id?: InputMaybe<Scalars['String']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};

export type TransferItemInput = {
  serial: Scalars['String'];
  transfer_id: Scalars['String'];
};

export type TransferUpdateInput = {
  id: Scalars['String'];
  invoice_id?: InputMaybe<Scalars['String']>;
  remarks?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<TransactionStatus>;
  to_warehouse_id?: InputMaybe<Scalars['String']>;
};

export type Transmittal = ITransaction & {
  __typename?: 'Transmittal';
  batch_items?: Maybe<Array<Maybe<BatchTransmittalItems>>>;
  date?: Maybe<Scalars['String']>;
  date_created?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['String']>;
  from_warehouse_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  remarks?: Maybe<Scalars['String']>;
  status?: Maybe<TransactionStatus>;
  time?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type TransmittalConnection = {
  __typename?: 'TransmittalConnection';
  items?: Maybe<Array<Maybe<Transmittal>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type TransmittalInput = {
  date?: InputMaybe<Scalars['String']>;
  invoice_id?: InputMaybe<Scalars['String']>;
  remarks?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['String']>;
  warehouse_id: Scalars['String'];
};

export type TransmittalUpdateInput = {
  date?: InputMaybe<Scalars['String']>;
  from_warehouse_id?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  invoice_id?: InputMaybe<Scalars['String']>;
  remarks?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<TransactionStatus>;
  time?: InputMaybe<Scalars['String']>;
};

export enum TrialType {
  ExtendedTrialItems = 'EXTENDED_TRIAL_ITEMS',
  GuidedTrialItems = 'GUIDED_TRIAL_ITEMS',
  LendingItems = 'LENDING_ITEMS',
  PurchaseItems = 'PURCHASE_ITEMS',
  TestDriveItems = 'TEST_DRIVE_ITEMS'
}

export type UpdateLog = {
  __typename?: 'UpdateLog';
  appointment_status?: Maybe<Scalars['String']>;
  assigned_coach?: Maybe<Scalars['String']>;
  conducted_status?: Maybe<Scalars['String']>;
  delivery_date?: Maybe<Scalars['String']>;
  guided_trial_schedule_date?: Maybe<Scalars['String']>;
  guided_trial_schedule_time?: Maybe<Scalars['String']>;
  hypercare?: Maybe<Scalars['String']>;
  lead_status?: Maybe<Scalars['String']>;
  purchase_status?: Maybe<Scalars['String']>;
  unresponsive?: Maybe<Scalars['String']>;
  update_datetime?: Maybe<Scalars['String']>;
  updated_by?: Maybe<Scalars['String']>;
};

export type UsageData = {
  __typename?: 'UsageData';
  charger_cycle?: Maybe<Scalars['Float']>;
  device_cycle?: Maybe<Scalars['Float']>;
  holder_cycle?: Maybe<Scalars['Float']>;
  version?: Maybe<Scalars['String']>;
};

export type UsageDataInput = {
  charger_cycle?: InputMaybe<Scalars['Float']>;
  device_cycle?: InputMaybe<Scalars['Float']>;
  holder_cycle?: InputMaybe<Scalars['Float']>;
  version?: InputMaybe<Scalars['String']>;
};

export type UsageHistory = {
  __typename?: 'UsageHistory';
  post?: Maybe<UsageData>;
  pre?: Maybe<UsageData>;
};

export type UsageHistoryInput = {
  order_id?: InputMaybe<Scalars['String']>;
  post?: InputMaybe<UsageDataInput>;
  pre?: InputMaybe<UsageDataInput>;
  return_order_id?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  name?: Maybe<Scalars['String']>;
  office_id?: Maybe<Scalars['String']>;
  office_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  office_name?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<Role>>>;
  user_status?: Maybe<UserStatus>;
  username?: Maybe<Scalars['String']>;
};

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type UsersConnection = {
  __typename?: 'UsersConnection';
  items?: Maybe<Array<Maybe<User>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type ViberCommunityMember = {
  __typename?: 'ViberCommunityMember';
  coach?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['String']>;
  date_created?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  member_information?: Maybe<CustomerInformation>;
  screenshot?: Maybe<S3Object>;
  screenshot_date?: Maybe<Scalars['String']>;
};

export type ViberCommunityMemberConnection = {
  __typename?: 'ViberCommunityMemberConnection';
  items?: Maybe<Array<Maybe<ViberCommunityMember>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type ViberCommunityMemberInput = {
  coach?: InputMaybe<Scalars['String']>;
  created_by?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  member_information?: InputMaybe<CustomerInformationInput>;
  screenshot?: InputMaybe<S3ObjectInput>;
  screenshot_date?: InputMaybe<Scalars['String']>;
};

export type Wallet = {
  __typename?: 'Wallet';
  balance?: Maybe<Scalars['Float']>;
  logs?: Maybe<WalletTransactionConnection>;
};

export type WalletTransaction = {
  __typename?: 'WalletTransaction';
  amount?: Maybe<Scalars['Float']>;
  balance?: Maybe<Scalars['Float']>;
  from_user?: Maybe<Scalars['ID']>;
  prev_balance?: Maybe<Scalars['Float']>;
  timestamp?: Maybe<Scalars['AWSTimestamp']>;
  to_user?: Maybe<Scalars['ID']>;
  transaction_by?: Maybe<Scalars['ID']>;
  type?: Maybe<WalletTransactionType>;
};

export type WalletTransactionConnection = {
  __typename?: 'WalletTransactionConnection';
  items?: Maybe<Array<Maybe<WalletTransaction>>>;
  nextToken?: Maybe<Scalars['String']>;
};

export enum WalletTransactionType {
  Deposit = 'DEPOSIT',
  Payment = 'PAYMENT',
  Remittance = 'REMITTANCE',
  Transfer = 'TRANSFER',
  Withdrawal = 'WITHDRAWAL'
}

export type Warehouse = {
  __typename?: 'Warehouse';
  area?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  total_items?: Maybe<Scalars['Int']>;
  type?: Maybe<WarehouseType>;
};

export type WarehouseConnection = {
  __typename?: 'WarehouseConnection';
  items?: Maybe<Array<Maybe<Warehouse>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type WarehouseInput = {
  area?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<WarehouseType>;
};

export enum WarehouseType {
  Coach = 'COACH',
  IndirectRetailStore = 'INDIRECT_RETAIL_STORE',
  RetailStore = 'RETAIL_STORE',
  Roadshow = 'ROADSHOW',
  Store = 'STORE',
  Warehouse = 'WAREHOUSE'
}
