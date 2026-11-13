import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Group,
  Input,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Uploader,
} from "../../Elements";
import { OrdersFilter } from "../../Modules/Filters/OrdersFilter";
import { FileWithPath } from "@mantine/dropzone";
import { SalesLogsDetails } from "./SalesLogsDetails";
import { WMS } from "../../../GraphQL";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  getSalesTransaction,
  getSalesTransactions,
  saleTransactionUpdate,
} from "../../../GraphQL/RecordSalesSchema";
import { useAtom } from "jotai";
import { rolesAtom, userAtom } from "../../../Store/StoreAtom";
import Amplify, { Storage } from "../../../Utilities/Backend";
import Notification from "../../Elements/Notification/Notification";
import { SalesScanner } from "./SalesScanner";
import { useViewportSize } from "@mantine/hooks";
import { useStyles } from "./Sales.styles";
import { isTabletMobileView } from "../../../Utilities/Formatter";
import { SalesAttachments } from "./SalesAttachments";
import { PreviewAttachedImage } from "../RecordSales/PreviewAttachedImage";
import ViewAttachments from "./ViewAttachments";

type FilterProps = {
  warehouse_id: string | undefined | null;
  date: {
    from: string;
    to: string;
  };
};

export const ReplacementList = () => {
  const { height, width } = useViewportSize();
  const { classes } = useStyles();
  const [selectedLogs, setSelectedLogs] = useState<WMS.SaleTransaction>();
  const [list, setList] = useState<WMS.SaleTransaction[]>([]);
  const [querySalesTransactions, { loading: loading }] = useLazyQuery(
    getSalesTransactions,
    { context: { clientName: "warehouse" } }
  );
  const [queryRecordSale, { loading: loadingRecordSale }] = useLazyQuery(
    getSalesTransaction,
    { context: { clientName: "warehouse" } }
  );
  const [updateSaleTransaction, { loading: loadingUpdate }] = useMutation(
    saleTransactionUpdate,
    { context: { clientName: "warehouse" } }
  );
  const [user] = useAtom(userAtom);
  const [roles] = useAtom(rolesAtom);
  const [filters, setFilters] = useState<FilterProps>({
    warehouse_id: undefined,
    date: {
      from: dayjs().startOf("week").format("YYYY-MM-DD"),
      to: dayjs().endOf("week").format("YYYY-MM-DD"),
    },
  });

  const [isViewSelectedIamge, setIsViewSelectedIamge] =
    useState<string | undefined>(undefined);
  const [opened, setOpened] = useState<{
    receipt: WMS.SaleTransaction | undefined;
    remittance: WMS.SaleTransaction | undefined;
  }>({
    receipt: undefined,
    remittance: undefined,
  });

  useEffect(() => {
    if (user.username && user.office_ids) {
      getSalesTransactionList(
        filters.date,
        user?.office_ids ? user?.office_ids[0] : undefined
      );
    }
  }, [user]);

  const getSalesTransactionList = (
    date: { from: string; to: string },
    warehouse_id: string | undefined | null
  ) => {
    querySalesTransactions({
      variables: {
        warehouse_id: warehouse_id,
        date_filter: date
          ? {
              from: Number(
                dayjs(date.from, "YYYY-MM-DD").startOf("day").unix()
              ),
              to: Number(dayjs(date.to, "YYYY-MM-DD").endOf("day").unix()),
            }
          : {
              from: Number(
                dayjs(filters.date.from, "YYYY-MM-DD").startOf("day").unix()
              ),
              to: Number(
                dayjs(filters.date.to, "YYYY-MM-DD").endOf("day").unix()
              ),
            },
      },
    }).then((res) => {
      const replacementList: WMS.SaleTransaction[] =
        res?.data?.saleTransactions?.items;
      setList(replacementList?.filter((e) => e.type === "Replacement"));
      setFilters({
        warehouse_id: warehouse_id,
        date: date,
      });
    });
  };

  const onSaveImage = (file: FileWithPath[]) => {
    if (file.length > 0) {
      const type = opened.receipt?.signature?.key ? "RECEIPT" : "REMITTANCE";
      const warehouse_id =
        opened.receipt?.warehouse_id || opened.remittance?.warehouse_id;
      const transaction_id =
        opened.receipt?.transaction_id || opened.remittance?.transaction_id;
      const transaction_no =
        opened.receipt?.transaction_no || opened.remittance?.transaction_no;
      // const existingKey = (opened.receipt?.signature?.key || opened.remittance?.remittance_slip?.key)?.replace("public/retail/", "")
      const newKey = `${warehouse_id}/${type}/${transaction_no}_${dayjs().unix()}.${
        file[0].type.split("/")[1]
      }`; //sig.key;
      // const finalKey = existingKey ? existingKey : newKey;
      const s3Objects = {
        bucket: process.env.NEXT_PUBLIC_DATA_BUCKET,
        key: `public/retail/${newKey}}`,
        region: process.env.NEXT_PUBLIC_REGION,
      };
      const input =
        type === "RECEIPT"
          ? { signature: s3Objects }
          : { remittance_slip: s3Objects };
      Storage.put(`retail/${newKey}`, file[0], {
        level: "public",
        contentType: file[0].type,
      })
        .then(() => {
          updateSaleTransaction({
            variables: {
              transaction_id: transaction_id,
              input: input,
            },
          }).then((res) => {
            const updateList = [...list];
            const index = updateList.findIndex(
              (e) =>
                e.transaction_id ===
                res.data?.saleTransactionUpdate?.transaction_id
            );
            updateList[index] = { ...res.data?.saleTransactionUpdate };
            setList(updateList);
            setOpened({ receipt: undefined, remittance: undefined });
            Notification.success({ message: "Updated sales receipt" });
          });
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    }
  };

  const onRemoveRecord = (id: string) => {
    const updateList = [...list];
    setList(updateList.filter((e) => e.transaction_id !== id));
    setSelectedLogs(undefined);
  };

  const checkRoles = (created_by: string | undefined) => {
    if (user.roles?.some((e) => e === WMS.Role.AdminDR)) return false;
    if (user.username === created_by) return false;
    return true;
  };

  const onScanDevice = (device: WMS.InventoryItem) => {
    if (!device.order_id)
      return Notification.error({
        message: `Serial: ${device.serial} sales not found`,
      });
    queryRecordSale({
      variables: {
        id: device.order_id,
      },
    }).then((res) => {
      setSelectedLogs(res.data.saleTransaction);
    });
  };

  const onRefund = (id: string) => {
    const updateList = [...list];
    const index = updateList.findIndex((e) => e.transaction_id === id);
    console.log("here", index);
    if (index === undefined || index === null || index < 0) {
      setSelectedLogs(undefined);
    } else {
      updateList[index] = { ...updateList[index], is_refunded: true };
      setList(updateList);
      setSelectedLogs({ ...updateList[index], is_refunded: true });
    }
  };

  const onUpdateAttachments = (type: string, record: WMS.SaleTransaction) => {
    if (type === "RECEIPT") {
      setOpened({ ...opened, receipt: record });
    } else {
      setOpened({ ...opened, remittance: record });
    }
  };

  const rows = list?.map((element, index) => (
    <tr onClick={() => setSelectedLogs(element)} key={`list-${index}`}>
      <td>{element.transaction_no}</td>
      <td>{element.warehouse_id}</td>
      <td>{element.created_by}</td>
      <td>{element.sales_expert}</td>
      <td>{element.cegid_no}</td>
      <td>
        {dayjs(Number((element?.date_created || 0) * 1000)).format(
          "MMM-DD-YYYY"
        )}
      </td>
      <td
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <SalesAttachments
          onViewAttachments={(imageUrl) => setIsViewSelectedIamge(imageUrl)}
          isDisable={checkRoles(`${element.created_by}`)}
          onSave={onSaveImage}
          recordSales={element}
          onUpdateAttachments={(type) => onUpdateAttachments(type, element)}
        />
      </td>
    </tr>
  ));

  const uploadImageModal = () => (
    <Modal
      title={`Upload ${opened.receipt ? "Receipt" : "Remittance Slip"}`}
      opened={opened.receipt || opened.remittance ? true : false}
      onClose={() => setOpened({ remittance: undefined, receipt: undefined })}
      size={700}
      centered
    >
      <Stack>
        <PreviewAttachedImage
          image={
            opened.receipt?.signature || opened.remittance?.remittance_slip
          }
        />
        <Uploader defaultImages={undefined} onSave={onSaveImage} />
      </Stack>
    </Modal>
  );

  return (
    <div>
      <LoadingOverlay visible={loading || loadingUpdate} />
      {uploadImageModal()}
      <ViewAttachments
        imageUrl={isViewSelectedIamge}
        opened={isViewSelectedIamge ? true : false}
        onClose={() => setIsViewSelectedIamge(undefined)}
      />
      <SalesLogsDetails
        user={`${user.username}`}
        onRemoveRecord={onRemoveRecord}
        details={selectedLogs}
        visible={selectedLogs ? true : false}
        onClose={() => setSelectedLogs(undefined)}
        onRefund={onRefund}
        isSales={true}
      />
      {user.username ? (
        <OrdersFilter
          isDateRange
          defaultValues={{
            warehouse: user?.office_ids ? `${user?.office_ids[0]}` : "PH01",
            date: {
              from: dayjs().startOf("week").format("YYYY-MM-DD"),
              to: dayjs().endOf("week").format("YYYY-MM-DD"),
            },
          }}
          onFilter={({ warehouse, date }) => {
            getSalesTransactionList(date, warehouse);
          }}
          customField={<SalesScanner onScan={onScanDevice} />}
        />
      ) : undefined}
      <br />
      <ScrollArea style={{ height: 800 }}>
        <Table
          highlightOnHover
          fontSize={width <= isTabletMobileView ? "xs" : "md"}
        >
          <thead>
            <tr>
              <th>
                <div className={classes.mobileTableTH}>Invoice ID</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Warehouse/Store</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Created By</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Sales Expert</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>CEGID No.</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Date Created</div>
              </th>
              <th>
                <div style={{ width: 300 }}>Action</div>
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
