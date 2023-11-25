import { gray } from "@ant-design/colors";
import styled, { order } from "@xstyled/styled-components";
import { Col, Row, Skeleton } from "antd";
import React, { useCallback, useEffect, useState } from "react";
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
export default function BoardProject(props: any) {
  const params = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ordered, setOrdered] = useState<IIssueOnBoard>();
  const { project, isLoading: isLoadingProject } = useSelector(
    (state: RootState) => state.projectDetail
  );

  const {
    isCombineEnabled,
    initial,
    useClone,
    containerHeight,
    withScrollableColumns,
  } = props;
  const Container = styled.divBox`
    background-color: #fff;
    max-height: 80vh;
    display: inline-flex;
    min-width: 100vw;
  `;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    await SprintService.getAllIssue(project?.id!).then((res) => {
      if (checkResponseStatus(res)) {
        setOrdered(res?.data!);
        setIsLoading(false);
      }
    });
  }, [params?.sprintId, project?.id]);

  useEffect(() => {
    if (project?.id) {
      fetchData();
    }
  }, [project?.id]);

  const onDragEnd = (result: any) => {
    // if (result.combine) {
    //   if (result.type === "COLUMN") {
    //     const shallow = [...ordered];
    //     shallow.splice(result.source.index, 1);
    //     setOrdered(shallow);
    //     return;
    //   }
    //   const column = columns[result.source.droppableId];
    //   const withQuoteRemoved = [...column];
    //   withQuoteRemoved.splice(result.source.index, 1);
    //   const orderedColumns = {
    //     ...columns,
    //     [result.source.droppableId]: withQuoteRemoved
    //   };
    //   setColumns(orderedColumns);
    //   return;
    // }
    // // dropped nowhere
    // if (!result.destination) {
    //   return;
    // }
    // const source = result.source;
    // const destination = result.destination;
    // // did not move anywhere - can bail early
    // if (
    //   source.droppableId === destination.droppableId &&
    //   source.index === destination.index
    // ) {
    //   return;
    // }
    // // reordering column
    // if (result.type === "COLUMN") {
    //   const reorderedorder = reorder(ordered, source.index, destination.index);
    //   setOrdered(reorderedorder);
    //   return;
    // }
    // const data = reorderQuoteMap({
    //   quoteMap: columns,
    //   source,
    //   destination
    // });
    // setColumns(data.quoteMap);
  };

  return (
    <>
      <HeaderProject
        title="Board"
        isFixedHeader={true}
        actionContent={
          <>
            <span>
              <i className="fa-regular fa-clock"></i>
            </span>
          </>
        }
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
