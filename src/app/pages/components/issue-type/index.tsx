import React from "react";
export default function IssueType(props: any) {
  const onRenderIssueType = () => {
    return (
      <img
        src={require(`../../../assets/images/issue-types/${props.issueTypeKey.toLowerCase()}.png`)}
        width="100%"
        height="100%"
        alt="Story"
      ></img>
    );
  };
  return <>{onRenderIssueType()}</>;
}
