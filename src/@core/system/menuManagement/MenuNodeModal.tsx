import { IconText } from "@core/components/common";
import { useModalStore } from "@core/stores/useModalStore";
import styled from "@emotion/styled";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { MenuIcon, menuIcons, MenuIconType } from "components/MenuIcon";
import { useBtnI18n, useI18n, useSystemProgramService } from "hooks";
import * as React from "react";
import { SystemMenu } from "services";
import { ModalLayout } from "styles/pageStyled";

export interface MenuNodeRequest {
  item?: SystemMenu;
}

export interface PromptDialogResponse {
  save?: boolean;
  delete?: boolean;
  data: Record<string, any>;
}

interface Props {
  open: boolean;
  onOk: (value: PromptDialogResponse) => PromptDialogResponse;
  onCancel: (reason?: any) => void;
  params: MenuNodeRequest;
  afterClose: () => void;
}

function MenuNodeModal({ open, onOk, onCancel, afterClose, params }: Props) {
  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const [form] = Form.useForm();
  const { list: programList, spinning } = useSystemProgramService();

  const handleSubmit = React.useCallback(() => {
    onOk({
      data: form.getFieldsValue(),
    });
  }, [form, onOk]);

  const programOptions = React.useMemo(
    () => programList.map((p) => ({ value: p.progCd, label: `${p.progCd} : ${p.progNm}` })),
    [programList],
  );

  React.useEffect(() => {
    form.setFieldsValue(params.item);
  }, [form, params.item]);

  return (
    <Modal width={500} {...{ open, onCancel, onOk: onOk as any, afterClose }}>
      <Container>
        <ModalLayout.Header title={t("메뉴아이템")}></ModalLayout.Header>
        <Body>
          <Form form={form} layout={"vertical"} onFinish={handleSubmit}>
            <Row gutter={15}>
              <Col xs={24}>
                <Form.Item name={["multiLang", "ko"]} label={t("메뉴명(한글)")} rules={[{ required: true }]}>
                  <Input
                    onBlur={(e) => {
                      if (form.getFieldValue("multiLang")?.en === undefined)
                        form.setFieldsValue({ multiLang: { en: e.target.value } });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={15}>
              <Col xs={24}>
                <Form.Item name={["multiLang", "en"]} label={t("메뉴명(영문)")} rules={[{ required: true }]}>
                  <Input autoFocus />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={15}>
              <Col xs={24}>
                <Form.Item label={t("메뉴아이콘")} name={"iconTy"}>
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
              <Col xs={24}>
                <Form.Item name={"progCd"} label={t("프로그램 코드")}>
                  <Select options={programOptions} loading={spinning} showSearch allowClear />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Body>
        <Footer>
          <Button type='primary' onClick={() => form.submit()}>
            {btnT("저장")}
          </Button>
          <Button onClick={onCancel}>{btnT("취소")}</Button>
        </Footer>
      </Container>
    </Modal>
  );
}

const Container = styled(ModalLayout)``;
const Body = styled(ModalLayout.Body)`
  min-height: 50px;
`;
const Footer = styled(ModalLayout.Footer)``;

export async function openMenuNodeModal(params: MenuNodeRequest) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<PromptDialogResponse>((open, resolve, reject, onClose, afterClose) => (
    <MenuNodeModal open={open} onOk={resolve} onCancel={onClose} afterClose={afterClose} params={params} />
  ));
}

export default MenuNodeModal;
