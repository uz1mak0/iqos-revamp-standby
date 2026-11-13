import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Plus } from "tabler-icons-react";
import { ORDER, WMS } from "../../../GraphQL";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import {
  Button,
  Divider,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  Select,
  Stack,
} from "../../Elements";
import { ManualOrderItems } from "./ManualOrderItems";
import { useForm } from "@mantine/form";
import Notification from "../../Elements/Notification/Notification";
import { orderCreate } from "../../../GraphQL/OrderManagementSchema";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { ManualOrderItemsProps } from "./config";

type RegionProps = { name: string; key: string; long: string };
type ProvinceProps = { name: string; key: string; region: string };
type CityProps = { name: string; province: string; region: string };

export const ManualOrder = () => {
  var regions = require("philippines/regions");
  var provinces = require("philippines/provinces");
  var cities = require("philippines/cities");
  const [userRoles] = useAtom(rolesAtom);
  const [userDetails] = useAtom(userAtom);
  var isCSCOrder: boolean = userRoles.isCSC;
  const [opened, setOpened] = useState(false);
  const initialItems: ManualOrderItemsProps[] = [];
  const { data: dataWarehouse } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });
  const [createOrder, { loading: loading }] = useMutation(orderCreate, {
    context: { clientName: "order" },
  });

  const router = useRouter();
  const salutations = [
    {
      label: "Mrs. ",
      value: "0001",
    },
    {
      label: "Mr. ",
      value: "0002",
    },
    {
      label: "Company",
      value: "0003",
    },
  ];

  const form = useForm({
    initialValues: {
      order_id: "",
      assigned_warehouse: isCSCOrder ? `${userDetails.office_id}` : "",
      customer_number: "",
      salutation: "",
      first_name: "",
      last_name: "",
      company: "",
      address_extention_1: "",
      street: "",
      building: "",
      city: "",
      country: "",
      province: "",
      region: "",
      email: "",
      telephone_number: "",
      items: initialItems,
    },
    validate: {
      assigned_warehouse: (value: string | undefined) =>
        !value ? "Required!" : null,
      // order_id: (value: string | undefined) => (!value ? 'Required!' : null),
      customer_number: (value: string) => (!value ? "Required!" : null),
      salutation: (value: string | undefined) => (!value ? "Required!" : null),
      first_name: (value: string | undefined) => (!value ? "Required!" : null),
      last_name: (value: string | undefined) => (!value ? "Required!" : null),
      // company: (value: string | undefined) => (!value ? 'Required!' : null),
      street: (value: string | undefined) => (!value ? "Required!" : null),
      building: (value: string | undefined) => (!value ? "Required!" : null),
      province: (value: string | undefined) => (!value ? "Required!" : null),
      city: (value: string | undefined) => (!value ? "Required!" : null),
      region: (value: string | undefined) => (!value ? "Required!" : null),
      email: (value: string | undefined) => (!value ? "Required!" : null),
      telephone_number: (value: string | undefined) =>
        !value ? "Required!" : null,
    },
  });

  const onSubmit = () => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });
    if (form.values.items.length < 1)
      return Notification.error({ message: "Please add line items!" });

    const addresss = {
      address_extention_1: form.values.address_extention_1,
      building: form.values.building,
      city: form.values.city,
      company: form.values.company,
      country: "PH",
      email: form.values.email,
      first_name: form.values.first_name,
      last_name: form.values.last_name,
      region: form.values.region,
      salutation: form.values.salutation,
      street: form.values.street,
      telephone_number: form.values.telephone_number,
    };

    const input: ORDER.OrderInput = {
      order_id:
        form.values.order_id ||
        "CC" + parseInt(`${new Date().getTime() / 1000}`),
      assigned_warehouse: form.values.assigned_warehouse,
      order_type: "MANUAL",
      payment_type: "COD",
      customer_number: form.values.customer_number,
      billing_address: addresss,
      shipping_address: addresss,
      price: {
        currency: "PHP",
        gross: `${form.values.items.reduce(
          (acc, curr) =>
            acc + (curr?.quantity || 0) * (curr.price_per_unit || 0),
          0
        )}`,
      },
      items: form.values.items.map((item) => {
        return {
          sku: item.sku,
          quantity: item.quantity,
          price_per_unit: item.price_per_unit,
          total: (item.price_per_unit || 0) * (item.quantity || 0),
          description: item.description,
          quantity_unit: item.unit_of_measure,
        };
      }),
    };

    createOrder({
      variables: {
        input: input,
      },
    })
      .then(() => {
        Notification.info({ message: notificationRender(input.order_id) });
        onClose();
      })
      .catch((error) => {
        Notification.error({ message: error.message });
      });
  };

  const onClose = () => {
    setOpened(false);
    form.reset();
  };

  const notificationRender = (id: string) => (
    <div>
      <p>Order Created</p>
      <Button
        onClick={() =>
          router.push(`/order-management/order-details/orderID/?orderID=${id}`)
        }
        fullWidth
      >{`Click here to open Order: ${id}`}</Button>
    </div>
  );

  const accessRole = () => {
    if (
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isCSC ||
      userRoles.isEcomAdmin ||
      userRoles.isAdministratorEC ||
      userRoles.isFullAdmin ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isDispatcher ||
      userRoles.isEcomCSC
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div>
      <Modal
        size={1100}
        title={"Create Order"}
        centered
        onClose={onClose}
        opened={opened}
      >
        <div>
          <LoadingOverlay visible={loading} />
          <form>
            <Select
              {...form.getInputProps("assigned_warehouse")}
              searchable
              disabled={isCSCOrder}
              data-testid={"TEST-SELECT-WH"}
              data={
                dataWarehouse
                  ? dataWarehouse.warehouses.items.map((e: WMS.Warehouse) => {
                      return {
                        label: `${e?.name}`,
                        value: `${e?.id}`,
                      };
                    })
                  : []
              }
              placeholder={"Select Warehouse"}
              description={"Assign to warehouse"}
            />
            <br />
            <Divider />
            <br />
            <ManualOrderItems isCSCOrder={isCSCOrder} form={form} />
            <br />
            <Divider />
            <h4>Customer Information</h4>
            <Stack>
              <Grid>
                <Grid.Col span={6}>
                  <Input
                    {...form.getInputProps("order_id")}
                    description="Order ID"
                    placeholder="Enter order ID"
                    disabled={
                      process.env.NEXT_PUBLIC_PLATFORM === "test"
                        ? false
                        : isCSCOrder
                    }
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Input
                    {...form.getInputProps("customer_number")}
                    description="Customer Number"
                    placeholder="Enter customer name"
                  />
                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={4}>
                  <Select
                    {...form.getInputProps("salutation")}
                    description="Salutation"
                    placeholder="Select salutation"
                    data={salutations}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Input
                    {...form.getInputProps("first_name")}
                    withAsterisk={true}
                    description="First Name"
                    placeholder="Enter first name"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Input
                    {...form.getInputProps("last_name")}
                    description="Last Name"
                    placeholder="Enter last name"
                  />
                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={4}>
                  <Input
                    {...form.getInputProps("company")}
                    description="Company"
                    placeholder="Enter company name"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Input
                    {...form.getInputProps("telephone_number")}
                    description="Contact Number"
                    placeholder="09xxxxxxxxx"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Input
                    {...form.getInputProps("email")}
                    description="Email"
                    placeholder="Enter email"
                  />
                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={4}>
                  <Input
                    {...form.getInputProps("street")}
                    description="Street"
                    placeholder="Enter street"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Input
                    {...form.getInputProps("building")}
                    description="Building"
                    placeholder="Enter building"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Input
                    {...form.getInputProps("address_extention_1")}
                    description="Address Extension"
                    placeholder="Enter address extension"
                  />
                </Grid.Col>
              </Grid>
              <Grid>
                <Grid.Col span={4}>
                  <Select
                    {...form.getInputProps("region")}
                    searchable
                    description="Region"
                    placeholder="Select region"
                    onChange={(value) => {
                      form.setFieldValue("region", value);
                      form.setFieldValue("province", "");
                      form.setFieldValue("city", "");
                    }}
                    data={regions.map((e: RegionProps) => {
                      return {
                        label: `${e.name} : ${e.long}`,
                        value: e.key,
                      };
                    })}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    {...form.getInputProps("province")}
                    searchable
                    data-testid={`TEST-CREATE-ORDER-SELECT-SKU`}
                    disabled={!form.values.region}
                    description="Province"
                    placeholder="Select province"
                    onChange={(value) => {
                      form.setFieldValue("province", value);
                      form.setFieldValue("city", "");
                    }}
                    data={provinces
                      .filter(
                        (e: ProvinceProps) => e.region === form.values.region
                      )
                      .map((e: ProvinceProps) => {
                        return {
                          label: `${e.name}`,
                          value: e.key,
                        };
                      })}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    {...form.getInputProps("city")}
                    disabled={!form.values.province}
                    description="City"
                    placeholder="Select city"
                    searchable
                    data={cities
                      .filter(
                        (e: CityProps) => e.province === form.values.province
                      )
                      .map((e: CityProps) => {
                        return {
                          label: `${e.name}`,
                          value: e.name,
                        };
                      })}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
            <Group position="center" my="20px">
              <Button
                loading={loading}
                customType="secondary"
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button
                data-testid={`TEST-CREATE-ORDER-SUBMIT`}
                loading={loading}
                customType="primary"
                onClick={() => onSubmit()}
              >
                Submit
              </Button>
            </Group>
          </form>
        </div>
      </Modal>
      <div>
        <Button
          disabled={accessRole()}
          loading={loading}
          onClick={() => {
            setOpened(true);
            form.setFieldValue(
              "order_id",
              isCSCOrder
                ? "CSC" + parseInt(`${new Date().getTime() / 1000}`)
                : ""
            );
          }}
          icon={<Plus />}
        >
          Create Order
        </Button>
      </div>
    </div>
  );
};
