import { ORDER } from "../../../GraphQL";

export interface ManualOrderForm {
  assigned_warehouse: string;
  customer_number: string;
  order_id: string;
  salutation: string;
  first_name: string;
  last_name: string;
  company: string;
  address_extention_1: string;
  street: string;
  building: string;
  city: string;
  country: string;
  province: string;
  region: string;
  email: string;
  telephone_number: string;
  items: ManualOrderItemsProps[];
}

export interface ManualOrderItemsProps extends ORDER.OrderItemInput {
  gtin?: string;
  unit_of_measure: ORDER.Maybe<string> | undefined;
}
