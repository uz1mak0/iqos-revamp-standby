import React, { useEffect } from "react";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import {
  ActionIcon,
  Button,
  Group,
  Select,
  Input,
  Grid,
  Modal,
  LoadingOverlay,
  RadioGroup,
} from "../../Elements";
import { Plus, Trash } from "tabler-icons-react";
import { getWarehouseType } from "./InventoryConfig";
import { WMS } from "../../../GraphQL";
import {
  createWarehouse,
  updateWarehouse,
} from "../../../GraphQL/InventorySchema";
import { useMutation } from "@apollo/client";
import Notification from "../../Elements/Notification/Notification";
import { useAtom } from "jotai";
import { channelAtom } from "../../../Store/StoreAtom";
import { rolesAtom, userAtom } from "../../../Store/StoreAtom";

type Props = {
  warehouse?: WMS.Warehouse | undefined;
  visible: boolean;
  onClose: () => void;
  onSubmit: (warehouse: WMS.Warehouse) => void;
  isDirectRetailUser?: boolean;
  title?: string;
};

export const Create = (props: Props) => {
  const [channel] = useAtom(channelAtom);
  const [roles] = useAtom(rolesAtom);
  const [user] = useAtom(userAtom);

  const [warehouseCreate, { loading: loadingCreate }] = useMutation(
    createWarehouse,
    { context: { clientName: "warehouse" } }
  );
  const [warehouseUpdate, { loading: loadingUpdate }] = useMutation(
    updateWarehouse,
    { context: { clientName: "warehouse" } }
  );

  const values = {
    // zip_codes: props?.isUpdate?.zip_codes?.map((e) => { return {...e, key: randomId()}}) || [{ from: '', to: "", key: randomId() }],
    cod: props?.warehouse?.accounts?.cod || "",
    non_cod: props?.warehouse?.accounts?.non_cod || "",
    type: props?.warehouse?.type || "",
    id: props?.warehouse?.id || "",
    area: props.warehouse?.area || "",
    name: props.warehouse?.name || "",
    title: props.title || "",
    status: props.warehouse?.status ? "true" : "false",
  };
  const form = useForm({
    initialValues: { ...values },
    validate: {
      type: (value: string | undefined) => (!value ? "Required!" : null),
      id: (value: string | undefined) => (!value ? "Required!" : null),
      area: (value: string | undefined) => (!value ? "Required!" : null),
      name: (value: string | undefined) => (!value ? "Required!" : null),
      status: (value: any | undefined) => (!value ? "Required!" : null),
    },
  });

  useEffect(() => {
    if (props.warehouse) {
      form.setValues({ ...values });
    }
  }, [props.warehouse]);

  const onCancel = () => {
    form.reset();
    if (props.warehouse) {
      form.setValues({ ...values });
    }
    props.onClose();
  };

  const onSubmit = () => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });
    var id =
      form.values?.id?.toString().length == 1
        ? "0" + form.values.id
        : form.values.id;
    if (!props.warehouse) {
      if (form.values.type == "ROADSHOW") {
        id = "RS" + id;
      } else {
        id = "PH" + id;
      }
      warehouseCreate({
        variables: {
          input: {
            channel: channel,
            id: id,
            status: form.values.status,
            accounts: {
              cod: form.values.cod,
              non_cod: form.values.non_cod,
            },
            area: form.values.area,
            // zip_codes: form.values.zip_codes.map((e) => ({from: e.from, to: e.to})),
            type: form.values.type,
            name: form.values.name,
          },
        },
      })
        .then((res) => {
          props.onSubmit(res.data.warehouseCreate);
          onCancel();
          Notification.success({ message: "Warehouse Created" });
        })
        .catch((e) => {
          Notification.error({
            message: e.message.includes("conditional request")
              ? "Warehouse ID already exist"
              : e.message,
          });
        });
    } else {
      warehouseUpdate({
        variables: {
          input: {
            id: form.values.id,
            channel: channel,
            status: form.values.status,
            accounts: {
              cod: form.values.cod,
              non_cod: form.values.non_cod,
            },
            area: form.values.area,
            // zip_codes: form.values.zip_codes.map((e) => ({from: e.from, to: e.to})),
            type: form.values.type,
            name: form.values.name,
          },
        },
      })
        .then((res) => {
          props.onSubmit(res.data.warehouseUpdate);
          onCancel();
          Notification.success({ message: "Warehouse Updated" });
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    }
  };

  // const zipCodes = form.values.zip_codes?.map((item, index) => (
  //     <div  key={item?.key} style={{margin: 5}}>
  //         <Group>
  //             <Input
  //                 sx={{ flex: 1 }}
  //                 placeholder="Enter from"
  //                 required
  //                 {...form.getInputProps(`zip_codes.${index}.from`)}
  //             />
  //             <Input
  //                 sx={{ flex: 1 }}
  //                 placeholder="Enter to"
  //                 required
  //                 {...form.getInputProps(`zip_codes.${index}.to`)}
  //             />
  //             <ActionIcon
  //                 color="red"
  //                 variant="filled"
  //                 onClick={() => form.removeListItem('zip_codes', index)}
  //             >
  //                 <Trash size={16} />
  //             </ActionIcon>
  //         </Group>
  //     </div>

  //   ));

  return (
    <Modal
      title={props.title ?? "Create Warehouse"}
      centered={true}
      size={700}
      opened={props.visible}
      onClose={() => onCancel()}
    >
      <LoadingOverlay visible={loadingCreate || loadingUpdate} />
      <form>
        <Grid gutter={"lg"}>
          <Grid.Col span={12}>
            <Input
              {...form.getInputProps("id")}
              required
              label="Warehouse ID"
              disabled={props.warehouse ? true : false}
              placeholder="Enter PH warehouse number"
              type={props.warehouse ? "text" : "number"}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("name")}
              required
              label="Warehouse Name"
              placeholder="Enter warehouse name"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              {...form.getInputProps("type")}
              required
              label="Warehouse Type"
              placeholder="Select warehouse type"
              data={getWarehouseType.map((e) => {
                return {
                  label: e,
                  value: e,
                };
              })}
            />
          </Grid.Col>
        </Grid>
        <Grid gutter={"lg"}>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("area")}
              required
              label="Area"
              placeholder="Enter area"
            />
          </Grid.Col>

          {user.username == "Administrator" ? (
            <Grid.Col span={6}>
              <RadioGroup
                {...form.getInputProps("status")}
                required
                label="Warehouse Status"
                data={[
                  { label: "Active", value: "true" },
                  { label: "Inactive", value: "false" },
                ]}
              />
            </Grid.Col>
          ) : null}
        </Grid>

        <p>Accounts:</p>
        <Grid gutter={"lg"}>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("cod")}
              label="COD"
              placeholder="Enter Account COD"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("non_cod")}
              label="None COD"
              placeholder="Enter account none COD"
            />
          </Grid.Col>
        </Grid>
        {/* <p>ZIP Codes</p>
            {zipCodes}
            <br/>
            <Group position="center">
                <Button
                    size='sm'
                    icon={<Plus/>}
                    onClick={() => form.insertListItem('zip_codes', { from: '', to: "", key: randomId()})}
                >
                Add ZIP Code
                </Button>
            </Group> */}

        <br />
        <Group position="center">
          <Button onClick={() => onCancel()} customType="secondary">
            Cancel
          </Button>
          <Button customType="primary" onClick={() => onSubmit()}>
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
