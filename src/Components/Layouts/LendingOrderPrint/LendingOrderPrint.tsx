import { useMutation } from "@apollo/client";
import React from "react";
import { Printer } from "tabler-icons-react";
import { ORDER } from "../../../GraphQL";
import { generatePDF } from "../../../GraphQL/OrderManagementSchema";
import { Button, Group, Paper } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

type Props = {
  order: ORDER.Order;
};

export const LendingOrderPrint = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [generateLendingOrderPrint, { loading: loadingPDF }] = useMutation(
    generatePDF,
    { context: { clientName: "order" } }
  );

  const accessRole = () => {
    if (
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isEcomAdmin ||
      userRoles.isAdministratorEC ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isPacker ||
      userRoles.isDispatcher
    ) {
      return false;
    } else {
      return true;
    }
  };

  const onPrint = () => {
    generateLendingOrderPrint({
      variables: {
        type: "LENDING",
        order_id: props.order.id,
      },
    })
      .then((res) => {
        window.open(res.data.generatePDF, "_blank");
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };
  return (
    <Paper>
      <Group position="right">
        <Button
          disabled={accessRole()}
          loading={loadingPDF}
          icon={<Printer />}
          onClick={() => onPrint()}
        >
          LENDING ORDER PRINT
        </Button>
      </Group>
    </Paper>
  );
};
