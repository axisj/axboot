import { Loading } from "@core/components/common";
import { useAntApp } from "@core/hooks";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { useModalStore } from "@core/stores/useModalStore";
import { delay } from "@core/utils";
import styled from "@emotion/styled";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useBtnI18n, useDidMountEffect, useI18n } from "hooks";
import React, { useState } from "react";
import { ModalLayout } from "styles/pageStyled";

interface DtoItem extends ExampleItem {}

interface FormColumn {
  name: keyof DtoItem;
  label: string;
  span?: number;
}

export interface ModalRequest {
  query?: Record<string, any>;
}

export interface ModalResponse {
  save?: boolean;
  delete?: boolean;
}

interface Props {
  open: boolean;
  onOk: (value: ModalResponse) => ModalResponse;
  onCancel: (reason?: any) => void;
  params: ModalRequest;
  afterClose: () => void;
}

const FormItem = Form.Item<DtoItem>;

function FormModal({ open, onOk, onCancel, afterClose, params }: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();

  const [deleteSpinning, setDeleteSpinning] = useState(false);
  const [testSpinning, setTestSpinning] = useState(false);
  const [saveSpinning, setSaveSpinning] = useState(false);
  const [detailSpinning, setDetailSpinning] = useState(false);

  const [form] = Form.useForm();

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

  const handleTest = React.useCallback(async () => {
    setTestSpinning(true);
    messageApi.info("The test has been completed.");
    await delay(1000);
    setTestSpinning(false);
  }, [messageApi]);

  const handleSave = React.useCallback(async () => {
    setSaveSpinning(true);
    await delay(1000);
    onOk({
      save: true,
    });
    setSaveSpinning(false);
  }, [onOk]);

  const handleDelete = React.useCallback(async () => {
    setDeleteSpinning(true);
    await delay(300);
    onOk({
      delete: true,
    });
    setDeleteSpinning(false);
  }, [onOk]);

  useDidMountEffect(() => {
    form.setFieldsValue(params.query);
  });

  return (
    <Modal width={800} {...{ open, onCancel, onOk: onOk as any, afterClose }}>
      <Container>
        <ModalLayout.Header title={`#${params.query?.id}`}>
          <Button size={"small"} onClick={handleTest} loading={testSpinning}>
            TEST
          </Button>
        </ModalLayout.Header>
        <Body>
          <Form form={form} layout={"vertical"}>
            <Row gutter={12}>
              {columns.map((column) => (
                <Col key={column.name} span={column.span}>
                  <FormItem name={column.name} label={column.label}>
                    <Input />
                  </FormItem>
                </Col>
              ))}
            </Row>
          </Form>

          <Loading active={detailSpinning} />
        </Body>
        <Footer>
          <Button type='primary' onClick={handleSave} loading={saveSpinning}>
            {btnT("저장")}
          </Button>
          <Button onClick={handleDelete} loading={deleteSpinning}>
            {btnT("삭제")}
          </Button>
          <Button onClick={onCancel}>{btnT("취소")}</Button>
        </Footer>
      </Container>
    </Modal>
  );
}

const Container = styled(ModalLayout)``;
const Body = styled(ModalLayout.Body)``;
const Footer = styled(ModalLayout.Footer)``;

export async function openFormModal(params: ModalRequest = {}) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<ModalResponse>((open, resolve, reject, onClose, afterClose) => (
    <FormModal open={open} onOk={resolve} onCancel={reject} afterClose={afterClose} params={params} />
  ));
}

export default FormModal;
