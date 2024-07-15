import { Loading } from "@core/components/common";
import { useAntApp } from "@core/hooks";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { useModalStore } from "@core/stores/useModalStore";
import styled from "@emotion/styled";
import { Button, Modal } from "antd";
import { useBtnI18n, useDidMountEffect, useI18n } from "hooks";
import React, { useCallback, useState } from "react";
import { ModalLayout } from "styles/pageStyled";
import { errorHandling } from "utils";

interface DtoItem extends ExampleItem {}

export interface $EMPTY$ModalRequest {
  query?: DtoItem;
}

export interface $EMPTY$ModalResponse {}

interface Props {
  open: boolean;
  onOk: (value: $EMPTY$ModalResponse) => $EMPTY$ModalResponse;
  onCancel: (reason?: any) => void;
  params: $EMPTY$ModalRequest;
  afterClose: () => void;
}

function Modal$EMPTY$({ open, onOk, onCancel, afterClose, params }: Props) {
  const { t } = useI18n();
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();
  const [spinning, setSpinning] = useState(false);

  const handleSave = useCallback(async () => {
    try {
      setSpinning(true);
      //
      messageApi.info(t("saved"));
      onOk({});
    } catch (err) {
      await errorHandling(err);
    } finally {
      setSpinning(false);
    }
  }, [messageApi, onOk, t]);

  useDidMountEffect(() => {});

  return (
    <Modal width={600} {...{ open, onCancel, onOk: onOk as any, afterClose }}>
      <Container>
        <ModalLayout.Header title={`$EMPTY$`}>
          <Button size={"small"}>TEST</Button>
        </ModalLayout.Header>
        <Body>
          <Loading active={spinning} />
        </Body>
        <Footer>
          <Button type='primary' onClick={handleSave} loading={spinning}>
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

export async function open$EMPTY$Modal(params: $EMPTY$ModalRequest = {}) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<$EMPTY$ModalResponse>((open, resolve, reject, onClose, afterClose) => (
    <Modal$EMPTY$ open={open} onOk={resolve} onCancel={reject} afterClose={afterClose} params={params} />
  ));
}

/**
 * // use sample
 * const data = await open$EMPTY$Modal({
 *   query: { // DtoItem
 *     name: "xx",
 *   },
 * });
 */
