import styled from "@xstyled/styled-components";
import { Button, Checkbox, Col, Dropdown, Menu, Row, Skeleton } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { RootState } from "../../../../../../../../redux/store";
import { SprintService } from "../../../../../../../../services/sprintService";
import { checkResponseStatus } from "../../../../../../../helpers";
import { IIssueOnBoard } from "../../../../../../../models/IProject";
import IssueModal from "../../../../../../components/issue-modal";
import HeaderProject from "../header";
import Column from "./columns";
import { DotChartOutlined } from "@ant-design/icons";
import { IssueService } from "../../../../../../../../services/issueService";
import { IIssue } from "../../../../../../../models/IIssue";
import Search from "antd/es/input/Search";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { CheckboxChangeEvent } from "antd/es/checkbox";
export default function BoardProject(props: any) {
  const params = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchEpicValue, setSearchEpicValue] = useState<string>("");
  const [epicOptions, setEpicOptions] = useState<any>([]);
  const [searchEpicOptions, setSearchEpicOptions] = useState<any>([]);
  const [checkedEpics, setCheckedEpics] = useState<CheckboxValueType[]>([]);
  const [ordered, setOrdered] = useState<IIssueOnBoard>();
  const { project, isLoading: isLoadingProject } = useSelector(
    (state: RootState) => state.projectDetail
  );

  const { isCombineEnabled, useClone, containerHeight, withScrollableColumns } =
    props;

  const checkAllEpic = epicOptions.length === checkedEpics.length;
  const indeterminateEpic =
    checkedEpics.length > 0 && checkedEpics.length < epicOptions.length;

  const Container = styled.divBox`
    background-color: #fff;
    max-height: 80vh;
    display: inline-flex;
    min-width: 100vw;
  `;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const payload = {
      epicIds: checkedEpics,
      issueTypeId: null,
      sprintId: null,
      searchKey: searchValue,
    };
    await SprintService.getAllIssue(project?.id!, payload).then((res) => {
      if (checkResponseStatus(res)) {
        setOrdered(res?.data!);
        setIsLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.sprintId, project?.id, searchValue]);

  useEffect(() => {
    if (project?.id && project?.epics) {
      let epicOptions = project?.epics.map((epic) => ({
        label: epic.name,
        value: epic.id,
      }));
      setEpicOptions([...epicOptions]);
    }
  }, [project?.id]);

  useEffect(() => {
    setCheckedEpics([...epicOptions.map((item: any) => item.value)]);
  }, [epicOptions]);

  useEffect(() => {
    if (searchEpicValue) {
      const options = epicOptions.filter((epic: any) =>
        epic.label.toLowerCase().includes(searchEpicValue.toLowerCase())
      );
      setSearchEpicOptions(options);
    } else {
      setSearchEpicOptions(epicOptions);
    }
  }, [epicOptions, searchEpicValue]);

  useEffect(() => {
    if (project?.id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id, searchValue, checkedEpics]);

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedEpics(
      e.target.checked ? epicOptions.map((option: any) => option.value) : []
    );
  };

  const onCheckedChange = (list: CheckboxValueType[]) => {
    setCheckedEpics(list);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }
    const source = result.source;
    const destination = result.destination;
    // did not move anywhere - can bail early
    if (source.droppableId === destination.droppableId) {
      return;
    }

    if (result.type === "QUOTE") {
      let moveIssue: IIssue | undefined;

      project?.statuses?.map(async (status) => {
        if (ordered?.[status.name]) {
          moveIssue = ordered?.[status.name].find(
            (issue) => issue.id === result.draggableId
          );

          if (moveIssue) {
            const shallow = [...ordered?.[status.name]];
            shallow.splice(result.source.index, 1);
            const destinationStatus = project?.statuses?.find(
              (status) => status.id === destination.droppableId
            );

            const destinationShallow = [...ordered?.[destinationStatus!.name]];
            destinationShallow.splice(result.destination.index, 0, moveIssue);

            const newOrdered: IIssueOnBoard = {
              [status.name]: shallow,
              [destinationStatus?.name!]: destinationShallow,
            };
            setOrdered((prevState) => ({ ...prevState, ...newOrdered }));

            await IssueService.editSprintIssue(
              moveIssue.sprintId!,
              moveIssue.id,
              { statusId: destination.droppableId }
            );
          }
        }
      });
    }
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const onSearchEpic = (value: string) => {
    setSearchEpicValue(value);
  };

  const onRenderAction: React.ReactNode = (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item>
            <div onClick={(e) => e.stopPropagation()}>
              <Search
                className="mb-2"
                placeholder="Search filters..."
                style={{ width: "250px" }}
                onChange={(event: any) => onSearchEpic(event.target.value)}
              />
              <br></br>
              <Checkbox
                value="all"
                indeterminate={indeterminateEpic}
                checked={checkAllEpic}
                onChange={onCheckAllChange}
                className="w-100"
              >
                All
              </Checkbox>
              <Checkbox.Group
                className="d-flex d-flex-direction-column"
                options={searchEpicOptions}
                value={checkedEpics}
                onChange={onCheckedChange}
              />
            </div>
          </Menu.Item>
        </Menu>
      }
      trigger={["click"]}
    >
      <Button type="text" className="ml-2">
        <span>Epic</span> <i className="fa-solid fa-chevron-down ml-2"></i>
      </Button>
    </Dropdown>
  );

  return (
    <>
      <HeaderProject
        title="Board"
        isFixedHeader={false}
        onSearch={onSearch}
        actionContent={onRenderAction}
      ></HeaderProject>

      {isLoading || isLoadingProject ? (
        <Row gutter={128} className="mt-4">
          {project?.statuses?.map((status, index) => (
            <Col key={index} span={6}>
              <div className="d-flex d-flex-direction-column ">
                <Skeleton.Input active style={{ width: "250px" }} />
                <Skeleton.Node
                  active
                  className="mt-2"
                  style={{ width: "250px", height: "55vh" }}
                >
                  <DotChartOutlined
                    style={{ fontSize: 40, color: "#bfbfbf" }}
                  />
                </Skeleton.Node>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="board"
            type="COLUMN"
            direction="horizontal"
            ignoreContainerClipping={Boolean(containerHeight)}
            isCombineEnabled={isCombineEnabled}
          >
            {(provided) => (
              <Container ref={provided.innerRef} {...provided.droppableProps}>
                {project?.statuses?.map((status, index) => (
                  <Column
                    key={status.id}
                    index={index}
                    title={status.name}
                    id={status.id}
                    quotes={ordered?.[status.name]}
                    isScrollable={withScrollableColumns}
                    isCombineEnabled={isCombineEnabled}
                    useClone={useClone}
                  />
                ))}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <IssueModal></IssueModal>
      <Outlet></Outlet>
    </>
  );
}
