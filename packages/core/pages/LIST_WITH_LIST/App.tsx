import { AXFDGClickParams } from "@axframe/datagrid";
import { ColResizer, ProgramTitle } from "@axboot/core/components/common";
import { IParam, SearchParams, SearchParamType } from "@axboot/core/components/search";
import { useDidMountEffect } from "@axboot/core/hooks/useDidMountEffect";
import { ExampleItem } from "@axboot/core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "../../../../src/components/icon";
import { useBtnI18n, useI18n, useUnmountEffect } from "../../../../src/hooks";
import React from "react";

import { PageLayout } from "../../../../src/styles/pageStyled";
import { errorHandling } from "../../../../src/utils/errorHandling";
import { ChildListDataGrid } from "./ChildListDataGrid";
import { ListDataGrid } from "./ListDataGrid";
import { use$LIST_WITH_LIST$Store } from "./use$LIST_WITH_LIST$Store";

interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const init = use$LIST_WITH_LIST$Store(s => s.init);
  const reset = use$LIST_WITH_LIST$Store(s => s.reset);
  const destroy = use$LIST_WITH_LIST$Store(s => s.destroy);
  const callListApi = use$LIST_WITH_LIST$Store(s => s.callListApi);
  const callSaveApi = use$LIST_WITH_LIST$Store(s => s.callSaveApi);
  const setFlexGrow = use$LIST_WITH_LIST$Store(s => s.setFlexGrow);
  const listRequestValue = use$LIST_WITH_LIST$Store(s => s.listRequestValue);
  const setRequestValue = use$LIST_WITH_LIST$Store(s => s.setRequestValue);
  const spinning = use$LIST_WITH_LIST$Store(s => s.spinning);
  const setListSelectedRowKey = use$LIST_WITH_LIST$Store(s => s.setListSelectedRowKey);
  const flexGrow = use$LIST_WITH_LIST$Store(s => s.flexGrow);
  const programFn = use$LIST_WITH_LIST$Store(s => s.programFn);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const [searchForm] = Form.useForm();

  const handleReset = React.useCallback(async () => {
    try {
      await reset();
      await callListApi();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi, reset]);

  const handleSearch = React.useCallback(async () => {
    try {
      await callListApi({
        pageNumber: 1,
      });
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi]);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<DtoItem>) => {
      if (params.item.id) setListSelectedRowKey(params.item.id, params.item);
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
      try {
        await init();
        await callListApi();
      } catch (e) {
        await errorHandling(e);
      }
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
          {programFn?.fn01 && <Button onClick={handleSearch}>{btnT("검색")}</Button>}
          {programFn?.fn02 && (
            <Button
              type={"primary"}
              onClick={() => {
                callSaveApi();
              }}
            >
              {btnT("저장")}
            </Button>
          )}
        </ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value, changedValues) => setRequestValue(value, changedValues)}
          onSearch={handleSearch}
          spinning={spinning}
          disableFilter
        />
      </PageSearchBar>

      <Body ref={resizerContainerRef}>
        <Frame style={{ flex: `0 1 ${flexGrow}%` }}>
          <ListDataGrid onClick={onClickItem} />
        </Frame>
        <ColResizer containerRef={resizerContainerRef} onResize={flexGlow => setFlexGrow(flexGlow)} />
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
