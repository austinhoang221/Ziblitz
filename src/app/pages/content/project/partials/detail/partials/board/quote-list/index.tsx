import styled from "@xstyled/styled-components";
import { Spin } from "antd";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import QuoteItem from "../quote-item";

export const getBackgroundColor = (
  isDraggingOver: boolean,
  isDraggingFrom: boolean
) => {
  if (isDraggingOver) {
    return "#FFEBE6";
  }
  if (isDraggingFrom) {
    return "#E6FCFF";
  }
  return "#EBECF0";
};

const Wrapper = styled.divBox`
  background-color: ${(props: any) =>
    getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  opacity: ${(isDropDisabled: boolean) => (isDropDisabled ? 1 : "inherit")};
  padding: 10px;
  border: 10px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
  overflow-y: scroll;
  height: 60vh;
  max-height: 60vh;
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5); /* Set color of the thumb */
    border-radius: 6px; /* Round the corners of the thumb */
  }
  &::-webkit-scrollbar-track {
    background-color: red; /* Set the background color of the track */
  }
`;

const scrollContainerHeight = 250;

const DropZone = styled.divBox`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;
  /*
      not relying on the items for a margin-bottom
      as it will collapse when the list is empty
    */
  padding-bottom: 10px;
`;

const ScrollContainer = styled.divBox`
  overflow-x: hidden;
  overflow-y: auto;
`;

const Title = styled.divBox`
  padding: 10px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  &:focus {
    outline: 2px solid #998dd9;
    outline-offset: 2px;
  }
`;

const Container = styled.divBox``;
function InnerList(props: any) {
  const { quotes, dropProvided } = props;
  const title = props.title ? <Title>{props.title}</Title> : null;

  return (
    <Container>
      {title}
      <DropZone ref={dropProvided.innerRef}>
        <InnerQuoteList quotes={quotes} />
        {dropProvided.placeholder}
      </DropZone>
    </Container>
  );
}

const InnerQuoteList = React.memo(function InnerQuoteList(props: any) {
  return props.quotes?.map((quote: any, index: number) => (
    <Draggable key={quote.id} draggableId={quote.id} index={index}>
      {(dragProvided, dragSnapshot) => (
        <QuoteItem
          key={quote.id}
          quote={quote}
          isDragging={dragSnapshot.isDragging}
          isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
          provided={dragProvided}
        />
      )}
    </Draggable>
  ));
});

export default function QuoteList(props: any) {
  const {
    ignoreContainerClipping,
    internalScroll,
    scrollContainerStyle,
    isDropDisabled,
    isCombineEnabled,
    listId = "LIST",
    listType,
    style,
    quotes,
    title,
    useClone,
  } = props;

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      renderClone={
        useClone
          ? (provided, snapshot, descriptor) => (
              <QuoteItem
                quote={quotes[descriptor.source.index]}
                provided={provided}
                isDragging={snapshot.isDragging}
                isClone
              />
            )
          : undefined
      }
    >
      {(dropProvided, dropSnapshot) => (
        <Wrapper
          style={style}
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={isDropDisabled}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          {!props.isLoading ? (
            internalScroll ? (
              <ScrollContainer style={scrollContainerStyle}>
                <InnerList
                  quotes={quotes}
                  title={title}
                  dropProvided={dropProvided}
                />
              </ScrollContainer>
            ) : (
              <InnerList
                quotes={quotes}
                title={title}
                dropProvided={dropProvided}
              />
            )
          ) : (
            <div
              className="ml-auto mr-auto d-flex align-center text-center"
              style={{ height: "80%" }}
            >
              <Spin spinning />
            </div>
          )}
        </Wrapper>
      )}
    </Droppable>
  );
}
