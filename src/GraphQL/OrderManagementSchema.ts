import { gql } from "@apollo/client";

export const OrderSchema = `
    id
    hard_age_verified
    pickup_type
    lending_purchase_status
    assigned_hub
    date_updated
    guided_trial_schedule_time
    guided_trial_schedule_date
    original_guided_trial_schedule_time
    original_guided_trial_schedule_date
    paper_bag_size
    return_date
    lead_type
    lead_source
    delivery_method
    awb
    delivery_date
    delivery_time
    shipment_type
    assigned_logistics
    assigned_rider
    assigned_coach
    sub_warehouse_tag
    seller_center_order_id
    customer_rating {
        rating
        completed
        orders
        undelivered
        retries
    }
    order_status
    delivery_status
    assigned_warehouse
    order_reference_number
    retry_count
    date_created
    invoice_no
    order_id
    order_type
    order_reason
    payment_type
    doc_type
    delivery_fee
    customer_number
    verification_status
    verification_reason
    note
    promo {
    tag
    verified
    description
    heets
    }
    price {
    currency
    net
    net_original
    gross
    gross_original
    sub_total_gross
    vat_rate
    vat_value
    carrier_gross
    discounts {
        discount_number
        discount_code
        discount_type
        discount_gross
        discount_description
    }
    }
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
    billing_address {
    address_extention_1
    address_extention_2
    first_name
    last_name
    street
    zip
    city
    language
    email
    }
    items {
    device_return_status
    sku
    quantity
    price_per_unit
    price_per_unit_original
    total
    charger_returned
    holder_returned
    scanned_quantity
    description
    quantity_unit
    is_freebies
    free_items {
      gtin
      description
      sku
      qty    
    }
    item_discounts {
        discount_number
        discount_code
        discount_type
        discount_gross
        discount_description
    }
    inventory_items {
        serial
        expiration_date
        description
        sku
        batch_id
        unit_of_measure

        holder_serial
        charger_serial

        tag
        cycle
    }
    }
    promo_items {
    sku
    quantity
    price_per_unit
    price_per_unit_original
    total
    scanned_quantity
    description
    quantity_unit
    item_discounts {
        discount_number
        discount_code
        discount_type
        discount_gross
        discount_description
    }
    inventory_items {
        id
        serial
        expiration_date
        description
        sku
        batch_id
        unit_of_measure

        holder_serial
        charger_serial
        tag
        cycle
    }
    }
    sms_logs{
        timestamp
        status
        message
    }
    order_status_logs {
    status
    status_datetime
    updated_by
    }
    delivery_status_logs {
    assigned_rider
    status
    status_datetime
    undeliverable {
        reason
        remarks
    }
    delivered {
        customers_id
        authorized_recipient_id
        qr {
            bucket
            key
            region
        }
        signature {
            bucket
            key
            region
        }
    }
    }
    usage_history{
    post{
        version
        charger_cycle
        device_cycle
        holder_cycle
    }
    pre{
        version
        charger_cycle
        device_cycle
        holder_cycle
    }
}
`;

export const OrderFraudSchema = `
    id
    hard_age_verified
    pickup_type
    assigned_hub
    date_updated
    guided_trial_schedule_time
    guided_trial_schedule_date
    original_guided_trial_schedule_time
    original_guided_trial_schedule_date
    paper_bag_size
    return_date
    lead_type
    lead_source
    delivery_method
    awb
    delivery_date
    delivery_time
    shipment_type
    assigned_logistics
    assigned_rider
    assigned_coach
    sub_warehouse_tag
    customer_rating {
        rating
        completed
        orders
        undelivered
        retries
    }
    order_status
    delivery_status
    assigned_warehouse
    order_reference_number
    retry_count
    date_created
    invoice_no
    order_id
    order_type
    order_reason
    payment_type
    doc_type
    delivery_fee
    customer_number
    verification_status
    verification_reason
    note
    promo {
    tag
    verified
    description
    heets
    }
    price {
    currency
    net
    net_original
    gross
    gross_original
    sub_total_gross
    vat_rate
    vat_value
    carrier_gross
    discounts {
        discount_number
        discount_code
        discount_type
        discount_gross
        discount_description
    }
    }
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
    billing_address {
    address_extention_1
    address_extention_2
    first_name
    last_name
    street
    zip
    city
    language
    email
    }
    items {
    device_return_status
    sku
    quantity
    price_per_unit
    price_per_unit_original
    total
    charger_returned
    holder_returned
    scanned_quantity
    description
    quantity_unit
    item_discounts {
        discount_number
        discount_code
        discount_type
        discount_gross
        discount_description
    }
    inventory_items {
        serial
        expiration_date
        description
        sku
        batch_id
        unit_of_measure

        holder_serial
        charger_serial

        tag
        cycle
    }
    }
    promo_items {
    sku
    quantity
    price_per_unit
    price_per_unit_original
    total
    scanned_quantity
    description
    quantity_unit
    item_discounts {
        discount_number
        discount_code
        discount_type
        discount_gross
        discount_description
    }
    inventory_items {
        id
        serial
        expiration_date
        description
        sku
        batch_id
        unit_of_measure

        holder_serial
        charger_serial
        tag
        cycle
    }
    }
    sms_logs{
        timestamp
        status
        message
    }
    order_status_logs {
    status
    status_datetime
    updated_by
    }
    delivery_status_logs {
    assigned_rider
    status
    status_datetime
    undeliverable {
        reason
        remarks
    }
    delivered {
        customers_id
        authorized_recipient_id
        qr {
            bucket
            key
            region
        }
        signature {
            bucket
            key
            region
        }
    }
    }
    usage_history{
    post{
        version
        charger_cycle
        device_cycle
        holder_cycle
    }
    pre{
        version
        charger_cycle
        device_cycle
        holder_cycle
    }
}
`;

const ItemStockSchema = `
    warehouse_id
    gtin
    quantity
`;

const RiderSchema = `
    username
    license_number
    license_expiration_date
    name
    phone_number
    address
    rider_status
    user_status
    date_created
    date_updated
    hybridlead_enabled
    wallet {
    balance
    }
`;
const FailedOrderSchema = `
  date_created
  file_name
  error_log
  url
  process_status
`;

const PulloutReplacementSchema = `
    id
    order_id
    doc_type
    assigned_warehouse
    date_created
    date_updated
    status
    remarks
    customer {
        first_name
        last_name
    }
    serials
    items {
        serials
        gtin
        quantity
    }
`;

export const getOrders = gql`query orders($order_status: OrderStatus, $next_token: String, $date_filter: DateFilter, $warehouse_id: String) {
    orders(order_status: $order_status, next_token: $next_token, date_filter: $date_filter, warehouse_id: $warehouse_id) {
      items {
        ${OrderSchema}
      }
      next_token
    }
}`;

export const getOrder = gql`query order($id: String) {
    order(id: $id) {
      ${OrderSchema}
    }
}`;

export const GetSubWarehouseTagging = gql`
  query GetSubWarehouseTagging($id: ID!, $sort: String!) {
    getSubWarehouseTagging(id: $id, sort: $sort) {
      id
      sort
      tags
    }
  }
`;

export const UpdateSubWarehouseTag = gql`
  mutation orderSubWarehouseTagUpdate($order_id: ID!, $tag: String!) {
    orderSubWarehouseTagUpdate(order_id: $order_id, tag: $tag) {
      id
      sub_warehouse_tag
    }
  }
`;

export const UpdateSellerCenterOrderID = gql`
  mutation orderSellerCenterUpdate($order_id: ID!, $seller_center: String) {
    orderSellerCenterUpdate(
      order_id: $order_id
      seller_center: $seller_center
    ) {
      id
      seller_center_order_id
    }
  }
`;

export const getItemStocks = gql`query itemStocks($warehouse_id: String!, $gtin: String!, $type: String!) {
    itemStocks(warehouse_id: $warehouse_id, gtin: $gtin, type: $type) {
        ${ItemStockSchema}
    }
}`;

export const pickAndPackSave = gql`mutation pickAndPackSave($order_id: String!, $input: [PickAndPackInput], $order_type: String, $usage_history: UsageHistoryInput) {
    pickAndPackSave(order_id: $order_id, input: $input, order_type: $order_type, usage_history: $usage_history) {
      ${OrderSchema}
    }
}`;

export const pickAndPackVoid = gql`mutation pickAndPackVoid($order_id: String, $order_type: String, $usage_history: UsageHistoryInput) {
    pickAndPackVoid(order_id: $order_id, order_type: $order_type, usage_history: $usage_history) {
      ${OrderSchema}
    }
}`;

export const orderUpdate = gql`mutation orderUpdate($id: ID!, $input: OrderUpdateInput, $order_type: String) {
    orderUpdate(id: $id, input: $input, order_type: $order_type) {
      ${OrderSchema}
    }
}`;

export const getRiders = gql`query riders($rider_status: RiderStatus, $next_token: String) {
    riders(rider_status: $rider_status, next_token: $next_token) {
        next_token
        items {
           ${RiderSchema}
        }
    }
}`;

export const assignOrderToRider = gql`mutation orderAssignRider($id: ID!, $rider_id: String!, $order_type: String, $shipment_type: ShipmentType) {
    orderAssignRider(id: $id,rider_id: $rider_id,order_type: $order_type, shipment_type: $shipment_type){
        ${OrderSchema}
    }
}`;

export const orderScanRider = gql`mutation orderScanRider($id: ID!, $rider_id: String!, $order_type: String, $notification_message: String, $order_status: String) {
    orderScanRider(id: $id, rider_id: $rider_id, order_type: $order_type, notification_message: $notification_message, order_status: $order_status) {
      ${OrderSchema}
    }
}`;

export const deliveryStart = gql`
  mutation deliveryStart($order_id: ID!, $order_type: String) {
    deliveryStart(order_id: $order_id, order_type: $order_type) {
      username
    }
  }
`;

export const deliveryFinish = gql`mutation deliveryFinish(
$rider_id: String!,
$order_id: ID!,
$order_type: String,
$status: DeliveryStatus,
$input: DeliveryStatusUpdateInput) {
deliveryFinish(
    order_id: $order_id,
    rider_id: $rider_id,
    order_type: $order_type,
    status: $status,
    input: $input) {
    ${OrderSchema}
}
}`;

export const updateOrderStatus = gql`mutation orderStatusUpdate($id: ID!, $order_status: OrderStatus!, $order_type: String){
    orderStatusUpdate(
      id: $id
      order_status: $order_status,
      order_type: $order_type
    ) {
      ${OrderSchema}
    }
  }`;

export const getReturnOrders = gql`query returnOrders($order_status: ReturnOrderStatus, $next_token: String, $date_filter: DateFilter, $warehouse_id: String) {
    returnOrders(order_status: $order_status, next_token: $next_token, date_filter: $date_filter, warehouse_id: $warehouse_id) {
      items {
        ${OrderSchema}
      }
      next_token
    }
  }`;

export const getFailedOrders = gql`query ordersFailed($next_token: String, $date_filter: DateFilter) {
    ordersFailed(next_token: $next_token, date_filter: $date_filter) {
      items {
        ${FailedOrderSchema}
      }
      next_token
    }
  }`;

export const getReturnOrder = gql`query returnOrder($id: String) {
    returnOrder(id: $id) {
      ${OrderSchema}
    }
  }`;

export const returnOrderStatusUpdate = gql`mutation returnOrderStatusUpdate($id: ID!, $order_status: ReturnOrderStatus!, $scanned_items: [OrderItemInput], $usage_history: UsageHistoryInput) {
    returnOrderStatusUpdate(id: $id, order_status: $order_status, scanned_items: $scanned_items, usage_history: $usage_history ) {
      ${OrderSchema}
    }
  }`;

export const generatePDF = gql`
  mutation generatePDF(
    $type: PrintType!
    $order_id: ID!
    $salesInvoiceType: Boolean
  ) {
    generatePDF(
      type: $type
      order_id: $order_id
      salesInvoiceType: $salesInvoiceType
    )
  }
`;

export const getLogisticsOrders = gql`query logisticsOrders($assigned_logistics: String!, $order_status: OrderStatus!) {
    logisticsOrders(assigned_logistics: $assigned_logistics, order_status: $order_status) {
      items {
        ${OrderSchema}
      }
      next_token
    }
  }`;

export const printAWB = gql`
  mutation printAWB($order_id: ID!) {
    printAWB(order_id: $order_id)
  }
`;

export const orderVerify = gql`mutation orderVerify($id: ID! $verification_status: VerificationStatus, $verification_reason: String, $note: String) {
    orderVerify(id: $id, verification_status: $verification_status, verification_reason: $verification_reason,  note: $note){
      ${OrderSchema}
    }
  }`;

export const getReplacementOrders = gql`query replacementOrders($order_status: OrderStatus, $next_token: String, $date_filter: DateFilter, $warehouse_id: String) {
    replacementOrders(order_status: $order_status, next_token: $next_token, date_filter: $date_filter, warehouse_id: $warehouse_id) {
      items { 
        ${PulloutReplacementSchema}
      }
      next_token
    }
}`;

export const getReport = gql`
  query report($type: ReportType, $date_filter: DateFilter, $warehouse_id: ID) {
    report(type: $type, date_filter: $date_filter, warehouse_id: $warehouse_id)
  }
`;

export const orderCustomerUpdate = gql`
  mutation ($order_id: ID!, $input: ShippingAddressInput!) {
    orderCustomerUpdate(order_id: $order_id, input: $input) {
      id
      shipping_address {
        first_name
        last_name
        telephone_number
        email
        street
        city
        region
        zip
      }
    }
  }
`;

export const customerUpdate = gql`
  mutation customerUpdate($id: String, $input: CustomerUpdateInput) {
    customerUpdate(id: $id, input: $input) {
      id
      tag
      telephone_number
    }
  }
`;

export const pulloutReplacement = gql`
  mutation pulloutReplacement($input: PulloutReplacementInput) {
    pulloutReplacement(input: $input) {
      message
    }
  }
`;

export const pulloutReplacementCancel = gql`
  mutation pulloutReplacementCancel($input: PulloutReplacementInput) {
    pulloutReplacementCancel(input: $input) {
      message
    }
  }
`;

export const deliveryTracking = gql`
  query deliveryTracking($id: String) {
    deliveryTracking(id: $id) {
      id
      order_status
      order_type
      delivery_status
      order_reason
      retry_count
      payment_type
      items {
        sku
        quantity
        price_per_unit
        total
        description
        scanned_quantity
        inventory_items {
          id
          serial
          expiration_date
          description
          sku
          batch_id
          unit_of_measure
        }
      }
      order_status_logs {
        status
        status_datetime
      }
      delivery_status_logs {
        status
        status_datetime
        undeliverable {
          reason
          remarks
        }

        delivered {
          customers_id
          authorized_recipient_id
        }
      }
    }
  }
`;

export const assignOrderToWarehouse = gql`mutation orderAssignWarehouse($id: String, $warehouse_id: String) {
  orderAssignWarehouse(id: $id, warehouse_id: $warehouse_id) {
    ${OrderSchema}
  }
}
`;

export const sendOrderCustomSMS = gql`
  mutation sendSMS($message: String, $number: String) {
    sendSMS(message: $message, number: $number) {
      message
      number
    }
  }
`;

export const removeLogistics = gql`
  mutation removeLogistics($order_id: ID!) {
    removeLogistics(order_id: $order_id) {
      order_id
    }
  }
`;

export const assignLogistics = gql`
  mutation assignLogistics(
    $order_id: ID!
    $partner: LogisticsPartner!
    $paper_bag_size: PaperBagSize!
    $assigned_hub: ID!
  ) {
    assignLogistics(
      order_id: $order_id
      partner: $partner
      paper_bag_size: $paper_bag_size
      assigned_hub: $assigned_hub
    ) {
      order_id
    }
  }
`;

export const orderCreate = gql`
  mutation orderCreate($input: OrderInput) {
    orderCreate(input: $input) {
      id
    }
  }
`;

export const orderDeliveryFinished = gql`subscription deliveryFinished ($order_id: String) {
  deliveryFinished (order_id: $order_id) {
      ${OrderSchema}
  }
}`;

export const getFraudResult = gql`query fraudCheck($search: String) {
  fraudCheck(search: $search){
    items {
      ${OrderFraudSchema}
    }
    next_token
  }
}`;

export const getTotalOrders = gql`
  query orders(
    $order_status: OrderStatus
    $next_token: String
    $date_filter: DateFilter
    $warehouse_id: String
  ) {
    orders(
      order_status: $order_status
      next_token: $next_token
      date_filter: $date_filter
      warehouse_id: $warehouse_id
    ) {
      items {
        id
        price {
          gross
        }
      }
      next_token
    }
  }
`;

export const manualAWB = gql`
  mutation orderManualAWB(
    $id: ID!
    $awb: String!
    $assignedWH: String!
    $paperBag: String!
  ) {
    orderManualAWB(
      id: $id
      awb: $awb
      assignedWH: $assignedWH
      paperBag: $paperBag
    ) {
       ${OrderSchema}
    }
  }
`;

export const updateOrderLogs = gql`mutation updateOrderLogs($input: UpdateOrderLogsInput!) {
    updateOrderLogs(input: $input) {
      ${OrderSchema}
    }
}`;
