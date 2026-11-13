import { gql } from "@apollo/client";

export const _schema = `
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
wallet {
    balance
}
`;

export const getRiders = gql`query riders($rider_status: RiderStatus, $next_token: String) {
    riders(rider_status: $rider_status, next_token: $next_token) {
        next_token
        items {
           ${_schema}
            hybridlead_enabled
        }
    }
}`;

export const walletTransfer = gql`
  mutation walletTransfer($to_username: ID!, $amount: Float!) {
    walletTransfer(to_username: $to_username, amount: $amount)
  }
`;

export const walletRemit = gql`
  mutation walletRemit($from_username: ID!, $amount: Float!) {
    walletRemit(from_username: $from_username, amount: $amount)
  }
`;
