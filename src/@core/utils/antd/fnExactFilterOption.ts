import { SelectProps } from "antd/lib/select";
import { expectFilter } from "../string";
import { findOptionLabelValue } from "./findOptionLabelValue";

export const fnExactFilterOption: SelectProps<string>["filterOption"] = (input, option) => {
  if (!option) {
    return false;
  }
  const optionLabel =
    typeof option.props.children === "string" ? option.props.children : findOptionLabelValue(option.props.children);

  return new RegExp("^" + expectFilter(input), "i").test(optionLabel);
};
