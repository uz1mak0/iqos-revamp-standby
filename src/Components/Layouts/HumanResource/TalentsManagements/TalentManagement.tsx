/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Search } from "tabler-icons-react";
import dayjs from "dayjs";
import {
  Card,
  Group,
  Input,
  Table,
  LoadingOverlay,
  ScrollArea,
  Select,
  Button,
} from "../../../Elements";

import { Pagination } from "@mantine/core";

import { Applicantilter } from "./ApplicantFilter";
import { HR } from "../../../../GraphQL";
import { useStyles } from "../../OrderManagement/OrderManagement.styles";

import {
  ApplicationStatus,
  ApplicantsPositions,
} from "./TalentsManagementConfig";

import { getTalents } from "../../../../GraphQL/HRSchema";
import { useQuery } from "@apollo/client";

export const TalentsManagement = () => {
  const { classes } = useStyles();

  //data query per month
  const [activeMonth, setActiveMonth] = useState(dayjs());
  const monthRange = {
    from: activeMonth.startOf("month").unix().toString(),
    to: activeMonth.endOf("month").unix().toString(),
  };
  const { loading, data, refetch } = useQuery(getTalents, {
    context: { clientName: "warehouse" },
    variables: { date_filter: monthRange },
  });

  //filtering and rendering
  const Backlogs: HR.Maybe<HR.Talent>[] = data?.talents?.items || [];
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);


  const dateToday = {
    from: dayjs().format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  };
  const [filters, setFilters] = useState({ date: dateToday });
  const [selectedStatus, setSelectedStatus] =
    useState<string | null>("PASSED_SCREENING");

  const uniqueRegions = Array.from(
    new Set(
      Backlogs
        .filter((talent) => talent?.source?.area)
        .map((talent) => talent?.source?.area as string)
    )
  ).sort();


  const filteredBacklogs = Backlogs.filter((talent) => {
    if (!talent?.date_updated && !talent?.date_created) return false;

    const statusMatch = selectedStatus
      ? talent.status === selectedStatus
      : talent.status !== "COMPLETED";

    const dateMatch = selectedStatus
      ? dayjs(Number(talent.date_updated ?? talent.date_created)).format(
          "YYYY-MM-DD",
        ) === filters.date.from
      : true;

    const roleMatch = selectedRole ? talent.position === selectedRole : true;

    const regionMatch = selectedRegion
      ? talent.source?.area === selectedRegion
      : true;

    const searchMatch = searchText
      ? [
          talent.details?.name,
          talent.details?.email,
          talent.details?.mobile,
          talent.position,
        ].some((field) =>
          field?.toLowerCase().includes(searchText.toLowerCase()),
        )
      : true;

    return statusMatch && dateMatch && roleMatch && regionMatch && searchMatch;
  });

  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchText, selectedRole, selectedRegion, selectedStatus, filters]);

  const totalPages = Math.ceil(filteredBacklogs.length / ITEMS_PER_PAGE);

  const paginatedBacklogs = filteredBacklogs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const rows = (list: HR.Maybe<HR.Talent>[]) => {
    if (!list.length) {
      return (
        <tr>
          <td colSpan={12} style={{ textAlign: "center", padding: 16 }}>
            No matching records found
          </td>
        </tr>
      );
    }

    return list.map((element, index) => (
      <tr key={`list-${index}`}>
        <td />
        <td>
          <Button
            disabled={!element?.id}
            onClick={() =>
              window.open(
                `/human-resource/talents-details/?transactionID=${element?.id}`,
                "_blank",
              )
            }
          >
            {element?.id || "ID not found"}
          </Button>
        </td>
        <td>{element?.position?.replace("_", " ")}</td>
        <td>{element?.source?.area}</td>
        <td>{element?.work_experience?.sales_exp?.replace("years", "Y") || "-"}</td>
        <td>{element?.source?.channel}</td>
        <td>{element?.details?.name}</td>
        <td>{element?.details?.email}</td>
        <td>{element?.details?.mobile}</td>
        <td>
          {element?.date_created
            ? new Date(element.date_created).toLocaleDateString("en-US")
            : "-"}
        </td>
        <td>
          {element?.date_updated
            ? new Date(element.date_updated).toLocaleDateString("en-US")
            : "-"}
        </td>

        <td>{element?.status?.replace("_", " ")}</td>
      </tr>
    ));
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />

      <div className={classes.statusContainer}>
        <Card
          bold={true}
          key={"RECEIVED"}
          background={"gray"}
          title={"RECEIVED"}
          number={
            Backlogs.filter((item) => item?.status !== "COMPLETED").length
          }
          removeSelect={false}
          isSelected={selectedStatus === null}
          onClick={() => setSelectedStatus(null)}
        />

        {ApplicationStatus.map((status) => {
          if (status.id === "RECEIVED") return null;

          const count = Backlogs.filter((e) => {
            const talentDate = dayjs(
              Number(e?.date_updated || e?.date_created),
            ).format("YYYY-MM-DD");

            const dateMatch = talentDate === filters.date.from;
            const statusMatch = e?.status === status.id;
            console.log(talentDate);
            return dateMatch && statusMatch;
          }).length;

          return (
            <Card
              color={
                [
                  "PASSED_SCREENING",
                  "PASSED_INTERVIEW",
                  "FINAL_INTERVIEW",
                ].includes(status.id)
                  ? "black"
                  : "white"
              }
              bold={true}
              key={status.id}
              background={status.color}
              title={status.title.toUpperCase()}
              number={count}
              removeSelect={false}
              isSelected={selectedStatus === status.id}
              onClick={() =>
                setSelectedStatus(
                  selectedStatus === status.id ? null : status.id,
                )
              }
            />
          );
        })}
      </div>

      <br />

      <Group>
        <Input
          icon={<Search />}
          type="search"
          placeholder="Search Applicant"
          value={searchText}
          onChange={(e) => setSearchText(e.currentTarget.value)}
        />

        <Select
          clearable
          placeholder="Filter by Job/Role"
          value={selectedRole || undefined}
          onChange={(val) => setSelectedRole(val || null)}
          data={ApplicantsPositions.map((e: string) => ({
            label: e.replace("_", " "),
            value: e,
          }))}
        />

        <Select
          clearable
          placeholder="Filter by Region/Area"
          value={selectedRegion || undefined}
          onChange={(val) => setSelectedRegion(val || null)}
          data={uniqueRegions.map((region: string) => ({
            label: region,
            value: region,
          }))}
        />

      <div style={{ width: 700 }}> 
        <Applicantilter
          isLoading={loading}
          defaultValues={{ date: filters.date }}
          onFilter={({ date, monthChanged }) => {
            setFilters({ date });

            if (monthChanged) {
              const newMonth = dayjs(date.from);
              setActiveMonth(newMonth);

              refetch({
                date_filter: {
                  from: newMonth.startOf("month").unix().toString(),
                  to: newMonth.endOf("month").unix().toString(),
                },
              });
            }
          }}
        />
      </div>
       
      </Group>

      <h2>List of Applicant Transactions</h2>

      <ScrollArea scrollbarSize={20} style={{ height: 700 }}>
        <div className={classes.tableContainer}>
          <Table>
            <thead>
              <tr>
                <th />
                <th>Transaction ID</th>
                <th>Job/Role</th>
                <th>Region/Area</th>
                <th>Sales Exp</th>
                <th>Channel</th>
                <th>Candidate Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Date Created</th>
                <th>Date Updated</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>{rows(paginatedBacklogs)}</tbody>
          </Table>
        </div>
        <br />
        <Group position="center">
          <Pagination page={page} onChange={setPage} total={totalPages} />
        </Group>
      </ScrollArea>
    </div>
  );
};