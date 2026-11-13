/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Printer, Search, AlertCircle } from "tabler-icons-react";
import {
  Button,
  Card,
  Group,
  Input,
  Select,
  Table,
  Modal,
  LoadingOverlay,
  Pagination,
  ScrollArea,
  Text,
} from "../../Elements";
import router from "next/router";
import { useStyles } from "../OrderManagement/OrderManagement.styles";
import { EcomVerificationDetails } from "../EcomVerificationDetails/EcomVerificationDetails";
import { useMutation, useQuery } from "@apollo/client";
import {
  assignOrderToRider,
  generatePDF,
  getOrders,
  getRiders,
  orderScanRider,
  orderUpdate,
} from "../../../GraphQL/OrderManagementSchema";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import dayjs from "dayjs";
import Notification from "../../Elements/Notification/Notification";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { formatCustomerAddress } from "../../../Utilities/Formatter";
import { OrdersFilter } from "../../Modules/Filters/OrdersFilter";

import { ORDER } from "../../../GraphQL";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom } from "../../../Store/StoreAtom";
import { usePagination } from "@mantine/hooks";
import { Tooltip } from "@mantine/core";

export const DispatchManagement = () => {
  const [user] = useAtom(rolesAtom);
  const [channel] = useAtom(channelAtom);
  const [showModal, setShowModal] = useState<{
    visible: boolean;
    order: ORDER.Maybe<ORDER.Order>;
  }>({
    visible: false,
    order: {},
  });
  const { classes } = useStyles();

  const {
    data: dataOrders,
    refetch: refetchOrders,
    fetchMore,
    loading,
    networkStatus,
  } = useQuery<{ orders: ORDER.OrderConnection }>(getOrders, {
    variables: {
      warehouse_id: "PH01",
      date_filter: {
        from: dayjs().format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
      },
    },
    context: { clientName: "order" },
    notifyOnNetworkStatusChange: true,
  });
  const {
    loading: loadingWarehouse,
    error: errorWarehouse,
    data: dataWarehouse,
    refetch: refetchWarehouse,
  } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: channel },
  });
  const {
    loading: loadingRiders,
    error: errorRiders,
    data: dataRiders,
    refetch: refetchRiders,
  } = useQuery<{ riders: ORDER.RiderConnection }>(getRiders, {
    context: { clientName: "order" },
  });
  const [updateOrder, { loading: loadingOrder }] = useMutation(orderUpdate, {
    context: { clientName: "order" },
  });
  const [generateInvoice, { loading: loadingPDF }] = useMutation(generatePDF, {
    context: { clientName: "order" },
  });
  const [assignRider, { loading: loadingAssignRider }] = useMutation(
    assignOrderToRider,
    { context: { clientName: "order" } },
  );
  const [scanRider, { loading: loadingScanRider }] = useMutation(
    orderScanRider,
    { context: { clientName: "order" } },
  );
  const { data: dataSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: channel },
  });

  const [filters, setFilters] = useState({
    status: "PROCESSED",
    warehouse: "PH01",
    date: {
      from: dayjs().format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    },
  });

  const orders = dataOrders?.orders?.items;
  if (dataOrders?.orders?.next_token) {
    fetchMore({
      variables: {
        warehouse_id: "PH01",
        date_filter: filters?.date,
        next_token: dataOrders?.orders?.next_token,
      },
    });
  }

  const filterOrders = () => {
    switch (filters.status) {
      case "SHIPPED":
        return orders?.filter((order) => order?.order_status === "SHIPPED");
      case "PROCESSED":
        return orders?.filter((order) => order?.order_status === "PROCESSED");
      default:
        return orders;
    }
  };

  const pagination = usePagination({
    total: filterOrders()?.length || 0,
    initialPage: 1,
  });

  // const [orders, setOrders] = useState<{
  //     PROCESSED: { [key: string]: any }[],
  //     SHIPPED: { [key: string]: any }[],
  // }>({
  //     SHIPPED: [],
  //     PROCESSED: [],
  // })

  // useEffect(() => {
  //     getAllOrders("PH01", {from:  dayjs().format("YYYY-MM-DD"),to: dayjs().format("YYYY-MM-DD")});
  // }, [])

  // const getAllOrders = (warehouse: string, date: {[key: string]: any}) => {
  //     setLoading(true)
  //     Promise.all([
  //         getOrderByStatus(warehouse, date,[], undefined, "SHIPPED"),
  //         getOrderByStatus(warehouse, date,[], undefined, "PROCESSED"),

  //     ])
  //     .then(([orderShipped, orderProcessed]) => {
  //         setOrders({
  //             ...orders,
  //             SHIPPED: sortOrders([...orderShipped]),
  //             PROCESSED: sortOrders([...orderProcessed]),

  //         })
  //         setLoading(false)
  //         setFilters({...filters,  page: {from: 0, to: 99, activePage: 1}})
  //     })
  //  }

  const sortOrders = (list: ORDER.Maybe<ORDER.Order>[]) => {
    return list?.sort((a: any, b: any) => {
      if (a.delivery_date && b.delivery_date)
        return b.delivery_date - a.delivery_date;
      return b.date_created - a.date_created;
    });
  };

  // const getOrderByStatus : any = (warehouse: string, date: {[key: string]: any}, list: {[key: string]: any}[], next_token: string | undefined, status: string) => {
  // return refetchOrders({
  //         order_status: status,
  //         warehouse_id: warehouse,
  //         next_token: next_token,
  //         date_filter: date
  //     }).then(({data}) => {
  //     if(data.orders?.next_token) return getOrderByStatus(warehouse, date,  data.orders.items, data.orders?.next_token, status)
  //     return [...list, ...data.orders.items]
  //     })
  //     .catch((e) => {
  //         Notification.error({message: e.message})
  //     })
  // }

  const onSelectOrderStatus = (status: string) => {
    if ((filterOrders()?.length || 0) > 0) {
      pagination.setPage(1);
    }
    setFilters({ ...filters, status: status });
  };

  const onAssignRider = (rider: string, order: ORDER.Maybe<ORDER.Order>) => {
    assignRider({
      variables: {
        id: order?.id,
        rider_id: rider,
        order_type: "ORDER",
        shipment_type: order?.shipment_type,
      },
    })
      .then((res) => {
        const updateOrders = filterOrders() || [];
        const index = updateOrders?.findIndex((e) => e?.id === order?.id);
        updateOrders[index] = { ...res.data?.orderAssignRider };
        // setOrders(filters.status === "SHIPPED" ? {...orders,SHIPPED: updateOrders} : {...orders,PROCESSED: updateOrders})
        Notification.success({ message: "Rider Assigned" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const [openSI, setOpenSI] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ORDER.Order | null>(null);
  const [invoice, setInvoice] = useState<string>("");

  function SIprintModal() {
    return (
      <Modal
        opened={openSI}
        centered
        onClose={() => setOpenSI(false)}
        title="Sales Invoice Print"
      >
        <Group>
          <AlertCircle size={20} />
          <Text>Please Select Sales invoice type to print </Text>
        </Group>

        <Group position="right">
          <Button
            customType="orange"
            onClick={() => {
              if (selectedOrder) {
                onGenerateInvoice(selectedOrder, invoice, true);
              }
              setOpenSI(false);
            }}
          >
            Old
          </Button>
          <Button
            customType="primary"
            onClick={() => {
              if (selectedOrder) {
                onGenerateInvoice(selectedOrder, invoice, false);
              }
              setOpenSI(false);
            }}
          >
            New
          </Button>
        </Group>
      </Modal>
    );
  }

  const invoicePrint = (order: ORDER.Order) => {
    var invoiceInput = order?.invoice_no || "";
    return (
      <div style={{ width: 375 }}>
        <Group>
          <Input
            defaultValue={order?.invoice_no || ""}
            disabled={loadingOrder || accessRole()}
            onChange={(e: any) => (invoiceInput = e.target.value)}
            placeholder="Enter invoice number"
          />
          <Button
            disabled={loadingOrder || accessRole() === true}
            onClick={(e: any) => {
              setInvoice(invoiceInput);
              setSelectedOrder(order as ORDER.Order);
              setOpenSI(true);
            }}
            icon={<Printer />}
          >
            INVOICE PRINT
          </Button>
        </Group>
      </div>
    );
  };

  const onGenerateInvoice = (
    order: ORDER.Order,
    invoice: string | undefined,
    salesInvoiceType: boolean,
  ) => {
    
    const cleanInvoice = invoice?.trim() || "";

    const alphanumericRegex = /^[a-zA-Z0-9]{4,}$/;

    if(!cleanInvoice) {
      return Notification.error({
        message: "Please add invoice number!"
      });
    }

    if(!alphanumericRegex.test(cleanInvoice)) {
      return Notification.error({
        message: "Invoice number must be at least 4 alphanumeric characters!",
      });
    }

    updateOrder({
        variables: {
          id: order?.id,
          input: {
            invoice_no: invoice,
          },
          order_type: order?.doc_type != undefined ? order.doc_type : "ORDER",
        },
      }).then((res) => {
        Notification.success({ message: "Invoice saved Successfully" });
        onInvoicePrint(order, salesInvoiceType);
      });

  };

  const onInvoicePrint = (order: ORDER.Order, salesInvoiceType: boolean) => {
    generateInvoice({
      variables: {
        type: "INVOICE",
        order_id: order.order_id,
        salesInvoiceType: salesInvoiceType,
      },
    }).then((resPDF) => {
      window?.open(resPDF?.data?.generatePDF, "_blank");
    });
  };

  const onScanRiderCode = (code: string, order: ORDER.Maybe<ORDER.Order>) => {
    const rider = (dataRiders?.riders?.items || []).find(
      (e) => e?.username === code,
    );
    if (!rider) return Notification.error({ message: "Cant find rider" });
    if (code !== order?.assigned_rider)
      return Notification.error({ message: "Invalid rider code" });
    scanRider({
      variables: {
        id: order?.id,
        rider_id: code,
        order_type: order.doc_type != undefined ? order.doc_type : "ORDER",
      },
    })
      .then((res) => {
        // setOrders({
        //     PROCESSED: orders.PROCESSED.filter((e) => e.id !== order.id),
        //     SHIPPED: [...orders.SHIPPED, {...res.data?.orderScanRider}]
        // })
        Notification.success({ message: "Scan rider success" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const accessRole = () => {
    if (
      user.isPacker || // old roles
      user.isDispatch ||
      user.isEcomAdmin ||
      user.isAdministratorEC ||
      user.isFullAdmin ||
      //old roles
      user.isAdmin ||
      user.isDispatcher
    ) {
      return false;
    } else {
      return true;
    }
  };

  const rows = (list: ORDER.Maybe<ORDER.Order>[]) => {
    return list
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      ?.map((e, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr
            onClick={() =>
              setShowModal({
                visible: true,
                order: e,
              })
            }
          >
            <td>{e?.verification_status || "UNVERIFIED"}</td>
            <td>
              <Tooltip label={e?.note}>
                <p
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    width: 150,
                    whiteSpace: "nowrap",
                  }}
                >
                  {e?.note}
                </p>
              </Tooltip>
            </td>
            <td>{e?.id}</td>
            <td>
              {
                dataWarehouse?.warehouses?.items.find(
                  (wh: any) => wh.id === e?.assigned_warehouse,
                )?.name
              }
            </td>
            <td>
              <div className={classes.preWrapText}>
                {formatCustomerAddress(e?.billing_address)}
              </div>
            </td>
            <td>{e?.payment_type}</td>
            <td>{e?.order_status}</td>
            <td onClick={(e) => e.stopPropagation()}>
              <Select
                disabled={accessRole()}
                style={{ width: 200 }}
                value={e?.assigned_rider || ""}
                onChange={(rider: string) => onAssignRider(rider, e)}
                searchable
                placeholder="Select User"
                data={(dataRiders?.riders?.items || []).map((e) => {
                  return {
                    label: e?.name || "",
                    value: e?.username || "",
                  };
                })}
              />
            </td>
            <td onClick={(e) => e.stopPropagation()}>
              <Input
                disabled={e?.order_status !== "PROCESSED" || accessRole()}
                style={{ width: 150 }}
                onKeyPress={(code) =>
                  code.key === "Enter"
                    ? onScanRiderCode(code.target.value, e)
                    : undefined
                }
                placeholder="Scan Rider Code"
              />
            </td>
            <td
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {invoicePrint(e as ORDER.Order)}
            </td>
          </tr>
        </React.Fragment>
      ));
  };

  return (
    <div>
      {SIprintModal()}
      <LoadingOverlay visible={loading || loadingAssignRider} />
      <Modal
        size={1100}
        opened={showModal.visible}
        onClose={() =>
          setShowModal({
            visible: false,
            order: {},
          })
        }
        centered
      >
        <EcomVerificationDetails
          order={showModal?.order || {}}
          skus={dataSKU?.skus?.items}
        />
      </Modal>
      <div style={{ width: 1000 }}>
        <OrdersFilter
          defaultValues={{
            warehouse: "PH01",
            date: {
              from: dayjs().format("YYYY-MM-DD"),
              to: dayjs().format("YYYY-MM-DD"),
            },
          }}
          onFilter={({ warehouse, date }) => {
            setFilters({
              ...filters,
              warehouse: `${warehouse}`,
              date: date,
            });
            setTimeout(() => {
              refetchOrders({
                warehouse_id: warehouse,
                date_filter: date,
              });
            }, 500);
          }}
        />
      </div>

      <div className={classes.statusContainer}>
        <Card
          background="#61B765"
          title="PROCESSED"
          number={
            orders?.filter((order) => order?.order_status === "PROCESSED")
              .length
          }
          onClick={() => onSelectOrderStatus("PROCESSED")}
          removeSelect={filters.status !== "PROCESSED"}
          isSelected={filters.status === "PROCESSED"}
        />
        <Card
          background="#A23DB6"
          title="SHIPPED"
          number={
            orders?.filter((order) => order?.order_status === "SHIPPED").length
          }
          onClick={() => onSelectOrderStatus("SHIPPED")}
          removeSelect={filters.status !== "SHIPPED"}
          isSelected={filters.status === "SHIPPED"}
        />
      </div>
      <ScrollArea style={{ height: 700 }}>
        <div className={classes.tableContainer}>
          <Table>
            <thead>
              <tr>
                <th>Verification Status</th>
                <th>Notes</th>
                <th>Order Number</th>
                <th>Warehouse/Store</th>
                <th>Address</th>
                <th>Payment Type</th>
                <th>Order Status</th>
                <th>Assign</th>
                <th>Receive</th>
                <th>Invoice</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{rows(filterOrders() || [])}</tbody>
          </Table>
        </div>
      </ScrollArea>
      <br />
      <Group position="right">
        <Pagination
          position="center"
          total={Math.ceil((filterOrders()?.length || 0) / 100)}
          page={pagination.active}
          onChange={pagination.setPage}
        />
      </Group>
      <br />
    </div>
  );
};
