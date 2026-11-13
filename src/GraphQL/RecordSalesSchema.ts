import { gql } from "@apollo/client";

const RecordSalesSchema = `
  date_created
  transaction_id
  transaction_no
  warehouse_id
  underwent_guided_trial
  remarks
  club_status
  sales_expert
  items {
    sku { 
      id 
      name 
      description 
      sku
      gtin
      type
      unit_of_measure 
      promo {
          code
          name
          description
          status
          type
        }
    }
    quantity
    serials
    inputs
    is_promo_good
  }
  
  created_by
  date_created
  cegid_no
  updated_by
  date_updated
  customer_information{
    first_name
    last_name
    mobile_number
    email
  }
`;

const SalesTransactionSchema = `
  club_status
  cegid_no
  created_by
  is_refunded
  return_notes
  lead_source
  customer_information{
    last_name
    first_name
    email
    mobile_number
  }
  date_created
  date_updated
  id
  items{
    discount
    input
    inputs
    price
    quantity
    serials
    promo_type
    promo_discount
    menthol_variant
    is_promo_good
      sku{
        sku
        id 
        name
        type 
        description
        gtin 
        price
        unit_of_measure
        promo{
          code
          discount
          name
          discount_type
        }
      }
    }
    order_date
    payment_type
    remarks
    sales_expert
    remittance_slip{
      bucket
      key
      region
    }
    signature{
      bucket
      key
      region
    }
    additional_attachment{
      bucket
      key
      region
    }
  total_price
  transaction_id
  transaction_no
  underwent_guided_trial
  updated_by
  warehouse_id
  type
  status
  link_tags
  ir_error_tags
  incident_report_id
`;

const GuidedTrialSchema = `
  id
  warehouse_id
  sgt
  first_time_gt
  customer_information{
    last_name
    first_name
  }
  type
  date_created
  device
`;

const GuidedTrialTypeSchema = `
    ${GuidedTrialSchema}
    items{
      sku{
        id
        name
        description
        sku
        unit_of_measure
        type
        gtin
        price_gross
        price
        channel
      }
      quantity
      serials
      input
      inputs
      discount
      price
    }
`;

const GuidedTrialRecordSaleTypeSchema = `
    ${GuidedTrialSchema}
    sales_transaction{
     ${SalesTransactionSchema}
    }
`;

export const getSalesTransactions = gql`query saleTransactions($warehouse_id: ID!, $date_filter: TimestampFilter){
    saleTransactions(warehouse_id: $warehouse_id, date_filter: $date_filter){
      items{
       ${SalesTransactionSchema}
      }
      total
    }
}`;

export const recordSalesTransaction = gql`mutation saleTransactionRecord($input: SaleTransactionInput!) {
  saleTransactionRecord(input: $input) {
    ${RecordSalesSchema}
  }
}`;

export const saleTransactionRemove = gql`
  mutation saleTransactionRemove($transaction_id: ID!) {
    saleTransactionRemove(transaction_id: $transaction_id) {
      transaction_id
    }
  }
`;

export const saleTransactionUpdate = gql`mutation saleTransactionUpdate($transaction_id: ID!, $input: SaleTransactionInput!) {
  saleTransactionUpdate(transaction_id: $transaction_id, input: $input) {
    ${SalesTransactionSchema}
  }
}`;

export const guidedTrialCreate = gql`
  mutation guidedTrialCreate($input: GuidedTrialInput!) {
    guidedTrialCreate(input: $input) {
      id
    }
  }
`;

export const getGuidedTrials = gql`query guidedTrials($next_token: String) {
  guidedTrials(next_token: $next_token) {
    items{
      ${GuidedTrialSchema}
    }
  nextToken
  }
}`;

export const getGuidedTrial = gql`query guidedTrial($id: ID!) {
  guidedTrial(id: $id) {
    ${GuidedTrialRecordSaleTypeSchema}
  }
}`;

export const getGuidedTrialRecordSale = gql`query guidedTrial($id: ID!) {
  guidedTrial(id: $id) {
    ${GuidedTrialRecordSaleTypeSchema}
  }
}`;

export const refundRecordSale = gql`mutation refundTransactionRecord($input: RefundTransactionInput!) {
  refundTransactionRecord(input: $input) {
    ${SalesTransactionSchema}
  }
}`;

export const getReturnRefundTransactions = gql`query refundTransactions($warehouse_id: ID!, $date_filter: TimestampFilter){
  refundTransactions(warehouse_id: $warehouse_id, date_filter: $date_filter){
    items{
     ${SalesTransactionSchema}
    }
    total
  }
}`;

export const getSalesTransaction = gql`query saleTransaction($id: ID!){
  saleTransaction(id: $id){
    ${SalesTransactionSchema}
  }
}`;

export const getTotalDRSales = gql`
  query saleTransactions($warehouse_id: ID!, $date_filter: TimestampFilter) {
    saleTransactions(warehouse_id: $warehouse_id, date_filter: $date_filter) {
      items {
        total_price
        transaction_id
      }
      total
    }
  }
`;

export const getDCLendingTransactons = gql`query lendingSaleTransactions($warehouse_id: ID, $date_filter: TimestampFilter, $type: LendingSalesType!, $channel: ChannelType){
    lendingSaleTransactions(warehouse_id: $warehouse_id, date_filter: $date_filter, type: $type, channel: $channel){
      items{
       ${SalesTransactionSchema}
      }
      total
    }
}`;

export const createDCLendingReturnOrder = gql`mutation returnLendingSaleTransactionCreate($serial: ID!, $warehouse_id: ID!){
    returnLendingSaleTransactionCreate(warehouse_id: $warehouse_id, serial: $serial){
       ${SalesTransactionSchema}
    }
}`;

export const lendingSalesTransaction = gql`query lendingTransaction($id: ID!){
    lendingTransaction(id: $id){
       ${SalesTransactionSchema}
    }
}`;
