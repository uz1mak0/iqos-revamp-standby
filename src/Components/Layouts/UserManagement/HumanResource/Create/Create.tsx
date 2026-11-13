import React, { useState } from "react";
import { Button, Menu, Modal } from "../../../../Elements";
import { Plus } from "tabler-icons-react";
import { create } from "domain";
import { HRForm } from "./HRForm";

interface Props {
  channel: string;
}

export const Create = (props: Props) => {
  const [createType, setCreateType] = useState<string | undefined>(undefined);
  const [opened, setOpened] = useState(false);

  const createTypeForm = () => {
    if (!createType) return <></>;
    switch (createType) {
      case "admin":
        return (
          <HRForm
            onClose={() => setOpened(false)}
            visible={opened}
            profile={undefined}
            channel={props.channel}
          />
        );
      default:
        return <></>;
    }
  };

  const onSelectForm = (type: string) => {
    setCreateType(type);
    setOpened(true);
  };
  return (
    <div>
      {createTypeForm()}
      <Button onClick={() => onSelectForm("admin")} rightIcon={<Plus />}>
        Create new HR User
      </Button>
    </div>
  );
};
