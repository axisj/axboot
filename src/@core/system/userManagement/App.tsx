import { AXFDGClickParams } from "@axframe/datagrid";
import { ColResizer, ProgramTitle } from "@core/components/common";
import { SearchParams } from "@core/components/search";
import { useAntApp, useUnmountEffect } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "components/icon";
import { useBtnI18n, useI18n } from "hooks";
import * as React from "react";
import { SystemUser } from "services";

import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { FormSet } from "./FormSet";
import { ListDataGrid } from "./ListDataGrid";
import { useUserManagementStore } from "./useUserManagementStore";

interface DtoItem extends SystemUser {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();

  const init = useUserManagementStore((s) => s.init);
  const reset = useUserManagementStore((s) => s.reset);
  const destroy = useUserManagementStore((s) => s.destroy);
  const callListApi = useUserManagementStore((s) => s.callListApi);
  const setFlexGrow = useUserManagementStore((s) => s.setFlexGrow);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);
  const listRequestValue = useUserManagementStore((s) => s.listRequestValue);
  const setListRequestValue = useUserManagementStore((s) => s.setListRequestValue);
  const listSpinning = useUserManagementStore((s) => s.listSpinning);
  const setListSelectedRowKey = useUserManagementStore((s) => s.setListSelectedRowKey);
  const flexGrow = useUserManagementStore((s) => s.flexGrow);
  const cancelFormActive = useUserManagementStore((s) => s.cancelFormActive);
  const setFormActive = useUserManagementStore((s) => s.setFormActive);
  const saveSpinning = useUserManagementStore((s) => s.saveSpinning);
  const formActive = useUserManagementStore((s) => s.formActive);
  const listSelectedRowKey = useUserManagementStore((s) => s.listSelectedRowKey);
  const callSaveApi = useUserManagementStore((s) => s.callSaveApi);
  const callUserGroupApi = useUserManagementStore((s) => s.callUserGroupApi);
  const programFn = useUserManagementStore((s) => s.programFn);

  const [searchForm] = Form.useForm();
  const [form] = Form.useForm();

  const handleReset = React.useCallback(async () => {
    await reset();
    await callListApi();
  }, [callListApi, reset]);

  const handleSearch = React.useCallback(async () => {
    await callListApi();
    cancelFormActive();
    setFormActive();
  }, [callListApi, cancelFormActive, setFormActive]);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<DtoItem>) => {
      setListSelectedRowKey(params.item.userCd, params.item);
    },
    [setListSelectedRowKey],
  );

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
      await callSaveApi(form.getFieldsValue());
      messageApi.info(t("저장되었습니다."));
      // await cancelFormActive();
      // await setFormActive();
      await callListApi();
    } catch (err) {
      await errorHandling(err);
    }
  }, [form, callSaveApi, messageApi, t, callListApi]);

  useDidMountEffect(() => {
    (async () => {
      await init();
      await callListApi();
      await callUserGroupApi();
    })();
  });

  useUnmountEffect(() => {
    destroy();
  });

  return (
    <Container stretch role={"page-container"}>
      <Header>
        <ProgramTitle>
          <Button icon={<IconReset />} onClick={handleReset} size='small' type={"text"}>
            {btnT("초기화")}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact>
          {programFn?.fn01 && (
            <Button onClick={handleSearch} loading={listSpinning}>
              {btnT("검색")}
            </Button>
          )}
          {programFn?.fn05 && (
            <Button
              onClick={() => {
                cancelFormActive();
                setFormActive();
              }}
            >
              {btnT("추가")}
            </Button>
          )}
          {programFn?.fn02 && (
            <Button
              type={"primary"}
              onClick={handleSave}
              loading={saveSpinning}
              disabled={!formActive && !listSelectedRowKey}
            >
              {btnT("저장")}
            </Button>
          )}
          {programFn?.fn03 && <></>}
          {programFn?.fn04 && <></>}
        </ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          filterWidth={300}
          form={searchForm}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value) => setListRequestValue(value)}
          onSearch={handleSearch}
          spinning={listSpinning}
          extraButtons={() => <></>}
        />
      </PageSearchBar>

      <Body ref={resizerContainerRef}>
        <Frame style={{ flex: `0 1 ${flexGrow}%` }}>
          <ListDataGrid onClick={onClickItem} />
        </Frame>
        <ColResizer containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
        <Frame style={{ flex: `0 1 ${100 - flexGrow}%` }} scroll>
          <FormSet form={form} />
        </Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const Body = styled(PageLayout.FrameRow)`
  padding: 0;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Frame = styled(PageLayout.FrameColumn)``;

export default App;
