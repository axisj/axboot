import { Dropdown } from "antd";
import * as React from "react";
import { IconArrowDown } from "../../../../src/components/icon";
import { FilterCond, FilterType } from "./Filter";

interface Props {
  type: FilterType;
  condition: string;
  onChangeCondition: (condition: string) => void;
}

export function FilterCondition({ type, condition, onChangeCondition }: Props) {
  const cond = FilterCond[type];

  return (
    <Dropdown
      menu={{
        items: cond.options.map(option => ({
          key: option.value,
          label: `${option.value} (${option.label})`,
        })),
        onClick: info => {
          onChangeCondition(info.key);
        },
        activeKey: condition,
      }}
      placement="bottomLeft"
      arrow={false}
      trigger={["click"]}
      overlayStyle={{ minWidth: 160 }}
    >
      <span role={"condition"}>
        {condition} <IconArrowDown />
      </span>
    </Dropdown>
  );
}
