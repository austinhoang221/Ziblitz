import React, { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { DashBoardService } from "../../../../../../../../services/dashboardService";
import { checkResponseStatus } from "../../../../../../../helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";
import dayjs from "dayjs";
import { Tooltip } from "antd";

export default function Calendar() {
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [events, setEvents] = useState<any[]>([
    {
      title: "event1",
      start: "2023-01-01",
    },
    {
      title: "event2",
      start: "2023-12-05",
      end: "2023-12-07",
    },
  ]);
  useEffect(() => {
    if (project?.id) {
      fetchData();
    }
  }, [project?.id]);

  const fetchData = useCallback(async () => {
    const payload = {
      userId: userId,
      startDate: dayjs("2022-01-01").toISOString(),
      endDate: dayjs(Date.now()).toISOString(),
      type: "all",
    };
    await DashBoardService.getIssueChart(project?.id!, payload).then((res) => {
      if (checkResponseStatus(res)) {
        const data = res?.data;
        setEvents(
          data!.map((item) => {
            return {
              title: item.name,
              start: item.creationTime
                ? dayjs(item.creationTime).format("YYYY-MM-DD")
                : null,
              end: item.completeDate
                ? dayjs(item.completeDate).format("YYYY-MM-DD")
                : null,
              description: item.name,
            };
          })
        );
      }
    });
  }, [project?.id]);

  const onRenderTooltip = (info: any) => {
    return (
      <Tooltip title={info.event.extendedProps.description}>
        <span>{info.event.extendedProps.description}</span>
      </Tooltip>
    );
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      loading={fetchData}
      eventDidMount={onRenderTooltip}
      events={events}
      contentHeight={500}
    />
  );
}
