import { blue, gray } from "@ant-design/colors";
import styled from "@xstyled/styled-components";
import { Button, Tooltip } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import IssueAddParent from "../../../../../../../components/issue-add-parent";
import IssuePriority from "../../../../../../../components/issue-priority";
import IssueType from "../../../../../../../components/issue-type";
import UserAvatar from "../../../../../../../components/user-avatar";

const getBackgroundColor = (
  isDragging: boolean,
  isGroupedOver: boolean,
  authorColors: any
) => {
  if (isDragging) {
    return "#FFFF";
  }

  if (isGroupedOver) {
    return "#EBECF0";
  }

  return "#FFFFFF";
};

const getBorderColor = (isDragging: boolean, authorColors: any) =>
  isDragging ? blue.primary : "transparent";

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
  width: 215;
  /* anchor overrides */
  color: #091e42;

  &:hover,
  &:active {
    color: #091e42;
    text-decoration: none;
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
  width: 200px;
`;

const ParentName = styled.divBox`
  border-radius: 3px;
  background-color: #dfd8fd;
  padding: 2px 8px;
  color: #172b4d;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  width: 140px;
`;

const Footer = styled.divBox`
  display: flex;
  margin-top: 10px;
  align-items: center;
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

  const navigate = useNavigate();
  const onNavigateToIssue = (id: string) => {
    navigate(id);
  };

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
      <Content onClick={() => onNavigateToIssue(quote.id)}>
        <Tooltip title={quote?.name}>
          <span className="text-black text-truncate">{quote.name}</span>
        </Tooltip>
        <div className="align-child-space-between align-center w-100 mb-2">
          <div className="d-flex">
            {quote?.parentName && (
              <Tooltip title={quote?.parentName}>
                <ParentName>{quote?.parentName}</ParentName>
              </Tooltip>
            )}
          </div>

          <IssuePriority priorityId={quote.priorityId}></IssuePriority>
        </div>

        <div className="align-child-space-between align-center w-100 mb-2">
          <div className="d-flex align-center">
            <Button
              type="text"
              className="p-0"
              style={{ width: "18px", height: "18px" }}
            >
              <IssueType issueTypeKey={quote.issueType?.icon}></IssueType>
            </Button>
            <span className="ml-2">{quote.code}</span>
          </div>
          <div>
            <Button type="text" shape="circle" className="mr-2">
              {quote?.issueDetail?.storyPointEstimate ?? 0}
            </Button>
            <UserAvatar
              isShowName={false}
              isMultiple={false}
              userIds={[quote.assigneeId]}
            ></UserAvatar>
          </div>
        </div>
      </Content>
      <Footer></Footer>
    </Container>
  );
}

export default React.memo(QuoteItem);
