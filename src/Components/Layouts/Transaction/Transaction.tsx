import React from "react";
import { useRouter } from "next/router";
import { Transmittal } from "./Transmittal";
import { Transfer } from "./Transfer";
import { Pullout } from "./Pullout";
import { Return } from "./Return";
import { Reconcile } from "./Reconcile";
import { DirectTransfer } from "./DirectTransfer";
import { UOMConversion } from "./UOMConversion";
import { IndirectTransfer } from "./IndirectTransfer";

const Transaction = () => {
  const router = useRouter();
  const transactionRender = () => {
    switch (router?.query?.transaction) {
      case "transmittal":
        return <Transmittal />;
      case "transfer":
        return <Transfer />;
      case "pullout":
        return <Pullout />;
      case "return":
        return <Return />;
      case "reconcile":
        return <Reconcile />;
      case "direct_transfer":
        return <DirectTransfer />;
      case "conversion":
        return <UOMConversion />;

      case "indirect_transfer":
        return <IndirectTransfer />;
      default:
        break;
    }
  };
  return <div>{transactionRender()}</div>;
};

export default Transaction;
