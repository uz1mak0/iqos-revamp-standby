import React, { useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Table,
} from "../../Elements";
import { Title, Text } from "@mantine/core";
import { useStyles } from "./Transaction.syles";
import { WMS } from "../../../GraphQL";
import { CaretDown, CaretUp, Eraser, List } from "tabler-icons-react";
import { openConfirmModal } from "@mantine/modals";
import { Transaction, useMutation } from "@apollo/client";
import { voidConversion } from "../../../GraphQL/TransactionSchema";
import { channel } from "diagnostics_channel";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  channel: string | undefined;
  transaction: WMS.Conversion;
  list: WMS.Maybe<WMS.Maybe<WMS.BatchConversionItems>[]> | undefined;
  onVoid: (Transaction: WMS.Conversion) => void;
  skus: WMS.Sku[];
  disabled: boolean;
};

export const UOMConversionTable = (props: Props) => {
  const { classes } = useStyles();
  const [expand, setExpand] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [voidItemConversion, { loading: voidLoading }] = useMutation(
    voidConversion,
    {
      context: { clientName: "warehouse" },
    }
  );

  const onClickItem = (item: WMS.Maybe<WMS.BatchConversionItems>) => {
    if (expand?.some((e) => e == item?.gtin)) {
      setExpand(expand.filter((e) => e != item?.gtin));
    } else {
      setExpand([...(expand || []), item?.gtin || ""]);
    }
  };

  const onVoidItemConversion = (item: WMS.Maybe<WMS.BatchConversionItems>) => {
    setLoading(true);
    voidItemConversion({
      variables: {
        conversion_id: props.transaction.id,
        input: {
          channel: props.channel,
          gtin: item?.gtin,
          quantity: item?.quantity,
          destination_gtin: item?.destination_sku?.gtin,
          multiplier: item?.multiplier,
        },
      },
    })
      .then((res) => {
        setLoading(false);
        Notification.success({ message: "Item successfully void" });
        props.onVoid(res.data.convertByBatchVoid);
      })
      .catch((error) => {
        setLoading(false);
        Notification.error({ message: error.message });
      });
  };

  const openDeleteModal = (item: WMS.Maybe<WMS.BatchConversionItems>) =>
    openConfirmModal({
      title: "Void Item",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to void this item? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Yes, Void Item", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => onVoidItemConversion(item),
    });

  const rows = () => {
    if (!props.list) return;
    return props.list.map((item, index) => {
      return (
        <React.Fragment key={`list-${index}`}>
          <tr onClick={() => onClickItem(item)}>
            <td style={{ width: 10 }}>
              {
                <ActionIcon>
                  {expand?.some((e) => e == item?.gtin) ? (
                    <CaretUp />
                  ) : (
                    <CaretDown />
                  )}
                </ActionIcon>
              }
            </td>
            <td>{item?.gtin}</td>
            <td>{item?.sku}</td>
            <td>{item?.description}</td>
            <td>{item?.quantity}</td>
            <td>{props.skus.find((e) => e.gtin === item?.gtin)?.type || ""}</td>
            <td>
              <Button
                disabled={props.disabled}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openDeleteModal(item);
                }}
                icon={<Eraser size={17} />}
                customType="danger"
              >
                Void Item
              </Button>
            </td>
          </tr>
          {expand?.some((e) => e == item?.gtin) ? (
            <tr key={`list-expanded=${index}`}>
              {expandedTable(item?.batches)}
            </tr>
          ) : undefined}
        </React.Fragment>
      );
    });
  };

  const expandedTable = (
    items: WMS.Maybe<WMS.Maybe<WMS.BatchItems>[]> | undefined
  ) => {
    return (
      <>
        <td colSpan={7}>
          <div>
            <Table highlightOnHover fontSize={"md"}>
              <thead>
                <tr>
                  <th></th>
                  <th>Batch</th>
                  <th>Quantity</th>
                  <th>Exp. Date</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, i) => (
                  <tr key={` batch-${i}`}>
                    <td></td>
                    <td>{item?.batch_id}</td>
                    <td>{item?.quantity}</td>
                    <td>{item?.expiration_date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </td>
      </>
    );
  };
  return (
    <Paper radius={8}>
      <LoadingOverlay visible={loading} />
      <Stack>
        <Group position="apart">
          <Title order={3}>Line Items</Title>
        </Group>
        <div className={classes.tabPanelTableContainer}>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th></th>
                <th>GTIN</th>
                <th>SKU</th>
                <th>Description</th>
                <th style={{ width: 220 }}>Quantity</th>
                <th>Inventory Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{rows()}</tbody>
          </Table>
        </div>
      </Stack>
    </Paper>
  );
};
