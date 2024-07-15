import { Loading } from "@core/components/common";
import { errorDialog } from "@core/components/dialogs";
import styled from "@emotion/styled";
import { Button, Col, Divider, Form, FormInstance, Input, Row } from "antd";
import { EmptyMsg } from "components/common";
import * as React from "react";
import { SystemProgram } from "services";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { useBtnI18n, useI18n } from "../../../hooks";
import { useAntApp } from "../../hooks";
import { useProgramManagementStore } from "./useProgramManagementStore";
import { UserGroupPermissions } from "./UserGroupPermissions";

interface Props {
  form: FormInstance<DtoItem>;
}

interface DtoItem extends SystemProgram {}

function FormSet({ form }: Props) {
  const { messageApi } = useAntApp();

  const saveRequestValue = useProgramManagementStore((s) => s.saveRequestValue);
  const setSaveRequestValue = useProgramManagementStore((s) => s.setSaveRequestValue);
  const callSaveApi = useProgramManagementStore((s) => s.callSaveApi);
  const listSelectedRowKey = useProgramManagementStore((s) => s.listSelectedRowKey);
  const formActive = useProgramManagementStore((s) => s.formActive);
  const setFormActive = useProgramManagementStore((s) => s.setFormActive);
  const cancelFormActive = useProgramManagementStore((s) => s.cancelFormActive);
  const callUserGroupApi = useProgramManagementStore((s) => s.callUserGroupApi);
  const userGroupListData = useProgramManagementStore((s) => s.userGroupListData);
  const userGroupSpinning = useProgramManagementStore((s) => s.userGroupSpinning);
  const resetSaveRequestValue = useProgramManagementStore((s) => s.resetSaveRequestValue);

  const { t } = useI18n("system");
  const btnT = useBtnI18n();

  const formInitialValues = {}; // form 의 초기값 reset 해도 이값 으로 리셋됨

  const userGroup = React.useMemo(() => {
    if (saveRequestValue.userGroup) {
      return saveRequestValue.userGroup;
    }
    return userGroupListData.reduce((acc, cur) => ({ ...acc, [cur.code ?? ""]: [] }), {}) as Record<string, any>;
  }, [saveRequestValue.userGroup, userGroupListData]);

  const functions = React.useMemo(() => {
    if (saveRequestValue.functions) {
      return saveRequestValue.functions;
    }
    return [
      {
        key: "fn01",
        label: "검색",
      },
      {
        key: "fn02",
        label: "저장",
      },
      {
        key: "fn03",
        label: "삭제",
      },
      {
        key: "fn04",
        label: "엑셀",
      },
    ];
  }, [saveRequestValue.functions]);

  const onValuesChange = React.useCallback(
    (changedValues: any, values: Record<string, any>) => {
      values.userGroup = userGroup;
      values.functions = functions;
      setSaveRequestValue(values);
    },
    [setSaveRequestValue, userGroup, functions],
  );

  React.useEffect(() => {
    try {
      if (!saveRequestValue || Object.keys(saveRequestValue).length < 1) {
        form.resetFields();
      } else {
        form.setFieldsValue(saveRequestValue);
      }
    } catch (err: any) {
      errorHandling(err);
    }
  }, [saveRequestValue, form]);

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
        {t("프로그램 관리")}

        <ButtonGroup compact>
          {/*<Button onClick={() => cancelFormActive()}>{t.button.cancel}</Button>*/}
          {/*<Button onClick={() => resetSaveRequestValue()}>{t.button.formReset}</Button>*/}
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
            try {
              await callSaveApi();
              messageApi.info(t("저장되었습니다."));
            } catch (e) {
              await errorDialog(e as any);
            }
          }}
        >
          <FormBox>
            <Row gutter={20}>
              <Col span={16}>
                <Form.Item label={t("프로그램 코드")} name={"progCd"} rules={[{ required: true }]}>
                  <Input disabled={!!listSelectedRowKey} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={t("프로그램 명")} name={"progNm"} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={24} sm={24}>
                <Form.Item label={t("비고")} name={"remark"}>
                  <Input.TextArea maxLength={200} />
                </Form.Item>
              </Col>
            </Row>
          </FormBox>

          <Divider />

          <UserGroupPermissions userGroup={userGroup} functions={functions} />
        </Form>

        <Loading active={userGroupSpinning} />
      </Body>
    </>
  );
}

const Header = styled(PageLayout.FrameHeader)``;
const Body = styled.div``;
const FormBox = styled(PageLayout.ContentBox)`
  > * {
    max-width: 640px;
  }
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { FormSet };
