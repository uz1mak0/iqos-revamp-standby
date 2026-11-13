import { s3UrlFromPath } from "../../../Utilities/Backend";
import React from "react";
import { Group, Image, Modal } from "../../Elements";

type Props = {
  imageUrl: string | undefined;
  opened: boolean;
  onClose: () => void;
};

const ViewAttachments = (props: Props) => {
  const receiptPreview = () => (
    <Group position="center">
      <Image
        alt="Receipt"
        src={s3UrlFromPath(props.imageUrl)}
      />
      <br />
    </Group>
  );

  return (
    <div>
      <Modal
        title="Receipt Image"
        centered
        opened={props.opened}
        onClose={() => props.onClose()}
        size={1000}
      >
        {props.imageUrl ? receiptPreview() : undefined}
        <br />
      </Modal>
    </div>
  );
};

export default ViewAttachments;
