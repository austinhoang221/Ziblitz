import { Input, InputRef } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
interface IInlineEditProps {
  type: string;
  initialValue: string;
  onSave: (value: any) => void;
}
export default function InlineEdit(props: IInlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(props.initialValue);
  const ref = useRef<InputRef>(null);
  useEffect(() => {
    if (isEditing) {
      ref.current?.focus();
    }
  }, [isEditing]);
  const onEdit = () => {
    setIsEditing(true);
  };
  const onRenderInput = () => {
    switch (props.type) {
      case "input":
        return (
          <Input
            ref={ref}
            className="w-100"
            value={editedValue}
            onBlur={() => {
              setEditedValue(props.initialValue);
              setIsEditing(false);
            }}
            onKeyDownCapture={(e) => {
              if (e.key === "Escape") {
                setEditedValue(props.initialValue);
                setIsEditing(false);
              }
            }}
            onChange={(e) => setEditedValue(e.target.value)}
            onPressEnter={(e) => props.onSave(e)}
          />
        );

      case "textarea":
        return (
          <TextArea
            ref={ref}
            className="w-100"
            value={editedValue}
            onBlur={() => {
              setEditedValue(props.initialValue);
              setIsEditing(false);
            }}
            onKeyDownCapture={(e) => {
              if (e.key === "Escape") {
                setEditedValue(props.initialValue);
                setIsEditing(false);
              }
            }}
            onChange={(e) => setEditedValue(e.target.value)}
            onPressEnter={(e) => props.onSave(e)}
          />
        );
    }
  };
  return (
    <div>
      {isEditing ? (
        <div>{onRenderInput()}</div>
      ) : (
        <div className="edit-content" onClick={onEdit}>
          {editedValue}
        </div>
      )}
    </div>
  );
}
