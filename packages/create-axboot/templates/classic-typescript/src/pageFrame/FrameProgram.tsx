import AppMenuBarTools from "@axboot/core/components/nav/AppMenuBarTools";
import Logo from "@axboot/core/components/nav/Logo";
import NavGroup from "@axboot/core/components/nav/NavGroup";
import NavUserTopMenu from "@axboot/core/components/nav/NavUserTopMenu";
import { SideBox } from "@axboot/core/components/nav/SideBox";
import TabGroup from "@axboot/core/components/tabs/TabGroup";
import { usePageTabStore } from "@axboot/core/stores/usePageTabStore";
import { SMixinFlexColumn, SMixinFlexRow, SMixinScrollerStyle } from "@axboot/core/styles/emotion";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { Outlet } from "react-router-dom";
import { useAppStore } from "@src/stores";
import { mediaMin } from "@src/styles/mediaQueries";
import pkg from "../../package.json";

interface StyleProps {
  sideMenuOpened?: boolean;
  sideBoxOpened?: boolean;
}

interface Props extends StyleProps {}

function FrameProgram({}: Props) {
  const pageTabLoaded = usePageTabStore(s => s.loaded);
  const fullScreen = useAppStore(s => s.fullScreen);
  const sideMenuOpened = useAppStore(s => s.sideMenuOpened);
  const sideBoxOpened = useAppStore(s => s.sideBoxOpened);
  const navPosition = useAppStore(s => s.navPosition);

  return (
    <PageFrameContainer>
      <PageFrameHeaderTabBar>{pageTabLoaded && <TabGroup />}</PageFrameHeaderTabBar>

      {!fullScreen && (
        <PageFrameHeader>
          <Logo brandLogo={null} />
          {navPosition === "top" && <NavUserTopMenu />}
          <AppMenuBarTools />
        </PageFrameHeader>
      )}

      <PageFrameContent>
        {navPosition === "left" && (
          <PageFrameLeftNav sideMenuOpened={sideMenuOpened}>
            <NavGroup />
          </PageFrameLeftNav>
        )}

        <Content>
          <React.Suspense fallback={<></>}>
            <Outlet />
          </React.Suspense>
        </Content>

        <PageFrameSide sideBoxOpened={sideBoxOpened}>
          <SideBox />
        </PageFrameSide>
      </PageFrameContent>
      <PageFrameFooter>
        <div>
          AXBoot.dev <b>{pkg.version}</b>
        </div>
        Copyright 2024 AXISJ Inc. all rights reserved
      </PageFrameFooter>
    </PageFrameContainer>
  );
}

const PageFrameContainer = styled.div`
  ${SMixinFlexColumn("stretch", "stretch")};
  height: 100vh;
  width: 100vw;
  flex: 1;
  overflow: hidden;
  background: ${p => p.theme.body_background};
  color: ${p => p.theme.text_body_color};
`;
const PageFrameHeaderTabBar = styled.div`
  ${SMixinFlexRow("stretch", "stretch")};
  height: ${p => p.theme.tab_bar_height}px;
  overflow: hidden;
`;

const PageFrameHeader = styled.div`
  ${SMixinFlexRow("stretch", "center")};
  overflow: hidden;
  background: ${p => p.theme.header_background};
  border-bottom: 1px solid ${p => p.theme.border_color_base};
  height: 55px;
`;

const PageFrameLeftNav = styled.div<StyleProps>`
  ${SMixinFlexRow("stretch", "stretch")};
  flex: none;
  position: relative;
  padding: 0;
  box-sizing: border-box;
  background: ${p => p.theme.page_background};
  border-right: 1px solid ${p => p.theme.border_color_base};
  ${({ sideMenuOpened, theme }) => {
    if (sideMenuOpened) {
      return css`
        width: ${theme.side_menu_open_width}px;
      `;
    }

    return css`
      width: ${theme.side_menu_close_width}px;
    `;
  }}

  z-index: 10;
`;

const PageFrameSide = styled.div<StyleProps>`
  flex: none;
  position: relative;
  padding: 0;
  box-sizing: border-box;
  background: ${p => p.theme.page_background};
  border-left: 1px solid ${p => p.theme.border_color_base};
  z-index: 10;

  display: none;
  ${mediaMin.lg} {
    ${SMixinFlexRow("stretch", "stretch")};
  }

  ${({ sideBoxOpened, theme }) => {
    if (sideBoxOpened) {
      return css`
        width: ${theme.side_menu_open_width}px;
      `;
    }

    return css`
      width: 0;
      background: ${theme.header_background};
    `;
  }}
`;

const PageFrameContent = styled.div`
  flex: 1;
  ${SMixinFlexRow("stretch", "stretch")};
  overflow: hidden;
  background-color: ${p => p.theme.page_background};
`;
const Content = styled.div`
  flex: 1;
  overflow: auto;
  ${SMixinFlexColumn("stretch", "stretch")};
  background-color: ${p => p.theme.page_background};

  ${({ theme }) => css`
    ${SMixinScrollerStyle({
      track_color: theme.header_background,
      thumb_color: theme.border_color_base,
      bg_color: theme.page_background,
    })}
  `};
`;
const PageFrameFooter = styled.div`
  border-top: 1px solid ${p => p.theme.border_color_base};
  background: ${p => p.theme.header_background};
  padding: 4px 16px;
  font-size: 11px;
  ${SMixinFlexRow("space-between", "center")}
`;

export default FrameProgram;
