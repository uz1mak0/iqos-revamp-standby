import { useLazyQuery } from "@apollo/client";
import React, { useRef } from "react";
import { getInventoryItem } from "../../../GraphQL/CodentifyScannerSchema";
import { Input } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { formatCodentify } from "../CodentifyScanner/Config";
import { Loader } from "@mantine/core";
import { WMS } from "../../../GraphQL";
import { channelAtom } from "../../../Store/StoreAtom";
import { useAtom } from "jotai";

type CodentifyProps =
  | {
      gtin: string;
      serial: string;
      sku: string;
    }
  | boolean;

type Props = {
  onScan: (device: WMS.InventoryItem) => void;
};

export const SalesScanner = (props: Props) => {
  const [refetchSerial, { data, loading: loading }] = useLazyQuery(
    getInventoryItem,
    { context: { clientName: "warehouse" }, fetchPolicy: "no-cache" }
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [channel] = useAtom(channelAtom);
  const onSubmit = (codentifyInput: string) => {
    if (!codentifyInput) {
      Notification.error({
        title: "Error",
        message: "Please add CODENTIFY/Serial",
      });
    } else {
      const codentify: CodentifyProps = formatCodentify(codentifyInput);
      var value: string;
      if (!codentify) {
        value = codentifyInput;
      } else {
        value = codentify.serial;
      }
      refetchSerial({
        variables: {
          serial: value,
        },
        fetchPolicy: "no-cache",
      })
        .then((res) => {
          if (!res.data.inventoryItem) {
            Notification.error({ message: `${value} not found` });
          } else {
            props.onScan(res.data.inventoryItem);
          }
        })
        .finally(() => {
          if (inputRef.current?.value) {
            inputRef.current.value = "";
          }
        });
    }
  };

  return (
    <div>
      
        <Input
          innerref={inputRef}
          rightSection={loading ? <Loader size={20} /> : undefined}
          onKeyPress={(e) =>
            e.key === "Enter" ? onSubmit(e.target.value) : undefined
          }
          placeholder="Enter CODENTIFY/Serial"
          description="Scan CODENTIFY/Serial to search sales"
          disabled={loading}
        />

    </div>
  );
};
