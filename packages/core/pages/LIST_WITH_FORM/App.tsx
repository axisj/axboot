import { AXFDGClickParams } from "@axframe/datagrid";
import { ColResizer, ProgramTitle } from "@axboot/core/components/common";
import { IParam, SearchParams, SearchParamType } from "@axboot/core/components/search";
import { ExampleItem } from "@axboot/core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "../../../../src/components/icon";
import { useBtnI18n, useDidMountEffect, useI18n, useUnmountEffect } from "../../../../src/hooks";
import React, { useCallback } from "react";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { errorHandling, formErrorHandling } from "../../../../src/utils/errorHandling";
import { FormSet } from "./FormSet";
import { ListDataGrid } from "./ListDataGrid";
import { use$LIST_WITH_FORM$Store } from "./use$LIST_WITH_FORM$Store";

interface DtoItem extends ExampleItem {}

interface Props {}

function App({}: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const init = use$LIST_WITH_FORM$Store(s => s.init);
  const reset = use$LIST_WITH_FORM$Store(s => s.reset);
  const destroy = use$LIST_WITH_FORM$Store(s => s.destroy);
  const callListApi = use$LIST_WITH_FORM$Store(s => s.callListApi);
  const setFlexGrow = use$LIST_WITH_FORM$Store(s => s.setFlexGrow);
  const listRequestValue = use$LIST_WITH_FORM$Store(s => s.listRequestValue);
  const setListRequestValue = use$LIST_WITH_FORM$Store(s => s.setListRequestValue);
  const listSpinning = use$LIST_WITH_FORM$Store(s => s.listSpinning);
  const setListSelectedRowKey = use$LIST_WITH_FORM$Store(s => s.setListSelectedRowKey);
  const flexGrow = use$LIST_WITH_FORM$Store(s => s.flexGrow);
  const cancelFormActive = use$LIST_WITH_FORM$Store(s => s.cancelFormActive);
  const setFormActive = use$LIST_WITH_FORM$Store(s => s.setFormActive);
  const saveSpinning = use$LIST_WITH_FORM$Store(s => s.saveSpinning);
  const callSaveApi = use$LIST_WITH_FORM$Store(s => s.callSaveApi);
  const formActive = use$LIST_WITH_FORM$Store(s => s.formActive);
  const listSelectedRowKey = use$LIST_WITH_FORM$Store(s => s.listSelectedRowKey);
  const programFn = use$LIST_WITH_FORM$Store(s => s.programFn);

  const resizerContainerRef = React.useRef<HTMLDivElement>(null);
  const [searchForm] = Form.useForm();
  const [form] = Form.useForm();

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

  const handleSave = useCallback(async () => {
    try {
      await form.validateFields();
    } catch (e) {
      await formErrorHandling(form);
      return;
    }

    try {
      await callSaveApi();
      await callListApi();
      if (!listSelectedRowKey) {
        cancelFormActive();
        setFormActive();
      }
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi, callSaveApi, cancelFormActive, form, listSelectedRowKey, setFormActive]);

  const onClickItem = React.useCallback(
    (params: AXFDGClickParams<DtoItem>) => {
      setListSelectedRowKey(params.item.id, params.item);
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
              loading={saveSpinning}
              disabled={!formActive && !listSelectedRowKey}
              onClick={handleSave}
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
          onChangeParamsValue={(value, changedValues) => setListRequestValue(value, changedValues)}
          onSearch={handleSearch}
          spinning={listSpinning}
          disableFilter
        />
      </PageSearchBar>

      <Body ref={resizerContainerRef}>
        <Frame style={{ flex: `0 1 ${flexGrow}%` }}>
          <ListDataGrid onClick={onClickItem} />
        </Frame>
        <ColResizer containerRef={resizerContainerRef} onResize={flexGlow => setFlexGrow(flexGlow)} />
        <Frame style={{ flex: `0 1 ${100 - flexGrow}%` }} scroll>
          <FormSet form={form} />
        </Frame>
      </Body>
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)``;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Body = styled(PageLayout.FrameRow)`
  padding: 0;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Frame = styled(PageLayout.FrameColumn)``;

export default App;
