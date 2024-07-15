import { AXFDGDataItem, AXFDGItemRenderProps } from "@axframe/datagrid";
import { alertDialog } from "@core/components/dialogs";
import styled from "@emotion/styled";
import { Input } from "antd";
import * as React from "react";
import { getI18n } from "../../../hooks";

interface Config {
  isEditable?: (item: AXFDGDataItem<any>) => boolean;
  isDisabled?: (item: AXFDGDataItem<any>) => boolean;
}

export function getConditionalInputTimeEditor(config?: Config) {
  return function InputTimeEditor<T = Record<string, any>>({
    editable,
    item,
    value,
    handleSave,
    handleCancel,
    handleMove,
  }: AXFDGItemRenderProps<T>) {
    const parseValue = React.useCallback((value) => {
      // console.log("parseValue", value);

      const { t } = getI18n();
      const timePattern = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/g;
      if (timePattern.test(value)) {
        return value;
      }
      alertDialog({
        content: t("t.msg.inputTimeValidation"),
      });

      return "";
    }, []);

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
      [handleCancel, handleSaveEdit, parseValue],
    );

    const onBlur = React.useCallback<React.FocusEventHandler<HTMLInputElement>>(
      (evt) => {
        handleSaveEdit(parseValue(evt.target.value));
      },
      [handleSaveEdit, parseValue],
    );

    const showEditor = (() => {
      // eslint-disable-next-line no-prototype-builtins
      if (config?.hasOwnProperty("isDisabled")) {
        if (config.isDisabled?.(item)) {
          return false;
        }
        // eslint-disable-next-line no-prototype-builtins
      } else if (config?.hasOwnProperty("isEditable")) {
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
            autoFocus={false}
            size={"small"}
            defaultValue={value}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            maxLength={8}
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
    padding: 0;
    border-radius: 0;
    height: 100%;
    background: transparent;
    text-decoration: solid underline ${(p) => p.theme.primary_color} 2px;
    text-underline-position: under;
    color: ${(p) => p.theme.text_display_color};
  }
`;
