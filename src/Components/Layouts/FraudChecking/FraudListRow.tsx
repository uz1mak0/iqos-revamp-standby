import React, { useState } from "react";
import { ORDER } from "../../../GraphQL";
import {
  formatCustomerAddress,
  formatCustomerName,
} from "../../../Utilities/Formatter";
import dayjs from "dayjs";
import { Maybe } from "graphql/jsutils/Maybe";
import { useStyles } from "./FraudChecking.styles";
import { useRouter } from "next/router";
import { Button, Text } from "../../Elements";
import { Pagination } from "@mantine/core";

type Props = {
  list: ORDER.Order[];
};

const ITEMS_PER_PAGE = 50;

export const FraudListRow = ({ list }: Props) => {
  const { classes } = useStyles();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const currentItems = list.slice(start, end);

  const getSKUtypeTotal = (
    items: Maybe<Maybe<ORDER.OrderItem>[]> | undefined,
    type: string
  ) =>
    items
      ?.filter((o) => {
        if (!o?.sku) return false;
        if (type === "HEETs") return o.sku.includes("ME");
        if (type === "KITS") return o.sku.includes("DK");
        if (type === "ZYN") return o.sku.includes("MN");
        return false;
      })
      .reduce((acc, curr) => acc + (curr?.quantity || 0), 0) || 0;

  return (
    <>
      {currentItems.map((element, index) => (
        <tr key={`order-${index}`}>
          <td>{element?.verification_status || "UNVERIFIED"}</td>
          <td>
            <Button
              onClick={() =>
                router.push(
                  `/order-management/order-details/orderID/?orderID=${element?.id}`
                )
              }
            >
              {element?.id || "N/A"}
            </Button>
          </td>
          <td>
            <div className={classes.preWrapTextMD}>
              {formatCustomerName(element?.shipping_address)}
            </div>
          </td>
          <td>
            <div className={classes.preWrapTextMD}>
              {element.shipping_address?.telephone_number}
            </div>
          </td>
          <td>
            <div className={classes.preWrapText}>
              <Text size="xs">
                {formatCustomerAddress(element?.shipping_address)}
              </Text>
            </div>
          </td>
          <td>
            <div className={classes.preWrapTextSM}>
              <Text size={12}>
                {dayjs(Number(element?.date_created)).format("MMM-DD-YYYY")}
              </Text>
            </div>
          </td>
          <td>
            {element?.promo && (
              <div className={classes.preWrapTextSM}>
                <Text size={10}>Promo: {element.promo.description}</Text>
              </div>
            )}
          </td>
          <td>{getSKUtypeTotal(element?.items, "KITS")}</td>
          <td>{getSKUtypeTotal(element?.items, "HEETs")}</td>
          <td>{getSKUtypeTotal(element?.items, "ZYN")}</td>
          <td>{element.order_status}</td>
        </tr>
      ))}

      {list.length > ITEMS_PER_PAGE && (
        <tr>
          <td colSpan={11}>
            <div style={{ display: "flex", justifyContent: "center", padding: "1rem 0" }}>
              <Pagination
                page={page}
                onChange={setPage}
                total={Math.ceil(list.length / ITEMS_PER_PAGE)}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
