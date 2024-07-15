import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { convertToDate } from "@core/utils/object";
import styled from "@emotion/styled";
import { Button, Col, Form, FormInstance, Input, Row } from "antd";
import { EmptyMsg } from "components/common";
import dayjs from "dayjs";
import { useBtnI18n, useI18n } from "hooks";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils";
import { use$LIST_WITH_FORM_ROW$Store } from "./use$LIST_WITH_FORM_ROW$Store";

interface Props {
  form: FormInstance<DtoItem>;
}

interface DtoItem extends ExampleItem {}

interface FormColumn {
  name: keyof DtoItem;
  label: string;
  span?: number;
}

const FormItem = Form.Item<DtoItem>;

function FormSet({ form }: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const saveRequestValue = use$LIST_WITH_FORM_ROW$Store((s) => s.saveRequestValue);
  const setSaveRequestValue = use$LIST_WITH_FORM_ROW$Store((s) => s.setSaveRequestValue);
  const callSaveApi = use$LIST_WITH_FORM_ROW$Store((s) => s.callSaveApi);
  const listSelectedRowKey = use$LIST_WITH_FORM_ROW$Store((s) => s.listSelectedRowKey);
  const formActive = use$LIST_WITH_FORM_ROW$Store((s) => s.formActive);
  const cancelFormActive = use$LIST_WITH_FORM_ROW$Store((s) => s.cancelFormActive);
  const setFormActive = use$LIST_WITH_FORM_ROW$Store((s) => s.setFormActive);

  const formInitialValues = React.useRef({}).current; // form 의 초기값 reset해도 이값 으로 리셋됨

  const columns = React.useMemo(() => {
    return [
      { name: "id", label: t("아이디"), span: 12 },
      { name: "name", label: t("성명"), span: 12 },
      { name: "cnsltDt", label: t("상담일자"), span: 8 },
      { name: "area", label: t("지역"), span: 8 },
      { name: "birthDt", label: t("생년월일"), span: 8 },
      { name: "phone1", label: t("전화"), span: 6 },
      { name: "cnsltHow", label: t("상담방법"), span: 6 },
      { name: "cnsltPath", label: t("상담경로"), span: 6 },
      { name: "fmTyp", label: t("가족유형"), span: 6 },
      { name: "homeTyp", label: t("주거형태"), span: 6 },
      { name: "fldA", label: t("수급여부"), span: 6 },
      { name: "updatedByNm", label: t("수정일자"), span: 8 },
      { name: "hopePoint", label: t("상담내용"), span: 24 },
    ] as FormColumn[];
  }, [t]);

  const onValuesChange = React.useCallback(
    (changedValues: any, values: Record<string, any>) => {
      if ("birthDt" in changedValues) {
        values["age"] = dayjs().diff(dayjs(changedValues.birthDt), "years");
      }
      setSaveRequestValue(values);
    },
    [setSaveRequestValue],
  );

  React.useEffect(() => {
    try {
      if (!saveRequestValue || Object.keys(saveRequestValue).length < 1) {
        form.resetFields();
      } else {
        form.setFieldsValue(convertToDate({ ...formInitialValues, ...saveRequestValue }, ["cnsltDt", "birthDt"]));
      }
    } catch (err) {
      errorHandling(err).then();
    }
  }, [saveRequestValue, form, formInitialValues]);

  if (!formActive && !listSelectedRowKey) {
    return (
      <>
        <EmptyMsg>
          <Button
            onClick={() => {
              cancelFormActive();
              setFormActive();
            }}
          >
            {btnT("추가")}
          </Button>
        </EmptyMsg>
        <Form form={form} />
      </>
    );
  }

  return (
    <>
      <Header>
        Form
        <ButtonGroup compact>
          <Button onClick={() => cancelFormActive()}>{btnT("취소")}</Button>
        </ButtonGroup>
      </Header>
      <Body>
        <Form<DtoItem>
          form={form}
          layout={"vertical"}
          colon={false}
          scrollToFirstError
          initialValues={formInitialValues}
          onValuesChange={onValuesChange}
          onFinish={async () => {
            await callSaveApi();
            await cancelFormActive();
          }}
        >
          <FormBox>
            <Row gutter={12}>
              {columns.map((column) => (
                <Col key={column.name} span={column.span}>
                  <FormItem name={column.name} label={column.label}>
                    <Input />
                  </FormItem>
                </Col>
              ))}
            </Row>
          </FormBox>
        </Form>
      </Body>
    </>
  );
}

const Header = styled(PageLayout.FrameHeader)``;
const Body = styled.div``;
const FormBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const FormBox = styled(PageLayout.ContentBox)`
  > * {
    max-width: 960px;
  }
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { FormSet };
