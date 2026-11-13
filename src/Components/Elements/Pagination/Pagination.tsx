import React from "react";
import { Pagination as MantinePagination } from "@mantine/core";

type Props = {
  disabled?: boolean;
  initialPage?: number;
  onChange?: (page: number) => void;
  page?: number;
  pageSize?: number;
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "left" | "right" | "center";
  position?: "left" | "right" | "center" | "apart";
  total: number;
};

export const Pagination = ({ pageSize = 10, ...props }: Props) => {
  // const getPageTotal = () => {
  //     if (dataSize < pageSize) {
  //         return 1
  //     }else{
  //         const getInitialSize = Number(dataSize / pageSize)
  //         if (!Number.isInteger(getInitialSize)) {
  //             const newPageSize = Number(~~getInitialSize + 1)
  //             return newPageSize
  //         }else{
  //             return getInitialSize
  //         }
  //     }
  //  }
  return <MantinePagination {...props} />;
};
