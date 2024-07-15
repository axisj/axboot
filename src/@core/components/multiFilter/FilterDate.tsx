import * as React from "react";
import { IconArrowDown, IconBin } from "../../../components/icon";
import { useAppStore } from "../../../stores";
import { themePalette } from "../../../styles/theme";
import { SMixinFlexRow } from "@axboot/core/styles";
import { FilterComponent, FilterContainer, FilterLabel, FilterType, FilterTypeIcon, FilterValue } from "./Filter";
import { Button, Calendar, Popover } from "antd";
import { useFilterControl } from "./useFilterControl";
import { FilterCondition } from "./FilterCondition";
import {
  FilterPopoverBody,
  FilterPopoverContainer,
  FilterPopoverHeader,
  FilterStringPopoverProps,
} from "./FilterString";
import styled from "@emotion/styled";
import dayjs, { Dayjs } from "dayjs";
import type { CalendarMode } from "antd/es/calendar/generateCalendar";
import { IFilterValue } from "./MultiFilter";

export const FilterDate: FilterComponent = ({
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
    } else if (Array.isArray(value)) {
      const _value = value.join("~");
      return _value !== "~" ? _value : "";
    }
    return value;
  }, [condition, value]);

  return (
    <Popover
      content={
        <FilterDatePopover
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

const cDayjs = (value: any) => {
  if (value === "") return undefined;
  return dayjs(value);
};

const initialDate = (value: IFilterValue) => {
  if (Array.isArray(value)) {
    return cDayjs(value[0]);
  }
  return cDayjs(value);
};
const initialEndDate = (value: IFilterValue) => {
  if (Array.isArray(value)) {
    return cDayjs(value[1]);
  }
  return cDayjs(value);
};

interface FilterDatePopoverProps extends FilterStringPopoverProps {}

const FilterDatePopover: React.FC<FilterDatePopoverProps> = ({
  label,
  condition,
  onRemove,
  onChangeCondition,
  value,
  onChangeValue,
}) => {
  const [calendarMode, setCalendarMode] = React.useState<CalendarMode>("month");
  const [calendarDate, setCalendarDate] = React.useState<Dayjs | undefined>(() => initialDate(value));

  const [endCalendarMode, setEndCalendarMode] = React.useState<CalendarMode>("month");
  const [endCalendarDate, setEndCalendarDate] = React.useState<Dayjs | undefined>(() => initialEndDate(value));

  const handleChangeCondition = React.useCallback(
    (_condition: string) => {
      onChangeCondition(_condition);
    },
    [onChangeCondition],
  );

  const handleSelectDate = React.useCallback(
    async (date: Dayjs, info: { source: string }) => {
      if (info.source === "month") {
        setCalendarMode("month");
      } else if (info.source === "date") {
        setCalendarDate(date);
        if (!endCalendarDate || endCalendarDate.diff(date, "d") < 0) {
          setEndCalendarDate(date);
        }
      }
    },
    [endCalendarDate],
  );

  const handleSelectEndDate = React.useCallback(
    async (date: Dayjs, info: { source: string }) => {
      if (info.source === "year") {
        setEndCalendarMode("month");
      } else if (info.source === "date") {
        if (date.diff(calendarDate, "d") < 0) {
          setCalendarDate(date);
        }
        setEndCalendarDate(date);
      }
    },
    [calendarDate],
  );

  const handlePanelChange = React.useCallback(
    (date: Dayjs, mode: CalendarMode) => {
      setCalendarMode(mode);

      setCalendarDate(date);
      if (endCalendarDate && endCalendarDate.diff(date, "d") < 0) {
        setEndCalendarDate(date);
      }
    },
    [endCalendarDate],
  );

  const handleEndPanelChange = React.useCallback(
    (date: Dayjs, mode: CalendarMode) => {
      setEndCalendarMode(mode);

      if (date.diff(calendarDate, "d") < 0) {
        setCalendarDate(date);
      }
      setEndCalendarDate(date);
    },
    [calendarDate],
  );

  React.useEffect(() => {
    const _calendarDate = calendarDate ? calendarDate.format("YYYY-MM-DD") : "";
    const _endCalendarDate = endCalendarDate ? endCalendarDate.format("YYYY-MM-DD") : "";
    if (condition === "IS_BETWEEN") {
      onChangeValue([_calendarDate, _endCalendarDate]);
    } else {
      onChangeValue(_calendarDate);
    }
    // eslint-disable-next-line
  }, [calendarDate, condition, endCalendarDate]);

  return (
    <FilterPopoverContainer>
      <FilterPopoverHeader>
        <span role={"label"}>{label}</span>
        <FilterCondition condition={condition} onChangeCondition={handleChangeCondition} type={FilterType.DATE} />
        <Button size={"small"} type={"text"} icon={<IconBin />} onClick={onRemove} />
      </FilterPopoverHeader>
      {!(condition === "IS_EMPTY" || condition === "NOT_EMPTY") && (
        <FilterDatePopoverBody>
          <CalendarWrap>
            <Calendar
              fullscreen={false}
              mode={calendarMode}
              value={calendarDate}
              onPanelChange={handlePanelChange}
              onSelect={handleSelectDate}
            />
          </CalendarWrap>
          {condition === "IS_BETWEEN" && (
            <CalendarWrap>
              <Calendar
                fullscreen={false}
                mode={endCalendarMode}
                value={endCalendarDate}
                onPanelChange={handleEndPanelChange}
                onSelect={handleSelectEndDate}
              />
            </CalendarWrap>
          )}
        </FilterDatePopoverBody>
      )}
    </FilterPopoverContainer>
  );
};

const FilterDatePopoverBody = styled(FilterPopoverBody)`
  ${SMixinFlexRow("flex-start", "stretch")};
  gap: 6px;
`;
const CalendarWrap = styled.div`
  width: 300px;
  border-radius: ${(p) => p.theme.border_radius_base};
  border: 1px solid ${(p) => p.theme.border_color_split};
`;
