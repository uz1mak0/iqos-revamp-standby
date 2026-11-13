import { gql } from "@apollo/client";

const PromoSchema = `
    code
    description
    discount
    discount_type
    name
    status
    type
`;

export const getPromos = gql`query promos($next_token: String) {
    promos(next_token: $next_token) {
      items {
        ${PromoSchema}
      }
      nextToken
    }
  }`;

export const createPromo = gql`mutation promoCreate($code: ID!, $name: String!, $description: String, $type: PromoType, $discount_type: DiscountType, $discount: Float) {
  promoCreate(code: $code, name: $name, description: $description, type: $type, discount_type: $discount_type, discount: $discount){
    ${PromoSchema}
  }
}`;

export const updatePromo = gql`mutation promoUpdate($code: ID!, $name: String, $description: String, $type: PromoType, $status: PromoStatus, $discount_type: DiscountType, $discount: Float) {
  promoUpdate(code: $code, name: $name, description: $description, status: $status, type: $type, discount_type: $discount_type, discount: $discount){
   ${PromoSchema}
  }
}`;
