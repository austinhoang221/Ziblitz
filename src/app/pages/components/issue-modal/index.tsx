import {
  Button,
  Card,
  Col,
  DatePickerProps,
  Dropdown,
  Menu,
  message,
  Modal,
  Popconfirm,
  Row,
  Tabs,
  TabsProps,
  Tooltip,
  UploadFile,
  UploadProps,
} from "antd";
import Upload from "antd/es/upload/Upload";
import dayjs from "dayjs";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../helpers";
import { IIssue } from "../../../models/IIssue";
import ChildIssues from "../child-issues";
import CreateIssueInput from "../create-issue-input";
import InlineEdit from "../inline-edit";
import IssueAddParent from "../issue-add-parent";
import IssueComment from "../issue-comment";
import IssueHistory from "../issue-history";
import IssueStatusSelect from "../issue-status-select";
import IssueType from "../issue-type";
import IssueTypeSelect from "../issue-type-select";
import Attachments from "./attachments";
import "./index.scss";
import IssueModalSkeleton from "./skeleton";

export default function IssueModal(props: any) {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenIssueModal, setIsOpenIssueModal] = useState<boolean>(false);
  const [issue, setIssue] = useState<IIssue | null>(null);
  const dispatch = useAppDispatch();
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const [messageApi, contextHolder] = message.useMessage();

  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  const showSuccessMessage = (issue?: IIssue) => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
    if (issue) setIssue(issue);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsOpenIssueModal(true);
    await IssueService.getById(params?.issueId!).then((res) => {
      if (checkResponseStatus(res)) {
        setIssue(res?.data!);
        setIsLoading(false);
      }
    });
  }, [params?.issueId, setIssue, setIsOpenIssueModal]);

  useEffect(() => {
    if (params?.issueId) {
      fetchData();
    }
  }, [params.issueId, fetchData]);

  const getPeriodType = (issue: IIssue) => {
    return issue?.backlogId ? "backlog" : issue?.sprintId ? "sprint" : "epic";
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Comment",
      children: (
        <IssueComment
          onSaveIssue={showSuccessMessage}
          periodId={issue?.sprintId ?? issue?.backlogId!}
          issueId={issue?.id!}
        ></IssueComment>
      ),
    },
    {
      key: "2",
      label: "History",
      children: <IssueHistory issueId={issue?.id} />,
    },
  ];

  const onChangeField = (type: string, periodType: string, e: any) => {
    const model: any = {};
    if (e) {
      switch (type) {
        case "issueTypeId":
          model.issueTypeId = e;
          break;
        case "parentId":
          model.parentId = e;
      }
    }
    if (periodType === "backlog") {
      IssueService.editBacklogIssue(issue?.backlogId!, issue?.id!, {
        [type]: e,
        modificationUserId: userId,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          showSuccessMessage(res?.data!);
        }
      });
    } else if (periodType === "sprint") {
      IssueService.editSprintIssue(issue?.backlogId!, issue?.id!, {
        [type]: e,
        modificationUserId: userId,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          showSuccessMessage(res?.data!);
        }
      });
    } else {
      IssueService.updateEpic(project?.id!, issue?.id!, {
        [type]: e,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          showSuccessMessage(res?.data!);
        }
      });
    }
  };

  const onDeleteIssue = async (parentId: string, id: string) => {
    await IssueService.deleteIssue(parentId, id).then((res) => {
      if (checkResponseStatus(res)) {
        showSuccessMessage();
        dispatch(getProjectByCode(project?.code!));
        onCancel();
      }
    });
  };

  const onCancel = () => {
    setIsOpenIssueModal(false);
    navigate(-1);
  };
  const onOk = () => {
    props.onOk();
  };

  const disabledStartDate: DatePickerProps["disabledDate"] = (current) => {
    if (issue?.dueDate) {
      return current && current > dayjs(issue?.dueDate);
    } else return false;
  };

  const disabledDueDate: DatePickerProps["disabledDate"] = (current) => {
    if (issue?.startDate) {
      return current && current < dayjs(issue?.startDate);
    }
    return false;
  };

  const onRenderModalTitle: ReactNode = (
    <div className="issue-modal">
      <div className="align-child-space-between align-center">
        <div className="d-flex align-center">
          {issue?.issueType.name === "Epic" ? (
            <Button type="text">
              <IssueType issueTypeKey={issue?.issueType.icon}></IssueType>
            </Button>
          ) : (
            <>
              {issue?.issueType.icon !== "subtask" && (
                <>
                  <IssueAddParent
                    type={getPeriodType(issue!)}
                    periodId={issue?.sprintId ?? issue?.backlogId!}
                    issue={issue!}
                    onSaveIssue={showSuccessMessage}
                  ></IssueAddParent>
                  /
                </>
              )}
              <IssueTypeSelect
                onChangeIssueType={(e) =>
                  onChangeField("issueTypeId", getPeriodType(issue!), e.key)
                }
                issueTypeKey={issue?.issueType.icon!}
              ></IssueTypeSelect>
            </>
          )}
          <Tooltip title={issue?.code + ": " + issue?.name}>
            <div>{issue?.code}</div>
          </Tooltip>
          <Tooltip title="Copy link to issue">
            <span
              className="ml-2 font-sz12 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showSuccessMessage();
              }}
            >
              <i className="fa-solid fa-link"></i>
            </span>
          </Tooltip>
        </div>
        <div>
          <Button type="text">
            <i className="header-icon fa-solid fa-eye mr-2"></i>
            {issue?.watcher.users?.length}
          </Button>
          <Button type="text">
            <i className="header-icon fa-solid fa-share-nodes"></i>
          </Button>
          <Dropdown
            className="c-backlog-action"
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showSuccessMessage();
                  }}
                >
                  Copy issue link
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    navigator.clipboard.writeText(issue?.code!);
                    showSuccessMessage();
                  }}
                >
                  Copy issue key
                </Menu.Item>
                {projectPermissions !== null &&
                  projectPermissions.permissions.board.editPermission && (
                    <Menu.Item>
                      <Popconfirm
                        title="Delete"
                        description="Are you sure to delete this issue?"
                        okText="Yes"
                        cancelText="Cancel"
                        onConfirm={() =>
                          onDeleteIssue(
                            issue?.backlogId ?? issue?.sprintId!,
                            issue?.id!
                          )
                        }
                      >
                        <div onClick={(e) => e.stopPropagation()}>
                          Move to trash
                        </div>
                      </Popconfirm>
                    </Menu.Item>
                  )}
              </Menu>
            }
            trigger={["click"]}
          >
            <Button type="text" onClick={(e) => e.preventDefault()}>
              <i className="header-icon fa-solid fa-ellipsis"></i>
            </Button>
          </Dropdown>
          <Button type="text" onClick={onCancel}>
            <i className="header-icon fa-solid fa-xmark"></i>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        title={onRenderModalTitle}
        closeIcon={null}
        onCancel={onCancel}
        onOk={onOk}
        open={isOpenIssueModal}
        footer={null}
        width="70rem"
      >
        {!isLoading ? (
          <Row gutter={24}>
            <Col
              span={16}
              style={{
                maxHeight: "60vh",
                overflow: "hidden scroll",
              }}
            >
              <InlineEdit
                initialValue={issue?.name!}
                type="input"
                onSaveIssue={(issue?: IIssue) => showSuccessMessage(issue)}
                fieldName="name"
                periodType={getPeriodType(issue!)}
                periodId={issue?.sprintId ?? issue?.backlogId!}
                issueId={issue?.id!}
              ></InlineEdit>

              <Attachments issue={issue!} onSaveSuccess={showSuccessMessage} />

              <span className="font-weight-bold ml-2 mt-4 mb-2">
                Description
              </span>
              <div className="mb-4">
                <InlineEdit
                  periodType={getPeriodType(issue!)}
                  periodId={issue?.sprintId ?? issue?.backlogId!}
                  initialValue={issue?.description ?? "Add a description..."}
                  type="textarea"
                  issueId={issue?.id!}
                  fieldName="description"
                  onSaveIssue={(issue?: IIssue) => showSuccessMessage(issue)}
                ></InlineEdit>
              </div>

              <span className="font-weight-bold ml-2 mt-4 mb-4">
                Child issues
              </span>
              {issue?.issueType?.name !== "Subtask" && (
                <>
                  <ChildIssues data={issue?.childIssues ?? []}></ChildIssues>
                  <CreateIssueInput
                    isSubtask={issue?.issueType?.name !== "Epic"}
                    type={getPeriodType(issue!)}
                    periodId={issue?.sprintId ?? issue?.backlogId!}
                    parentId={issue?.id}
                    onSaveIssue={showSuccessMessage}
                  ></CreateIssueInput>
                </>
              )}
              <span className="font-weight-bold ml-2 mt-4">Activity</span>
              <Tabs
                className="ml-2"
                items={items}
                destroyInactiveTabPane={true}
              />
            </Col>
            <Col span={8}>
              <div className="d-inline-bl">
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
                  onSaveIssue={(issue) => {
                    setIssue(issue!);
                    showSuccessMessage();
                  }}
                ></IssueStatusSelect>
              </div>

              <Card title="Details" className="mt-4">
                <Row gutter={24} className="align-center">
                  <Col span={8}>
                    <span className="text-muted">Assignee</span>
                  </Col>
                  <Col span={16}>
                    <InlineEdit
                      periodType={getPeriodType(issue!)}
                      periodId={issue?.sprintId ?? issue?.backlogId!}
                      initialValue={issue?.issueDetail.assigneeId ?? null}
                      type="assigneeSelect"
                      issueId={issue?.id!}
                      fieldName="assigneeId"
                      onSaveIssue={(issue?: IIssue) =>
                        showSuccessMessage(issue)
                      }
                    ></InlineEdit>
                  </Col>
                </Row>
                <Row gutter={24} className="align-center">
                  <Col span={8}>
                    <span className="text-muted">Label</span>
                  </Col>
                  <Col span={16}>
                    <InlineEdit
                      periodType={getPeriodType(issue!)}
                      periodId={issue?.sprintId ?? issue?.backlogId!}
                      initialValue={issue?.sprintId ?? null}
                      type="sprintSelect"
                      issueId={issue?.id!}
                      fieldName="sprintId"
                      onSaveIssue={(issue?: IIssue) =>
                        showSuccessMessage(issue)
                      }
                    ></InlineEdit>
                  </Col>
                </Row>
                {(issue?.backlogId || issue?.sprintId) && (
                  <Row gutter={24} className="align-center">
                    <Col span={8}>
                      <span className="text-muted">Sprint</span>
                    </Col>
                    <Col span={16}>
                      <InlineEdit
                        periodType={getPeriodType(issue!)}
                        periodId={issue?.sprintId ?? issue?.backlogId!}
                        initialValue={issue?.sprintId ?? null}
                        type="sprintSelect"
                        issueId={issue?.id!}
                        fieldName="sprintId"
                        onSaveIssue={(issue?: IIssue) =>
                          showSuccessMessage(issue)
                        }
                      ></InlineEdit>
                    </Col>
                  </Row>
                )}
                {issue?.issueType?.name !== "Epic" ? (
                  <Row gutter={24} className="align-center">
                    <Col span={8}>
                      <span className="text-muted">Story point</span>
                    </Col>
                    <Col span={16}>
                      <InlineEdit
                        periodType={getPeriodType(issue!)}
                        periodId={issue?.sprintId ?? issue?.backlogId!}
                        initialValue={
                          issue?.issueDetail.storyPointEstimate ?? null
                        }
                        type="storyPointEstimate"
                        issueId={issue?.id!}
                        fieldName="storyPointEstimate"
                        onSaveIssue={(issue?: IIssue) =>
                          showSuccessMessage(issue)
                        }
                      ></InlineEdit>
                    </Col>
                  </Row>
                ) : (
                  <>
                    <Row gutter={24} className="align-center">
                      <Col span={8}>
                        <span className="text-muted">Start date</span>
                      </Col>
                      <Col span={16}>
                        <InlineEdit
                          periodType={getPeriodType(issue!)}
                          periodId={issue?.sprintId ?? issue?.backlogId!}
                          initialValue={issue?.startDate ?? null}
                          type="date"
                          issueId={issue?.id}
                          fieldName="startDate"
                          disabledDate={disabledStartDate}
                          onSaveIssue={(issue?: IIssue) =>
                            showSuccessMessage(issue)
                          }
                        ></InlineEdit>
                      </Col>
                    </Row>
                    <Row gutter={24} className="align-center">
                      <Col span={8}>
                        <span className="text-muted">Due date</span>
                      </Col>
                      <Col span={16}>
                        <InlineEdit
                          periodType={getPeriodType(issue!)}
                          periodId={issue?.sprintId ?? issue?.backlogId!}
                          initialValue={issue?.dueDate ?? null}
                          type="date"
                          issueId={issue?.id}
                          fieldName="dueDate"
                          disabledDate={disabledDueDate}
                          onSaveIssue={(issue?: IIssue) =>
                            showSuccessMessage(issue)
                          }
                        ></InlineEdit>
                      </Col>
                    </Row>
                  </>
                )}

                <Row gutter={24} className="align-center">
                  <Col span={8}>
                    <span className="text-muted">Priority</span>
                  </Col>
                  <Col span={16}>
                    <InlineEdit
                      periodType={getPeriodType(issue!)}
                      periodId={issue?.sprintId ?? issue?.backlogId!}
                      initialValue={issue?.priorityId ?? null}
                      type="prioritySelect"
                      issueId={issue?.id!}
                      fieldName="priorityId"
                      onSaveIssue={(issue?: IIssue) =>
                        showSuccessMessage(issue)
                      }
                    ></InlineEdit>
                  </Col>
                </Row>

                <Row gutter={24} className="align-center">
                  <Col span={8}>
                    <span className="text-muted">Reporter</span>
                  </Col>
                  <Col span={16}>
                    <InlineEdit
                      periodType={getPeriodType(issue!)}
                      periodId={issue?.sprintId ?? issue?.backlogId!}
                      initialValue={issue?.issueDetail.reporterId ?? null}
                      type="reporterSelect"
                      issueId={issue?.id!}
                      fieldName="reporterId"
                      onSaveIssue={(issue?: IIssue) =>
                        showSuccessMessage(issue)
                      }
                    ></InlineEdit>
                  </Col>
                </Row>
              </Card>
              <p className="text-muted">
                Created &nbsp;
                {issue?.creationTime
                  ? dayjs(issue?.creationTime).format("MMM D, YYYY h:mm A")
                  : ""}
              </p>
            </Col>
          </Row>
        ) : (
          <IssueModalSkeleton></IssueModalSkeleton>
        )}
      </Modal>

      {contextHolder}
    </>
  );
}
