import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ChevronDown } from "tabler-icons-react";
import {
  Button,
  Grid,
  LoadingOverlay,
  Menu,
  Modal,
  Stack,
} from "../../Elements";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import {
  createPullOut,
  createReconcile,
  createReturn,
  createTransfer,
  createTransmittal,
  createDirectTransfer,
  getActivations,
  updatePullout,
  updateReturn,
  updateTransfer,
  updateDirectTransfer,
  createUOMConversion,
} from "../../../GraphQL/TransactionSchema";
import { WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom } from "../../../Store/StoreAtom";
import {
  hasCreateTransactionAccess,
  hasReconcileAccess,
} from "../../../Utilities/AccessRoles";

type CreateTransactionProps = {
  status?: boolean;
};

export const CreateTransaction = ({
  status = true,
}: CreateTransactionProps) => {
  const router = useRouter();
  const [user] = useAtom(rolesAtom);
  const [channel] = useAtom(channelAtom);
  const [showModal, setShowModal] = useState<string | undefined>(undefined);
  const [showUOMModal, setShowUOMModal] = useState<boolean>(false);
  const [transmittalCreate, { loading: loadingTransmittal }] = useMutation(
    createTransmittal,
    { context: { clientName: "warehouse" } },
  );
  const [pulloutCreate] = useMutation(createPullOut, {
    context: { clientName: "warehouse" },
  });
  const [pulloutUpdate, { loading: loadingPullout }] = useMutation(
    updatePullout,
    { context: { clientName: "warehouse" } },
  );
  const [returnCreate] = useMutation(createReturn, {
    context: { clientName: "warehouse" },
  });
  const [returnUpdate, { loading: loadingReturn }] = useMutation(updateReturn, {
    context: { clientName: "warehouse" },
  });
  const [transferCreate] = useMutation(createTransfer, {
    context: { clientName: "warehouse" },
  });
  const [transferUpdate, { loading: loadingTransfer }] = useMutation(
    updateTransfer,
    { context: { clientName: "warehouse" } },
  );
  const [reconcileCreate, { loading: loadingReconcile }] = useMutation(
    createReconcile,
    { context: { clientName: "warehouse" } },
  );
  const [directTransferCreate] = useMutation(createDirectTransfer, {
    context: { clientName: "warehouse" },
  });
  const [directTransferUpdate, { loading: loadingDirectTransfer }] =
    useMutation(updateDirectTransfer, { context: { clientName: "warehouse" } });
  const { data: dataWarehouse } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: channel },
  });

  const [conversioUOMCreate] = useMutation(createUOMConversion, {
    context: { clientName: "warehouse" },
  });

  const { data: dataDRWarehouse } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "DIRECT_RETAIL" },
  });

  const { data: dataEcomWarehouse } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });

  const { data: dataICWarehouse } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "INDIRECT_CHANNEL" },
  });

  const { data: dataActivations } = useQuery(getActivations, {
    context: { clientName: "retail" },
  });

  const onSelectTransaction = (type: string, subType: string | undefined) => {
    switch (type) {
      case "TRANSMITTAL":
        onTransmittal();
        break;
      case "PULLOUT":
        onPullOut(subType);
        break;
      case "RETURN":
        onReturn(subType);
        break;
      case "TRANSFER":
        onTransfer(subType);
        break;
      case "RECONCILE":
        onReconcile();
        break;
      case "UOM":
        setShowUOMModal(true);
        break;
      default:
        break;
    }
  };

  const onConvertUOM = (type: String) => {
    conversioUOMCreate({
      variables: {
        id: `CONVERSION_${dayjs().unix()}`,
        input: {
          time: dayjs().format("HH:mm"),
          date: dayjs().format("YYYY-MM-DD"),
          warehouse_id: router.query.warehouse,
        },
      },
    }).then((res) => {
      router.push(
        `/inventory/warehouse/transaction/?transactionId=${res?.data?.conversionCreate?.id}&warehouse=${router.query.warehouse}&transaction=conversion&conversionType=${type}`,
      );
    });
  };

  const onReconcile = () => {
    reconcileCreate({
      variables: {
        id: `RECONCILE_${dayjs().valueOf()}`,
        input: {
          time: dayjs().format("HH:mm"),
          date: dayjs().format("YYYY-MM-DD"),
          warehouse_id: router.query.warehouse,
        },
      },
    }).then((res) => {
      router.push(
        `/inventory/warehouse/transaction/?transactionId=${res?.data?.reconCreate?.id}&warehouse=${router.query.warehouse}&transaction=reconcile`,
      );
    });
  };

  const onTransfer = (type: string | undefined) => {
    if (type == "ECOMM_TO_RETAIL" || type == "RETAIL_TO_ECOMM") {
      directTransferCreate({
        variables: {
          id: `DIRECT_TRANSFER_${dayjs().valueOf()}`,
          input: {
            warehouse_id: router.query.warehouse,
            transfer_type: type,
          },
        },
      }).then((res) => {
        const destination = dataDRWarehouse?.warehouses?.items.filter(
          (e: WMS.Warehouse) => e.id !== router.query.warehouse,
        )[0]?.id;
        directTransferUpdate({
          variables: {
            input: {
              id: res.data?.directTransferCreate.id,
              to_warehouse_id: destination,
            },
          },
        }).then(() => {
          router.push(
            `/inventory/warehouse/transaction/?transactionId=${res?.data?.directTransferCreate?.id}&warehouse=${router.query.warehouse}&transaction=direct_transfer`,
          );
        });
      });
    } else if (
      type == "ECOMM_TO_INDIRECT" ||
      type == "RETAIL_TO_IC" ||
      type == "IC_TO_ECOMM"
    ) {
      directTransferCreate({
        variables: {
          id: `INDIRECT_TRANSFER_${dayjs().valueOf()}`,
          input: {
            warehouse_id: router.query.warehouse,
            transfer_type: type,
          },
        },
      }).then((res) => {
        const destination = dataICWarehouse?.warehouses?.items.filter(
          (e: WMS.Warehouse) => e.id !== router.query.warehouse,
        )[0]?.id;
        directTransferUpdate({
          variables: {
            input: {
              id: res.data?.directTransferCreate.id,
              to_warehouse_id: destination,
            },
          },
        }).then(() => {
          router.push(
            `/inventory/warehouse/transaction/?transactionId=${res?.data?.directTransferCreate?.id}&warehouse=${router.query.warehouse}&transaction=indirect_transfer`,
          );
        });
      });
    } else if (
      type == "ECOMM" ||
      type == "DIRECT_RETAIL" ||
      type == "INDIRECT_CHANNEL"
    ) {
      transferCreate({
        variables: {
          id: `TRANSFER_${dayjs().valueOf()}`,
          input: {
            warehouse_id: router.query.warehouse,
          },
        },
      }).then((res) => {
        transferUpdate({
          variables: {
            input: {
              id: res.data?.transferCreate.id,
              to_warehouse_id: dataWarehouse?.warehouses?.items.filter(
                (e: WMS.Warehouse) => e.id !== router.query.warehouse,
              )[0]?.id,
            },
          },
        }).then(() => {
          router.push(
            `/inventory/warehouse/transaction/?transactionId=${res?.data?.transferCreate?.id}&warehouse=${router.query.warehouse}&transaction=transfer`,
          );
        });
      });
    }
  };

  const onReturn = (type: string | undefined) => {
    returnCreate({
      variables: {
        id: `RETURN_${dayjs().valueOf()}`,
        input: {
          warehouse_id: router.query.warehouse,
          return_type: type,
        },
      },
    }).then((res) => {
      var input;
      switch (type) {
        case "Activation":
          input = {
            id: res?.data?.returnCreate?.id,
            return_from: `${dataActivations?.activations?.items[0]?.id}_${dataActivations?.activations.items[0]?.outlets[0]?.id}`,
          };
        case "ReturnInventory":
          input = {
            id: res?.data?.returnCreate?.id,
          };
          break;
        default:
          break;
      }
      returnUpdate({
        variables: {
          input: input,
        },
      }).then(() => {
        router.push(
          `/inventory/warehouse/transaction/?transactionId=${res?.data?.returnCreate?.id}&warehouse=${router.query.warehouse}&transaction=return`,
        );
      });
    });
  };

  const onPullOut = (type: string | undefined) => {
    pulloutCreate({
      variables: {
        id: `PULLOUT_${dayjs().valueOf()}`,
        input: {
          warehouse_id: router.query.warehouse,
          pullout_type: type,
        },
      },
    }).then((res) => {
      var input;
      switch (type) {
        case "Activation":
          input = {
            id: res?.data?.pulloutCreate?.id,
            pullout_to: `${dataActivations?.activations?.items[0]?.id}_${dataActivations?.activations.items[0]?.outlets[0]?.id}`,
          };
          break;
        case "ForSelling":
          input = {
            id: res?.data?.pulloutCreate?.id,
            pullout_to: dataWarehouse?.warehouses?.items?.filter(
              (e: WMS.Warehouse) => e.type === "STORE",
            )[0]?.id,
          };
          break;
        case "FreebiesSample":
        case "BadInventory":
          input = {
            id: res?.data?.pulloutCreate?.id,
          };
          break;
        default:
          break;
      }

      pulloutUpdate({
        variables: {
          input: input,
        },
      }).then(() => {
        router.push(
          `/inventory/warehouse/transaction/?transactionId=${res?.data?.pulloutCreate?.id}&warehouse=${router.query.warehouse}&transaction=pullout`,
        );
      });
    });
  };

  const onTransmittal = () => {
    transmittalCreate({
      variables: {
        id: `TRANSMITTAL_${dayjs().unix()}`,
        input: {
          time: dayjs().format("HH:mm"),
          date: dayjs().format("YYYY-MM-DD"),
          warehouse_id: router.query.warehouse,
        },
      },
    }).then((res) => {
      router.push(
        `/inventory/warehouse/transaction/?transactionId=${res?.data?.transmittalCreate?.id}&warehouse=${router.query.warehouse}&transaction=transmittal`,
      );
    });
  };

  const disable = () => {
    return (
      loadingTransmittal ||
      loadingPullout ||
      loadingReturn ||
      loadingTransfer ||
      loadingReconcile
    );
  };

  const modalContent = () => {
    switch (showModal) {
      case "PULLOUT":
        return (
          <>
            {/* <List.Item>Sales Expert/Coach</List.Item> */}
            {channel === "DIRECT_RETAIL" ||
            router.query.warehouse !== "RS50" ? undefined : (
              <Button
                loading={disable()}
                onClick={() => onSelectTransaction("PULLOUT", "Activation")}
              >
                Actvation
              </Button>
            )}
            <Button
              loading={disable()}
              onClick={() => onSelectTransaction("PULLOUT", "ForSelling")}
            >
              For Selling
            </Button>
            <Button
              loading={disable()}
              onClick={() => onSelectTransaction("PULLOUT", "FreebiesSample")}
            >
              Freebies/Sample
            </Button>
            <Button
              loading={disable()}
              onClick={() => onSelectTransaction("PULLOUT", "BadInventory")}
            >
              Bad Inventory
            </Button>
          </>
        );
      case "RETURN":
        return (
          <>
            {/* <List.Item>Sales Expert</List.Item> */}
            {channel === "DIRECT_RETAIL" ||
            router.query.warehouse !== "RS50" ? undefined : (
              <Button
                onClick={() => onSelectTransaction("RETURN", "Activation")}
              >
                Actvation
              </Button>
            )}
            <Button
              onClick={() => onSelectTransaction("RETURN", "ReturnInventory")}
            >
              Return Inventory
            </Button>
          </>
        );
      case "TRANSFER":
        return (
          <>
            <Button
              onClick={() => onSelectTransaction("TRANSFER", channel)}
              fullWidth
            >
              Transfer to other warehouse
            </Button>

            {(() => {
              if (channel === "DIRECT_RETAIL") {
                return (
                  <>
                    <Button
                      onClick={() =>
                        onSelectTransaction("TRANSFER", "RETAIL_TO_IC")
                      }
                    >
                      Transfer to IC warehouse
                    </Button>
                    <Button
                      onClick={() =>
                        onSelectTransaction("TRANSFER", "RETAIL_TO_ECOMM")
                      }
                    >
                      Transfer to Ecom warehouse
                    </Button>
                  </>
                );
              } else if (channel === "INDIRECT_CHANNEL") {
                return (
                  <>
                    <Button
                      onClick={() =>
                        onSelectTransaction("TRANSFER", "ECOMM_TO_RETAIL")
                      }
                    >
                      Transfer to DR warehouse
                    </Button>

                    <Button
                      onClick={() =>
                        onSelectTransaction("TRANSFER", "IC_TO_ECOMM")
                      }
                    >
                      Transfer to Ecom warehouse
                    </Button>
                  </>
                );
              }

              return (
                <>
                  <Button
                    onClick={() =>
                      onSelectTransaction("TRANSFER", "ECOMM_TO_RETAIL")
                    }
                  >
                    Transfer to DR warehouse
                  </Button>

                  <Button
                    onClick={() =>
                      onSelectTransaction("TRANSFER", "ECOMM_TO_INDIRECT")
                    }
                  >
                    Transfer to IC warehouse
                  </Button>
                </>
              );
            })()}
          </>
        );
      default:
        return <div></div>;
    }
  };

  const modalTypeRender = () => (
    <Modal
      centered
      title={`${showModal} TYPE`}
      onClose={() => setShowModal(undefined)}
      opened={showModal ? true : false}
    >
      <Stack>{modalContent()}</Stack>
    </Modal>
  );

  const UOMModalRender = () => (
    <Modal
      centered
      title="Conversion Type"
      onClose={() => setShowUOMModal(false)}
      opened={showUOMModal}
    >
      <Stack>
        <Button
          onClick={() => {
            onConvertUOM("bundling");
            setShowUOMModal(false);
          }}
        >
          Convert UOM
        </Button>
        <Button
          onClick={() => {
            onConvertUOM("transfer");
            setShowUOMModal(false);
          }}
        >
          Convert Item Classification
        </Button>
      </Stack>
    </Modal>
  );

  return (
    <div>
      <LoadingOverlay
        visible={
          loadingTransmittal ||
          loadingPullout ||
          loadingReturn ||
          loadingTransfer ||
          loadingReconcile
        }
      />
      {modalTypeRender()}
      {UOMModalRender()}
      <Menu
        disabled={!hasCreateTransactionAccess(user) || status === false}
        width={200}
        trigger="click"
      >
        <Menu.Target>
          <div>
            <Button
              disabled={!hasCreateTransactionAccess(user) || status === false}
              icon={<ChevronDown />}
            >
              Create Transaction
            </Button>
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => onSelectTransaction("TRANSMITTAL", undefined)}
            key="transmittal"
          >
            Transmittal
          </Menu.Item>
          <Menu.Item onClick={() => setShowModal("TRANSFER")} key="transfer">
            Transfer
          </Menu.Item>
          <Menu.Item onClick={() => setShowModal("PULLOUT")} key="pullout">
            Pullout
          </Menu.Item>
          <Menu.Item onClick={() => setShowModal("RETURN")} key="return">
            Return
          </Menu.Item>
          {hasReconcileAccess(user) ? (
            <Menu.Item
              onClick={() => onSelectTransaction("RECONCILE", undefined)}
              key="reconcile"
            >
              Reconcile
            </Menu.Item>
          ) : undefined}
          <Menu.Item onClick={() => setShowUOMModal(true)} key="uom">
            Conversion
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
