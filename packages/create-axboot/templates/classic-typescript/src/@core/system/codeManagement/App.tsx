import { AXFDGClickParams } from "@axframe/datagrid";
import { ColResizer, ProgramTitle } from "@core/components/common";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { useAntApp, useUnmountEffect } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "components/icon";
import { useBtnI18n, useI18n } from "hooks";
import * as React from "react";
import { SystemCommonCode } from "services";

import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { ChildListDataGrid } from "./ChildListDataGrid";
import { ListDataGrid } from "./ListDataGrid";
import { useCodeManagementStore } from "./useCodeManagementStore";

interface DtoItem extends SystemCommonCode {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n();
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();

  const init = useCodeManagementStore((s) => s.init);
  const reset = useCodeManagementStore((s) => s.reset);
  const destroy = useCodeManagementStore((s) => s.destroy);
  const callListApi = useCodeManagementStore((s) => s.callListApi);
  const callSaveApi = useCodeManagementStore((s) => s.callSaveApi);
  const setFlexGrow = useCodeManagementStore((s) => s.setFlexGrow);
  const requestValue = useCodeManagementStore((s) => s.requestValue);
  const setRequestValue = useCodeManagementStore((s) => s.setRequestValue);
  const spinning = useCodeManagementStore((s) => s.spinning);
  const setListSelectedRowKey = useCodeManagementStore((s) => s.setListSelectedRowKey);
  const flexGrow = useCodeManagementStore((s) => s.flexGrow);
  const programFn = useCodeManagementStore((s) => s.programFn);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const [searchForm] = Form.useForm();

  const handleReset = React.useCallback(async () => {
    await reset();
    await callListApi();
  }, [callListApi, reset]);

  const handleSearch = React.useCallback(async () => {
    await callListApi();
  }, [callListApi]);

  const handleSave = React.useCallback(async () => {
    try {
      await callSaveApi();
      messageApi.info(t("저장되었습니다."));
    } catch (err: any) {
      await errorHandling(err);
    }
  }, [callSaveApi, messageApi, t]);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<DtoItem>) => {
      setListSelectedRowKey(params.item.grpCd ?? "", params.item.grpCdNm ?? "");
    },
    [setListSelectedRowKey],
  );

  const params = React.useMemo(
    () =>
      [
        {
          placeholder: t("검색어"),
          name: "filter",
          type: SearchParamType.INPUT,
        },
      ] as IParam[],
    [t],
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
            <Button onClick={handleSearch} loading={spinning}>
              {btnT("조회")}
            </Button>
          )}
          {programFn?.fn02 && (
            <Button type={"primary"} onClick={handleSave}>
              {btnT("저장")}
            </Button>
          )}
        </ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={requestValue}
          onChangeParamsValue={(value) => setRequestValue(value)}
          onSearch={handleSearch}
          spinning={spinning}
          disableFilter
        />
      </PageSearchBar>

      <Body ref={resizerContainerRef}>
        <Frame style={{ flex: `0 1 ${flexGrow}%` }}>
          <ListDataGrid onClick={onClickItem} />
        </Frame>
        <ColResizer containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
        <Frame style={{ flex: `0 1 ${100 - flexGrow}%` }}>
          <ChildListDataGrid />
        </Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const Body = styled(PageLayout.FrameRow)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Frame = styled(PageLayout.FrameColumn)``;

export default App;
