import React from "react";
import {
  Paper,
  ScrollArea,
  SimpleGrid,
  Table,
  Button,
  ActionIcon,
  Group,
  Badge,
} from "../../Elements";
import { LoadingOverlay, Switch } from "@mantine/core";
import { useStyles } from "./Inventory.styles";
import router from "next/router";
import { WMS } from "../../../GraphQL";
import { updateWarehouse } from "../../../GraphQL/InventorySchema";
import { useMutation } from "@apollo/client";
import { Edit, User } from "tabler-icons-react";
import { WarehouseChangeStatus } from "./ChangeStatus";
import { useAtom } from "jotai";
import { rolesAtom, userAtom } from "../../../Store/StoreAtom";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  warehouses: WMS.Warehouse[];
  listType?: string;
};

export const List = (props: Props) => {
  const [roles] = useAtom(rolesAtom);
  const [user] = useAtom(userAtom);

  const { classes } = useStyles();
  const [selectedWarehouse, setSelectedWarehouse] =
    React.useState<WMS.Warehouse | undefined>(undefined);

  const [mutateStatus, { loading: updating }] = useMutation(updateWarehouse, {
    context: { clientName: "warehouse" },
  });

  const handleConfirmStatusChange = (wh: WMS.Warehouse) => {
    mutateStatus({
      variables: {
        input: {
          id: wh.id,
          status: !wh.status,
        },
      },
      optimisticResponse: {
        warehouseUpdate: {
          __typename: "Warehouse",
          id: wh.id,
          status: !wh.status,
        },
      },
    });

    setSelectedWarehouse(undefined);
  };

  const statusLabel = (wh: WMS.Warehouse) => {
    if (user.username == "Administrator" || roles.isFullAdmin) {
      const canOpenWarehouse = !roles.isSupplyChainFullAdmin;
      return (
        <Group>
          <Switch
            disabled={user.username == "Administrator" ? false : true}
            onLabel="Active"
            offLabel="Inactive"
            size="lg"
            checked={wh.status === true}
            onChange={() => {
              if (user.username == "Administrator") {
                setSelectedWarehouse(wh);
              } else {
                Notification.error({ message: "Invalid Access" });
              }
            }}
            styles={{
              trackLabel: { width: 50 },
              track:
                wh.status !== true
                  ? {
                      border: "#F03E3E solid",
                      backgroundColor: "#F03E3E",
                      color: "white",
                    }
                  : {
                      border: "green solid",
                      backgroundColor: "green",
                      color: "white",
                    },
            }}
            color="green"
          />
          {canOpenWarehouse ? (
            <ActionIcon
              variant="default"
              onClick={() =>
                router.push(`/inventory/warehouse?warehouse=${wh.id}`)
              }
            >
              <Edit size={20} />
            </ActionIcon>
          ) : null}
        </Group>
      );
    } else {
      return wh.status === true ? (
        <Group>
          <Badge color="green" variant="light">
            Active
          </Badge>

          <ActionIcon
            variant="default"
            onClick={() =>
              router.push(`/inventory/warehouse?warehouse=${wh.id}`)
            }
          >
            <Edit size={20} />
          </ActionIcon>
        </Group>
      ) : (
        <Group>
          <Badge color="red" variant="light">
            Inactive
          </Badge>
          <ActionIcon
            variant="default"
            onClick={() =>
              router.push(`/inventory/warehouse?warehouse=${wh.id}`)
            }
          >
            <Edit size={20} />
          </ActionIcon>
        </Group>
      );
    }
  };

  const rows = props.warehouses?.map((wh: WMS.Warehouse, index: number) => (
    <tr key={`list-${index}`}>
      <td>{wh.name}</td>
      <td>{wh.type}</td>
      <td>{wh.area}</td>
      <td>{wh.id}</td>
      <td>{statusLabel(wh)}</td>
    </tr>
  ));

  return (
    <div>
      <WarehouseChangeStatus
        isActive={selectedWarehouse?.status === true}
        selectedWarehouse={selectedWarehouse}
        onClose={() => setSelectedWarehouse(undefined)}
        onChangeStatus={handleConfirmStatusChange}
      />

      {props.listType === "card" ? (
        <SimpleGrid
          verticalSpacing={"md"}
          cols={5}
          spacing="xs"
          breakpoints={[
            { maxWidth: 1650, cols: 4, spacing: "md" },
            { maxWidth: 1400, cols: 4, spacing: "xs" },
            { maxWidth: 1340, cols: 3, spacing: "xs" },
            { maxWidth: 1100, cols: 2, spacing: "sm" },
            { maxWidth: 600, cols: 1, spacing: "xs" },
          ]}
        >
          {props.warehouses?.map((wh: WMS.Warehouse, i: number) => (
            <Paper
              radius={8}
              // onClick={() =>
              //   router.push(`/inventory/warehouse?warehouse=${wh.id}`)
              // }
              key={`${wh.id}_${i}`}
              height={230}
              width={250}
            >
              <p className={classes.listHeaderText}>{wh.name}</p>
              <p className={classes.listText}>Type: {wh.type}</p>
              <p className={classes.listText}>Area: {wh.area}</p>
              <p className={classes.listText}>ID: {wh.id}</p>
              <p className={classes.listText}>
                <Group>
                  {user.username == "Administrator" ? undefined : "Status: "}{" "}
                  {statusLabel(wh)}
                </Group>
              </p>
            </Paper>
          ))}
        </SimpleGrid>
      ) : (
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Warehouse Name</th>
              <th>type</th>
              <th>Area</th>
              <th>ID</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )}
    </div>
  );
};
