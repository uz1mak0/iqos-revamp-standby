import React, { useState } from "react";
import { useStyles } from "../../Layouts/Inventory/Inventory.styles";
import { Card, Pagination, Table, ScrollArea } from "../../Elements";
import { useQuery } from "@apollo/client";
import { getVouchers } from "../../../GraphQL/InventorySchema";
import { WMS } from "../../../GraphQL";
import { usePagination } from "@mantine/hooks";

export const VouchersTab = () => {
  const [filter, setFilter] = useState("ALL");
  const { classes } = useStyles();
  const voucherInputs = (inputs: object) => {
    return {
      context: {
        clientName: "warehouse",
      },
      variables: {
        ...inputs,
        warehouse_id: "RS50",
        type: "LVC",
      },
    };
  };
  const { data: availableVouchers } = useQuery<{
    voucherInventoryItems: WMS.InventoryItemConnection;
  }>(getVouchers, voucherInputs({ status: "AVAILABLE" }));
  const { data: releasedVouchers } = useQuery<{
    voucherInventoryItems: WMS.InventoryItemConnection;
  }>(getVouchers, voucherInputs({ status: "RELEASED" }));
  const { data: redeemedVouchers } = useQuery<{
    voucherInventoryItems: WMS.InventoryItemConnection;
  }>(getVouchers, voucherInputs({ status: "REDEEMED" }));

  const formatVoucherList = () => {
    const available = availableVouchers?.voucherInventoryItems?.items || [];
    const released = releasedVouchers?.voucherInventoryItems?.items || [];
    const redeemed = redeemedVouchers?.voucherInventoryItems?.items || [];
    switch (filter) {
      case "ALL":
        return [...available, ...released, ...redeemed];
      case "REDEEMED":
        return redeemed;
      case "AVAILABLE":
        return available;
      case "RELEASED":
        return released;
      default:
        return [];
    }
  };
  const pagination = usePagination({
    total: formatVoucherList().length,
    initialPage: 1,
  });

  const getTotalVoucherCount = (status: String) => {
    const available = availableVouchers?.voucherInventoryItems?.items || [];
    const released = releasedVouchers?.voucherInventoryItems?.items || [];
    const redeemed = redeemedVouchers?.voucherInventoryItems?.items || [];
    switch (status) {
      case "ALL":
        return [...available, ...released, ...redeemed].length || 0;
      case "REDEEMED":
        return redeemed.length;
      case "AVAILABLE":
        return available.length;
      case "RELEASED":
        return released.length;
      default:
        return 0;
    }
  };

  const rows = () => {
    return formatVoucherList()
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      .map((element, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td>{element?.serial}</td>
            <td>{element?.lead_id}</td>
            <td>{element?.item_status}</td>
            <td>{element?.batch_id}</td>
          </tr>
        </React.Fragment>
      ));
  };
  const updateFilter = (status: string) => {
    setFilter(status);
    pagination.setPage(1);
  };

  return (
    <div className={classes.tabPanelContainer}>
      <div className={classes.statusContainer}>
        <Card
          background="#808080"
          title="ALL"
          number={getTotalVoucherCount("ALL")}
          isSelected={filter == "ALL"}
          onClick={() => {
            updateFilter("ALL");
          }}
        />
        <Card
          background="#FD9710"
          title="AVAILABLE"
          number={getTotalVoucherCount("AVAILABLE")}
          isSelected={filter == "AVAILABLE"}
          onClick={() => {
            updateFilter("AVAILABLE");
          }}
        />
        <Card
          background="#61B765"
          title="RELEASED"
          number={getTotalVoucherCount("RELEASED")}
          isSelected={filter == "RELEASED"}
          onClick={() => updateFilter("RELEASED")}
        />
        <Card
          background="#063970"
          title="REDEEMED"
          number={getTotalVoucherCount("REDEEMED")}
          isSelected={filter == "REDEEMED"}
          onClick={() => updateFilter("REDEEMED")}
        />
      </div>
      <ScrollArea style={{ height: 700 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Lead ID</th>
              <th>Status</th>
              <th>Batch ID</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </ScrollArea>
      <br />
      <Pagination
        position="center"
        total={Math.ceil((formatVoucherList()?.length || 0) / 100)}
        page={pagination.active}
        onChange={pagination.setPage}
      />
    </div>
  );
};
