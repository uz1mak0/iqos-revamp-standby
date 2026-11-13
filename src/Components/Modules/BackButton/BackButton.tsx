import React from "react";
import { ActionIcon, Group, Text } from "../../Elements";
import { ArrowLeft } from "tabler-icons-react";
import { useRouter } from "next/router";

type Props = {
  url: string;
  title: string;
  onClick?: () => void;
};

export const BackButton = (props: Props) => {
  const router = useRouter();
  return (
    <Group align="center">
      <ActionIcon
        onClick={() =>
          props.onClick ? props.onClick() : router.push(props.url)
        }
        radius={"md"}
        variant="default"
      >
        <ArrowLeft />
      </ActionIcon>
      <Text fz={"lg"} fw={700}>
        {props.title}
      </Text>
    </Group>
  );
};
