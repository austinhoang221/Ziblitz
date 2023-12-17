import { Divider, Select, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { setProjectDetail } from "../../../../../../../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../../../../../../../redux/store";
import { FilterService } from "../../../../../../../../../../services/filterService";
import { ProjectService } from "../../../../../../../../../../services/projectService";
import { useAppDispatch } from "../../../../../../../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../../../../../../../helpers";
import { IIssue } from "../../../../../../../../../models/IIssue";
import IssueDateSelect from "../../../../../../../../components/issue-date-select";
import IssueFilterSelect from "../../../../../../../../components/issue-filter-select";
import IssuePriority from "../../../../../../../../components/issue-priority";
import IssueStatusSelect from "../../../../../../../../components/issue-status-select";
import IssueType from "../../../../../../../../components/issue-type";
import UserAvatar from "../../../../../../../../components/user-avatar";
import HeaderProject from "../../../header";

export default function CustomFilterList() {
  const { project, isLoading: isLoadingProject } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const dispatch = useAppDispatch();
  const { projects } = useSelector((state: RootState) => state);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [listIssue, setListIssue] = useState<IIssue[]>([]);
  const [sprintOptions, setSprintOptions] = useState<any[]>([]);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [statusOptions, setstatusOptions] = useState<any[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<any[]>([]);
  const [priorityOptions, setPriorityOptions] = useState<any[]>([]);
  const [labelOptions, setLabelOptions] = useState<any[]>([]);
  const [typeValue, setTypeValue] = useState<any[]>([]);
  const [sprintValue, setSprintValue] = useState<any[]>([]);
  const [statusValue, setStatusValue] = useState<any[]>([]);
  const [assigneeValue, setAssigneeValue] = useState<any[]>([]);
  const [reporterValue, setReporterValue] = useState<any[]>([]);
  const [unassignedValue, setUnAssignedValue] = useState<boolean>(false);
  const [labelValue, setLabelValue] = useState<any[]>([]);
  const [priorityValue, setPriorityValue] = useState<any[]>([]);
  const [createdDateValue, setCreatedDateValue] = useState<any>();
  const [dueDateValue, setDueDateValue] = useState<any>();
  const [updatedDate, setUpdatedDate] = useState<any>();
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  const columns: ColumnsType<IIssue> = [
    {
      title: "",
      key: "type",
      width: "50px",
      align: "center",
      render: (issue: IIssue) => (
        <IssueType issueTypeKey={issue.issueType.icon}></IssueType>
      ),
    },
    {
      title: "Key",
      dataIndex: "code",
      key: "code",
      width: "8%",
      render: (text: string) => {
        return (
          <>
            <Link to={text}>{text}</Link>
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "auto",
      render: (text: string) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <Tooltip title={text}>
              <span>{text}</span>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: "Assignee",
      key: "assignee",
      width: "15%",
      render: (issue: IIssue) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <UserAvatar
              userIds={[issue?.issueDetail.assigneeId]}
              isMultiple={false}
              isShowName={true}
            ></UserAvatar>
          </>
        );
      },
    },
    {
      title: "Reporter",
      key: "reporter",
      width: "15%",
      render: (issue: IIssue) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <UserAvatar
              userIds={[issue?.issueDetail.reporterId]}
              isMultiple={false}
              isShowName={true}
            ></UserAvatar>
          </>
        );
      },
    },
    {
      title: "Priority",
      key: "priority",
      width: "8%",
      render: (issue: IIssue) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <IssuePriority priorityId={issue.priorityId ?? ""}></IssuePriority>
          </>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: "10%",
      render: (issue: IIssue) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <IssueStatusSelect
              type={
                issue?.backlogId
                  ? "backlog"
                  : issue?.sprintId
                  ? "sprint"
                  : "epic"
              }
              selectedId={issue?.statusId!}
              periodId={issue?.sprintId ?? issue?.backlogId!}
              issueId={issue?.id!}
              style={{ width: "120px", minWidth: "120px" }}
              onSaveIssue={() => {}}
            ></IssueStatusSelect>
          </>
        );
      },
    },
    {
      title: "Created",
      key: "created",
      width: "10%",
      render: (issue: IIssue) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            {issue?.creationTime
              ? dayjs(issue?.creationTime).format("MMM D, YYYY")
              : ""}
          </>
        );
      },
    },
    {
      title: "Due date",
      key: "dueDate",
      width: "10%",
      render: (issue: IIssue) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            {issue?.dueDate
              ? dayjs(issue?.creationTime).format("MMM D, YYYY")
              : ""}
          </>
        );
      },
    },
  ];

  const resetFilter = () => {
    setSprintValue([]);
    setStatusValue([]);
    setTypeValue([]);
    setAssigneeValue([]);
    setLabelValue([]);
  };

  useEffect(() => {
    if (!projectId && projects?.length > 0) {
      resetFilter();
      setProjectId(projects?.[0].id);
    }
  }, [projects]);

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchData = useCallback(() => {
    if (projectId) {
      fetchProjectData(projectId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const fetchProjectData = (id: string) => {
    const code = projects?.find((project) => project?.id === id)?.code;
    setIsLoading(true);

    ProjectService.getByCode(userId, code!).then((res) => {
      if (checkResponseStatus(res)) {
        setSprintOptions(res?.data.sprints!);
        setTypeOptions(res?.data.issueTypes!);
        setstatusOptions(res?.data.statuses!);
        setAssigneeOptions(res?.data.members!);
        setLabelOptions(res?.data.labels!);
        setPriorityOptions(res?.data.priorities!);
        dispatch(setProjectDetail(res?.data!));
      }
      setIsLoading(false);
    });
  };

  const fetchIssueData = useCallback(() => {
    if (projectId) {
      const payload = {
        name: searchValue,
        project: {
          projectIds: [projectId],
        },
        sprint: {
          sprintIds: sprintValue,
        },
        type: {
          issueTypeId: typeValue,
        },
        status: {
          statusId: statusValue,
        },
        assignee: {
          unassigned: unassignedValue,
          userIds: assigneeValue,
        },
        created: {
          ...createdDateValue,
        },
        dueDate: {
          ...dueDateValue,
        },
        updated: {
          ...updatedDate,
        },
        labels: {
          labelIds: labelValue,
        },
        priority: {
          priorityIds: priorityValue,
        },
        reporter: {
          unassigned: false,
          userIds: reporterValue,
        },
      };
      setIsLoading(true);
      FilterService.getAllIssue(payload).then((res) => {
        if (checkResponseStatus(res)) {
          setListIssue(res?.data!);
        }
        setIsLoading(false);
      });
    }
  }, [
    searchValue,
    projectId,
    sprintValue,
    typeValue,
    statusValue,
    unassignedValue,
    assigneeValue,
    createdDateValue,
    dueDateValue,
    updatedDate,
    labelValue,
    priorityValue,
    reporterValue,
  ]);

  useEffect(() => {
    fetchIssueData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchValue,
    projectId,
    sprintValue,
    typeValue,
    statusValue,
    unassignedValue,
    assigneeValue,
    createdDateValue,
    dueDateValue,
    updatedDate,
    labelValue,
    priorityValue,
    reporterValue,
  ]);

  const onChangeProject = (id: string) => {
    setProjectId(id);
  };

  const onChangeCreatedDate = (value: any) => {
    setCreatedDateValue(value);
  };

  const onChangeDueDate = (value: any) => {
    setDueDateValue(value);
  };

  const onChangeUpdatedDate = (value: any) => {
    setUpdatedDate(value);
  };

  const onRenderAction: React.ReactNode = (
    <>
      <Select
        value={projectId}
        style={{ width: "150px" }}
        className="mr-1"
        onChange={(e) => onChangeProject(e)}
        options={
          projects.map((project) => {
            return {
              label: project.name,
              value: project.id,
            };
          }) ?? []
        }
      ></Select>
      {projectId && (
        <>
          <IssueFilterSelect
            initialOption={
              sprintOptions?.map((sprint) => {
                return { label: sprint.name, value: sprint.id };
              }) ?? []
            }
            label="Sprint"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setSprintValue}
          />
          <IssueFilterSelect
            initialOption={
              typeOptions?.map((type) => {
                return { label: type.name, value: type.id };
              }) ?? []
            }
            label="Type"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setTypeValue}
          />
          <IssueFilterSelect
            initialOption={
              statusOptions?.map((status) => {
                return { label: status.name, value: status.id };
              }) ?? []
            }
            label="Status"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setStatusValue}
          />
          <IssueFilterSelect
            initialOption={
              priorityOptions.map((priority) => {
                return { label: priority.name, value: priority.id };
              }) ?? []
            }
            label="Priority"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setPriorityValue}
          />
          <IssueFilterSelect
            isHaveOtherOption={true}
            otherOptionLabel="Unassigned"
            otherOptionValue={unassignedValue}
            onCheckOtherOptionChange={setUnAssignedValue}
            initialOption={
              assigneeOptions.map((member) => {
                return { label: member.name, value: member.id };
              }) ?? []
            }
            label="Assignee"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setAssigneeValue}
          />
          <IssueFilterSelect
            initialOption={
              assigneeOptions.map((member) => {
                return { label: member.name, value: member.id };
              }) ?? []
            }
            label="Reporter"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setReporterValue}
          />

          <IssueFilterSelect
            initialOption={
              labelOptions.map((label) => {
                return {
                  label: label.name,
                  value: label.id,
                };
              }) ?? []
            }
            label="Label"
            isLoading={isLoadingProject || isLoading}
            onChangeOption={setLabelOptions}
          />
        </>
      )}
      <IssueDateSelect
        label="Created date"
        onSaveOption={(value: any) => {
          onChangeCreatedDate(value);
        }}
      />
      <IssueDateSelect
        label="Updated date"
        onSaveOption={(value: any) => {
          onChangeUpdatedDate(value);
        }}
      />
      <IssueDateSelect
        label="Due date"
        onSaveOption={(value: any) => {
          onChangeDueDate(value);
        }}
      />
      <Divider type="vertical" />

      <a>Save filter</a>
    </>
  );

  return (
    <>
      <HeaderProject
        title="Issues"
        isFixedHeader={false}
        onSearch={onSearch}
        actionContent={onRenderAction}
      ></HeaderProject>

      <Table
        className="mt-3"
        columns={columns}
        dataSource={listIssue}
        rowKey={(record) => record.id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: 1500, y: 400 }}
      />
    </>
  );
}
