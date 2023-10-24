import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Tooltip,
} from "antd";
import React, { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { checkResponseStatus } from "../../../helpers";
import { IIssue } from "../../../models/IIssue";
import EditIssueInput from "../edit-issue-input";
import InlineEdit from "../inline-edit";
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
  useEffect(() => {
    if (params?.issueId) {
      fetchData();
    }
  }, [params.issueId]);

  const fetchData = async () => {
    await IssueService.getById(params?.issueId!).then((res) => {
      if (checkResponseStatus(res)) {
        setIssue(res?.data!);
        setIsOpenIssueModal(true);
      }
    });
  };

  const onChangeIssueType = () => {};
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
            onChangeIssueType={onChangeIssueType}
            issueTypeKey={
              project?.issueTypes.find(
                (type) => type.id === issue?.issueTypeId!
              )?.name ?? ""
            }
          ></IssueTypeSelect>
          <Tooltip title={issue?.code + ": " + issue?.name}>
            <span>{issue?.code}</span>
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
          <Button type="text">
            <i className="header-icon fa-solid fa-xmark"></i>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      title={onRenderModalTitle}
      closeIcon={null}
      onCancel={onCancel}
      onOk={onOk}
      open={isOpenIssueModal}
      width="60rem"
    >
      <Row gutter={24}>
        <Col span={18}>
          <InlineEdit
            initialValue={issue?.name!}
            type="input"
            onSave={(value: any) => {}}
          ></InlineEdit>
          <Button type="text">
            <i className="fa-solid fa-paperclip mr-2"></i>
            Attach
          </Button>
          <Button type="text">
            <i className="fa-solid fa-paperclip mr-2"></i>
            Add a child issue
          </Button>
          <span>Description</span>
          <InlineEdit
            initialValue={issue?.description ?? "Add a description..."}
            type="textarea"
            onSave={(value: any) => {}}
          ></InlineEdit>
        </Col>
        <Col span={6}>
          <IssueStatusSelect
            type=""
            selectedId=""
            periodId=""
            currentId={issue?.id!}
            onSaveIssue={() => {}}
          ></IssueStatusSelect>
        </Col>
      </Row>
    </Modal>
  );
}
