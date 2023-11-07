import React from "react";
export default function IssueType(props: any) {
  const onRenderIssueType = () => {
    switch (props.issueTypeKey) {
      case "Epic":
        return (
          <img
            src={require("../../../assets/images/epic.png")}
            width="100%"
            height="100%"
            alt="Epic"
          ></img>
        );
      case "Bug":
        return (
          <img
            src={require("../../../assets/images/bug.png")}
            width="100%"
            height="100%"
            alt="Bug"
          ></img>
        );
      case "Story":
        return (
          <img
            src={require("../../../assets/images/story.png")}
            width="100%"
            height="100%"
            alt="Story"
          ></img>
        );
      case "Task":
        return (
          <img
            src={require("../../../assets/images/task.png")}
            width="100%"
            height="100%"
            alt="Story"
          ></img>
        );
      case "Subtask":
        return (
          <img
            src={require("../../../assets/images/subtask.png")}
            width="100%"
            height="100%"
            alt="Story"
          ></img>
        );
      default:
        return (
          <img
            src={require(`../../../assets/images/issue-types/${props.issueTypeKey}.png`)}
            width="100%"
            height="100%"
            alt="Story"
          ></img>
        );
    }
  };
  return <>{onRenderIssueType()}</>;
}
