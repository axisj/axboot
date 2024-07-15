import { AXFDGItemRenderProps } from "@axframe/datagrid";
import styled from "@emotion/styled";
import { InputNumber } from "antd";
import * as React from "react";
import { numberFormat } from "../../../utils";

export function InputNumberEditor<T = Record<string, any>>({
  editable,
  value,
  handleSave,
  handleCancel,
  handleMove,
}: AXFDGItemRenderProps<T>) {
  const parseValue = (value) => parseInt(value) || 0;

  const handleSaveEdit = React.useCallback(
    (newValue: any, ...rest: any) => {
      if (value === newValue) {
        handleCancel?.();
        const [a, b] = rest;
        handleMove?.(a, b);
        return;
      }
      handleSave?.(newValue, ...rest);
    },
    [value, handleCancel, handleSave, handleMove],
  );

  const onKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLInputElement>>(
    (evt) => {
      switch (evt.key) {
        case "Down":
        case "ArrowDown":
          handleSaveEdit(parseValue(evt.currentTarget.value), "current", "next");
          break;
        case "Up":
        case "ArrowUp":
          handleSaveEdit(parseValue(evt.currentTarget.value), "current", "prev");
          break;
        case "Tab": {
          evt.preventDefault();
          const value = parseValue(evt.currentTarget.value);
          setTimeout(() => {
            if (evt.shiftKey) {
              handleSaveEdit(value, "prev", "current");
            } else {
              handleSaveEdit(value, "next", "current");
            }
          });
          break;
        }
        case "Enter":
          handleSaveEdit(parseValue(evt.currentTarget.value));
          break;
        case "Esc":
        case "Escape":
          handleCancel?.();
          break;
        default:
          return;
      }
    },
    [handleCancel, handleSaveEdit],
  );

  const onBlur = React.useCallback<React.FocusEventHandler<HTMLInputElement>>(
    (evt) => {
      handleSaveEdit(parseValue(evt.target.value));
    },
    [handleSaveEdit],
  );

  if (editable) {
    return (
      <Container>
        <InputNumber
          variant={"borderless"}
          autoFocus={true}
          onFocus={(evt) => evt.target.select()}
          size={"small"}
          defaultValue={value}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          min={1}
          maxLength={10}
        />
      </Container>
    );
  }
  return <>{numberFormat(value)}</>;
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;

  .ant-input-number {
    padding: 0;
    border-radius: 0;
    width: 100%;
    background: transparent;
    text-decoration: solid underline ${(p) => p.theme.primary_color} 2px;
    text-underline-position: under;
    color: ${(p) => p.theme.text_display_color};
  }
`;
