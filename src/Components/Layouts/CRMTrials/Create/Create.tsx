import React, { useEffect, useState } from "react";
import { Plus, X } from "tabler-icons-react";
import { Button, Group, Modal, Stack } from "../../../Elements";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { userAtom } from "../../../../Store/StoreAtom";
import CRMTrialConsumerInfo from "./CRMTrialConsumerInfo";
import { HypercareWeekForm } from "../../../Modules/CRM/HypercareWeekForm";
import {
  getFeedbackMomentsQuestions,
  getFeedbackSurveys,
  HypercareFormInput,
} from "../../../Modules/CRM/Config";
import dayjs from "dayjs";
import { useMutation } from "@apollo/client";
import { createHyperCare, createTrial } from "../../../../GraphQL/CRMSchema";
import Notification from "../../../Elements/Notification/Notification";
import { LoadingOverlay } from "@mantine/core";
import { orderCreate } from "../../../../GraphQL/OrderManagementSchema";
import { ORDER } from "../../../../GraphQL";

export interface VariantItems {
  sku?: string | undefined;
  variant?: string | undefined;
  description?: string | undefined;
  uom?: string | undefined;
  quantity?: number | undefined;
}

export interface TrialFeedBack {
  description: string;
  value: string | null;
}
export interface IFormInput extends HypercareFormInput {
  customer_id: string;
  first_name: string;
  last_name: string;
  age: number;
  date_of_birth: Date | null;
  contact_no: string;
  gender: string | null;
  email: string | undefined;
  primary_nicotine_product: string | null;
  marketing_opt_in: string | null;
  privacy_notice: string | null;
  registration_channel: string | null;
}
type Props = {
  onCreate: () => void;
};
export const Create = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const [user] = useAtom(userAtom);
  const [onCreateTrial] = useMutation(createTrial, {
    context: { clientName: "crm" },
  });
  const [onCreateHypercare] = useMutation(createHyperCare, {
    context: { clientName: "crm" },
  });
  const [createOrder] = useMutation(orderCreate, {
    context: { clientName: "order" },
  });
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  var defaultValues = {
    customer_id: `SA-${dayjs().unix()}`,
    first_name: "",
    last_name: "",
    age: 18,
    contact_no: "",
    gender: "",
    date_of_birth: dayjs().subtract(18, "years").toDate(),
    primary_nicotine_product: "",
    marketing_opt_in: "",
    privacy_notice: "",
    registration_channel: "IQOS",
    week: "WEEK 1",
    status: "PENDING",
    continue_feedback: "YES",
    different_address: "YES",
    interested_to_zyn: "YES",
    consumer_address: {
      unit: "",
      city: "",
      address1: "",
      address2: "",
      barangay: "",
      province: "",
      zip_code: "",
      region: "",
    },
    call_info: {
      answered_call: "YES",
      has_time: "YES",
      reschedule_date: dayjs().toDate(),
      reschedule_time: dayjs().toDate(),
      type: "",
    },
    feedbacks: getFeedbackSurveys,
    moments_morning: getFeedbackMomentsQuestions.filter((e) =>
      e.title.includes("MORNING"),
    ),
    moments_afternoon: getFeedbackMomentsQuestions.filter((e) =>
      e.title.includes("AFTERNOON"),
    ),
    moments_night: getFeedbackMomentsQuestions.filter((e) =>
      e.title.includes("NIGHT"),
    ),
    moments_others: getFeedbackMomentsQuestions.filter((e) => e.title === ""),
    extended_adoption: "YES",
    orders: [],
    delivery_date: dayjs().toDate(),
    delivery_time: dayjs().toDate(),
    feedback_time: dayjs().toDate(),
    feedback_date: dayjs().add(1, "day").toDate(),
  };

  useEffect(() => {
    reset(defaultValues);
  }, []);

  const onSubmit = (data: IFormInput) => {
    const isAnswerCall = data.call_info.answered_call === "YES" ? true : false;
    const hasTime = isAnswerCall
      ? data.call_info.has_time === "YES"
        ? true
        : false
      : false;
    const continueFeedback =
      isAnswerCall && hasTime
        ? data.continue_feedback === "YES"
          ? true
          : false
        : false;
    const interestedInZyn =
      isAnswerCall && hasTime && continueFeedback
        ? data.interested_to_zyn === "YES"
          ? true
          : false
        : false;
    const extendedAdoption =
      isAnswerCall && hasTime && continueFeedback && interestedInZyn
        ? data.extended_adoption === "YES"
          ? true
          : false
        : false;
    const orderID = `ZYN-${parseInt(`${new Date().getTime() / 1000}`)}`;
    const morningFeedback = data.moments_morning
      ? data.moments_morning.map((item) => ({
          title: item.title,
          response: item.response,
        }))
      : [];
    const afternoonFeedback = data.moments_afternoon
      ? data.moments_afternoon.map((item) => ({
          title: item.title,
          response: item.response,
        }))
      : [];
    const othersFeedback = data.moments_others
      ? data.moments_others.map((item) => ({
          title: `(OTHERS) ${item.title}`,
          response: item.response,
        }))
      : [];
    const nightFeedback = data.moments_night
      ? data.moments_night.map((item) => ({
          title: item.title,
          response: item.response,
        }))
      : [];
    const updateFeedback = data.feedbacks
      ? data.feedbacks.map((item, i) => ({
          title: item.title,
          response: item.response,
        }))
      : [];
    const notInterestedToZynResponse = {
      title:
        "Thank you very much for your participation, if i may ask, what made you want to stop using this product?",
      response: data.not_interested_to_zyn,
    };
    const finalFeedbacks = [
      ...updateFeedback,
      ...morningFeedback,
      ...afternoonFeedback,
      ...nightFeedback,
      ...othersFeedback,
      notInterestedToZynResponse,
    ];
    if (data.age < 18)
      return Notification.error({ message: "Age is not legal!" });
    if (extendedAdoption && data.orders.length < 1)
      return Notification.error({ message: "Please add preferred Zyn!" });
    setLoading(true);

    const getStatus = () => {
      if (data.call_info.status == "ABANDONED" && (!hasTime || !isAnswerCall))
        return "ABANDONED";
      if (
        !continueFeedback &&
        notInterestedToZynResponse.response !== "" &&
        notInterestedToZynResponse.response !== null &&
        notInterestedToZynResponse.response !== undefined
      )
        return "COMPLETED";
      if (continueFeedback) return "COMPLETED";
      return "PENDING";
    };

    const getRescheduleType = () => {
      if (!isAnswerCall) {
        return "CONSUMER ANSWERED THE CALL?";
      } else if (!hasTime) {
        return "CONSUMER HAS TIME?";
      } else {
        return undefined;
      }
    };

    const trialInput = {
      customer_id: data.customer_id,
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: dayjs(data.date_of_birth).format("YYYY-MM-DD"),
      age: data.age,
      contact_no: `+63${data.contact_no}`,
      gender: data.gender,
      email: data.email !== "" ? data.email : undefined,
      primary_nicotine_product: data.primary_nicotine_product,
      marketing_opt_in: data.marketing_opt_in,
      privacy_notice: data.privacy_notice,
      registration_channel: data.registration_channel,
    };

    const orderAddress = {
      address_extention_1: data.consumer_address?.address1,
      city: data.consumer_address?.city,
      country: "PH",
      email: data.email !== "" ? data.email : undefined,
      first_name: data.first_name,
      last_name: data.last_name,
      region: data.consumer_address.region,
      street: data.consumer_address?.unit,
      telephone_number: data.contact_no,
    };

    const currentWeekInput = {
      customer_id: data.customer_id,
      week: "WEEK 1",
      call_info: {
        answered_call: isAnswerCall,
        status: !hasTime || !isAnswerCall ? data.call_info.status : undefined,
        has_time: hasTime,
        reschedule_date:
          !hasTime || !isAnswerCall
            ? dayjs(data.call_info.reschedule_date).format("YYYY-MM-DD")
            : undefined,
        reschedule_time:
          !hasTime || !isAnswerCall
            ? dayjs(data.call_info.reschedule_time).format("HH:mm")
            : undefined,
        type: getRescheduleType(),
      },
      status: getStatus(),
      continue_feedback: continueFeedback,
      feedbacks: getStatus() === "PENDING" ? [] : finalFeedbacks,
      interested_to_zyn: interestedInZyn,
      extended_adoption: extendedAdoption,
      consumer_address: extendedAdoption
        ? {
            unit: data.consumer_address?.unit,
            city: data.consumer_address?.city,
            address1: data.consumer_address?.address1,
            address2: data.consumer_address?.address2,
            barangay: data.consumer_address?.barangay,
            province: data.consumer_address?.province,
            zip_code: data.consumer_address?.zip_code,
            region: data.consumer_address?.region,
          }
        : undefined,
      delivery_date: extendedAdoption
        ? dayjs(data.delivery_date).format("YYYY-MM-DD")
        : undefined,
      delivery_time: extendedAdoption
        ? dayjs(data.delivery_time).format("HH:mm")
        : undefined,
      feedback_date: extendedAdoption
        ? dayjs(data.feedback_date).format("YYYY-MM-DD")
        : undefined,
      feedback_time: extendedAdoption
        ? dayjs(data.feedback_time).format("HH:mm")
        : undefined,
      date: dayjs().format("YYYY-MM-DD"),
      time: dayjs().format("HH:mm"),
      orders: extendedAdoption ? data.orders : [],
    };

    const nextWeekInput = {
      customer_id: data.customer_id,
      week: "WEEK 2",
      call_info: {
        answered_call: true,
        has_time: true,
      },
      continue_feedback: true,
      interested_to_zyn: true,
      extended_adoption: true,
      date: currentWeekInput.extended_adoption
        ? currentWeekInput.feedback_date
        : undefined,
      time: currentWeekInput.extended_adoption
        ? currentWeekInput.feedback_time
        : undefined,
      status: "PENDING",
      consumer_address: extendedAdoption
        ? {
            unit: data.consumer_address?.unit,
            city: data.consumer_address?.city,
            address1: data.consumer_address?.address1,
            address2: data.consumer_address?.address2,
            barangay: data.consumer_address?.barangay,
            province: data.consumer_address?.province,
            zip_code: data.consumer_address?.zip_code,
            region: data.consumer_address?.region,
          }
        : undefined,
      delivery_date: extendedAdoption
        ? currentWeekInput.delivery_date
        : undefined,
      delivery_time: extendedAdoption
        ? currentWeekInput.delivery_time
        : undefined,
      order_id: orderID,
    };

    const orderInput: ORDER.OrderInput = {
      order_id: orderID,
      assigned_warehouse: "RS50",
      order_type: "MANUAL",
      payment_type: "COD",
      customer_number: `+63${data.contact_no}`,
      billing_address: orderAddress,
      shipping_address: orderAddress,
      delivery_date: dayjs(currentWeekInput.delivery_date).unix() * 1000,
      delivery_time: currentWeekInput.delivery_time,
      price: {
        currency: "PHP",
        gross: `0`,
      },
      items: data.orders.map((item) => {
        return {
          sku: item.sku,
          quantity: Number(item.quantity),
          price_per_unit: 0,
          total: 0,
          description: item.description,
          quantity_unit: item.uom,
        };
      }),
    };

    onCreateTrial({
      variables: {
        input: trialInput,
      },
    })
      .then(() => {
        onCreateHypercare({
          variables: {
            input: currentWeekInput,
          },
        })
          .then(() => {
            if (currentWeekInput.status === "COMPLETED" && extendedAdoption) {
              setTimeout(() => {
                createOrder({
                  variables: {
                    input: orderInput,
                  },
                })
                  .then(() => {
                    onCreateHypercare({
                      variables: {
                        input: nextWeekInput,
                      },
                    })
                      .then(() => {
                        Notification.success({
                          title: `Hypercare ${nextWeekInput.week}`,
                          message: "Trial Created",
                        });
                        reset();
                        setVisible(false);
                        setLoading(false);
                        props.onCreate();
                      })
                      .catch((error) => {
                        setLoading(false);
                        Notification.error({ message: error.message });
                      });
                  })
                  .catch((error) => {
                    setLoading(false);
                    Notification.error({ message: error.message });
                  });
              }, 1000);
            } else {
              props.onCreate();
              Notification.success({
                title: `Hypercare ${nextWeekInput.week}`,
                message: "Trial Created",
              });
              reset();
              setLoading(false);
              setVisible(false);
            }
          })
          .catch((error) => {
            setVisible(false);
            setLoading(false);
            Notification.error({
              title: `Hypercare ${currentWeekInput.week} Error`,
              message: error.message,
            });
          });
      })
      .catch((error) => {
        setLoading(false);
        // setVisible(false);
        Notification.error({ title: "Trial Error", message: error.message });
      });
  };

  const onClose = () => {
    setVisible(false);
    reset(defaultValues);
  };

  const formModal = () => (
    <Modal
      size={700}
      title="Create Consumer Trial"
      opened={visible}
      onClose={() => onClose()}
      centered
      overflow="inside"
      fullScreen={true}
    >
      {/* <Group align='center' position='apart'>
                <h2>Create Consumer Trial</h2>
                <Button icon={<X/>} >Close</Button>
            </Group> */}
      <LoadingOverlay visible={loading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <CRMTrialConsumerInfo
            control={control}
            setValue={setValue}
            getValues={getValues}
            watch={watch}
            errors={errors}
          />
          <HypercareWeekForm
            hypercare={undefined}
            control={control}
            setValue={setValue}
            getValues={getValues}
            watch={watch}
            errors={errors}
            reset={reset}
          />
          <br />
          <Group position="center">
            <Button
              type="reset"
              customType="secondary"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <div data-testid={"TEST-CREATE-TRIAL"}>
              <Button
                type="submit"
                onClick={() => handleSubmit(onSubmit)}
                customType="primary"
              >
                Create
              </Button>
            </div>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
  return (
    <div>
      {formModal()}
      <Button icon={<Plus />} onClick={() => setVisible(true)}>
        Create Consumer Trial
      </Button>
    </div>
  );
};
