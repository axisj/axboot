import { AXFDGClickParams } from "@axframe/datagrid";

import { useSpinning } from "@core/hooks";
import { useModalStore } from "@core/stores/useModalStore";
import styled from "@emotion/styled";
import { Button, Modal } from "antd";
import { useBtnI18n, useI18n } from "hooks";
import * as React from "react";
import { SystemUser, SystemUserGroupMemberMnpl } from "services";
import { ModalLayout } from "styles/pageStyled";
import { ListDataSet as MemberListDataSet } from "./MemberListDataSet";

export interface ModalRequest {
  query?: React.Key;
}

export interface ModalResponse {
  save?: boolean;
  saveParams?: SystemUserGroupMemberMnpl;
  delete?: boolean;
}

interface Props {
  open: boolean;
  onOk: (value: any) => ModalResponse;
  onCancel: (reason?: any) => void;
  params: ModalRequest;
  afterClose: () => void;
}

function DetailModal({ open, onOk, onCancel, afterClose, params }: Props) {
  const { t } = useI18n();
  const btnT = useBtnI18n();
  const { spinning, setSpinning, isBusy } = useSpinning<{ test: boolean; save: boolean; delete: boolean }>();
  const [checkedRowKeys, setCheckedRowKeys] = React.useState<React.Key[]>([]);

  const onClickItem = React.useCallback((params: AXFDGClickParams<SystemUser>) => {
    console.log(params);
    // setListSelectedRowKey(params.item.code);
  }, []);

  const handleSave = React.useCallback(async () => {
    if (isBusy) return;
    setSpinning({ save: true });

    const apiParam = {
      userCds: checkedRowKeys.map((k) => k.toString()),
      userRole: params.query,
      __status__: "U",
    };
    onOk({
      saveParams: apiParam,
    });

    setSpinning({ save: false });
  }, [checkedRowKeys, isBusy, onOk, params.query, setSpinning]);

  return (
    <Modal width={800} {...{ open, onCancel, onOk, afterClose }}>
      <Container>
        <ModalLayout.Header title={`사용자 추가-(그룹코드#${params.query})`}></ModalLayout.Header>
        <Body>
          <MemberListDataSet
            onClick={onClickItem}
            onChangeCheckedRowKeys={(rowKeys) => setCheckedRowKeys(rowKeys)}
            checkedRowKeys={checkedRowKeys}
          />
        </Body>
        <Footer>
          <Button type='primary' onClick={handleSave} loading={spinning?.save}>
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

export async function openMemberModal(params: ModalRequest = {}) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<ModalResponse>((open, resolve, reject, onClose, afterClose) => (
    <DetailModal open={open} onOk={resolve} onCancel={onClose} afterClose={afterClose} params={params} />
  ));
}

export default DetailModal;
