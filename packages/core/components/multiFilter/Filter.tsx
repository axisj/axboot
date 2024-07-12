import { CheckCircleOutlined, CheckSquareOutlined } from "@ant-design/icons";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import * as React from "react";
import { IconCalendarEvent, IconNumber, IconString } from "../../../../src/components/icon";
import { lighten } from "../../styles/colorUtil";
import { SMixinFlexRow } from "../../styles/emotion";
import { FilterDate } from "./FilterDate";
import { FilterEnum } from "./FilterEnum";
import { FilterNumber } from "./FilterNumber";
import { FilterRadio } from "./FilterRadio";
import { FilterString } from "./FilterString";
import { IFilter } from "./MultiFilter";

export enum FilterType {
  STRING,
  NUMBER,
  ENUM,
  RADIO,
  DATE,
}

export interface IFilterCondition {
  value: string;
  label: React.ReactNode;
}

interface Props extends IFilter {
  condition: string;
  openFilterName: string;
  setOpenFilterName: React.Dispatch<React.SetStateAction<string>>;
  onChange: (filter: IFilter) => void;
  onRemove: (name: string) => void;
}

export type FilterComponentProp<R> = {
  [key in FilterType]: R;
};

export type FilterComponent = React.FC<Props>;

const FilterComponents: FilterComponentProp<FilterComponent> = {
  [FilterType.STRING]: FilterString,
  [FilterType.NUMBER]: FilterNumber,
  [FilterType.ENUM]: FilterEnum,
  [FilterType.DATE]: FilterDate,
  [FilterType.RADIO]: FilterRadio,
};

export const Filter: FilterComponent = ({ type, ...rest }) => {
  const Comp = FilterComponents[type];
  return <Comp type={type} {...rest} />;
};

export type FilterTypeIconComponent = React.FC<{
  type: FilterType;
  style?: React.CSSProperties;
}>;
export const FilterTypeIcon: FilterTypeIconComponent = ({ type, ...rest }) => {
  if (type === FilterType.STRING) {
    return <IconString {...rest} />;
  } else if (type === FilterType.NUMBER) {
    return <IconNumber {...rest} />;
  } else if (type === FilterType.ENUM) {
    return <CheckSquareOutlined {...rest} />;
  } else if (type === FilterType.RADIO) {
    return <CheckCircleOutlined {...rest} />;
  }
  return <IconCalendarEvent {...rest} />;
};

export const FilterStringCondition: IFilterCondition[] = [
  { value: "IS", label: "equal" },
  { value: "IS_NOT", label: "not equal" },
  { value: "CONTAINS", label: "contains" },
  { value: "CONTAINS_NOT", label: "does not contain" },
  { value: "START_WITH", label: "start with" },
  { value: "ENDS_WITH", label: "end with" },
  { value: "IS_EMPTY", label: "null" },
  { value: "NOT_EMPTY", label: "not null" },
];
export const FilterNumberCondition: IFilterCondition[] = [
  { value: "EQ", label: "equal" },
  { value: "NE", label: "not equal " },
  { value: "LT", label: "little" },
  { value: "LE", label: "little or equal" },
  { value: "GT", label: "greater" },
  { value: "IS_EMPTY", label: "null" },
  { value: "NOT_EMPTY", label: "not null" },
];
export const FilterDateCondition: IFilterCondition[] = [
  { value: "IS", label: "equal" },
  { value: "IS_BEFORE", label: "is before" },
  { value: "IS_AFTER", label: "is after" },
  { value: "IS_ON_OR_BEFORE", label: "is on or before" },
  { value: "IS_ON_OR_AFTER", label: "is on or after" },
  { value: "IS_BETWEEN", label: "is between" },
  { value: "IS_EMPTY", label: "null" },
  { value: "NOT_EMPTY", label: "not null" },
];
export const FilterEnumCondition: IFilterCondition[] = [
  { value: "IS", label: "equal" },
  { value: "IS_NOT", label: "not equal" },
  { value: "IS_EMPTY", label: "null" },
  { value: "NOT_EMPTY", label: "not null" },
];

export const FilterRadioCondition: IFilterCondition[] = [{ value: "IS", label: "equal" }];

export const FilterCond: FilterComponentProp<{
  defaultValue: string;
  options: IFilterCondition[];
}> = {
  [FilterType.STRING]: {
    defaultValue: "CONTAINS",
    options: FilterStringCondition,
  },
  [FilterType.NUMBER]: {
    defaultValue: "EQ",
    options: FilterNumberCondition,
  },
  [FilterType.ENUM]: {
    defaultValue: "IS",
    options: FilterEnumCondition,
  },
  [FilterType.DATE]: {
    defaultValue: "IS_ON_OR_BEFORE",
    options: FilterDateCondition,
  },
  [FilterType.RADIO]: {
    defaultValue: "IS",
    options: FilterRadioCondition,
  },
};

export const FilterContainer = styled.div<{ active?: boolean }>`
  ${SMixinFlexRow("flex-start", "center")};
  gap: 4px;
  border-radius: 6px;
  padding: 6px 8px;
  transition: all 0.2s ease-in-out;
  ${({ active, theme }) => {
    if (active) {
      return css`
        background-color: ${theme.item_active_bg};
        border: 1px solid ${lighten(theme.primary_color, 0.3)};
        cursor: pointer;

        &:hover {
          background-color: ${theme.item_active_bg};
          border: 1px solid ${lighten(theme.primary_color, 0.1)};
        }
      `;
    }
    return css`
      background-color: ${theme.component_background};
      border: 1px solid ${theme.border_color_split};
      cursor: pointer;

      &:hover {
        background-color: ${theme.item_hover_bg};
        border: 1px solid ${theme.border_color_base};
      }
    `;
  }};
`;
export const FilterLabel = styled.div`
  color: ${p => p.theme.text_heading_color};
  user-select: none;
`;
export const FilterValue = styled.div``;
