import {
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  message,
  Modal,
  Popconfirm,
  Row,
  Tabs,
  TabsProps,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import React, { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../helpers";
import { IIssue } from "../../../models/IIssue";
import InlineEdit from "../inline-edit";
import IssueComment from "../issue-comment";
import IssueHistory from "../issue-history";
import IssueStatusSelect from "../issue-status-select";
import IssueTypeSelect from "../issue-type-select";
import "./index.scss";

export default function IssueModal(props: any) {
  const params = useParams();
  const navigate = useNavigate();
  const [isOpenIssueModal, setIsOpenIssueModal] = useState<boolean>(false);
  const [issue, setIssue] = useState<IIssue | null>(null);
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [messageApi, contextHolder] = message.useMessage();

  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };
  useEffect(() => {
    if (params?.issueId) {
      fetchData();
    }
  }, [params.issueId]);

  const dispatch = useAppDispatch();

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Comment",
      children: (
        <IssueComment
          initialValue={issue?.name!}
          onSaveIssue={showSuccessMessage}
          periodType={issue?.backlogId ? "backlog" : "sprint"}
          periodId={issue?.sprintId ?? issue?.backlogId!}
          issue={issue!}
        ></IssueComment>
      ),
    },
    {
      key: "2",
      label: "History",
      children: <IssueHistory issueId={issue?.id} />,
    },
  ];

  const fetchData = async () => {
    await IssueService.getById(params?.issueId!).then((res) => {
      if (checkResponseStatus(res)) {
        setIssue(res?.data!);
        setIsOpenIssueModal(true);
      }
    });
  };

  const onChangeField = (type: string, e: any) => {
    const model: any = {};
    if (e) {
      switch (type) {
        case "issueTypeId":
          model.issueTypeId = e;
          break;
      }
    }
    if (props.type === "backlog") {
      IssueService.editBacklogIssue(issue?.backlogId!, issue?.id!, {
        [type]: e,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          fetchData();
        }
      });
    } else {
      IssueService.editSprintIssue(issue?.backlogId!, issue?.id!, {
        [type]: e,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          fetchData();
        }
      });
    }
  };
  const onCancel = () => {
    setIsOpenIssueModal(false);
    navigate(-1);
  };
  const onOk = () => {
    props.onOk();
  };

  const onRenderModalTitle: ReactNode = (
    <div className="issue-modal">
      <div className="align-child-space-between align-center">
        <div className="d-flex align-center">
          <Button type="text" className="pl-0">
            <i className="fa-solid fa-pencil mr-2"></i>
            Add Epic
          </Button>
          <IssueTypeSelect
            onChangeIssueType={(e) => onChangeField("issueTypeId", e.key)}
            issueTypeKey={
              project?.issueTypes.find(
                (type) => type.id === issue?.issueTypeId!
              )?.name ?? ""
            }
          ></IssueTypeSelect>
          <Tooltip title={issue?.code + ": " + issue?.name}>
            <span>{issue?.code}</span>
          </Tooltip>
          <Tooltip title="Copy link to issue">
            <span
              className="ml-2 font-sz12 cursor-pointer"
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
            >
              <i className="fa-solid fa-link"></i>
            </span>
          </Tooltip>
        </div>
        <div>
          <Button type="text">
            <i className="header-icon fa-solid fa-eye mr-2"></i>
            {issue?.watcher?.length}
          </Button>
          <Button type="text">
            <i className="header-icon fa-solid fa-share-nodes"></i>
          </Button>
          <Dropdown
            className="c-backlog-action"
            overlay={
              <Menu>
                <Menu.Item>Copy issue link</Menu.Item>
                <Menu.Item>Copy issue key</Menu.Item>
                <Menu.Item>
                  <Popconfirm
                    title="Delete"
                    description="Are you sure to delete this issue?"
                    okText="Yes"
                    cancelText="Cancel"
                    // onConfirm={() => onDeleteIssue(parentId, issue?.id)}
                  >
                    <div onClick={(e) => e.stopPropagation()}>
                      Move to trash
                    </div>
                  </Popconfirm>
                </Menu.Item>
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
        width="70rem"
      >
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
              onSaveIssue={showSuccessMessage}
              fieldName="name"
              periodType={issue?.backlogId ? "backlog" : "sprint"}
              periodId={issue?.sprintId ?? issue?.backlogId!}
              issueId={issue?.id!}
            ></InlineEdit>
            <div className="mt-2 mb-4">
              <Button
                type="text"
                className=" mr-2"
                style={{ backgroundColor: "#f1f2f4" }}
              >
                <i className="fa-solid fa-paperclip mr-2"></i>
                Attach
              </Button>
              <Button type="text" style={{ backgroundColor: "#f1f2f4" }}>
                <i className="fa-solid fa-network-wired mr-2"></i>
                Add a child issue
              </Button>
            </div>
            <span className="font-weight-bold ml-2 mt-4 mb-2">Description</span>
            <InlineEdit
              periodType={issue?.backlogId ? "backlog" : "sprint"}
              periodId={issue?.sprintId ?? issue?.backlogId!}
              initialValue={issue?.description ?? "Add a description..."}
              type="textarea"
              issueId={issue?.id!}
              fieldName="description"
              onSaveIssue={showSuccessMessage}
            ></InlineEdit>
            <span className="font-weight-bold ml-2 mt-4">Activity</span>
            <Tabs
              className="ml-2"
              items={items}
              destroyInactiveTabPane={true}
            />
          </Col>
          <Col span={8}>
            <IssueStatusSelect
              type={issue?.backlogId ? "backlog" : "sprint"}
              selectedId={issue?.statusId!}
              periodId={issue?.sprintId ?? issue?.backlogId!}
              issueId={issue?.id!}
              style={{ width: "120px" }}
              onSaveIssue={() => {
                showSuccessMessage();
                fetchData();
              }}
            ></IssueStatusSelect>

            <Card title="Details" className="mt-4">
              <Row gutter={24} className="align-center">
                <Col span={8}>
                  <span className="text-muted">Assignee</span>
                </Col>
                <Col span={16}>
                  <InlineEdit
                    periodType={issue?.backlogId ? "backlog" : "sprint"}
                    periodId={issue?.sprintId ?? issue?.backlogId!}
                    initialValue={issue?.issueDetail.assigneeId ?? null}
                    type="assigneeSelect"
                    issueId={issue?.id!}
                    fieldName="assigneeId"
                    onSaveIssue={showSuccessMessage}
                  ></InlineEdit>
                </Col>
              </Row>
              <Row gutter={24} className="align-center">
                <Col span={8}>
                  <span className="text-muted">Label</span>
                </Col>
                <Col span={16}>
                  <InlineEdit
                    periodType={issue?.backlogId ? "backlog" : "sprint"}
                    periodId={issue?.sprintId ?? issue?.backlogId!}
                    initialValue={issue?.sprintId ?? null}
                    type="sprintSelect"
                    issueId={issue?.id!}
                    fieldName="sprintId"
                    onSaveIssue={showSuccessMessage}
                  ></InlineEdit>
                </Col>
              </Row>
              <Row gutter={24} className="align-center">
                <Col span={8}>
                  <span className="text-muted">Sprint</span>
                </Col>
                <Col span={16}>
                  <InlineEdit
                    periodType={issue?.backlogId ? "backlog" : "sprint"}
                    periodId={issue?.sprintId ?? issue?.backlogId!}
                    initialValue={issue?.sprintId ?? null}
                    type="sprintSelect"
                    issueId={issue?.id!}
                    fieldName="sprintId"
                    onSaveIssue={showSuccessMessage}
                  ></InlineEdit>
                </Col>
              </Row>
              <Row gutter={24} className="align-center">
                <Col span={8}>
                  <span className="text-muted">Story point</span>
                </Col>
                <Col span={16}>
                  <InlineEdit
                    periodType={issue?.backlogId ? "backlog" : "sprint"}
                    periodId={issue?.sprintId ?? issue?.backlogId!}
                    initialValue={issue?.issueDetail.storyPointEstimate ?? null}
                    type="storyPointEstimate"
                    issueId={issue?.id!}
                    fieldName="storyPointEstimate"
                    onSaveIssue={showSuccessMessage}
                  ></InlineEdit>
                </Col>
              </Row>
              <Row gutter={24} className="align-center">
                <Col span={8}>
                  <span className="text-muted">Reporter</span>
                </Col>
                <Col span={16}>
                  <InlineEdit
                    periodType={issue?.backlogId ? "backlog" : "sprint"}
                    periodId={issue?.sprintId ?? issue?.backlogId!}
                    initialValue={issue?.issueDetail.reporterId ?? null}
                    type="reporterSelect"
                    issueId={issue?.id!}
                    fieldName="reporterId"
                    onSaveIssue={showSuccessMessage}
                  ></InlineEdit>
                </Col>
              </Row>
            </Card>
            <p className="text-muted">
              Created &nbsp;
              <>
                {issue?.creationTime
                  ? dayjs(issue?.creationTime).format("MMM D, YYYY h:mm A")
                  : ""}
              </>
            </p>
          </Col>
        </Row>
      </Modal>

      {contextHolder}
    </>
  );
}
