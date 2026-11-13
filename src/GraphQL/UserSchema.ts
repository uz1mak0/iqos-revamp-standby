import { gql } from "@apollo/client";

export const _schema = `
username
name
phone_number
roles
email
user_status
office_id
office_ids
channel
`;

export const _riderSchema = `
username
name
phone_number
email
user_status
channel
`;

export const StoreUsersSchema = `
username
name
phone_number
roles
email
user_status
`;

export const getAdmins = gql`query admins($channel: ChannelType, $next_token: String)  {
admins(channel: $channel, next_token: $next_token)  {
    items {
        ${_schema}
        office_name
        wallet {
            balance
        }
    }
    next_token

    }
}`;

export const getAdminInfo = gql`query admin($username: String!) {
  admin(username: $username) {
      ${_schema}
      office_name
      office_id
      wallet {
          balance
      }
  }
}`;

export const updateAdmin = gql`mutation adminUpdate($input: AdminUpdateInput) {
    adminUpdate(input: $input) {
      ${_schema}
      office_name
      wallet {
          balance
      }
    }
}`;

export const createAdmin = gql`mutation adminCreate($input: AdminInput) {
    adminCreate(input: $input) {
      ${_schema}
      office_name
      wallet {
          balance
      }
    }
}`;

export const getEnums = gql`
  query enums($name: String!) {
    __type(name: $name) {
      enumValues {
        name
      }
    }
  }
`;

export const getWarehouses = gql`
  query warehouses(
    $channel: ChannelType
    $type: WarehouseType
    $next_token: String
  ) {
    warehouses(channel: $channel, type: $type, next_token: $next_token) {
      next_token
      items {
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
      }
    }
  }
`;

export const userDisable = gql`mutation userDisable($username: String) {
  userDisable(username: $username) {
    ${_schema}
  }
}`;

export const userEnable = gql`mutation userEnable($username: String) {
  userEnable(username: $username) {
    ${_schema}
  }
}`;

export const riderDisable = gql`mutation userDisable($username: String) {
  userDisable(username: $username) {
    ${_riderSchema}
  }
}`;

export const riderEnable = gql`mutation userEnable($username: String) {
  userEnable(username: $username) {
    ${_riderSchema}
  }
}`;

export const getStoreUsers = gql`query storeUsers($next_token: String) {
  storeUsers(next_token: $next_token) {
    items {
      ${StoreUsersSchema}
    }
    next_token
  }
}`;

export const storeUserCreate = gql`mutation storeUserCreate($input: StoreUserInput){
  storeUserCreate(input: $input) {
    ${StoreUsersSchema}
  }
}`;

export const storeUserUpdate = gql`mutation storeUserUpdate($input: StoreUserUpdateInput){
  storeUserUpdate(input: $input) {
    ${StoreUsersSchema}
  }
}`;

export const resetPassword = gql`
  mutation resetPassword($input: ResetPasswordInput) {
    resetPassword(input: $input) {
      username
    }
  }
`;

export const getSalesExperts = gql`
  query salesExperts($user_status: UserStatus, $nextToken: String) {
    salesExperts(user_status: $user_status, next_token: $nextToken) {
      items {
        sales_expert_id
        phone_number
        email
        user_status
        name
        office_ids
      }
      next_token
    }
  }
`;

export const getSalesExpertInfo = gql`
  query salesExpert($sales_expert_id: String!) {
    salesExpert(sales_expert_id: $sales_expert_id) {
      sales_expert_id
      name
      email
      phone_number
      user_status
      office_ids
    }
  }
`;

export const getFOMLogs = gql`
  query fomLogs(
    $from: AWSTimestamp
    $to: AWSTimestamp
    $fom_username: String
    $next_token: String
  ) {
    fomLogs(
      from: $from
      to: $to
      fom_username: $fom_username
      next_token: $next_token
    ) {
      items {
        id
        action
        description
        fom_username
        se_username
        date_created
        from_warehouse {
          id
          warehouse_name
        }
        to_warehouse {
          id
          warehouse_name
        }
      }
      next_token
    }
  }
`;

export const createSalesExpert = gql`
  mutation salesExpertCreate($input: SalesExpertInput) {
    salesExpertCreate(input: $input) {
      name
      sales_expert_id
      phone_number
      email
      user_status
      office_ids
    }
  }
`;

export const deleteSalesExpert = gql`
  mutation salesExpertDelete($sales_expert_id: String!) {
    salesExpertDelete(sales_expert_id: $sales_expert_id) {
      name
      sales_expert_id
      phone_number
      email
      user_status
      office_ids
    }
  }
`;

export const updateSalesExpert = gql`
  mutation salesExpertUpdate($input: SalesExpertUpdateInput) {
    salesExpertUpdate(input: $input) {
      sales_expert_id
      name
      email
      phone_number
      user_status
      office_ids
    }
  }
`;

export const createFOMLogs = gql`
  mutation mutationFomLogs($input: FOMLogInput) {
    mutationFomLogs(input: $input) {
      id
      action
      description
      fom_username
      se_username
      from_warehouse {
        id
        warehouse_name
      }
      to_warehouse {
        id
        warehouse_name
      }
    }
  }
`;
