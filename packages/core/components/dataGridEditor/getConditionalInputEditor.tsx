import { AXFDGDataItem, AXFDGItemRenderProps } from "@axframe/datagrid";
import styled from "@emotion/styled";
import { Input } from "antd";
import * as React from "react";
import { alpha, darken } from "../../styles/colorUtil";

interface Config {
  isEditable?: (item: AXFDGDataItem<any>) => boolean;
  isDisabled?: (item: AXFDGDataItem<any>) => boolean;
  maxLength?: number;
  autoFocus?: boolean;
}

export function getConditionalInputEditor(config?: Config) {
  return function InputEditor<T = Record<string, any>>({
    editable,
    item,
    value,
    handleSave,
    handleCancel,
    handleMove,
  }: AXFDGItemRenderProps<T>) {
    const inputMaxLength = config?.maxLength ?? 100;
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
      evt => {
        switch (evt.key) {
          case "Down":
          case "ArrowDown":
            handleSaveEdit(evt.currentTarget.value, "current", "next");
            break;
          case "Up":
          case "ArrowUp":
            handleSaveEdit(evt.currentTarget.value, "current", "prev");
            break;
          case "Tab": {
            evt.preventDefault();
            const value = evt.currentTarget.value;
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
            handleSaveEdit(evt.currentTarget.value);
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
      evt => {
        handleSaveEdit(evt.target.value);
      },
      [handleSaveEdit],
    );

    const showEditor = (() => {
      if (Object.prototype.hasOwnProperty.call(config, "isDisabled")) {
        if (config?.isDisabled?.(item)) {
          return false;
        }
      } else if (Object.prototype.hasOwnProperty.call(config, "isEditable")) {
        if (!config?.isEditable?.(item)) {
          return false;
        }
      }
      return editable;
    })();

    if (showEditor) {
      return (
        <Container>
          <Input
            variant={"borderless"}
            autoFocus={config?.autoFocus ?? true}
            size={"small"}
            defaultValue={value}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            maxLength={inputMaxLength}
          />
        </Container>
      );
    }

    return <>{value}</>;
  };
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;

  .ant-input {
    position: absolute;
    width: calc(100% + 13px);
    margin: 0 -6.5px;
    padding: 0 6.5px;
    border-radius: 0;
    height: 100%;
    background: transparent;
    color: ${p => darken(p.theme.primary_color, 0.3)};
    border-bottom: 2px solid ${p => alpha(p.theme.primary_color, 0.3)};
  }
`;
