import { Button, List, Skeleton } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { IssueService } from "../../../../services/issueService";
import { checkResponseStatus } from "../../../helpers";
import { IIssueComment } from "../../../models/IIssueComment";
import InlineEdit from "../inline-edit";
import UserAvatar from "../user-avatar";

interface IInlineEditProps {
  periodId: string;
  issueId: string;
  onSaveIssue: () => void;
}

export default function IssueComment(props: IInlineEditProps) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [comments, setComments] = useState<IIssueComment[]>([]);
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [editedValue, setEditedValue] = useState<string>("");
  const [createValue, setCreateValue] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    await IssueService.getComments(props.issueId).then((res) => {
      if (checkResponseStatus(res)) {
        setTimeout(() => {
          setComments(res?.data!);
          setLoading(false);
        }, 500);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [props.issueId]);

  const onDeleteComment = (id: string) => {
    IssueService.deleteComment(id).then((res) => {
      if (checkResponseStatus(res)) {
        props.onSaveIssue();
      }
    });
  };

  const onRenderContent = () => {
    if (!isLoading) {
      return (
        <>
          <div className="d-flex">
            <UserAvatar
              className="mr-2 mt-2"
              isMultiple={false}
              isShowName={false}
              userIds={[userId]}
            ></UserAvatar>
            <ReactQuill
              className="mt-2 w-100"
              theme="snow"
              onChange={setCreateValue}
            />
          </div>
          <Button type="primary" onClick={onUpdate}>
            Save
          </Button>
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment, index) => (
              <>
                <List.Item key={comment.id}>
                  <List.Item.Meta
                    title={
                      <div>
                        <UserAvatar
                          isMultiple={false}
                          isShowName={true}
                          userIds={[comment.creatorUserId]}
                        ></UserAvatar>
                        <span className="float-right">
                          {dayjs(comment.creationTime).format(
                            "MMM D, YYYY h:mm A"
                          )}
                        </span>
                        <br />
                      </div>
                    }
                    description={
                      !isEdit ? (
                        <>
                          <p>{comment.content}</p>
                          <span className="mr-2">Edit</span>
                          <span onClick={() => onDeleteComment(comment.id)}>
                            Delete
                          </span>
                        </>
                      ) : (
                        <>
                          <ReactQuill
                            className="mt-2 w-100"
                            theme="snow"
                            value={comment.content}
                            onChange={setEditedValue}
                          />
                          <Button type="primary" onClick={onCreate}>
                            Save
                          </Button>
                        </>
                      )
                    }
                  ></List.Item.Meta>
                </List.Item>
              </>
            )}
          ></List>
        </>
      );
    } else {
      return (
        <Skeleton loading={isLoading} active avatar>
          <List.Item.Meta />
        </Skeleton>
      );
    }
  };

  const onCreate = () => {
    IssueService.createComment(props.issueId, createValue).then((res) => {
      if (checkResponseStatus(res)) {
        setComments([...comments, res?.data!]);
        setCreateValue("");
        props.onSaveIssue();
      }
    });
  };

  const onUpdate = () => {
    IssueService.updateComment(props.issueId, editedValue).then((res) => {
      if (checkResponseStatus(res)) {
        setComments([...comments, res?.data!]);
        setEditedValue("");
        props.onSaveIssue();
      }
    });
  };

  return <>{onRenderContent()}</>;
}
