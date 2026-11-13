import { Burger } from "@mantine/core";
import { useAtom } from "jotai";
import React from "react";
import { burgernAtom } from "../../../../Store/StoreAtom";

export const SiderMenu = () => {
  const [opened, setOpened] = useAtom(burgernAtom);
  return (
    <Burger
      color="white"
      opened={opened}
      onClick={() => setOpened(!opened)}
      size="sm"
      ml="xl"
    />
  );
};
