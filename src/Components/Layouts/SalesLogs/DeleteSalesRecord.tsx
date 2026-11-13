import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Trash } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import { saleTransactionRemove } from "../../../GraphQL/RecordSalesSchema";
import { Button, Group, Modal } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { useViewportSize } from "@mantine/hooks";
import { isTabletMobileView } from "../../../Utilities/Formatter";

type Props = {
  details: WMS.SaleTransaction | undefined;
  onRemoveRecord: (id: string) => void;
  disabled: boolean;
};

export const DeleteSalesRecord = (props: Props) => {
  const { height, width } = useViewportSize();
  const [visible, setVisible] = useState(false);
  const [deleteRecordSale, { loading: loading }] = useMutation(
    saleTransactionRemove,
    { context: { clientName: "warehouse" } },
  );

  const onDeleteRecord = () => {
    deleteRecordSale({
      variables: {
        transaction_id: props.details?.transaction_id,
      },
    })
      .then((res) => {
        props.onRemoveRecord(`${props.details?.transaction_id}`);
        Notification.success({ message: "Record deleted" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  return (
    <>
      <Modal
        title={"Delete"}
        onClose={() => setVisible(false)}
        centered
        opened={visible}
      >
        <div>
          <p>Are you sure you want to delete?</p>
          <Group position="right">
            <Button
              loading={loading}
              customType="secondary"
              onClick={() => setVisible(false)}
            >
              Cancel
            </Button>
            <Button
              customType="danger"
              disabled={props.disabled}
              loading={loading}
              onClick={() => onDeleteRecord()}
            >
              Yes, delete
            </Button>
          </Group>
        </div>
      </Modal>
      <Button
        fullWidth={width <= isTabletMobileView}
        disabled={props.disabled}
        loading={loading}
        customType="danger"
        onClick={() => setVisible(!visible)}
        icon={<Trash />}
      >
        Delete
      </Button>
    </>
  );
};
