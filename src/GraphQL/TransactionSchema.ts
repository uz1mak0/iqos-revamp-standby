import gql from "graphql-tag";

const TransmittalSchema = `
    id
    warehouse_id
    remarks
    date
    time
    status
    invoice_id
    delivery_source
    date_created
    from_warehouse_id
    delivery_type
    box_count
    bundle_count
    bag_count
    sales_invoice

    batch_items {
    gtin
    sku
    batch_id
    quantity
    warehouse_id
    unit_of_measure
    expiration_date
    description
    updated_by

    inventory {
        items {
        id
        serial
        sku
        holder_serial
        charger_serial
        tag
      }
      next_token
    }
  }
`;

const PullOutSchema = `
  id
  warehouse_id
  remarks
  invoice_id
  status
  pullout_to
  pullout_type
  delivery_type
  box_count
  bundle_count
  bag_count
  batch_items {
    gtin
    sku
    batch_id
    quantity
    warehouse_id
    unit_of_measure
    expiration_date
    description
    updated_by
    inventory {
      items {
        id
        serial
        sku
        warehouse_id
        holder_serial
        charger_serial
        tag
      }
      next_token
    }
  }
`;

const TransferSchema = `
  id
  remarks
  reason_for_cancel
  warehouse_id
  invoice_id
  date_created
  date_updated
  status
  to_warehouse_id
  delivery_type
  box_count
  bundle_count
  bag_count
  ar_number
  batch_items {
    gtin
    sku
    batch_id
    quantity
    received
    warehouse_id
    unit_of_measure
    expiration_date
    description
    updated_by
    inventory {
      items {
        id
        serial
        sku
        warehouse_id
        holder_serial
        charger_serial
        tag
      }
      next_token
    }
  }
`;

const ReturnSchema = `
  id
  warehouse_id
  remarks
  return_type
  return_from
  status
  delivery_type
  box_count
  bundle_count
  bag_count
  batch_items {
    gtin
    sku
    batch_id
    quantity
    warehouse_id
    unit_of_measure
    expiration_date
    description
    updated_by
    inventory {
      items {
        id
        serial
        sku
        warehouse_id
        holder_serial
        charger_serial
        tag
      }
      next_token
    }
  }
`;

const ReconcileSchema = `
  id
  date
  time
  remarks
  warehouse_id
  from_warehouse_id
  invoice_id
  date_created
  date_updated
  status
  updated_by
  batch_items {
    sku
    batch_id
    gtin
    quantity
    warehouse_id
    unit_of_measure
    expiration_date
    description
    updated_by
  }
`;

const DeviceItemSchema = `
  gtin
  sku
  batch_id
  warehouse_id
  unit_of_measure
  description
  serial
  sku
  holder_serial
  charger_serial
  tag
`;

const PulloutActivationsSchema = `
  date
  id
  outlets{
    id
    location
    name
  }
`;

const DirectTransferSchema = `
  id
  remarks
  reason_for_cancel
  transfer_type
  warehouse_id
  invoice_id
  date_created
  date_updated
  status
  to_warehouse_id
  transfer_type
  delivery_type
  box_count
  bundle_count
  bag_count
  ar_number
  batch_items {
    gtin
    sku
    batch_id
    quantity
    received
    warehouse_id
    unit_of_measure
    expiration_date
    description
    updated_by
    inventory {
      items {
        id
        serial
        sku
        warehouse_id
        holder_serial
        charger_serial
        tag
      }
      next_token
    }
  }
`;

const BatchConversionItems = `
  gtin
  sku
  batch_id
  quantity
  warehouse_id
  unit_of_measure
  expiration_date
  description
  multiplier
  batches{
    batch_id
    expiration_date
    quantity
  }
  destination_sku{
    gtin
    sku
    unit_of_measure
    description
  }
`;

const ConversionSchema = `
id
remarks
warehouse_id
invoice_id
date_created
date_updated
status
date
time
batch_items{
  ${BatchConversionItems}
} 
created_by
updated_by
`;

export const getTransmittal = gql`query getTansmittal($id: String!) {
    transmittal(id: $id) {
      ${TransmittalSchema}
    }
}`;

export const getPullout = gql`query pullout($id: String!) {
  pullout(id: $id) {
   ${PullOutSchema}
  }
}`;

export const getTransfer = gql`query transfer($id: String!) {
  transfer(id: $id) {
    ${TransferSchema}
  }
}`;

export const getReturn = gql`query return($id: String!) {
  return(id: $id) {
    ${ReturnSchema}
  }
}`;

export const getDirectTransfer = gql`query directTransfer($id: String!) {
  directTransfer(id: $id) {
    ${DirectTransferSchema}
  }
}`;

export const getConversion = gql`query conversion($id: String!) {
  conversion(id: $id) {
    ${ConversionSchema}
  }
}`;

export const createTransmittal = gql`mutation transmittalCreate($id: String, $input:TransmittalInput) {
  transmittalCreate(id: $id, input: $input) {
    ${TransmittalSchema}
  }
}`;

export const updateTransmittal = gql`mutation transmittalUpdate($input:TransmittalUpdateInput){
  transmittalUpdate(input: $input) {
    ${TransmittalSchema}
  }
}`;

export const transmitByBatch = gql`mutation transmitByBatch($transmittal_id: String!, $input: BatchItemsInput){
  transmitByBatch(transmittal_id: $transmittal_id, input: $input) {
   ${TransmittalSchema}
  }
}`;

export const transmitItem = gql`mutation transmitItem($input: InventoryItemInput, $batch_input: BatchItemsInput, $transmittal_id: String!){
  transmitItem(input: $input, batch_input: $batch_input, transmittal_id: $transmittal_id) {
  ${DeviceItemSchema}
  }
}`;

export const transmitItemVoid = gql`mutation transmitItemVoid($serial: String, $transmittal_id: String!, $batch_input: BatchItemsInput) {
  transmitItemVoid(serial: $serial, transmittal_id: $transmittal_id, batch_input: $batch_input) {
    ${TransmittalSchema}
  }
}`;

export const createPullOut = gql`mutation pulloutCreate($id: String, $input: PulloutInput) {
  pulloutCreate(id: $id, input: $input) {
    ${PullOutSchema}
  }
}`;

export const updatePullout = gql`mutation pulloutUpdate($input: PulloutUpdateInput) {
  pulloutUpdate(input: $input) {
    ${PullOutSchema}
  }
}`;

export const pulloutByBatch = gql`mutation pulloutByBatch($pullout_id: String!, $input: BatchItemsInput){
  pulloutByBatch(pullout_id: $pullout_id, input: $input) {
   ${PullOutSchema}
  }
}`;

export const pulloutItem = gql`mutation pulloutItem($serial: String!, $pullout_id: String!, $type: String, $batch_input: BatchItemsInput){
  pulloutItem(serial: $serial, pullout_id: $pullout_id, type: $type, batch_input: $batch_input) {
    ${DeviceItemSchema}
  }
}`;

export const pulloutItemVoid = gql`mutation pulloutItemVoid($serial: String!, $batch_input: BatchItemsInput, $pullout_id: String!){
  pulloutItemVoid(serial: $serial, batch_input: $batch_input, pullout_id: $pullout_id) {
    ${PullOutSchema}
  }
}`;

export const getActivations = gql`query activations($date_filter: DateFilter){
  activations(date_filter: $date_filter){
    items{
      ${PulloutActivationsSchema}
    }
    next_token
  }
}`;

export const pulloutByBatches = gql`mutation pulloutByBatches($pullout_id: String!, $input: [BatchItemsInput]){
  pulloutByBatches(pullout_id: $pullout_id, input: $input) {
    ${PullOutSchema}
  }
}`;

export const createReturn = gql`mutation returnCreate($id: String, $input: ReturnInput) {
  returnCreate(id: $id, input: $input) {
    ${ReturnSchema}
  }
}`;

export const updateReturn = gql`mutation returnUpdate($input: ReturnUpdateInput) {
  returnUpdate(input: $input) {
   ${ReturnSchema}
  }
}`;

export const returnByBatch = gql`mutation returnByBatch($return_id: String!, $input: BatchItemsInput){
  returnByBatch(return_id: $return_id, input: $input) {
    ${ReturnSchema}
  }
}`;

export const returnItem = gql`mutation returnItem($serial: String!, $return_id: String!, $batch_input: BatchItemsInput){
  returnItem(serial: $serial, return_id: $return_id, batch_input: $batch_input) {
    ${DeviceItemSchema}
  }
}`;

export const returnItemVoid = gql`mutation returnItemVoid($serial: String!, $return_id: String!, $batch_input: BatchItemsInput){
  returnItemVoid(serial: $serial, return_id: $return_id, batch_input: $batch_input) {
    ${ReturnSchema}
  }
}`;

export const returnByBatches = gql`mutation returnByBatches($return_id: String!, $input: [BatchItemsInput]){
  returnByBatches(return_id: $return_id, input: $input) {
    ${ReturnSchema}
  }
}`;

export const createTransfer = gql`mutation transferCreate($id: String, $input: TransferInput) {
  transferCreate(id: $id, input: $input) {
    ${TransferSchema}
  }
}`;

export const transferByBatch = gql`mutation transferByBatch($transfer_id: String!, $input: BatchItemsInput){
  transferByBatch(transfer_id: $transfer_id, input: $input) {
    ${TransferSchema}
  }
}`;

export const transferItem = gql`mutation transferItem($serial: String!, $transfer_id: String!, $batch_input: BatchItemsInput){
  transferItem(serial: $serial, transfer_id: $transfer_id, batch_input: $batch_input) {
   ${DeviceItemSchema}
  }
}`;

export const transferItemVoid = gql`mutation transferItemVoid($serial: String!, $transfer_id: String!, $batch_input: BatchItemsInput){
  transferItemVoid(serial: $serial, transfer_id: $transfer_id, batch_input: $batch_input) {
    ${TransferSchema}
  }
}`;

export const transferItemReceiveVoid = gql`
  mutation transferItemReceiveVoid(
    $serial: String!
    $transfer_id: String!
    $batch_input: BatchItemsInput
  ) {
    transferItemReceiveVoid(
      serial: $serial
      transfer_id: $transfer_id
      batch_input: $batch_input
    ) {
      ${TransferSchema}
    }
  }
`;

export const transferItemReceive = gql`
  mutation transferItemReceive(
    $serial: String!
    $transfer_id: String!
    $batch_input: BatchItemsInput
  ) {
    transferItemReceive(
      serial: $serial
      transfer_id: $transfer_id
      batch_input: $batch_input
    ) {
      ${DeviceItemSchema}
    }
  }
`;

export const updateTransfer = gql`mutation transferUpdate($input: TransferUpdateInput) {
  transferUpdate(input: $input) {
    ${TransferSchema}
  }
}`;

export const transferByBatchReceive = gql`mutation transferByBatchReceive($transfer_id: String!, $input: BatchItemsInput){
  transferByBatchReceive(transfer_id: $transfer_id, input: $input) {
    ${TransferSchema}
  }
}`;

export const cancelTransfer = gql`mutation transferCancel($id: String!, $reason_for_cancel: String){
  transferCancel(id: $id, reason_for_cancel: $reason_for_cancel) {
    ${TransferSchema}
  }
}`;

export const getReconcile = gql`query getReconcile($id: String!) {
  recon(id: $id) {
    ${ReconcileSchema}
  }
}`;

export const createReconcile = gql`mutation reconCreate($id: String, $input:TransmittalInput) {
  reconCreate(id: $id, input: $input) {
    ${ReconcileSchema}
  }
}`;

export const updateReconcile = gql`mutation reconUpdate($input:TransmittalUpdateInput){
  reconUpdate(input: $input) {
    ${ReconcileSchema}
  }
}`;

export const reconByBatches = gql`
  mutation reconByBatches($recon_id: String!, $input: [BatchItemsInput]) {
    reconByBatches(recon_id: $recon_id, input: $input) {
      id
    }
  }
`;

export const createDirectTransfer = gql`
  mutation directTransferCreate($id: String, $input: DirectTransferInput) {
    directTransferCreate(id: $id, input: $input) {
      ${DirectTransferSchema}
    }
  }
`;

export const updateDirectTransfer = gql`
  mutation directTransferUpdate($input: TransferUpdateInput) {
    directTransferUpdate(input: $input) {
      ${DirectTransferSchema}
    }
  }
`;

export const directTransferItem = gql`mutation directTransferItem($serial: String!, $transfer_id: String!, $batch_input: BatchItemsInput){
  directTransferItem(serial: $serial, transfer_id: $transfer_id, batch_input: $batch_input) {
   ${DeviceItemSchema}
  }
}`;

export const createUOMConversion = gql`
  mutation conversionCreate($id: String, $input:  ConversionInput) {
    conversionCreate(id: $id, input: $input) {
      ${ConversionSchema}
    }
  }
`;

export const updateUOMConversion = gql`
  mutation conversionUpdate($input:  ConversionUpdateInput) {
    conversionUpdate(input: $input) {
      ${ConversionSchema}
    }
  }
`;

export const convertByBatch = gql`mutation convertByBatch($conversion_id: String!, $input: ConvertItemsInput){
  convertByBatch(conversion_id: $conversion_id, input: $input) {
   ${ConversionSchema}
  }
}`;

export const voidConversion = gql`mutation convertByBatchVoid($conversion_id: String!, $input: ConvertItemsInput){
  convertByBatchVoid(conversion_id: $conversion_id, input: $input) {
   ${ConversionSchema}
  }
}`;

export const deleteDraftedTransaction = gql`
  mutation deleteDraftedTransaction($id: String!) {
    deleteDraftedTransaction(id: $id) {
      message
    }
  }
`;

// SRF
const SRFSchema = `
  id
  status
  reason
  status
  warehouse_id
  created_by
  updated_by
  channel
  items {
    batch_id
    gtin
    sku
    description
    req_qty
    curr_qty
    sc_qty
    wh_qty
    reason
    inventory_type
    serial 
  }
  logs {
  approved_by
  approval_date
  status
  }
  date_input
  date_created
  date_updated
`;

export const getStockRequest = gql`
  query stockRequest($id: ID!) {
    stockRequest(id: $id) {
      ${SRFSchema}
    }
  }
`;

export const getStockRequests = gql`
  query stockRequests(
    $warehouse_id: String
    $date_filter: DateFilter
    $next_token: String
    $status: StockRequestStatus
  ) {
    stockRequests(
      warehouse_id: $warehouse_id
      date_filter: $date_filter
      next_token: $next_token
      status: $status
    ) {
      next_token
      items {
        ${SRFSchema}
      }
    }
  }
`;

export const updateSrfStatus = gql`
  mutation srfStatusUpdate($input: srfStatusUpdateInput) {
    srfStatusUpdate(input: $input) {
      ${SRFSchema}
    }
  }
`;

export const updateSrfQty = gql`
  mutation srfQtyUpdate($id: ID,$items: [StockRequestItemInput]) {
    srfQtyUpdate(id: $id, items: $items) {
      ${SRFSchema}
    }
  }
`;

export const createSRF = gql`
  mutation createStockRequest($input: StockRequestInput!) {
    createStockRequest(input: $input) {
      ${SRFSchema}
    }
  }
`;
