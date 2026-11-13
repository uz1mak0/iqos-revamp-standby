import { useMutation } from "@apollo/client";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { Plus, Send, X } from "tabler-icons-react";
import { userAtom, channelAtom, rolesAtom } from "../../../Store/StoreAtom";
import {
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Stack,
  Uploader,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { RecordInformation } from "./RecordInformation";
import { RecordSaleItems, RecordSalesItemsProps } from "./RecordSaleItems";
import Amplify, { Storage } from "../../../Utilities/Backend";
import {
  guidedTrialCreate,
  recordSalesTransaction,
} from "../../../GraphQL/RecordSalesSchema";
import { WMS } from "../../../GraphQL";
import { useRouter } from "next/router";
import { useViewportSize } from "@mantine/hooks";
import { isTabletMobileView } from "../../../Utilities/Formatter";
import { BackButton } from "../../Modules/BackButton/BackButton";
type Props = {
  isGT?: boolean;
  onCancelRecordSale?: () => void;
  onSubmitGTRS?: () => void;
  gtFormValues?: {
    // last_name: string;
    // first_name: string;
    phone_number: string;
    warehouse_id: string;
    scanned_items: WMS.LineItemInput[];
    device: string;
    gt_type: string;
  };
};

export const RecordSale = (props: Props) => {
  const [channel] = useAtom(channelAtom);
  const [userRoles] = useAtom(rolesAtom);

  const { height, width } = useViewportSize();
  const [user] = useAtom(userAtom);
  const initialItems: RecordSalesItemsProps[] = [];
  const initialImage: FileWithPath[] = [];
  const [onRecordSale, { loading: loadingRecordSale }] = useMutation(
    recordSalesTransaction,
    { context: { clientName: "warehouse" } },
  );
  const [onGuidedTrial, { loading: loadingGuidedTrial }] = useMutation(
    guidedTrialCreate,
    { context: { clientName: "warehouse" } },
  );

  const [opened, setOpened] = useState({
    receipt: false,
    remittance: false,
  });
  type AttachmentType = "receipt" | "remittance" | "additional_attachment";
  const [openedType, setOpenedType] = useState<AttachmentType | null>(null);
  const router = useRouter();
  const generateIRId = () => `IR${dayjs().format("DDMMYYHHmm")}`;
  const form = useForm({
    initialValues: {
      warehouse_id: "",
      date_created: new Date(),
      transaction_number: "",
      cegid_no: "",
      type: "Sellable",
      remarks: "",
      created_by: "",
      sales_expert: "",
      payment_type: "",
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      scanned_items: initialItems,
      scanner: "",
      receipt: initialImage,
      remittance: initialImage,
      additional_attachment: initialImage,
      return_notes: "",
      lead_source: "",
      club_status: "",
      link_tags: [] as string[],
      ir_error_tags: [] as string[],
      incident_report_id: generateIRId(),
    },
    validate: {
      transaction_number: (value) => (!value ? "Please add Invoice ID!" : null),

      warehouse_id: (value) => (!value ? "Please select Warehouse!" : null),
      date_created: (value) => (!value ? "Please select Date!" : null),
      payment_type: (value) => (!value ? "Please select Payment Type!" : null),
      sales_expert: (value) => (!value ? "Please select Sales Expert!" : null),
      type: (value) => (!value ? "Please select type!" : null),
      remarks: (value) =>
        channel != "INDIRECT_CHANNEL"
          ? !value
            ? "Please add Remarks!"
            : null
          : null,
      return_notes: (value) =>
        channel != "INDIRECT_CHANNEL"
          ? !value
            ? "Please add notes"
            : null
          : null,
      lead_source: (value) =>
        channel != "INDIRECT_CHANNEL"
          ? !value
            ? "Please add lead source"
            : null
          : null,
      club_status: (value) =>
        channel != "INDIRECT_CHANNEL"
          ? !value
            ? "Please add club status"
            : null
          : null,
    },
  });

  useEffect(() => {
    if (user.username) {
      form.setFieldValue("created_by", user.username);
    }

    const isKitchenCityUser =
      user.office_id === "PH1204" ||
      user.office_ids?.includes("PH1204") ||
      user.office_name?.toLowerCase().includes("kitchen city");

    if (user.office_id && isKitchenCityUser) {
      form.setFieldValue("warehouse_id", user.office_id);
    } else if (props.isGT && props.gtFormValues?.warehouse_id) {
      form.setFieldValue("warehouse_id", props.gtFormValues?.warehouse_id);
    }
  }, [user, userRoles, props.isGT]);

  const uploadImage = async (file: FileWithPath, type: string) => {
    if (file) {
      var key = `${form.values?.warehouse_id}/${type}/${form.values?.transaction_number
        }.${file.type.split("/")[1]}`; //sig.key;
      return Storage.put(`retail/${key}`, file, {
        level: "public",
        contentType: file.type,
      })
        .then(() => {
          return {
            bucket: process.env.NEXT_PUBLIC_DATA_BUCKET,
            key: `public/retail/${key}`,
            region: process.env.NEXT_PUBLIC_REGION,
          };
        })
        .catch((e) => {
          return undefined;
        });
    } else {
      return undefined;
    }
  };

  const onSave = async () => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });
    if (form.values.scanned_items.some((e) => e.quantity < 0))
      return Notification.error({
        message: "Scanned item(s) has invalid qty!",
      });
    if (form.values.scanned_items.length == 0)
      return Notification.error({ message: "Please add scanned items!" });
    if (form.values.scanned_items.some((e) => !e.quantity || e.quantity <= 0))
      return Notification.error({
        message: "Quantity cannot be less than or equal to zero!",
      });
    if (
      form.values.scanned_items.some(
        (e) => !e.inputs && e?.sku?.type === "DEVICES",
      )
    )
      return Notification.error({
        message: "Scanned item(s) has empty input!",
      });
    const receipt = await uploadImage(form.values.receipt[0], "RECEIPT");
    const remittance = await uploadImage(
      form.values.remittance[0],
      "REMITTANCE",
    );
    const additionalAttachment = await uploadImage(
      form.values.additional_attachment[0],
      "ADDITIONAL_ATTACHMENT",
    );

    if (!remittance && form.values.remittance.length > 0)
      return Notification.error({
        message: "Failed to upload remittance. Please try again",
      });

    if (!receipt && form.values.receipt.length > 0)
      return Notification.error({
        message: "Failed to upload receipt. Please try again",
      });

    if (!additionalAttachment && form.values.additional_attachment.length > 0)
      return Notification.error({
        message: "Failed to upload additional attachment. Please try again",
      });

    const salesTransactionInputs = {
      transaction_no: form.values.transaction_number,
      warehouse_id: form.values.warehouse_id,
      remarks: form.values.remarks,
      created_by: form.values.created_by,
      cegid_no: form.values.cegid_no,
      type: form.values.type,
      sales_expert: form.values.sales_expert,
      date_created:
        dayjs().unix() -
        dayjs().startOf("day").unix() +
        dayjs(form.values.date_created).startOf("day").unix(),
      payment_type: form.values.payment_type,
      return_notes: form.values.return_notes,
      lead_source:
        channel != "INDIRECT_CHANNEL" ? form.values.lead_source : null,
      club_status:
        channel != "INDIRECT_CHANNEL" ? form.values.club_status : null,
      link_tags:
        channel === "INDIRECT_CHANNEL" ? form.values.link_tags : undefined,
      ir_error_tags:
        channel === "INDIRECT_CHANNEL" ? form.values.ir_error_tags : undefined,
      incident_report_id:
        channel === "INDIRECT_CHANNEL" && form.values.ir_error_tags.length > 0
          ? form.values.incident_report_id
          : undefined,
      customer_information: {
        email: form.values.email,
        mobile_number: `+63${form.values.phone_number}`,
      },
      total_price: Number(
        form.values.scanned_items.reduce(
          (a, item) => a + (item?.price || 0),
          0,
        ) -
        form.values.scanned_items
          .filter((item) => item?.promo_selected?.discount_type === "CART")
          .reduce((a, item) => a + (item?.promo_selected?.discount || 0), 0),
      ),
      items: form.values.scanned_items.map((item) => {
        return {
          gtin: item.gtin,
          quantity: item.quantity,
          discount: item.promo_discount,
          price: item.price,
          inputs: item?.sku?.type === "DEVICES" ? item.inputs : [],
          serials: item?.sku?.type === "DEVICES" ? item.inputs : [],
          sku: {
            name: item?.sku?.description,
            description: item.sku?.description,
            gtin: item.gtin,
            sku: item.sku?.sku,
            unit_of_measure: item?.sku?.unit_of_measure,
            type: item?.sku?.type,
            price: item.sku?.price,
            promo: item.promo_selected
              ? {
                code: item.promo_selected?.code,
                name: item.promo_selected?.name,
                description: item.promo_selected?.description,
                status: item.promo_selected?.status,
                type: item.promo_selected?.type,
                discount_type: item.promo_selected?.discount_type,
                discount: item.promo_selected.discount,
              }
              : undefined,
          },
        };
      }),
      signature: receipt,
      remittance_slip: remittance,
      additional_attachment: additionalAttachment,
    };

    if (props.isGT) {
      onGuidedTrial({
        variables: {
          input: {
            type: "GT_RS",
            date_created: dayjs().unix(),
            warehouse_id: props?.gtFormValues?.warehouse_id || "",
            sgt: props?.gtFormValues?.gt_type === "SGT" ? true : false,
            first_time_gt:
              props?.gtFormValues?.gt_type === "FTGT" ? false : true,
            created_by: user.username,
            device: props.gtFormValues?.device,
            items: props.gtFormValues?.scanned_items.map((e) => ({
              ...e,
              sku: { ...e.sku, channel: "DIRECT_RETAIL" },
            })),
            customer_information: {
              mobile_number: `+63${form.values.phone_number}`,
            },
            sales_transaction: salesTransactionInputs,
          },
        },
      })
        .then((res) => {
          form.reset();
          props.onSubmitGTRS ? props.onSubmitGTRS() : undefined;
          const hasErrorTags = form.values.ir_error_tags.length > 0;
          Notification.success({
            message: hasErrorTags
              ? `An Incident Report ID has been issued for your transaction error.`
              : "Guided trial - Record Sale created",
          });
          router.push("/record-sales/customer-monitoring");
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    } else {
      onRecordSale({
        variables: {
          input: salesTransactionInputs,
        },
      })
        .then(() => {
          Notification.success({ message: "Record Sales created" });
          form.reset();
          form.setFieldValue("created_by", user?.username || "");
          form.setFieldValue("incident_report_id", generateIRId());
        })
        .catch((e) => {
          const gqlError = e?.graphQLErrors?.[0];

          if (
            gqlError?.errorType?.includes("ConditionalCheckFailedException")
          ) {
            Notification.error({ message: "Invoice ID already exist" });
          } else {
            Notification.error({
              message: gqlError?.message || e.message || "Something went wrong",
            });
          }
        });
    }
  };

  const attachmentTitles: Record<AttachmentType, string> = {
    receipt: "Receipt",
    remittance: "Remittance Slip",
    additional_attachment: "Additional Attachment",
  };

  const onRemoveImage = () => {
    if (!openedType) return;
    form.setFieldValue(openedType, []);
  };

  const onSaveImage = (file: FileWithPath[]) => {
    if (!openedType) return;
    form.setFieldValue(openedType, file);
    setOpenedType(null);
  };

  const uploadImageModal = () => (
    <Modal
      title={`Upload ${openedType ? attachmentTitles[openedType] : ""}`}
      opened={!!openedType}
      onClose={() => setOpenedType(null)}
      size={700}
      centered
    >
      {openedType && (
        <Uploader
          key={openedType} // resets the uploader when switching types
          onRemove={onRemoveImage}
          defaultImages={form.values[openedType]}
          onSave={onSaveImage}
          maxFiles={1}
        />
      )}
    </Modal>
  );
  return (
    <Stack>
      {uploadImageModal()}
      <LoadingOverlay visible={loadingRecordSale} />
      {!props.isGT && <BackButton title="Home" url="/" />}
      <form>
        <RecordInformation isGT={props.isGT} form={form} />
        <RecordSaleItems form={form} />
        <Paper radius={5}>
          <Grid justify="space-between">
            <Grid.Col md={6} lg={5}>
              <Group>
                {props.isGT ? (
                  <Button
                    fullWidth={width <= isTabletMobileView}
                    loading={loadingRecordSale}
                    onClick={() =>
                      props?.onCancelRecordSale
                        ? props?.onCancelRecordSale()
                        : undefined
                    }
                    icon={<X />}
                    customType="secondary"
                  >
                    Cancel
                  </Button>
                ) : undefined}

                <Button
                  fullWidth={width <= isTabletMobileView}
                  onClick={() => setOpenedType("receipt")}
                  icon={<Plus />}
                >
                  Receipt
                </Button>

                {form.values.warehouse_id != "PH1204" ? (
                  <Button
                    fullWidth={width <= isTabletMobileView}
                    onClick={() => setOpenedType("remittance")}
                    icon={<Plus />}
                    customType="custom"
                    color="blue"
                  >
                    Remittance
                  </Button>
                ) : undefined}

                {channel == WMS.ChannelType.IndirectChannel ? (
                  <Button
                    fullWidth={width <= isTabletMobileView}
                    onClick={() => setOpenedType("additional_attachment")}
                    customType="secondary"
                    icon={<Plus />}
                  >
                    Additional Attachment
                  </Button>
                ) : undefined}
              </Group>
            </Grid.Col>
            <Grid.Col md={6} lg={3}>
              <Group position="right">
                <Button
                  fullWidth={width <= isTabletMobileView}
                  loading={loadingRecordSale}
                  onClick={() => onSave()}
                  icon={<Send />}
                  customType="primary"
                >
                  Record Sale
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Paper>
      </form>
    </Stack>
  );
};
