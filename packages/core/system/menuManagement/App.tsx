import { ColResizer, ProgramTitle } from "@axboot/core/components/common";
import { confirmDialog } from "@axboot/core/components/dialogs";
import { useAntApp, useUnmountEffect } from "@axboot/core/hooks";
import { useDidMountEffect } from "@axboot/core/hooks/useDidMountEffect";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "../../../../src/components/icon";
import { useBtnI18n, useI18n } from "../../../../src/hooks";
import * as React from "react";
import { useAppStore } from "../../../../src/stores";

import { PageLayout } from "../../../../src/styles/pageStyled";
import { errorHandling } from "../../../../src/utils/errorHandling";
import { FormSet } from "./FormSet";
import { ListDataSet } from "./ListDataSet";
import { useMenuManagementStore } from "./useMenuManagementStore";

interface Props {}

function App({}: Props) {
  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();
  const callAppMenu = useAppStore(s => s.callAppMenu);

  const init = useMenuManagementStore(s => s.init);
  const reset = useMenuManagementStore(s => s.reset);
  const destroy = useMenuManagementStore(s => s.destroy);
  const callListApi = useMenuManagementStore(s => s.callListApi);
  const listSpinning = useMenuManagementStore(s => s.listSpinning);
  const setFlexGrow = useMenuManagementStore(s => s.setFlexGrow);
  const setFormActive = useMenuManagementStore(s => s.setFormActive);
  const saveSpinning = useMenuManagementStore(s => s.saveSpinning);
  const formActive = useMenuManagementStore(s => s.formActive);
  const listSelectedRowKey = useMenuManagementStore(s => s.listSelectedRowKey);
  const callSaveApi = useMenuManagementStore(s => s.callSaveApi);
  const cancelFormActive = useMenuManagementStore(s => s.cancelFormActive);
  const detail = useMenuManagementStore(s => s.detail);
  const callDeleteApi = useMenuManagementStore(s => s.callDeleteApi);
  const deleteSpinning = useMenuManagementStore(s => s.deleteSpinning);
  const flexGrow = useMenuManagementStore(s => s.flexGrow);

  const resizerContainerRef = React.useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();

  const handleReset = React.useCallback(async () => {
    await reset();
    cancelFormActive();
    setFormActive();
    await callListApi();
  }, [reset, cancelFormActive, setFormActive, callListApi]);

  const handleDelete = React.useCallback(async () => {
    if (!detail) return;
    await confirmDialog({ content: t("정말 삭제하시겠습니까?") });
    await callDeleteApi(detail.menuGrpCd);
    await callAppMenu();
  }, [t, detail, callDeleteApi, callAppMenu]);

  const handleSave = React.useCallback(async () => {
    try {
      await form.validateFields();
    } catch (err) {
      const errors = form.getFieldsError();
      if (errors && errors[0] && errors[0].name) {
        form.scrollToField(errors[0].name);
      }
      return;
    }

    try {
      await callSaveApi();
      messageApi.info(t("저장되었습니다."));
      cancelFormActive();
      setFormActive();
      await callListApi();
      await callAppMenu();
    } catch (err: any) {
      await errorHandling(err);
    }
  }, [form, callSaveApi, messageApi, t, cancelFormActive, setFormActive, callListApi, callAppMenu]);

  useDidMountEffect(() => {
    (async () => {
      await init();
      await callListApi();
    })();
  });

  useUnmountEffect(() => {
    destroy();
  });

  return (
    <Container stretch role={"page-container"}>
      <Header>
        <ProgramTitle>
          <Button icon={<IconReset />} onClick={handleReset} size="small" type={"text"}>
            {btnT("초기화")}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact>
          <Button
            onClick={() => {
              callListApi();
              cancelFormActive();
              setFormActive();
            }}
            loading={listSpinning}
          >
            {btnT("검색")}
          </Button>
          <Button
            onClick={() => {
              setFormActive();
            }}
          >
            {btnT("추가")}
          </Button>

          <Button
            type={"primary"}
            onClick={handleDelete}
            loading={deleteSpinning}
            disabled={(!formActive && !listSelectedRowKey) || !detail}
          >
            {btnT("삭제")}
          </Button>
          <Button
            type={"primary"}
            onClick={handleSave}
            loading={saveSpinning}
            disabled={!formActive && !listSelectedRowKey}
          >
            {btnT("저장")}
          </Button>
        </ButtonGroup>
      </Header>

      <Body ref={resizerContainerRef}>
        <Frame style={{ flex: `0 1 ${flexGrow}%` }}>
          <ListDataSet />
        </Frame>
        <ColResizer containerRef={resizerContainerRef} onResize={flexGlow => setFlexGrow(flexGlow)} />
        <Frame style={{ flex: `0 1 ${100 - flexGrow}%` }} scroll>
          <FormSet form={form} />
        </Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)`
  padding-bottom: 16px;
`;
const Body = styled(PageLayout.FrameRow)`
  padding: 0;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Frame = styled(PageLayout.FrameColumn)``;

export default App;
