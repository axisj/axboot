import { SMixinFlexColumn } from "@axboot/core/styles";
import styled from "@emotion/styled";
import { Button, Col, Divider, Form, FormInstance, Input, Row, Select } from "antd";
import { EmptyMsg } from "components/common";
import * as React from "react";
import { SystemUserGroup } from "services";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { useBtnI18n, useI18n } from "../../../hooks";
import { SubListDataSet } from "./SubListDataSet";
import { useUserGroupManagementStore } from "./useUserGroupManagementStore";

interface Props {
  form: FormInstance<DtoItem>;
}

interface DtoItem extends SystemUserGroup {}

function FormSet({ form }: Props) {
  const saveRequestValue = useUserGroupManagementStore((s) => s.saveRequestValue);
  const setSaveRequestValue = useUserGroupManagementStore((s) => s.setSaveRequestValue);
  const callSaveApi = useUserGroupManagementStore((s) => s.callSaveApi);
  const listSelectedRowKey = useUserGroupManagementStore((s) => s.listSelectedRowKey);
  const formActive = useUserGroupManagementStore((s) => s.formActive);
  const setFormActive = useUserGroupManagementStore((s) => s.setFormActive);
  const cancelFormActive = useUserGroupManagementStore((s) => s.cancelFormActive);
  const callSubListApi = useUserGroupManagementStore((s) => s.callSubListApi);
  const callListApi = useUserGroupManagementStore((s) => s.callListApi);

  const { t } = useI18n("system");
  const btnT = useBtnI18n();

  const formInitialValues = React.useRef<DtoItem>({
    useYn: "",
    data1: "",
  }).current;

  const onValuesChange = React.useCallback(
    (changedValues: any, values: Record<string, any>) => {
      setSaveRequestValue(values);
    },
    [setSaveRequestValue],
  );

  React.useEffect(() => {
    try {
      if (!saveRequestValue || Object.keys(saveRequestValue).length < 1) {
        form.resetFields();
      } else {
        form.setFieldsValue(saveRequestValue);
      }
    } catch (err: any) {
      errorHandling(err).then();
    }
  }, [form, saveRequestValue]);

  React.useEffect(() => {
    if (listSelectedRowKey) {
      callSubListApi();
    }
  }, [callSubListApi, listSelectedRowKey]);

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
        {t("사용자 그룹 관리")}
        <ButtonGroup compact>{/*<Button onClick={() => cancelFormActive()}>{t.button.cancel}</Button>*/}</ButtonGroup>
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
            await callListApi();
          }}
        >
          <FormBox>
            <Row gutter={20}>
              <Col xs={24} sm={12}>
                <Form.Item label={t("코드")} name={"code"} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={t("사용여부")} name={"useYn"} rules={[{ required: true }]}>
                  <Select
                    options={[
                      { value: "Y", label: "Y" },
                      { value: "N", label: "N" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={24} sm={12}>
                <Form.Item label={t("그룹명")} name={"codeNm"} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={t("그룹명(영문)")} name={["multiLang", "en"]} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24}>
                <Form.Item label={t("비고")} name={"desc"}>
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
          </FormBox>
        </Form>

        {listSelectedRowKey !== undefined && (
          <>
            <Divider />
            <FormBoxHeader>{t("사용자 그룹 유저 목록")}</FormBoxHeader>
            <SubWrap>
              <SubListDataSet />
            </SubWrap>
          </>
        )}
      </Body>
    </>
  );
}

const Frame = styled(PageLayout.FrameColumn)`
  padding: 0 16px 16px 16px;
`;
const Header = styled(PageLayout.FrameHeader)``;
const Body = styled.div``;
const FormBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const FormBox = styled(PageLayout.ContentBox)`
  > * {
    max-width: 640px;
  }
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

const SubWrap = styled.div`
  ${SMixinFlexColumn("stretch", "stretch")};
  height: 400px;
`;

export { FormSet };
