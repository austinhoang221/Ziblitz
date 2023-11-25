import { gray } from "@ant-design/colors";
import styled from "@xstyled/styled-components";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import QuoteList from "../quote-list";
const Container = styled.divBox`
  margin: 10px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.divBox`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  background-color: ${(isDragging: boolean) =>
    isDragging ? "rgb(235, 236, 240)" : "rgb(235, 236, 240)"};
  transition: background-color 0.2s ease;
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

export default function Column(props: any) {
  return (
    <Draggable draggableId={props.title} index={props.index}>
      {(provided, snapshot) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <Header isDragging={snapshot.isDragging}>
            <Title
              isDragging={snapshot.isDragging}
              {...provided.dragHandleProps}
              aria-label={`${props.title} quote list`}
            >
              {props.title}
            </Title>
          </Header>
          <QuoteList
            listId={props.title}
            listType="QUOTE"
            style={{
              backgroundColor: snapshot.isDragging ? gray.primary : null,
            }}
            quotes={props.quotes}
            internalScroll={props.isScrollable}
            isCombineEnabled={Boolean(props.isCombineEnabled)}
            useClone={Boolean(props.useClone)}
          />
        </Container>
      )}
    </Draggable>
  );
}
