import { ProgramTitle } from "@axboot/core/components/common";
import { IParam, SearchParams, SearchParamType } from "@axboot/core/components/search";
import { useDidMountEffect } from "@axboot/core/hooks/useDidMountEffect";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "../../../../src/components/icon";
import { useBtnI18n, useI18n, useUnmountEffect } from "../../../../src/hooks";
import React from "react";

import { PageLayout } from "../../../../src/styles/pageStyled";
import { errorHandling } from "../../../../src/utils/errorHandling";
import { ListDataGridA } from "./ListDataGridA";
import { ListDataGridB } from "./ListDataGridB";
import { ListDataGridC } from "./ListDataGridC";
import { use$THREE_LIST$Store } from "./use$THREE_LIST$Store";

interface Props {}

function App({}: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const init = use$THREE_LIST$Store(s => s.init);
  const reset = use$THREE_LIST$Store(s => s.reset);
  const destroy = use$THREE_LIST$Store(s => s.destroy);
  const listRequestValue = use$THREE_LIST$Store(s => s.listRequestValue);
  const setRequestValue = use$THREE_LIST$Store(s => s.setRequestValue);
  const callListApi = use$THREE_LIST$Store(s => s.callListApi);
  const callSaveApi = use$THREE_LIST$Store(s => s.callSaveApi);
  const spinning = use$THREE_LIST$Store(s => s.spinning);
  const programFn = use$THREE_LIST$Store(s => s.programFn);

  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const handleReset = React.useCallback(async () => {
    try {
      await reset();
      await callListApi();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi, reset]);

  const [searchForm] = Form.useForm();

  const handleSearch = React.useCallback(async () => {
    try {
      await callListApi();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi]);

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
          {programFn?.fn01 && (
            <Button
              onClick={() => {
                callListApi();
              }}
            >
              {btnT("검색")}
            </Button>
          )}
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
        <Frame>
          <ListDataGridA />
        </Frame>
        <Frame>
          <ListDataGridB />
        </Frame>
        <Frame>
          <ListDataGridC />
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
