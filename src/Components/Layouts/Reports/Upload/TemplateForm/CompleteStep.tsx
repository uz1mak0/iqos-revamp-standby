import React from "react";
import { Flex, Text } from "@mantine/core";
import { IconDiscountCheck } from "@tabler/icons-react";

export const CompleteStep = () => {
  return (
    <div>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <IconDiscountCheck stroke={2} color="#12B886" size={180} />
        <Text size={"xl"} fw={700}>
          Validation Report Completed
        </Text>
      </Flex>
    </div>
  );
};
