import { Button, Popconfirm } from "antd";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import { IssueService } from "../../../../../services/issueService";
import { checkResponseStatus } from "../../../../helpers";
import "./index.scss";
export default function IssueEditComment(props: any) {
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [editedValue, setEditedValue] = useState<string>(props.comment.content);
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  const onDeleteComment = (id: string) => {
    setLoadingButton(true);
    IssueService.deleteComment(props.issueId, id).then((res) => {
      if (checkResponseStatus(res)) {
        props.onDeleteComment(id);
        setLoadingButton(false);
      }
    });
  };

  const onUpdate = (id: string) => {
    setLoadingButton(true);
    const payload = {
      creatorUserId: userId,
      isEdited: true,
      content: editedValue,
    };
    IssueService.updateComment(props.issueId, id, payload).then((res) => {
      if (checkResponseStatus(res)) {
        props.onUpdateComment(res?.data);
        setLoadingButton(false);
        setEdit(false);
      }
    });
  };

  return !isEdit ? (
    <>
      {userId === props.comment.creatorUserId && (
        <>
          <div
            className="text-black"
            dangerouslySetInnerHTML={{
              __html: props.comment.content ?? "",
            }}
          />
          <span onClick={() => setEdit(true)} className="mr-2 comment-action">
            Edit
          </span>

          <Popconfirm
            title="Delete the comment"
            description="Are you sure to delete this comment?"
            okText="Yes"
            cancelText="Cancel"
            onConfirm={() => onDeleteComment(props.comment.id)}
          >
            <span className="comment-action">Delete</span>
          </Popconfirm>
        </>
      )}
    </>
  ) : (
    <>
      <ReactQuill
        className="mt-2 mb-2 w-100"
        theme="snow"
        value={editedValue}
        onChange={(value) => setEditedValue(value)}
      />
      <Button
        className="mr-2"
        loading={isLoadingButton}
        type="primary"
        onClick={() => onUpdate(props.comment.id)}
      >
        Save
      </Button>
      <Button
        loading={isLoadingButton}
        type="default"
        onClick={() => setEdit(false)}
      >
        Cancel
      </Button>
    </>
  );
}
