import React from "react";
import { WMS } from "../../../GraphQL";
import { ActionIcon, Button, Menu } from "../../Elements";
import { FileWithPath } from "@mantine/dropzone";

import { IconDotsVertical, IconNews, IconPlus } from "@tabler/icons-react";
import { Group } from "@mantine/core";

type Props = {
  recordSales: WMS.SaleTransaction;
  isDisable: boolean;
  showAdditionalAttachment?: boolean; // new: true only for INDIRECT_CHANNEL
  onSave: (
    file: FileWithPath[],
    sales: WMS.SaleTransaction | undefined,
    type: string | undefined,
  ) => void;
  onViewAttachments: (imageUrl: string) => void;
  onUpdateAttachments: (type: string) => void;
};

export const SalesAttachments = (props: Props) => {
  const { recordSales, showAdditionalAttachment } = props;

  const viewAttachment =
    (file?: { bucket?: string | null; key?: string | null } | null) =>
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      props.onViewAttachments(`${file?.bucket}/${file?.key}`);
    };

  return (
    <Group>
      <Group spacing={"xs"}>
        {recordSales.signature ? (
          <Button
            variant="light"
            onClick={viewAttachment(recordSales.signature)}
            disabled={!recordSales.signature.key}
            icon={<IconNews size={16} />}
            customType="custom"
          >
            Receipt
          </Button>
        ) : undefined}

        {recordSales.remittance_slip ? (
          <Button
            variant="light"
            onClick={viewAttachment(recordSales.remittance_slip)}
            disabled={!recordSales.remittance_slip.key}
            icon={<IconNews size={16} />}
            customType="custom"
            color="yellow"
          >
            Slip
          </Button>
        ) : undefined}

        {showAdditionalAttachment && recordSales.additional_attachment ? (
          <Button
            variant="light"
            onClick={viewAttachment(recordSales.additional_attachment)}
            disabled={!recordSales.additional_attachment.key}
            icon={<IconNews size={16} />}
            customType="custom"
            color="teal"
          >
            Additional
          </Button>
        ) : undefined}
      </Group>

      <Menu position="bottom-end">
        <Menu.Target>
          <div>
            <ActionIcon radius={20} variant="default">
              <IconDotsVertical />
            </ActionIcon>
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => props.onUpdateAttachments("RECEIPT")}
            icon={<IconPlus />}
          >
            Receipt
          </Menu.Item>
          <Menu.Item
            onClick={() => props.onUpdateAttachments("REMITTANCE")}
            icon={<IconPlus />}
          >
            Remittance
          </Menu.Item>
          {showAdditionalAttachment && (
            <Menu.Item
              onClick={() => props.onUpdateAttachments("ADDITIONAL_ATTACHMENT")}
              icon={<IconPlus />}
            >
              Additional Attachment
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};