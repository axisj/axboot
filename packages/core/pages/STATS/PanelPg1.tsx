import { RowResizer } from "@axboot/core/components/common";
import styled from "@emotion/styled";
import React from "react";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { StatChart01 } from "./StatChart01";
import { StatList1 } from "./StatList1";
import { use$STATS$Store } from "./use$STATS$Store";

interface Props {}

function PanelPg1({}: Props) {
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  const flexGrow = use$STATS$Store(s => s.flexGrowPg1);
  const setFlexGrow = use$STATS$Store(s => s.setFlexGrowPg1);

  return (
    <Body ref={resizerContainerRef}>
      <Frame style={{ flex: `0 1 ${flexGrow}%` }}>
        <StatList1 />
      </Frame>
      <RowResizer containerRef={resizerContainerRef} onResize={flexGlow => setFlexGrow(flexGlow)} />
      <Frame style={{ flex: `0 1 ${100 - flexGrow}%` }}>
        <StatChart01 />
      </Frame>
    </Body>
  );
}

const Body = styled(PageLayout.FrameColumn)`
  padding: 0;
`;
const Frame = styled(PageLayout.FrameColumn)``;

export { PanelPg1 };
