import { IconText } from "@axboot/core/components/common";
import { SMixinFlexRow } from "@axboot/core/styles/emotion";
import styled from "@emotion/styled";
import { LangSelector } from "../../../../src/components/LangSelector";
import React from "react";
import { useAppStore, useUserStore } from "../../../../src/stores";
import pkg from "../../../../package.json";
import { IconLayoutSidebarLeftExpand, IconMoon, IconSun } from "../../../../src/components/icon";
import IconLayoutSidebarLeftCollapse from "../../../../src/components/icon/files/IconLayoutSidebarLeftCollapse";

interface Props {}

function PageFooter({}: Props) {
  const sideMenuOpened = useAppStore(s => s.sideMenuOpened);
  const setSideMenuOpened = useAppStore(s => s.setSideMenuOpened);
  const setOpenedMenuUuids = useUserStore(s => s.setOpenedMenuUuids);
  const theme = useAppStore(s => s.theme);
  const setTheme = useAppStore(s => s.setTheme);

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
    <Container>
      <Tools>
        <ToggleSideNavHandle>
          <IconText
            iconSize={16}
            icon={sideMenuOpened ? <IconLayoutSidebarLeftCollapse /> : <IconLayoutSidebarLeftExpand />}
            onClick={() => {
              handleSetSideMenuOpened(!sideMenuOpened);
            }}
          />
        </ToggleSideNavHandle>

        <LangSelector />

        <IconText
          icon={theme === "light" ? <IconMoon /> : <IconSun />}
          iconSize={18}
          onClick={handleChangeTheme}
          role={"theme-selector"}
        />
      </Tools>
      <FooterLinks>
        <span role={"copyright"}>2023 AXISJ Inc.</span>
        <span role={"version"}>AXFrame {pkg.version}</span>
      </FooterLinks>
    </Container>
  );
}

const Container = styled.div`
  ${SMixinFlexRow("space-between", "center")};
  flex: 1;
  padding: 0 6px;
  position: relative;
  font-size: 11px;
`;

const Tools = styled.div`
  ${SMixinFlexRow("flex-start", "center")};
  flex: 1;
  gap: 10px;
`;

const ToggleSideNavHandle = styled.div`
  height: 33px;
  border-right: 1px solid ${p => p.theme.border_color_base};
  ${SMixinFlexRow("center", "center")};
  padding: 0 8px;
  margin-right: 10px;
`;

const FooterLinks = styled.div`
  font-size: 11px;

  [role="copyright"] {
    color: ${p => p.theme.text_body_color};
    margin-right: 8px;
  }
  [role="version"] {
    color: ${p => p.theme.text_heading_color};
    margin-right: 8px;
  }

  .ant-btn.ant-btn-sm {
    font-size: 12px;
    padding: 0 8px;
    color: ${p => p.theme.text_color};

    &:hover {
      color: ${p => p.theme.link_color};
    }
  }
`;

export { PageFooter };
