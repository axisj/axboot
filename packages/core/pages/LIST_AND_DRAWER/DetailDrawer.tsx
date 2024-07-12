import { Loading } from "@axboot/core/components/common";
import { useAntApp } from "@axboot/core/hooks";
import { useDrawerStore } from "@axboot/core/stores/useDrawerStore";
import { delay } from "@axboot/core/utils";
import { Badge, Button, Descriptions, Drawer, Space } from "antd";
import { useBtnI18n, useDidMountEffect, useI18n, useSpinning } from "../../../../src/hooks";
import React from "react";
import { use$LIST_AND_DRAWER$Store } from "./use$LIST_AND_DRAWER$Store";

export interface ExampleDrawerRequest {
  query?: Record<string, any>;
}

export interface ExampleDrawerResponse {
  save?: boolean;
  delete?: boolean;
}

interface Props {
  open: boolean;
  onOk: (value: any) => ExampleDrawerResponse;
  onCancel: (reason?: any) => void;
  params: ExampleDrawerRequest;
  afterOpenChange: (open: boolean) => void;
}

function DetailDrawer({ open, onOk, onCancel, params, afterOpenChange }: Props) {
  const { messageApi } = useAntApp();
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const { spinning, setSpinning, isBusy } = useSpinning<{ test: boolean; save: boolean; delete: boolean }>();

  const callDetailApi = use$LIST_AND_DRAWER$Store(s => s.callDetailApi);
  const detailSpinning = use$LIST_AND_DRAWER$Store(s => s.detailSpinning);
  const detail = use$LIST_AND_DRAWER$Store(s => s.detail);

  const handleTest = React.useCallback(async () => {
    if (isBusy) return;
    setSpinning({ test: true });
    messageApi.info("The test has been completed.");
    await delay(1000);
    setSpinning({ test: false });
  }, [messageApi, setSpinning, isBusy]);

  const handleSave = React.useCallback(async () => {
    if (isBusy) return;
    setSpinning({ save: true });
    await delay(1000);
    onOk({
      save: true,
    });
    setSpinning({ save: false });
  }, [onOk, setSpinning, isBusy]);

  const handleDelete = React.useCallback(async () => {
    if (isBusy) return;
    setSpinning({ delete: true });
    await delay(300);
    onOk({
      delete: true,
    });
    setSpinning({ delete: false });
  }, [onOk, setSpinning, isBusy]);

  useDidMountEffect(() => {
    callDetailApi(params.query);
  });

  return (
    <Drawer
      title={`샘플(상세#${params.query?.id})`}
      width={800}
      open={open}
      styles={{
        body: { paddingBottom: 80 },
      }}
      afterOpenChange={afterOpenChange}
      onClose={onCancel}
      extra={
        <Space>
          <Button onClick={handleTest} loading={spinning?.test}>
            TEST
          </Button>
          <Button type="primary" onClick={handleSave} loading={spinning?.save}>
            {btnT("저장")}
          </Button>
          <Button onClick={handleDelete} loading={spinning?.delete}>
            {btnT("삭제")}
          </Button>
          <Button onClick={onCancel}>{btnT("취소")}</Button>
        </Space>
      }
    >
      TEST {params.query?.id}
      <Descriptions bordered size={"small"}>
        <Descriptions.Item label={t("성명")}>{detail?.name}</Descriptions.Item>
        <Descriptions.Item label={t("생년월일")}>{detail?.birthDt}</Descriptions.Item>
        <Descriptions.Item label={t("성별")}>{detail?.sex}</Descriptions.Item>
        <Descriptions.Item label={t("연락처 1")}>{detail?.phone1}</Descriptions.Item>
        <Descriptions.Item label={t("연락처 2")} span={2}>
          {detail?.phone2}
        </Descriptions.Item>
        <Descriptions.Item label="Status" span={3}>
          <Badge status="processing" text="Running" />
        </Descriptions.Item>
        <Descriptions.Item label={t("장애유무")}>{detail?.hndcapYn}</Descriptions.Item>
        <Descriptions.Item label={t("장애등급")}>{detail?.hndcapGrade}</Descriptions.Item>
        <Descriptions.Item label={t("장애종류")}>{detail?.hndcapTyp}</Descriptions.Item>
      </Descriptions>
      <Loading active={detailSpinning} />
    </Drawer>
  );
}

export async function openDetailDrawer(params: ExampleDrawerRequest = {}) {
  const openDrawer = useDrawerStore.getState().openDrawer;
  return await openDrawer<ExampleDrawerResponse>((open, resolve, reject, onClose, afterOpenChange) => (
    <DetailDrawer open={open} onOk={resolve} onCancel={onClose} afterOpenChange={afterOpenChange} params={params} />
  ));
}

export default DetailDrawer;
