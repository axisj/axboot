import * as React from "react";
import { Option } from "../../../@types";
import { IconArrowDown, IconBin } from "../../../components/icon";
import { useAppStore } from "../../../stores";
import { themePalette } from "../../../styles/theme";
import { FilterComponent, FilterContainer, FilterLabel, FilterType, FilterTypeIcon, FilterValue } from "./Filter";
import { Button, Popover, Radio } from "antd";
import styled from "@emotion/styled";
import { FilterCondition } from "./FilterCondition";
import { useFilterControl } from "./useFilterControl";
import {
  FilterPopoverBody,
  FilterPopoverContainer,
  FilterPopoverHeader,
  FilterStringPopoverProps,
} from "./FilterString";

export const FilterRadio: FilterComponent = ({
  name,
  type,
  value,
  condition,
  loading,
  config,
  label,
  options = [],
  openFilterName,
  setOpenFilterName,
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
    return options.find((o) => o.value === value)?.label ?? "";
  }, [condition, options, value]);

  return (
    <Popover
      content={
        <FilterRadioPopover
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
      <FilterContainer onClick={handleClick} active={!!value}>
        <FilterTypeIcon type={type} />
        <FilterLabel>{label}</FilterLabel>
        {valueWithLabel && <FilterValue>: {valueWithLabel}</FilterValue>}
        <IconArrowDown />
      </FilterContainer>
    </Popover>
  );
};

export interface FilterRadioPopoverProps extends FilterStringPopoverProps {
  options: Option[];
}

const FilterRadioPopover: React.FC<FilterRadioPopoverProps> = ({
  label,
  condition,
  onRemove,
  onChangeCondition,
  value,
  onChangeValue,
  options,
}) => {
  const handleChangeCondition = React.useCallback(
    (condition: string) => {
      onChangeCondition(condition);
    },
    [onChangeCondition],
  );

  const disableBody = React.useMemo(() => {
    return condition === "IS_EMPTY" || condition === "NOT_EMPTY";
  }, [condition]);

  return (
    <FilterPopoverContainer>
      <FilterPopoverHeader>
        <span role={"label"}>{label}</span>
        <FilterCondition condition={condition} onChangeCondition={handleChangeCondition} type={FilterType.RADIO} />
        <Button size={"small"} type={"text"} icon={<IconBin />} onClick={onRemove} />
      </FilterPopoverHeader>
      {!disableBody && (
        <SFilterPopoverBody>
          <Radio.Group
            value={value}
            onChange={({ target: { value } }) => {
              console.log(value);
              onChangeValue(value);
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
