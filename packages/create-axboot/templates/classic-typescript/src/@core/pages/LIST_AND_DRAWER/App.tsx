import { AXFDGClickParams } from "@axframe/datagrid";
import { ProgramTitle } from "@core/components/common";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { useAntApp } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "components/icon";
import { useBtnI18n, useI18n, useUnmountEffect } from "hooks";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { openDetailDrawer } from "./DetailDrawer";
import { ListDataGrid } from "./ListDataGrid";
import { use$LIST_AND_DRAWER$Store } from "./use$LIST_AND_DRAWER$Store";

interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const { messageApi } = useAntApp();
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const init = use$LIST_AND_DRAWER$Store((s) => s.init);
  const reset = use$LIST_AND_DRAWER$Store((s) => s.reset);
  const destroy = use$LIST_AND_DRAWER$Store((s) => s.destroy);
  const callListApi = use$LIST_AND_DRAWER$Store((s) => s.callListApi);
  const listRequestValue = use$LIST_AND_DRAWER$Store((s) => s.listRequestValue);
  const setListRequestValue = use$LIST_AND_DRAWER$Store((s) => s.setListRequestValue);
  const listSpinning = use$LIST_AND_DRAWER$Store((s) => s.listSpinning);
  const programFn = use$LIST_AND_DRAWER$Store((s) => s.programFn);
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
    async (params: AXFDGClickParams<DtoItem>) => {
      try {
        const data = await openDetailDrawer({ query: params.item });
        messageApi.info(JSON.stringify(data ?? {}));
      } catch (err) {
        await errorHandling(err);
      }
    },
    [messageApi],
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
          <Button icon={<IconReset />} onClick={handleReset} size='small' type={"text"}>
            {btnT("초기화")}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact>{programFn?.fn01 && <Button onClick={handleSearch}>{btnT("검색")}</Button>}</ButtonGroup>
      </Header>

      <PageSearchBar>
        <SearchParams
          form={searchForm}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value, changedValues) => setListRequestValue(value, changedValues)}
          onSearch={handleSearch}
          spinning={listSpinning}
          disableFilter
        />
      </PageSearchBar>

      <Body ref={resizerContainerRef}>
        <Frame>
          <ListDataGrid onClick={onClickItem} />
        </Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Body = styled(PageLayout.FrameRow)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Frame = styled(PageLayout.FrameColumn)``;

export default App;
