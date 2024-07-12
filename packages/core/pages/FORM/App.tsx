import { Loading, ProgramTitle } from "@axboot/core/components/common";
import { useDidMountEffect } from "@axboot/core/hooks/useDidMountEffect";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { IconReset } from "../../../../src/components/icon";
import { useBtnI18n, useI18n, useUnmountEffect } from "../../../../src/hooks";
import React, { useCallback } from "react";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { errorHandling, formErrorHandling } from "../../../../src/utils/errorHandling";
import { FormSet } from "./FormSet";
import { use$FORM$Store } from "./use$FORM$Store";

interface Props {}

function App({}: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const init = use$FORM$Store(s => s.init);
  const reset = use$FORM$Store(s => s.reset);
  const destroy = use$FORM$Store(s => s.destroy);
  const saveSpinning = use$FORM$Store(s => s.saveSpinning);
  const callSaveApi = use$FORM$Store(s => s.callSaveApi);
  const programFn = use$FORM$Store(s => s.programFn);

  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const [form] = Form.useForm();
  const handleSave = useCallback(async () => {
    try {
      await form.validateFields();
    } catch (e) {
      await formErrorHandling(form);
      return;
    }

    try {
      await callSaveApi();
      await reset();
    } catch (e) {
      await errorHandling(e);
    }
  }, [callSaveApi, form, reset]);

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
    <Container>
      <Header>
        <ProgramTitle>
          <Button icon={<IconReset />} onClick={reset} size="small" type={"text"}>
            {btnT("초기화")}
          </Button>
        </ProgramTitle>
        <ButtonGroup compact>
          {programFn?.fn02 && (
            <Button type={"primary"} loading={saveSpinning} onClick={handleSave}>
              {btnT("저장")}
            </Button>
          )}
        </ButtonGroup>
      </Header>

      <Body ref={resizerContainerRef}>
        <Frame>
          <FormSet form={form} />
        </Frame>
      </Body>

      <Loading active={saveSpinning} />
    </Container>
  );
}

const Container = styled(PageLayout)``;
const Header = styled(PageLayout.Header)`
  //padding: 24px 28px;
`;
const PageSearchBar = styled(PageLayout.PageSearchBar)``;
const Body = styled(PageLayout.FrameRow)`
  border-top: 0 none;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Frame = styled(PageLayout.FrameColumn)``;

export default App;
