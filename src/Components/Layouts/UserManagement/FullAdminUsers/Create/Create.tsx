import React, { useState } from "react";
import { Button, Menu, Modal } from "../../../../Elements";
import { ChevronDown, Plus } from "tabler-icons-react";
import { create } from "domain";
import { FullAdminForm } from "./FullAdminForm";

export const Create = () => {
  const [opened, setOpened] = useState(false);

  return (
    <div>
      <FullAdminForm
        visible={opened}
        onClose={() => setOpened(false)}
        profile={undefined}
      />

      <div>
        <Button icon={<Plus />} onClick={() => setOpened(true)}>
          Create User
        </Button>
      </div>
    </div>
  );
};
