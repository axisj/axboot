import * as React from "react";
import { Option } from "../../../@types";
import { IconArrowDown, IconBin } from "../../../components/icon";
import { useAppStore } from "../../../stores";
import { themePalette } from "../../../styles/theme";
import { FilterComponent, FilterContainer, FilterLabel, FilterType, FilterTypeIcon, FilterValue } from "./Filter";
import { Button, Checkbox, Divider, Popover } from "antd";
import { useFilterControl } from "./useFilterControl";
import { FilterCondition } from "./FilterCondition";
import {
  FilterPopoverBody,
  FilterPopoverContainer,
  FilterPopoverHeader,
  FilterStringPopoverProps,
} from "./FilterString";
import styled from "@emotion/styled";

export const FilterEnum: FilterComponent = ({
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

  const valueWithLabel = React.useMemo(() => {
    if (condition === "IS_EMPTY") {
      return "IS_EMPTY";
    } else if (condition === "NOT_EMPTY") {
      return "NOT_EMPTY";
    } else if (Array.isArray(value)) {
      return value.map((v) => options.find((o) => o.value === v)?.label ?? "").join(", ");
    }
    return "";
  }, [condition, options, value]);

  return (
    <Popover
      content={
        <FilterEnumPopover
          label={label}
          condition={condition}
          onChangeCondition={handleChangeCondition}
          onRemove={() => onRemove(name)}
          value={value}
          onChangeValue={handleChangeValue}
          options={options}
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
      <FilterContainer onClick={handleClick} active={!!(value && value.length > 0)}>
        <FilterTypeIcon type={type} />
        <FilterLabel>{label}</FilterLabel>
        {valueWithLabel && <FilterValue>: {valueWithLabel}</FilterValue>}
        <IconArrowDown />
      </FilterContainer>
    </Popover>
  );
};

interface FilterEnumPopoverProps extends FilterStringPopoverProps {
  options: Option[];
}

const FilterEnumPopover: React.FC<FilterEnumPopoverProps> = ({
  label,
  condition,
  onRemove,
  onChangeCondition,
  value,
  onChangeValue,
  options,
}) => {
  // const inputRef = React.useRef<InputRef>(null);

  const handleFocus = React.useCallback(() => {}, []);

  const handleChangeCondition = React.useCallback(
    (condition: string) => {
      onChangeCondition(condition);
      handleFocus();
    },
    [handleFocus, onChangeCondition],
  );

  const disableBody = React.useMemo(() => {
    return condition === "IS_EMPTY" || condition === "NOT_EMPTY";
  }, [condition]);

  const indeterminate = options.length !== value.length && value.length !== 0;
  const checkAll = value.length === options.length;

  const handleCheckAllChange = React.useCallback(
    (e: any) => {
      if (e.target.checked) {
        onChangeValue(options.map((o) => o.value ?? ""));
      } else {
        onChangeValue([]);
      }
    },
    [onChangeValue, options],
  );

  React.useEffect(() => {
    handleFocus();
  }, [handleFocus]);

  return (
    <FilterPopoverContainer>
      <FilterPopoverHeader>
        <span role={"label"}>{label}</span>
        <FilterCondition condition={condition} onChangeCondition={handleChangeCondition} type={FilterType.ENUM} />
        <Button size={"small"} type={"text"} icon={<IconBin />} onClick={onRemove} />
      </FilterPopoverHeader>
      {!disableBody && (
        <SFilterPopoverBody>
          <Checkbox indeterminate={indeterminate} onChange={handleCheckAllChange} checked={checkAll}>
            Check all
          </Checkbox>
          <Divider style={{ margin: "0.5em 0" }} />
          <Checkbox.Group
            value={Array.isArray(value) ? value : []}
            onChange={(checkedValue) => {
              onChangeValue(checkedValue.map((v) => v.toString()));
            }}
            options={options.map((o) => ({
              label: o.label ?? "",
              value: o.value ?? "",
            }))}
          />
        </SFilterPopoverBody>
      )}
    </FilterPopoverContainer>
  );
};

const SFilterPopoverBody = styled(FilterPopoverBody)`
  width: 300px;
  padding: 5px;
  .ant-checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
`;
