import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import {
  ActionIcon,
  Button,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  Select,
  Table,
} from "../../Elements";
import { WMS } from "../../../GraphQL";
import { useForm } from "@mantine/form";
import { formatCodentify } from "../CodentifyScanner/Config";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import Notification from "../../Elements/Notification/Notification";
import { getInventoryItem } from "../../../GraphQL/CodentifyScannerSchema";
import { Edit, Trash, X } from "tabler-icons-react";
import { pulloutReplacement } from "../../../GraphQL/OrderManagementSchema";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

type CreateProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

type SerialsProps = {
  gtin: string;
  sku: string;
  unit_of_measure: string;
  serial: string | undefined;
  quantity: number;
};

export const Create = (props: CreateProps) => {
  const [user] = useAtom(rolesAtom);
  const { data: dataWarehouse } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });
  const { data: dataSKU, refetch: refetchSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });
  const [refetchSerial, { data: dataSerial, loading: loadingSerial }] =
    useLazyQuery(getInventoryItem, { context: { clientName: "warehouse" } });
  const [createPulloutReplacement, { loading: loadingCreate }] = useMutation(
    pulloutReplacement,
    { context: { clientName: "order" } }
  );
  const [serials, setSerials] = useState<SerialsProps[]>([]);
  const [edit, setEdit] = useState<number | undefined>(undefined);

  const form = useForm({
    initialValues: {
      warehouse_id: "",
      first_name: "",
      last_name: "",
      codentify: "",
    },
  });

  const serialChecker = async (serial: string) => {
    if (serial.length == 12) {
      return refetchSerial({
        variables: { serial: serial },
        fetchPolicy: "no-cache",
      }).then((res) => {
        return res.data.inventoryItem
          ? {
              gtin: res.data.inventoryItem.gtin,
              serial: res.data.inventoryItem.serial,
              sku: res.data.inventoryItem.sku,
            }
          : undefined;
      });
    } else {
      return undefined;
    }
  };

  const onCreate = () => {
    if (
      !form.values.warehouse_id ||
      !form.values.first_name ||
      !form.values.last_name
    )
      return Notification.error({ message: "Please add required fields!" });
    if (serials.length <= 0)
      return Notification.error({ message: "No line items!" });

    var items: {
      gtin: string;
      serials: string[] | undefined;
      quantity: number;
    }[] = [];
    serials.map((item: SerialsProps) => {
      var itemIndex = items.findIndex((data) => data.gtin == item.gtin);
      if (itemIndex != -1) {
        items[itemIndex].quantity += 1;
        if (item.serial) {
          items[itemIndex]?.serials?.push(item.serial);
        }
      } else {
        var data = {
          gtin: item.gtin,
          quantity: item.quantity,
          serials: item.serial ? [item.serial] : undefined,
        };
        items.push(data);
      }
    });

    createPulloutReplacement({
      variables: {
        input: {
          warehouse_id: form.values.warehouse_id,
          first_name: form.values.first_name,
          last_name: form.values.last_name,
          items: items,
        },
      },
    })
      .then((res) => {
        Notification.success({ message: "Pullout Replacement Created" });
        form.reset();
        setSerials([]);
        props.onClose();
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onScan = async () => {
    const input = form.values;
    form.setValues({ ...input, codentify: "" });
    const isSerial = await serialChecker(input.codentify);
    const codentify = isSerial ? isSerial : formatCodentify(input.codentify);

    if (codentify) {
      const { data } = await refetchSerial({
        variables: { serial: codentify.serial },
      });
      if (data.inventoryItem == undefined)
        return Notification.error({ message: "Serial not found in system" });
      if (data.inventoryItem.item_status != "AVAILABLE")
        return Notification.error({ message: "serial is not AVAILABLE" });
      if (serials.some((serial) => serial.serial == data.inventoryItem.serial))
        return Notification.error({
          message: "serial already included in list",
        });

      const newSerials = [...serials];
      newSerials.push({
        gtin: codentify.gtin,
        sku: codentify.sku,
        unit_of_measure: data?.inventoryItem.unit_of_measure,
        serial: codentify.serial,
        quantity: 1,
      });

      setSerials(newSerials);
    } else {
      const sku = dataSKU?.skus?.items.find(
        (e: WMS.InventoryItem) => e.gtin === input.codentify
      );
      if (!sku)
        return Notification.error({
          title: "Error",
          message: "SKU/GTIN not found",
        });
      if (sku.type == "DEVICES")
        return Notification.error({ message: "scan codentify for devices" });
      const index = serials.findIndex((serial) => serial.gtin == sku.gtin);
      var newSerials: SerialsProps[] = [...serials];
      if (index == -1) {
        newSerials.push({
          gtin: sku.gtin,
          sku: sku.sku,
          unit_of_measure: sku.unit_of_measure,
          quantity: 1,
          serial: undefined,
        });
        setSerials(newSerials);
      } else {
        newSerials[index].quantity += 1;
        setSerials(newSerials);
      }
    }
  };

  const onRemoveItem = (item: SerialsProps) => {
    const updateList = [...serials];
    setSerials(updateList.filter((e: SerialsProps) => e.gtin !== item.gtin));
    setEdit(undefined);
  };

  const onChangeQuantity = (value: number, item: SerialsProps) => {
    const updateList = [...serials];
    const index = serials.findIndex(
      (e) => e.gtin == item.gtin && e.serial === item.serial
    );
    updateList[index] = { ...updateList[index], quantity: Number(value) };
    setSerials(updateList);
  };

  const onCancelCreate = () => {
    props.onClose();
    setSerials([]);
    form.reset();
  };

  const accessRole = () => {
    if (
      user.isPacker ||
      user.isDispatch ||
      user.isEcomAdmin ||
      user.isAdministratorEC ||
      // old roles
      user.isAdmin ||
      user.isPacker ||
      user.isDispatcher
    ) {
      return false;
    } else {
      return true;
    }
  };

  const rows = () => {
    return serials.map((element: SerialsProps, index: number) => (
      <React.Fragment key={`list-${index}`}>
        <tr>
          <td>{element?.gtin}</td>
          <td>{element?.serial}</td>
          <td>{element?.sku}</td>
          <td>{element?.unit_of_measure}</td>
          <td>
            {!element.serial && index === edit ? (
              <Input
                style={{ width: 100 }}
                defaultValue={element.quantity}
                onChange={(e) => onChangeQuantity(e.target.value, element)}
                type="number"
              />
            ) : (
              element.quantity
            )}
          </td>
          <td>
            {!element.serial ? (
              <ActionIcon>
                {edit == index ? (
                  <X onClick={() => setEdit(undefined)} />
                ) : (
                  <Edit onClick={() => setEdit(index)} />
                )}
              </ActionIcon>
            ) : undefined}
          </td>
          <td>
            <ActionIcon color="red">
              <Trash onClick={() => onRemoveItem(element)} />
            </ActionIcon>
          </td>
        </tr>
      </React.Fragment>
    ));
  };

  return (
    <Modal
      opened={props.opened}
      onClose={() => onCancelCreate()}
      title="Pullout Replacement Items"
      size={1000}
      centered
    >
      <LoadingOverlay visible={loadingCreate || loadingSerial} />
      <div>
        <form>
          <Select
            {...form.getInputProps("warehouse_id")}
            searchable
            placeholder="Select warehouse"
            required
            description="Warehouse"
            data={
              dataWarehouse?.warehouses?.items?.map((e: WMS.Warehouse) => {
                return {
                  label: e.name,
                  value: e.id,
                };
              }) || []
            }
          />
          <Input
            label="GTN/CODENTIFY"
            placeholder="Enter GTIN or CODENTIFY for devices"
            {...form.getInputProps("codentify")}
            onKeyPress={(e) => (e.key === "Enter" ? onScan() : undefined)}
          />
          <Table>
            <thead>
              <tr>
                <th>GTIN</th>
                <th>Serial</th>
                <th>SKU</th>
                <th>UOM</th>
                <th>Quantity</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>{rows()}</tbody>
          </Table>
          <div>
            <h4>Customer Information</h4>
            <Input
              label="First Name"
              placeholder="Enter first name"
              required
              {...form.getInputProps("first_name")}
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              {...form.getInputProps("last_name")}
              required
            />
          </div>
          <br />
          <Group position="center">
            <Button onClick={() => onCancelCreate()} customType="secondary">
              Cancel
            </Button>
            <Button
              disabled={accessRole()}
              onClick={() => onCreate()}
              customType="primary"
            >
              Submit
            </Button>
          </Group>
        </form>
      </div>
    </Modal>
  );
};
