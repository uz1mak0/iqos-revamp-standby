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
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  barangay?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  zip_code?: Maybe<Scalars['String']>;
};

export type AddressInput = {
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  barangay?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  province?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['String']>;
  unit?: InputMaybe<Scalars['String']>;
  zip_code?: InputMaybe<Scalars['String']>;
};

export type CallInfo = {
  __typename?: 'CallInfo';
  answered_call?: Maybe<Scalars['Boolean']>;
  answered_call_type?: Maybe<Scalars['Boolean']>;
  has_time?: Maybe<Scalars['Boolean']>;
  has_time_type?: Maybe<Scalars['Boolean']>;
  reschedule_date?: Maybe<Scalars['AWSDate']>;
  reschedule_time?: Maybe<Scalars['AWSTime']>;
  schedule_date?: Maybe<Scalars['AWSDate']>;
  schedule_time?: Maybe<Scalars['AWSTime']>;
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type CallInfoInput = {
  answered_call?: InputMaybe<Scalars['Boolean']>;
  answered_call_type?: InputMaybe<Scalars['Boolean']>;
  has_time?: InputMaybe<Scalars['Boolean']>;
  has_time_type?: InputMaybe<Scalars['Boolean']>;
  reschedule_date?: InputMaybe<Scalars['AWSDate']>;
  reschedule_time?: InputMaybe<Scalars['AWSTime']>;
  schedule_date?: InputMaybe<Scalars['AWSDate']>;
  schedule_time?: InputMaybe<Scalars['AWSTime']>;
  status?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type DateFilterInput = {
  from?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<DateFilterType>;
};

export enum DateFilterType {
  DatetimeCreated = 'datetime_created',
  GtDate = 'gt_date'
}

export type Feedback = {
  __typename?: 'Feedback';
  response?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type FeedbackInput = {
  response?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type FilterInput = {
  attribute?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type HyperCareConnection = {
  __typename?: 'HyperCareConnection';
  items?: Maybe<Array<Maybe<Hypercare>>>;
};

export type Hypercare = {
  __typename?: 'Hypercare';
  call_info?: Maybe<CallInfo>;
  consumer_address?: Maybe<Address>;
  continue_feedback?: Maybe<Scalars['Boolean']>;
  customer_id?: Maybe<Scalars['ID']>;
  customer_info?: Maybe<Trial>;
  date?: Maybe<Scalars['AWSDate']>;
  delivery_date?: Maybe<Scalars['AWSDate']>;
  delivery_time?: Maybe<Scalars['AWSTime']>;
  extended_adoption?: Maybe<Scalars['Boolean']>;
  feedback_date?: Maybe<Scalars['AWSDate']>;
  feedback_time?: Maybe<Scalars['AWSTime']>;
  feedbacks?: Maybe<Array<Maybe<Feedback>>>;
  hypercare_id?: Maybe<Scalars['ID']>;
  interested_to_zyn?: Maybe<Scalars['Boolean']>;
  order_id?: Maybe<Scalars['String']>;
  orders?: Maybe<Array<Maybe<Order>>>;
  schedule_logs?: Maybe<Array<Maybe<ScheduleLogs>>>;
  status?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['AWSTime']>;
  week?: Maybe<Scalars['String']>;
};

export type HypercareInput = {
  call_info?: InputMaybe<CallInfoInput>;
  consumer_address?: InputMaybe<AddressInput>;
  continue_feedback?: InputMaybe<Scalars['Boolean']>;
  customer_id?: InputMaybe<Scalars['ID']>;
  date: Scalars['AWSDate'];
  delivery_date?: InputMaybe<Scalars['AWSDate']>;
  delivery_time?: InputMaybe<Scalars['AWSTime']>;
  extended_adoption?: InputMaybe<Scalars['Boolean']>;
  feedback_date?: InputMaybe<Scalars['AWSDate']>;
  feedback_time?: InputMaybe<Scalars['AWSTime']>;
  feedbacks?: InputMaybe<Array<InputMaybe<FeedbackInput>>>;
  interested_to_zyn?: InputMaybe<Scalars['Boolean']>;
  order_id?: InputMaybe<Scalars['String']>;
  orders?: InputMaybe<Array<InputMaybe<OrderInput>>>;
  status?: InputMaybe<Scalars['String']>;
  time: Scalars['AWSTime'];
  week?: InputMaybe<Scalars['String']>;
};

export type HypercareUpdateInput = {
  call_info?: InputMaybe<CallInfoInput>;
  consumer_address?: InputMaybe<AddressInput>;
  continue_feedback?: InputMaybe<Scalars['Boolean']>;
  customer_id?: InputMaybe<Scalars['ID']>;
  date: Scalars['AWSDate'];
  delivery_date?: InputMaybe<Scalars['AWSDate']>;
  delivery_time?: InputMaybe<Scalars['AWSTime']>;
  extended_adoption?: InputMaybe<Scalars['Boolean']>;
  feedback_date?: InputMaybe<Scalars['AWSDate']>;
  feedback_time?: InputMaybe<Scalars['AWSTime']>;
  feedbacks?: InputMaybe<Array<InputMaybe<FeedbackInput>>>;
  hypercare_id: Scalars['String'];
  interested_to_zyn?: InputMaybe<Scalars['Boolean']>;
  order_id?: InputMaybe<Scalars['String']>;
  orders?: InputMaybe<Array<InputMaybe<OrderInput>>>;
  status?: InputMaybe<Scalars['String']>;
  time: Scalars['AWSTime'];
  week?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  hypercareCreate?: Maybe<Hypercare>;
  hypercareUpdate?: Maybe<Hypercare>;
  sampleCreate?: Maybe<Sample>;
  trialCreate?: Maybe<Trial>;
};


export type MutationHypercareCreateArgs = {
  input?: InputMaybe<HypercareInput>;
};


export type MutationHypercareUpdateArgs = {
  input?: InputMaybe<HypercareUpdateInput>;
};


export type MutationSampleCreateArgs = {
  att1?: InputMaybe<Scalars['String']>;
  att2?: InputMaybe<Scalars['Float']>;
  id?: InputMaybe<Scalars['ID']>;
};


export type MutationTrialCreateArgs = {
  input: TrialInput;
};

export type Order = {
  __typename?: 'Order';
  description?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
  uom?: Maybe<Scalars['String']>;
  variant?: Maybe<Scalars['String']>;
};

export type OrderInput = {
  description?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Scalars['String']>;
  uom?: InputMaybe<Scalars['String']>;
  variant?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  hyperCarePerCustomer?: Maybe<HyperCareConnection>;
  hyperCarePerWeek?: Maybe<HyperCareConnection>;
  hypercare?: Maybe<Hypercare>;
  reports?: Maybe<Scalars['AWSURL']>;
  sample?: Maybe<Sample>;
  schedule?: Maybe<Schedule>;
  schedules?: Maybe<ScheduleConnection>;
  trial?: Maybe<Trial>;
  trials?: Maybe<TrialConnection>;
  weekCounts?: Maybe<Array<Maybe<WeekCount>>>;
};


export type QueryHyperCarePerCustomerArgs = {
  customer_id?: InputMaybe<Scalars['ID']>;
};


export type QueryHyperCarePerWeekArgs = {
  week?: InputMaybe<Scalars['String']>;
};


export type QueryHypercareArgs = {
  id: Scalars['ID'];
};


export type QueryReportsArgs = {
  from?: InputMaybe<Scalars['AWSDate']>;
  to?: InputMaybe<Scalars['AWSDate']>;
  type?: InputMaybe<ReportType>;
};


export type QuerySampleArgs = {
  id: Scalars['ID'];
};


export type QueryScheduleArgs = {
  id: Scalars['ID'];
};


export type QuerySchedulesArgs = {
  date?: InputMaybe<Scalars['AWSDate']>;
};


export type QueryTrialArgs = {
  id: Scalars['ID'];
};


export type QueryTrialsArgs = {
  date_filter?: InputMaybe<DateFilterInput>;
  filters?: InputMaybe<Array<InputMaybe<FilterInput>>>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<SortInput>;
};

export enum ReportType {
  Hypercare = 'HYPERCARE',
  Trial = 'TRIAL'
}

export type Sample = {
  __typename?: 'Sample';
  att1?: Maybe<Scalars['String']>;
  att2?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
};

export type Schedule = {
  __typename?: 'Schedule';
  customer_id?: Maybe<Scalars['ID']>;
  customer_info?: Maybe<Trial>;
  date?: Maybe<Scalars['AWSDate']>;
  datetime_created?: Maybe<Scalars['AWSTimestamp']>;
  hypercare_id?: Maybe<Scalars['ID']>;
  schedule_id?: Maybe<Scalars['ID']>;
  status?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['AWSTime']>;
  type?: Maybe<Scalars['String']>;
};

export type ScheduleConnection = {
  __typename?: 'ScheduleConnection';
  items?: Maybe<Array<Maybe<Schedule>>>;
};

export type ScheduleLogs = {
  __typename?: 'ScheduleLogs';
  date?: Maybe<Scalars['AWSDate']>;
  reason?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['AWSTime']>;
  type?: Maybe<Scalars['String']>;
};

export type SortInput = {
  attribute?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<SortType>;
};

export enum SortType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Subscription = {
  __typename?: 'Subscription';
  sampleCreated?: Maybe<Sample>;
};

export type Trial = {
  __typename?: 'Trial';
  age?: Maybe<Scalars['Int']>;
  contact_no?: Maybe<Scalars['String']>;
  customer_id?: Maybe<Scalars['ID']>;
  date_of_birth?: Maybe<Scalars['AWSDate']>;
  datetime_created?: Maybe<Scalars['AWSTimestamp']>;
  discontinue_reason?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['AWSEmail']>;
  first_name?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  gt_date?: Maybe<Scalars['AWSDate']>;
  gt_time?: Maybe<Scalars['AWSTime']>;
  last_name?: Maybe<Scalars['String']>;
  marketing_opt_in?: Maybe<Scalars['String']>;
  primary_nicotine_product?: Maybe<Scalars['String']>;
  privacy_notice?: Maybe<Scalars['String']>;
  registration_channel?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  zyn_used?: Maybe<Array<Maybe<Order>>>;
};

export type TrialConnection = {
  __typename?: 'TrialConnection';
  items?: Maybe<Array<Maybe<Trial>>>;
  total?: Maybe<Scalars['Int']>;
};

export type TrialInput = {
  age?: InputMaybe<Scalars['Int']>;
  contact_no?: InputMaybe<Scalars['AWSPhone']>;
  customer_id: Scalars['ID'];
  date_of_birth?: InputMaybe<Scalars['AWSDate']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  first_name?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  marketing_opt_in?: InputMaybe<Scalars['String']>;
  primary_nicotine_product?: InputMaybe<Scalars['String']>;
  privacy_notice?: InputMaybe<Scalars['String']>;
  registration_channel?: InputMaybe<Scalars['String']>;
};

export type WeekCount = {
  __typename?: 'WeekCount';
  total?: Maybe<Scalars['Int']>;
  week?: Maybe<Scalars['String']>;
};
