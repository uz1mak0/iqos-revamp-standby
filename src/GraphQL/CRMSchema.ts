import { gql } from "@apollo/client";

const ConsumerAddressSchema = `
  unit
  city
  address1
  address2
  barangay
  province
  zip_code
  region
`;

const ScheduleLogsSchema = `
  type
  reason
  date
  time
`;

const FeedbackSchema = `
  title
  response
`;

const CallInfoSchema = `
  answered_call
  status
  schedule_date
  schedule_time
  has_time
  reschedule_date
  reschedule_time
`;

const OrderSchema = `
  sku
  variant
  description
  uom
  quantity
`;

const TrialSchema = `
  customer_id
  first_name
  last_name
  date_of_birth
  age
  contact_no
  gender
  email
  primary_nicotine_product
  marketing_opt_in
  privacy_notice
  registration_channel
  status
  gt_date
  gt_time
  discontinue_reason
  zyn_used{
    ${OrderSchema}
  }
  datetime_created
`;

const ScheduleSchema = `
  schedule_id
  datetime_created
  type
  status
  customer_id
  date
  time
  customer_info{
    ${TrialSchema}
  }
  hypercare_id
`;

const HypercareSchema = `
  hypercare_id
  customer_id
  customer_info{
    ${TrialSchema}
  }
  call_info{
    ${CallInfoSchema}
  }
  schedule_logs{
    ${ScheduleLogsSchema}
  }
  feedbacks{
    ${FeedbackSchema}
  }
  consumer_address{
    ${ConsumerAddressSchema}
  }
  orders{
    ${OrderSchema}
  }
  week
  interested_to_zyn
  extended_adoption
  delivery_date
  delivery_time
  feedback_date
  feedback_time
  continue_feedback
  date
  time
  status
  order_id
`;

export const getTrials = gql`query trials ($date_filter: DateFilterInput,  $filters: [FilterInput], $from: Int, $limit: Int, $search: String, $sort: SortInput) {
    trials (date_filter: $date_filter, filters: $filters, from: $from, limit: $limit, search: $search, sort: $sort) {
      items {
        ${TrialSchema}
      }
      total
    }
  }`;

export const getTodaySchedule = gql`query schedules($date: AWSDate) {
    schedules(date: $date) {
      items {
       ${ScheduleSchema}
      }
    }
  }`;

export const getHypercarePerWeek = gql`query hyperCarePerWeek($week: String){
    hyperCarePerWeek(week: $week) {
      items {
       ${HypercareSchema}
      }
    }
  }`;

export const createTrial = gql`mutation trialCreate($input: TrialInput!){
    trialCreate(input: $input) {
     ${TrialSchema}
    }
  }`;

export const createHyperCare = gql`mutation hypercareCreate($input: HypercareInput){
    hypercareCreate(input: $input) {
     ${HypercareSchema}
    }
  }`;
export const updateHypercare = gql`mutation hypercareUpdate($input: HypercareUpdateInput){
    hypercareUpdate(input: $input) {
     ${HypercareSchema}
    }
  }`;

export const getHypercarePerCustomer = gql`query hyperCarePerCustomer($customer_id: ID){
    hyperCarePerCustomer(customer_id: $customer_id) {
      items {
       ${HypercareSchema}
      }
    }
  }`;

export const getCustomerTrial = gql`query trial($id: ID!){
    trial(id: $id){
     ${TrialSchema}
    }
  }`;

export const getWeeklyCount = gql`
  query weekCounts {
    weekCounts {
      week
      total
    }
  }
`;

export const getOrderStatus = gql`
  query order($id: String) {
    order(id: $id) {
      id
      order_status
    }
  }
`;

export const getCLSReport = gql`
  query reports($from: AWSDate, $to: AWSDate, $type: ReportType) {
    reports(from: $from, to: $to, type: $type)
  }
`;
