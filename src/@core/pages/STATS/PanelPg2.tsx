import { RowResizer } from "@core/components/common";
import styled from "@emotion/styled";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { StatList2 } from "./StatList2";
import { use$STATS$Store } from "./use$STATS$Store";

interface Props {}

function PanelPg2({}: Props) {
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const flexGrow = use$STATS$Store((s) => s.flexGrowPg2);
  const setFlexGrow = use$STATS$Store((s) => s.setFlexGrowPg2);

  return (
    <Body ref={resizerContainerRef}>
      <Frame style={{ flex: `0 1 ${flexGrow}%` }}>
        <StatList2 />
      </Frame>
      <RowResizer containerRef={resizerContainerRef} onResize={(flexGlow) => setFlexGrow(flexGlow)} />
      <Frame style={{ flex: `0 1 ${100 - flexGrow}%` }}></Frame>
    </Body>
  );
}

const Body = styled(PageLayout.FrameColumn)`
  padding: 0;
`;
const Frame = styled(PageLayout.FrameColumn)``;

export { PanelPg2 };
