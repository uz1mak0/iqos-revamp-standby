import React, { useEffect, useState } from "react";
import {
  getFeedbackMomentsQuestions,
  getFeedbackSurveys,
  getFeedbackSurveysMockData,
} from "../../Modules/CRM/Config";
import { HypercareWeekForm } from "../../Modules/CRM/HypercareWeekForm";
import { IFormInput } from "../CRMTrials/Create/Create";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  createHyperCare,
  getOrderStatus,
  updateHypercare,
} from "../../../GraphQL/CRMSchema";
import Notification from "../../Elements/Notification/Notification";
import { LoadingOverlay, Progress, Skeleton } from "@mantine/core";
import { orderCreate } from "../../../GraphQL/OrderManagementSchema";
import { ORDER } from "../../../GraphQL";
import { Trial } from "../../../GraphQL/_gql/crm/graphql";
import { title } from "process";
import { HypercareReschedule } from "../../Modules/CRM/HypercareReschedule";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

type Props = {
  hypercare: IFormInput;
  onUpdateHypercare: () => void;
  isLatestWeek: boolean;
  trial: Trial | undefined;
};

export const ConsumerWeeklyHypercare = (props: Props) => {
  const [onCreateHypercare] = useMutation(createHyperCare, {
    context: { clientName: "crm" },
  });
  const [onUpdateHypercare] = useMutation(updateHypercare, {
    context: { clientName: "crm" },
  });
  const [createOrder] = useMutation(orderCreate, {
    context: { clientName: "order" },
  });
  const [queryOrder, { loading: loadingOrder, data: dataOrder }] = useLazyQuery(
    getOrderStatus,
    { context: { clientName: "order" } },
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ label: "", value: 0 });

  useEffect(() => {
    if (props.isLatestWeek && props.hypercare.order_id) {
      queryOrder({
        variables: {
          id: props.hypercare.order_id,
        },
        fetchPolicy: "no-cache",
      });
    }
  }, [props.isLatestWeek]);

  const defaultValues = {
    customer_id: props?.hypercare?.customer_id,
    registration_channel: `${props.trial?.registration_channel}`,
    contact_no: `${props.trial?.contact_no}`,
    feedbacks:
      props.hypercare?.feedbacks?.length > 0 &&
      props.hypercare.status !== "PENDING"
        ? props.hypercare?.feedbacks.filter(
            (e) =>
              !e.title.includes("(AFTERNOON)") &&
              !e.title.includes("(MORNING)") &&
              !e.title.includes("(NIGHT)") &&
              !e.title.includes("(OTHERS)"),
          )
        : getFeedbackSurveys,
    week: props.hypercare.week,
    moments_morning:
      props.hypercare?.feedbacks?.length > 0 &&
      props.hypercare.status !== "PENDING"
        ? props.hypercare?.feedbacks
            .filter((e) => e.title.includes("MORNING"))
            .map((item) => {
              return {
                title: `${item.title}`,
                response: `${item.response}`,
              };
            })
        : getFeedbackMomentsQuestions.filter((e) =>
            e.title.includes("MORNING"),
          ),
    moments_afternoon:
      props.hypercare?.feedbacks?.length > 0 &&
      props.hypercare.status !== "PENDING"
        ? props.hypercare?.feedbacks
            .filter((e) => e.title.includes("AFTERNOON"))
            .map((item) => {
              return {
                title: `${item.title}`,
                response: `${item.response}`,
              };
            })
        : getFeedbackMomentsQuestions.filter((e) =>
            e.title.includes("AFTERNOON"),
          ),
    moments_night:
      props.hypercare?.feedbacks?.length > 0 &&
      props.hypercare.status !== "PENDING"
        ? props.hypercare?.feedbacks
            .filter((e) => e.title.includes("NIGHT"))
            .map((item) => {
              return {
                title: `${item.title}`,
                response: `${item.response}`,
              };
            })
        : getFeedbackMomentsQuestions.filter((e) => e.title.includes("NIGHT")),
    moments_others:
      props.hypercare?.feedbacks?.length > 0 &&
      props.hypercare.status !== "PENDING"
        ? props.hypercare?.feedbacks
            .filter((e) => e.title.includes("OTHERS"))
            .map((item) => {
              return {
                title: `${item.title}`,
                response: `${item.response}`,
              };
            })
        : getFeedbackMomentsQuestions.filter((e) => e.title === ""),
    schedule_logs: props.hypercare.schedule_logs,
    call_info: {
      answered_call: props?.hypercare?.call_info?.answered_call ? "YES" : "NO",
      status: props.hypercare?.call_info?.status,
      has_time: props.hypercare?.call_info?.has_time ? "YES" : "NO",
      reschedule_date: props.hypercare?.call_info?.reschedule_date
        ? dayjs(
            props.hypercare?.call_info?.reschedule_date,
            "YYYY-MM-DD",
          ).toDate()
        : dayjs().toDate(),
      reschedule_time: props.hypercare?.call_info?.reschedule_time
        ? dayjs(props.hypercare?.call_info?.reschedule_time, "HH:mm").toDate()
        : dayjs().toDate(),
      type: props.hypercare.call_info.type,
    },
    not_interested_to_zyn: props.hypercare?.feedbacks
      ? props.hypercare.feedbacks.find((e) =>
          e.title.includes("Thank you very much"),
        )?.response || ""
      : "",
    continue_feedback:
      props.hypercare?.continue_feedback || props.hypercare.week === "WEEK 1"
        ? "YES"
        : "NO",
    interested_to_zyn: props.hypercare?.interested_to_zyn ? "YES" : "NO",
    extended_adoption: props.hypercare?.extended_adoption ? "YES" : "NO",
    different_address: "NO",
    delivery_date:
      props.hypercare?.delivery_date && props.hypercare.status === "COMPLETED"
        ? dayjs(props.hypercare?.delivery_date, "YYYY-MM-DD").toDate()
        : dayjs().toDate(),
    delivery_time: props.hypercare?.delivery_time
      ? dayjs(props.hypercare?.delivery_time, "HH:mm").toDate()
      : dayjs().toDate(),
    feedback_date: props.hypercare?.feedback_date
      ? dayjs(props.hypercare?.feedback_date, "YYYY-MM-DD").toDate()
      : dayjs().add(1, "day").toDate(),
    feedback_time: props.hypercare?.feedback_time
      ? dayjs(props.hypercare?.feedback_time, "HH:mm").toDate()
      : dayjs().toDate(),
    consumer_address: { ...props.hypercare?.consumer_address },
    status: props.hypercare.status,
    date: props.hypercare.date,
    time: props.hypercare.time,
    orders: props?.hypercare?.orders || [],
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues,
  });

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
    const nextWeek = `WEEK ${
      Number(props.hypercare.week.replace("WEEK", "")) + 1
    }`;
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
    const othersFeedback = data.moments_others
      ? data.moments_others.map((item) => ({
          title: `(OTHERS) ${item.title}`,
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
    if (extendedAdoption && data.orders.length < 1 && nextWeek !== "WEEK 17")
      return Notification.error({ message: "Please add preferred Zyn!" });
    setLoading(true);

    const orderAddress = {
      address_extention_1: data.consumer_address?.address1,
      city: data.consumer_address?.city,
      country: "PH",
      email: data.email,
      first_name: props?.trial?.first_name,
      last_name: props?.trial?.last_name,
      region: data.consumer_address.region,
      street: data.consumer_address?.unit,
      telephone_number: props?.trial?.customer_id,
    };

    const getStatus = () => {
      if (data.call_info.status == "ABANDONED" && (!hasTime || !isAnswerCall))
        return "ABANDONED";
      if (continueFeedback) return "COMPLETED";
      if (
        !continueFeedback &&
        notInterestedToZynResponse.response !== "" &&
        notInterestedToZynResponse.response !== null &&
        notInterestedToZynResponse.response !== undefined
      )
        return "COMPLETED";
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

    const currentWeekInput = {
      customer_id: data.customer_id,
      hypercare_id: props.hypercare.hypercare_id,
      week: props.hypercare.week,
      call_info: {
        answered_call: isAnswerCall,
        status: !hasTime || !isAnswerCall ? data.call_info.status : undefined,
        has_time: hasTime,
        type: getRescheduleType(),
        reschedule_date:
          !hasTime || !isAnswerCall
            ? dayjs(data.call_info.reschedule_date).format("YYYY-MM-DD")
            : undefined,
        reschedule_time:
          !hasTime || !isAnswerCall
            ? dayjs(data.call_info.reschedule_time).format("HH:mm")
            : undefined,
      },
      status: getStatus(),
      continue_feedback: continueFeedback,
      feedbacks: finalFeedbacks,
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
      date:
        !hasTime || !isAnswerCall
          ? dayjs(data.call_info.reschedule_date).format("YYYY-MM-DD")
          : props.hypercare.date,
      time:
        !hasTime || !isAnswerCall
          ? dayjs(data.call_info.reschedule_time).format("HH:mm")
          : props.hypercare.time,
      orders: extendedAdoption ? data.orders : [],
    };

    const nextWeekInput = {
      customer_id: data.customer_id,
      week: nextWeek,
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
      consumer_address: currentWeekInput.extended_adoption
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
      delivery_date: currentWeekInput.extended_adoption
        ? currentWeekInput.delivery_date
        : undefined,
      delivery_time: currentWeekInput.extended_adoption
        ? currentWeekInput.delivery_time
        : undefined,
      order_id: orderID,
    };

    const orderInput: ORDER.OrderInput = {
      order_id: orderID,
      assigned_warehouse: "RS50",
      order_type: "MANUAL",
      payment_type: "COD",
      customer_number: props.hypercare.contact_no,
      billing_address: orderAddress,
      shipping_address: orderAddress,
      delivery_date: dayjs(currentWeekInput.delivery_date).unix() * 1000,
      delivery_time: currentWeekInput.delivery_time,
      price: {
        currency: "PHP",
        gross: `0`,
      },
      items: data?.orders?.map((item) => {
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
    setProgress({ label: `Updating ${currentWeekInput.week}`, value: 40 });
    onUpdateHypercare({
      variables: {
        input: currentWeekInput,
      },
    })
      .then(({ data }) => {
        if (
          props.isLatestWeek &&
          nextWeek !== "WEEK 17" &&
          currentWeekInput.status === "COMPLETED" &&
          extendedAdoption
        ) {
          setProgress({ label: `Creating Order`, value: 60 });
          createOrder({
            variables: {
              input: orderInput,
            },
          })
            .then(() => {
              setProgress({
                label: `Creating ${nextWeekInput.week}`,
                value: 80,
              });
              onCreateHypercare({
                variables: {
                  input: nextWeekInput,
                },
              })
                .then(() => {
                  setProgress({
                    label: `Creating ${nextWeekInput.week}`,
                    value: 100,
                  });
                  setTimeout(() => {
                    setProgress({ label: "", value: 0 });
                    Notification.success({
                      message: `Hypercare ${nextWeekInput.week} Created`,
                    });
                    props.onUpdateHypercare();
                    setLoading(false);
                  }, 100);
                })
                .catch((error) => {
                  setLoading(false);
                  setProgress({ label: "", value: 0 });
                  Notification.error({
                    title: `Order Failed`,
                    message: error.message,
                  });
                });
            })
            .catch((error) => {
              setLoading(false);
              setProgress({ label: "", value: 0 });
              Notification.error({
                title: `Hypercare New ${nextWeekInput.week} Error`,
                message: error.message,
              });
            });
        } else {
          setProgress({
            label: `Updating${currentWeekInput.week}`,
            value: 100,
          });
          setTimeout(() => {
            setLoading(false);
            setProgress({ label: "", value: 0 });
            Notification.success({
              message: `Hypercare ${currentWeekInput.week} Updated`,
            });
            props.onUpdateHypercare();
          }, 100);
        }
      })
      .catch((error) => {
        setLoading(false);
        Notification.error({
          title: `Hypercare Current ${currentWeekInput.week} Error`,
          message: error.message,
        });
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {loading ? (
          <div>
            <Progress
              radius="xl"
              size={24}
              color="#23C2D7"
              label={progress.label}
              value={progress.value}
              animate
            />
            <br />
            <Skeleton height={50} circle mb="xl" />
            <Skeleton height={8} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
          </div>
        ) : (
          <div>
            {props.isLatestWeek &&
            props.hypercare.status === "PENDING" &&
            dataOrder?.order?.order_status !== "COMPLETED" &&
            process.env.NEXT_PUBLIC_PLATFORM !== "test" ? (
              <HypercareReschedule
                order={dataOrder?.order}
                hypercare={undefined}
                control={control}
                setValue={setValue}
                getValues={getValues}
                watch={watch}
                errors={errors}
                isUpdate={true}
                reset={() => reset(defaultValues)}
                onSave={() => handleSubmit(onSubmit)}
              />
            ) : (
              <HypercareWeekForm
                hypercare={undefined}
                control={control}
                setValue={setValue}
                getValues={getValues}
                watch={watch}
                errors={errors}
                isUpdate={true}
                isLatestWeek={props.isLatestWeek}
                reset={() => reset(defaultValues)}
                onSave={() => handleSubmit(onSubmit)}
              />
            )}
          </div>
        )}
      </form>
    </div>
  );
};
