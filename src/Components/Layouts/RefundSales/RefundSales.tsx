import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { WMS } from "../../../GraphQL";
import { refundRecordSale } from "../../../GraphQL/RecordSalesSchema";
import {
  Accordion,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  TextArea,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { RefundSalesItems } from "./RefundSalesItems";
import { useDebouncedState } from "@mantine/hooks";

type Props = {
  sales: WMS.SaleTransaction | undefined;
  onCancel: () => void;
  onRefund: (id: string) => void;
  user: string | undefined;
};

const RefundSales = (props: Props) => {
  const [refundSale, { loading: loading }] = useMutation(refundRecordSale, {
    context: { clientName: "warehouse" },
  });
  const [refundList, setRefundList] = useState<WMS.Maybe<WMS.LineItem>[]>([]);
  const [remarks, setRemarks] = useDebouncedState<string | undefined>(
    undefined,
    200,
  );
  const [notes, setNotes] = useDebouncedState<string | undefined>(
    undefined,
    200,
  );

  /**
   * The function performs a refund transaction for a sales order with the given input parameters and
   * displays success or error notifications.
   * @returns The function `onRefund` is not returning anything. It is executing a series of actions
   * and making a GraphQL mutation call.
   */
  const onRefund = () => {
    if (!remarks || remarks.length < 1)
      return Notification.error({ message: "Please add remarks" });
    const input: WMS.RefundTransactionInput = {
      created_by: props.user,
      transaction_no: props.sales?.transaction_no,
      warehouse_id: props.sales?.warehouse_id,
      remarks: remarks,
      customer_information: {
        last_name: props.sales?.customer_information?.last_name,
        first_name: props.sales?.customer_information?.first_name,
        email: props.sales?.customer_information?.email,
      },
      items: refundList?.map((item) => {
        return {
          gtin: `${item?.sku?.gtin}`,
          quantity: item?.quantity,
          serials: item?.serials,
          inputs: item?.inputs,
          sku: {
            sku: `${item?.sku?.sku}`,
            name: item?.sku?.name,
            description: item?.sku?.description,
            unit_of_measure: item?.sku?.unit_of_measure,
            type: item?.sku?.type,
            price_gross: item?.sku?.price_gross,
            price: item?.price,
            gtin: item?.sku?.gtin || "",
            channel: item?.sku?.channel,
            promo: {
              code: item?.sku?.promo?.code,
              discount: item?.sku?.promo?.discount,
              name: item?.sku?.promo?.name,
              discount_type: item?.sku?.promo?.discount_type,
            },
          },
          price: item?.price,
          discount: item?.discount,
          promo: item?.promo,
          promo_type: item?.promo_type,
          promo_discount: item?.promo_discount,
        };
      }),
      transaction_id: `${props.sales?.transaction_id}`,
    };
    refundSale({
      variables: {
        input: input,
      },
    })
      .then((res) => {
        Notification.success({ message: "Sales Refunded" });
        props.onRefund(`${props.sales?.transaction_id}`);
        onCancel();
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  /**
   * The function updates a list of selected items for refund based on whether an item is selected or
   * deselected.
   * @param {boolean} selected - A boolean value indicating whether the item has been selected or
   * deselected.
   * @param item - The `item` parameter is of type `WMS.Maybe<WMS.LineItem>`, which means it can either
   * be a `LineItem` object or `null`/`undefined`. It represents the line item that was selected or
   * deselected by the user.
   */
  const onSelectItems = (selected: boolean, item: WMS.Maybe<WMS.LineItem>) => {
    const list = [...refundList];
    if (selected) {
      list.push(item);
      setRefundList(list);
    } else {
      if (item?.sku?.type === WMS.SkuType.Devices) {
        setRefundList(list.filter((e) => e?.serials !== item?.serials));
      } else {
        setRefundList(list.filter((e) => e?.sku?.gtin !== item?.sku?.gtin));
      }
    }
  };

  const onCancel = () => {
    props.onCancel();
    setRefundList([]);
  };

  return (
    <div>
      <Accordion variant="separated">
        <Accordion.Item value="details">
          <Accordion.Control>View sales details</Accordion.Control>
          <Accordion.Panel>
            <Paper radius={8}>
              <Group position="apart">
                <h4>{props.sales?.id}</h4>
              </Group>
              <Divider />
              <Grid>
                <Grid.Col span={4}>
                  <p>Invoice ID: {props.sales?.transaction_no}</p>
                  <p>Sales Expert: {props.sales?.sales_expert}</p>
                  <p>
                    First Name: {props.sales?.customer_information?.first_name}
                  </p>
                </Grid.Col>
                <Grid.Col span={4}>
                  <p>
                    Underwent Guided Trial:{" "}
                    {props.sales?.underwent_guided_trial ? "Yes" : "No"}
                  </p>
                  <p>Payment Type: {props.sales?.payment_type}</p>
                  <p>
                    Last Name: {props.sales?.customer_information?.last_name}
                  </p>
                </Grid.Col>
                <Grid.Col span={4}>
                  <p>Remarks: {props.sales?.remarks}</p>
                </Grid.Col>
              </Grid>
            </Paper>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <br />

      <Stack>
        <RefundSalesItems
          onSelect={onSelectItems}
          items={props?.sales?.items || []}
        />
        {/* <TextArea
          onChange={(e) => setNotes(e.target.value)}
          description=" Notes"
          placeholder="Enter notes"
        /> */}
        <TextArea
          onChange={(e) => setRemarks(e.target.value)}
          description="Remarks"
          placeholder="Enter Remarks"
        />
      </Stack>

      <br />
      <Group position="center">
        <Button
          loading={loading}
          onClick={() => onCancel()}
          customType="secondary"
        >
          Cancel
        </Button>
        <Button
          customType="primary"
          disabled={refundList.length <= 0}
          loading={loading}
          onClick={() => onRefund()}
        >
          Refund
        </Button>
      </Group>
    </div>
  );
};

export default RefundSales;
