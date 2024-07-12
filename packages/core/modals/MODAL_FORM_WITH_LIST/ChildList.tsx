import { MinusCircleOutlined } from "@ant-design/icons";
import { ExampleSubItem } from "@axboot/core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import { Button, Form, FormInstance, Input, Space } from "antd";
import { EmptyMsg } from "../../../../src/components/common";
import { IconAdd } from "../../../../src/components/icon";
import { useI18n } from "../../../../src/hooks";
import { useCallback, useEffect } from "react";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { errorHandling } from "../../../../src/utils";
import { use$MODAL_FORM_WITH_LIST$Store } from "./use$MODAL_FORM_WITH_LIST$";

interface DtoItem extends ExampleSubItem {}

interface FormValues {
  childList: ExampleSubItem[];
}

interface Props {
  form: FormInstance<FormValues>;
}

export function ChildList({ form }: Props) {
  const { t } = useI18n();
  const list = use$MODAL_FORM_WITH_LIST$Store(s => s.childList);
  const setList = use$MODAL_FORM_WITH_LIST$Store(s => s.setChildList);

  const handleAddItem = useCallback(async () => {
    try {
      const newItem: DtoItem = {};
      setList([...list, newItem]);
    } catch (err) {
      await errorHandling(err);
    }
  }, [list, setList]);

  const onValuesChange = useCallback(
    async (changesValues: FormValues, values: FormValues) => {
      try {
        console.log(changesValues, values);
        setList(values.childList);
      } catch (err) {
        await errorHandling(err);
      }
    },
    [setList],
  );

  useEffect(() => {
    form.setFieldsValue({
      childList: list,
    });
  }, [form, list]);

  return (
    <Div>
      <FormBoxHeader>
        ChildList Title
        <Button size={"small"} icon={<IconAdd />} onClick={handleAddItem}>
          {t("추가")}
        </Button>
      </FormBoxHeader>

      <Form form={form} onValuesChange={onValuesChange}>
        <Form.List name="childList">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                  <Form.Item {...restField} name={[name, "code"]} label={t("코드")} rules={[{ required: true }]}>
                    <Input placeholder="Code" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "name"]} label={t("이름")}>
                    <Input placeholder="Name" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              {fields.length === 0 && <EmptyMsg title={t("등록된 아이템이 없습니다.")} />}
            </>
          )}
        </Form.List>
      </Form>
    </Div>
  );
}

const Div = styled.div``;
const FormBoxHeader = styled(PageLayout.ContentBoxHeader)`
  margin-top: 20px;
`;
const FormBox = styled(PageLayout.ContentBox)`
  > * {
    max-width: 960px;
  }
`;
