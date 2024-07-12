import styled from "@emotion/styled";
import { Col, DatePicker, Form, FormInstance, Input, Row } from "antd";
import React, { useCallback, useEffect } from "react";
import { useI18n } from "../../../../src/hooks";
import { ExampleItem } from "@axboot/core/services/example/ExampleRepositoryInterface";
import { errorHandling } from "../../../../src/utils";
import { convertToDate } from "@axboot/core/utils/object";
import { use$MODAL_FORM_WITH_LIST$Store } from "./use$MODAL_FORM_WITH_LIST$";

interface DtoItem extends ExampleItem {}

const FormItem = Form.Item<DtoItem>;

interface Props {
  form: FormInstance<DtoItem>;
}

const formInitialValues: DtoItem = {
  id: undefined,
  name: undefined,
  birthDt: undefined,
};

export function FormSet({ form }: Props) {
  const { t } = useI18n();
  const item = use$MODAL_FORM_WITH_LIST$Store(s => s.item);
  const setItem = use$MODAL_FORM_WITH_LIST$Store(s => s.setItem);

  const onValuesChange = useCallback(
    async (changesValues: DtoItem, values: DtoItem) => {
      try {
        console.log(changesValues, values);
        setItem(values);
      } catch (err) {
        await errorHandling(err);
      }
    },
    [setItem],
  );

  useEffect(() => {
    form.setFieldsValue({
      ...convertToDate({ ...formInitialValues, ...item }, ["birthDt"]),
    });
  }, [form, item]);

  return (
    <Div>
      <Form form={form} layout={"vertical"} onValuesChange={onValuesChange}>
        <Row gutter={12}>
          <Col span={24}>
            <FormItem name={"id"} label={t("id")} rules={[{ required: true }]}>
              <Input />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem name={"name"} label={t("name")}>
              <Input />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem name={"birthDt"} label={t("birthDt")}>
              <DatePicker />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Div>
  );
}

const Div = styled.div``;
