import { gql } from "@apollo/client";

const SKUSchema = `
    id
    name
    description
    unit_of_measure
    type
    description
    sku
    gtin
    price
    price_gross
    channel
    dce_status
    status
`;

const SKUBlocksSchema = `
  id
  modified_by
  skus{
    ${SKUSchema}
  }
  log
  date_created
`;

const ThresholdConfigSchema = `
  id
  warehouse_id
  recipients
  thresholds{
    gtin
    sku
    value
  }
`;

export const getSKUs = gql`query skus($channel: ChannelType, $next_token: String) {
  skus(channel: $channel, next_token: $next_token) {
    items {
      ${SKUSchema}
    }
    next_token
  }
}`;

export const createSku = gql`mutation skuCreate($input: SKUInput!) {
  skuCreate(input: $input) {
    ${SKUSchema}
  } 
}`;

export const updateSku = gql`mutation skuUpdate($input: SKUInput!) {
  skuUpdate(input: $input) {
    ${SKUSchema}
  } 
}`;

export const getBlockedSKUs = gql`query skuBlocks {
  skuBlocks {
    items {
      ${SKUSchema}
    }
    next_token
  }
}`;

export const getBlockedSKULogs = gql`query skuBlockLogs($from: AWSTimestamp $to: AWSTimestamp) {
  skuBlockLogs(from: $from, to: $to) {
    items {
      ${SKUBlocksSchema}
    }
  }
}`;

export const updateDCEStatus = gql`mutation skuBlockUpdate($input: SKUBlockInput) {
  skuBlockUpdate(input: $input) {
    ${SKUBlocksSchema}
  } 
}`;

export const triggerSFTPStocks = gql`
  mutation sftpStocks {
    sftpStocks {
      message
    }
  }
`;

export const triggerOrderReply = gql`
  mutation dceOrderReply($id: ID!, $status: OrderStatus!) {
    dceOrderReply(id: $id, status: $status) {
      message
    }
  }
`;

export const getThresholdConfigs = gql`query thresholdConfigs {
  thresholdConfigs {
    items {
      ${ThresholdConfigSchema}
    }
  }
}`;

export const createThresholdConfig = gql`mutation thresholdConfigCreate($input: ThresholdConfigInput) {
  thresholdConfigCreate(input: $input) {
    ${ThresholdConfigSchema}
  } 
}`;

export const updateThresholdConfig = gql`mutation thresholdConfigUpdate($input: ThresholdConfigInput) {
  thresholdConfigUpdate(input: $input) {
    ${ThresholdConfigSchema}
  } 
}`;

export const removeThresholdConfig = gql`mutation thresholdConfigRemove
($warehouse_id: ID!) {
  thresholdConfigRemove
(warehouse_id: $warehouse_id) {
    ${ThresholdConfigSchema}
  } 
}`;
