import React, { useState } from "react";
import {
  Accordion,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Table,
} from "../../../Elements";
import { WMS } from "../../../../GraphQL";
import Notification from "../../../Elements/Notification/Notification";
import { useMutation } from "@apollo/client";
import { createDCLendingReturnOrder } from "../../../../GraphQL/RecordSalesSchema";
import { channelAtom, rolesAtom } from "../../../../Store/StoreAtom";
import { useAtom } from "jotai";

type Props = {
  order: WMS.SaleTransaction | undefined;
  isReturn?: boolean;
  onClose: () => void;
};

const IndirectLendingOrderDetails = ({ order, onClose, isReturn }: Props) => {
  const [channel] = useAtom(channelAtom);
  const [returnItem, setReturnItem] =
    useState<string | undefined | null>(undefined);
  const [fromLendingToReturn, setFromLendingToReturn] = useState(false);

  const [onCreateDCLendingReturn, { loading: loadingCreateReturn }] =
    useMutation(createDCLendingReturnOrder, {
      context: { clientName: "warehouse" },
    });

  const onCheckDevice = (checked: boolean, element: WMS.LineItem | null) => {
    if (checked) {
      setReturnItem(element?.serials?.length ? element.serials[0] : undefined);
    } else {
      setReturnItem(undefined);
    }
  };

  const onReturn = () => {
    onCreateDCLendingReturn({
      variables: {
        warehouse_id: order?.warehouse_id,
        serial: returnItem,
      },
    })
      .then((res) => {
        Notification.success({ message: `${returnItem} returned` });
        setReturnItem(undefined);
        onClose();
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onCancel = () => {
    setReturnItem(undefined);
    setFromLendingToReturn(false);
    onClose();
  };

  const rows = order?.items?.map((element, index) => (
    <tr key={`user-${index}`}>
      {(isReturn || fromLendingToReturn) && (
        <td>
          <Checkbox
            onChange={(values) => {
              onCheckDevice(values.target.checked, element);
            }}
            label=""
            disabled={element?.serials?.length === 0}
          />
        </td>
      )}
      <td>{element?.sku?.gtin}</td>
      <td>{element?.sku?.description}</td>
      <td>{element?.sku?.sku}</td>
      <td>{element?.quantity}</td>
      <td>{element?.price}</td>
      <td>{element?.serials?.length ? element.serials[0] : "-"}</td>
    </tr>
  ));
  return (
    <div>
      <Modal
        opened={!!order}
        centered
        onClose={onCancel}
        size={1300}
        title="Lending Order Details"
      >
        <LoadingOverlay visible={loadingCreateReturn} />
        <Accordion
          defaultValue={"order-details"}
          chevronPosition="left"
          variant="separated"
        >
          <Accordion.Item title="View Order Details" value="order-details">
            <Accordion.Control>View Order Details</Accordion.Control>
            <Accordion.Panel>
              <Paper radius={15}>
                <Group position="apart">
                  View Order Details
                  {!fromLendingToReturn && (
                    <Button onClick={() => setFromLendingToReturn(true)}>
                      Return
                    </Button>
                  )}
                </Group>
                <p>Order ID: {order?.transaction_no}</p>
                <p>Remarks: {order?.remarks}</p>
              </Paper>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Table captionSide="bottom" highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              {(isReturn || fromLendingToReturn) && <th></th>}
              <th>GTIN</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Serial</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        {(isReturn || fromLendingToReturn) && (
          <Group position="center">
            <Button
              onClick={() => {
                onCancel();
              }}
              customType="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onReturn()}
              customType="primary"
              disabled={!returnItem}
            >
              Return
            </Button>
          </Group>
        )}
      </Modal>
    </div>
  );
};

export default IndirectLendingOrderDetails;
