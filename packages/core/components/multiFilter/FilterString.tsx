import styled from "@emotion/styled";
import type { InputRef } from "antd";
import { Button, Input, Popover } from "antd";
import * as React from "react";
import { IconArrowDown, IconBin } from "../../../../src/components/icon";
import { useAppStore } from "../../../../src/stores";
import { themePalette } from "../../../../src/styles/theme";
import { SMixinFlexColumn, SMixinFlexRow } from "../../styles/emotion";
import { FilterComponent, FilterContainer, FilterLabel, FilterType, FilterTypeIcon, FilterValue } from "./Filter";
import { FilterCondition } from "./FilterCondition";
import { IFilterValue } from "./MultiFilter";
import { useFilterControl } from "./useFilterControl";

export const FilterString: FilterComponent = ({
  name,
  type,
  value,
  condition,
  loading,
  config,
  label,
  options,
  openFilterName,
  setOpenFilterName,
  onChange,
  onRemove,
}) => {
  const theme = useAppStore(s => s.theme);
  const originFilter = React.useMemo(
    () => ({ name, type, value, condition, loading, config, label, options }),
    [condition, config, label, loading, name, options, type, value],
  );

  const { open, handleOpenChange, handleChangeCondition, handleChangeValue, handleClick } = useFilterControl(
    originFilter,
    name,
    openFilterName,
    setOpenFilterName,
    onChange,
    onRemove,
  );

  const displayValue = React.useMemo(() => {
    if (value === undefined || value === null) {
      return "";
    } else if (condition === "IS_EMPTY") {
      return "IS_EMPTY";
    } else if (condition === "NOT_EMPTY") {
      return "NOT_EMPTY";
    }
    return value;
  }, [condition, value]);

  return (
    <Popover
      content={
        <FilterStringPopover
          label={label}
          condition={condition}
          onChangeCondition={handleChangeCondition}
          onRemove={() => onRemove(name)}
          value={value}
          onChangeValue={handleChangeValue}
        />
      }
      trigger="click"
      placement={"bottomLeft"}
      arrow={false}
      open={open}
      onOpenChange={handleOpenChange}
      overlayInnerStyle={{ padding: 0 }}
      destroyTooltipOnHide
      color={themePalette[theme].component_background}
    >
      <FilterContainer onClick={handleClick} active={!!value}>
        <FilterTypeIcon type={type} />
        <FilterLabel>{label}</FilterLabel>
        {displayValue && <FilterValue>: {displayValue}</FilterValue>}
        <IconArrowDown />
      </FilterContainer>
    </Popover>
  );
};

export interface FilterStringPopoverProps {
  label: React.ReactNode;
  condition: string;
  onRemove: () => void;
  onChangeCondition: (condition: string) => void;
  value: IFilterValue;
  onChangeValue: (value: IFilterValue) => void;
}

const FilterStringPopover: React.FC<FilterStringPopoverProps> = ({
  label,
  condition,
  onRemove,
  onChangeCondition,
  value,
  onChangeValue,
}) => {
  const inputRef = React.useRef<InputRef>(null);

  const handleFocus = React.useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleChangeCondition = React.useCallback(
    (condition: string) => {
      onChangeCondition(condition);
    },
    [onChangeCondition],
  );

  const disableBody = React.useMemo(() => {
    return condition === "IS_EMPTY" || condition === "NOT_EMPTY";
  }, [condition]);

  React.useEffect(() => {
    handleFocus();
  }, [handleFocus, condition]);

  return (
    <FilterPopoverContainer>
      <FilterPopoverHeader>
        <span role={"label"}>{label}</span>
        <FilterCondition condition={condition} onChangeCondition={handleChangeCondition} type={FilterType.STRING} />
        <Button size={"small"} type={"text"} icon={<IconBin />} onClick={onRemove} />
      </FilterPopoverHeader>
      {!disableBody && (
        <FilterPopoverBody>
          <Input
            ref={inputRef}
            style={{ width: "100%" }}
            value={value}
            onChange={e => onChangeValue(e.target.value)}
            allowClear
          />
        </FilterPopoverBody>
      )}
    </FilterPopoverContainer>
  );
};

export const FilterPopoverContainer = styled.div`
  min-width: 200px;
  padding: 6px;

  ${SMixinFlexColumn("flex-start", "stretch")};
  gap: 2px;
`;
export const FilterPopoverHeader = styled.div`
  ${SMixinFlexRow("stretch", "center")};
  gap: 6px;
  [role="label"] {
    font-size: 0.9em;
    color: ${p => p.theme.text_heading_color};
    padding-left: 0.5em;
  }
  [role="condition"] {
    font-size: 0.9em;
    flex: 1;

    cursor: pointer;
    ${SMixinFlexRow("flex-start", "center")};
    gap: 3px;
  }
`;
export const FilterPopoverBody = styled.div``;
