import { gql } from "@apollo/client";

export const _schema = `
id
name
area
type
status
accounts {
    cod
    non_cod
}
zip_codes {
    from
    to
}
`;
const ReportSchema = `
  request_id
  status
  url
  error
`;

const FomLogsReportSchema = `
  request_id
  status
  url
  total_records
  error
`;

export const reportWarehouse = gql`
  query reportWarehouse(
    $type: ReportType
    $date_filter: DateFilter
    $warehouse_id: String
    $status: String
    $warehouse_ids: [String]
    $channel: ChannelType
  ) {
    reportWarehouse(
      type: $type
      date_filter: $date_filter
      warehouse_id: $warehouse_id
      status: $status
      warehouse_ids: $warehouse_ids
      channel: $channel
    )
  }
`;

const EndOfDaySchema = `
  id
  warehouse_id
  datetime
  created_by
  date_created
  invoice_id
  non_sellable_declarations{
    category
    category_items{
      title
      type
      value
    }
  }
  finance_declarations{
    sales_summary{
      total_cash_sales
      total_cc_sales
      total_dc_sales
      total_gcash_sales
      total_sales
      x_reading_total_sales
      declared_sales_amount
      final_sales_amount
    }
    uploads {
      receipt {
        bucket
        key
        region
      }
      x_receipt {
          bucket
          key
          region
        }
      excess_amount
      reason
    }
    proof_of_payment{
      total_cash_deposit
      date_of_deposit
      deposit_reference_number
    }
    upload_slip{
      remittance{
        bucket
        key
        region
      }
      additional{
        bucket
        key
        region
      }
      reason
    }
  }
`;

const OSASchema = `
  id
  warehouse_id
  datetime
  created_by
  date_created
  items{
    title
    items{
      title
      type
      value
      expiration
    }
  }`;

const POSchema = `
  id
  sales_invoice
  warehouse_id
  date
  created_by
  date_created
  status
  delivery_note
  receive_by
  remarks
  cust_ref_no
  order_id
  updated_by
  attachments {
    bucket
    key
    region
  }
`;

const POSchemaInput = `
  sales_invoice
  warehouse_id
  date
  created_by
  status
  delivery_note
  cust_ref_no
  order_id
  receive_by
  remarks
  attachments {
    bucket
    key
    region
  }
`;

export const report = gql`
  query report($type: ReportType, $date_filter: DateFilter, $warehouse_id: ID) {
    report(type: $type, date_filter: $date_filter, warehouse_id: $warehouse_id)
  }
`;

export const getGLifeReports = gql`
  query report($filter: FilterInput, $type: ReportType) {
    report(filter: $filter, type: $type)
  }
`;

export const getWarehouses = gql`query warehouses($type: WarehouseType, $next_token: String, $channel: ChannelType) {
    warehouses(type: $type, next_token: $next_token, channel: $channel) {
      next_token
      items {
        ${_schema}
      }
    }
}`;

export const footTrafficCreate = gql`
  mutation footTrafficCreate($warehouse_id: ID!, $date: String!, $count: Int!) {
    footTrafficCreate(warehouse_id: $warehouse_id, date: $date, count: $count) {
      warehouse_id
    }
  }
`;

export const theftCreate = gql`
  mutation theftCreate($warehouse_id: ID!, $input: TheftInput) {
    theftCreate(warehouse_id: $warehouse_id, input: $input) {
      warehouse_id
    }
  }
`;

export const downloadSubscriptionReport = gql`subscription onReportDownload($request_id: ID!) {
  onReportDownload(request_id: $request_id) {
    ${ReportSchema}
  }
}`;

export const requestOMSReport = gql`
  mutation reportRequest($warehouse_id: ID,$date_filter: DateFilter, $request_id: ID!, $type: ReportType!, $frequency: Frequency){
    reportRequest(warehouse_id: $warehouse_id, date_filter: $date_filter, request_id: $request_id, type: $type, frequency: $frequency) {
      ${ReportSchema}
    }
  }`;

export const exportFomLogs = gql`
  mutation downloadFomLogs {
    downloadFomLogs {
      ${FomLogsReportSchema}
    }
  }
`;

export const salesUpload = gql`
  subscription onUpload($request_id: ID!) {
    onUpload(request_id: $request_id) {
      request_id
      rows
      valid
      errors
      error_logs
      error_url
      uno_project_url
    }
  }
`;

export const requestWMSReport = gql`
  mutation reportRequest(
    $type: ReportType
    $channel: ChannelType
    $warehouse_id: String
    $warehouse_ids: [String]
    $date_filter: DateFilter
    $status: String
    $request_id: ID!
  ) {
    reportRequest(
      type: $type
      channel: $channel
      warehouse_id: $warehouse_id
      warehouse_ids: $warehouse_ids
      date_filter: $date_filter
      status: $status
      request_id: $request_id
    ) {
      ${ReportSchema}
    }
  }
`;

export const uploadSales = gql`
  mutation uploadSales(
    $request_id: ID!
    $warehouse_id: ID!
    $file: S3ObjectInput
    $date: AWSDate!
    $uno_template_type: UnoTemplateType
  ) {
    uploadSales(
      warehouse_id: $warehouse_id
      request_id: $request_id
      file: $file
      date: $date
      uno_template_type: $uno_template_type
    )
  }
`;

export const createEodOfDayReport = gql`
  mutation endOfDayAndFinanceCreate($input: EndOfDayInput!){
    endOfDayAndFinanceCreate(input: $input) {
      ${EndOfDaySchema}
    }
}`;

export const getEODReports = gql`query endOfDayList($warehouse_id: ID, $next_token: String, $date_filter: DateFilter, $type: DeclarationType) {
  endOfDayList(warehouse_id: $warehouse_id, next_token: $next_token, date_filter: $date_filter, type: $type) {
    nextToken
    items {
      ${EndOfDaySchema}
    }
  }
}`;

export const getPOReports = gql`
  query posTransactions(
    $warehouse_id: String
    $next_token: String
    $date_range: DateFilter
    $channel: Channel
  ) {
    posTransactions(
      warehouse_id: $warehouse_id
      next_token: $next_token
      date_range: $date_range
      channel: $channel
    ) {
      nextToken
      items {
        ${POSchema}
      }
    }
  }
`;

export const getPO = gql`
  query posTransaction(
    $id: ID
    $channel: Channel
  ) {
    posTransaction(
      id: $id
      channel: $channel
    ) {
        ${POSchema}
    }
  }
`;

export const createPurchaseOrderReport = gql`
  mutation POsCreate($input: POsInput) {
    POsCreate(input: $input) {
 ${POSchemaInput}
    }
  }
`;

export const updatePOStatus = gql`
  mutation POsUpdateStatus(
    $update_by: String
    $channel: Channel
    $id: ID
  ) {
    POsUpdateStatus(
      update_by: $update_by
      channel: $channel
      id: $id) {
   ${POSchema}
    }
  }
`;

export const onshelfAvailCreate = gql`
  mutation OSACreate($input: OSAInput!){
    OSACreate(input: $input) {
      ${OSASchema}
    }
}`;

export const getOSAReports = gql`query OSAList($warehouse_id: ID, $next_token: String, $date_filter: DateFilter) {
  OSAList(warehouse_id: $warehouse_id, next_token: $next_token, date_filter: $date_filter) {
    nextToken
    items {
      ${OSASchema}
    }
  }
}`;
