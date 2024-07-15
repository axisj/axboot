import { IconText, Loading } from "@core/components/common";
import { useAntApp } from "@core/hooks";
import { CustomError } from "@core/services/CustomError";
import { convertToDate } from "@axboot/core/utils/object";
import styled from "@emotion/styled";
import { Button, Col, Divider, Form, FormInstance, Input, Row, Select } from "antd";
import { EmptyMsg } from "components/common";
import { MenuIcon, menuIcons, MenuIconType } from "components/MenuIcon";
import { useBtnI18n, useI18n } from "hooks";
import * as React from "react";
import { SystemMenuGroup } from "services";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { MenuDirectory } from "./MenuDirectory";
import { useMenuManagementStore } from "./useMenuManagementStore";

interface Props {
  form: FormInstance<DtoItem>;
}

interface DtoItem extends SystemMenuGroup {}

function FormSet({ form }: Props) {
  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();

  const detail = useMenuManagementStore((s) => s.detail);
  const saveRequestValue = useMenuManagementStore((s) => s.saveRequestValue);
  const setSaveRequestValue = useMenuManagementStore((s) => s.setSaveRequestValue);
  const callSaveApi = useMenuManagementStore((s) => s.callSaveApi);
  const saveSpinning = useMenuManagementStore((s) => s.saveSpinning);
  const listSelectedRowKey = useMenuManagementStore((s) => s.listSelectedRowKey);
  const formActive = useMenuManagementStore((s) => s.formActive);
  const cancelFormActive = useMenuManagementStore((s) => s.cancelFormActive);
  const setFormActive = useMenuManagementStore((s) => s.setFormActive);
  const callUserGroupApi = useMenuManagementStore((s) => s.callUserGroupApi);
  const userGroupListData = useMenuManagementStore((s) => s.userGroupListData);
  const userGroupSpinning = useMenuManagementStore((s) => s.userGroupSpinning);

  const formInitialValues = {}; // form 의 초기값 reset해도 이값 으로 리셋됨

  const onValuesChange = React.useCallback(
    (changedValues: any, values: Record<string, any>) => {
      values.children = saveRequestValue?.children ?? [];
      setSaveRequestValue(values as SystemMenuGroup);
    },
    [saveRequestValue?.children, setSaveRequestValue],
  );

  const handleSave = React.useCallback(async () => {
    if (!saveRequestValue?.children || saveRequestValue?.children?.length < 1) {
      await errorHandling(new CustomError(t("데이터가 없습니다.")));
      return;
    }
    try {
      await callSaveApi();
      messageApi.info(t("저장되었습니다."));
      if (!detail) {
        cancelFormActive();
      }
    } catch (err: any) {
      await errorHandling(err);
    }
  }, [callSaveApi, cancelFormActive, detail, messageApi, saveRequestValue?.children, t]);

  React.useEffect(() => {
    try {
      if (!saveRequestValue || Object.keys(saveRequestValue).length < 1) {
        form.resetFields();
      } else {
        form.setFieldsValue(
          convertToDate(
            {
              ...saveRequestValue,
              iconTy: saveRequestValue.iconTy,
            },
            [],
          ),
        );
      }
    } catch (err: any) {
      errorHandling(err).then();
    }
  }, [saveRequestValue, form]);

  if (!formActive && !listSelectedRowKey) {
    return (
      <>
        <EmptyMsg>
          <Button
            onClick={() => {
              setFormActive();
            }}
          >
            {t("추가")}
          </Button>
        </EmptyMsg>
        <Form form={form} />
      </>
    );
  }

  return (
    <>
      <Header>
        {t("메뉴정보")}
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
          onFinish={handleSave}
        >
          <FormBox>
            <Row gutter={20}>
              <Col xs={24} sm={8}>
                <Form.Item label={t("메뉴 아이콘")} name={"iconTy"}>
                  <Select
                    showSearch
                    allowClear
                    options={menuIcons.map((k) => ({
                      value: k,
                      label: <IconText icon={<MenuIcon typeName={k as keyof typeof MenuIconType} />}>{k}</IconText>,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={t("메뉴그룹코드")} name={"menuGrpCd"} rules={[{ required: true }]}>
                  <Input placeholder={""} disabled={!!listSelectedRowKey} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={t("메뉴그룹명(한글)")}
                  name={["multiLang", "ko"]}
                  rules={[{ required: saveRequestValue?.menuGrpCd !== "_" }]}
                >
                  <Input disabled={saveRequestValue?.menuGrpCd === "_"} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={t("메뉴그룹명(영문)")}
                  name={["multiLang", "en"]}
                  rules={[{ required: saveRequestValue?.menuGrpCd !== "_" }]}
                >
                  <Input disabled={saveRequestValue?.menuGrpCd === "_"} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={24} sm={24}>
                <Form.Item label={t("유저그룹")} name={"userGroup"} rules={[{ required: true }]}>
                  <Select
                    mode='multiple'
                    allowClear
                    // style={{ width: '100%' }}
                    placeholder='Please select'
                    // defaultValue={[]}
                    // onChange={handleChange}
                    options={userGroupListData.map((userGroup) => ({
                      value: userGroup.code,
                      label: userGroup.codeNm,
                    }))}
                    loading={userGroupSpinning}
                  />
                </Form.Item>
              </Col>
            </Row>
          </FormBox>

          <Divider />

          <MenuDirectory />
        </Form>

        <Loading active={saveSpinning} />
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
