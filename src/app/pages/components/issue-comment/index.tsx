import { Button, Col, List, Popconfirm, Row, Skeleton } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { IssueService } from "../../../../services/issueService";
import { checkResponseStatus } from "../../../helpers";
import { IIssueComment } from "../../../models/IIssueComment";
import UserAvatar from "../user-avatar";
import IssueEditComment from "./edit-comment";
import "./index.scss";
interface IInlineEditProps {
  periodId: string;
  issueId: string;
  onSaveIssue: () => void;
}

export default function IssueComment(props: IInlineEditProps) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [comments, setComments] = useState<IIssueComment[]>([]);
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
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

  const onRenderContent = () => {
    if (!isLoading) {
      return (
        <>
          <Row>
            <Col span={2}>
              <UserAvatar
                className="mt-2"
                isMultiple={false}
                isShowName={false}
                userIds={[userId]}
              ></UserAvatar>
            </Col>
            <Col span={22}>
              <ReactQuill
                className="mt-2 w-100"
                theme="snow"
                value={createValue}
                onChange={(value) => setCreateValue(value)}
              />
              {createValue !== "" && (
                <Button
                  loading={isLoadingButton}
                  className="mb-2 mt-2"
                  type="primary"
                  onClick={onCreate}
                >
                  Save
                </Button>
              )}
            </Col>
          </Row>

          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment, index) => (
              <List.Item key={comment.id}>
                <List.Item.Meta
                  title={
                    <div>
                      <UserAvatar
                        className="mr-4"
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
                    <Row>
                      <Col span={2}></Col>
                      <Col span={22}>
                        <IssueEditComment
                          issueId={props.issueId}
                          comment={comment}
                          onDeleteComment={onDeleteComment}
                          onUpdateComment={onUpdateComment}
                        ></IssueEditComment>
                      </Col>
                    </Row>
                  }
                ></List.Item.Meta>
              </List.Item>
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
    if (createValue !== "") {
      const payload = {
        creatorUserId: userId,
        isEdited: false,
        content: createValue,
      };
      setLoadingButton(true);
      IssueService.createComment(props.issueId, payload).then((res) => {
        if (checkResponseStatus(res)) {
          setComments([res?.data!, ...comments]);
          setCreateValue("");
          props.onSaveIssue();
          setLoadingButton(false);
        }
      });
    }
  };

  const onUpdateComment = (comment: IIssueComment) => {
    const index = comments.findIndex((item) => item.id === comment.id);
    const shallow = [...comments];
    shallow.splice(index, 1, comment);
    setComments(shallow);
  };

  const onDeleteComment = (id: string) => {
    setComments([...comments.filter((comment) => comment.id !== id)]);
  };

  return <>{onRenderContent()}</>;
}
