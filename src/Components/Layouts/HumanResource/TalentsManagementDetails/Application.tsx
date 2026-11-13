import { HR } from "../../../../GraphQL";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Group,
  Input,
  Paper,
  Stack,
  Text,
  Badge,
  DatePicker,
  TextArea,
  RadioGroup,
  Select,
  Modal,
} from "../../../Elements";
import { ApplicationStatus } from "../TalentsManagements/TalentsManagementConfig";
import { useMutation } from "@apollo/client";
import {
  updateTalentDetails,
  sendEmail,
  verifyOtp,
} from "../../../../GraphQL/HRSchema";
import Notification from "../../../Elements/Notification/Notification";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { userAtom } from "../../../../Store/StoreAtom";
import { NoteModal } from "./TalentDetailsComponets/NoteModal";
import { Propeller } from "tabler-icons-react";
type Props = {
  candidate?: HR.Maybe<HR.Talent>;
};

export const Application = (props: Props) => {
  const [user] = useAtom(userAtom);
  const [remarks, setRemarks] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [interviewStartTime, setInterviewStartTime] = useState<string>("");
  const [interviewEndTime, setInterviewEndTime] = useState<string>(""); // Added for End Time
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [finalInterviewerName, setFinalInterviewerName] = useState<string>("");
  const [initialInterviewerName, setInitialInterviewerName] =
    useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [jo, setJO] = useState("");
  const onOpen = () => setIsConfirming(true);
  const onCancel = () => {
    setIsConfirming(false);
    setJoReason;
  };
  const [interviewDate, setInterviewDate] =
    useState<Date | undefined>(undefined);
  const [passed, setPassed] = useState<boolean>(false);
  const [managerEmail, setManagerEmail] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [forInterviewRemarkText, setForInterviewRemarkText] =
    useState<string>("");
  const [passedInterviewRemarkText, setPassedInterviewRemarkText] =
    useState<string>("");

  const [isScheduleSaved, setIsScheduleSaved] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [managerEmailList, setManagerEmailList] = useState<string[]>([]);

  const [joReason, setJoReason] = useState<string>("");

  //for verify otp
  const [otpValue, setOtpValue] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<HR.Status | null>(null);
  const [verifyOtpMutation, { loading: verifying }] = useMutation(verifyOtp);

  const [coInterviewerName, setCoInterviewerName] = useState<string>("");
  const [coInterviewerList, setCoInterviewerList] = useState<string[]>([]);

  const [updateTalent, { loading: loadingRequest }] = useMutation(
    updateTalentDetails,
    { context: { clientName: "warehouse" } },
  );

  const [sendEmailToManager] = useMutation(sendEmail, {
    context: { clientName: "warehouse" },
  });

  useEffect(() => {
    const date = props?.candidate?.interviews?.find(
      (e) => e?.stage == HR.Status.INITIAL_INTERVIEW,
    );

    if (!date?.date_schedule) return;

    const dateFinalInterview = props?.candidate?.interviews?.find(
      (e) => e?.stage == HR.Status.FINAL_INTERVIEW,
    );

    if (props.candidate?.status == HR.Status.INITIAL_INTERVIEW) {
      const rawTime = date.interview_time ?? "";
      if (rawTime.includes(" - ")) {
        const [start, end] = rawTime.split(" - ");
        setInterviewStartTime(start);
        setInterviewEndTime(end);
      } else {
        setInterviewStartTime(rawTime);
        setInterviewEndTime("");
      }
    } else {
      setInterviewStartTime(dateFinalInterview?.interview_time ?? "");
      setDay(dateFinalInterview?.interview_time?.includes("PM") ? "PM" : "AM");
    }

    setScheduleDate(dayjs(date?.date_schedule * 1000).toDate());
    setInitialInterviewerName(date.interviewer ?? "");
    setFinalInterviewerName(dateFinalInterview?.interviewer ?? "");
    setGeneratedLink(date.google_meet_link ?? "");
    if (!dateFinalInterview?.date_schedule) return;
    setInterviewDate(dayjs(dateFinalInterview?.date_schedule * 1000).toDate());
  }, [props?.candidate?.interviews]);

  useEffect(() => {
    setIsScheduleSaved(false);
  }, [props.candidate?.status]);

  useEffect(() => {
    const forInterviewRemark = props.candidate?.remarks?.find(
      (r) => r?.interview_stage === HR.Status.INITIAL_INTERVIEW,
    );

    if (forInterviewRemark?.remark) {
      setForInterviewRemarkText(forInterviewRemark.remark);
    }

    const finalInterviewRemark = props.candidate?.remarks?.find(
      (r) => r?.interview_stage === HR.Status.FINAL_INTERVIEW,
    );

    if (finalInterviewRemark?.remark) {
      setRemarks(finalInterviewRemark.remark);
    }

    const passedInterviewRemark = props.candidate?.remarks?.find(
      (r) => r?.interview_stage === HR.Status.CANCELLED,
    );

    if (passedInterviewRemark?.remark) {
      setPassedInterviewRemarkText(passedInterviewRemark.remark);
    }
  }, [props.candidate?.remarks]);

  const handleChange = (value: string) => {
    setPassed(value === "true");
  };

  const getSingleTimestamp = (dateObj: Date | undefined, timeStr: string, period?: string) => {
    if (!dateObj || !timeStr) return null;

    let hour: number;
    let minute: number;
    let amPm: string | undefined = period;

    const cleanTimeStr = timeStr.trim();

    if (cleanTimeStr.includes(" ")) {
      const [timePart, periodPart] = cleanTimeStr.split(" ");
      const [h, m] = timePart.split(":");
      hour = parseInt(h);
      minute = parseInt(m);
      amPm = periodPart;
    } else {
      const [h, m] = cleanTimeStr.split(":");
      hour = parseInt(h);
      minute = parseInt(m || "0");
    }

    if (amPm === "PM" && hour !== 12) hour += 12;
    if (amPm === "AM" && hour === 12) hour = 0;

    return dayjs(dateObj).hour(hour).minute(minute).second(0).unix();
  };

  const handleScheduleSave = async () => {
    const candidateId = props.candidate?.id;
    const currentStatus = props.candidate?.status || "";

    if (!candidateId) {
      Notification.error({
        title: "Error",
        message: "Candidate ID is missing. Please refresh the page.",
      });
      return;
    }

    const activeDate =
      currentStatus === HR.Status.FINAL_INTERVIEW
        ? interviewDate
        : scheduleDate;

    const isInitial = currentStatus === HR.Status.INITIAL_INTERVIEW;

    if (isInitial && (!interviewStartTime || !interviewEndTime)) {
      Notification.error({
        title: "Validation Error",
        message: "Please enter both the start time and end time.",
      });
      return;
    }

    const startTime = getSingleTimestamp(
      activeDate,
      interviewStartTime,
      currentStatus === HR.Status.FINAL_INTERVIEW ? day : undefined,
    );

    const endTime = currentStatus === HR.Status.FINAL_INTERVIEW
      ? (startTime ? startTime + 1800 : null)
      : getSingleTimestamp(activeDate, interviewEndTime);

    const activeInterviewer =
      currentStatus === HR.Status.FINAL_INTERVIEW
        ? finalInterviewerName
        : initialInterviewerName;

    setIsProcessing(true);
    let gmeetLink: string | null = null;
    try {
      const hasForInterview = (props.candidate?.interview_logs ?? []).some(
        (log) => log?.interview_stage === HR.Status.INITIAL_INTERVIEW,
      );

      const logStatus = hasForInterview
        ? HR.InterviewLogsStatus.RESCHEDULE
        : HR.InterviewLogsStatus.SUCCESS;

      if (currentStatus !== HR.Status.FINAL_INTERVIEW) {
        const response = await sendEmailToManager({
          variables: {
            input: {
              recipients: [props.candidate?.details?.email, user?.email].filter(
                Boolean,
              ) as string[],
              subject: `Initial Interview Invitation: ${props.candidate?.position?.replaceAll("_", " ")} at ActivAsia Inc.`,
              body: `
<p>Hi, ${props.candidate?.details?.name?.replaceAll("_", " ")}!</p>

<p>Good day!</p>

<p>
Thank you for your interest in the ${props.candidate?.position?.replaceAll("_", " ")} role at ActivAsia Inc.
</p>

<p>
We would like to invite you to an Initial Interview to further discuss your qualifications and provide you with more information about the role.
</p>

<p>
<strong>Interview Details:</strong><br/>
Date: ${startTime ? dayjs.unix(startTime).format("MMMM D, YYYY") : "To be confirmed"}<br/>
Time: ${startTime ? dayjs.unix(startTime).format("h:mm A") : "TBA"}${endTime ? ` - ${dayjs.unix(endTime).format("h:mm A")}` : ""}<br/>
Meeting Link/Details: You will receive a separate Google Meet invitation for this interview.
</p>

<p>
Kindly join the interview at least 5 minutes before your scheduled time and ensure you have a stable internet connection since the interview will be conducted online.
</p>

<p>We look forward to speaking with you!</p>

<p>Thank you, and have a great day!</p>

<p>
Sincerely,<br/>
ActivAsia Recruitment Team
</p>
`,
              isInterview: true,
              applicantName: props.candidate?.details?.name ?? "Applicant",
              position: props.candidate?.position?.replace("_", " ") ?? "",
              startTime,
              endTime,
              applicantEmail: props.candidate?.details?.email ?? "",
              hrEmail: user?.email || "",
              managerEmail: "",
              cv_link: props.candidate?.cv_link ?? "",
              co_interviewers: coInterviewerList.filter(Boolean) as string[],
            },
          },
        });

        console.log("Email response:", response);

        if (!response.data?.sendEmails?.google_meet_link) {
          Notification.error({
            title: "Communication Schedule",
            message: "Failed to generate gmeet",
          });
        }

        gmeetLink = response.data?.sendEmails?.google_meet_link;
        setGeneratedLink(gmeetLink ?? "");
      }

      const existingInterviews = props.candidate?.interviews ?? [];

      const updatedInterviewer = existingInterviews.map(
        (r: HR.Maybe<HR.InterviewDetails>) =>
          r?.stage === currentStatus
            ? {
              stage: currentStatus,
              interviewer: activeInterviewer,
              date_schedule: startTime,
              interview_time:
                currentStatus === HR.Status.FINAL_INTERVIEW
                  ? ""
                  : `${interviewStartTime} - ${interviewEndTime}`,
              google_meet_link: gmeetLink,
            }
            : {
              stage: r?.stage ?? "",
              interviewer: r?.interviewer ?? null,
              date_schedule: r?.date_schedule ?? null,
              interview_time: r?.interview_time ?? null,
              google_meet_link: r?.google_meet_link ?? null,
            },
      );

      await updateTalent({
        variables: {
          input: {
            id: candidateId,
            status: currentStatus,
            interviews: updatedInterviewer,
            interview_logs: [
              {
                interview_stage: currentStatus,
                date_schedule: dayjs().unix(),
                log_status: logStatus,
                updated_by: user.username,
              },
            ],
          },
        },
      });

      Notification.success({
        title: "Communication Schedule",
        message:
          currentStatus === HR.Status.FINAL_INTERVIEW
            ? "Schedule saved successfully"
            : "Schedule saved and calendar invitation sent successfully",
      });

      setIsScheduleSaved(true);
    } catch (error) {
      console.log(error);
      Notification.error({
        title: "Communication Schedule",
        message: "Failed to save",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveRemarkForFinal = async () => {
    const existingRemarks = props.candidate?.remarks ?? [];

    const updatedRemarks = existingRemarks.map((r: HR.Maybe<HR.Remarks>) =>
      r?.interview_stage === HR.Status.FINAL_INTERVIEW
        ? {
          interview_stage: HR.Status.FINAL_INTERVIEW,
          remark: remarks,
          remark_by: user.username,
        }
        : {
          interview_stage: r?.interview_stage ?? "",
          remark: r?.remark ?? null,
          remark_by: r?.remark_by ?? null,
        },
    );

    try {
      await updateTalent({
        variables: {
          input: {
            id: props.candidate?.id,
            remarks: updatedRemarks,
          },
        },
      });

      Notification.success({
        title: "Saved Successfully",
        message: "Remarks saved successfully",
      });
    } catch (error) {
      console.error(error);
      Notification.error({
        title: "Save Failed",
        message: "Failed to update remarks/movement status",
      });
    }
  };

  const handleSaveRemark = async (status: HR.Status) => {
    if (!props.candidate?.id) return;

    const existingRemarks = props.candidate.remarks ?? [];

    const updatedRemarks = existingRemarks.map((r) =>
      r?.interview_stage === status
        ? {
          interview_stage: status,
          remark:
            status == HR.Status.INITIAL_INTERVIEW
              ? forInterviewRemarkText
              : passedInterviewRemarkText,
          remark_by: user.username,
        }
        : {
          interview_stage: r?.interview_stage ?? "",
          remark: r?.remark ?? null,
          remark_by: r?.remark_by ?? null,
        },
    );

    try {
      await updateTalent({
        variables: {
          input: {
            id: props.candidate.id,
            status:
              status === HR.Status.CANCELLED ? status : props.candidate?.status,
            remarks: updatedRemarks,

            ...(status === HR.Status.CANCELLED && {
              interview_logs: [
                {
                  interview_stage: HR.Status.CANCELLED,
                  date_schedule: dayjs().unix(),
                  log_status: HR.InterviewLogsStatus.CANCELLED,
                  updated_by: user.username,
                },
              ],
            }),
          },
        },
      });

      if (status === HR.Status.CANCELLED) {
        sendEmailToManager({
          variables: {
            input: {
              recipients: [
                props.candidate?.details?.email,
                "rbu.hrnotifications@activasia.com",
              ],
              subject: `Applicantion Status: ${props.candidate?.details?.name?.replaceAll(
                "_",
                " ",
              )} - ${props.candidate?.position?.replaceAll("_", " ")}`,
              body: `
              <p>Dear ${props.candidate?.details?.name?.replaceAll("_", " ")},</p>
              <br/>

              <p>Thank you for your interest in joining ActivAsia, Inc. and for taking the time to participate in our recruitment process.</p>

              <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. While we appreciate your qualifications and the effort you invested throughout the process, we have decided to proceed with candidates whose profiles more closely match the current requirements of the role.</p>

              <p>We sincerely appreciate your interest in becoming part of our organization and encourage you to apply again for future opportunities that may align with your experience and career goals.</p>

              <p>Thank you once again for considering ActivAsia, Inc. We wish you continued success in your professional journey.</p>

              <br />
              <p>Sincerely,<br /><strong>ActivAsia Recruitment Team</strong></p>

              <hr />
              <p style="color: #666666; font-size: 12px;"><em>** This is an autogenerated email. Please do not reply. **</em></p>
            `,
            },
          },
        });
      }

      Notification.success({
        title:
          status == HR.Status.CANCELLED
            ? "Movement Status"
            : "Saved Successfully",
        message:
          status == HR.Status.CANCELLED
            ? "Status sucessfully save to CANCELLED"
            : "Remarks saved successfully",
      });
    } catch (error) {
      console.error(error);
      Notification.error({
        title: "Save Failed",
        message: "Failed to update remarks/movement status",
      });
    }
  };

  const handlePassedCandidate = async () => {
    if (!props.candidate?.id) return;

    if (!scheduleDate) {
      Notification.error({
        title: "Movement Status",
        message: "Failed to update status",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await sendEmailToManager({
        variables: {
          input: {
            recipients: [
              props.candidate?.details?.email,
              "rbu.hrnotifications@activasia.com",
            ],
            subject: `Update on Your Application for ${props.candidate?.position?.replaceAll(
              "_",
              " ",
            )}`,
            body: `
              <p>Dear ${props.candidate?.details?.name?.replaceAll("_", " ")},</p>

              <p>Congratulations!</p>

              <p>We are pleased to inform you that you have successfully passed the initial interview stage for the ${props.candidate?.position?.replaceAll(
              "_",
              " ",
            )} position at ActivAsia, Inc.<br/>
              We would like to move forward with your application to the final interview stage. One of our team members will contact you shortly regarding the schedule and further details of your final interview.</p>

              <p>Thank you for your continued interest in joining our organization. We look forward to speaking with you again soon.</p>

              <br />
              <p>Sincerely,<br /><strong>ActivAsia Recruitment Team</strong></p>

              <hr />
              <p style="color: #666666; font-size: 12px;"><em>** This is an autogenerated email. Please do not reply. **</em></p>
            `,
          },
        },
      });

      await updateTalent({
        variables: {
          input: {
            id: props.candidate?.id,
            status: HR.Status.PASSED_INTERVIEW,
            interview_logs: [
              {
                interview_stage: HR.Status.PASSED_INTERVIEW,
                date_schedule: dayjs().unix(),
                log_status: HR.InterviewLogsStatus.SUCCESS,
                updated_by: user.username,
              },
            ],
          },
        },
      });

      Notification.success({
        title: "Movement Status",
        message: "Status sucessfully save to PASSED",
      });
    } catch (error) {
      console.log(error);
      Notification.error({
        title: "Movement Status",
        message: "Failed to save",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const statusBadge = (statusTitle?: string) => {
    if (!statusTitle) {
      return <Badge color="gray">Unknown</Badge>;
    }

    const statusConfig = ApplicationStatus.find(
      (item) => item.title === statusTitle,
    );

    if (!statusConfig) {
      return <Badge>{statusTitle.replace("_", " ")}</Badge>;
    }

    return (
      <Badge color={statusConfig.color}>
        {statusConfig.title.replace("_", " ")}
      </Badge>
    );
  };

  const endoreseToManager = () => {
    let url;
    const stage = process.env.NEXT_PUBLIC_PLATFORM;
    if (!stage) {
      Notification.error({
        title: "ERROR",
        message: "Failed to save",
      });
      return;
    }

    if (stage == "production") {
      url = `https://iqos.activasia.com/human-resource/talent-manager-access/?transactionID=${props.candidate?.id}`;
    } else {
      url = `https://pre.iqos.activasia.com/human-resource/talent-manager-access/?transactionID=${props.candidate?.id}`;
    }

    try {
      sendEmailToManager({
        variables: {
          input: {
            recipients: [
              ...managerEmailList,
              "rbu.hrnotifications@activasia.com",
            ],
            subject: `Applicant Endorsement: ${props.candidate?.details?.name?.replaceAll(
              "_",
              " ",
            )} - ${props.candidate?.position?.replace(/_/g, " ")}`,
            body: `
              <p>Hi Manager,</p>

              <p>Please review the application for <strong>${props.candidate?.details?.name
              }</strong>, who is applying for the <strong>${props.candidate?.position?.replace(
                /_/g,
                " ",
              )}</strong> position.</p>

              <p>You can view the applicant's profile and the HR endorsement for the final interview here:</p>
              
              <p><a href="${url}">${url}</a></p>

              <p>this is the one time code: <strong>${props.candidate?.otp?.otp_code
              }</strong></p>

              <br />
              <p>Thanks,<br /><strong>HR Team</strong></p>

              <hr />
              <p style="color: #666666; font-size: 12px;"><em>** This is an autogenerated email. Please do not reply. **</em></p>
            `,
          },
        },
      });

      updateTalent({
        variables: {
          input: {
            id: props.candidate?.id,
            status: HR.Status.FINAL_INTERVIEW,
            manager_email: managerEmailList.join(","),
            interview_logs: [
              {
                interview_stage: HR.Status.FINAL_INTERVIEW,
                date_schedule: dayjs().unix(),
                log_status: HR.InterviewLogsStatus.SUCCESS,
                updated_by: user.username,
              },
            ],
          },
        },
      });

      Notification.success({
        title: "Movement Status",
        message: "Status sucessfully save to ENDORSE TO MANAGER",
      });
    } catch (error) {
      console.log(error);
      Notification.error({
        title: "Movement Status",
        message: "Failed to save",
      });
    }
  };

  const saveFinalInterviewSchedule = async () => {
    let response = await handleEmailTrigger();

    if (!day) {
      return Notification.error({
        title: "Email",
        message: "Failed to send: please enter time and period of day",
      });
    }

    if (interviewDate == null) {
      Notification.error({
        title: "ERROR",
        message: "date is required",
      });

      return;
    }

    try {
      const existingInterviews = props.candidate?.interviews ?? [];
      const updatedInterviewer = existingInterviews.map(
        (r: HR.Maybe<HR.InterviewDetails>) =>
          r?.stage === HR.Status.FINAL_INTERVIEW
            ? {
              stage: HR.Status.FINAL_INTERVIEW,
              google_meet_link:
                response.data.data.sendEmails.google_meet_link ?? "",
              interviewer: finalInterviewerName ?? "unknown",
              date_schedule: Math.floor(interviewDate.getTime() / 1000),
              interview_time:
                interviewStartTime.replace(/AM|PM/g, "").trim() + " " + day,
            }
            : {
              stage: r?.stage ?? "",
              interviewer: r?.interviewer ?? null,
              date_schedule: r?.date_schedule ?? null,
              interview_time: r?.interview_time ?? null,
              google_meet_link: r?.google_meet_link ?? null,
            },
      );

      updateTalent({
        variables: {
          input: {
            id: props.candidate?.id,
            interviews: updatedInterviewer,
            interview_logs: [
              {
                interview_stage: HR.Status.FINAL_INTERVIEW,
                date_schedule: dayjs().unix(),
                log_status: HR.InterviewLogsStatus.RESCHEDULE,
                updated_by: user.username,
              },
            ],
          },
        },
      });
      Notification.success({
        title: "Communication Schedule",
        message: "Save Successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      Notification.error({
        title: "Communication Schedule",
        message: "Failed to save",
      });
    }
  };

  const handleEmailTrigger = async (): Promise<{
    isSuccess: number;
    data: any | null;
  }> => {
    if (!interviewDate || !interviewStartTime || !day) {
      return {
        isSuccess: 0,
        data: null,
      };
    }

    try {
      let start: number | null = null;
      let end: number | null = null;

      if (interviewDate && interviewStartTime && day) {
        const [hourStr, minuteStr] = interviewStartTime.split(":");

        let hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);

        if (day === "PM" && hour !== 12) hour += 12;
        if (day === "AM" && hour === 12) hour = 0;

        const date = new Date(interviewDate);
        date.setHours(hour, minute, 0, 0);

        start = Math.floor(date.getTime() / 1000);
        end = start + 1800; // +30 minutes
      }

      const response = await sendEmailToManager({
        variables: {
          input: {
            recipients: [
              ...managerEmailList,
              props.candidate?.details?.email,
              "rbu.hrnotifications@activasia.com",
            ],
            subject: `Final Interview Invitation: ${props.candidate?.position?.replaceAll("_", " ")} at ActivAsia Inc.`,
            body: `<p>Hi, ${props.candidate?.details?.name?.replaceAll(
              "_",
              " ",
            )}!</p>

<p>Good day!</p>

<p>Congratulations on successfully passing the initial interview.</p>

<p>We are pleased to invite you to the Final Interview for the ${props.candidate?.position?.replaceAll(
              "_",
              " ",
            )} role at ActivAsia Inc. This interview will be an opportunity for you to meet with the hiring manager and further discuss your qualifications, experience, and the role.</p>

<p>Interview Details:<br/>
Date: ${interviewDate?.toLocaleDateString()}<br/>
Time: ${interviewStartTime.replace(
              /\s?(AM|PM)/i,
              "",
            )} ${day}<br/>
Meeting Link/Details: ${generatedLink || "To be provided by the HR team"}</p>

<p>Kindly join the interview at least 5 minutes before your scheduled time and ensure you have a stable internet connection if the interview will be conducted online.<br/>
We look forward to speaking with you and wish you the best in the final stage of our recruitment process.<br/>
Thank you, and have a great day!</p>

<p>Sincerely,<br/>
ActivAsia Recruitment Team</p>

<hr />
              <p style="color: #666666; font-size: 12px;"><em>** This is an autogenerated email. Please do not reply. **</em></p>
`,
            isInterview: true,
            applicantName: props.candidate?.details?.name ?? "applicant",
            position: props.candidate?.position,
            startTime: start,
            endTime: end,
            applicantEmail: props.candidate?.details?.email,
            managerEmail: "",
            hrEmail: user?.email || "",
            cv_link: props.candidate?.cv_link ?? "",
          },
        },
      });

      Notification.success({
        title: "Email",
        message: "Email send successfully",
      });

      return {
        isSuccess: 1,
        data: response,
      };
    } catch (error) {
      console.log(error);
      Notification.error({
        title: "Email",
        message: "Failed to send",
      });
      return {
        isSuccess: 0,
        data: null,
      };
    }
  };

  const handleProceedToInitial = async () => {
    if (!props.candidate?.id) return;

    try {
      await updateTalent({
        variables: {
          input: {
            id: props.candidate.id,
            status: HR.Status.INITIAL_INTERVIEW,
            interview_logs: [
              {
                interview_stage: HR.Status.INITIAL_INTERVIEW,
                date_schedule: dayjs().unix(),
                log_status: HR.InterviewLogsStatus.SUCCESS,
                updated_by: user.username,
              },
            ],
          },
        },
      });
      Notification.success({
        title: "Movement Status",
        message: "Candidate moved to Initial Interview stage",
      });
    } catch (error) {
      console.error(error);
      Notification.error({
        title: "Movement Status",
        message: "Failed to update status to Initial Interview",
      });
    }
  };

  const passedInterviewSection = () => {
    const handleGenerateMeetLink = async () => {
      if (generatedLink) {
        window.open(generatedLink, "_blank", "noopener, noreferrer");
        return;
      } else {
        Notification.error({
          title: "Link not found",
          message:
            "The Google Meet link has not been generated yet. Please try re-saving.",
        });
      }
    };

    const generateTimeOptions = () => {
      const options = [];
      for (let hour = 9; hour <= 18; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          if (hour === 18 && minute > 0) break;
          const period = hour >= 12 ? "PM" : "AM";
          let displayHour = hour > 12 ? hour - 12 : hour;
          if (displayHour === 0) displayHour = 12;
          const displayMinute = minute.toString().padStart(2, "0");
          const timeLabel = `${displayHour}:${displayMinute} ${period}`;
          options.push({ label: timeLabel, value: timeLabel });
        }
      }
      return options;
    };

    const TIME_OPTIONS = generateTimeOptions();

    const isPassedScreening =
      props.candidate?.status === HR.Status.PASSED_SCREENING;

    return (
      <Paper radius="md">
        <Text size={"lg"}><span style={{ fontWeight: 500 }}>Application Status:</span> {statusBadge(props.candidate?.status ?? undefined)}</Text>
        <br />

        {isPassedScreening ? (
          <Stack align="flex-start">
            <Button
              radius="md"
              onClick={handleProceedToInitial}
              loading={loadingRequest}
            >
              Proceed to Initial Interview
            </Button>
          </Stack>
        ) : (
          <>
            <Stack>
              <Text>Communication Schedule and Interviewer:</Text>
              <Group direction="row" align="top">
                <Group>
                  <DatePicker
                    label="Interview Date"
                    value={scheduleDate ?? undefined}
                    onChange={(val) => {
                      setScheduleDate(val);
                      setIsScheduleSaved(false);
                    }}
                  />

                  {props.candidate?.status !== HR.Status.FINAL_INTERVIEW && (
                    <>
                      <Select
                        label="Start Time"
                        placeholder="Select Start Time"
                        searchable
                        data={TIME_OPTIONS}
                        value={interviewStartTime}
                        onChange={(val) => {
                          setInterviewStartTime(val ?? "");
                          setIsScheduleSaved(false);
                        }}
                      />
                      <Select
                        label="End Time"
                        placeholder="Select End Time"
                        searchable
                        data={TIME_OPTIONS}
                        value={interviewEndTime}
                        onChange={(val) => {
                          setInterviewEndTime(val ?? "");
                          setIsScheduleSaved(false);
                        }}
                      />
                    </>
                  )}

                  <Input
                    placeholder="Enter Interviewer name"
                    label="Interviewer"
                    value={initialInterviewerName}
                    onChange={(e) => {
                      setInitialInterviewerName(e.currentTarget.value);
                      setIsScheduleSaved(false);
                    }}
                  />

                  <Group align="flex-end">
                    <Input
                      style={{ width: 250 }}
                      placeholder="Enter Co-Interviewer email"
                      label="Co-Interviewer"
                      value={coInterviewerName}
                      onChange={(e) => setCoInterviewerName(e.currentTarget.value)}
                    />

                    <Button
                      radius="md"
                      onClick={() => {
                        if (!coInterviewerName.trim()) return;
                        if (!coInterviewerList.includes(coInterviewerName.trim())) {
                          setCoInterviewerList([...coInterviewerList, coInterviewerName.trim()]);
                        }
                        setCoInterviewerName("");
                        setIsScheduleSaved(false);
                      }}
                    >
                      Add
                    </Button>

                    {coInterviewerList.length > 0 ? (
                      <Group align="center">
                        {coInterviewerList.map((name, idx) => (
                          <span
                            key={idx}
                            onClick={() => {
                              setCoInterviewerList(coInterviewerList.filter((_, i) => i !== idx));
                              setIsScheduleSaved(false);
                            }}
                          >
                            <Badge color="blue">
                              {name} ✕
                            </Badge>
                          </span>
                        ))}
                      </Group>
                    ) : null}
                  </Group>
                </Group>
              </Group>

              <Stack spacing="xs" align="flex-start">
                <Button
                  radius="md"
                  onClick={handleScheduleSave}
                  loading={isProcessing}
                >
                  Save
                </Button>

                {generatedLink && (
                  <div
                    onClick={handleGenerateMeetLink}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(0,0,0,0.05)",
                    }}
                  >
                    <img
                      src="https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-64dp/logo_meet_2020q4_color_2x_web_64dp.png"
                      alt="Google Meet"
                      style={{ width: 24, height: 24 }}
                    />
                    <Text size="sm" color="blue" fw={500}>
                      Join Google Meet
                    </Text>
                  </div>
                )}
              </Stack>
            </Stack>

            <br />
            <hr />
            <br />

            <Stack spacing="sm">
              <TextArea
                minRows={5}
                label="Interview Notes/Comments"
                placeholder="Write your notes/comments here"
                value={forInterviewRemarkText}
                onChange={(e) =>
                  setForInterviewRemarkText(e.currentTarget.value)
                }
              />
              <Group>
                <Button
                  radius="md"
                  onClick={() => handleSaveRemark(HR.Status.INITIAL_INTERVIEW)}
                >
                  Save Remark
                </Button>
              </Group>
            </Stack>
          </>
        )}
      </Paper>
    );
  };

  const finalInterviewSection = () => {
    return (
      <Paper radius="md">
        <Text size={"lg"}>Schedule for Final Interview</Text>
        <br />

        {props.candidate?.status == HR.Status.FINAL_INTERVIEW ? undefined : (
          <>
            {" "}
            <Group>
              <Input
                style={{ width: 300 }}
                type="text"
                label="Interviewer Name"
                placeholder="Type your name here"
                value={finalInterviewerName}
                onChange={(e) => setFinalInterviewerName(e.currentTarget.value)}
              />
              <Input
                style={{ width: 300 }}
                type="text"
                label="Interviewer Position"
                placeholder="Type your position here"
                value={position}
                onChange={(e) => setPosition(e.currentTarget.value)}
              />
            </Group>
          </>
        )}

        <br />
        <Group direction="row" align="top">
          <Text>Final Interview Schedule:</Text>
          <Group>
            {!isEditing ? (
              <>
                <DatePicker value={interviewDate} />
                <Button radius="md" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              </>
            ) : (
              <>
                <DatePicker
                  placeholder="Select date"
                  value={interviewDate}
                  onChange={setInterviewDate}
                />

                <Input
                  style={{ width: 100 }}
                  type="text"
                  placeholder="Time"
                  value={interviewStartTime.replace(/AM|PM/g, "").trim()}
                  onChange={(e) => setInterviewStartTime(e.currentTarget.value)}
                />

                <Select
                  style={{ width: 100 }}
                  clearable
                  value={day}
                  onChange={(e) => setDay(e)}
                  data={[
                    { label: "AM", value: "AM" },
                    { label: "PM", value: "PM" },
                  ]}
                  placeholder="Period"
                />

                <Button radius="md" onClick={saveFinalInterviewSchedule}>
                  {props.candidate?.status == HR.Status.FINAL_INTERVIEW
                    ? "Reschedule"
                    : "Save"}
                </Button>
              </>
            )}
          </Group>
        </Group>

        {props.candidate?.status == HR.Status.FINAL_INTERVIEW ? undefined : (
          <>
            {" "}
            <br />
            <hr />
            <br />
            <Group direction="row" justify="center" grow align="top">
              <Stack>
                <Text>
                  Dear {props.candidate?.details?.name},
                  <br />I am {finalInterviewerName}, the {position} of
                  activasia. I would like to invite you for the final interview
                  on {interviewDate?.toLocaleDateString()} at {interviewStartTime}{" "}
                  {day}
                </Text>

                <Group position="left">
                </Group>
              </Stack>
            </Group>
          </>
        )}
      </Paper>
    );
  };

  const joHandler = () => {
    if (!props.candidate?.id) return;

    const newStatus =
      jo == "accept" ? HR.Status.COMPLETED : HR.Status.CANCELLED;

    const existingRemarks = props.candidate?.remarks ?? [];
    let updatedRemarks = existingRemarks.map((r) => ({
      interview_stage: r?.interview_stage ?? "",
      remark: r?.remark ?? null,
      remark_by: r?.remark_by ?? null,
    }));

    if ((jo === "reject" || jo === "cancel") && joReason.trim() !== "") {
      const remarkExists = updatedRemarks.some(
        (r) => r.interview_stage === newStatus,
      );

      if (remarkExists) {
        updatedRemarks = updatedRemarks.map((r) =>
          r.interview_stage === newStatus
            ? { ...r, remark: joReason, remark_by: user.username ?? null }
            : r,
        );
      } else {
        updatedRemarks.push({
          interview_stage: newStatus,
          remark: joReason,
          remark_by: user.username ?? null,
        });
      }
    }

    try {
      updateTalent({
        variables: {
          input: {
            id: props.candidate?.id,
            status: newStatus,
            ...((jo === "reject" || jo === "cancel") && joReason.trim() !== ""
              ? { remarks: updatedRemarks }
              : {}),
            interview_logs: [
              {
                interview_stage: HR.Status.FINAL_INTERVIEW,
                date_schedule: dayjs().unix(),
                log_status: HR.InterviewLogsStatus.SUCCESS,
                updated_by: user.username,
              },
            ],
          },
        },
      });

      Notification.success({
        title: "Job Offer",
        message:
          jo == "accept"
            ? "JO Successfully accepted"
            : `JO Successfully ${jo}ed`,
      });
    } catch (error) {
      console.error("Error log", error);
      Notification.error({
        title: "ERROR",
        message: "Something went wrong: failed to update JO",
      });
    }
  };

  const forJobSection = () => {
    return (
      <Paper radius="md">
        <Text size={"lg"}>Job Offer Confirmation</Text>

        <br />

        <Modal
          opened={isConfirming}
          onClose={onCancel}
          centered
          size={700}
          title={"Confirmation"}
        >
          <Stack>
            <Text>
              {jo == "accept"
                ? "Are you sure you want to accept this JO?"
                : jo == "reject"
                  ? "Are you sure you want to reject this JO?"
                  : "Are you sure you want to cancel this JO?"}
            </Text>

            {(jo === "reject" || jo === "cancel") && (
              <TextArea
                label="Reason"
                placeholder={`Please enter the reason for ${jo === "reject" ? "rejecting" : "canceling"
                  } this JO`}
                value={joReason}
                onChange={(e) => setJoReason(e.currentTarget.value)}
                minRows={3}
                required
              />
            )}

            <Group position="right">
              <Button
                disabled={
                  (jo === "reject" || jo === "cancel") && joReason.trim() === ""
                }
                onClick={() => {
                  joHandler();
                  onCancel();
                }}
              >
                Yes
              </Button>
              <Button customType="danger" onClick={onCancel}>
                Cancel
              </Button>
            </Group>
          </Stack>
        </Modal>

        <Group direction="row" justify="center" grow align="top">
          <Group position="left">
            <Button
              disabled={props.candidate?.status != HR.Status.FOR_JO}
              onClick={() => {
                onOpen();
                setJO("accept");
              }}
            >
              Accepted
            </Button>
            <Button
              disabled={props.candidate?.status != HR.Status.FOR_JO}
              customType="danger"
              onClick={() => {
                onOpen();
                setJO("reject");
              }}
            >
              Rejected
            </Button>
            <Button
              customType="orange"
              onClick={() => {
                onOpen();
                setJO("cancel");
              }}
            >
              Cancel
            </Button>
          </Group>
        </Group>
      </Paper>
    );
  };

  return (
    <>
      {props.candidate?.status === HR.Status.FINAL_INTERVIEW ? (
        finalInterviewSection()
      ) : (
        <Stack>
          <Text size="xl" fw="bold">
            Application Details
          </Text>

          <Group direction="row" justify="center" grow align="top">
            {props.candidate?.status == HR.Status.INITIAL_INTERVIEW ||
              props.candidate?.status == HR.Status.PASSED_SCREENING
              ? passedInterviewSection()
              : props.candidate?.status == HR.Status.PASSED_INTERVIEW
                ? finalInterviewSection()
                : undefined}

            {props.candidate?.status == HR.Status.FOR_JO ||
              props.candidate?.status == HR.Status.CANCELLED ||
              props.candidate?.status == HR.Status.FAILED_SCREENING ||
              props.candidate?.status == HR.Status.COMPLETED ? (
              props.candidate?.status == HR.Status.COMPLETED ||
                props.candidate?.status == HR.Status.FOR_JO ? (
                forJobSection()
              ) : undefined
            ) : props.candidate?.status !== HR.Status.PASSED_SCREENING ? (
              <Paper radius="md">
                <Text>
                  {props.candidate?.status == HR.Status.INITIAL_INTERVIEW
                    ? "Passed Initial Interview?"
                    : "Endorse the Applicant"}
                </Text>

                <br />

                <Group grow align="top">
                  <Stack>
                    <Group>
                      <Text>
                        {props.candidate?.status == HR.Status.INITIAL_INTERVIEW
                          ? "Passed Candidate?"
                          : "Proceed to Endorsement?"}
                      </Text>
                    </Group>

                    <RadioGroup
                      data={[
                        { label: "Yes", value: "true" },
                        { label: "No", value: "false" },
                      ]}
                      defaultValue={
                        passed !== null ? String(passed) : undefined
                      }
                      orientation="horizontal"
                      onChange={handleChange}
                    />

                    {props.candidate?.status == HR.Status.PASSED_INTERVIEW &&
                      passed ? (
                      <Stack>
                        <Text>Manager Email(s):</Text>
                        <Group align="flex-end">
                          <Input
                            style={{ flex: 1 }}
                            label="Manager Email"
                            value={managerEmail}
                            onChange={(e) =>
                              setManagerEmail(e.currentTarget.value)
                            }
                            placeholder="Input manager email address"
                          />

                          <Button
                            radius="md"
                            onClick={() => {
                              if (!managerEmail) return;
                              if (!managerEmailList.includes(managerEmail)) {
                                setManagerEmailList([
                                  ...managerEmailList,
                                  managerEmail,
                                ]);
                              }
                              setManagerEmail("");
                            }}
                          >
                            Add
                          </Button>
                        </Group>

                        {managerEmailList.map((email, idx) => (
                          <Group key={idx} position="apart">
                            <Text>{email}</Text>
                            <Button
                              size="xs"
                              customType="danger"
                              radius="sm"
                              onClick={() =>
                                setManagerEmailList(
                                  managerEmailList.filter((e) => e !== email),
                                )
                              }
                            >
                              Remove
                            </Button>
                          </Group>
                        ))}

                        <Button
                          radius="md"
                          disabled={managerEmailList.length === 0}
                          onClick={endoreseToManager}
                        >
                          Endorse to manager
                        </Button>
                      </Stack>
                    ) : passed ? (
                      <Group position="left">
                        <Button
                          disabled={
                            props.candidate?.status !=
                            HR.Status.INITIAL_INTERVIEW || isProcessing
                          }
                          loading={isProcessing}
                          radius="md"
                          onClick={handlePassedCandidate}
                        >
                          Save
                        </Button>
                      </Group>
                    ) : null}
                  </Stack>

                  {!passed ? (
                    <Stack>
                      <TextArea
                        minRows={5}
                        label="Reason"
                        placeholder="Write your notes/comments here"
                        value={passedInterviewRemarkText}
                        onChange={(e) =>
                          setPassedInterviewRemarkText(e.currentTarget.value)
                        }
                      />

                      <Group position="right">
                        <Button
                          radius="md"
                          onClick={() => handleSaveRemark(HR.Status.CANCELLED)}
                        >
                          Save
                        </Button>
                      </Group>
                    </Stack>
                  ) : null}
                </Group>
              </Paper>
            ) : null}
          </Group>
        </Stack>
      )}
    </>
  );
};