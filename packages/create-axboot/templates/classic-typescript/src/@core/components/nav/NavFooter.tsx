import { IconText } from "@core/components/common";
import { SMixinFlexColumn, SMixinFlexRow } from "@axboot/core/styles";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconMoon, IconSun } from "components/icon";
import React from "react";
import { useAppStore, useUserStore } from "stores";
import { LangSelector } from "../../../components/LangSelector";

interface Props {
  sideMenuOpened?: boolean;
}

function NavFooter({}: Props) {
  const sideMenuOpened = useAppStore((s) => s.sideMenuOpened);
  const setSideMenuOpened = useAppStore((s) => s.setSideMenuOpened);
  const setOpenedMenuUuids = useUserStore((s) => s.setOpenedMenuUuids);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const handleChangeTheme = React.useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const handleSetSideMenuOpened = React.useCallback(
    (opened: boolean) => {
      setOpenedMenuUuids([]);
      setSideMenuOpened(opened);
    },
    [setOpenedMenuUuids, setSideMenuOpened],
  );

  return (
    <Container sideMenuOpened={sideMenuOpened}>
      <Content sideMenuOpened={sideMenuOpened}>
        <LangSelector hideLabel={!sideMenuOpened} />

        <IconText
          icon={theme === "light" ? <IconMoon /> : <IconSun />}
          iconSize={20}
          onClick={handleChangeTheme}
          role={"theme-selector"}
        />

        <IconText
          iconSize={20}
          icon={sideMenuOpened ? <IconLayoutSidebarLeftCollapse /> : <IconLayoutSidebarLeftExpand />}
          onClick={() => {
            handleSetSideMenuOpened(!sideMenuOpened);
          }}
        />
      </Content>
    </Container>
  );
}

const Container = styled.div<Props>`
  position: relative;
  padding: 0 16px 10px 16px;

  ${({ sideMenuOpened }) => {
    if (sideMenuOpened) {
      return css`
        padding: 0 16px 10px 16px;
      `;
    }
    return css`
      padding: 0;
    `;
  }}
`;

const Content = styled.div<Props>`
  height: 40px;
  padding-top: 7px;

  [role="lang-selector"] {
    cursor: pointer;
    color: ${(p) => p.theme.link_color};

    &:hover {
      color: ${(p) => p.theme.link_hover_color};
    }

    &:active {
      color: ${(p) => p.theme.link_active_color};
    }
  }

  ${({ sideMenuOpened, theme }) => {
    if (sideMenuOpened) {
      return css`
        ${SMixinFlexRow("space-between", "center")};
        font-size: 12px;
        gap: 10px;
        border-top: 1px solid ${theme.axf_border_color};
      `;
    }
    return css`
      border-top: 1px solid ${theme.axf_border_color};
      ${SMixinFlexColumn("center", "center")};
      height: 80px;
      padding: 0;
      font-size: 24px;
      gap: 10px;

      [role="theme-selector"],
      [role="lang-selector"] {
        margin: 0 5px;
      }
    `;
  }}
`;

export default NavFooter;
