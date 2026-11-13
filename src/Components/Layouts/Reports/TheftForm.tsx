import { useMutation } from "@apollo/client";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import React from "react";
import { Send } from "tabler-icons-react";
import {
  Button,
  TimePicker,
  DatePicker,
  Grid,
  Group,
  Input,
  Select,
  TextArea,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { theftCreate } from "../../../GraphQL/ReportsSchema";
import { WMS } from "../../../GraphQL";

type Props = {
  warehouses: object[] | undefined;
};

type FormProps = {
  store: string;
  date: string;
  time: string;
  heets: number;
  accessories: number;
  devices: number;
  description: string;
};

function TheftForm({ warehouses, ...props }: Props) {
  const [onTheftCreate, { loading }] = useMutation(theftCreate, {
    context: { clientName: "warehouse" },
  });

  const form = useForm({
    initialValues: {
      store: "",
      date: "",
      time: "",
      heets: 0,
      accessories: 0,
      devices: 0,
      description: "",
    },
    validate: {
      store: (value) => !value,
    },
  });

  const onSubmit = (values: FormProps) => {
    onTheftCreate({
      variables: {
        warehouse_id: values.store,
        input: {
          accessories: values.accessories,
          date: dayjs(values.date).format("YYYY-MM-DD"),
          description: values.description,
          devices: values.devices,
          heets: values.heets,
          time: values.time,
        },
      },
      onCompleted: () => {
        Notification.success({
          title: "Theft Report",
          message: "Submitted Successfuly",
        });
        form.reset();
      },
      onError: console.error,
    });
  };

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Grid gutter={8}>
        <Grid.Col span={6}>
          <Select
            label="Store"
            placeholder="Select store"
            data={
              warehouses?.map((warehouse: WMS.Warehouse) => {
                return { label: `${warehouse.name}`, value: `${warehouse.id}` };
              }) || []
            }
            {...form.getInputProps("store")}
          />
          <Group grow>
            <DatePicker
              label="Date"
              placeholder="Pick Date"
              {...form.getInputProps("date")}
              clearable
            />
            <TimePicker label="Time" halfHour {...form.getInputProps("time")} />
          </Group>
          <Group grow>
            <Input
              label="HEETS"
              type="number"
              placeholder="Enter HEETS"
              {...form.getInputProps("heets")}
            />
            <Input
              label="Accessories"
              type="number"
              placeholder="Enter accessories"
              {...form.getInputProps("accessories")}
            />
            <Input
              label="Devices"
              type="number"
              placeholder="Enter devices"
              {...form.getInputProps("devices")}
            />
          </Group>
          <TextArea
            minRows={5}
            label="Description"
            placeholder="Enter description"
            {...form.getInputProps("description")}
          />
          <br />
          <Button icon={<Send />} type="submit" loading={loading}>
            Submit Theft Report
          </Button>
        </Grid.Col>
      </Grid>
    </form>
  );
}

export default TheftForm;
