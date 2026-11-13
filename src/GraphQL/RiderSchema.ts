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

export const getRiderInfo = gql`query riders($username: ID!) {
    rider(username: $username) {
        ${_schema}
    }
  }`;

export const riderUpdate = gql`mutation riderUpdate($input: RiderUpdateInput) {
    riderUpdate(input: $input) {
        ${_schema}
        hybridlead_enabled
    }
}`;

export const riderCreate = gql`mutation riderCreate($input: RiderInput) {
    riderCreate(input: $input) {
        ${_schema}
        hybridlead_enabled
    }
}`;

export const riderResetPassword = gql`
  mutation riderResetPassword($input: RiderResetPasswordInput) {
    riderResetPassword(input: $input) {
      username
    }
  }
`;
