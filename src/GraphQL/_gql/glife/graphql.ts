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

export type Address = {
  __typename?: 'Address';
  address_extension?: Maybe<Scalars['String']>;
  birthday?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  contact_no?: Maybe<Scalars['AWSPhone']>;
  country?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['AWSEmail']>;
  region?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
};

export type AddressInput = {
  address_extension?: InputMaybe<Scalars['String']>;
  birthday?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  contact_no?: InputMaybe<Scalars['AWSPhone']>;
  country?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  region?: InputMaybe<Scalars['String']>;
  street?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
};

export type Banner = {
  __typename?: 'Banner';
  banner_id?: Maybe<Scalars['ID']>;
  filename?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['AWSURL']>;
  landing_message?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  reroute?: Maybe<Scalars['String']>;
  warning_message?: Maybe<Scalars['String']>;
};

export type BannerInput = {
  banner_id?: InputMaybe<Scalars['ID']>;
  filename: Scalars['String'];
  image: Scalars['AWSURL'];
  reroute?: InputMaybe<Scalars['String']>;
};

export enum BannerType {
  Lending = 'LENDING',
  Sale = 'SALE'
}

export type Banners = {
  __typename?: 'Banners';
  items?: Maybe<Array<Maybe<Banner>>>;
};

export type Cart = {
  __typename?: 'Cart';
  items?: Maybe<Array<Maybe<CartItem>>>;
  payment_type?: Maybe<Scalars['String']>;
};

export type CartInput = {
  items: Array<CartItemInput>;
  payment_type?: InputMaybe<Scalars['String']>;
};

export type CartItem = {
  __typename?: 'CartItem';
  amount?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  discount?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['ID']>;
};

export type CartItemInput = {
  amount?: InputMaybe<Scalars['Float']>;
  description?: InputMaybe<Scalars['String']>;
  discount?: InputMaybe<Scalars['Float']>;
  quantity?: InputMaybe<Scalars['Int']>;
  sku?: InputMaybe<Scalars['ID']>;
};

export type Customer = {
  __typename?: 'Customer';
  addresses?: Maybe<Array<Maybe<Address>>>;
  first_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  is_permission_enabled?: Maybe<Scalars['Boolean']>;
  last_name?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type DateFilter = {
  from: Scalars['AWSTimestamp'];
  to: Scalars['AWSTimestamp'];
};

export type DeliveryLog = {
  __typename?: 'DeliveryLog';
  status?: Maybe<Scalars['String']>;
  status_datetime?: Maybe<Scalars['AWSTimestamp']>;
};

export type EComOrder = {
  __typename?: 'EComOrder';
  delivery_status?: Maybe<Scalars['String']>;
  delivery_status_logs?: Maybe<Array<Maybe<DeliveryLog>>>;
  id?: Maybe<Scalars['ID']>;
  order_status?: Maybe<Scalars['String']>;
  order_status_logs?: Maybe<Array<Maybe<DeliveryLog>>>;
  retry_count?: Maybe<Scalars['Int']>;
};

export type Feature = {
  __typename?: 'Feature';
  is_active?: Maybe<Scalars['Boolean']>;
};

export enum FeatureType {
  Dti = 'DTI',
  Educational = 'EDUCATIONAL',
  StoreLocator = 'STORE_LOCATOR',
  Try = 'TRY'
}

export type FilterInput = {
  from: Scalars['AWSTimestamp'];
  to: Scalars['AWSTimestamp'];
};

export enum LeadStatus {
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  Pending = 'PENDING',
  PendingPayment = 'PENDING_PAYMENT',
  Verified = 'VERIFIED'
}

export type LendingLead = {
  __typename?: 'LendingLead';
  todo?: Maybe<Scalars['String']>;
};

export type LendingSettings = {
  __typename?: 'LendingSettings';
  daily_cap?: Maybe<Scalars['Int']>;
};

export type LendingSettingsInput = {
  daily_cap?: InputMaybe<Scalars['Int']>;
};

export type LendingTraffic = {
  __typename?: 'LendingTraffic';
  date?: Maybe<Scalars['AWSDate']>;
  format?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  traffic?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  bannerAdd?: Maybe<Banners>;
  bannerRemove?: Maybe<Banners>;
  featureUpdate?: Maybe<Feature>;
  lendingPrimaryBannerUpdate?: Maybe<Banner>;
  lendingSettingsUpdate?: Maybe<LendingSettings>;
  orderCancel?: Maybe<Scalars['String']>;
  orderCreate?: Maybe<Order>;
  orderUpdate?: Maybe<Order>;
  promoCreate?: Maybe<Promo>;
  promoRemove?: Maybe<Promo>;
  promoUpdate?: Maybe<Promo>;
  register?: Maybe<Registration>;
  registrationUpdate?: Maybe<Registration>;
  settingsUpdate?: Maybe<Settings>;
  skuCategoryUpdate?: Maybe<SkuCategories>;
  skuCreate?: Maybe<Sku>;
  skuRemove?: Maybe<Sku>;
  skuUpdate?: Maybe<Sku>;
  userCreate?: Maybe<User>;
  userDisable?: Maybe<User>;
  userEnable?: Maybe<User>;
  userUpdate?: Maybe<User>;
  variantCreate?: Maybe<Sku>;
};


export type MutationBannerAddArgs = {
  inputs: Array<BannerInput>;
  type: BannerType;
};


export type MutationBannerRemoveArgs = {
  id: Scalars['ID'];
  type: BannerType;
};


export type MutationFeatureUpdateArgs = {
  is_active: Scalars['Boolean'];
  type: FeatureType;
};


export type MutationLendingPrimaryBannerUpdateArgs = {
  filename?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['AWSURL']>;
  landing_message?: InputMaybe<Scalars['String']>;
  reroute?: InputMaybe<Scalars['String']>;
  warning_message?: InputMaybe<Scalars['String']>;
};


export type MutationLendingSettingsUpdateArgs = {
  input?: InputMaybe<LendingSettingsInput>;
};


export type MutationOrderCancelArgs = {
  order_id: Scalars['ID'];
  payment_id: Scalars['ID'];
  total_amount: Scalars['Float'];
};


export type MutationOrderCreateArgs = {
  input: OrderInput;
};


export type MutationOrderUpdateArgs = {
  ecom_order?: InputMaybe<Scalars['ID']>;
  order_id: Scalars['ID'];
  status: LeadStatus;
};


export type MutationPromoCreateArgs = {
  input: PromoInput;
};


export type MutationPromoRemoveArgs = {
  code: Scalars['ID'];
};


export type MutationPromoUpdateArgs = {
  code: Scalars['ID'];
  input: PromoUpdateInput;
};


export type MutationRegisterArgs = {
  input: RegistrationInput;
};


export type MutationRegistrationUpdateArgs = {
  customer_id: Scalars['ID'];
  status: RegistrationStatus;
  type: RegistrationType;
};


export type MutationSettingsUpdateArgs = {
  input: SettingsInput;
};


export type MutationSkuCategoryUpdateArgs = {
  inputs: Array<SkuCategoryInput>;
};


export type MutationSkuCreateArgs = {
  input: SkuInput;
};


export type MutationSkuRemoveArgs = {
  sku: Scalars['ID'];
};


export type MutationSkuUpdateArgs = {
  input: SkuUpdateInput;
  sku: Scalars['ID'];
};


export type MutationUserCreateArgs = {
  input: UserInput;
};


export type MutationUserDisableArgs = {
  id: Scalars['ID'];
};


export type MutationUserEnableArgs = {
  id: Scalars['ID'];
};


export type MutationUserUpdateArgs = {
  id: Scalars['ID'];
  input: UserUpdateInput;
};


export type MutationVariantCreateArgs = {
  base_sku: Scalars['ID'];
  input: SkuInput;
};

export type Order = {
  __typename?: 'Order';
  address?: Maybe<Address>;
  cart?: Maybe<Cart>;
  channel?: Maybe<OrderChannel>;
  date_created?: Maybe<Scalars['AWSTimestamp']>;
  dce_id?: Maybe<Scalars['ID']>;
  discount?: Maybe<Scalars['Float']>;
  ecom_order?: Maybe<Scalars['ID']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  payment_id?: Maybe<Scalars['ID']>;
  promo_code?: Maybe<Scalars['ID']>;
  source?: Maybe<Scalars['String']>;
  status?: Maybe<LeadStatus>;
  tickers?: Maybe<Tickers>;
  total_amount?: Maybe<Scalars['Float']>;
  tracking?: Maybe<EComOrder>;
};

export enum OrderChannel {
  Gcash = 'GCASH',
  Sms = 'SMS'
}

export type OrderConnection = {
  __typename?: 'OrderConnection';
  items?: Maybe<Array<Maybe<Order>>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type OrderInput = {
  address: AddressInput;
  cart: CartInput;
  channel: OrderChannel;
  customer_id: Scalars['ID'];
  dce_id?: InputMaybe<Scalars['ID']>;
  discount?: InputMaybe<Scalars['Float']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  payment_id?: InputMaybe<Scalars['ID']>;
  promo_code?: InputMaybe<Scalars['ID']>;
  source?: InputMaybe<Scalars['ID']>;
  tickers?: InputMaybe<TickersInput>;
  total_amount: Scalars['Float'];
};

export type Promo = {
  __typename?: 'Promo';
  block_with_device?: Maybe<Scalars['Boolean']>;
  block_with_heets?: Maybe<Scalars['Boolean']>;
  code: Scalars['ID'];
  code_redemptions?: Maybe<Scalars['Int']>;
  discount: Scalars['Float'];
  is_enabled?: Maybe<Scalars['Boolean']>;
  max_code_redemptions?: Maybe<Scalars['Int']>;
  max_redemptions_per_customer?: Maybe<Scalars['Int']>;
  target_sku?: Maybe<Array<Maybe<Scalars['ID']>>>;
  valid_from?: Maybe<Scalars['AWSTimestamp']>;
  valid_to?: Maybe<Scalars['AWSTimestamp']>;
};

export type PromoConnection = {
  __typename?: 'PromoConnection';
  items?: Maybe<Array<Maybe<Promo>>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type PromoInput = {
  block_with_device?: InputMaybe<Scalars['Boolean']>;
  block_with_heets?: InputMaybe<Scalars['Boolean']>;
  code: Scalars['ID'];
  discount: Scalars['Float'];
  max_code_redemptions?: InputMaybe<Scalars['Int']>;
  max_redemptions_per_customer?: InputMaybe<Scalars['Int']>;
  target_sku?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  valid_from?: InputMaybe<Scalars['AWSTimestamp']>;
  valid_to?: InputMaybe<Scalars['AWSTimestamp']>;
};

export type PromoUpdateInput = {
  block_with_device?: InputMaybe<Scalars['Boolean']>;
  block_with_heets?: InputMaybe<Scalars['Boolean']>;
  discount: Scalars['Float'];
  is_enabled?: InputMaybe<Scalars['Boolean']>;
  max_code_redemptions?: InputMaybe<Scalars['Int']>;
  max_redemptions_per_customer?: InputMaybe<Scalars['Int']>;
  target_sku?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  valid_from?: InputMaybe<Scalars['AWSTimestamp']>;
  valid_to?: InputMaybe<Scalars['AWSTimestamp']>;
};

export type Query = {
  __typename?: 'Query';
  banners?: Maybe<Array<Maybe<Banner>>>;
  customer_orders?: Maybe<OrderConnection>;
  feature?: Maybe<Feature>;
  lending_traffic?: Maybe<Array<Maybe<LendingTraffic>>>;
  order?: Maybe<Order>;
  orders?: Maybe<OrderConnection>;
  promos?: Maybe<PromoConnection>;
  registrations?: Maybe<RegistrationConnection>;
  report?: Maybe<Scalars['AWSURL']>;
  settings?: Maybe<Settings>;
  sku?: Maybe<Sku>;
  skuCategories?: Maybe<SkuCategories>;
  skus?: Maybe<Array<Maybe<Sku>>>;
  traffic?: Maybe<Array<Maybe<Traffic>>>;
  user?: Maybe<User>;
  users?: Maybe<UserConnection>;
  variants?: Maybe<Array<Maybe<Sku>>>;
};


export type QueryBannersArgs = {
  type: BannerType;
};


export type QueryCustomer_OrdersArgs = {
  customer_id: Scalars['ID'];
};


export type QueryFeatureArgs = {
  type: FeatureType;
};


export type QueryLending_TrafficArgs = {
  from?: InputMaybe<Scalars['AWSDate']>;
  to?: InputMaybe<Scalars['AWSDate']>;
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
};


export type QueryOrdersArgs = {
  from?: InputMaybe<Scalars['AWSTimestamp']>;
  to?: InputMaybe<Scalars['AWSTimestamp']>;
};


export type QueryRegistrationsArgs = {
  filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<RegistrationType>;
};


export type QueryReportArgs = {
  filter?: InputMaybe<FilterInput>;
  type?: InputMaybe<ReportType>;
};


export type QuerySkuArgs = {
  sku: Scalars['ID'];
};


export type QueryTrafficArgs = {
  from?: InputMaybe<Scalars['AWSDate']>;
  to?: InputMaybe<Scalars['AWSDate']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  next_token?: InputMaybe<Scalars['String']>;
};


export type QueryVariantsArgs = {
  base_sku: Scalars['ID'];
};

export type Registration = {
  __typename?: 'Registration';
  birthday?: Maybe<Scalars['AWSDate']>;
  contact_no?: Maybe<Scalars['String']>;
  customer_id: Scalars['ID'];
  date_created?: Maybe<Scalars['AWSTimestamp']>;
  date_updated?: Maybe<Scalars['AWSTimestamp']>;
  dce_id?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['AWSEmail']>;
  name?: Maybe<Scalars['String']>;
  segment?: Maybe<Scalars['String']>;
  status?: Maybe<RegistrationStatus>;
  tickers?: Maybe<Tickers>;
  type?: Maybe<RegistrationType>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type RegistrationConnection = {
  __typename?: 'RegistrationConnection';
  items?: Maybe<Array<Maybe<Registration>>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type RegistrationInput = {
  birthday: Scalars['AWSDate'];
  contact_no: Scalars['String'];
  dce_id?: InputMaybe<Scalars['ID']>;
  email: Scalars['AWSEmail'];
  name: Scalars['String'];
  segment?: InputMaybe<Scalars['String']>;
  tickers?: InputMaybe<TickersInput>;
  type: RegistrationType;
};

export enum RegistrationStatus {
  Complete = 'COMPLETE',
  Pending = 'PENDING'
}

export enum RegistrationType {
  Dce = 'DCE',
  Educational = 'EDUCATIONAL',
  Teaser = 'TEASER'
}

export enum ReportType {
  Dce = 'DCE',
  Educational = 'EDUCATIONAL',
  LendingSource = 'LENDING_SOURCE',
  Orders = 'ORDERS',
  Teaser = 'TEASER',
  Traffic = 'TRAFFIC'
}

export type Sku = {
  __typename?: 'SKU';
  category?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  description_image?: Maybe<Array<Maybe<Scalars['AWSURL']>>>;
  discount?: Maybe<Scalars['Float']>;
  hex?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['AWSURL']>>>;
  is_enabled?: Maybe<Scalars['Boolean']>;
  is_highlighted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  sku: Scalars['ID'];
  thumbnail?: Maybe<Scalars['AWSURL']>;
  variants?: Maybe<Array<Maybe<Sku>>>;
};

export type SkuCategories = {
  __typename?: 'SKUCategories';
  items?: Maybe<Array<Maybe<SkuCategory>>>;
};

export type SkuCategory = {
  __typename?: 'SKUCategory';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type SkuCategoryInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type SkuInput = {
  category?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  description_image?: InputMaybe<Array<InputMaybe<Scalars['AWSURL']>>>;
  discount?: InputMaybe<Scalars['Float']>;
  hex?: InputMaybe<Scalars['String']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['AWSURL']>>>;
  inventory?: InputMaybe<Scalars['Int']>;
  is_highlighted?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  price?: InputMaybe<Scalars['Float']>;
  sku: Scalars['ID'];
  thumbnail?: InputMaybe<Scalars['AWSURL']>;
};

export type SkuUpdateInput = {
  category?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  description_image?: InputMaybe<Array<InputMaybe<Scalars['AWSURL']>>>;
  discount?: InputMaybe<Scalars['Float']>;
  hex?: InputMaybe<Scalars['String']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['AWSURL']>>>;
  inventory?: InputMaybe<Scalars['Int']>;
  is_enabled?: InputMaybe<Scalars['Boolean']>;
  is_highlighted?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  thumbnail?: InputMaybe<Scalars['AWSURL']>;
};

export type Settings = {
  __typename?: 'Settings';
  schedule_lending_limit?: Maybe<Scalars['Int']>;
};

export type SettingsInput = {
  schedule_lending_limit?: InputMaybe<Scalars['Int']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  onOrderCreated?: Maybe<Order>;
  onRegistration?: Maybe<Registration>;
  onRegistrationUpdate?: Maybe<Registration>;
};

export type Tickers = {
  __typename?: 'Tickers';
  data_privacy?: Maybe<Scalars['Boolean']>;
  marketing?: Maybe<Scalars['Boolean']>;
  terms_and_conditions?: Maybe<Scalars['Boolean']>;
};

export type TickersInput = {
  data_privacy?: InputMaybe<Scalars['Boolean']>;
  marketing?: InputMaybe<Scalars['Boolean']>;
  terms_and_conditions?: InputMaybe<Scalars['Boolean']>;
};

export type Traffic = {
  __typename?: 'Traffic';
  campaign?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['AWSDate']>;
  format?: Maybe<Scalars['String']>;
  traffic?: Maybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['AWSEmail']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  status?: Maybe<UserStatus>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  items?: Maybe<Array<Maybe<User>>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type UserInput = {
  email: Scalars['AWSEmail'];
  name: Scalars['String'];
};

export enum UserStatus {
  Disabled = 'DISABLED',
  Enabled = 'ENABLED'
}

export type UserUpdateInput = {
  email?: InputMaybe<Scalars['AWSEmail']>;
  name?: InputMaybe<Scalars['String']>;
};
