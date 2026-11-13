import React, { useState, useEffect } from "react";
import { WMS } from "../../../../GraphQL";
import {
  updateSrfStatus,
  updateSrfQty,
} from "../../../../GraphQL/TransactionSchema";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Input,
  Modal,
  Paper,
  Stack,
  Table,
  Text,
  DatePicker,
  RadioGroup,
} from "../../../Elements";
import dayjs from "dayjs";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { Autocomplete } from "@mantine/core";
import { getSKUs } from "../../../../GraphQL/SKUsSchema";
import { useAtom } from "jotai";
import { channelAtom, userAtom, rolesAtom } from "../../../../Store/StoreAtom";
import { Copy } from "tabler-icons-react";
import { CaretUp, CaretDown, Trash } from "tabler-icons-react";
import { getInventoryItem } from "../../../../GraphQL/CodentifyScannerSchema";
import {
  accessRole,
  handleBatchChange,
  handleDeleteItem,
  handleDeleteSerial,
  handleQtyChange,
  handleCopyId,
  onScan,
  saveSrfItems,
  toggleExpand,
  updateItemField,
} from "./Helpers/DetailsHelper";
import Notification from "../../../Elements/Notification/Notification";

type Props = {
  srf: WMS.SRFs | undefined;
  warehouseName: String;
  onClose: () => void;
  onUpdate?: (updated: WMS.SRFs) => void;
};

export const Details = ({ srf, warehouseName, onClose, onUpdate }: Props) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    opened: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({
    opened: false,
    title: "",
    message: "",
    onConfirm: async () => {},
  });
  const [currentSRF, setCurrentSRF] = useState<WMS.SRFs | undefined>(srf);
  const [expandedSerialRows, setExpandedSerialRows] = useState<
    Record<number, boolean>
  >({});
  const [isEditing, setIsEditing] = useState(false);
  const [codentify, setCondetify] = useState("");
  const [channel] = useAtom(channelAtom);
  const [role] = useAtom(rolesAtom);
  const [user] = useAtom(userAtom);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const [refetchSerial, { loading: loadingSerial }] = useLazyQuery(
    getInventoryItem,
    { context: { clientName: "warehouse" } },
  );

  const [updateMappingStatus] = useMutation(updateSrfStatus, {
    context: { clientName: "warehouse" },
  });
  const [updateSrfItemQty] = useMutation(updateSrfQty, {
    context: { clientName: "warehouse" },
  });

  const [fetchSKUs] = useLazyQuery(getSKUs, {
    context: { clientName: "warehouse" },
    fetchPolicy: "network-only",
  });

  const [isNewGtin, setIsNewGtin] = useState("false");
  const [dataSKU, setDataSKU] = useState<WMS.Sku[]>([]);

  useEffect(() => {
    const loadSKUs = async () => {
      const channels = ["DIRECT_RETAIL", "ECOMM"];

      const responses = await Promise.all(
        channels.map((channel) =>
          fetchSKUs({
            variables: {
              channel,
            },
          }),
        ),
      );

      const mergedSKUs = responses.flatMap(
        (res) => res.data?.skus?.items ?? [],
      );

      setDataSKU(mergedSKUs);
    };

    loadSKUs();
  }, [fetchSKUs]);
  React.useEffect(() => {
    setCurrentSRF(srf);
  }, [srf]);

  React.useEffect(() => {
    setExpandedSerialRows({});
  }, [currentSRF?.id]);

  const ConfirmationModal = () => {
    return (
      <Modal
        opened={confirmAction.opened}
        onClose={() =>
          setConfirmAction((prev) => ({
            ...prev,
            opened: false,
          }))
        }
        title={confirmAction.title}
        centered
      >
        <Stack>
          <Text>{confirmAction.message}</Text>

          <Group position="right">
            <Button
              customType="danger"
              onClick={() =>
                setConfirmAction((prev) => ({
                  ...prev,
                  opened: false,
                }))
              }
            >
              Cancel
            </Button>

            <Button
              onClick={async () => {
                await confirmAction.onConfirm();

                setConfirmAction((prev) => ({
                  ...prev,
                  opened: false,
                }));
              }}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  };

  const rows = currentSRF?.items?.flatMap((item, index) => {
    const mainRow = (
      <tr key={`main-${index}`}>
        {item?.inventory_type == WMS.SkuType.Devices ? (
          <td>
            <Group spacing="xs" align="center">
              <ActionIcon
                disabled={
                  currentSRF.status == WMS.StockRequestStatus.FOR_REVIEW_SC
                }
                onClick={() => toggleExpand(setExpanded, item?.sku!)}
              >
                {expanded.has(item?.sku!) ? <CaretUp /> : <CaretDown />}
              </ActionIcon>
            </Group>
          </td>
        ) : (
          <td></td>
        )}

        <td>{item?.gtin?.replace("_PMI", "")}</td>
        <td>{item?.description}</td>
        <td>{item?.sku}</td>
        <td>{item?.inventory_type}</td>
        <td>{item?.curr_qty || "-"}</td>
        <td>{item?.req_qty || "-"}</td>

        {!role.isSE && (
          <>
            <td>
              {isEditing &&
              currentSRF?.status === WMS.StockRequestStatus.FOR_REVIEW_SC ? (
                <Input
                  type="number"
                  value={item?.sc_qty ?? 0}
                  min={0}
                  onChange={(event) =>
                    handleQtyChange(
                      setHasUnsavedChanges,
                      setCurrentSRF,
                      index,
                      "sc",
                      Number(event.currentTarget.value ?? 0),
                    )
                  }
                />
              ) : (
                item?.sc_qty
              )}
            </td>

            {(currentSRF?.status === WMS.StockRequestStatus.FOR_REVIEW_WH ||
              currentSRF?.status === WMS.StockRequestStatus.AVAILABLE) && (
              <>
                <td>
                  {isEditing ? (
                    <Group>
                      <Input
                        type="number"
                        disabled={item?.inventory_type === WMS.SkuType.Devices}
                        value={item?.wh_qty ?? 0}
                        min={0}
                        onChange={(event) => {
                          const value = Number(event.currentTarget.value ?? 0);

                          if (item?.sc_qty == null) {
                            return;
                          }

                          if (value > item.sc_qty) {
                            return Notification.error({
                              title: "Error: SRF Warehouse Qty",
                              message: "WH Qty cannot be greater than SC Qty",
                            });
                          }

                          handleQtyChange(
                            setHasUnsavedChanges,
                            setCurrentSRF,
                            index,
                            "wh",
                            value,
                          );
                        }}
                      />
                      {item?.is_new ? <Badge color="green">Balance Inv</Badge> : undefined}
                    </Group>
                  ) : (
                    <>{item?.wh_qty}</>
                  )}
                </td>

                <td>
                  {isEditing &&
                  ![WMS.SkuType.Devices, WMS.SkuType.Accessories].includes(
                    item?.inventory_type as WMS.SkuType,
                  ) ? (
                    <DatePicker
                      placeholder="Expiration"
                      dropdownType="modal"
                      value={
                        item?.batch_id ? new Date(item.batch_id) : undefined
                      }
                      onChange={(value) => {
                        if (!value) return;

                        const year = value.getFullYear();
                        const month = String(value.getMonth() + 1).padStart(
                          2,
                          "0",
                        );
                        const day = String(value.getDate()).padStart(2, "0");

                        handleBatchChange(
                          setHasUnsavedChanges,
                          setCurrentSRF,
                          index,
                          `${year}-${month}-${day}`,
                        );
                      }}
                    />
                  ) : item?.inventory_type === WMS.SkuType.Accessories ||
                    item?.inventory_type === WMS.SkuType.Devices ? (
                    "-"
                  ) : (
                    item?.batch_id
                  )}
                </td>
              </>
            )}
          </>
        )}

        <td>
          {item?.is_new ? (
            <ActionIcon
              color="red"
              onClick={() => handleDeleteItem(setCurrentSRF, index)}
            >
              <Trash size={16} />
            </ActionIcon>
          ) : (
            ""
          )}
        </td>
      </tr>
    );
    const serialList = Array.isArray(item?.serial)
      ? item.serial
      : item?.serial
      ? [item.serial]
      : [];

    const expandedRows =
      expanded.has(item?.sku!) && item?.inventory_type === WMS.SkuType.Devices
        ? [
            <tr key={`expanded-${index}`}>
              <td
                colSpan={
                  currentSRF?.status === WMS.StockRequestStatus.FOR_REVIEW_WH ||
                  currentSRF?.status === WMS.StockRequestStatus.AVAILABLE
                    ? 10
                    : 8
                }
              >
                <Table fontSize="sm">
                  <thead>
                    <tr>
                      <th>Serial</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {serialList.length > 0 ? (
                      serialList.map((serial, serialIndex) => (
                        <tr key={`${item.sku}-serial-${serialIndex}`}>
                          <td>{serial}</td>
                          <td>
                            <ActionIcon
                              disabled={
                                currentSRF.status !=
                                WMS.StockRequestStatus.FOR_REVIEW_WH
                              }
                              color="red"
                              onClick={() =>
                                handleDeleteSerial(
                                  setCurrentSRF,
                                  item.sku!,
                                  serial,
                                )
                              }
                            >
                              <Trash size={16} />
                            </ActionIcon>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2}>No serials found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </td>
            </tr>,
          ]
        : [];

    return [mainRow, ...expandedRows];
  });

  return (
    <>
      <ConfirmationModal />
      <Modal
        title="Stock Request"
        size={1600}
        centered
        opened={!!currentSRF}
        onClose={onClose}
      >
        <Paper radius="md">
          <Stack spacing="lg">
            <Group position="apart">
              <Badge size="lg">
                Status: {currentSRF?.status?.replaceAll("_", " ")}
              </Badge>

              {accessRole(role) ? undefined : (
                <Group>
                  {srf?.status == WMS.StockRequestStatus.FOR_REVIEW_SC &&
                  (role.isFullAdmin || role.isSupplyChainFullAdmin) ? (
                    <Button onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  ) : (srf?.status == WMS.StockRequestStatus.FOR_REVIEW_WH ||
                      srf?.status == WMS.StockRequestStatus.AVAILABLE) &&
                    (role.isFullAdmin || role.isWarehouseFullAdmin) ? (
                    <Button onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  ) : undefined}

                  {srf?.status == "FOR_REVIEW_WH" &&
                  (role.isFullAdmin || role.isWarehouseFullAdmin) ? (
                    <Button
                      disabled={
                        isEditing ||
                        hasUnsavedChanges ||
                        currentSRF?.items?.every((e) => e?.wh_qty === 0)
                      }
                      onClick={() => {
                        setConfirmAction({
                          opened: true,
                          title: "Confirm Endorse",
                          message:
                            "Are you sure you want to endorse this SRF to warehouse?",
                          onConfirm: async () => {
                            try {
                              const { data } = await updateMappingStatus({
                                variables: {
                                  input: {
                                    id: currentSRF?.id ?? srf?.id,
                                    status: "AVAILABLE",
                                    logs: {
                                      approved_by: user.username,
                                      approval_date: dayjs().unix(),
                                      status:
                                        WMS.StockRequestStatus.FOR_REVIEW_WH,
                                    },
                                  },
                                },
                              });

                              const updated = data?.srfStatusUpdate;

                              if (updated) {
                                setCurrentSRF(updated);
                                onUpdate?.(updated);
                              }

                              Notification.success({
                                title: "Success: SRF Movement Status",
                                message: "Endorsed to warehouse successfully",
                              });
                            } catch (error) {
                              Notification.error({
                                title: "Error: SRF Staus Movement Status",
                                message: "Something Went Wrong",
                              });
                            }
                          },
                        });
                      }}
                    >
                      Done Transaction
                    </Button>
                  ) : srf?.status === "AVAILABLE" ||
                    srf?.status === "CLOSED" ||
                    srf?.status === WMS.StockRequestStatus.REJECT ||
                    srf?.status == WMS.StockRequestStatus.FOR_REVIEW_WH ||
                    user.roles?.includes(WMS.Role.WHFullAdmin) ? null : (
                    <Group>
                      <Button
                        customType="danger"
                        onClick={() => {
                          setConfirmAction({
                            opened: true,
                            title: "Confirm Reject",
                            message:
                              "Are you sure you want to Reject this SRF?",
                            onConfirm: async () => {
                              try {
                                const { data } = await updateMappingStatus({
                                  variables: {
                                    input: {
                                      id: currentSRF?.id ?? srf?.id,
                                      status: "REJECT",
                                    },
                                  },
                                });

                                const updated = data?.srfStatusUpdate;

                                if (updated) {
                                  setCurrentSRF(updated);
                                  onUpdate?.(updated);
                                }

                                Notification.success({
                                  title: "SRF",
                                  message: "Rejected successfully",
                                });
                              } catch (error) {
                                Notification.error({
                                  title: "SRF",
                                  message: "Rejection failed",
                                });
                              }
                            },
                          });
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        disabled={
                          isEditing ||
                          hasUnsavedChanges ||
                          currentSRF?.items?.every((e) => e?.sc_qty === 0)
                        }
                        onClick={() => {
                          setConfirmAction({
                            opened: true,
                            title: "Confirm Endorse",
                            message:
                              "Are you sure you want to endorse this SRF to warehouse?",
                            onConfirm: async () => {
                              try {
                                const { data } = await updateMappingStatus({
                                  variables: {
                                    input: {
                                      id: currentSRF?.id ?? srf?.id,
                                      status: "FOR_REVIEW_WH",
                                      logs: {
                                        approved_by: user.username,
                                        approval_date: dayjs().unix(),
                                        status:
                                          WMS.StockRequestStatus.FOR_REVIEW_SC,
                                      },
                                    },
                                  },
                                });

                                const updated = data?.srfStatusUpdate;

                                if (updated) {
                                  setCurrentSRF(updated);
                                  onUpdate?.(updated);
                                }

                                Notification.success({
                                  title: "SRF",
                                  message: "Endorsed to warehouse successfully",
                                });
                              } catch (error) {
                                Notification.error({
                                  title: "SRF",
                                  message: "Endorse failed",
                                });
                              }
                            },
                          });
                        }}
                      >
                        Endorse to Warehouse
                      </Button>
                    </Group>
                  )}
                </Group>
              )}
            </Group>

            <Group position="apart">
              <Stack spacing={2}>
                <Text size="sm" color="dimmed">
                  Store
                </Text>
                <Text weight={"600"}>{warehouseName}</Text>
              </Stack>

              <Stack spacing={2}>
                <Text size="sm" color="dimmed">
                  ID
                </Text>
                <Group spacing={4} align="center">
                  <Text weight={"600"}>{currentSRF?.id}</Text>
                  <ActionIcon
                    size="sm"
                    onClick={() => handleCopyId(currentSRF?.id ?? undefined)}
                  >
                    <Copy size={20} />
                  </ActionIcon>
                </Group>
              </Stack>

              <Stack spacing={2}>
                <Text size="sm" color="dimmed">
                  Date of Request
                </Text>
                <Text weight={"600"}>
                  {currentSRF?.date_created
                    ? dayjs(currentSRF.date_created * 1000).format("MM-DD-YY")
                    : "-"}
                </Text>
              </Stack>
            </Group>

            {accessRole(role) || !isEditing ? undefined : (
              <Group>
                <Autocomplete
                  style={{ width: "400px" }}
                  value={codentify}
                  onChange={(value) => setCondetify(value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onScan(
                        codentify,
                        currentSRF?.status ?? undefined,
                        {
                          skus: {
                            items: dataSKU,
                          },
                        },
                        refetchSerial,
                        setCurrentSRF,
                        isNewGtin === "true",
                      );
                      setCondetify("");
                    }
                  }}
                  data={
                    dataSKU
                      .filter((sku: WMS.Sku) => sku.status !== "INACTIVE")
                      .map((sku: WMS.Sku, index: Number) => ({
                        value: `${sku.gtin}`,
                        label: `${sku.gtin?.replace("_PMI", "")} - ${
                          sku.description
                        } - ${sku.unit_of_measure}`,
                        description: sku.description,
                      })) || []
                  }
                  placeholder="Scan or Input GTIN"
                  description="Scan or Search"
                  filter={(value, item) =>
                    item.label.toLowerCase().includes(value.toLowerCase())
                  }
                  limit={dataSKU.length || 100}
                  maxDropdownHeight={200}
                />

                {currentSRF?.status == WMS.StockRequestStatus.AVAILABLE ||
                currentSRF?.status == WMS.StockRequestStatus.FOR_REVIEW_WH ? (
                  <RadioGroup
                    data={[
                      {
                        label: "Existing GTIN",
                        value: "false",
                      },
                      {
                        label: "New GTIN",
                        value: "true",
                      },
                    ]}
                    defaultValue={isNewGtin}
                    onChange={(value) => setIsNewGtin(value)}
                    orientation="horizontal"
                  />
                ) : undefined}
              </Group>
            )}
            <Table highlightOnHover>
              <thead>
                <tr>
                  <th></th>
                  <th>GTIN</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Type</th>
                  <th>Current Stock</th>
                  <th>Requested QTY</th>

                  {role.isSE ? undefined : (
                    <>
                      <th>Supply Chain Approved QTY</th>

                      {(currentSRF?.status ===
                        WMS.StockRequestStatus.FOR_REVIEW_WH ||
                        currentSRF?.status ===
                          WMS.StockRequestStatus.AVAILABLE) && (
                        <>
                          <th>Warehouse Approved QTY</th>
                          <th>Expiration</th> {/* batch id */}
                        </>
                      )}

                      {currentSRF?.status ===
                        WMS.StockRequestStatus.FOR_REVIEW_SC && <th>Action</th>}
                    </>
                  )}
                </tr>
              </thead>

              <tbody>{rows}</tbody>
            </Table>
            <Group position="center">
              {isEditing && (
                <Button
                  onClick={() =>
                    saveSrfItems(
                      currentSRF,
                      srf,
                      updateSrfItemQty,
                      onUpdate,
                      setCurrentSRF,
                      setHasUnsavedChanges,
                      setIsEditing,
                    )
                  }
                >
                  Done
                </Button>
              )}
            </Group>
          </Stack>
        </Paper>
      </Modal>
    </>
  );
};
