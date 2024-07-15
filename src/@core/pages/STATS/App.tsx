import { ProgramTitle } from "@core/components/common";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import styled from "@emotion/styled";
import { Button, Form, Tabs } from "antd";
import { IconReset } from "components/icon";
import { useBtnI18n, useI18n, useUnmountEffect } from "hooks";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { PanelIndex } from "./PanelIndex";
import { PanelType, use$STATS$Store } from "./use$STATS$Store";

interface Props {}

function App({}: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const init = use$STATS$Store((s) => s.init);
  const reset = use$STATS$Store((s) => s.reset);
  const destroy = use$STATS$Store((s) => s.destroy);
  const callListApi = use$STATS$Store((s) => s.callListApi);
  const listRequestValue = use$STATS$Store((s) => s.listRequestValue);
  const setRequestValue = use$STATS$Store((s) => s.setRequestValue);
  const spinning = use$STATS$Store((s) => s.spinning);
  const activeTabKey = use$STATS$Store((s) => s.activeTabKey);
  const setActiveTabKey = use$STATS$Store((s) => s.setActiveTabKey);
  const programFn = use$STATS$Store((s) => s.programFn);

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
          <Button icon={<IconReset />} onClick={handleReset} size='small' type={"text"}>
            {btnT("초기화")}
          </Button>
        </ProgramTitle>

        <ButtonGroup compact>{programFn?.fn01 && <Button onClick={handleSearch}>{t("검색")}</Button>}</ButtonGroup>
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

      <PageTabBar>
        <Tabs
          items={[
            {
              key: "pg1",
              label: t("통계1"),
            },
            {
              key: "pg2",
              label: t("통계2"),
            },
          ]}
          onChange={(key) => setActiveTabKey(key as PanelType)}
          activeKey={activeTabKey}
        />
      </PageTabBar>

      <PanelIndex contentType={activeTabKey} />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const PageTabBar = styled(PageLayout.PageTabBar)`
  border-top: 1px solid ${(p) => p.theme.border_color_base};
`;

export default App;
