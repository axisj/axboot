import { IdcardOutlined, LockOutlined } from "@ant-design/icons";
import { IconAXBootOpened } from "@core/components/axboot";
import { SMixinFlexColumn, SMixinFlexRow } from "@core/styles/emotion";
import { getTrimNonEmptyRegExp } from "@core/utils";
import styled from "@emotion/styled";
import { Button, Checkbox, Divider, Form, Input, Space, Switch } from "antd";
import { LangSelector } from "components/LangSelector";
import dayjs from "dayjs";
import { useBtnI18n, useDidMountEffect, useI18n, useSpinning } from "hooks";
import React from "react";
import { UserService } from "services";
import { useAppStore, useUserStore } from "stores";
import { errorHandling } from "utils";
import { IconArrowLogIn, IconMoon, IconSun } from "../../components/icon";
import { mediaMin } from "../../styles/mediaQueries";
import { Visual } from "./Visual";

interface Props {
  onSignIn?: (values: SignInFormItem) => Promise<void>;
}

export interface SignInFormItem {
  userId?: string;
  password?: string;
  remember?: boolean;
  otpNum?: string;
}

function App({}: Props) {
  const { t } = useI18n("login");
  const btnT = useBtnI18n();
  const setMe = useUserStore((s) => s.setMe);

  const { spinning, setSpinning } = useSpinning<{ signIn: boolean }>();
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const [isApiTest, setIsApiTest] = React.useState(false);

  const [form] = Form.useForm<SignInFormItem>();

  const handleChangeTheme = React.useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const onSignIn = React.useCallback(
    async (values: SignInFormItem) => {
      setSpinning({ signIn: true });
      try {
        if (values.remember && values.userId) {
          localStorage.setItem("remember", values.userId);
        } else {
          localStorage.removeItem("remember");
        }

        const { rs } = await UserService.signIn({
          userCd: values.userId,
          userPs: values.password,
          otpNum: values.otpNum,
        });

        await setMe(rs);
      } catch (err) {
        await errorHandling(err);
      } finally {
        setSpinning({ signIn: false });
      }
    },
    [setMe, setSpinning],
  );

  React.useEffect(() => {
    const remember = localStorage.getItem("remember");

    if (remember) {
      form.setFieldsValue({
        userId: remember,
        remember: true,
      });
      form.getFieldInstance("password").focus();
    } else {
      form.getFieldInstance("userId").focus();
    }

    const isTest = localStorage.getItem("isApiTest");
    setIsApiTest(isTest === "T");
  }, [form]);

  useDidMountEffect(() => {
    // set default value for development
    if (import.meta.env.MODE !== "production") {
      form.setFieldsValue({ userId: "system", password: "a123456!@", otpNum: dayjs().format("YYMMDD") });
    }
  });

  return (
    <Div>
      <SignInContainer>
        <SignInBox>
          <div className={"brand-logo"}>
            <IconAXBootOpened />
          </div>
          <div className={"box-body"}>
            <Form<SignInFormItem> form={form} onFinish={onSignIn} layout={"vertical"}>
              <Form.Item
                label={t("로그인아이디")}
                name='userId'
                rules={[
                  {
                    required: true,
                    pattern: getTrimNonEmptyRegExp(),
                  },
                ]}
              >
                <Input prefix={<IdcardOutlined />} allowClear />
              </Form.Item>

              <Form.Item
                label={t("비밀번호")}
                name='password'
                rules={[
                  {
                    required: true,
                    pattern: getTrimNonEmptyRegExp(),
                  },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} allowClear />
              </Form.Item>

              <Form.Item
                label={t("OTP")}
                name='otpNum'
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.OTP formatter={(str) => str.toUpperCase()} length={6} />
              </Form.Item>

              <Divider />

              <Form.Item>
                <Button type='primary' htmlType='submit' role={"sign-in-btn"} block loading={spinning?.signIn}>
                  <IconArrowLogIn size={20} />
                  {btnT("로그인")}
                </Button>
              </Form.Item>

              <Form.Item>
                <Form.Item name='remember' valuePropName='checked' noStyle>
                  <Checkbox>{t("아이디 저장")}</Checkbox>
                </Form.Item>

                <a className='reset-password'>{t("비밀번호 초기화")}</a>
              </Form.Item>
            </Form>
          </div>
          <div className={"box-footer"}>
            <Space size={10}>
              <LangSelector />
              <Button
                size={"small"}
                type={"text"}
                icon={theme === "light" ? <IconMoon size={20} /> : <IconSun size={20} />}
                onClick={handleChangeTheme}
                role={"theme-selector"}
              />
            </Space>
            {import.meta.env.MODE !== "production" && (
              <div>
                {t("API TEST")} &nbsp;
                <Switch
                  checked={isApiTest}
                  onChange={(checked) => {
                    localStorage.setItem("isApiTest", checked ? "T" : "F");
                    window.location.reload();
                  }}
                />
              </div>
            )}
          </div>
        </SignInBox>
      </SignInContainer>
      <Visual />
    </Div>
  );
}

const Div = styled.div`
  ${SMixinFlexRow("stretch", "stretch")};

  margin: auto;
  width: calc(100% - 48px);

  ${mediaMin.md} {
    background: ${(p) => p.theme.component_background};
    width: 760px;
    border-radius: 36px;
    background: ${(p) => p.theme.component_background};
    border: 1px solid ${(p) => p.theme.border_color_base};
    box-shadow: 0 0 64px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(8px);
  }

  &:hover {
    .visual {
      transform: translate(48px);
    }
  }
`;

const SignInContainer = styled.div`
  ${SMixinFlexColumn("center", "center")};
  flex: 1;

  padding: 24px 10px;
  ${mediaMin.md} {
    padding: 24px 0 24px 24px;
  }
`;

const SignInBox = styled.div`
  backdrop-filter: blur(8px);
  ${SMixinFlexColumn("stretch", "stretch")};
  width: 100%;
  max-width: 360px;

  .brand-logo {
    width: 100%;
    margin-top: 20px;
    ${SMixinFlexColumn("center", "center")};
    color: ${(p) => p.theme.text_display_color};
  }

  .box-body {
    padding: 16px 24px;
    flex: 1;
  }

  .ant-form-vertical {
    .ant-form-item-label {
      padding-bottom: 5px;
      > label {
        font-weight: 700;
      }
    }
  }
  .ant-form-item {
    margin-bottom: 18px;
  }

  .reset-password {
    float: right;
  }
  .ant-input-affix-wrapper {
    box-sizing: border-box;
    border-radius: 5px;
    padding: 4px 10px;

    .ant-input-prefix {
      margin-right: 6px;
    }

    .ant-input {
      font-weight: 400;
      line-height: 30px;
      padding-left: 8px;
    }

    .ant-input-suffix {
      .ant-input-password-icon {
        margin-left: 4px;
      }
    }
  }
  [role="sign-in-btn"] {
    height: 40px;
    ${SMixinFlexRow("center", "center")};
    column-gap: 5px;
  }

  .box-footer {
    ${SMixinFlexRow("space-between", "center")};
    padding: 0 24px;
    color: ${(p) => p.theme.text_body_color};
  }
`;

export default App;
