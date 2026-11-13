import { gql } from "@apollo/client";

export const GLifeOrderResponse = `
  promo_code
  discount
  total_amount
  dce_id
  address{
    address_extension
    city
    birthday
    contact_no
    email
    region
    street
  }
  cart{
    items{
      discount
      amount
      description
      quantity
      sku
    }
    payment_type
  }
  channel
  ecom_order
  id
  name
  status
  tickers{
    data_privacy
    marketing
    terms_and_conditions
  }
  payment_id
  tracking{
    delivery_status
    id
    order_status
  }
  date_created
`;

export const ZynOrderResponse = `
  promo_code
  discount
  total_amount
  dce_id
  address{
    address_extension
    city
    birthday
    contact_no
    email
    region
    street
  }
  cart{
    items{
      amount
      description
      quantity
      sku
    }
    payment_type
  }
  channel
  ecom_order
  id
  name
  status
  tickers{
    data_privacy
    marketing
    terms_and_conditions
  }
  payment_id
  tracking{
    delivery_status
    id
    order_status
  }
  date_created
`;

export const getGLifeOrders = gql`query orders($from: AWSTimestamp, $to: AWSTimestamp){
    orders(from: $from, to: $to){
      items{
        ${GLifeOrderResponse}
      }
    }
}`;

export const updateGLifeOrder = gql`mutation orderUpdate($order_id: ID!, $status: LeadStatus!, $ecom_order: ID) {
  orderUpdate(order_id: $order_id, status: $status, ecom_order: $ecom_order) {
    ${GLifeOrderResponse}
  }
}`;

export const cancelGLifeOrder = gql`
  mutation orderCancel(
    $order_id: ID!
    $total_amount: Float!
    $payment_id: ID!
  ) {
    orderCancel(
      order_id: $order_id
      total_amount: $total_amount
      payment_id: $payment_id
    )
  }
`;

export const gLifeOrderCreated = gql`subscription onOrderCreated {
  onOrderCreated {
      ${GLifeOrderResponse}
  }
}`;

export const getZynOrders = gql`query orders($from: AWSTimestamp, $to: AWSTimestamp){
  orders(from: $from, to: $to){
    items{
      ${ZynOrderResponse}
    }
  }
}`;

export const zynOrderCreated = gql`subscription onOrderCreated {
  onOrderCreated {
      ${ZynOrderResponse}
  }
}`;

export const updateZynOrder = gql`mutation orderUpdate($order_id: ID!, $status: LeadStatus!, $ecom_order: ID) {
  orderUpdate(order_id: $order_id, status: $status, ecom_order: $ecom_order) {
    ${ZynOrderResponse}
  }
}`;

export const cancelZynOrder = gql`
  mutation orderCancel(
    $order_id: ID!
    $total_amount: Float!
    $payment_id: ID!
  ) {
    orderCancel(
      order_id: $order_id
      total_amount: $total_amount
      payment_id: $payment_id
    )
  }
`;
