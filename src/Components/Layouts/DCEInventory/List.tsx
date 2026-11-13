import React, { useEffect, useState } from "react";
import { Table, ScrollArea, Checkbox, Group, Pagination } from "../../Elements";
import { useLazyQuery, useMutation } from "@apollo/client";
import { LoadingOverlay, Switch } from "@mantine/core";
import { Filters } from "./ActionButtons/Filters";
import { AddRemoveStocks } from "./ActionButtons/AddRemoveStocks";
import {
  getBlockedSKUs,
  getSKUs,
  updateDCEStatus,
} from "../../../GraphQL/SKUsSchema";
import { WMS } from "../../../GraphQL";
import { ChangeStatusNotice } from "./ActionButtons/ChangeStatusNotice";
import Notification from "../../Elements/Notification/Notification";
import { Triggers } from "./ActionButtons/Triggers";
import { usePagination } from "@mantine/hooks";

type FilterProps = {
  search: string | undefined;
  type: string | undefined;
  status: string | undefined;
};

export const List = () => {
  const [list, setList] = useState<WMS.Sku[]>([]);
  const [singleUpdate, setSingleUpdate] = useState(false);
  const [selectedItems, setSelectedItems] = useState<WMS.Sku[]>([]);
  const [isPaginate, setIsPaginate] = useState(false);
  const [filter, setFilter] = useState<FilterProps>({
    search: "",
    type: undefined,
    status: undefined,
  });
  const [querySKUs, { loading }] = useLazyQuery(getSKUs, {
    context: { clientName: "warehouse" },
  });
  const [changeDCEStatus, { loading: loadingStatus }] = useMutation(
    updateDCEStatus,
    { context: { clientName: "warehouse" } },
  );
  const [queryBlockedSKUs, { loading: loadingBlocked }] = useLazyQuery(
    getBlockedSKUs,
    { context: { clientName: "warehouse" } },
  );
  const [batchUpdateStatus, setBatchUpdateStatus] = useState<
    string | undefined
  >();
  useEffect(() => {
    loadInventory();
  }, []);

  const filterItems = (list: WMS.Sku[]) => {
    return list
      ?.filter((item) => {
        if (!filter?.search || filter?.search === "") {
          return item;
        } else {
          return (
            item?.gtin?.toLowerCase().includes(filter?.search?.toLowerCase()) ||
            item?.sku?.toLowerCase().includes(filter?.search?.toLowerCase()) ||
            item?.description
              ?.toLowerCase()
              .includes(filter?.search?.toLowerCase())
          );
        }
      })
      .filter((item) => {
        if (!filter.type) {
          return item;
        } else {
          return item?.type === filter.type;
        }
      })
      .filter((item) => {
        if (!filter.status) {
          return item;
        } else {
          return (
            item?.dce_status ===
            (filter.status === "LIVE" ? "UNBLOCKED" : "BLOCKED")
          );
        }
      });
  };

  const pagination = usePagination({
    total: filterItems(list).length || 0,
    initialPage: 1,
  });

  const loadInventory = () => {
    Promise.all([
      querySKUs({
        variables: {
          channel: "ECOMM",
        },
        fetchPolicy: "no-cache",
      }),
      queryBlockedSKUs({ fetchPolicy: "no-cache" }),
    ]).then(([res1, res2]) => {
      setList([]);
      setTimeout(() => {
        setList(
          filterItems(res1.data.skus.items)
            .filter(
              (e) =>
                e?.gtin !== "0001" &&
                !e?.description?.toLowerCase().includes("lending fee"),
            )
            .map((item) => {
              return {
                ...item,
                dce_status: res2.data.skuBlocks.items.some(
                  (e: WMS.Sku) => e.gtin === item.gtin,
                )
                  ? WMS.SkuBlockStatus.Blocked
                  : WMS.SkuBlockStatus.Unblocked,
              };
            }),
        );
      }, 100);
    });
  };

  const onSelectItems = (isSelect: boolean, item: WMS.Sku) => {
    const findItem = selectedItems.find((e) => e.gtin == item?.gtin);
    const updateList = [...selectedItems];
    if (isSelect) {
      updateList.push({ ...item });
      setSelectedItems(updateList);
    } else {
      if (findItem) {
        setSelectedItems(updateList.filter((e) => e.gtin !== item?.gtin));
      }
    }
  };

  const onChangeStatus = (status: string) => {
    changeDCEStatus({
      variables: {
        input: {
          status: status,
          skus: selectedItems.map((item) => {
            return {
              gtin: item.gtin,
              sku: item.sku,
              name: item.name,
              unit_of_measure: item.unit_of_measure,
              description: item.description,
              type: item.type,
            };
          }),
        },
      },
    })
      .then(() => {
        setSelectedItems([]);
        setSingleUpdate(false);
        setBatchUpdateStatus(undefined);
        loadInventory();
        Notification.success({ message: "DCE Status changed" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const rows = () => {
    return (isPaginate ? [] : filterItems(list))
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      .map((element, index) => (
        <React.Fragment key={`list-${index}-${element?.gtin}`}>
          <tr>
            <td>
              <div
                data-testid={`${element.gtin}-${element.dce_status}-checkbox`}
              >
                <Checkbox
                  checked={selectedItems.some((e) => e.gtin === element.gtin)}
                  onChange={(e) => onSelectItems(e.target.checked, element)}
                  label=""
                />
              </div>
            </td>
            <td data-testID={`GTIN-${element.gtin}`}>{element?.gtin}</td>
            <td data-testID={`SKU-${element.sku}`}>{element?.sku}</td>
            <td data-testID={`DESC-${element.description}`}>
              {element?.description}
            </td>
            <td>{element?.unit_of_measure}</td>
            <td>{element?.type}</td>
            <td>
              <div data-testid={`${element.gtin}-${element.dce_status}`}>
                <Switch
                  size="lg"
                  styles={{
                    trackLabel: { width: 50 },
                    track:
                      element.dce_status === WMS.SkuBlockStatus.Blocked
                        ? {
                            border: "red solid",
                            backgroundColor: "red",
                            color: "white",
                          }
                        : undefined,
                  }}
                  offLabel={"BLOCKED"}
                  onLabel={"LIVE"}
                  checked={
                    element.dce_status === WMS.SkuBlockStatus.Blocked
                      ? false
                      : true
                  }
                  disabled={selectedItems.length > 0 || singleUpdate}
                  color="green"
                  onChange={() => {
                    setSelectedItems([element]);
                    setSingleUpdate(true);
                  }}
                />
              </div>
            </td>
          </tr>
        </React.Fragment>
      ));
  };

  const onFilter = (type: string, value: string | undefined) => {
    switch (type) {
      case "TYPE":
        setFilter({ ...filter, type: value });
        break;
      case "STATUS":
        setFilter({ ...filter, status: value });
        break;
      case "SEARCH":
        setFilter({ ...filter, search: value });
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <ChangeStatusNotice
        visible={singleUpdate}
        loading={loadingStatus}
        items={selectedItems}
        selectedStatus={batchUpdateStatus}
        onClose={() => {
          setSelectedItems([]);
          setSingleUpdate(false);
          setBatchUpdateStatus(undefined);
        }}
        onChangeStatus={onChangeStatus}
      />
      <Group align="center" position="apart">
        <Filters onFilter={onFilter} />
        <Group>
          <Triggers />
          <AddRemoveStocks
            isEnabled={selectedItems.length > 0 && !singleUpdate}
            onSelectStatus={(status: string) => {
              setBatchUpdateStatus(status);
              setSingleUpdate(true);
            }}
          />
        </Group>
      </Group>
      <br />
      <ScrollArea scrollbarSize={20} style={{ height: 600 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>
                <Checkbox
                  onChange={(e) =>
                    setSelectedItems(e.target.checked ? list : [])
                  }
                  label={""}
                />
              </th>
              <th>GTIN</th>
              <th>SKU</th>
              <th>Description</th>
              <th>Unit of Measure</th>
              <th>Inventory Type</th>
              <th>DCE Status</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </ScrollArea>
      <br />
      <Group position="right">
        <Pagination
          position="center"
          total={Math.ceil((filterItems(list)?.length || 0) / 100)}
          page={pagination.active}
          onChange={(page) => {
            setIsPaginate(true);
            pagination.setPage(page);
            setTimeout(() => {
              setIsPaginate(false);
            }, 0);
          }}
        />
      </Group>
    </div>
  );
};
