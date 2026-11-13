import React, { useEffect, useState } from "react";
import { Group, Stack } from "../../Elements";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { userAtom } from "../../../Store/StoreAtom";
import CRMTrialConsumerInfo from "../CRMTrials/Create/CRMTrialConsumerInfo";
import { IFormInput } from "../CRMTrials/Create/Create";
import { HypercareWeekForm } from "../../Modules/CRM/HypercareWeekForm";
import {
  getFeedbackMomentsQuestions,
  getFeedbackSurveys,
  getFeedbackSurveysMockData,
} from "../../Modules/CRM/Config";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  createHyperCare,
  getCustomerTrial,
  getHypercarePerCustomer,
  updateHypercare,
} from "../../../GraphQL/CRMSchema";
import {
  Feedback,
  Hypercare,
  HypercareInput,
  OrderInput,
  Trial,
} from "../../../GraphQL/_gql/crm/graphql";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { ORDER } from "../../../GraphQL";
import { orderCreate } from "../../../GraphQL/OrderManagementSchema";
import Notification from "../../Elements/Notification/Notification";
import { Paper, Progress, Skeleton } from "@mantine/core";
import { ZynUsedItems } from "./ZynUsedItems";
import { IconArrowLeft } from "@tabler/icons-react";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

export const CRMTrialProfile = () => {
  const [queryCustomerTrial] = useLazyQuery(getCustomerTrial, {
    context: { clientName: "crm" },
  });
  const [queryCustomerHypercare, { loading: loadingHypercare }] = useLazyQuery(
    getHypercarePerCustomer,
    { context: { clientName: "crm" } },
  );
  const [onCreateHypercare, { loading: loadingCreateHypercare }] = useMutation(
    createHyperCare,
    { context: { clientName: "crm" } },
  );
  const [onUpdateHypercare, { loading: loadingUpdateHypercare }] = useMutation(
    updateHypercare,
    { context: { clientName: "crm" } },
  );
  const [createOrder, { loading: loadingOrder }] = useMutation(orderCreate, {
    context: { clientName: "order" },
  });
  const [loading, setLoading] = useState(false);
  const [user] = useAtom(userAtom);
  const [trial, setTrial] = useState<Trial | undefined>();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({});
  const [defaultHypercare, setDefaultHypercare] = useState<IFormInput>();
  const [progress, setProgress] = useState({ label: "", value: 0 });

  useEffect(() => {
    if (router.query.orderID) {
      loadTrial();
    }
  }, [router.query.orderID]);

  const loadTrial = () => {
    queryCustomerTrial({
      variables: {
        id: router.query.orderID,
      },
    }).then(({ data }) => {
      setTrial(data.trial);
      setValue("customer_id", data.trial.customer_id);
      setValue("first_name", data.trial.first_name);
      setValue("last_name", data.trial.last_name);
      setValue("age", data.trial.age || 1);
      setValue("contact_no", data.trial.contact_no);
      setValue("gender", data.trial.gender);
      setValue("email", data.trial.email || "test");
      setValue("primary_nicotine_product", data.trial.primary_nicotine_product);
      setValue("marketing_opt_in", data.trial.marketing_opt_in);
      setValue("registration_channel", data.trial.registration_channel);
      setValue("privacy_notice", data.trial.privacy_notice);
      setValue(
        "date_of_birth",
        data.trial?.date_of_birth
          ? dayjs(data.trial.date_of_birth, "YYYY-MM-DD").toDate()
          : null,
      );
      setValue(
        "gt_date",
        data.trial?.gt_date
          ? dayjs(data.trial.gt_date, "YYYY-MM-DD").toDate()
          : null,
      );
      setValue(
        "gt_time",
        data.trial?.gt_time
          ? dayjs(data.trial.gt_time, "HH:mm").toDate()
          : null,
      );
      setValue("discontinue_reason", `${data.trial?.discontinue_reason}`);
      queryCustomerHypercare({
        variables: {
          customer_id: router.query.orderID,
        },
        fetchPolicy: "no-cache",
      }).then((res) => {
        const hypercare = res.data?.hyperCarePerCustomer?.items.find(
          (e: Hypercare) => e.week === "WEEK 1",
        );
        setDefaultHypercare(undefined);
        const defaultValues = {
          // service_appointment_number: undefined,
          customer_id: `${data.trial.customer_id}`,
          hypercare_id: hypercare.hypercare_id,
          gt_date: data.trial?.gt_date
            ? dayjs(data.trial.gt_date, "YYYY-MM-DD").toDate()
            : null,
          gt_time: data.trial?.gt_time
            ? dayjs(data.trial.gt_time, "HH:mm").toDate()
            : null,
          discontinue_reason: `${data.trial?.discontinue_reason}`,
          first_name: `${data.trial.first_name}`,
          last_name: `${data.trial.last_name}`,
          age: data.trial.age || 1,
          contact_no: `${data.trial.contact_no}`,
          gender: `${data.trial.gender}`,
          email: `${data.trial.email || "-"}`,
          primary_nicotine_product: `${data.trial.primary_nicotine_product}`,
          marketing_opt_in: `${data.trial.marketing_opt_in}`,
          registration_channel: `${data.trial.registration_channel}`,
          privacy_notice: `${data.trial.privacy_notice}`,
          date_of_birth: data.trial?.date_of_birth
            ? dayjs(data.trial.date_of_birth, "YYYY-MM-DD").toDate()
            : null,
          week: `${hypercare.week}`,
          different_address: hypercare.status === "PENDING" ? "YES" : "NO",
          call_info: {
            answered_call: hypercare.call_info?.answered_call ? "YES" : "NO",
            status: `${hypercare?.call_info?.status}`,
            schedule_date: hypercare.call_info?.schedule_date
              ? dayjs(hypercare.call_info.schedule_date, "YYYY-MM-DD").toDate()
              : null,
            schedule_time: hypercare.call_info?.schedule_time
              ? dayjs(hypercare.call_info.schedule_time, "HH:mm").toDate()
              : null,
            has_time: hypercare.call_info?.has_time ? "YES" : "NO",
            reschedule_date: hypercare.call_info?.reschedule_date
              ? dayjs(
                  hypercare.call_info.reschedule_date,
                  "YYYY-MM-DD",
                ).toDate()
              : null,
            reschedule_time: hypercare.call_info?.reschedule_time
              ? dayjs(hypercare.call_info.reschedule_time, "HH:mm").toDate()
              : null,
            type: hypercare.call_info?.type,
          },
          consumer_address: {
            unit: hypercare?.consumer_address?.unit || "",
            city: hypercare.consumer_address?.city || "",
            address1: hypercare.consumer_address?.address1 || "",
            address2: hypercare.consumer_address?.address2 || "",
            province: hypercare.consumer_address?.province || "",
            barangay: hypercare.consumer_address?.barangay || "",
            zip_code: hypercare.consumer_address?.zip_code || "",
            region: hypercare.consumer_address?.region || "",
          },

          interested_to_zyn: hypercare.interested_to_zyn ? "YES" : "NO",
          delivery_date:
            hypercare?.delivery_date && hypercare.status === "COMPLETED"
              ? dayjs(hypercare.delivery_date, "YYYY-MM-DD").toDate()
              : dayjs().toDate(),
          delivery_time: hypercare?.delivery_time
            ? dayjs(hypercare.delivery_time, "HH:mm").toDate()
            : dayjs().toDate(),
          feedback_date: hypercare?.feedback_date
            ? dayjs(hypercare.feedback_date, "YYYY-MM-DD").toDate()
            : dayjs().add(1, "day").toDate(),
          feedback_time: hypercare?.feedback_time
            ? dayjs(hypercare.feedback_time, "HH:mm").toDate()
            : dayjs().toDate(),
          extended_adoption: hypercare.extended_adoption ? "YES" : "NO",
          continue_feedback: `${hypercare.continue_feedback ? "YES" : "NO"}`,
          status: hypercare.status || "PENDING",
          date: `${hypercare.date}`,
          time: `${hypercare.time}`,
          schedule_logs: hypercare.schedule_logs,
          orders:
            hypercare.orders?.map((e: OrderInput) => {
              return {
                sku: `${e?.sku}`,
                variant: `${e?.variant}`,
                description: `${e?.description}`,
                quantity: `${e?.quantity}`,
                uom: `${e?.uom}`,
              };
            }) || [],
          feedbacks:
            hypercare.feedbacks &&
            hypercare.feedbacks.length > 0 &&
            hypercare?.status !== "PENDING"
              ? hypercare.feedbacks
                  ?.filter(
                    (e: Feedback) =>
                      !e?.title?.includes("(AFTERNOON)") &&
                      !e?.title?.includes("(MORNING)") &&
                      !e?.title?.includes("(NIGHT)") &&
                      !e?.title?.includes("(OTHERS)"),
                  )
                  .map((item: Feedback) => {
                    return {
                      title: `${item?.title}`,
                      response: `${item?.response || ""}`,
                      selections: [],
                    };
                  }) || []
              : getFeedbackSurveys,
          moments_morning:
            hypercare?.feedbacks?.length > 0 && hypercare?.status !== "PENDING"
              ? hypercare?.feedbacks
                  .filter((e: Feedback) => e?.title?.includes("MORNING"))
                  .map((item: Feedback) => {
                    return {
                      title: `${item.title}`,
                      response: `${item.response}`,
                    };
                  })
              : getFeedbackMomentsQuestions.filter((e) =>
                  e.title.includes("MORNING"),
                ),
          moments_afternoon:
            hypercare?.feedbacks?.length > 0 && hypercare?.status !== "PENDING"
              ? hypercare?.feedbacks
                  .filter((e: Feedback) => e?.title?.includes("AFTERNOON"))
                  .map((item: Feedback) => {
                    return {
                      title: `${item.title}`,
                      response: `${item.response}`,
                    };
                  })
              : getFeedbackMomentsQuestions.filter((e) =>
                  e.title.includes("AFTERNOON"),
                ),
          moments_night:
            hypercare?.feedbacks?.length > 0 && hypercare?.status !== "PENDING"
              ? hypercare?.feedbacks
                  .filter((e: Feedback) => e?.title?.includes("NIGHT"))
                  .map((item: Feedback) => {
                    return {
                      title: `${item.title}`,
                      response: `${item.response}`,
                    };
                  })
              : getFeedbackMomentsQuestions.filter((e) =>
                  e.title.includes("NIGHT"),
                ),
          moments_others:
            hypercare?.feedbacks?.length > 0 && hypercare?.status !== "PENDING"
              ? hypercare?.feedbacks
                  .filter((e: Feedback) => e?.title?.includes("OTHERS"))
                  .map((item: Feedback) => {
                    return {
                      title: `${item.title}`,
                      response: `${item.response}`,
                    };
                  })
              : getFeedbackMomentsQuestions.filter((e) => e.title == ""),
          not_interested_to_zyn: hypercare?.feedbacks
            ? hypercare.feedbacks.find(
                (e: Feedback) => e?.title?.includes("Thank you very much"),
              )?.response || ""
            : "",
        };
        setTimeout(() => {
          reset(defaultValues);
          setDefaultHypercare(defaultValues);
        }, 100);

        console.log(defaultValues.moments_morning);
      });
    });
  };

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
    const nextWeek = `WEEK 2`;
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
    if (extendedAdoption && data.orders.length < 1)
      return Notification.error({ message: "Please add preferred Zyn!" });
    setLoading(true);
    const orderAddress = {
      address_extention_1: data.consumer_address?.address1,
      city: data.consumer_address?.city,
      country: "PH",
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      region: data.consumer_address.region,
      street: data.consumer_address?.unit,
      telephone_number: data.contact_no,
    };

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

    const currentWeekInput = {
      customer_id: data.customer_id,
      hypercare_id: defaultHypercare?.hypercare_id,
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
      date: defaultHypercare?.date,
      time: defaultHypercare?.time,
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
      customer_number: trial?.contact_no,
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
        if (currentWeekInput.status === "COMPLETED" && extendedAdoption) {
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
                    setProgress({ label: ``, value: 0 });
                    Notification.success({
                      message: `Hypercare ${nextWeekInput.week} Created`,
                    });
                    loadTrial();
                    setLoading(false);
                  }, 100);
                })
                .catch((error) => {
                  setLoading(false);
                  setProgress({ label: ``, value: 0 });
                  Notification.error({
                    title: `Order Failed`,
                    message: error.message,
                  });
                });
            })
            .catch((error) => {
              setLoading(false);
              setProgress({ label: ``, value: 0 });
              Notification.error({
                title: `Hypercare ${nextWeekInput.week} Error`,
                message: error.message,
              });
            });
        } else {
          setProgress({
            label: `Updating ${currentWeekInput.week}`,
            value: 100,
          });
          setTimeout(() => {
            setLoading(false);
            loadTrial();
            setProgress({ label: ``, value: 0 });
            Notification.success({
              message: `Hypercare ${currentWeekInput.week} Updated`,
            });
          }, 100);
        }
      })
      .catch((error) => {
        setLoading(false);
        Notification.error({
          title: `Hypercare ${currentWeekInput.week} Error`,
          message: error.message,
        });
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <div style={{ cursor: "pointer" }} onClick={() => history.back()}>
            <Group align="center">
              <IconArrowLeft size={30} stroke={4} />
              <h2> Consumer Trial Details</h2>
            </Group>
          </div>
          <CRMTrialConsumerInfo
            control={control}
            setValue={setValue}
            getValues={getValues}
            watch={watch}
            errors={errors}
            isUpdate={true}
          />
          {trial?.registration_channel === "IQOS" ||
          trial?.registration_channel === "Marlboro" ? undefined : (
            <ZynUsedItems items={trial?.zyn_used || []} />
          )}
          {defaultHypercare ? (
            <div>
              {loading ? (
                <Paper radius={10}>
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
                </Paper>
              ) : (
                <HypercareWeekForm
                  hypercare={undefined}
                  control={control}
                  setValue={setValue}
                  getValues={getValues}
                  watch={watch}
                  errors={errors}
                  isUpdate={true}
                  isLatestWeek={defaultHypercare ? true : false}
                  reset={() => reset(defaultHypercare)}
                  onSave={() => handleSubmit(onSubmit)}
                />
              )}
              <br />
            </div>
          ) : undefined}
        </Stack>
      </form>
    </div>
  );
};
