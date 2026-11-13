import { useState, useEffect } from "react";
import { HR } from "../../../../GraphQL";
import {
  Group,
  Paper,
  Stack,
  Text,
  ActionIcon,
  Button,
  Modal,
  Input,
  Select,
  Divider,
} from "../../../Elements";
import { Download, Eye } from "tabler-icons-react"; // 1. Imported both Eye and Download icons
import { updateTalentDetails } from "../../../../GraphQL/HRSchema";
import { useMutation } from "@apollo/client";
import Notification from "../../../Elements/Notification/Notification";
import { NoteModal } from "./TalentDetailsComponets/NoteModal";
import { userAtom } from "../../../../Store/StoreAtom";
import { useAtom } from "jotai";


type Props = {
  candidate?: HR.Maybe<HR.Talent>;
  isVertical?: boolean;
};

export const CandidateDetails = (props: Props) => {


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Source Details
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);

  const [user] = useAtom(userAtom);

  const [assignedTo, setAssignedTo] = useState("");

  const [updateTalent, { loading: loadingRequest }] = useMutation(
    updateTalentDetails,
    { context: { clientName: "warehouse" } },
  );

  const [sourceForm, setSourceForm] = useState({
    source: props.candidate?.source?.source || "",
    channel: props.candidate?.source?.channel || "",
    area: props.candidate?.source?.area || "",
    job_post: props.candidate?.source?.job_post || "",
    position: props.candidate?.source?.position || "",
    status: props.candidate?.status || "",
  });

  useEffect(() => {
    if (!props.candidate) return;

    setSourceForm({
      source: props.candidate.source?.source || "",
      channel: props.candidate.source?.channel || "",
      area: props.candidate.source?.area || "",
      job_post: props.candidate.source?.job_post || "",
      position: props.candidate?.source?.position || "",
      status: props.candidate.status || "",
    });

    setAssignedTo(props.candidate?.assigned_to || "Unassigned");
  }, [props.candidate]);


  const handleChange = (field: string, value: string) => {
    setSourceForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const downloadCV = async () => {
    if (!props.candidate?.cv_link) return;

    try {
      const response = await fetch(`${props.candidate?.cv_link}`);

      if (!response.ok) {
        Notification.error({
          title: "Download Error",
          message: "Access Denied: The CV link has expired or permissions are restricted.",
        });
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      const fileName = `${props.candidate?.details?.name?.replace(/\s+/g, "_")}_CV.pdf`;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Notification.error({
        title: "Download Error",
        message: "Network error occurred while trying to download the CV.",
      });
    }
  };

  const viewCV = async () => {
    if (!props.candidate?.cv_link) return;

    const cvUrl = props.candidate.cv_link;
    const isDocx = cvUrl.toLowerCase().includes(".docx") || cvUrl.toLowerCase().includes(".doc");

    try {
      if (isDocx) {
        const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(cvUrl)}`;
        window.open(officeViewerUrl, "_blank");
        return;
      }

      const response = await fetch(cvUrl);

      if (!response.ok) {
        Notification.error({
          title: "Access Error",
          message: "Access Denied: The CV link has expired or permissions are restricted.",
        });
        return;
      }

      const blobData = await response.blob();
      const pdfBlob = new Blob([blobData], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);

      window.open(url, "_blank");
    } catch (error) {
      Notification.error({
        title: "View Error",
        message: "Failed to open CV. Please try again.",
      });
    }
  };

  const editSourceModal = () => {
    return (
      <Modal
        opened={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        title="Edit Source Details"
        centered
      >
        <Stack spacing="sm">
          <Select
            label="Channel"
            clearable
            value={sourceForm.channel}
            onChange={(value) => handleChange("channel", value || "")}
            data={[
              { label: "DIRECT RETAIL", value: "DIRECT_RETAIL" },
              { label: "INDIRECT CHANNEL", value: "INDIRECT_CHANNEL" },
            ]}
            placeholder="Channel"
          />
          <Select
            label="Position"
            clearable
            value={sourceForm.position}
            onChange={(value) => handleChange("position", value || "")}
            data={[
              { label: "Sales Expert", value: "SALES_EXPERT" },
              { label: "Store Manager", value: "STORE_MANAGER" },
            ]}
            placeholder="Position"
          />

          <Input
            label="Source"
            value={sourceForm.source}
            onChange={(e) => handleChange("source", e.target.value)}
            placeholder="Source"
          />

          <Input
            label="Area"
            value={sourceForm.area}
            onChange={(e) => handleChange("area", e.target.value)}
            placeholder="Area"
          />

          <Input
            label="Job Post"
            value={sourceForm.job_post}
            onChange={(e) => handleChange("job_post", e.target.value)}
            placeholder="Job Post"
          />

          <Divider color="#E2E8F0" my="md" />
          <Select
            label="Status"
            clearable
            value={sourceForm.status}
            onChange={(value) => handleChange("status", value || "")}
            data={[
              { label: "Failed Screening", value: "FAILED_SCREENING" },
              { label: "Passed Screening", value: "PASSED_SCREENING" },
              { label: "Cancelled", value: "CANCELLED" }
            ]}
            placeholder="Select Status"
          />

          <Group spacing={12} my="md">
            <Button
              customType="custom"
              disabled={isLoading}
              onClick={UpdateTalentDetailsHandler}
              styles={{
                backgroundColor: "#00BCD4",
                color: "#FFFFFF",
              }}
              radius={24}
              size="md"
            >
              Save
            </Button>

            <Button customType="danger" onClick={() => setIsSourceModalOpen(false)}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  };

  const workExpModal = () => {
    return (
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Experience Details"
        size="lg"
        centered
      >
        <Stack spacing="sm">
          <Text>
            Recent Position:{" "}
            {props.candidate?.work_experience?.recent_position || "N/A"}
          </Text>
          <Text>
            Total Years of Experience:{" "}
            {props.candidate?.work_experience?.yrs_of_exp || "N/A"}
          </Text>
          <Text>
            Sales Experience:{" "}
            {props.candidate?.work_experience?.sales_exp || "N/A"}
          </Text>
          <Text>
            Description:{" "}
            {props.candidate?.work_experience?.description || "N/A"}
          </Text>
        </Stack>
      </Modal>
    );
  };

  const UpdateTalentDetailsHandler = async () => {
    try {
      setIsLoading(true);

      await updateTalent({
        variables: {
          input: {
            id: props.candidate?.id,
            status: sourceForm.status,
            source: {
              source: sourceForm.source,
              channel: sourceForm.channel,
              job_post: sourceForm.job_post,
              area: sourceForm.area,
              position: sourceForm.position,
            },
          },
        },
      });

      Notification.success({
        title: "Source Details",
        message: "Update Success: Updated the source details successfully",
      });
      setIsSourceModalOpen(false);
    } catch (error) {
      Notification.error({
        title: "ERROR",
        message: "Something went wrong: failed to update source details",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignToMe = async () => {
    const currentUsername = user?.username || "You";
    try {
      setIsLoading(true);
      await updateTalent({
        variables: {
          input: {
            id: props.candidate?.id,
            assigned_to: currentUsername,
          },
        },
      });

      setAssignedTo(currentUsername);
      Notification.success({
        title: "Assignment Updated",
        message: `Successfully assigned this candidate to you.`,
      });
    } catch (error) {
      Notification.error({
        title: "Assignment Failed",
        message: "Could not assign candidate to your account.",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Stack>
      <Text size="xl" fw="bold">
        Candidate Details
      </Text>

      {workExpModal()}
      {editSourceModal()}

      <Group
        direction="row"
        justify="center"
        grow={props.isVertical ? true : false}
        align="top"
      >
        <Paper radius="md" width={"100%"}>
          <Stack>
            <Text size={"xl"}>
              <b>Basic Details</b>
            </Text>
            <Text>
              <b>Name:</b> {props.candidate?.details?.name}
            </Text>
            <Text>
              <b>Email:</b> {props.candidate?.details?.email}
            </Text>
            <Text>
              <b>Mobile:</b> {props.candidate?.details?.mobile}
            </Text>
            <Text>
              <b>Age: </b> {props.candidate?.details?.age}
            </Text>
            <br />
            <Group>
              <Text fw="bold">CV Actions:</Text>
              {!props.candidate?.cv_link ? (
                <Button disabled={true}>CV not found</Button>
              ) : (
                <Group spacing="xs">
                  <span title="View CV">
                    <ActionIcon variant="filled" onClick={viewCV}>
                      <Eye />
                    </ActionIcon>
                  </span>

                  <span title="Download CV">
                    <ActionIcon variant="filled" onClick={downloadCV}>
                      <Download />
                    </ActionIcon>
                  </span>
                </Group>
              )}
            </Group>
            <Group>
              <Button
                radius="md"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                Work Experience
              </Button>
            </Group>
          </Stack>
        </Paper>
        <Paper radius="md" width={"100%"}>
          <Stack>
            <Group>
              <Text size={"xl"}>
                <b>Source Details</b>
              </Text>
              {props.candidate?.status === "FINAL_INTERVIEW" ? (
                ""
              ) : (
                <Button radius="md" onClick={() => setIsSourceModalOpen(true)}>
                  Edit
                </Button>
              )}
              <Button radius="md" onClick={handleAssignToMe}>
                Assign To Me
              </Button>
            </Group>
            <Text>
              <b>Source:</b> {props.candidate?.source?.source}
            </Text>
            <Text>
              <b>Channel:</b>{" "}
              {props.candidate?.source?.channel?.replace("_", " ")}
            </Text>
            <Text>
              <b>Area:</b> {props.candidate?.source?.area}
            </Text>
            <Text>
              <b>Job post: </b>{" "}
              {props.candidate?.source?.job_post?.replace("_", " ")}
            </Text>
            <Text>
              <b>Job/Role: </b> {props.candidate?.position?.replace("_", " ")}
            </Text>
            <Text>
              <b>Assigned to: </b> {assignedTo || "-"}
            </Text>
            <Group>
              <NoteModal candidate={props.candidate} />
            </Group>
          </Stack>
        </Paper>
      </Group>
    </Stack>
  );
};