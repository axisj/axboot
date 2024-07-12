import { confirmDialog } from "@axboot/core/components/dialogs";
import styled from "@emotion/styled";
import { Button, Col, Form, FormInstance, Input, Row, Select } from "antd";
import { EmptyMsg } from "../../../../src/components/common";
import { useBtnI18n, useI18n } from "../../../../src/hooks";
import * as React from "react";
import { SystemUser, SystemUserService, UserService } from "../../../../src/services";
import { useCodeStore, useUserStore } from "../../../../src/stores";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { errorHandling } from "../../../../src/utils";
import { useAntApp } from "../../hooks";
import { useUserManagementStore } from "./useUserManagementStore";

interface Props {
  form: FormInstance<DtoItem>;
}

interface DtoItem extends SystemUser {}

function FormSet({ form }: Props) {
  const { messageApi } = useAntApp();

  const saveRequestValue = useUserManagementStore(s => s.saveRequestValue);
  const detail = useUserManagementStore(s => s.detail);
  const setSaveRequestValue = useUserManagementStore(s => s.setSaveRequestValue);
  const listSelectedRowKey = useUserManagementStore(s => s.listSelectedRowKey);
  const formActive = useUserManagementStore(s => s.formActive);
  const cancelFormActive = useUserManagementStore(s => s.cancelFormActive);
  const setFormActive = useUserManagementStore(s => s.setFormActive);
  const callUserGroupApi = useUserManagementStore(s => s.callUserGroupApi);
  const userGroupListData = useUserManagementStore(s => s.userGroupListData);
  const userGroupSpinning = useUserManagementStore(s => s.userGroupSpinning);
  const callListApi = useUserManagementStore(s => s.callListApi);
  const callResetOptApi = useUserManagementStore(s => s.callResetOptApi);
  const USE_YN = useCodeStore(s => s.USE_YN);
  const programFn = useUserManagementStore(s => s.programFn);
  const setMe = useUserStore(s => s.setMe);

  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const formInitialValues = React.useRef({
    useYn: "Y",
    domainId: "",
    knoxId: "",
    lockYn: "N",
    roleList: [],
    userAuthFg: "1",
    locale: "ko",
    centerCode: "",
    centerName: "",
    otpCertKey: "",
  }).current; // form 의 초기값 reset해도 이값 으로 리셋됨

  const [passwordActive, setPasswordActive] = React.useState(false);
  const [userIdActive, setUserIdActive] = React.useState(true);

  const userGroup = React.useMemo(() => {
    return userGroupListData.map(data => {
      return { value: data.code, label: data.code };
    });
  }, [userGroupListData]);

  const passwordReSetting = React.useCallback(
    async (_b: boolean) => {
      // setPasswordActive(b);
      if (detail) {
        try {
          await confirmDialog({
            content: "비밀번호를 초기화 하시겠습니까?",
          });

          await SystemUserService.putSystemUserResetPw({
            userCd: detail.userCd,
            __status__: "U",
          });

          messageApi.info("비밀번호를 초기화하고 안내 이메일을 전송했습니다.");
          await callListApi();
        } catch (e) {
          await errorHandling(e);
        }
      }
    },
    [callListApi, detail, messageApi],
  );

  const resetOtp = React.useCallback(async () => {
    try {
      if (!saveRequestValue) return;

      await confirmDialog({
        content: "OTP 재설정 하시겠습니까?",
      });

      await callResetOptApi({
        userCd: saveRequestValue.userCd,
        hpNo: saveRequestValue.hpNo,
      });
    } catch (err) {
      await errorHandling(err);
    }
  }, [callResetOptApi, saveRequestValue]);

  const onSignInForce = React.useCallback(
    async (userCd?: string) => {
      try {
        const { rs } = await UserService.signInForce({
          userCd,
        });
        await setMe(rs);
      } catch (err) {
        await errorHandling(err);
      }
    },
    [setMe],
  );

  const onValuesChange = React.useCallback(
    (changedValues: any, values: Record<string, any>) => {
      if ("roleList" in changedValues) {
        values["roles"] = values["roleList"].join(",");
      }
      setSaveRequestValue(values);
    },
    [setSaveRequestValue],
  );

  React.useEffect(() => {
    try {
      if (!saveRequestValue || Object.keys(saveRequestValue).length < 1) {
        form.resetFields();
        setUserIdActive(true);
      } else {
        form.setFieldsValue({ ...formInitialValues, ...saveRequestValue });
      }
    } catch (err: any) {
      errorHandling(err).then();
    }
  }, [saveRequestValue, form, formInitialValues]);

  React.useEffect(() => {
    setPasswordActive(!detail?.userCd); //api 연결 후 password로 확인
    setUserIdActive(!detail?.userCd);
  }, [detail]);

  React.useEffect(() => {
    if (formActive || listSelectedRowKey) {
      (async () => {
        await callUserGroupApi();
      })();
    }
  }, [callUserGroupApi, formActive, listSelectedRowKey]);

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
        {t("사용자 관리")}

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
        >
          <FormBox>
            <Row gutter={[20, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item label={t("사용자명")} name={"userNm"} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={t("아이디")}>
                  <Form.Item
                    name={"userCd"}
                    rules={[
                      { required: true },
                      () => ({
                        validator(_, value) {
                          const regex = new RegExp(/^[0-9a-zA-Z-]{5,}$/);
                          if (!value || regex.test(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("5자 이상의 영문, 숫자만 입력 가능합니다."));
                        },
                      }),
                    ]}
                  >
                    <Input disabled={!userIdActive} />
                  </Form.Item>
                </Form.Item>
              </Col>
              {passwordActive && (
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={t("비밀번호")}
                    name={"userPassword"}
                    rules={[{ required: passwordActive }]}
                    hasFeedback
                  >
                    <Input.Password disabled={!passwordActive} maxLength={16} />
                  </Form.Item>
                </Col>
              )}
              {!passwordActive && (
                <>
                  <Col xs={24} sm={12}>
                    <Form.Item label={t("비밀번호")}>
                      <Button block onClick={() => passwordReSetting(true)}>
                        {btnT("비밀번호 재설정")}
                      </Button>
                    </Form.Item>
                  </Col>
                  {programFn?.fn06 && saveRequestValue?.userCd && (
                    <Col sm={12}>
                      <Form.Item label={" "}>
                        <Button block onClick={() => onSignInForce(saveRequestValue.userCd)}>
                          {saveRequestValue.userCd}로 로그인
                        </Button>
                      </Form.Item>
                    </Col>
                  )}
                </>
              )}
              {passwordActive && (
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={t("비밀번호확인")}
                    name={"userPasswordCheck"}
                    dependencies={["userPassword"]}
                    hasFeedback
                    rules={[
                      { required: true },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("userPassword") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error(t("비밀번호가 일치하지 않습니다.")));
                        },
                      }),
                    ]}
                  >
                    <Input.Password maxLength={16} />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Row gutter={[20, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item label={t("이메일")} name={"email"} rules={[{ required: true }]}>
                  <Input maxLength={50} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={t("휴대폰번호")} name={"hpNo"} rules={[{ required: true }]}>
                  <Input maxLength={50} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[20, 0]}>
              <Col xs={24} sm={24}>
                <Form.Item label={t("User Roles")} name={"roleList"} rules={[{ required: true }]}>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Please select"
                    options={userGroup}
                    loading={userGroupSpinning}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[20, 0]}>
              <Col xs={24} sm={8}>
                <Form.Item label={t("계정잠김여부")} name={"lockYn"}>
                  <Select
                    options={[
                      { value: "Y", label: t("예") },
                      { value: "N", label: t("아니오") },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={t("locale")} name={"locale"} rules={[{ required: true }]}>
                  <Select
                    options={[
                      { value: "ko", label: "KO" },
                      { value: "en", label: "EN" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={t("사용여부")} name={"useYn"} rules={[{ required: true }]}>
                  <Select options={USE_YN?.options ?? []} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[20, 0]}>
              <Col xs={24} sm={24}>
                <Form.Item label={t("비고")} name={"remark"}>
                  <Input.TextArea rows={4} maxLength={200} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[10, 0]}>
              <Col span={12}>
                <Form.Item label={t("OTP Key")} name={"otpCertKey"}>
                  <Input readOnly />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={" "}>
                  <Button onClick={resetOtp}>{t("OTP재설정")}</Button>
                </Form.Item>
              </Col>
            </Row>
          </FormBox>
        </Form>
      </Body>
    </>
  );
}

const Header = styled(PageLayout.FrameHeader)``;
const Body = styled.div``;
// const FormBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const FormBox = styled(PageLayout.ContentBox)`
  > * {
    max-width: 640px;
  }
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { FormSet };
