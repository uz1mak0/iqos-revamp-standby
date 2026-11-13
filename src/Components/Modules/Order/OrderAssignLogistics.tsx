import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { ORDER, WMS } from "../../../GraphQL";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import {
  assignLogistics,
  manualAWB,
} from "../../../GraphQL/OrderManagementSchema";
import { rolesAtom } from "../../../Store/StoreAtom";
import { Input, Modal, Select, Button, Group } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { getPaperBagSizes } from "./Config";
import { Radio } from "@mantine/core";

type Props = {
  onUpdate: (order: ORDER.Order) => void;
  order?: ORDER.Order;
};

export const OrderAssignLogistics = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [visible, setVisible] = useState(false);

  const [logisticAssign, { loading: loadingAssign }] = useMutation(
    assignLogistics,
    {
      context: { clientName: "external" },
    }
  );

  const [manualAssign, { loading: loadingManual }] = useMutation(manualAWB, {
    context: { clientName: "order" },
  });

  const { loading: loadingWarehouse, data: dataWarehouses } = useQuery(
    getWarehouses,
    {
      context: { clientName: "warehouse" },
      variables: {
        channel: "ECOMM",
      },
    }
  );

  const form = useForm({
    initialValues: {
      logistic_partner: "TWO_GO",
      paper_bag_size: "SMALL",
      assigned_hub: props.order?.assigned_hub || "",
      type: false,
      awb: "",
    },
  });

  const onAssignLogistics = async () => {
    try {
      await logisticAssign({
        variables: {
          order_id: props.order?.order_id,
          partner: "TWO_GO",
          assigned_hub: form.values.assigned_hub,
          paper_bag_size: form.values.paper_bag_size,
          type: form.values.type,
        },
      });

      Notification.success({ message: "Order Assigned" });
      props.onUpdate({
        ...props.order,
        assigned_logistics: "TWO_GO",
        shipment_type: ORDER.ShipmentType.ThirdParty,
      });
      setVisible(false);
    } catch (e: any) {
      Notification.error({ message: e.message });
    }
  };

  const onManualAssign = async () => {
    try {
      if (!form.values.awb) {
        return Notification.error({ message: "AWB is required" });
      }

      await manualAssign({
        variables: {
          id: props.order?.order_id,
          awb: form.values.awb,
          assignedWH: form.values.assigned_hub,
          paperBag: form.values.paper_bag_size,
        },
      });

      Notification.success({ message: "Manual AWB Assigned" });
      props.onUpdate({
        ...props.order,
        assigned_logistics: "TWO_GO",
        shipment_type: ORDER.ShipmentType.ThirdParty,
        awb: form.values.awb,
      });
      setVisible(false);
    } catch (e: any) {
      Notification.error({ message: e.message });
    }
  };

  return (
    <div>
      <Modal
        opened={visible}
        title="Notice"
        centered
        size={700}
        onClose={() => setVisible(false)}
      >
        <p>
          {form.values.type
            ? "Are you sure you want to manually assign this AWB?"
            : "Are you sure you want to assign shipment to THIRD PARTY?"}
        </p>
        <Group position="center">
          <Button
            loading={loadingAssign || loadingManual}
            onClick={() => setVisible(false)}
          >
            Back
          </Button>
          <Button
            loading={loadingAssign || loadingManual}
            onClick={form.values.type ? onManualAssign : onAssignLogistics}
            customType="primary"
          >
            Confirm
          </Button>
        </Group>
      </Modal>

      {!!props?.order?.assigned_hub ? undefined : (
        <>
          <Radio.Group
            label="Type"
            value={String(form.values.type)}
            onChange={(val) => form.setFieldValue("type", val === "true")}
          >
            <Radio value="false" label="Default" />
            <Radio value="true" label="Manual" />
          </Radio.Group>

          {form.values.type && (
            <Input
              {...form.getInputProps("awb")}
              label="AWB Number"
              placeholder="Enter The AWB Here"
            />
          )}
        </>
      )}

      <Input
        {...form.getInputProps("logistic_partner")}
        label="Logistic Partner"
        disabled
      />

      <Select
        {...form.getInputProps("paper_bag_size")}
        label="Paper Bag Size"
        placeholder="Select paper bag size"
        disabled={!!props?.order?.paper_bag_size}
        data={getPaperBagSizes.map((e) => ({
          label: e,
          value: e,
        }))}
      />

      <Select
        searchable
        {...form.getInputProps("assigned_hub")}
        label="Assigned Hub"
        placeholder="Select assigned hub"
        disabled={!!props?.order?.assigned_hub}
        data={
          dataWarehouses?.warehouses?.items?.map((e: WMS.Warehouse) => ({
            label: e.name,
            value: e.id,
          })) || []
        }
      />

      <br />
      {props.order?.assigned_hub && props?.order?.paper_bag_size ? null : (
        <Button
          loading={loadingAssign || loadingManual}
          onClick={() => setVisible(true)}
          disabled={!form.values.assigned_hub}
        >
          Assign
        </Button>
      )}
    </div>
  );
};
