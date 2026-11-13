import React from "react";
import { QuestionMark } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import {
  ActionIcon,
  Badge,
  Checkbox,
  Group,
  Popover,
  Table,
} from "../../Elements";

type Props = {
  items: WMS.Maybe<WMS.LineItem>[] | undefined;
  onSelect: (selected: boolean, item: WMS.Maybe<WMS.LineItem>) => void;
};

export const RefundSalesItems = (props: Props) => {
  const itemDiscountBreakdown = (item: WMS.LineItem | null) => (
    <Group>
      <a> {item?.discount}</a>
      <Popover position="left">
        <Popover.Dropdown>
          <div style={{ textAlign: "left" }}>
            <p>
              Original Price:{" "}
              {Number((item?.sku?.price || 0) * (item?.quantity || 0))}
            </p>
            <p>Price per qauntity: {Number(item?.sku?.price)}</p>
            <p>Promo Discount: {item?.promo_discount || 0}</p>
            <p>
              Promo Goods Discount: {item?.sku?.promo?.discount || 0}{" "}
              <Badge>{item?.sku?.promo?.discount_type}</Badge>
            </p>
          </div>
        </Popover.Dropdown>
        <Popover.Target>
          <div>
            <ActionIcon size={"sm"} color="blue" variant="filled">
              <QuestionMark />
            </ActionIcon>
          </div>
        </Popover.Target>
      </Popover>
    </Group>
  );

  const rows = props?.items?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>
        <Checkbox
          disabled={element?.sku?.type === WMS.SkuType.Voucher}
          onChange={(e) => props.onSelect(e.target.checked, element)}
          label=""
        />
      </td>
      <td>{element?.sku?.gtin}</td>
      <td>{element?.sku?.description}</td>
      <td>{element?.sku?.sku}</td>
      <td>{element?.quantity}</td>
      <td>{element?.promo_type}</td>
      <td>{element?.sku?.promo?.name || "-"}</td>
      <th>{itemDiscountBreakdown(element)}</th>
      <td>{element?.price}</td>
      <td>{element?.inputs || "-"}</td>
    </tr>
  ));

  return (
    <div>
      <Table captionSide="bottom" highlightOnHover fontSize={"md"}>
        <thead>
          <tr>
            <th></th>
            <th>GTIN</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Promo Type</th>
            <th>Promo</th>
            <th>Total Discount</th>
            <th>Price</th>
            <th>Serial</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};
