import { CandidateDetails } from "../TalentsManagementDetails/CandidateDetails";
import { useState, useEffect } from "react";

import {
  Button,
  Group,
  Input,
  Modal,
  Paper,
  Stack,
  Text,
  TextArea,
  RadioGroup,
  LoadingOverlay,
} from "../../../Elements";

import { useRouter } from "next/router";
import { useMutation, useLazyQuery } from "@apollo/client";

import {
  getTalentDetailsForManagerPage,
  updateTalentDetailsForManager,
  sendEmail,
  verifyOtp,
  regenerateOtp,
} from "../../../../GraphQL/HRSchema";

import Notification from "../../../Elements/Notification/Notification";
import dayjs from "dayjs";
import { HR } from "../../../../GraphQL";

export const TalentManagerAccess = () => {
  const router = useRouter();
  const [passed, setPassed] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const [passedInterviewRemarkText, setPassedInterviewRemarkText] =
    useState("");

  const [failedInterviewRemarkText, setFailedInterviewRemarkText] =
    useState("");

  const [verifyOtpMutation, { loading: verifying }] = useMutation(verifyOtp, {
    context: { clientName: "managerAccess" },
  });

  const [regenerateOtpMutation, { loading: regenerating }] = useMutation(
    regenerateOtp,
    {
      context: { clientName: "managerAccess" },
    },
  );

  const [updateTalent, { loading: loadingRequest }] = useMutation(
    updateTalentDetailsForManager,
    { context: { clientName: "managerAccess" } },
  );

  const [sendEmailToManager] = useMutation(sendEmail, {
    context: { clientName: "managerAccess" },
  });

  const [getTalentDetails, { loading, data }] = useLazyQuery(
    getTalentDetailsForManagerPage,
    {
      context: { clientName: "managerAccess" },
    },
  );

  useEffect(() => {
    if (!data?.talent) return;

    const finalInterviewRemark = data.talent?.remarks?.find(
      (r: any) => r?.interview_stage === HR.Status.FINAL_INTERVIEW,
    );

    const cancelInterviewRemark = data.talent?.remarks?.find(
      (r: any) => r?.interview_stage === HR.Status.CANCELLED,
    );

    setPassedInterviewRemarkText(finalInterviewRemark?.remark ?? "");
    setFailedInterviewRemarkText(cancelInterviewRemark?.remark ?? "");
  }, [data]);

  const handleVerifyOtp = async () => {
    const transactionID = router.query.transactionID as string;
    if (!transactionID) {
      Notification.error({
        title: "Missing ID",
        message: "Transaction ID not found in URL parameters.",
      });
      return;
    }

    if (!emailInput.trim() || !otpInput.trim()) {
      Notification.error({
        title: "Validation Error",
        message: "Please enter both your manager email and OTP code.",
      });
      return;
    }

    try {
      const { data: verifyData } = await verifyOtpMutation({
        variables: {
          id: transactionID,
          otp: otpInput.trim(),
          status: "FINAL_INTERVIEW",
        },
      });

      if (verifyData?.verifyOtp?.success) {
        const { data: talentResponse } = await getTalentDetails({
          variables: {
            id: transactionID,
          },
        });

        const rawManagerEmail = talentResponse?.talent?.manager_email || "";
        const allowedEmails = rawManagerEmail
          ? rawManagerEmail
            .split(",")
            .map((e: string) => e.trim().toLowerCase())
            .filter(Boolean)
          : [];

        if (
          allowedEmails.length === 0 ||
          !allowedEmails.includes(emailInput.trim().toLowerCase())
        ) {
          Notification.error({
            title: "Access Denied",
            message:
              "The entered email address is not authorized to review this applicant.",
          });
          return;
        }

        if (talentResponse?.talent?.otp?.otp_used) {
          Notification.error({
            title: "OTP Already Used",
            message:
              "This OTP / access link has already been used to review this applicant.",
          });
          return;
        }

        setIsVerified(true);
        setIsModalOpen(false);
        Notification.success({
          title: "Verified successfully",
          message: "Your credentials and OTP code have been verified.",
        });
      } else {
        Notification.error({
          title: "Invalid",
          message: verifyData?.verifyOtp?.message || "Invalid OTP code.",
        });
      }
    } catch (err) {
      console.error("VERIFICATION_CRITICAL_ERROR:", err);
      Notification.error({
        title: "Error",
        message: "OTP verification failed",
      });
    }
  };

  const handleRegenerateOtp = async () => {
    const transactionID = router.query.transactionID as string;
    if (!transactionID) return;

    if (!emailInput.trim()) {
      Notification.error({
        title: "Validation Error",
        message: "Please enter your manager email first so we can send the new OTP to you.",
      });
      return;
    }

    try {
      const { data: regenerateData } = await regenerateOtpMutation({
        variables: {
          id: transactionID,
          requestedBy: emailInput.trim(),
        },
      });

      if (regenerateData?.regenerateOtp?.success) {
        Notification.success({
          title: "OTP Re-generated",
          message: regenerateData.regenerateOtp.message,
        });

        setOtpInput("");
        setIsVerified(false);
        setIsModalOpen(true);
      } else {
        Notification.error({
          title: "OTP Generation Failed",
          message:
            regenerateData?.regenerateOtp?.message ||
            "The server could not regenerate your OTP.",
        });
      }
    } catch (error) {
      console.error("REGENERATE_OTP_CRITICAL_ERROR:", error);
      Notification.error({
        title: "OTP Error",
        message: "Failed to communicate with the server to regenerate OTP.",
      });
    }
  };

  const buildRemarksArray = (stageToUpdate: string, newRemark: string) => {
    const existingRemarks = data?.talent?.remarks ?? [];
    const hasStage = existingRemarks.some(
      (r: any) => r?.interview_stage === stageToUpdate,
    );

    if (hasStage) {
      return existingRemarks.map((r: HR.Maybe<HR.Remarks>) =>
        r?.interview_stage === stageToUpdate
          ? {
            interview_stage: stageToUpdate,
            remark: newRemark,
            remark_by: "Manager",
          }
          : {
            interview_stage: r?.interview_stage ?? "",
            remark: r?.remark ?? null,
            remark_by: r?.remark_by ?? null,
          },
      );
    } else {
      return [
        ...existingRemarks.map((r: any) => ({
          interview_stage: r?.interview_stage ?? "",
          remark: r?.remark ?? null,
          remark_by: r?.remark_by ?? null,
        })),
        {
          interview_stage: stageToUpdate,
          remark: newRemark,
          remark_by: "Manager",
        },
      ];
    }
  };

  const handlePassedCandidate = async () => {
    setIsSendingEmail(true);

    try {
      const updatedRemarks = buildRemarksArray(
        HR.Status.FINAL_INTERVIEW,
        passedInterviewRemarkText,
      );

      await updateTalent({
        variables: {
          input: {
            id: data?.talent?.id,
            status: HR.Status.FOR_JO,
            remarks: updatedRemarks,
            otp: {
              otp_code: data?.talent?.otp?.otp_code,
              otp_used: true,
            },
            interview_logs: [
              {
                interview_stage: HR.Status.FOR_JO,
                date_schedule: dayjs().unix(),
                log_status: HR.InterviewLogsStatus.SUCCESS,
                updated_by: "Manager",
              },
            ],
          },
        },
      });

      const applicantEmail =
        data?.talent?.details?.email ||
        data?.talent?.email ||
        data?.talent?.contact_details?.email;

      const candidateName = (
        data?.talent?.details?.name ||
        data?.talent?.name ||
        "Applicant"
      ).replaceAll("_", " ");

      const positionName = (data?.talent?.position || "Position").replaceAll(
        "_",
        " ",
      );

      const passedRecipients = Array.from(
        new Set(
          [
            applicantEmail,
            data?.talent?.manager_email,
            "rbu.hrnotifications@activasia.com",
          ].filter(Boolean) as string[],
        ),
      );

      if (!applicantEmail) {
        Notification.error({
          title: "Missing Email",
          message:
            "Candidate email not found on file. Notification email could not be delivered to the applicant.",
        });
      } else {
        try {
          const emailResponse = await sendEmailToManager({
            variables: {
              input: {
                recipients: passedRecipients,
                applicantEmail: applicantEmail,
                applicantName: candidateName,
                position: positionName,
                hrEmail: "rbu.hrnotifications@activasia.com",
                isInterview: false,
                subject: "Congratulations on Passing the Final Interview",
                body: `
                <p>Dear ${candidateName},</p>

                <p>Congratulations!</p>

                <p>We are pleased to inform you that you have successfully passed the final interview stage for the ${positionName} position at ActivAsia, Inc.<br/>
                Our team was impressed with your qualifications and potential contribution to the organization. You will be receiving your Job Offer and the next steps of the onboarding process through your registered email address shortly.</p>

                <p>Thank you for your patience and continued interest in becoming part of ActivAsia, Inc. We look forward to welcoming you to the team.</p>

                <br />
                <p>Sincerely,<br /><strong>ActivAsia Recruitment Team</strong></p>

                <hr />
                <p style="color: #666666; font-size: 12px;"><em>** This is an autogenerated email. Please do not reply. **</em></p>
              `,
              },
            },
          });

          const result = emailResponse?.data?.sendEmails;
          if (result && typeof result === "object" && result.success === false) {
            Notification.error({
              title: "Email Dispatch Error",
              message:
                result.message ||
                "Backend email provider failed to deliver message.",
            });
          }
        } catch (emailError) {
          console.error("PASS_EMAIL_SEND_ERROR:", emailError);
          Notification.error({
            title: "Email Not Sent",
            message:
              "The candidate's status was updated, but the notification email failed to send. Please notify them manually.",
          });
        }
      }

      Notification.success({
        title: "Movement Status",
        message: "Status successfully saved as PASSED",
      });
    } catch (error) {
      console.error("handlePassedCandidate Error:", error);
      Notification.error({
        title: "Movement Status",
        message: "Failed to save candidate status.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleFailedCandidate = async () => {
    setIsSendingEmail(true);

    try {
      const updatedRemarks = buildRemarksArray(
        HR.Status.CANCELLED,
        failedInterviewRemarkText,
      );

      await updateTalent({
        variables: {
          input: {
            id: data?.talent?.id,
            status: HR.Status.CANCELLED,
            otp: {
              otp_code: data?.talent?.otp?.otp_code,
              otp_used: true,
            },
            remarks: updatedRemarks,
            interview_logs: [
              {
                interview_stage: HR.Status.CANCELLED,
                date_schedule: dayjs().unix(),
                log_status: HR.InterviewLogsStatus.FAILED,
                updated_by: "Manager",
              },
            ],
          },
        },
      });

      const applicantEmail =
        data?.talent?.details?.email ||
        data?.talent?.email ||
        data?.talent?.contact_details?.email;

      const failedRecipients = Array.from(
        new Set(
          [
            applicantEmail,
            data?.talent?.manager_email,
            "rbu.hrnotifications@activasia.com",
          ].filter(Boolean) as string[],
        ),
      );

      const candidateName = (
        data?.talent?.details?.name ||
        data?.talent?.name ||
        "Applicant"
      ).replaceAll("_", " ");

      const positionName = (data?.talent?.position || "Position").replaceAll(
        "_",
        " ",
      );

      if (applicantEmail) {
        try {
          await sendEmailToManager({
            variables: {
              input: {
                recipients: failedRecipients,
                applicantEmail: applicantEmail,
                applicantName: candidateName,
                position: positionName,
                hrEmail: "rbu.hrnotifications@activasia.com",
                isInterview: false,
                subject: `Application Status: ${candidateName} - ${positionName}`,
                body: `
                <p>Hi ${candidateName},</p>
                <br/>

               <p>
               Thank you for taking the time to apply for the Retail Sales Expert position at ActivAsia Inc. and for showing your interest in joining our team.

After carefully reviewing your application as part of our initial screening process, we regret to inform you that we will not be moving forward with your application at this time.

We truly value the time and effort you spent applying with us. We encourage you to apply again should another opportunity arise that matches your qualifications and experience.

Thank you again for considering ActivAsia Inc. We wish you all the best in your career journey!

               </p>

                <br />
                <p>Thanks,<br /><strong>HR Team</strong></p>

                <hr />
                <p style="color: #666666; font-size: 12px;"><em>** This is an autogenerated email. Please do not reply. **</em></p>
              `,
              },
            },
          });
        } catch (emailError) {
          console.error("FAIL_EMAIL_SEND_ERROR:", emailError);
          Notification.error({
            title: "Email Not Sent",
            message:
              "The candidate's status was updated, but the notification email failed to send. Please notify them manually.",
          });
        }
      }

      Notification.success({
        title: "Movement Status",
        message: "Status successfully saved as FAILED",
      });
    } catch (error) {
      console.error("handleFailedCandidate Error:", error);
      Notification.error({
        title: "Error",
        message: "An unexpected error occurred while saving.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleChange = (value: string) => {
    setPassed(value === "true");
  };

  const handleGenerateMeetLink = async () => {
    const meetLink = data?.talent?.interviews?.find(
      (e: any) => e.stage === "FINAL_INTERVIEW",
    )?.google_meet_link;

    if (meetLink) {
      window.open(meetLink, "_blank", "noopener, noreferrer");
    } else {
      Notification.error({
        title: "Link not found",
        message:
          "The Google Meet link has not been generated yet. Please try re-saving.",
      });
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <LoadingOverlay
        visible={
          loading || verifying || loadingRequest || regenerating || isSendingEmail
        }
      />

      <Modal
        opened={isModalOpen}
        onClose={() => { }}
        title="Security Verification"
        removeCloseButton={true}
      >
        <Stack>
          <Text size="sm">
            Enter your manager email and the OTP sent to you to access this candidate.
          </Text>
          <Input
            placeholder="Enter Manager Email"
            value={emailInput}
            onChange={(e: any) => setEmailInput(e.currentTarget.value)}
          />
          <Input
            placeholder="Enter OTP"
            value={otpInput}
            onChange={(e: any) => setOtpInput(e.currentTarget.value)}
          />
          <Button
            fullWidth
            onClick={handleVerifyOtp}
            loading={verifying || loading}
            disabled={!emailInput.trim() || !otpInput.trim() || loading}
          >
            Verify
          </Button>
          <Button
            variant="filled"
            color="white"
            onClick={handleRegenerateOtp}
            loading={regenerating}
            disabled={!emailInput.trim()}
          >
            Re-Generate OTP
          </Button>
        </Stack>
      </Modal>

      {isVerified && (
        <Stack>
          <CandidateDetails candidate={data?.talent} />

          <Group direction="row" justify="center" grow align="top">
            <Paper radius="md" style={{ padding: 20 }}>
              <Text>Post Interview Assessment:</Text>

              <br />
              <Group>
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
              </Group>
              <br />

              <Stack>
                <Text>Candidate Passed:</Text>

                <RadioGroup
                  defaultValue={passed === null ? "" : String(passed)}
                  data={[
                    { label: "Yes", value: "true" },
                    { label: "No", value: "false" },
                  ]}
                  orientation="horizontal"
                  onChange={handleChange}
                />

                {passed === false ? (
                  <Stack>
                    <TextArea
                      minRows={5}
                      label="Reason"
                      placeholder="Write your notes/comments here"
                      value={failedInterviewRemarkText}
                      onChange={(e) =>
                        setFailedInterviewRemarkText(e.currentTarget.value)
                      }
                    />

                    <Group position="right">
                      <Button
                        radius="md"
                        loading={loadingRequest || isSendingEmail}
                        onClick={handleFailedCandidate}
                      >
                        Save
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  <Stack>
                    <Group position="left">
                      <Button
                        radius="md"
                        loading={loadingRequest || isSendingEmail}
                        disabled={passed === null}
                        onClick={handlePassedCandidate}
                      >
                        Save
                      </Button>
                    </Group>
                  </Stack>
                )}
              </Stack>
            </Paper>
          </Group>
        </Stack>
      )}
    </div>
  );
};