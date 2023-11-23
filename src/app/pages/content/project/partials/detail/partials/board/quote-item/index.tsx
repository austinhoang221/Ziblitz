import styled from "@xstyled/styled-components";
import React from "react";
import IssueAddParent from "../../../../../../../components/issue-add-parent";

const getBackgroundColor = (
  isDragging: boolean,
  isGroupedOver: boolean,
  authorColors: any
) => {
  if (isDragging) {
    return authorColors.soft;
  }

  if (isGroupedOver) {
    return "#EBECF0";
  }

  return "#FFFFFF";
};

const getBorderColor = (isDragging: boolean, authorColors: any) =>
  isDragging ? authorColors.hard : "transparent";

const Container = styled.aBox`
  border-radius: 2px;
  border: 2px solid transparent;
  border-color: ${(props: any) =>
    getBorderColor(props.isDragging, props.colors)};
  background-color: ${(props: any) =>
    getBackgroundColor(props.isDragging, props.isGroupedOver, props.colors)};
  box-shadow: ${(isDragging: boolean) =>
    isDragging ? `2px 2px 1px #A5ADBA` : "none"};
  box-sizing: border-box;
  padding: 10px;
  margin-bottom: 10px;
  user-select: none;

  /* anchor overrides */
  color: #091e42;

  &:hover,
  &:active {
    color: #091e42;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${(props: any) => props.colors.hard};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const Content = styled.divBox`
  /* flex child */
  flex-grow: 1;
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`;

const Footer = styled.divBox`
  display: flex;
  margin-top: 10px;
  align-items: center;
`;

const Author = styled.smallBox`
  color: ${(props: any) => props.colors.hard};
  flex-grow: 0;
  margin: 0;
  background-color: ${(props: any) => props.colors.soft};
  border-radius: 10px;
  font-weight: normal;
  padding: 5px;
`;

function getStyle(provided: any, style: any) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

function QuoteItem(props: any) {
  const { quote, isDragging, isGroupedOver, provided, style, isClone, index } =
    props;

  return (
    <Container
      isDragging={isDragging}
      isGroupedOver={isGroupedOver}
      isClone={isClone}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
      data-is-dragging={isDragging}
      data-testid={quote.id}
      data-index={index}
      aria-label={`${quote.name}`}
    >
      <Content>
        {quote.name}
        <IssueAddParent
          periodId={quote.backlogId ?? quote.sprintId}
          type={quote.backlogId ? "backlog" : "sprint"}
          issue={quote}
          onSaveIssue={() => {}}
        ></IssueAddParent>
        <Footer></Footer>
      </Content>
    </Container>
  );
}

export default React.memo(QuoteItem);
