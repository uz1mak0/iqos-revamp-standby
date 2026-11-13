import { gql } from "@apollo/client";

const InventoryItemSchema = `
    id
    serial
    holder_serial
    charger_serial
    tag
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
    cycle
    tag
`;

export const getInventoryItem = gql`query inventoryItem($serial: String!) {
    inventoryItem(serial: $serial) {
      ${InventoryItemSchema}
    }
  }`;

export const getInventoryItems = gql`query inventoryItems($warehouse_id: String, $next_token: String, $status: InventoryItemStatus) {
    inventoryItems(warehouse_id: $warehouse_id, next_token: $next_token, status: $status) {
      items{
        ${InventoryItemSchema}
      }
    }
  }`;
