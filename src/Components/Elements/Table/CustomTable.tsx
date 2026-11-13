import React from "react";
import { Table as MantineTable } from "@mantine/core";

interface LooseObject {
  [k: string]: any;
}

interface Columns {
  title: string;
  dataIndex: string;
  key: string;
  render?: (record: any) => React.ReactNode;
}

type Props = {
  dataSource: { [key: string]: any };
  columns: Array<Columns>;
  onRowClick?: any;
};

export const Table = (props: Props) => {
  const tableHeader = () => (
    <thead>
      <tr>
        {props.columns.map((column, i) => (
          <th key={`header-${i}`}>{column?.title}</th>
        ))}
      </tr>
    </thead>
  );

  const tableData = () => {
    const columnsData = props.columns.map((e) => ({
      value: e.dataIndex,
      render: e.render,
    }));
    return props.dataSource?.map((record: any, i: any) => {
      return (
        <tr onClick={() => props.onRowClick(record)} key={`data-${i}`}>
          {columnsData.map((col: any, index: any) => (
            <td key={`data-${index}`}>
              {col?.render ? col.render(record) : record[col.value] || ""}
            </td>
          ))}
        </tr>
      );
    });
  };

  return (
    <MantineTable striped>
      {tableHeader()}
      <tbody>{tableData()}</tbody>
    </MantineTable>
  );
};
