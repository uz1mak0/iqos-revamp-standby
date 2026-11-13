import { Trials } from "../CRMTrials/Config";

export interface HypercareList {
  hypercare_id: string;
  customer_id: string;
  week: string;
  delivery_date: string;
  delivery_time: string;
  feedback_date: string;
  feedback_time: string;
  status: string;
  customer_info: Trials;
}

const sampleData = {
  customer_id: "",
  first_name: "",
  last_name: "",
  age: 0,
  contact_no: "",
  gender: "",
  email: "",
  primary_nicotine_product: "",
  marketing_opt_in: "",
  privacy_notice: "",
  registration_channel: "",
  continue_feedback: "YES",
  different_address: "YES",
  date_of_birth: new Date(),
  call_info: {
    answered_call: "NO",
    status: "",
    schedule_date: new Date(),
    schedule_time: new Date(),
    has_time: "YES",
    reschedule_date: new Date(),
    reschedule_time: new Date(),
  },
  feedbacks: [],
  interested_to_zyn: "YES",
  extended_adoption: "YES",
  consumer_address: {
    unit: "",
    city: "",
    address1: "",
    address2: "",
    barangay: "",
    province: "",
    zip_code: "",
    region: "",
  },
  delivery_date: new Date(),
  delivery_time: new Date(),
  feedback_date: new Date(),
  feedback_time: new Date(),
  service_appointment_number: "SSSSS",
  orders: [],
  // date: new Date(),
  // time: new Date(),
};

export const getRandomColors = [
  "#F74642",
  "#F83375",
  "#541388",
  "#6E44FF",
  "#0286F2",
  "#025AA2",
  "#3B59E6",
  "#6714AA",
  "#AC1890",
  "#F51F77",
  "#331495",
  "#3734BD",
  "#3B59E6",
  "#408CE8",
  "#44C3EC",
];
