import { useMutation } from "@apollo/client";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Checklist, Edit } from "tabler-icons-react";
import { ORDER } from "../../../GraphQL";
import {
  customerUpdate,
  orderCustomerUpdate,
} from "../../../GraphQL/OrderManagementSchema";
import { Maybe } from "../../../GraphQL/_gql/glife/graphql";
import { Button, Grid, Group, Input, Modal, Paper } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

type Props = {
  order?: Maybe<ORDER.Order>;
  type?: "return" | undefined;
  editable?: boolean;
};

export const OrderCustomerInfo = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [edit, setEdit] = useState(false);
  const [customerTag, setCustomerTag] = useState("");
  const router = useRouter();

  const [onOrderCustomerUpdate, { loading }] = useMutation(
    orderCustomerUpdate,
    { context: { clientName: "order" } }
  );
  const [onCustomerUpdate, { loading: customerLoading }] = useMutation(
    customerUpdate,
    { context: { clientName: "order" } }
  );

  const form = useForm<ORDER.ShippingAddress>({});

  useEffect(() => {
    form.setValues({
      first_name: props?.order?.shipping_address?.first_name,
      last_name: props?.order?.shipping_address?.last_name,
      telephone_number: props?.order?.shipping_address?.telephone_number,
      email: props?.order?.shipping_address?.email,
      street: props?.order?.shipping_address?.street,
      city: props?.order?.shipping_address?.city,
      region: props?.order?.shipping_address?.region,
      zip: props?.order?.shipping_address?.zip,
    });
  }, [edit]);

  const updateShippingAddress = (values: ORDER.ShippingAddress) => {
    onOrderCustomerUpdate({
      variables: {
        order_id: router.query.orderID,
        input: values,
      },
      onCompleted: () => {
        Notification.success({
          title: "Address Info",
          message: "Successfully Updated",
        });
        setEdit(false);
      },
      onError: console.error,
    });
  };

  const onCustomerTagUpdate = () => {
    if (!customerTag) return;
    onCustomerUpdate({
      variables: {
        id: props?.order?.customer_number,
        input: {
          tag: customerTag,
        },
      },
      onCompleted: () => {
        Notification.success({
          title: "Customer Tag",
          message: "Successfully Updated",
        });
      },
      onError: console.error,
    });
  };

  const accessRole = () => {
    if (
      userRoles.isEcomAdmin ||
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isAdministratorEC ||
      userRoles.isFullAdmin ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isPacker ||
      userRoles.isDispatcher
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div>
      <Modal
        size={900}
        centered
        title="Update Shipping Address"
        opened={edit}
        onClose={() => setEdit(false)}
      >
        <form
          onSubmit={form.onSubmit((values) => updateShippingAddress(values))}
        >
          <Grid>
            <Grid.Col span={6}>
              <Input
                label="First Name"
                placeholder="Enter first name"
                {...form.getInputProps("first_name")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Input
                label="Last Name"
                placeholder="Enter last name"
                {...form.getInputProps("last_name")}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <Input
                type="number"
                label="Contact Number"
                placeholder="Enter contact number"
                {...form.getInputProps("telephone_number")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Input
                label="Email"
                placeholder="Enter email"
                {...form.getInputProps("email")}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <Input
                label="Street"
                placeholder="Enter street"
                {...form.getInputProps("street")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Input
                label="City"
                placeholder="Enter city"
                {...form.getInputProps("city")}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <Input
                label="Region"
                placeholder="Enter region"
                {...form.getInputProps("region")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Input
                label="Zip Code"
                placeholder="Enter zip code"
                {...form.getInputProps("zip")}
              />
            </Grid.Col>
          </Grid>
          <br />
          {props.editable ? (
            <Group position="center">
              <Button customType="secondary" onClick={() => setEdit(false)}>
                Cancel
              </Button>
              <Button customType="primary" type="submit" loading={loading}>
                Save
              </Button>
            </Group>
          ) : undefined}
        </form>
      </Modal>
      <Paper radius={8}>
        <h2>Customer Information</h2>

        {props.type !== "return" ? (
          <Paper radius={8}>
            <p>Customer No: {props?.order?.customer_number}</p>
            <p>
              Contact No: {props?.order?.shipping_address?.telephone_number}
            </p>
            {props.editable ? (
              <Group>
                <Input
                  disabled={accessRole()}
                  placeholder="Enter customer tag"
                  onChange={(e) => setCustomerTag(e.target.value)}
                />
                <Button
                  disabled={accessRole()}
                  icon={<Checklist />}
                  onClick={() => onCustomerTagUpdate()}
                >
                  Save
                </Button>
              </Group>
            ) : undefined}
          </Paper>
        ) : undefined}

        <Grid>
          <Grid.Col span={6}>
            <Paper radius={8}>
              <h3>Billing Address</h3>
              <p>
                Customer Name: {props?.order?.billing_address?.first_name}{" "}
                {props?.order?.shipping_address?.last_name}
              </p>
              <p>Email: {props?.order?.billing_address?.email}</p>
              <p>Street: :{props?.order?.billing_address?.street}</p>
              <p>
                Address Ext 1:{" "}
                {props?.order?.billing_address?.address_extention_1}
              </p>
              <p>
                Address Ext 2:{" "}
                {props?.order?.billing_address?.address_extention_2}
              </p>
              <p>City: {props?.order?.billing_address?.city}</p>
              <p>Customer Number: {props?.order?.customer_number}</p>
              <p>Rating:</p>
            </Paper>
          </Grid.Col>
          <Grid.Col span={6}>
            <Paper radius={8}>
              <Group position="apart">
                <h3>Shipping Address</h3>
                {!props.editable ? undefined : (
                  <Button
                    onClick={() => setEdit(true)}
                    icon={<Edit />}
                    disabled={accessRole()}
                  >
                    Edit
                  </Button>
                )}
              </Group>
              <p>
                Customer Name: {props?.order?.shipping_address?.first_name}{" "}
                {props?.order?.shipping_address?.last_name}
              </p>
              <p>
                Contact No: {props?.order?.shipping_address?.telephone_number}
              </p>
              <p>Email: {props?.order?.shipping_address?.email}</p>
              <p>Street:{props?.order?.shipping_address?.street}</p>
              <p>
                Address Ext 1:{" "}
                {props?.order?.shipping_address?.address_extention_1}
              </p>
              <p>
                Address Ext 2:{" "}
                {props?.order?.shipping_address?.address_extention_2}
              </p>
              <p>City: {props?.order?.shipping_address?.city}</p>
              <p>Region: {props?.order?.shipping_address?.region} </p>
              <p>Zip Code: {props?.order?.shipping_address?.zip}</p>
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>
    </div>
  );
};
