import { Trials } from "../CRMTrials/Config";

export interface Schedule {
  schedule_id: string;
  datetime_created: string;
  type: string;
  status: string;
  customer_id: string;
  date: string;
  time: string;
  customer_info: Trials;
  hypercare_id: string;
}
