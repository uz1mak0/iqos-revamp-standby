import { gql } from "@apollo/client";

const SMSTemplateSchema = `
  id
  date_created
  date_updated
  created_by
  updated_by
  type
  message
  reference_id
`;

const SMSWarehouseSchema = `
    id
    name
    area
    type
    status
    ecomm_sms{
      id
      type
      message
    }
`;

export const getSMSTemplates = gql`query smsTemplates($next_token: String, $sms_channel: SMSChannel!) {
  smsTemplates(next_token: $next_token, sms_channel: $sms_channel) {
    items{
      ${SMSTemplateSchema}
    }
    next_token
  }
}`;

export const getActiveSMSTemplates = gql`query activeSMSTemplate {
  activeSMSTemplate {
      ${SMSTemplateSchema}
  }
}`;

export const createSMSTemplate = gql`mutation smsTemplateCreate($input: SMSTemplateInput) {
  smsTemplateCreate(input: $input) {
    ${SMSTemplateSchema}
  } 
}`;

export const updateActiveSMSTemplate = gql`mutation setSMSTemplate($id: ID!, $input: SMSTemplateInput!) {
  setSMSTemplate(id: $id, input: $input) {
    ${SMSTemplateSchema}
  } 
}`;

export const updateSMSTemplate = gql`mutation smsTemplateUpdate($id: ID!, $input: SMSTemplateInput) {
  smsTemplateUpdate(id: $id, input: $input) {
    ${SMSTemplateSchema}
  } 
}`;

export const deleteSMSTemplate = gql`mutation smsTemplateRemove($id: ID!) {
  smsTemplateRemove(id: $id) {
    ${SMSTemplateSchema}
  } 
}`;

export const getSMSWarehouses = gql`query warehouses($type: WarehouseType, $next_token: String $channel: ChannelType) {
  warehouses(type: $type, next_token: $next_token, channel: $channel) {
    items {
      ${SMSWarehouseSchema}
    }
    next_token
  }
}`;

export const assignSMSToWarehouses = gql`
  mutation smsAssignToWarehouses($id: ID!, $warehouse_ids: [ID!]) {
    smsAssignToWarehouses(id: $id, warehouse_ids: $warehouse_ids) {
      message
    }
  }
`;

export const unAssignSMSToWarehouses = gql`
  mutation smsUnassignToWarehouses($warehouse_ids: [ID!]) {
    smsUnassignToWarehouses(warehouse_ids: $warehouse_ids) {
      message
    }
  }
`;
