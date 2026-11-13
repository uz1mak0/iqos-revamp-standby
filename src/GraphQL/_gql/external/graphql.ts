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

export type Awb = {
  __typename?: 'AWB';
  max?: Maybe<Scalars['Int']>;
  prefix?: Maybe<Scalars['String']>;
  serial?: Maybe<Scalars['Int']>;
  suffix?: Maybe<Scalars['String']>;
};

export enum LogisticsPartner {
  TwoGo = 'TWO_GO'
}

export type Mutation = {
  __typename?: 'Mutation';
  assignLogistics?: Maybe<Order>;
  printAWB?: Maybe<Scalars['AWSURL']>;
  removeLogistics?: Maybe<Order>;
  updateAWB?: Maybe<Awb>;
};


export type MutationAssignLogisticsArgs = {
  assigned_hub: Scalars['ID'];
  order_id: Scalars['ID'];
  paper_bag_size: PaperBagSize;
  partner: LogisticsPartner;
};


export type MutationPrintAwbArgs = {
  order_id: Scalars['ID'];
};


export type MutationRemoveLogisticsArgs = {
  order_id: Scalars['ID'];
};


export type MutationUpdateAwbArgs = {
  max?: InputMaybe<Scalars['Int']>;
  prefix?: InputMaybe<Scalars['String']>;
  serial?: InputMaybe<Scalars['Int']>;
  suffix?: InputMaybe<Scalars['String']>;
};

export type Order = {
  __typename?: 'Order';
  assigned_hub?: Maybe<Scalars['ID']>;
  assigned_logistics?: Maybe<LogisticsPartner>;
  order_id?: Maybe<Scalars['String']>;
  paper_bag_size?: Maybe<PaperBagSize>;
};

export enum PaperBagSize {
  Large = 'LARGE',
  Small = 'SMALL'
}

export type Query = {
  __typename?: 'Query';
  base?: Maybe<Scalars['String']>;
};
