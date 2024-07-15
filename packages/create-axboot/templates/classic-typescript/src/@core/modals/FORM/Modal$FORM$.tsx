import { Loading } from "@core/components/common";
import { useAntApp } from "@core/hooks";
import { CustomError } from "@core/services/CustomError";
import { ExampleItem, ExampleSaveRequest } from "@core/services/example/ExampleRepositoryInterface";
import { useModalStore } from "@core/stores/useModalStore";
import { convertDateToString } from "@core/utils/object";
import styled from "@emotion/styled";
import { Button, Col, DatePicker, Form, Input, Modal, Row } from "antd";
import { useBtnI18n, useDidMountEffect, useI18n } from "hooks";
import React, { useCallback, useState } from "react";
import { ExampleService } from "services";
import { ModalLayout } from "styles/pageStyled";
import { errorHandling } from "utils";

interface DtoItem extends ExampleItem {}

interface SaveRequest extends ExampleSaveRequest {}

export interface $FORM$ModalRequest {
  query?: DtoItem;
}

export interface $FORM$ModalResponse {}

interface Props {
  open: boolean;
  onOk: (value: $FORM$ModalResponse) => $FORM$ModalResponse;
  onCancel: (reason?: any) => void;
  params: $FORM$ModalRequest;
  afterClose: () => void;
}

const FormItem = Form.Item<DtoItem>;

function Modal$FORM$({ open, onOk, onCancel, afterClose, params }: Props) {
  const { t } = useI18n();
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();
  const [spinning, setSpinning] = useState(false);

  const [form] = Form.useForm<DtoItem>();

  const handleSave = useCallback(async () => {
    try {
      setSpinning(true);

      const formValues = form.getFieldsValue();

      if (!formValues.name) {
        throw new CustomError(t("이름을 입력해주세요"));
      }

      const apiParams: SaveRequest = {
        ...formValues,
      };
      await ExampleService.save(convertDateToString(apiParams));
      //
      messageApi.info(t("saved"));

      onOk({});
    } catch (err) {
      await errorHandling(err);
    } finally {
      setSpinning(false);
    }
  }, [form, messageApi, onOk, t]);

  useDidMountEffect(() => {
    form.setFieldsValue(params.query ?? {});
  });

  return (
    <Modal width={600} {...{ open, onCancel, onOk: onOk as any, afterClose }}>
      <Container>
        <ModalLayout.Header title={`$FORM$`}>
          <Button size={"small"}>TEST</Button>
        </ModalLayout.Header>
        <Body>
          <Form form={form} layout={"vertical"} onFinish={handleSave}>
            <Row gutter={12}>
              <Col span={24}>
                <FormItem name={"id"} label={t("id")} rules={[{ required: true }]}>
                  <Input />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem name={"name"} label={t("name")}>
                  <Input />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem name={"birthDt"} label={t("birthDt")}>
                  <DatePicker />
                </FormItem>
              </Col>
            </Row>
          </Form>

          <Loading active={spinning} />
        </Body>
        <Footer>
          <Button type='primary' onClick={form.submit} loading={spinning}>
            {btnT("저장")}
          </Button>
          <Button onClick={onCancel}>{btnT("취소")}</Button>
        </Footer>
      </Container>
    </Modal>
  );
}

export const Container = styled(ModalLayout)``;
export const Body = styled(ModalLayout.Body)``;
export const Footer = styled(ModalLayout.Footer)``;

export async function open$FORM$Modal(params: $FORM$ModalRequest = {}) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<$FORM$ModalResponse>((open, resolve, reject, onClose, afterClose) => (
    <Modal$FORM$ open={open} onOk={resolve} onCancel={reject} afterClose={afterClose} params={params} />
  ));
}

/**
 * // use sample
 * const data = await open$FORM$Modal({
 *   query: { // DtoItem
 *     name: "xx",
 *   },
 * });
 */
