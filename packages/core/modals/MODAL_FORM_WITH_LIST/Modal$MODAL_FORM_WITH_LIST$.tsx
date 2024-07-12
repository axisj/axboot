import { Loading } from "@axboot/core/components/common";
import { useAntApp } from "@axboot/core/hooks";
import { ExampleItem, ExampleSubItem } from "@axboot/core/services/example/ExampleRepositoryInterface";
import { useModalStore } from "@axboot/core/stores/useModalStore";
import styled from "@emotion/styled";
import { Button, Form, Modal } from "antd";
import { useBtnI18n, useI18n } from "../../../../src/hooks";
import React, { useCallback, useEffect, useState } from "react";
import { ModalLayout } from "../../../../src/styles/pageStyled";
import { errorHandling } from "../../../../src/utils";
import { ChildList } from "./ChildList";
import { FormSet } from "./FormSet";
import { use$MODAL_FORM_WITH_LIST$Store } from "./use$MODAL_FORM_WITH_LIST$";

interface DtoItem extends ExampleItem {}

interface DtoChildListForm {
  childList: ExampleSubItem[];
}

export interface $MODAL_FORM_WITH_LIST$ModalRequest {
  query?: DtoItem;
}

export interface $MODAL_FORM_WITH_LIST$ModalResponse {}

interface Props {
  open: boolean;
  onOk: (value: $MODAL_FORM_WITH_LIST$ModalResponse) => $MODAL_FORM_WITH_LIST$ModalResponse;
  onCancel: (reason?: any) => void;
  params: $MODAL_FORM_WITH_LIST$ModalRequest;
  afterClose: () => void;
}

function Modal$MODAL_FORM_WITH_LIST$({ open, onOk, onCancel, afterClose, params }: Props) {
  const { t } = useI18n();
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();

  const [form] = Form.useForm<DtoItem>();
  const [listForm] = Form.useForm<DtoChildListForm>();

  const init = use$MODAL_FORM_WITH_LIST$Store(s => s.init);
  const reset = use$MODAL_FORM_WITH_LIST$Store(s => s.reset);
  const callSaveApi = use$MODAL_FORM_WITH_LIST$Store(s => s.callSaveApi);

  const [spinning, setSpinning] = useState(false);

  const handleSave = useCallback(async () => {
    try {
      await form.validateFields();
    } catch (err) {
      const errors = form.getFieldsError();
      if (errors && errors[0] && errors[0].name) {
        form.scrollToField(errors[0].name);
      }
      return;
    } finally {
      await listForm.validateFields();
    }

    try {
      setSpinning(true);
      await callSaveApi();
      messageApi.info(t("saved"));
      onOk({});
    } catch (err) {
      await errorHandling(err);
    } finally {
      setSpinning(false);
    }
  }, [callSaveApi, form, listForm, messageApi, onOk, t]);

  // 폼 리셋을 원하는 경우에 사용
  useEffect(() => {
    reset();
  }, [form, listForm, reset]);

  // 수정 모달이어서 값을 할당 하고 싶을때 사용
  /*
  useEffect(() => {
    init({
      item: {
        id: 1,
        name: "기본이름",
      },
      childList: [{ code: "AXBoot", name: "액스부트" }],
    });
  }, [form, listForm, init]);
  */

  return (
    <Modal width={800} {...{ open, onCancel, onOk: onOk as any, afterClose }}>
      <Container>
        <ModalLayout.Header title={`$MODAL_FORM_WITH_LIST$`}>
          <Button size={"small"}>TEST</Button>
        </ModalLayout.Header>
        <Body>
          <FormSet form={form} />
          <ChildList form={listForm} />
          <Loading active={spinning} />
        </Body>
        <Footer>
          <Button type="primary" onClick={handleSave} loading={spinning}>
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

export async function open$MODAL_FORM_WITH_LIST$Modal(params: $MODAL_FORM_WITH_LIST$ModalRequest = {}) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<$MODAL_FORM_WITH_LIST$ModalResponse>((open, resolve, reject, onClose, afterClose) => (
    <Modal$MODAL_FORM_WITH_LIST$ open={open} onOk={resolve} onCancel={reject} afterClose={afterClose} params={params} />
  ));
}

/**
 * // use sample
 * const data = await open$MODAL_FORM_WITH_LIST$Modal({
 *   query: { // DtoItem
 *     name: "xx",
 *   },
 * });
 */
