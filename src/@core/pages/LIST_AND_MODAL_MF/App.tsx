import { AXFDGClickParams } from "@axframe/datagrid";
import { ProgramTitle } from "@core/components/common";
import { FilterType, IFilterOption, MultiFilter } from "@core/components/multiFilter";
import { useAntApp } from "@core/hooks";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "components/icon";
import { useBtnI18n, useI18n, useUnmountEffect } from "hooks";
import React from "react";
import { useCodeStore } from "stores";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils/errorHandling";
import { openFormModal } from "./FormModal";
import { ListDataGrid } from "./ListDataGrid";
import { use$LIST_AND_MODAL_MF$Store } from "./use$LIST_AND_MODAL_MF$Store";

interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();

  const init = use$LIST_AND_MODAL_MF$Store((s) => s.init);
  const reset = use$LIST_AND_MODAL_MF$Store((s) => s.reset);
  const destroy = use$LIST_AND_MODAL_MF$Store((s) => s.destroy);
  const callListApi = use$LIST_AND_MODAL_MF$Store((s) => s.callListApi);
  const filters = use$LIST_AND_MODAL_MF$Store((s) => s.filters);
  const setFilters = use$LIST_AND_MODAL_MF$Store((s) => s.setFilters);
  const programFn = use$LIST_AND_MODAL_MF$Store((s) => s.programFn);
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const USE_YN = useCodeStore((s) => s.USE_YN);

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
        const data = await openFormModal({
          query: params.item,
        });

        messageApi.info(JSON.stringify(data ?? {}));
      } catch (err) {
        await errorHandling(err);
      }
    },
    [messageApi],
  );

  const filterOptions = React.useMemo(() => {
    return [
      { name: "cust", label: t("고객명/전화번호/사업자번호/주소/비고"), type: FilterType.STRING },
      { name: "area", label: t("주소"), type: FilterType.ENUM, options: USE_YN?.options },
    ] as IFilterOption[];
  }, [t]);

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
        <MultiFilter filterOptions={filterOptions} filters={filters} onChange={setFilters} />
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