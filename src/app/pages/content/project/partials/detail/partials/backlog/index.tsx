import {
  Button,
  Collapse,
  CollapseProps,
  DatePicker,
  Dropdown,
  Form,
  Input,
  List,
  Menu,
  message,
  Modal,
  Popconfirm,
  Select,
} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";
import "./index.scss";
import HeaderProject from "../header";
import { ReactNode, useState } from "react";
import CreateIssueInput from "../../../../../../components/create-issue-input";
import IssueType from "../../../../../../components/issue-type";
import SubMenu from "antd/es/menu/SubMenu";
import UserAvatar from "../../../../../../components/user-avatar";
import SelectUser from "../../../../../../components/select-user";
import EditIssueInput from "../../../../../../components/edit-issue-input";
import { ISprint } from "../../../../../../../models/ISprint";
import { IIssue } from "../../../../../../../models/IIssue";
import { SprintService } from "../../../../../../../../services/sprintService";
import { checkResponseStatus } from "../../../../../../../helpers";
import {
  getProjectByCode,
  setSprints,
} from "../../../../../../../../redux/slices/projectDetailSlice";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { IssueService } from "../../../../../../../../services/issueService";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import IssueStatusSelect from "../../../../../../components/issue-status-select";
const Backlog: React.FC = () => {
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [isChangeSprint, setIsChangeSprint] = useState<boolean>(false);
  const backlogIssues = useSelector(
    (state: RootState) => state.projectDetail.backlogIssues
  );
  const sprints = useSelector(
    (state: RootState) => state.projectDetail.sprints
  );
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [isStartSprint, setIsStartSprint] = useState<boolean>(false);
  const [datePickerType, setDatePickerType] = useState<string>("custom");
  const [startingSprint, setStartingSprint] = useState<ISprint | null>(null);
  const [editSprintForm] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [editSprintId, setEditSprintId] = useState<string>("");
  const datePickerTypes = [
    {
      label: "Custom",
      value: "custom",
    },
    {
      label: "Week",
      value: "week",
    },
    {
      label: "Month",
      value: "month",
    },
    {
      label: "Quater",
      value: "quater",
    },
  ];
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };
  const onClickCreateSprint = (e: any) => {
    e.stopPropagation();
    setIsStartSprint(false);
    SprintService.createSprint(project?.id!).then((res) => {
      if (checkResponseStatus(res)) {
        const tempSprint = [...sprints!];
        tempSprint.push(res?.data!);
        dispatch(setSprints(tempSprint));
        showSuccessMessage();
      }
    });
  };

  const onClickStartSprint = (e: any, sprint: ISprint) => {
    e.stopPropagation();
    setIsStartSprint(true);
    editSprintForm.resetFields();
    setStartingSprint(sprint);
    editSprintForm.setFieldsValue(sprint);
    const currentDate = new Date();
    const oneWeekLater = new Date(currentDate);
    const time = [
      dayjs(currentDate),
      dayjs(oneWeekLater.setDate(currentDate.getDate() + 7)),
    ];
    editSprintForm.setFieldValue("time", time);
    setEditSprintId(sprint.id);
    setIsChangeSprint(true);
  };

  const onSaveIssue = () => {
    showSuccessMessage();
  };

  const handleFormChange = () => {
    if (!isFormDirty) {
      setIsFormDirty(true); // Mark the form as dirty when changes occur
    }
  };

  const onClickEditSprint = (e: any, sprint: ISprint) => {
    e.stopPropagation();
    editSprintForm.resetFields();
    editSprintForm.setFieldsValue(sprint);
    if (sprint.startDate && sprint.endDate) {
      const time = [dayjs(sprint.startDate), dayjs(sprint.endDate)];
      editSprintForm.setFieldValue("time", time);
    }
    setEditSprintId(sprint.id);
    setIsChangeSprint(true);
  };

  const onChangeSprint = async () => {
    const formValue = editSprintForm.getFieldsValue();
    const payload = {
      name: formValue.name,
      startDate: formValue.time?.[0]
        ? dayjs(formValue.time?.[0]).toISOString()
        : null,
      endDate: formValue.time?.[1]
        ? dayjs(formValue.time?.[1]).toISOString()
        : null,
      goal: formValue.goal,
      projectId: project?.id,
    };
    if (!isChangeSprint) {
      await SprintService.updateSprint(
        project?.id!,
        editSprintId,
        payload
      ).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          showSuccessMessage();
          setIsChangeSprint(false);
        }
      });
    } else {
      await SprintService.startSprint(project?.id!, editSprintId, payload).then(
        (res) => {
          if (checkResponseStatus(res)) {
            dispatch(getProjectByCode(project?.code!));
            showSuccessMessage();
            setIsChangeSprint(false);
          }
        }
      );
    }
  };

  const onClickCancelEdit = (e: any) => {
    setIsChangeSprint(false);
    e.stopPropagation();
  };

  const onDeleteIssue = async (parentId: string, id: string) => {
    await IssueService.deleteIssue(parentId, id).then((res) => {
      if (checkResponseStatus(res)) {
        showSuccessMessage();
        dispatch(getProjectByCode(project?.code!));
      }
    });
  };

  const onDeleteSprint = async (e: any, id: string) => {
    e.stopPropagation();
    await SprintService.deleteSprint(project?.id!, id).then((res) => {
      if (checkResponseStatus(res)) {
        const tempSprints = [...sprints!];
        const index = tempSprints.findIndex((item: ISprint) => item.id === id);
        tempSprints.splice(index, 1);
        dispatch(setSprints(tempSprints));
        showSuccessMessage();
      }
    });
  };

  const onChangeAssignUser = (e: any) => {};

  const onRenderListIssue = (
    parentId: string,
    type: string,
    issues: IIssue[]
  ) => {
    return (
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={issues}
        renderItem={(issue) => (
          <List.Item className="c-backlog-item">
            <div className="align-child-space-between align-center w-100">
              <div className="d-flex align-center">
                <Button type="text" className="mr-2">
                  <IssueType
                    issueTypeKey={
                      project?.issueTypes.find(
                        (type) => type.id === issue.issueTypeId
                      )?.name
                    }
                  ></IssueType>
                </Button>
                <>
                  <EditIssueInput
                    initialValue={issue.name}
                    identifier={issue.id}
                    onSaveIssue={onSaveIssue}
                  ></EditIssueInput>
                </>
              </div>
              <div>
                <IssueStatusSelect
                  type={type}
                  periodId={parentId}
                  onSaveIssue={onSaveIssue}
                  currentId={issue?.statusId}
                ></IssueStatusSelect>
                <UserAvatar
                  userIds={[issue?.issueDetail.assigneeId]}
                  isMultiple={false}
                  isShowName={true}
                ></UserAvatar>
                <Dropdown
                  className="c-backlog-action"
                  overlay={
                    <Menu>
                      <Menu.Item>Copy issue link</Menu.Item>
                      <Menu.Item>Copy issue key</Menu.Item>
                      <SubMenu title={"Assignee"} key={issue.id}>
                        <Menu.Item>
                          <SelectUser
                            type={type}
                            periodId={parentId}
                            onSaveIssue={onSaveIssue}
                            currentId={issue.issueDetail.assigneeId}
                          ></SelectUser>
                        </Menu.Item>
                      </SubMenu>
                      <Menu.Item>
                        <Popconfirm
                          title="Delete"
                          description="Are you sure to delete this issue?"
                          okText="Yes"
                          cancelText="Cancel"
                          onConfirm={() => onDeleteIssue(parentId, issue?.id)}
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
                    <i className="fa-solid fa-ellipsis"></i>
                  </Button>
                </Dropdown>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  };

  const onRenderBacklogContent: ReactNode = (
    <>
      {backlogIssues?.length === 0 ? (
        <>
          <div className="c-backlog-no-content">
            <span className="text-center ">
              Plan and pritoritize your future work in backlog
            </span>
          </div>
        </>
      ) : (
        onRenderListIssue(project?.backlog?.id!, "backlog", backlogIssues!)
      )}
      <CreateIssueInput
        type="backlog"
        periodId={project?.backlog?.id}
        onSaveIssue={onSaveIssue}
      ></CreateIssueInput>
    </>
  );

  const onRenderTimePicker = () => {
    switch (datePickerType) {
      case "custom":
        return <RangePicker className="w-100" allowClear={false} />;
      case "week":
        return (
          <RangePicker
            format="DD/MM/YYYY"
            picker="week"
            className="w-100"
            allowClear={false}
          />
        );
      case "month":
        return (
          <RangePicker
            format="DD/MM/YYYY"
            picker="month"
            className="w-100"
            allowClear={false}
          />
        );
      case "quater":
        return (
          <RangePicker
            format="DD/MM/YYYY"
            picker="quarter"
            className="w-100"
            allowClear={false}
          />
        );
    }
  };

  const onRenderSprintContent = (sprint: ISprint): ReactNode => (
    <>
      {!sprint?.issues || sprint?.issues?.length === 0 ? (
        <>
          <div className="c-backlog-no-content">
            <span className="text-center ">
              Plan a sprint by dragging the sprint footer down below some
              issues, or by dragging issues here.
            </span>
          </div>
        </>
      ) : (
        sprint?.issues && onRenderListIssue(sprint.id, "sprint", sprint.issues)
      )}
      <CreateIssueInput
        type="sprint"
        periodId={sprint?.id}
        onSaveIssue={onSaveIssue}
      ></CreateIssueInput>
    </>
  );

  return (
    <>
      <HeaderProject></HeaderProject>
      <div className="mt-4 c-backlog">
        <Collapse ghost={true}>
          {sprints?.map((sprint) => {
            return (
              <Collapse.Panel
                key={sprint.id}
                header={
                  <div>
                    <span className="font-weight-bold">
                      {sprint.name}&nbsp;
                      <span className="font-weight-normal">
                        ({sprint?.issues?.length ?? 0}) issues
                      </span>
                    </span>
                  </div>
                }
                extra={
                  <>
                    {sprint.issues?.length > 0 ? (
                      <Button
                        onClick={(e: any) => onClickCreateSprint(e)}
                        type="default"
                        className="mr-2"
                      >
                        Complete sprint
                      </Button>
                    ) : (
                      <Button
                        onClick={(e: any) => onClickStartSprint(e, sprint)}
                        type="default"
                        className="mr-2"
                      >
                        Start sprint
                      </Button>
                    )}

                    <Dropdown
                      className="c-backlog-action"
                      overlay={
                        <Menu key={sprint.id}>
                          <Menu.Item key="edit">
                            <div onClick={(e) => onClickEditSprint(e, sprint)}>
                              Edit
                            </div>
                          </Menu.Item>
                          <Menu.Item key="delete">
                            <Popconfirm
                              title="Delete"
                              description="Are you sure to delete this sprint?"
                              okText="Yes"
                              cancelText="Cancel"
                              onConfirm={(e) => onDeleteSprint(e, sprint?.id)}
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
                      <Button type="text" onClick={(e) => e.stopPropagation()}>
                        <i className="fa-solid fa-ellipsis"></i>
                      </Button>
                    </Dropdown>
                  </>
                }
              >
                {onRenderSprintContent(sprint)}
              </Collapse.Panel>
            );
          })}

          <Collapse.Panel
            key="backlog"
            header={
              <div>
                <span className="font-weight-bold">
                  Backlog{" "}
                  <span className="font-weight-normal">
                    ({backlogIssues?.length}) issues
                  </span>
                </span>
              </div>
            }
            extra={
              <Button
                onClick={(e: any) => onClickCreateSprint(e)}
                type="default"
              >
                Create sprint
              </Button>
            }
          >
            {onRenderBacklogContent}
          </Collapse.Panel>
        </Collapse>
        <Modal
          title={isStartSprint ? "Start another sprint" : "Edit sprint"}
          open={isChangeSprint}
          onOk={onChangeSprint}
          onCancel={(e) => onClickCancelEdit(e)}
        >
          {isStartSprint && (
            <span>
              {startingSprint?.issues.length} issue will be included in this
              sprint.{" "}
            </span>
          )}
          <Form
            onClick={(e) => e.stopPropagation()}
            form={editSprintForm}
            onValuesChange={handleFormChange}
          >
            <Form.Item
              label="Sprint name"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter your sprint name",
                },
              ]}
            >
              <Input type="text" placeholder="Name" />
            </Form.Item>
            <Form.Item
              label="Duration"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                defaultValue="custom"
                onChange={(e) => setDatePickerType(e)}
                options={datePickerTypes}
              ></Select>
            </Form.Item>
            <Form.Item
              label="Time"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="time"
              rules={[
                {
                  required: isStartSprint,
                  message: "Please input sprint time",
                },
              ]}
            >
              {onRenderTimePicker()}
            </Form.Item>
            <Form.Item
              label="Goal"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="goal"
            >
              <TextArea></TextArea>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      {contextHolder}
    </>
  );
};

export default Backlog;
