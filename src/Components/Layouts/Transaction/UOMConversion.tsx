import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { useForm } from "@mantine/form";
import {
  Button,
  DatePicker,
  Grid,
  Group,
  Input,
  Paper,
  Stack,
  TimeInput,
} from "../../Elements";
import { useStyles } from "./Transaction.syles";
import { useRouter } from "next/router";
import { UOMConversionTable } from "./UOMConversionTable";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { WMS } from "../../../GraphQL";
import { checkScanRestrictions } from "../CodentifyScanner/Config";
import Notification from "../../Elements/Notification/Notification";
import { UOMDetails, ValuesProps } from "./UOMDetails";
import { getItemStocks } from "../../../GraphQL/OrderManagementSchema";
import {
  getConversion,
  updateUOMConversion,
} from "../../../GraphQL/TransactionSchema";
import dayjs from "dayjs";
import { Check } from "tabler-icons-react";
import { Autocomplete } from "@mantine/core";

export const UOMConversion = () => {
  const [channel] = useAtom(channelAtom);
  const [userRoles] = useAtom(rolesAtom);
  const [disable, setDisable] = useState(true);
  const [user] = useAtom(userAtom);
  const [scannedGTIN, setScannedGTIN] = useState<{
    item: WMS.Sku | undefined;
    quantity: number;
  }>({
    item: undefined,
    quantity: 0,
  });
  const [skuList, setSKUList] = useState<WMS.Sku[]>([]);
  const [transaction, setTransaction] = useState<WMS.Conversion>({});
  const router = useRouter();
  const { classes } = useStyles();
  const { loading, data } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel === "INDIRECT_CHANNEL" ? "DIRECT_RETAIL" : channel ,
    },
  });

  const [queryConversion] = useLazyQuery(getConversion, {
    context: { clientName: "warehouse" },
  });

  const [conversioUOMUpdate] = useMutation(updateUOMConversion, {
    context: { clientName: "warehouse" },
  });

  const [checkStocks, { loading: loadingStocks }] = useLazyQuery(
    getItemStocks,
    { context: { clientName: "warehouse" } }
  );

  const form = useForm({
    initialValues: {
      remarks: "",
      invoice_id: "",
      date: new Date(),
      time: new Date(),
      updated_by: user.username,
      gtin: "",
    },
    validate: {
      invoice_id: (value) => (!value ? "Please add Invoice ID!" : null),
      remarks: (value) => (!value ? "Please add Remarks!" : null),
    },
  });

  useEffect(() => {
    if (data) {
      setSKUList(
        data.skus.items.filter(
          (e: WMS.Sku) =>
            e.type == WMS.SkuType.Heets || e.type === WMS.SkuType.Zyn
        )
      );
      loadConversion();
    }
  }, [data]);

  const loadConversion = () => {
    queryConversion({
      variables: {
        id: router.query.transactionId,
      },
      fetchPolicy: "no-cache",
    })
      .then(({ data }) => {
        if (data?.conversion) {
          form.setValues({
            remarks: data?.conversion.remarks || "",
            invoice_id: data?.conversion?.invoice_id || "",
            updated_by: data?.conversion?.updated_by || "",
            date: new Date(data?.conversion?.date) || "",
            time:
              dayjs(
                `${data?.conversion?.date} ${data?.conversion?.time}`
              ).toDate() || "",
          });
          setDisable(data?.conversion?.status === "COMPLETED" ? true : false);
          setTransaction(data?.conversion);
        }
      })
      .catch((e) => {
        Notification.error({ title: "Error", message: e.message });
      });
  };

  console.log(transaction);
  const onCheckWarehouseAvailableStock = (item: WMS.Sku) => {
    checkStocks({
      variables: {
        warehouse_id: router.query.warehouse,
        gtin: item.gtin,
        type: item.type,
      },
      fetchPolicy: "no-cache",
    }).then((res) => {
      if (res.data.itemStocks.quantity) {
        setScannedGTIN({
          item: item,
          quantity: res.data.itemStocks.quantity,
        });
      } else {
        return Notification.error({
          message: `${item.gtin} not enough stocks or expired`,
        });
      }
    });
  };

  const onScan = () => {
    const gtin = form.values.gtin;
    form.setValues({ gtin: "" });
    const item = skuList.find((e: WMS.Sku) => e.gtin === gtin);
    if (!item) {
      return Notification.error({
        title: "Error",
        message: `${gtin}: SKU/GTIN not found`,
      });
    }
    if (checkScanRestrictions(`${gtin}`))
      return Notification.error({
        message: "Invalid GTIN format",
      });
    onCheckWarehouseAvailableStock(item);
  };

  const onUpdateConversionForm = () => {
    conversioUOMUpdate({
      variables: {
        input: {
          id: transaction?.id,
          remarks: form.values.remarks,
          invoice_id: form.values.invoice_id,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.conversionUpdate);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onConvertUOM = (transaction: WMS.Conversion) => {
    setTransaction(transaction);
  };

  const onVoid = (transaction: WMS.Conversion) => {
    setTransaction(transaction);
  };

  const onSubmitTransaction = () => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields" });
    conversioUOMUpdate({
      variables: {
        input: {
          status: "COMPLETED",
          id: transaction?.id,
          remarks: form.values.remarks,
          invoice_id: form.values.invoice_id,
        },
      },
    })
      .then((res) => {
        router.push(`/inventory/warehouse?warehouse=${router.query.warehouse}`);
        Notification.success({ message: "Conversion Saved" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  return (
    <Stack>
      <UOMDetails
        conversionType={
          Array.isArray(router.query.conversionType)
            ? router.query.conversionType[0] 
            : router.query.conversionType
        }
        username={user.username}
        transaction={transaction}
        channel={channel}
        scannedGTIN={scannedGTIN}
        onConvertUOM={onConvertUOM}
        onClose={() =>
          setScannedGTIN({
            item: undefined,
            quantity: 0,
          })
        }
        skus={skuList.filter((e) => e.gtin !== scannedGTIN?.item?.gtin)}
      />
      <Paper radius={8}>
        <div className={classes.transactionCard}>
          <h2>{router.query.warehouse}: UOM Conversion</h2>
          <form>
            <Grid gutter={"lg"}>
              <Grid.Col span={4}>
                <Input
                  disabled={disable}
                  {...form.getInputProps("remarks")}
                  label="Remarks"
                  placeholder="Enter Remarks"
                  onBlur={() => onUpdateConversionForm()}
                  required
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Input
                  disabled={disable}
                  {...form.getInputProps("invoice_id")}
                  label="Invoice ID"
                  placeholder="Enter Invoice ID"
                  onBlur={() => onUpdateConversionForm()}
                  required
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <DatePicker
                  {...form.getInputProps("date")}
                  label="Date"
                  disabled
                />
              </Grid.Col>
              <Grid.Col span={1}>
                <TimeInput
                  format="12"
                  {...form.getInputProps("time")}
                  label="Time"
                  disabled
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Input
                  {...form.getInputProps("updated_by")}
                  label="Updated By"
                  required
                  disabled
                />
              </Grid.Col>
            </Grid>
            {/* <Input
              disabled={disable}
              {...form.getInputProps("gtin")}
              label="GTIN"
              onKeyPress={(e) => (e.key === "Enter" ? onScan() : undefined)}
              required
              placeholder="Scan GTIN to Proceed with Conversion"
            /> */}
            <Autocomplete
              {...form.getInputProps("gtin")}
              onChange={(value) => form.setFieldValue("gtin", value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onScan();
                  form.setFieldValue("gtin", "");
                }
              }}
              data={
                data?.skus?.items?.map((sku: WMS.Sku, index: Number) => ({
                  value: `${sku.gtin}`,
                  label: `${sku.gtin?.replace("_PMI", "")} - ${
                    sku.description
                  } - ${sku.unit_of_measure}`,
                  description: sku.description,
                })) || []
              }
              placeholder="GTIN"
              description="GTIN"
              filter={(value, item) =>
                item.label.toLowerCase().includes(value.toLowerCase())
              }
              limit={data?.skus?.items?.length || 100}
              maxDropdownHeight={200}
            />
          </form>
        </div>
      </Paper>
      <UOMConversionTable
        disabled={disable}
        onVoid={onVoid}
        channel={channel}
        transaction={transaction}
        skus={skuList}
        list={transaction.batch_items}
      />
      <Group position="center">
        <Button
          loading={loading}
          disabled={
            (transaction?.batch_items?.length || 0) <= 0 ||
            !transaction?.batch_items ||
            disable
          }
          onClick={() => onSubmitTransaction()}
          icon={<Check />}
        >
          Done
        </Button>
      </Group>
    </Stack>
  );
};
