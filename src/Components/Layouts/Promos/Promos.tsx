/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { Edit, Plus } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import { getPromos } from "../../../GraphQL/PromoSchema";
import { rolesAtom } from "../../../Store/StoreAtom";
import {
  Button,
  Table,
  Group,
  LoadingOverlay,
  ScrollArea,
} from "../../Elements";
import Create from "./Create";

export const Promos = () => {
  const [visible, setVisible] = useState(false);
  const [selectedPromo, setSelectedPromo] =
    useState<WMS.Promo | undefined>(undefined);
  const [fetchPromos, { loading }] = useLazyQuery(getPromos, {
    context: { clientName: "warehouse" },
  });
  const [promos, setPromos] = useState<WMS.Promo[]>([]);
  const [userRoles] = useAtom(rolesAtom);

  useEffect(() => {
    getAllPromos(undefined, []);
  }, []);

  const getAllPromos = (next_token: string | undefined, list: WMS.Promo[]) => {
    fetchPromos({
      variables: {
        next_token: next_token,
      },
    }).then((res) => {
      const updateList = [...list, ...res.data.promos.items];
      if (res.data.promos.nextToken) {
        return getAllPromos(res.data.promos.nextToken, updateList);
      }
      setPromos(updateList);
    });
  };

  const onSubmit = (promo: WMS.Promo) => {
    const list = [...promos];
    if (list.some((e) => e.code === promo.code)) {
      const index = list.findIndex((e) => e.code === promo.code);
      list[index] = { ...promo };
    } else {
      list.push(promo);
    }
    setPromos(list);
  };

  const rows = promos.map((element: WMS.Promo, index: number) => (
    <tr key={`sku-${index}`}>
      <td>{element.code}</td>
      <td>{element.name}</td>
      <td>{element.description}</td>
      <td>{element.type}</td>
      <td>{element.status}</td>
      <td>{element.discount}</td>
      <td>
        <Button
          disabled={
            !userRoles.isAdminDC &&
            !userRoles.isAdminIC &&
            !userRoles.isFullAdmin &&
            // old roles
            !userRoles.isDirectRetailAdmin
          }
          onClick={() => {
            setVisible(true);
            setSelectedPromo(element);
          }}
          icon={<Edit />}
        >
          Edit
        </Button>
      </td>
    </tr>
  ));

  return (
    <div>
      <LoadingOverlay visible={loading} />
      {userRoles.isDirectRetailAdmin && userRoles.isDirectRetailUser && (
        <Create
          onSubmit={onSubmit}
          promo={selectedPromo}
          visible={visible}
          onClose={() => {
            setVisible(false);
            setSelectedPromo(undefined);
          }}
        />
      )}

      <Group position="right">
        <Button
          disabled={
            !userRoles.isAdminDC &&
            !userRoles.isAdminIC &&
            !userRoles.isFullAdmin &&
            // old roles
            !userRoles.isDirectRetailAdmin
          }
          onClick={() => setVisible(true)}
          icon={<Plus />}
        >
          Create Promo
        </Button>
      </Group>
      <br />
      <ScrollArea style={{ height: 700 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Status</th>
              <th>Discount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
