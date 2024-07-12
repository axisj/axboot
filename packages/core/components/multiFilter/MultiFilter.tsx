import { SMixinFlexRow } from "@axboot/core/styles/emotion";
import styled from "@emotion/styled";
import { Option } from "../../../../src/@types";
import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";
import { useBtnI18n, useI18n } from "../../../../src/hooks";
import * as React from "react";
import { IconAdd } from "../../../../src/components/icon";
import { Filter, FilterCond, FilterType, FilterTypeIcon } from "./Filter";

export type IFilterValue = string | string[];

export interface IFilter {
  name: string;
  type: FilterType;
  value: IFilterValue;
  condition?: string;
  loading?: boolean;
  config?: Record<string, any>;
  label?: React.ReactNode;
  options?: Option[];
}

export interface IFilterOption {
  name: string;
  label: React.ReactNode;
  type: FilterType;
  options?: Option[];
}

interface Props {
  filterOptions: IFilterOption[];
  filters: IFilter[];
  onChange: (filters: IFilter[]) => void;
}

export function MultiFilter({ filterOptions, filters = [], onChange }: Props) {
  const { t } = useI18n();
  const btnT = useBtnI18n();
  const [openFilterName, setOpenFilterName] = React.useState("");

  const handleClickAddFilter = React.useCallback(
    (key: string) => {
      const filterOption = filterOptions.find(option => option.name === key);
      if (!filterOption) return;

      const condition = FilterCond[filterOption.type];
      const newFilter: IFilter = {
        name: key,
        value: "",
        condition: condition.defaultValue,
        type: filterOption.type,
        label: filterOption.label,
      };
      setOpenFilterName(key);
      onChange([...filters, newFilter]);
    },
    [filterOptions, filters, onChange],
  );

  const dropdownMenu: MenuProps["items"] = React.useMemo(() => {
    return filterOptions
      .map(({ name, label, type }) => {
        return {
          key: name,
          icon: <FilterTypeIcon type={type} style={{ marginRight: 5 }} />,
          label,
        };
      })
      .filter(option => !filters.find(filter => filter.name === option.key));
  }, [filterOptions, filters]);

  return (
    <Container>
      {filters.map(({ type, label, condition, options, ...rest }, key) => {
        const filterOption = filterOptions.find(option => option.name === rest.name);
        if (!label) {
          label = filterOption?.label;
        }
        options = filterOption?.options;

        return (
          <Filter
            key={key}
            type={type}
            label={label}
            openFilterName={openFilterName}
            setOpenFilterName={setOpenFilterName}
            onChange={filter => {
              const seq = filters.findIndex(f => f.name === filter.name);
              filters[seq] = { ...filter };
              onChange([...filters]);
            }}
            onRemove={name => {
              setOpenFilterName("");
              onChange(filters.filter(filter => filter.name !== name));
            }}
            condition={condition ?? FilterCond[type].defaultValue}
            options={options}
            {...rest}
          />
        );
      })}

      {dropdownMenu.length > 0 && (
        <Dropdown
          menu={{ items: dropdownMenu, onClick: info => handleClickAddFilter(info.key) }}
          placement="bottomLeft"
          arrow
          trigger={["click"]}
          overlayStyle={{ minWidth: 160 }}
        >
          <Button size={"small"} type={"text"} icon={<IconAdd />}>
            {btnT("필터 추가")}
          </Button>
        </Dropdown>
      )}
    </Container>
  );
}

const Container = styled.div`
  ${SMixinFlexRow("flex-start", "center", "wrap")};
  gap: 6px;
`;
