import { gql } from "@apollo/client";

const RedactionSchema = `
  redaction_date
  date_affected
  error_log
  status
`;

const OrderRedactionSchema = `
  id
  order_id
  shipping_address {
    address_extention_1
    address_extention_2
    salutation
    first_name
    last_name
    telephone_number
    city
    region
    email
    street
    zip
  }
`;

export const getRedactionLogs = gql`query redactLogs($from: AWSDate, $to: AWSDate, $status: RedactStatus, $next_token: String){
  redactLogs(from: $from, to: $to, status: $status, next_token: $next_token){
    items{
     ${RedactionSchema}
    }
    nextToken
  }
}`;

export const getRedactionOrders = gql`query orders($order_status: OrderStatus, $next_token: String, $date_filter: DateFilter, $warehouse_id: String) {
  orders(order_status: $order_status, next_token: $next_token, date_filter: $date_filter, warehouse_id: $warehouse_id) {
    items {
      ${OrderRedactionSchema}
    }
    next_token
  }
}`;
