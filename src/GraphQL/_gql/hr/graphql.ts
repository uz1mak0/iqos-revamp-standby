/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  {
    [SubKey in K]?: Maybe<T[SubKey]>;
  };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  {
    [SubKey in K]: Maybe<T[SubKey]>;
  };

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

export enum Status {
  RECEIVED = "RECEIVED",
  PASSED_SCREENING = "PASSED_SCREENING",
  FAILED_SCREENING = "FAILED_SCREENING",
  INITIAL_INTERVIEW = "INITIAL_INTERVIEW",
  PASSED_INTERVIEW = "PASSED_INTERVIEW",
  FINAL_INTERVIEW = "FINAL_INTERVIEW",
  FOR_JO = "FOR_JO",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum InterviewLogsStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  RESCHEDULE = "RESCHEDULE",
}

export type Remarks = {
  remark?: Maybe<Scalars["String"]>;
  remark_by?: Maybe<Scalars["String"]>;
  interview_stage?: Maybe<Status>;
};

export type InterviewLogs = {
  interview_stage?: Maybe<Status>;
  date_schedule?: Maybe<Scalars["AWSTimestamp"]>;
  log_status?: Maybe<InterviewLogsStatus>;
  updated_by?: Maybe<Scalars["String"]>;
};

export type InterviewDetails = {
  interviewer?: Maybe<Scalars["String"]>;
  date_schedule?: Maybe<Scalars["AWSTimestamp"]>;
  stage?: Maybe<Status>;
  interview_time?: Maybe<Scalars["String"]>;
  google_meet_link?: Maybe<Scalars["String"]>;
};

export type OTP = {
  otp_code?: Maybe<Scalars["String"]>;
  otp_used?: Maybe<Scalars["Boolean"]>;
};

export type TalentInformation = {
  name?: Maybe<Scalars["String"]>;
  address?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  mobile?: Maybe<Scalars["String"]>;
  age?: Maybe<Scalars["Int"]>;
};

export type TalentSource = {
  source?: Maybe<Scalars["String"]>;
  area?: Maybe<Scalars["String"]>;
  job_post?: Maybe<Scalars["String"]>;
  channel?: Maybe<Scalars["String"]>;
  position?: Maybe<Scalars["String"]>;
};

export type TalentWorkExperience = {
  recent_position?: Maybe<Scalars["String"]>;
  yrs_of_exp?: Maybe<Scalars["String"]>;
  sales_exp?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type Talent = {
  id?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  updated_by?: Maybe<Scalars["String"]>;
  created_by?: Maybe<Scalars["String"]>;
  assigned_to?: Maybe<Scalars["String"]>;
  date_created?: Maybe<Scalars["AWSTimestamp"]>;
  date_updated?: Maybe<Scalars["AWSTimestamp"]>;
  cv_link?: Maybe<Scalars["String"]>;
  position?: Maybe<Scalars["String"]>;
  work_experience?: Maybe<TalentWorkExperience>;
  source?: Maybe<TalentSource>;
  details?: Maybe<TalentInformation>;
  otp?: Maybe<OTP>;
  interview_logs?: Maybe<Array<Maybe<InterviewLogs>>>;
  interviews?: Maybe<Array<Maybe<InterviewDetails>>>;
  remarks?: Maybe<Array<Maybe<Remarks>>>;
};

export type TalentConnection = {
  items?: Maybe<Array<Maybe<Talent>>>;
  next_token?: Maybe<Scalars["String"]>;
};

export type ScreeningUpdate = {
  status?: Maybe<Scalars["String"]>;
  totalProcessed?: Maybe<Scalars["Int"]>;
  lastResult?: Maybe<Scalars["String"]>;
  timestamp?: Maybe<Scalars["AWSTimestamp"]>;
};

export type EmailResult = {
  success: Scalars["Boolean"];
  message: Scalars["String"];
  cv_link?: Maybe<Scalars["String"]>;
};
