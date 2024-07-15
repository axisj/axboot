import { AXFDGClickParams } from "@axframe/datagrid";
import { ColResizer, ProgramTitle } from "@core/components/common";
import { IParam, SearchParams } from "@core/components/search";
import { useAntApp, useUnmountEffect } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "components/icon";
import { useBtnI18n, useI18n } from "hooks";
import * as React from "react";
import { SystemProgram } from "services";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { FormSet } from "./FormSet";
import { ListDataGrid } from "./ListDataGrid";
import { useProgramManagementStore } from "./useProgramManagementStore";

interface DtoItem extends SystemProgram {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();

  const init = useProgramManagementStore((s) => s.init);
  const reset = useProgramManagementStore((s) => s.reset);
  const destroy = useProgramManagementStore((s) => s.destroy);
  const callListApi = useProgramManagementStore((s) => s.callListApi);
  const setFlexGrow = useProgramManagementStore((s) => s.setFlexGrow);
  const listRequestValue = useProgramManagementStore((s) => s.listRequestValue);
  const setListRequestValue = useProgramManagementStore((s) => s.setListRequestValue);
  const listSpinning = useProgramManagementStore((s) => s.listSpinning);
  const setFormActive = useProgramManagementStore((s) => s.setFormActive);
  const cancelFormActive = useProgramManagementStore((s) => s.cancelFormActive);
  const setListSelectedRowKey = useProgramManagementStore((s) => s.setListSelectedRowKey);
  const flexGrow = useProgramManagementStore((s) => s.flexGrow);
  const saveSpinning = useProgramManagementStore((s) => s.saveSpinning);
  const formActive = useProgramManagementStore((s) => s.formActive);
  const listSelectedRowKey = useProgramManagementStore((s) => s.listSelectedRowKey);
  const callSaveApi = useProgramManagementStore((s) => s.callSaveApi);
  const callUserGroupApi = useProgramManagementStore((s) => s.callUserGroupApi);
  const programFn = useProgramManagementStore((s) => s.programFn);

  const resizerContainerRef = React.useRef<HTMLDivElement>(null);
  const [searchForm] = Form.useForm();
  const [form] = Form.useForm();

  const handleSearch = React.useCallback(async () => {
    await callUserGroupApi();
    await callListApi();
    cancelFormActive();
    setFormActive();
  }, [callListApi, callUserGroupApi, cancelFormActive, setFormActive]);

  const handleReset = React.useCallback(async () => {
    await reset();
    await callListApi();
    await callUserGroupApi();
  }, [callListApi, callUserGroupApi, reset]);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<DtoItem>) => {
      setListSelectedRowKey(params.item.progCd, params.item);
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
      await callSaveApi();
      messageApi.info(t("저장되었습니다."));
      // await cancelFormActive();
      // await setFormActive();
      await callListApi();
    } catch (err: any) {
      await errorHandling(err);
    }
  }, [form, callSaveApi, messageApi, t, callListApi]);

  const params = React.useMemo(
    () =>
      [
        // {
        //   title: t.formItem.counseling.area.label,
        //   name: "select1",
        //   type: SearchParamType.SELECT,
        //   options: t.formItem.counseling.area.options,
        // },
      ] as IParam[],
    [],
  );

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
          {programFn?.fn03 && <></>}
          {programFn?.fn04 && <></>}
        </ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value) => setListRequestValue(value)}
          onSearch={handleSearch}
          spinning={listSpinning}
          filterWidth={300}
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
