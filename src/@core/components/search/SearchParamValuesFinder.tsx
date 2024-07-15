import styled from "@emotion/styled";
import { Button, Form, Select, Space } from "antd";
import React from "react";
import { IconSearch } from "components/icon";
import { SearchParamComponent } from "./SearchParam";

export const SearchParamValuesFinder: SearchParamComponent = ({
  name,
  label,
  value,
  options,
  width,
  placeholder,
  onSearch,
  onChangedComponentValue,
  config,
  disabled,
}) => {
  const form = Form.useFormInstance();

  const handleSearch = React.useCallback(async () => {
    try {
      const options = await onSearch?.();

      form.setFieldValue(name, options);
      onChangedComponentValue?.();
    } catch (e) {
      console.log(e);
    }
  }, [onSearch, form, name, onChangedComponentValue]);

  width = width ? width - 29 : 71;

  return (
    <Form.Item {...(label ? { label, style: { marginBottom: 0, marginRight: 10 } } : { noStyle: true })}>
      <Space.Compact>
        <Form.Item name={name} noStyle>
          <Select
            disabled={disabled}
            mode={config?.single ? undefined : "multiple"}
            style={{ minWidth: 100, width }}
            placeholder={placeholder}
            options={value}
            labelInValue
            maxTagCount='responsive'
            allowClear
            suffixIcon={null}
          />
        </Form.Item>
        <Button onClick={handleSearch} style={{ width: 30 }} icon={<IconSearch />} disabled={disabled} />
      </Space.Compact>
    </Form.Item>
  );
};

const Container = styled.div`
  .ant-input-group-addon {
    padding: 0 5px;

    button {
      padding: 0 2px;
      &:hover {
        color: ${(p) => p.theme.primary_color};
      }
    }
  }
`;
