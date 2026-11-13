import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { X } from "tabler-icons-react";
import { ORDER, WMS } from "../../../GraphQL";
import { pulloutReplacementCancel } from "../../../GraphQL/OrderManagementSchema";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { rolesAtom } from "../../../Store/StoreAtom";
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Table,
  TextArea,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  opened: boolean;
  onClose: () => void;
  pullout?: ORDER.ReplacementOrder;
  onSubmit: () => void;
};

export const Details = (props: Props) => {
  const [isCancel, setIsCancel] = useState(false);
  const [user] = useAtom(rolesAtom);
  const { data: dataSKU, refetch: refetchSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });
  const [pullOutReplacementCancel, { loading: loadingCancel }] = useMutation(
    pulloutReplacementCancel,
    { context: { clientName: "order" } }
  );
  const [remarks, setRemarks] = useState<string | undefined>(undefined);

  const onCancelReplacement = () => {
    if (!remarks || remarks === "")
      return Notification.error({ message: "Please add remarks!" });
    const input = {
      order_id: props?.pullout?.id,
      serials: props?.pullout?.serials,
      remarks: remarks,
      items: props?.pullout?.items?.map(
        (item: ORDER.Maybe<ORDER.Maybe<ORDER.PulloutReplacementItem>>) => {
          return {
            gtin: item?.gtin,
            serials: item?.serials,
            quantity: item?.quantity,
          };
        }
      ),
    };
    pullOutReplacementCancel({
      variables: {
        input: input,
      },
    })
      .then(() => {
        Notification.success({ message: "Replacement order cancelled" });
        props.onSubmit();
        onClose();
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const accessRole = () => {
    if (
      user.isPacker ||
      user.isEcomAdmin ||
      user.isAdministratorEC ||
      //old roles
      user.isAdmin ||
      user.isPacker
    ) {
      return false;
    } else {
      return true;
    }
  };

  const rows = () => {
    return props?.pullout?.items?.map(
      (element: ORDER.Maybe<ORDER.PulloutReplacementItem>, index: number) => (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td>{element?.gtin}</td>
            <td>{element?.serials?.toString()}</td>
            <td>
              {
                dataSKU.skus?.items?.find(
                  (e: WMS.InventoryItem) => e.gtin === element?.gtin
                )?.description
              }
            </td>
            <td>{element?.quantity}</td>
          </tr>
        </React.Fragment>
      )
    );
  };

  const serialRows = () => {
    return [{ ...props?.pullout }]?.map(
      (element: ORDER.ReplacementOrder, index: number) => (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td>{`${element?.customer?.first_name} ${element?.customer?.last_name}`}</td>
            <td>
              {dayjs(Number(element.date_created)).format(
                "MMM DD, YYYY hh:mm A"
              )}
            </td>
            <td>
              {element.items != null
                ? "click to view items"
                : element.serials?.join(", ")}
            </td>
            <td>{element?.serials?.length}</td>
          </tr>
        </React.Fragment>
      )
    );
  };

  const onClose = () => {
    setIsCancel(false);
    setRemarks(undefined);
    props.onClose();
  };

  return (
    <div>
      <Modal
        centered
        title={isCancel ? "Cancel Replacement" : "Details"}
        size={1000}
        onClose={onClose}
        opened={props.opened}
      >
        <LoadingOverlay visible={loadingCancel} />
        {isCancel ? (
          <>
            <p>Are you sure you want to cancel this replacement?</p>
            <TextArea
              onChange={(e) => setRemarks(e?.target?.value)}
              label="Remarks"
              placeholder="Please add remarks"
              minRows={5}
            />
            <br />
            <Group position="center">
              <Button customType="secondary">Cancel</Button>
              <Button
                disabled={accessRole()}
                onClick={() => onCancelReplacement()}
                customType="primary"
              >
                Save
              </Button>
            </Group>
          </>
        ) : (
          <>
            <Group position="right">
              {props.pullout?.status === "CANCELLED" ? undefined : (
                <Button
                  disabled={accessRole()}
                  onClick={() => setIsCancel(true)}
                  icon={<X />}
                  customType="danger"
                >
                  Cancel
                </Button>
              )}
            </Group>
            {!props?.pullout?.serials ? (
              <Table highlightOnHover fontSize={"md"}>
                <thead>
                  <tr>
                    <th>GTIN</th>
                    <th>serial</th>
                    <th>Description</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>{rows()}</tbody>
              </Table>
            ) : (
              <Table highlightOnHover fontSize={"md"}>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Date of Pullout</th>
                    <th>Serials</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>{serialRows()}</tbody>
              </Table>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};
