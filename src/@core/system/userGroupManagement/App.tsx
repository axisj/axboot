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
import { SystemUserGroup } from "services";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { FormSet } from "./FormSet";
import { ListDataGrid } from "./ListDataGrid";
import { useUserGroupManagementStore } from "./useUserGroupManagementStore";

interface DtoItem extends SystemUserGroup {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();

  const init = useUserGroupManagementStore((s) => s.init);
  const reset = useUserGroupManagementStore((s) => s.reset);
  const destroy = useUserGroupManagementStore((s) => s.destroy);
  const callListApi = useUserGroupManagementStore((s) => s.callListApi);
  const setFlexGrow = useUserGroupManagementStore((s) => s.setFlexGrow);
  const listRequestValue = useUserGroupManagementStore((s) => s.listRequestValue);
  const setListRequestValue = useUserGroupManagementStore((s) => s.setListRequestValue);
  const listSpinning = useUserGroupManagementStore((s) => s.listSpinning);
  const cancelFormActive = useUserGroupManagementStore((s) => s.cancelFormActive);
  const setFormActive = useUserGroupManagementStore((s) => s.setFormActive);
  const setListSelectedRowKey = useUserGroupManagementStore((s) => s.setListSelectedRowKey);
  const flexGrow = useUserGroupManagementStore((s) => s.flexGrow);
  const saveSpinning = useUserGroupManagementStore((s) => s.saveSpinning);
  const formActive = useUserGroupManagementStore((s) => s.formActive);
  const listSelectedRowKey = useUserGroupManagementStore((s) => s.listSelectedRowKey);
  const callSaveApi = useUserGroupManagementStore((s) => s.callSaveApi);
  const programFn = useUserGroupManagementStore((s) => s.programFn);

  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const [searchForm] = Form.useForm();
  const [form] = Form.useForm();

  const handleSearch = React.useCallback(async () => {
    await callListApi();
    cancelFormActive();
    setFormActive();
  }, [callListApi, cancelFormActive, setFormActive]);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<DtoItem>) => {
      setListSelectedRowKey(params.item.code, params.item);
    },
    [setListSelectedRowKey],
  );

  const handleReset = React.useCallback(async () => {
    await reset();
    await callListApi();
  }, [callListApi, reset]);

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
      await cancelFormActive();
      await setFormActive();
      await callListApi();
    } catch (err: any) {
      await errorHandling(err);
    }
  }, [form, callSaveApi, messageApi, t, cancelFormActive, setFormActive, callListApi]);

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
          {programFn?.fn03 && null}
          {programFn?.fn04 && null}
        </ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          form={searchForm}
          filterWidth={300}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value) => setListRequestValue(value)}
          onSearch={handleSearch}
          spinning={listSpinning}
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
