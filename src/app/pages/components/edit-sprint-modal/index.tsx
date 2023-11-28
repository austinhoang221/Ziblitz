import { DatePicker, Form, Input, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { SprintService } from "../../../../services/sprintService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../helpers";
import { ISprint } from "../../../models/ISprint";
interface IEditSprintModalProps {
  mode: string;
  isShowModal: boolean;
  sprint?: ISprint;
  onSaveSprint: () => void;
  onCancel: () => void;
}
export default function EditSprintModal(props: IEditSprintModalProps) {
  const dispatch = useAppDispatch();
  const [editSprintForm] = Form.useForm();
  const [datePickerType, setDatePickerType] = useState<string>("custom");
  const [moveOpenIssueType, setMoveOpenIssueType] = useState<string>("current");
  const [moveOpenIssueToSprintOptions, setMoveOpenIssueToSprintOptions] =
    useState<any>([]);
  const [moveOpenIssueToSprintId, setMoveOpenIssueToSprintId] =
    useState<string>();
  const { RangePicker } = DatePicker;
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
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

  const moveOpenIssueTypes = [
    {
      label: "New sprint",
      value: "New sprint",
    },
    {
      label: "Current sprint",
      value: "current",
    },
    {
      label: "Backlog",
      value: "Backlog",
    },
  ];

  useEffect(() => {
    switch (props.mode) {
      case "edit":
        editSprintForm.resetFields();
        editSprintForm.setFieldsValue(props.sprint);
        if (props.sprint?.startDate && props.sprint.endDate) {
          const time = [
            dayjs(props.sprint.startDate),
            dayjs(props.sprint.endDate),
          ];
          editSprintForm.setFieldValue("time", time);
        }
        break;
      case "start":
        editSprintForm.resetFields();
        editSprintForm.setFieldsValue(props.sprint);
        const currentDate = new Date();
        const oneWeekLater = new Date(currentDate);
        const time = [
          dayjs(currentDate),
          dayjs(oneWeekLater.setDate(currentDate.getDate() + 7)),
        ];
        editSprintForm.setFieldValue("time", time);
        break;
      case "complete":
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode, props.sprint]);

  const onRenderTitle = () => {
    switch (props.mode) {
      case "edit":
        return "Edit sprint";
      case "start":
        return "Start another sprint";
      case "complete":
        return `Complete ${props.sprint?.name}`;
    }
  };

  useEffect(() => {
    const options: any = project?.sprints
      .filter((sprint) => sprint.id !== props.sprint?.id)
      .map((sprint) => {
        return {
          label: sprint.name,
          value: sprint.id,
        };
      });
    if (options && options?.length > 0) {
      setMoveOpenIssueToSprintOptions(options ?? []);
      setMoveOpenIssueToSprintId(options.find((option: any) => option)?.value);
    }
  }, [project?.sprints]);

  const handleFormChange = () => {
    if (!isFormDirty) {
      setIsFormDirty(true); // Mark the form as dirty when changes occur
    }
  };

  const onClickCancelEdit = (e: any) => {
    props.onCancel();
  };

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

  const onChangeSprint = async () => {
    setLoading(true);
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
    if (props.mode === "start") {
      await SprintService.startSprint(
        project?.id!,
        props.sprint?.id!,
        payload
      ).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          setLoading(false);
          props.onSaveSprint();
        }
      });
    } else if (props.mode === "edit") {
      await SprintService.updateSprint(
        project?.id!,
        props.sprint?.id!,
        payload
      ).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          setLoading(false);

          props.onSaveSprint();
        }
      });
    } else {
      let payload: any = {};
      if (moveOpenIssueType === "current") {
        payload.sprintId = moveOpenIssueToSprintId;
      } else {
        payload.option = moveOpenIssueType;
      }
      await SprintService.completeSprint(
        project?.id!,
        props.sprint?.id!,
        payload
      ).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          setLoading(false);
          props.onSaveSprint();
        }
      });
    }
  };

  return (
    <Modal
      title={onRenderTitle()}
      open={props.isShowModal}
      onOk={onChangeSprint}
      okText="Save"
      confirmLoading={loading}
      onCancel={(e) => onClickCancelEdit(e)}
    >
      {props.mode === "complete" ? (
        <>
          <span>This sprint contain:</span>
          <ul>
            <li>
              {
                props.sprint?.issues.filter(
                  (issue) => issue.status.name === "DONE"
                )?.length
              }{" "}
              completed issues
            </li>
            <li>
              {
                props.sprint?.issues.filter(
                  (issue) => issue.status.name !== "DONE"
                )?.length
              }{" "}
              open issues
            </li>
          </ul>
          <Form.Item
            label="Move open issues to"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Select
              defaultValue="current"
              className="mb-2"
              onChange={(e) => setMoveOpenIssueType(e)}
              options={moveOpenIssueTypes}
            ></Select>
            {moveOpenIssueType === "current" && (
              <Select
                value={moveOpenIssueToSprintId}
                onChange={(e) => setMoveOpenIssueToSprintId(e)}
                options={moveOpenIssueToSprintOptions}
              ></Select>
            )}
          </Form.Item>
        </>
      ) : (
        <>
          {props.mode === "start" && (
            <span className="text-muted">
              {props.sprint?.issues.length} issue will be included in this
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
                  required: props.mode === "start",
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
        </>
      )}
    </Modal>
  );
}
