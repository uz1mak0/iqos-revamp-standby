import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Uploader,
  Badge,
  Group,
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
import { rolesAtom, userAtom, channelAtom } from "../../../Store/StoreAtom";
import Amplify, { Storage } from "../../../Utilities/Backend";
import Notification from "../../Elements/Notification/Notification";
import { SalesScanner } from "./SalesScanner";
import { useViewportSize } from "@mantine/hooks";
import { useStyles } from "./Sales.styles";
import { isTabletMobileView } from "../../../Utilities/Formatter";
import { SalesAttachments } from "./SalesAttachments";
import ViewAttachments from "./ViewAttachments";
import { PreviewAttachedImage } from "../RecordSales/PreviewAttachedImage";

type FilterProps = {
  warehouse_id: string | undefined | null;
  date: {
    from: string;
    to: string;
  };
};

export const SalesList = () => {
  const [channel] = useAtom(channelAtom);
  const { classes } = useStyles();
  const [selectedLogs, setSelectedLogs] = useState<WMS.SaleTransaction>();
  const [list, setList] = useState<WMS.SaleTransaction[]>([]);
  const { height, width } = useViewportSize();
  const [querySalesTransactions, { loading: loading }] = useLazyQuery(
    getSalesTransactions,
    { context: { clientName: "warehouse" } },
  );
  const [queryRecordSale, { loading: loadingRecordSale }] = useLazyQuery(
    getSalesTransaction,
    { context: { clientName: "warehouse" } },
  );
  const [updateSaleTransaction, { loading: loadingUpdate }] = useMutation(
    saleTransactionUpdate,
    { context: { clientName: "warehouse" } },
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

  const isIndirectChannel = channel === "INDIRECT_CHANNEL";

  const ERROR_TAG_LABELS: Record<string, string> = {
    EGM_ERROR: "EGM Error",
    SSR_ERROR: "SSR Error",
    SAMPLING_REG_ERROR: "Sampling Reg Error",
    HOME_REGISTRATION: "Home Registration",
    LINK_VIA_CEAPP: "Link via Ceapp",
  };

  const [isViewSelectedIamge, setIsViewSelectedIamge] =
    useState<string | undefined>(undefined);
  const [opened, setOpened] = useState<{
    receipt: WMS.SaleTransaction | undefined;
    remittance: WMS.SaleTransaction | undefined;
    additional_attachment: WMS.SaleTransaction | undefined;
  }>({
    receipt: undefined,
    remittance: undefined,
    additional_attachment: undefined,
  });

  useEffect(() => {
    if (user.username && user.office_ids) {
      getSalesTransactionList(
        filters.date,
        user?.office_ids ? user?.office_ids[0] : user.office_id,
      );
    }
  }, [user, roles]);

  const getSalesTransactionList = (
    date: { from: string; to: string },
    warehouse_id: string | undefined | null,
  ) => {
    if (!warehouse_id) return;
    querySalesTransactions({
      variables: {
        warehouse_id: warehouse_id,
        date_filter: date
          ? {
              from: Number(
                dayjs(date.from, "YYYY-MM-DD").startOf("day").unix(),
              ),
              to: Number(dayjs(date.to, "YYYY-MM-DD").endOf("day").unix()),
            }
          : {
              from: Number(
                dayjs(filters.date.from, "YYYY-MM-DD").startOf("day").unix(),
              ),
              to: Number(
                dayjs(filters.date.to, "YYYY-MM-DD").endOf("day").unix(),
              ),
            },
      },
    }).then((res) => {
      const salesList: WMS.SaleTransaction[] =
        res?.data?.saleTransactions?.items;

      if (channel != "INDIRECT_CHANNEL") {
        setList(salesList?.filter((e) => e.type === "Sellable"));
      } else {
        setList(
          salesList?.filter(
            (e) =>
              e.type === "Sampling" ||
              e.type === "GuidedTrial" ||
              e.type === "Sellable" ||
              e.type === "Sales" ||
              e.type === "Device Sales",
          ),
        );
      }

      setFilters({
        warehouse_id: warehouse_id,
        date: date,
      });
    });
  };

  const closeUploadModal = () =>
    setOpened({
      receipt: undefined,
      remittance: undefined,
      additional_attachment: undefined,
    });

  const onSaveImage = (file: FileWithPath[]) => {
    if (file.length === 0) return;

    const record =
      opened.receipt || opened.remittance || opened.additional_attachment;
    if (!record) return;

    const type = opened.receipt
      ? "RECEIPT"
      : opened.remittance
      ? "REMITTANCE"
      : "ADDITIONAL_ATTACHMENT";

    const { warehouse_id, transaction_id, transaction_no } = record;

    const newKey = `${warehouse_id}/${type}/${transaction_no}_${dayjs().unix()}.${
      file[0].type.split("/")[1]
    }`;
    const s3Objects = {
      bucket: process.env.NEXT_PUBLIC_DATA_BUCKET,
      key: `public/retail/${newKey}`,
      region: process.env.NEXT_PUBLIC_REGION,
    };

    const input =
      type === "RECEIPT"
        ? { signature: s3Objects }
        : type === "REMITTANCE"
        ? { remittance_slip: s3Objects }
        : { additional_attachment: s3Objects };

    Storage.put(`retail/${newKey}`, file[0], {
      level: "public",
      contentType: file[0].type,
    })
      .then(() => {
        updateSaleTransaction({
          variables: { transaction_id, input },
        }).then((res) => {
          const updateList = [...list];
          const index = updateList.findIndex(
            (e) =>
              e.transaction_id ===
              res.data?.saleTransactionUpdate?.transaction_id,
          );
          updateList[index] = { ...res.data?.saleTransactionUpdate };
          setList(updateList);
          closeUploadModal();
          Notification.success({ message: "Attachment updated" });
        });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onRemoveRecord = (id: string) => {
    const updateList = [...list];
    setList(updateList.filter((e) => e.transaction_id !== id));
    setSelectedLogs(undefined);
  };

  const checkRoles = (created_by: string | undefined) => {
    if (
      user.roles?.some((e) => e === WMS.Role.AdminDC || e === WMS.Role.AdminDR)
    )
      return false;
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
    if (index === undefined || index === null || index < 0) {
      setSelectedLogs(undefined);
    } else {
      updateList[index] = { ...updateList[index], is_refunded: true };
      setList(updateList);
      setSelectedLogs({ ...updateList[index], is_refunded: true });
    }
  };

  const onUpdateAttachments = (type: string, record: WMS.SaleTransaction) => {
    closeUploadModal();
    if (type === "RECEIPT") {
      setOpened({
        receipt: record,
        remittance: undefined,
        additional_attachment: undefined,
      });
    } else if (type === "REMITTANCE") {
      setOpened({
        receipt: undefined,
        remittance: record,
        additional_attachment: undefined,
      });
    } else if (type === "ADDITIONAL_ATTACHMENT" && isIndirectChannel) {
      setOpened({
        receipt: undefined,
        remittance: undefined,
        additional_attachment: record,
      });
    }
  };

  const rows = list?.map((element, index) => (
    <tr onClick={() => setSelectedLogs(element)} key={`list-${index}`}>
      {channel === "INDIRECT_CHANNEL" ? (
        <td>
          <Group spacing={4}>
            {element.ir_error_tags?.map((tag) => (
              <Badge key={`${tag}`} color="red" variant="dot" size="xs">
                {ERROR_TAG_LABELS[`${tag}`] ?? tag}
              </Badge>
            ))}
          </Group>
        </td>
      ) : (
        ""
      )}
      <td>{element.transaction_no}</td>
      <td>{element.warehouse_id}</td>
      <td>{element.created_by}</td>
      <td>{element.sales_expert}</td>
      {channel != "INDIRECT_CHANNEL" ? <td>{element.cegid_no}</td> : ""}
      <td>
        {dayjs(Number((element?.date_created || 0) * 1000)).format(
          "MMM-DD-YYYY",
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
          showAdditionalAttachment={isIndirectChannel}
          onUpdateAttachments={(type) => onUpdateAttachments(type, element)}
        />
      </td>
    </tr>
  ));

  const uploadImageModal = () => {
    const isOpen =
      !!opened.receipt || !!opened.remittance || !!opened.additional_attachment;

    const title = opened.receipt
      ? "Receipt"
      : opened.remittance
      ? "Remittance Slip"
      : "Additional Attachment";

    return (
      <Modal
        title={`Upload ${title}`}
        opened={isOpen}
        onClose={closeUploadModal}
        size={700}
        centered
      >
        <Stack>
          <PreviewAttachedImage
            image={
              opened.receipt?.signature ||
              opened.remittance?.remittance_slip ||
              opened.additional_attachment?.additional_attachment
            }
          />
          <Uploader
            defaultImages={undefined}
            onSave={onSaveImage}
            maxFiles={1}
          />
        </Stack>
      </Modal>
    );
  };

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
            warehouse: roles.isEcommUser || roles.isEcomAdmin
              ? "PH8012"
              : user?.office_ids
              ? `${user?.office_ids[0]}`
              : "PH01",
            date: {
              from: dayjs().startOf("week").format("YYYY-MM-DD"),
              to: dayjs().endOf("week").format("YYYY-MM-DD"),
            },
          }}
          onFilter={({ warehouse, date }) => {
            getSalesTransactionList(date, warehouse);
          }}
          customField={
            channel != "INDIRECT_CHANNEL" ? (
              <SalesScanner onScan={onScanDevice} />
            ) : undefined
          }
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
              {channel === "INDIRECT_CHANNEL" ? (
                <th>
                  <div className={classes.mobileTableTH}>Error Tagging</div>
                </th>
              ) : (
                ""
              )}
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
              {channel != "INDIRECT_CHANNEL" ? (
                <th>
                  <div className={classes.mobileTableTH}>CEGID No.</div>
                </th>
              ) : (
                ""
              )}
              <th>
                <div className={classes.mobileTableTH}>Date Created</div>
              </th>
              <th>
                <div>Action</div>
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
