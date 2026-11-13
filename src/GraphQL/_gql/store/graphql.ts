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

export enum AssetType {
  Photo = 'PHOTO',
  Video = 'VIDEO'
}

export type DateFilter = {
  from?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
};

export type FilterInput = {
  attribute?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
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

export type Message = {
  __typename?: 'Message';
  message?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  assetUpload?: Maybe<Message>;
  resetPassword?: Maybe<StoreUser>;
  storePromoARCreate?: Maybe<StorePromoAr>;
  storeUserCreate?: Maybe<StoreUser>;
  storeUserUpdate?: Maybe<StoreUser>;
};


export type MutationAssetUploadArgs = {
  asset: S3ObjectInput;
  asset_type: AssetType;
  record_no: Scalars['ID'];
  ref_id: Scalars['ID'];
};


export type MutationResetPasswordArgs = {
  input?: InputMaybe<ResetPasswordInput>;
};


export type MutationStorePromoArCreateArgs = {
  input?: InputMaybe<StorePromoArInput>;
};


export type MutationStoreUserCreateArgs = {
  input?: InputMaybe<StoreUserInput>;
};


export type MutationStoreUserUpdateArgs = {
  input?: InputMaybe<StoreUserUpdateInput>;
};

export type Promotion = {
  __typename?: 'Promotion';
  freebie?: Maybe<Scalars['String']>;
  freebie1?: Maybe<Scalars['String']>;
  freebie2?: Maybe<Scalars['String']>;
  input1?: Maybe<Scalars['String']>;
  input2?: Maybe<Scalars['String']>;
  promotion?: Maybe<Scalars['String']>;
  variant?: Maybe<Scalars['String']>;
};

export type PromotionInput = {
  freebie?: InputMaybe<Scalars['String']>;
  freebie1?: InputMaybe<Scalars['String']>;
  freebie2?: InputMaybe<Scalars['String']>;
  input1?: InputMaybe<Scalars['String']>;
  input2?: InputMaybe<Scalars['String']>;
  promotion?: InputMaybe<Scalars['String']>;
  variant?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  reportStores?: Maybe<Scalars['AWSURL']>;
  storePromoARs?: Maybe<StorePromoARsConnection>;
  storePromos?: Maybe<StorePromoConnection>;
  storeUser?: Maybe<StoreUser>;
  storeUsers?: Maybe<StoreUserConnection>;
};


export type QueryReportStoresArgs = {
  date_filter?: InputMaybe<DateFilter>;
  type?: InputMaybe<ReportType>;
};


export type QueryStorePromoARsArgs = {
  date_filter?: InputMaybe<DateFilter>;
  next_token?: InputMaybe<Scalars['String']>;
};


export type QueryStoreUserArgs = {
  username: Scalars['String'];
};


export type QueryStoreUsersArgs = {
  next_token?: InputMaybe<Scalars['String']>;
};

export enum ReportType {
  StorePromo = 'STORE_PROMO'
}

export type ResetPasswordInput = {
  password?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export enum Role {
  SalesExecutive = 'SalesExecutive',
  SalesExpert = 'SalesExpert'
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

export type SortInput = {
  attribute?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<SortOrder>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type StorePromo = {
  __typename?: 'StorePromo';
  combine_with?: Maybe<Array<Maybe<Scalars['String']>>>;
  promo_name?: Maybe<Scalars['String']>;
  promo_selection?: Maybe<Array<Maybe<StorePromoSelection>>>;
};

export type StorePromoAr = {
  __typename?: 'StorePromoAR';
  date_created?: Maybe<Scalars['String']>;
  date_updated?: Maybe<Scalars['String']>;
  freebie?: Maybe<Scalars['String']>;
  freebie1?: Maybe<Scalars['String']>;
  freebie2?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  input1?: Maybe<Scalars['String']>;
  input2?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  promotion?: Maybe<Scalars['String']>;
  promotions?: Maybe<Array<Maybe<Promotion>>>;
  provided_id?: Maybe<Scalars['String']>;
  signature?: Maybe<S3Object>;
  store_name?: Maybe<Scalars['String']>;
  transaction_by?: Maybe<Scalars['String']>;
  transaction_number?: Maybe<Scalars['String']>;
  variant?: Maybe<Scalars['String']>;
};

export type StorePromoArInput = {
  additional_freebie1?: InputMaybe<Scalars['String']>;
  additional_freebie2?: InputMaybe<Scalars['String']>;
  additional_input1?: InputMaybe<Scalars['String']>;
  additional_input2?: InputMaybe<Scalars['String']>;
  additional_promo?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<Scalars['String']>;
  freebie?: InputMaybe<Scalars['String']>;
  freebie1?: InputMaybe<Scalars['String']>;
  freebie2?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  input1?: InputMaybe<Scalars['String']>;
  input2?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  promotion?: InputMaybe<Scalars['String']>;
  promotions?: InputMaybe<Array<InputMaybe<PromotionInput>>>;
  provided_id?: InputMaybe<Scalars['String']>;
  signature?: InputMaybe<S3ObjectInput>;
  store_name?: InputMaybe<Scalars['String']>;
  variant?: InputMaybe<Scalars['String']>;
};

export type StorePromoARsConnection = {
  __typename?: 'StorePromoARsConnection';
  items?: Maybe<Array<Maybe<StorePromoAr>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type StorePromoConnection = {
  __typename?: 'StorePromoConnection';
  items?: Maybe<Array<Maybe<StorePromo>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type StorePromoSelection = {
  __typename?: 'StorePromoSelection';
  freebie?: Maybe<Scalars['String']>;
  option_type?: Maybe<Scalars['String']>;
  options?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type StoreUser = {
  __typename?: 'StoreUser';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone_number?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<Role>>>;
  user_status?: Maybe<UserStatus>;
  username?: Maybe<Scalars['String']>;
};

export type StoreUserConnection = {
  __typename?: 'StoreUserConnection';
  items?: Maybe<Array<Maybe<StoreUser>>>;
  next_token?: Maybe<Scalars['String']>;
};

export type StoreUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  phone_number: Scalars['String'];
  roles: Array<InputMaybe<Role>>;
  username?: InputMaybe<Scalars['String']>;
};

export type StoreUserUpdateInput = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phone_number?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<InputMaybe<Role>>>;
  username: Scalars['String'];
};

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}
