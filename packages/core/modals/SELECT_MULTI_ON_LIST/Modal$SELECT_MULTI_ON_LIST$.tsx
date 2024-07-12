import { AXFDGClickParams } from "@axframe/datagrid";
import { Loading } from "@axboot/core/components/common";
import { useAntApp } from "@axboot/core/hooks";
import {
  ExampleItem,
  ExampleListRequest,
  ExampleSaveRequest,
} from "@axboot/core/services/example/ExampleRepositoryInterface";
import { useModalStore } from "@axboot/core/stores/useModalStore";
import styled from "@emotion/styled";
import { Button, Modal } from "antd";
import { useBtnI18n, useDidMountEffect, useI18n } from "../../../../src/hooks";
import React, { useCallback, useState } from "react";
import { ModalLayout } from "../../../../src/styles/pageStyled";
import { errorHandling } from "../../../../src/utils";
import { CustomError } from "@axboot/core/services/CustomError";
import { ListDataSet } from "./ListDataSet";

interface DtoItem extends ExampleItem {}

interface SaveRequest extends ExampleSaveRequest {}

interface ListRequest extends ExampleListRequest {}

export interface $SELECT_MULTI_ON_LIST$ModalRequest {
  query?: ListRequest;
}

export interface $SELECT_MULTI_ON_LIST$ModalResponse {
  data?: DtoItem[];
}

interface Props {
  open: boolean;
  onOk: (value: $SELECT_MULTI_ON_LIST$ModalResponse) => $SELECT_MULTI_ON_LIST$ModalResponse;
  onCancel: (reason?: any) => void;
  params: $SELECT_MULTI_ON_LIST$ModalRequest;
  afterClose: () => void;
}

function Modal$SELECT_MULTI_ON_LIST$({ open, onOk, onCancel, afterClose, params }: Props) {
  const { t } = useI18n();
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();
  const [spinning, setSpinning] = useState(false);
  const [checkedRowKeys, setCheckedRowKeys] = React.useState<React.Key[]>([]);
  const [checkedRow, setCheckedRow] = useState<DtoItem[]>([]);

  const handleSave = useCallback(async () => {
    try {
      if (checkedRow?.length < 1) {
        throw new CustomError(t("목록을 선택해주세요."));
      }
      console.log(checkedRow);
      messageApi.info(t("콘솔창을 확인하세요."));
      onOk({
        data: checkedRow,
      });
    } catch (err) {
      await errorHandling(err);
    } finally {
      setSpinning(false);
    }
  }, [checkedRow, messageApi, onOk, t]);

  const onClickItem = useCallback(
    async (data: AXFDGClickParams<DtoItem>) => {
      try {
        //
        console.log(data);
        messageApi.info(t("콘솔창을 확인하세요."));
        onOk({
          data: [data.item],
        });
      } catch (err) {
        await errorHandling(err);
      }
    },
    [messageApi, onOk, t],
  );

  useDidMountEffect(() => {});

  return (
    <Modal width={800} {...{ open, onCancel, onOk: onOk as any, afterClose }}>
      <Container>
        <ModalLayout.Header title={`$SELECT_MULTI_ON_LIST$`}>
          <Button size={"small"}>TEST</Button>
        </ModalLayout.Header>
        <Body>
          <ListDataSet
            onClick={onClickItem}
            onChangeCheckedRow={(rows, checkedIndexes, checkedRowKeys) => {
              console.log(rows, checkedIndexes, checkedRowKeys);
              setCheckedRow(rows);
              setCheckedRowKeys(checkedRowKeys);
            }}
            checkedRowKeys={checkedRowKeys}
          />
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

const Container = styled(ModalLayout)``;
const Body = styled(ModalLayout.Body)``;
const Footer = styled(ModalLayout.Footer)``;

export async function open$SELECT_MULTI_ON_LIST$Modal(params: $SELECT_MULTI_ON_LIST$ModalRequest = {}) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<$SELECT_MULTI_ON_LIST$ModalResponse>((open, resolve, reject, onClose, afterClose) => (
    <Modal$SELECT_MULTI_ON_LIST$ open={open} onOk={resolve} onCancel={reject} afterClose={afterClose} params={params} />
  ));
}

/**
 * // use sample
 * const data = await open$SELECT_MULTI_ON_LIST$Modal({
 *   query: { // ListRequest
 *     name: "xx",
 *   },
 * });
 */
