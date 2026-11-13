import { gql } from "@apollo/client";

const WarehouseSchema = `
    id
    name
    area
    type
    with_caveat
    cutoff_time
    channel
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

const InventorySchema = `
    sku
    gtin
    batch_id
    quantity
    warehouse_id
    unit_of_measure
    expiration_date
    batch_id
    description
    inventory_type
    transmittal
    committed
    released
    transferred_out
    transferred
    pullout
    returned
`;

const WarehouseTransactionsSchema = `
    id
    type
    warehouse_id
    invoice_id
    status
    date_created
    date_updated
    remarks
    pullout_type
    return_type
    to_warehouse_id
    batch_items {
    sku
    batch_id
    quantity
    gtin
    }
    status
`;

const VoucherSchema = `
  serial
  description
  order_id
  item_status
  batch_id
  lead_id
`;

const DeviceInventorySchema = `
  usage_history{
    post{
      charger_cycle
      device_cycle
      holder_cycle
      version
    }
    pre{
      charger_cycle
      device_cycle
      holder_cycle
      version
    }
  }
  order_history
  id
  serial
  charger_serial
  holder_serial
  expiration_date
  manufacturing_date
  item_status
  description
  batch_id
  gtin
  issue_date
  sku
  location
  warehouse_id
  status_date
  date_created
  date_updated
  transmittal_id
  transfer_id
  order_id
  pullout_id
  return_id
  unit_of_measure
  reconcile_count
  cycle
  tag
`;

const TransferItemsSchema = `
  id
  warehouse_id
  invoice_id
  to_warehouse_id
  status
  date_created
  date_updated
  remarks
  batch_items {
    sku
    batch_id
    quantity
    gtin
  }
  status
`;

const InventoryReconcileSchema = `
  serial
  sku
  holder_serial
  charger_serial
  reconcile_count
  tag
`;

const SKUInventorySchema = `
  sku
  gtin
  transmittal
  committed
  released
  transferred_out
  transferred
  pullout
  returned
`;

export const BatchItemsSchema = `
  gtin
  sku
  batch_id
  quantity
  warehouse_id
  unit_of_measure
  expiration_date
  description
  inventory_type
  transmittal
  committed
  released
  transferred_out
  transferred
  pullout
  returned
  updated_by
`;


export const getWarehouses = gql`query warehouses($type: WarehouseType, $next_token: String $channel: ChannelType) {
    warehouses(type: $type, next_token: $next_token, channel: $channel) {
      items {
        ${WarehouseSchema}
      }
      next_token
    }
  }`;

export const getWarehouse = gql`query warehouse($id: String) {
    warehouse(id: $id) {
      ${WarehouseSchema}
    }
  }`;

export const getWarehouseInventory = gql`query batchesPerWarehouse($warehouse_id: String!, $next_token: String, $type: String) {
    batchesPerWarehouse(warehouse_id: $warehouse_id, next_token: $next_token, type: $type) {
      items {
        ${InventorySchema}
      }
      next_token
    }
}`;

export const getWarehourseTransactions = gql`query($warehouse_id: String!, $type: TransactionType, $status: TransactionStatus, $next_token: String ) {
    transactionsPerWarehouse(
      warehouse_id: $warehouse_id, type: $type, status: $status, next_token: $next_token) {
      items {
        ${WarehouseTransactionsSchema}
      }
      next_token
    }
  }`;

export const getWarehourseTransactionsPagination = gql`query($warehouse_id: String!, $type: TransactionType, $status: TransactionStatus, $next_token: String, $limit: Int ) {
    transactionsPerWarehousePagination(
      warehouse_id: $warehouse_id, type: $type, status: $status, next_token: $next_token, limit: $limit) {
      items {
        ${WarehouseTransactionsSchema}
      }
      next_token
    }
  }`;

export const getVouchers = gql`query voucherInventoryItems($warehouse_id: String, $type: PromoType, $status: InventoryItemStatus, $next_token: String){
    voucherInventoryItems(warehouse_id: $warehouse_id, type: $type, status: $status, next_token: $next_token){
      items{
       ${VoucherSchema}
      }
    }
  }`;

export const getDeviceInventoryItems = gql`query inventoryItems($warehouse_id: String, $next_token: String, $status: InventoryItemStatus) {
    inventoryItems(warehouse_id: $warehouse_id, next_token: $next_token, status: $status) {
      items {
        ${DeviceInventorySchema}
      }
      next_token
    }
  }`;

export const getTransfersToWarehouse = gql`query($warehouse_id: String!, $status: TransactionStatus, $next_token: String ) {
    transfersToWarehouse(
      warehouse_id: $warehouse_id, status: $status, next_token: $next_token) {
      items {
        ${TransferItemsSchema}
      }
      next_token
    }
  }`;

export const getDeviceReports = gql`
  query reportWarehouse(
    $type: ReportType
    $date_filter: DateFilter
    $warehouse_id: String
    $status: String
  ) {
    reportWarehouse(
      type: $type
      date_filter: $date_filter
      warehouse_id: $warehouse_id
      status: $status
    )
  }
`;

export const inventoryReconcile = gql`mutation inventoryReconcile($input: ReconcileInput){
    inventoryReconcile(input: $input) {
      ${InventoryReconcileSchema}
    }
  }`;

export const getSkuInventory = gql`query {
    skuInventory {
      items {
       ${SKUInventorySchema}
      }
    }
  }`;

export const createWarehouse = gql`mutation warehouseCreate($input: WarehouseInput){
    warehouseCreate(input: $input) {
     ${WarehouseSchema}
    }
  }`;

export const updateWarehouse = gql`mutation warehouseUpdate($input: WarehouseInput) {
    warehouseUpdate(input: $input) {
      ${WarehouseSchema}
    }
  }`;

export const getReceivableStocksCount = gql`
  query ($warehouse_id: String!, $status: TransactionStatus) {
    transfersToWarehouse(warehouse_id: $warehouse_id, status: $status) {
      items {
        id
      }
    }
  }
`;

export const getDirectReceivableStocksCount = gql`
  query ($warehouse_id: String!, $status: TransactionStatus) {
    directTransfersToWarehouse(warehouse_id: $warehouse_id, status: $status) {
      items {
        id
      }
    }
  }
`;

export const getSubmittedTransferCount = gql`
 query($warehouse_id: String!, $type: TransactionType, $status: TransactionStatus, $next_token: String ) {
    transactionsPerWarehouse(
      warehouse_id: $warehouse_id, type: $type, status: $status, next_token: $next_token) {
      items {
        ${WarehouseTransactionsSchema}
      }
      next_token
    }
  }
`;

export const getDirectTransfersToWarehouse = gql`query directTransfersToWarehouse($warehouse_id: String!, $status: TransactionStatus, $next_token: String ) {
  directTransfersToWarehouse(
    warehouse_id: $warehouse_id, status: $status, next_token: $next_token) {
    items {
      ${TransferItemsSchema}
    }
    next_token
  }
}`;

export const updateExpiration = gql`
  mutation updateInventoryExpiration(
    $batch_id: String!
    $warehouse_id: String!
    $new_date: String!
  ) {
    updateInventoryExpiration(
      batch_id: $batch_id
      warehouse_id: $warehouse_id
      new_date: $new_date
    ) {
      ${BatchItemsSchema}
    }
  }
`;

