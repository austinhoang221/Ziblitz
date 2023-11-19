import { gray } from "@ant-design/colors";
import styled from "@xstyled/styled-components";
import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { RootState } from "../../../../../../../../redux/store";
import { SprintService } from "../../../../../../../../services/sprintService";
import { checkResponseStatus } from "../../../../../../../helpers";
import { ISprint } from "../../../../../../../models/ISprint";
import HeaderProject from "../header";
import Column from "./columns";

export default function BoardProject(props: any) {
  const params = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ordered, setOrdered] = useState<ISprint>();
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const {
    isCombineEnabled,
    initial,
    useClone,
    containerHeight,
    withScrollableColumns,
  } = props;
  const [columns, setColumns] = useState(initial);
  const Container = styled.divBox`
    background-color: #fff;
    min-height: 100vh;
    /* like display:flex but will allow bleeding over the window width */
    min-width: 100vw;
    display: inline-flex;
  `;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    await SprintService.getById(project?.id!, params?.sprintId!).then((res) => {
      if (checkResponseStatus(res)) {
        setOrdered(res?.data!);
        setIsLoading(false);
      }
    });
  }, [params?.sprintId, project?.id]);

  useEffect(() => {
    if (params?.sprintId) {
      fetchData();
    }
  }, [params.sprintId, fetchData]);

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
              {/* {ordered?.map((key, index) => (
                <Column
                  key={key}
                  index={index}
                  title={key}
                  quotes={columns[key]}
                  isScrollable={withScrollableColumns}
                  isCombineEnabled={isCombineEnabled}
                  useClone={useClone}
                />
              ))}
              {provided.placeholder} */}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
      <Outlet></Outlet>
    </>
  );
}
