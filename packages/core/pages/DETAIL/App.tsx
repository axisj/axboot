import { Loading, ProgramTitle } from "@axboot/core/components/common";
import { useDidMountEffect } from "@axboot/core/hooks/useDidMountEffect";
import styled from "@emotion/styled";
import { useI18n, useUnmountEffect } from "../../../../src/hooks";
import React from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { errorHandling } from "../../../../src/utils/errorHandling";
import { use$DETAIL$Store } from "./use$DETAIL$Store";
import { View } from "./View";

interface Props {}

function App({}: Props) {
  const { t } = useI18n("$example$");

  const init = use$DETAIL$Store(s => s.init);
  const destroy = use$DETAIL$Store(s => s.destroy);
  const callDetailApi = use$DETAIL$Store(s => s.callDetailApi);
  const detailSpinning = use$DETAIL$Store(s => s.detailSpinning);
  const urlParams = useParams<{ id: string }>();

  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  useDidMountEffect(() => {
    (async () => {
      try {
        await init();
        if (urlParams.id) await callDetailApi({ id: urlParams.id });
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
        <ProgramTitle title={t("상세페이지")} />

        <ButtonGroup compact></ButtonGroup>
      </Header>

      <Body ref={resizerContainerRef}>
        <Frame>
          <View />
        </Frame>
      </Body>
      <Loading active={detailSpinning} />
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
