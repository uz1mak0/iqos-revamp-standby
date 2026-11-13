import React from "react";
import { LoadingOverlay as MantineLoadingOverlay } from "@mantine/core";

type Props = {
  overlayBlur?: number;
  overlayOpacity?: number;
  visible: boolean;
  overlayColor?: string;
  children?: React.ReactNode;
};

export const LoadingOverlay = (props: Props) => {
  return (
    <MantineLoadingOverlay
      {...props}
      overlayBlur={props?.overlayBlur ? props?.overlayBlur : 2}
      zIndex={100}
    />
  );
};
