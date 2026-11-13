import React, { useState, useRef } from "react";
import { Printer } from "tabler-icons-react";
import { Button, Modal, Group } from "../../Elements";
import dayjs from "dayjs";
import { ORDER } from "../../../GraphQL";
import ReactToPrint from "react-to-print";

type Props = {
  orders?: ORDER.Order[];
  disable: boolean;
};

export const TurnOverPrint = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const print = useRef(null);

  return (
    <div>
      <Modal
        title="Turnover Document"
        centered
        opened={visible}
        onClose={() => setVisible(false)}
        size={850}
      >
        <div ref={print}>
          <div style={{ width: "800px", margin: 15 }} id="print">
            <h2>Date: {` ${dayjs().format("MMM DD, YYYY")}`}</h2>
            <table style={{ width: "100%", textAlign: "left" }}>
              <tr>
                <th style={{ border: "1px solid" }}>Order No</th>
                <th style={{ border: "1px solid" }}>AWB No</th>
              </tr>

              {props?.orders?.map((data, index) => {
                return (
                  <tr key={`${index}`} id={`${data.order_id}`}>
                    <td style={{ border: "1px solid" }}>{data.order_id}</td>
                    <td style={{ border: "1px solid" }}>{data.awb}</td>
                  </tr>
                );
              })}
            </table>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <p
              style={{
                paddingTop: "15px",
                borderTop: "2px solid",
                display: "inline",
              }}
            >
              AAI Representative Name and Signature
            </p>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <p
              style={{
                paddingTop: "15px",
                borderTop: "2px solid",
                display: "inline",
              }}
            >
              2Go Representative Name and Signature
            </p>
          </div>
        </div>
        <Group direction="column" position="center">
          <ReactToPrint
            trigger={() => (
              <Button
                disabled={props.disable}
                onClick={() => setVisible(false)}
                customType="primary"
                icon={<Printer />}
              >
                Print
              </Button>
            )}
            content={() => print.current}
          />

          <Button onClick={() => setVisible(false)} customType="secondary">
            Cancel
          </Button>
        </Group>
      </Modal>
      <Button
        disabled={props.disable}
        onClick={() => setVisible(true)}
        icon={<Printer />}
      >
        PRINT TURNOVER DOCUMENT
      </Button>
    </div>
  );
};
