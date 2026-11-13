import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Table,
  TextArea,
} from "../../../Elements";
import { Plus } from "tabler-icons-react";
import { SalesScanner } from "../../SalesLogs/SalesScanner";
import { WMS } from "../../../../GraphQL";
import { getSalesTransaction } from "../../../../GraphQL/RecordSalesSchema";
import { useLazyQuery } from "@apollo/client";
import { Maybe } from "../../../../GraphQL/_gql/wms/graphql";
import Notification from "../../../Elements/Notification/Notification";
import IndirectLendingOrderDetails from "../List/IndirectLendingOrderDetails";

type Props = {
  scannedDevice?: WMS.InventoryItem | undefined;
  hideButton?: boolean;
};
export const IndirectReturnCreate = ({ scannedDevice, hideButton }: Props) => {
  const [opened, setOpened] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<WMS.SaleTransaction>();
  const [device, setDevice] = useState<WMS.InventoryItem>();
  const [queryRecordSale, { loading: loadingRecordSale }] = useLazyQuery(
    getSalesTransaction,
    { context: { clientName: "warehouse" }, fetchPolicy: "no-cache" }
  );

  useEffect(() => {
    if (scannedDevice) {
      setDevice(scannedDevice);
      getOrderDetails(scannedDevice);
    }
  }, [scannedDevice]);

  const getOrderDetails = (item: WMS.InventoryItem) => {
    if (!item.order_id)
      return Notification.error({
        message: `Order not found`,
      });
    queryRecordSale({
      variables: {
        id: item.order_id,
      },
    }).then((res) => {
      const order: WMS.SaleTransaction = res.data.saleTransaction;
      if (order.type === "LENDING") {
        setOpened(true);
        setSelectedLogs(res.data.saleTransaction);
        setDevice(item);
      } else {
        Notification.error({ message: "Only Lending order can be returned" });
      }
    });
  };

  const onClose = () => {
    setDevice(undefined);
    setOpened(false);
    setSelectedLogs(undefined);
  };

  const onScanDevice = (device: WMS.InventoryItem) => {
    getOrderDetails(device);
  };

  return (
    <div>
      <Modal
        opened={opened}
        onClose={() => onClose()}
        centered
        size={!device ? 600 : 1200}
        title="Create Lending Return"
      >
        {!device ? (
          <SalesScanner onScan={onScanDevice} />
        ) : (
          <IndirectLendingOrderDetails
            isReturn={true}
            order={selectedLogs}
            onClose={onClose}
          />
        )}
      </Modal>
      {!hideButton && (
        <Button
          onClick={() => setOpened(true)}
          customType="secondary"
          icon={<Plus />}
        >
          Lending Return
        </Button>
      )}
    </div>
  );
};
