import { gql } from "@apollo/client";

const TalentSchema = `
  id
  status
  position
  date_created
  date_updated
  updated_by
  created_by

  source {
    source
    area
    job_post
    channel
    position
  }
  
  work_experience {
    recent_position
    yrs_of_exp
    sales_exp
  }

  details {
    name
    address
    email
    mobile
    age
  }
`;

const TalentDetailsSchema = `
  id
  status
  cv_link
  manager_email
  position
  date_created
  date_updated
  updated_by
  assigned_to
  created_by

  details {
    name
    address
    email
    mobile
    age
  }

  source {
    source
    area
    job_post
    channel
    position
  }

  work_experience {
    recent_position
    yrs_of_exp
    sales_exp
    description
  }


  interview_logs {
    interview_stage
    date_schedule
    log_status
    updated_by
  }

  interviews {
    interviewer
    date_schedule
    interview_time
    stage
    google_meet_link
  }

  remarks {
    remark
    remark_by
    interview_stage
  }

  otp {
  otp_code
  }
`;

const TalentDetailsManagerSchema = `
  id
  status
  cv_link
  manager_email
  position
  date_created
  date_updated
  updated_by
  created_by

  details {
    name
    address
    email
    mobile
    age
  }

  otp {
    otp_used
  }

  source {
    source
    area
    job_post
    channel
    position
  }

  work_experience {
    recent_position
    yrs_of_exp
    sales_exp
  }
      interviews {
    interviewer
    date_schedule
    interview_time
    stage
    google_meet_link
  }

  interview_logs {
    interview_stage
    date_schedule
    log_status
    updated_by
  }

  remarks {
    remark
    remark_by
    interview_stage
  }
`;

export const getTalents = gql`
  query talents($next_token: String, $date_filter: DateFilter) {
    talents(next_token: $next_token, date_filter: $date_filter) {
      items {
        ${TalentSchema}
      }
      next_token
    }
  }
`;

export const getTalentDetails = gql`
  query talent($id: String!) {
    talent(id: $id) {
      ${TalentDetailsSchema}
    }
  }
`;

export const getTalentDetailsForManagerPage = gql`
  query talent($id: String!) {
    talent(id: $id) {
      ${TalentDetailsManagerSchema}
    }
  }
`;

export const updateTalentDetails = gql`
  mutation talentUpdate($input: TalentInput!) {
    talentUpdate(input: $input) {
      ${TalentDetailsSchema}
    }
  }
`;

export const updateTalentDetailsForManager = gql`
  mutation talentUpdate($input: TalentInput!) {
    talentUpdate(input: $input) {
      ${TalentDetailsManagerSchema}
    }
  }
`;

export const sendEmail = gql`
  mutation sendEmails($input: sendEmailInput!) {
    sendEmails(input: $input) {
      success
      message
      google_meet_link
      cv_link
    }
  }
`;

export const startScreening = gql`
  mutation startResumeScreening($input: TalentSourceInput) {
    startResumeScreening(input: $input)
  }
`;

export const verifyOtp = gql`
  mutation verifyOtp($id: String!, $otp: String!, $status: Status!) {
    verifyOtp(id: $id, otp: $otp, status: $status) {
      success
      message
    }
  }
`;

export const regenerateOtp = gql`
  mutation regenerateOtp($id: String!, $requestedBy: String!) {
    regenerateOtp(id: $id, requestedBy: $requestedBy) {
      success
      message
    }
  }
`;