import { generatePDF } from "../../../GraphQL/OrderManagementSchema";
import { Printer } from "tabler-icons-react";
import { ActionIcon } from "../../Elements";
import { useMutation } from "@apollo/client";
import Notification from "../../Elements/Notification/Notification";

type PrintTransactionProps = {
  transactionId: string;
};

export const PrintTransaction = ({ transactionId }: PrintTransactionProps) => {
  const [generateTransactionPDF, { loading: loadingPDF }] = useMutation(
    generatePDF,
    {
      context: { clientName: "order" },
    }
  );

  const onPDFPrint = async (id: string) => {
    try {
        Notification.info({ message: "Generating PDF" });

      if (id == null) {
        Notification.error({ message: "ID cannot be null" });
        return;
      }

      const resPDF = await generateTransactionPDF({
        variables: {
          type: "TRANSACTION",
          order_id: id,
        },
      });

      const url = resPDF?.data?.generatePDF;

      if (url) {
        Notification.success({ message: "Generated the PDF successfully" });

        window.open(url, "_blank");
      } else {
        Notification.error({ message: "No URL returned." });
      }
    } catch (error: any) {
      Notification.error({
        message: error.message || "Failed to generate PDF.",
      });
    }
  };

  return (
    <ActionIcon
      disabled={!transactionId || loadingPDF}
      variant="filled"
      onClick={() => onPDFPrint(transactionId)}
    >
      <Printer />
    </ActionIcon>
  );
};
