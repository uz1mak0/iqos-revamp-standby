import { gql } from "@apollo/client";

export const _schema = `
id
name
area
type
with_caveat
accounts {
cod
non_cod
}
zip_codes {
from
to
}
`;

export const getWarehouses = gql`query warehouses($type: WarehouseType, $next_token: String) {
    warehouses(type: $type, next_token: $next_token) {
      next_token
      items {
        ${_schema}
      }
    }
}`;

export const getRiders = gql`
  query riders($rider_status: RiderStatus, $next_token: String) {
    riders(rider_status: $rider_status, next_token: $next_token) {
      next_token
      items {
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
      }
    }
  }
`;

export const getAuditOrders = gql`
  query auditOrders(
    $warehouse_id: String
    $date_filter: DateFilter
    $status: String
    $rider: String
  ) {
    auditOrders(
      warehouse_id: $warehouse_id
      date_filter: $date_filter
      status: $status
      rider: $rider
    ) {
      CASH
      CREDIT_CARD
      DEBIT_CARD
      GCASH
      TOTAL
    }
  }
`;

export const walletWithdraw = gql`
  mutation walletWithdraw($from_username: ID!, $amount: Float!) {
    walletWithdraw(from_username: $from_username, amount: $amount)
  }
`;

export const walletDeposit = gql`
  mutation walletDeposit($to_username: ID!, $amount: Float!) {
    walletDeposit(to_username: $to_username, amount: $amount)
  }
`;
