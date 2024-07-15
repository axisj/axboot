import { useModalStore } from "@core/stores/useModalStore";
import styled from "@emotion/styled";
import { Alert, Button, Form, Input, Modal } from "antd";
import * as React from "react";
import { ModalLayout } from "styles/pageStyled";
import { Loading } from "../common";
import { errorDialog } from "../dialogs";
import { useBtnI18n, useI18n } from "../../../hooks";
import { UserService } from "../../../services";

export interface ChangePasswordModalRequest {
  reqChangePw?: boolean;
}

export interface ChangePasswordModalResponse {}

interface Props {
  open: boolean;
  onOk: (value: ChangePasswordModalResponse) => ChangePasswordModalResponse;
  onCancel: (reason?: any) => void;
  params: ChangePasswordModalRequest;
  afterClose: () => void;
}

function ChangePasswordModal({ open, onOk, onCancel, afterClose, params }: Props) {
  const { t } = useI18n();
  const btnT = useBtnI18n();
  const [form] = Form.useForm();
  const [spinning, setSpinning] = React.useState(false);

  const handleOk = React.useCallback(async () => {
    try {
      await form.validateFields();
    } catch (err) {
      return;
    }

    try {
      setSpinning(true);
      await UserService.putChangePw({
        userOldPs: form.getFieldValue("userOldPs"),
        userNewPs: form.getFieldValue("userPs"),
        __status__: "U",
      });
    } catch (e) {
      await errorDialog(e as any);
      return;
    } finally {
      setSpinning(false);
    }
    onOk({});
  }, [form, onOk]);

  return (
    <Modal width={400} {...{ open, onCancel, onOk: onOk as any, afterClose }}>
      <Container>
        <ModalLayout.Header title={t("비밀번호 변경")}></ModalLayout.Header>
        <Body>
          {params.reqChangePw && (
            <Alert description='비밀번호가 초기화 된 상태 입니다. 비밀번호를 변경해주세요.' type='warning' />
          )}

          <Form form={form} colon={false} layout={"vertical"}>
            <Form.Item required={true} label={t("기존 비밀번호")} name={"userOldPs"} rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item
              required={true}
              label={t("새 비밀번호")}
              name={"userPs"}
              rules={[
                { required: true },
                {
                  pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+|~\-={}[\]:";'<>?,./\\]).{8,16}$/,
                  message: "8~16자 영문+숫자+특수문자를 조합하여 사용하세요.",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              required={true}
              label={t("새 비밀번호 확인")}
              name={"userPsConfirm"}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue("userPs") !== value) {
                      return Promise.reject(t("비밀번호가 일치하지 않습니다."));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Body>
        <Footer>
          <Button onClick={onCancel}>{btnT("취소")}</Button>
          <Button type='primary' onClick={handleOk} loading={spinning}>
            {btnT("확인")}
          </Button>
        </Footer>

        <Loading active={spinning} />
      </Container>
    </Modal>
  );
}

const Container = styled(ModalLayout)``;
const Body = styled(ModalLayout.Body)`
  min-height: 100px;

  .ant-alert-with-description {
    padding-block: 5px;
    margin-bottom: 20px;
  }
`;
const Footer = styled(ModalLayout.Footer)``;

export async function openChangePasswordModal(params: ChangePasswordModalRequest) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<ChangePasswordModalResponse>((open, resolve, reject, onClose, afterClose) => (
    <ChangePasswordModal open={open} onOk={resolve} onCancel={onClose} afterClose={afterClose} params={params} />
  ));
}
