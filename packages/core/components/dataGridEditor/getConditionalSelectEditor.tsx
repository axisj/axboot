import { AXFDGDataItem, AXFDGItemRenderProps } from "@axframe/datagrid";
import styled from "@emotion/styled";
import { Select } from "antd";
import * as React from "react";

interface Config {
  isEditable?: (item: AXFDGDataItem<any>) => boolean;
  isDisabled?: (item: AXFDGDataItem<any>) => boolean;
  disabledColor?: string;
  onSelectCallback?: (item: AXFDGDataItem<any>) => Promise<void>;
}

export function getConditionalSelectEditor(options: { label: string; value: any }[], config?: Config) {
  return function GetSelectEditor<T = Record<string, any>>({
    editable,
    item,
    column,
    value,
    handleSave,
    handleCancel,
    handleMove,
  }: AXFDGItemRenderProps<T>) {
    const [IVal, setIVal] = React.useState(value);

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
      async evt => {
        switch (evt.key) {
          case "Down":
          case "ArrowDown":
            handleSaveEdit(evt.currentTarget.value, "current", "next");
            break;
          case "Up":
          case "ArrowUp":
            handleSaveEdit(evt.currentTarget.value, "current", "prev");
            break;
          case "Tab":
            evt.preventDefault();
            if (evt.shiftKey) {
              handleSaveEdit(evt.currentTarget.value, "prev", "current");
            } else {
              handleSaveEdit(evt.currentTarget.value, "next", "current");
            }
            break;
          case "Enter":
            break;
          case "Esc":
          case "Escape":
            await handleCancel?.();
            break;
          default:
            return; // 키 이벤트를 처리하지 않는다면 종료합니다.
        }
      },
      [handleCancel, handleSaveEdit],
    );

    const onBlur = React.useCallback<React.FocusEventHandler<HTMLInputElement>>(
      async evt => {
        await handleCancel?.();
      },
      [handleCancel],
    );

    const onSelect = React.useCallback(
      async (value: any, option: any) => {
        await handleSaveEdit(value);
        await handleCancel?.();

        if (config?.onSelectCallback) {
          await config?.onSelectCallback?.(item);
        }
      },
      [handleSaveEdit, handleCancel, item],
    );

    React.useEffect(() => {
      setIVal(value);
    }, [value]);

    if (config?.isEditable?.(item) || config?.isDisabled) {
      return (
        <Container>
          <Select
            variant={"borderless"}
            size={"small"}
            options={options}
            value={IVal}
            onSelect={onSelect}
            onChange={setIVal}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            {...(config?.isDisabled ? { disabled: config.isDisabled?.(item) } : {})}
          />
        </Container>
      );
    }

    return <Container style={{ backgroundColor: config?.disabledColor ?? "inherit" }}></Container>;
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

  .ant-select {
    width: 100%;

    .ant-select-selector {
      padding: 0 !important;
    }

    .ant-select-arrow {
      inset-inline-end: -3px;
    }
  }
`;
