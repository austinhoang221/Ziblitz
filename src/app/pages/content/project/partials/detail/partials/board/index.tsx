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
import { useIsFirstRender } from "../../../../../../../customHooks/useIsFirstRender";
import IssueFilterSelect from "../../../../../../components/issue-filter-select";
export default function BoardProject(props: any) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const [checkedEpics, setCheckedEpics] = useState<CheckboxValueType[]>([]);
  const [checkedTypes, setCheckedTypes] = useState<CheckboxValueType[]>([]);
  const [checkedSprints, setCheckedSprints] = useState<CheckboxValueType[]>([]);
  const [checkedLabels, setCheckedLabels] = useState<CheckboxValueType[]>([]);
  const [ordered, setOrdered] = useState<IIssueOnBoard>();
  const {
    project,
    isLoading: isLoadingProject,
    projectPermissions,
  } = useSelector((state: RootState) => state.projectDetail);
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const isFirstRender = useIsFirstRender();

  const { isCombineEnabled, useClone, containerHeight, withScrollableColumns } =
    props;

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
      issueTypeIds: checkedTypes,
      sprintIds: checkedSprints,
      labelIds: checkedLabels,
      searchKey: searchValue,
    };
    await SprintService.getAllIssue(project?.id!, payload).then((res) => {
      if (checkResponseStatus(res)) {
        setOrdered(res?.data!);
        setIsLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    project?.id,
    searchValue,
    checkedEpics,
    checkedSprints,
    checkedTypes,
    checkedLabels,
  ]);

  useEffect(() => {
    if (project?.id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    project?.id,
    searchValue,
    checkedEpics,
    checkedSprints,
    checkedTypes,
    checkedLabels,
  ]);

  const onSearch = (value: string) => {
    setSearchValue(value);
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
              { statusId: destination.droppableId, modificationUserId: userId }
            );
          }
        }
      });
    }
  };

  const onRenderAction: React.ReactNode = (
    <>
      <IssueFilterSelect
        projectId={project?.id}
        initialOption={
          project?.epics?.map((epic) => ({
            label: epic.name,
            value: epic.id,
          })) ?? []
        }
        label="Epic"
        isLoading={isLoadingProject || isLoading}
        onChangeOption={setCheckedEpics}
      />
      <IssueFilterSelect
        projectId={project?.id}
        initialOption={
          project?.issueTypes?.map((type) => ({
            label: type.name,
            value: type.id,
          })) ?? []
        }
        label="Issue type"
        isLoading={isLoadingProject || isLoading}
        onChangeOption={setCheckedTypes}
      />
      <IssueFilterSelect
        projectId={project?.id}
        initialOption={
          project?.sprints?.map((sprint) => ({
            label: sprint.name,
            value: sprint.id,
          })) ?? []
        }
        label="Sprint"
        isLoading={isLoadingProject || isLoading}
        onChangeOption={setCheckedSprints}
      />
      <IssueFilterSelect
        projectId={project?.id}
        initialOption={
          project?.labels?.map((label) => ({
            label: label.name,
            value: label.id,
          })) ?? []
        }
        label="Label"
        isLoading={isLoadingProject || isLoading}
        onChangeOption={setCheckedLabels}
      />
    </>
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
            isDropDisabled={
              projectPermissions !== null &&
              !projectPermissions.permissions.board.editPermission
            }
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
