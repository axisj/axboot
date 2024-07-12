import { IconText } from "@axboot/core/components/common";
import { SMixinFlexRow } from "@axboot/core/styles/emotion";
import { deleteEmptyValue, getDayJsRangeValue } from "@axboot/core/utils/object";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Form, FormInstance, Input, Space } from "antd";
import { IconArrowDown, IconArrowUp, IconSearch } from "../../../../src/components/icon";
import dayjs from "dayjs";
import React from "react";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { DateType, SearchParam, SearchParamOption, SearchParamType } from "./SearchParam";

export interface IParam {
  name: string;
  placeholder?: string | string[];
  type: SearchParamType;
  options?: SearchParamOption[];
  label?: string | string[];
  width?: number;
  checkAllItem?: boolean;
  loading?: boolean;
  picker?: DateType;
  onSearch?: () => Promise<SearchParamOption[]>;
  disabled?: boolean;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  onClick?: () => void;
  allowClear?: boolean;
  config?: Record<string, any>;
}

export interface ParamsValue extends Record<string, any> {
  filter?: string;
}

interface Props {
  form: FormInstance<any>;
  params?: IParam[];
  paramsValue?: ParamsValue;
  onChangeParamsValue?: (paramsValue: Record<string, any>, changedValues?: Record<string, any>) => void;
  onSearch?: () => void;
  children?: React.ReactNode;
  expand?: boolean;
  onChangeExpand?: (expand: boolean) => void;
  spinning?: boolean;
  extraButtons?: React.FC;
  filterWidth?: number;
  filterLabel?: string;
  disableFilter?: boolean;
  labelMinWidth?: number;
  style?: React.CSSProperties;
}

export function SearchParams({
  form,
  params,
  paramsValue,
  onChangeParamsValue,
  onSearch,
  children,
  expand,
  onChangeExpand,
  spinning,
  extraButtons: ExtraButtons,
  filterWidth,
  filterLabel,
  disableFilter = false,
  labelMinWidth,
  style,
}: Props) {
  const [showChildren, setShowChildren] = React.useState(false);

  const handleSearch = React.useCallback(() => {
    onSearch?.();
  }, [onSearch]);

  const onValuesChange = React.useCallback(
    (changedValues: any, values: Record<string, any>) => {
      onChangeParamsValue?.(values, changedValues);
    },
    [onChangeParamsValue],
  );

  const onClickExtraButton = React.useCallback(
    (params: Record<string, any>) => {
      form.setFieldsValue(params);
      onChangeParamsValue?.(form.getFieldsValue());
    },
    [form, onChangeParamsValue],
  );

  const toggleShowExtraParam = React.useCallback(() => {
    onChangeExpand?.(!showChildren);
    setShowChildren(!showChildren);
  }, [onChangeExpand, showChildren]);

  // 전체 선택 시 커스텀 처리
  const onChangedComponentValue = React.useCallback(() => {
    onValuesChange(undefined, form.getFieldsValue());
  }, [form, onValuesChange]);

  React.useEffect(() => {
    const formValues = {
      filterType: paramsValue?.filterType,
      filter: paramsValue?.filter,
      ...paramsValue,
    };

    params?.forEach(filter => {
      if (filter.type === SearchParamType.DATE_RANGE) {
        formValues[filter.name] = getDayJsRangeValue(paramsValue?.[filter.name]);
      } else if (filter.type === SearchParamType.DATE) {
        formValues[filter.name] = paramsValue?.[filter.name] ? dayjs(paramsValue?.[filter.name]) : undefined;
      } else if (filter.type === SearchParamType.VALUES_FINDER) {
        formValues[filter.name] = paramsValue?.[filter.name] ?? [];
      } else if (filter.type === SearchParamType.SELECT) {
        formValues[filter.name] = paramsValue?.[filter.name] ?? "";
      } else {
        formValues[filter.name] = paramsValue?.[filter.name] ?? "";
      }
    });

    form.setFieldsValue(deleteEmptyValue(formValues));

    if (expand !== undefined) {
      setShowChildren(expand);
    }
  }, [form, params, paramsValue, expand]);

  return (
    <Form
      layout="horizontal"
      colon={false}
      form={form}
      onValuesChange={onValuesChange}
      onFinish={handleSearch}
      scrollToFirstError
    >
      {Object.keys(paramsValue ?? {})
        .filter(pv => {
          return !params?.find(p => p.name === pv);
        })
        .map(key => {
          return (
            <Form.Item key={key} name={key} noStyle>
              <Input type={"hidden"} />
            </Form.Item>
          );
        })}
      <Container style={style}>
        <DefaultWrap role={"page-search-bar"} labelMinWidth={labelMinWidth}>
          {params && params?.length > 0 && (
            <Space wrap align={"center"} size={[5, 5]}>
              {params.map((param, idx) => {
                return (
                  <SearchParam
                    key={idx}
                    value={paramsValue?.[param.name]}
                    onClickExtraButton={onClickExtraButton}
                    onChangedComponentValue={onChangedComponentValue}
                    {...param}
                  />
                );
              })}
            </Space>
          )}

          {disableFilter ? (
            <SearchInput />
          ) : (
            <SearchInput>
              <Form.Item {...(filterLabel ? { label: filterLabel } : { noStyle: true })}>
                <Space.Compact style={{ width: filterWidth ? filterWidth : "100%" }}>
                  <Form.Item name={"filter"} noStyle>
                    <Input placeholder={"search"} allowClear />
                  </Form.Item>
                  <Button
                    loading={spinning}
                    style={{ width: 40 }}
                    icon={<IconSearch size={14} />}
                    onClick={handleSearch}
                  />
                </Space.Compact>
              </Form.Item>
            </SearchInput>
          )}

          {ExtraButtons && (
            <Buttons>
              <ExtraButtons />
            </Buttons>
          )}
          {children && (
            <Buttons>
              <IconText
                icon={showChildren ? <IconArrowUp size={18} /> : <IconArrowDown size={18} />}
                onClick={toggleShowExtraParam}
              />
            </Buttons>
          )}
        </DefaultWrap>
        {children && showChildren && <FormBox>{children}</FormBox>}
      </Container>
      <button type="submit" style={{ display: "none" }} />
    </Form>
  );
}

const Container = styled.div`
  flex: 1;
`;

const DefaultWrap = styled.div<{ labelMinWidth?: number }>`
  ${SMixinFlexRow("stretch", "center")};
  gap: 6px;
  .ant-form-item {
    margin-bottom: 0;
  }

  .ant-form-item .ant-form-item-label > label {
    ${({ labelMinWidth }) => {
      if (!labelMinWidth) return;
      return css`
        min-width: ${labelMinWidth}px;
      `;
    }};
    letter-spacing: -1px;
  }
`;

const SearchInput = styled.div`
  flex: 1;

  .ant-input-group.ant-input-group-compact {
    ${SMixinFlexRow("stretch", "center")};
  }
`;

const Buttons = styled.div`
  ${SMixinFlexRow("flex-start", "center")};
  flex: none;
  gap: 5px;
`;

const FormBox = styled(PageLayout.ContentBox)`
  margin-top: 10px;
  margin-bottom: 15px;

  > * {
    max-width: none;
  }
`;
