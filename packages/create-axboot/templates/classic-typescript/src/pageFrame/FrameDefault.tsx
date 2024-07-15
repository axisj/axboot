import { SMixinFlexColumn } from "@axboot/core/styles";
import styled from "@emotion/styled";
import React from "react";
import { Outlet } from "react-router-dom";

function FrameDefault() {
  return (
    <PageFrameContainer>
      <React.Suspense fallback={<></>}>
        <Outlet />
      </React.Suspense>
    </PageFrameContainer>
  );
}

export const PageFrameContainer = styled.div`
  ${SMixinFlexColumn("stretch", "stretch")};
  height: 100vh;
  width: 100vw;
  background: ${(p) => p.theme.body_background};
  flex: 1;
  overflow: auto;
`;

export default FrameDefault;
