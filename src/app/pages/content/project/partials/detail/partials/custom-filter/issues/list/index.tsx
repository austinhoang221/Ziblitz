import { Divider, Dropdown, Menu, Select, Table, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../../../../../../../../redux/store";
import { FilterService } from "../../../../../../../../../../services/filterService";
import { ProjectService } from "../../../../../../../../../../services/projectService";
import { checkResponseStatus } from "../../../../../../../../../helpers";
import { IFilter } from "../../../../../../../../../models/IFilter";
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
  const { projects } = useSelector((state: RootState) => state);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [listIssue, setListIssue] = useState<IIssue[]>([]);
  const [requestPayload, setRequestPayload] = useState<IFilter>();
  const [projectOptions, setProjectOption] = useState<any[]>([]);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [statusOptions, setstatusOptions] = useState<any[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<any[]>([]);
  const [labelOptions, setLabelOptions] = useState<any[]>([]);
  const [typeValue, setTypeValue] = useState<any[]>([]);
  const [statusValue, setStatusValue] = useState<any[]>([]);
  const [assigneeValue, setAssigneeValue] = useState<any[]>([]);
  const [labelValue, setLabelValue] = useState<any[]>([]);
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  const columns: ColumnsType<IIssue> = [
    {
      key: "type",
      width: "40px",
      align: "center",
      render: (issue: IIssue) => (
        <IssueType issueTypeKey={issue.issueType.icon}></IssueType>
      ),
    },
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      width: "10%",
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
      width: "30%",
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
      width: "30%",
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
      width: "50px",
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
      width: "30%",
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
      width: "20%",
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
      title: "Duedate",
      key: "dueDate",
      width: "20%",
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
    setStatusValue([]);
    setTypeValue([]);
  };

  useEffect(() => {
    if (projectId) {
      resetFilter();
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    FilterService.getAllIssue(requestPayload!).then((res) => {
      if (checkResponseStatus(res)) {
        setListIssue(res?.data!);
        setIsLoading(false);
      }
    });
  }, [projectId]);

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const onChangeProject = (id: string) => {
    setProjectId(id);
    const code = projects?.find((project) => project?.id === id)?.code;
    ProjectService.getByCode(userId, code!).then((res) => {
      if (checkResponseStatus(res)) {
        setTypeOptions(res?.data.issueTypes!);
        setstatusOptions(res?.data.statuses!);
        setAssigneeOptions(res?.data.members!);
        setLabelOptions(res?.data.labels!);
      }
    });
  };

  const onRenderAction: React.ReactNode = (
    <>
      <Select
        defaultValue={projectId ? projectId : projects?.[0]?.id}
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
              typeOptions?.map((type) => {
                return { label: type.name, value: type.id };
              }) ?? []
            }
            label="Type"
            isLoading={isLoadingProject}
            onChangeOption={setTypeValue}
          />
          <IssueFilterSelect
            initialOption={
              statusOptions?.map((status) => {
                return { label: status.name, value: status.id };
              }) ?? []
            }
            label="Status"
            isLoading={isLoadingProject}
            onChangeOption={setStatusValue}
          />
          <IssueFilterSelect
            initialOption={
              assigneeOptions.map((member) => {
                return { label: member.name, value: member.id };
              }) ?? []
            }
            label="Assignee"
            isLoading={isLoadingProject}
            onChangeOption={setAssigneeValue}
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
            isLoading={isLoadingProject}
            onChangeOption={setLabelOptions}
          />
        </>
      )}
      <IssueDateSelect label="Created" onSaveOption={() => {}} />
      <IssueDateSelect label="Updated" onSaveOption={() => {}} />
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
      />
    </>
  );
}
