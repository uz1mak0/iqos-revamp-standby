export type ApplicationStatus = {
  id: string;
  color: string;
  title: string;
};

export const ApplicantsPositions = [
  "SALES_EXPERT",
  "FOM",
  "STORE_MANAGER",

];

export const ApplicationStatus: ApplicationStatus[] = [
  {
    id: "PASSED_SCREENING",
    color: "#ffe76e",
    title: "Passed Screening",
  },
  {
    id: "FAILED_SCREENING",
    color: "#ff4d4d",
    title: "Failed Screening",
  },
  {
    id: "INITIAL_INTERVIEW",
    color: "#9775fa",
    title: "Initial Interview",
  },
  {
    id: "PASSED_INTERVIEW",
    color: "#ffec99",
    title: "Passed Interview",
  },
  {
    id: "FINAL_INTERVIEW",
    color: "#fab005",
    title: "Final Interview",
  },
  {
    id: "FOR_JO",
    color: "#fd9710",
    title: "For JO",
  },
  {
    id: "CANCELLED",
    color: "#e73f3c",
    title: "Cancelled",
  },
  {
    id: "COMPLETED",
    color: "#61b765",
    title: "Completed",
  },
];
