import { AXFDGClickParams } from "@axframe/datagrid";
import { ProgramTitle } from "@core/components/common";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { EXAMPLE_ROUTERS } from "@core/router/exampleRouter";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "components/icon";
import { useBtnI18n, useI18n, useLink, useUnmountEffect } from "hooks";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { ListDataGrid } from "./ListDataGrid";

import { use$LIST$Store } from "./use$LIST$Store";

interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const { linkByRoute } = useLink();
  const init = use$LIST$Store((s) => s.init);
  const reset = use$LIST$Store((s) => s.reset);
  const destroy = use$LIST$Store((s) => s.destroy);
  const callListApi = use$LIST$Store((s) => s.callListApi);
  const listRequestValue = use$LIST$Store((s) => s.listRequestValue);
  const setListRequestValue = use$LIST$Store((s) => s.setListRequestValue);
  const listSpinning = use$LIST$Store((s) => s.listSpinning);
  const programFn = use$LIST$Store((s) => s.programFn);
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
      linkByRoute(EXAMPLE_ROUTERS.DETAIL, { id: params.item.id });
    },
    [linkByRoute],
  );

  const params = React.useMemo(
    () =>
      [
        {
          placeholder: t("지역"),
          name: "select1",
          type: SearchParamType.SELECT,
          options: [
            { label: t("중구"), value: "중구" },
            { label: t("동구"), value: "동구" },
            { label: t("서구"), value: "서구" },
            { label: t("남구"), value: "남구" },
            { label: t("북구"), value: "북구" },
            { label: t("수성구"), value: "수성구" },
            { label: t("달서구"), value: "달서구" },
            { label: t("달성군"), value: "달성군" },
          ],
        },
        {
          placeholder: t("상담방법"),
          name: "select2",
          type: SearchParamType.SELECT,
          options: [
            { label: t("유선"), value: "유선" },
            { label: t("내방"), value: "내방" },
            { label: t("방문"), value: "방문" },
            { label: t("이동상담"), value: "이동상담" },
            { label: t("기타"), value: "기타" },
          ],
        },
        {
          placeholder: t("상담일자"),
          name: "timeRange",
          type: SearchParamType.DATE_RANGE,
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
