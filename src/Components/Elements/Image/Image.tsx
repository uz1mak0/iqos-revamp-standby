import React from "react";
import { Image as MantineImage } from "@mantine/core";

type Props = {
  alt?: string;
  height?: string | number;
  src: string;
  width?: string | number;
};

export const Image = (props: Props) => {
  return <MantineImage {...props} />;
};
