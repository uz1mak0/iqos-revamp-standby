import { gql } from "@apollo/client";

export const _schema = `
banner_id
image
filename
reroute
`;

export const getAdmins = gql`
  query {
    admins {
      items {
        username
        name
        office_name
        phone_number
        roles
        email
        user_status
        wallet {
          balance
        }
      }
      next_token
    }
  }
`;
