import { Loading, ProgramTitle } from "@axboot/core/components/common";
import { IParam, SearchParams, SearchParamType } from "@axboot/core/components/search";
import { useDidMountEffect } from "@axboot/core/hooks/useDidMountEffect";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "../../../../src/components/icon";
import dayjs from "dayjs";
import { useBtnI18n, useI18n, useUnmountEffect } from "../../../../src/hooks";
import React from "react";
import { useUserStore } from "../../../../src/stores";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { errorHandling } from "../../../../src/utils/errorHandling";
import { CalendarView } from "./CalendarView";
import { use$CALENDAR$Store } from "./use$CALENDAR$Store";

interface Props {}

function App({}: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const me = useUserStore(s => s.me);
  const init = use$CALENDAR$Store(s => s.init);
  const reset = use$CALENDAR$Store(s => s.reset);
  const destroy = use$CALENDAR$Store(s => s.destroy);
  const listRequestValue = use$CALENDAR$Store(s => s.listRequestValue);
  const setListRequestValue = use$CALENDAR$Store(s => s.setListRequestValue);
  const callListApi = use$CALENDAR$Store(s => s.callListApi);
  const listSpinning = use$CALENDAR$Store(s => s.listSpinning);
  const programFn = use$CALENDAR$Store(s => s.programFn);

  const resizerContainerRef = React.useRef<HTMLDivElement>(null);
  const [searchForm] = Form.useForm();

  const handleReset = React.useCallback(async () => {
    try {
      await reset();
    } catch (e) {
      await errorHandling(e);
    }
  }, [reset]);

  const handleSearch = React.useCallback(async () => {
    try {
      await callListApi({});
    } catch (e) {
      await errorHandling(e);
    }
  }, [callListApi]);

  const handleChangeDate = React.useCallback(
    async (date: dayjs.Dayjs) => {
      try {
        setListRequestValue({ baseMonth: date });
        await handleSearch();
      } catch (err) {
        await errorHandling(err);
      }
    },
    [handleSearch, setListRequestValue],
  );

  const params = React.useMemo(
    () =>
      [
        {
          label: t("기준년월"),
          name: "baseMonth",
          type: SearchParamType.DATE,
          picker: "month",
          allowClear: false,
        },
      ] as IParam[],
    [t],
  );

  useDidMountEffect(() => {
    (async () => {
      try {
        await init();
      } catch (e: any) {
        await errorHandling(e);
      }
    })();
  });

  useUnmountEffect(() => {
    destroy();
  });

  return (
    <Container stretch={false}>
      <Header>
        <ProgramTitle>
          <Button icon={<IconReset />} onClick={handleReset} size="small" type={"text"}>
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
          disableFilter
        />
      </PageSearchBar>

      <Body ref={resizerContainerRef}>
        <Frame>
          <CalendarView onChange={handleChangeDate} />
        </Frame>
      </Body>
      <Loading active={listSpinning} />
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
