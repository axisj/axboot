import type { InputRef } from "antd";
import { Button, Input, Popover } from "antd";
import * as React from "react";
import { IconArrowDown, IconBin } from "../../../components/icon";
import { useAppStore } from "../../../stores";
import { themePalette } from "../../../styles/theme";
import { FilterComponent, FilterContainer, FilterLabel, FilterType, FilterTypeIcon, FilterValue } from "./Filter";
import { FilterCondition } from "./FilterCondition";
import {
  FilterPopoverBody,
  FilterPopoverContainer,
  FilterPopoverHeader,
  FilterStringPopoverProps,
} from "./FilterString";
import { useFilterControl } from "./useFilterControl";

export const FilterNumber: FilterComponent = ({
  type,
  name,
  label = "",
  options = [],
  value,
  condition,
  config,
  loading,
  setOpenFilterName,
  openFilterName,
  onChange,
  onRemove,
}) => {
  const theme = useAppStore((s) => s.theme);
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
        <FilterNumberPopover
          label={label}
          condition={condition}
          onChangeCondition={handleChangeCondition}
          onRemove={() => onRemove(name)}
          value={value}
          onChangeValue={handleChangeValue}
        />
      }
      trigger='click'
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

interface FilterNumberPopoverProps extends FilterStringPopoverProps {}

const FilterNumberPopover: React.FC<FilterNumberPopoverProps> = ({
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
        <FilterCondition condition={condition} onChangeCondition={handleChangeCondition} type={FilterType.NUMBER} />
        <Button size={"small"} type={"text"} icon={<IconBin />} onClick={onRemove} />
      </FilterPopoverHeader>
      {!disableBody && (
        <FilterPopoverBody>
          <Input
            ref={inputRef}
            type={"number"}
            style={{ width: "100%" }}
            value={value}
            onChange={(e) => onChangeValue(e.target.value)}
            allowClear
          />
        </FilterPopoverBody>
      )}
    </FilterPopoverContainer>
  );
};
