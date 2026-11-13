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
  reroute?: Maybe<Scalars['String']>;
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

export enum LeadStatus {
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  Pending = 'PENDING',
  PendingPayment = 'PENDING_PAYMENT',
  Verified = 'VERIFIED'
}

export type Mutation = {
  __typename?: 'Mutation';
  bannerCreateUpdate?: Maybe<Banners>;
  bannerRemove?: Maybe<Scalars['String']>;
  orderCancel?: Maybe<Scalars['String']>;
  orderCreate?: Maybe<Order>;
  orderUpdate?: Maybe<Order>;
  primaryLendingBannerCreateUpdate?: Maybe<PrimaryLendingBanner>;
  skuCategoryCreate?: Maybe<SkuCategory>;
  skuCategoryRemove?: Maybe<Scalars['String']>;
  skuCategoryUpdate?: Maybe<SkuCategory>;
  skuCreate?: Maybe<Sku>;
  skuRemove?: Maybe<Scalars['String']>;
  skuUpdate?: Maybe<Sku>;
  userCreate?: Maybe<User>;
  userDisable?: Maybe<User>;
  userEnable?: Maybe<User>;
  userUpdate?: Maybe<User>;
};


export type MutationBannerCreateUpdateArgs = {
  inputs: Array<BannerInput>;
  type: BannerType;
};


export type MutationBannerRemoveArgs = {
  is_primary?: InputMaybe<Scalars['Boolean']>;
  type: BannerType;
};


export type MutationOrderCancelArgs = {
  order_id: Scalars['ID'];
  payment_id: Scalars['ID'];
  total_amount: Scalars['Float'];
};


export type MutationOrderCreateArgs = {
  input: OrderCreateInput;
};


export type MutationOrderUpdateArgs = {
  ecom_order?: InputMaybe<Scalars['ID']>;
  order_id: Scalars['ID'];
  status: LeadStatus;
};


export type MutationPrimaryLendingBannerCreateUpdateArgs = {
  input: PrimaryLendingBannerInput;
};


export type MutationSkuCategoryCreateArgs = {
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};


export type MutationSkuCategoryRemoveArgs = {
  id: Scalars['ID'];
};


export type MutationSkuCategoryUpdateArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationSkuCreateArgs = {
  input: SkuInput;
};


export type MutationSkuRemoveArgs = {
  id: Scalars['ID'];
};


export type MutationSkuUpdateArgs = {
  id: Scalars['ID'];
  input: SkuUpdateInput;
};


export type MutationUserCreateArgs = {
  input: UserInput;
};


export type MutationUserDisableArgs = {
  username: Scalars['ID'];
};


export type MutationUserEnableArgs = {
  username: Scalars['ID'];
};


export type MutationUserUpdateArgs = {
  input: UserUpdateInput;
  username: Scalars['ID'];
};

export type Order = {
  __typename?: 'Order';
  address?: Maybe<Address>;
  cart?: Maybe<Cart>;
  channel?: Maybe<Scalars['String']>;
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

export type OrderConnection = {
  __typename?: 'OrderConnection';
  items?: Maybe<Array<Maybe<Order>>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type OrderCreateInput = {
  address: AddressInput;
  cart: CartInput;
  channel: Scalars['String'];
  customer_id: Scalars['ID'];
  dce_id?: InputMaybe<Scalars['ID']>;
  discount?: InputMaybe<Scalars['Float']>;
  first_name: Scalars['String'];
  id: Scalars['ID'];
  last_name: Scalars['String'];
  name: Scalars['String'];
  payment_id?: InputMaybe<Scalars['ID']>;
  promo_code?: InputMaybe<Scalars['ID']>;
  source?: InputMaybe<Scalars['ID']>;
  tickers?: InputMaybe<TickersInput>;
  total_amount: Scalars['Float'];
};

export type PrimaryLendingBanner = {
  __typename?: 'PrimaryLendingBanner';
  filename?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['AWSURL']>;
  landing_message?: Maybe<Scalars['String']>;
  reroute?: Maybe<Scalars['String']>;
  warning_message?: Maybe<Scalars['String']>;
};

export type PrimaryLendingBannerInput = {
  filename: Scalars['String'];
  image: Scalars['AWSURL'];
  landing_message?: InputMaybe<Scalars['String']>;
  reroute?: InputMaybe<Scalars['String']>;
  warning_message?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  banners?: Maybe<Banners>;
  customerOrders?: Maybe<OrderConnection>;
  order?: Maybe<Order>;
  orders?: Maybe<OrderConnection>;
  primaryLendingBanner?: Maybe<PrimaryLendingBanner>;
  sku?: Maybe<Sku>;
  skuCategories?: Maybe<Array<Maybe<SkuCategory>>>;
  skus?: Maybe<Array<Maybe<Sku>>>;
  user?: Maybe<User>;
  users?: Maybe<UserConnection>;
};


export type QueryBannersArgs = {
  type: BannerType;
};


export type QueryCustomerOrdersArgs = {
  customer_id: Scalars['ID'];
  next_token?: InputMaybe<Scalars['String']>;
};


export type QueryOrderArgs = {
  order_id: Scalars['ID'];
};


export type QueryOrdersArgs = {
  from?: InputMaybe<Scalars['AWSTimestamp']>;
  next_token?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['AWSTimestamp']>;
};


export type QuerySkuArgs = {
  id: Scalars['ID'];
};


export type QuerySkusArgs = {
  category_id?: InputMaybe<Scalars['ID']>;
};


export type QueryUserArgs = {
  username: Scalars['ID'];
};


export type QueryUsersArgs = {
  next_token?: InputMaybe<Scalars['String']>;
};

export type Sku = {
  __typename?: 'SKU';
  category?: Maybe<SkuCategory>;
  description?: Maybe<Scalars['String']>;
  description_image?: Maybe<Array<Maybe<Scalars['AWSURL']>>>;
  discount?: Maybe<Scalars['Float']>;
  hex?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  images?: Maybe<Array<Maybe<Scalars['AWSURL']>>>;
  is_enabled?: Maybe<Scalars['Boolean']>;
  is_highlighted?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  sku?: Maybe<Scalars['ID']>;
  thumbnail?: Maybe<Scalars['AWSURL']>;
};

export type SkuCategory = {
  __typename?: 'SKUCategory';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
};

export type SkuInput = {
  category_id: Scalars['ID'];
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
  category_id?: InputMaybe<Scalars['String']>;
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

export type Subscription = {
  __typename?: 'Subscription';
  onOrderCreated?: Maybe<Order>;
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

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['AWSEmail']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  status?: Maybe<UserStatus>;
  username: Scalars['ID'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  items?: Maybe<Array<Maybe<User>>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type UserInput = {
  email: Scalars['AWSEmail'];
  name: Scalars['String'];
  username: Scalars['ID'];
};

export enum UserStatus {
  Disabled = 'DISABLED',
  Enabled = 'ENABLED'
}

export type UserUpdateInput = {
  email?: InputMaybe<Scalars['AWSEmail']>;
  name?: InputMaybe<Scalars['String']>;
};
