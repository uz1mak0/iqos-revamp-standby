import { ScrollArea as MantineScrollArea } from "@mantine/core";

type ScrollAreaProps = {
  children?: React.ReactNode;
  scrollbarSize?: number;
  style?: React.CSSProperties;
};

export const ScrollArea = (props: ScrollAreaProps) => {
  return (
    <MantineScrollArea
      {...props}
      scrollbarSize={!props.scrollbarSize ? 20 : props.scrollbarSize}
    >
      {props.children}
    </MantineScrollArea>
  );
};
