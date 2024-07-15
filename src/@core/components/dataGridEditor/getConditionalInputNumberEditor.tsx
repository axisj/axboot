import { AXFDGDataItem, AXFDGItemRenderProps } from "@axframe/datagrid";
import styled from "@emotion/styled";
import { InputNumber } from "antd";
import * as React from "react";
import { numberFormat } from "../../../utils";

interface Config {
  isEditable?: (item: AXFDGDataItem<any>) => boolean;
  isDisabled?: (item: AXFDGDataItem<any>) => boolean;
  negative?: boolean;
  decimal?: boolean;
  maxLength?: number;
}

export function getConditionalInputNumberEditor(config?: Config) {
  return function InputNumberEditor<T = Record<string, any>>({
    editable,
    item,
    value,
    handleSave,
    handleCancel,
    handleMove,
  }: AXFDGItemRenderProps<T>) {
    const numberNegative = config?.negative ?? false;
    const numberDecimal = config?.decimal ?? false;
    const numberMaxLength = config?.maxLength ?? 18;

    const parseValue = React.useCallback(
      (value) => {
        let parsedValue = 0;

        if (numberDecimal) {
          parsedValue = parseFloat(value) || 0;
        } else {
          parsedValue = parseInt(value) || 0;
        }
        if (!numberNegative) {
          if (parsedValue < 0) parsedValue = 0;
          // parsedValue = Math.abs(parsedValue);
        }
        return parsedValue;
      },
      [numberDecimal, numberNegative],
    );

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
          <InputNumber
            variant={"borderless"}
            autoFocus={true}
            onFocus={(evt) => evt.target.select()}
            size={"small"}
            defaultValue={value}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            maxLength={numberMaxLength}
          />
        </Container>
      );
    }

    return <>{numberFormat(value)}</>;
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

  .ant-input-number {
    border-radius: 0;
    width: calc(100% + 13px);
    margin: 0 -6.5px;
    padding: 0 6.5px;
    background: transparent;
    text-decoration: solid underline ${(p) => p.theme.primary_color} 2px;
    text-underline-position: under;
    color: ${(p) => p.theme.text_display_color};
  }
`;
