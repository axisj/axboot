import { IconText } from "@core/components/common";
import { SMixinFlexColumn, SMixinFlexRow } from "@core/styles/emotion";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Tooltip } from "antd";
import { BrandLogo } from "components/BrandLogo";
import { useI18n } from "hooks";
import React from "react";
import { useAppStore, useUserStore } from "stores";

interface Props {
  sideMenuOpened?: boolean;
  onChangeSideMenuOpened?: (opened: boolean) => void;
}

function NavHeader({}: Props) {
  const { t } = useI18n();
  const sideMenuOpened = useAppStore((s) => s.sideMenuOpened);
  const setSideMenuOpened = useAppStore((s) => s.setSideMenuOpened);
  const setOpenedMenuUuids = useUserStore((s) => s.setOpenedMenuUuids);

  const handleSetSideMenuOpened = React.useCallback(
    (opened: boolean) => {
      setOpenedMenuUuids([]);
      setSideMenuOpened(opened);
    },
    [setOpenedMenuUuids, setSideMenuOpened],
  );

  return (
    <NavHeaderContainer sideMenuOpened={sideMenuOpened}>
      <Logo sideMenuOpened={sideMenuOpened}>
        {sideMenuOpened ? (
          <BrandLogo fontSize={24} />
        ) : (
          <Tooltip title={t("appName")} placement={"right"}>
            <BrandLogo fontSize={30} />
          </Tooltip>
        )}
        {sideMenuOpened ? t("appName") : ""}
      </Logo>
      <ToggleHandle role={"toggle-menu"}>
        {sideMenuOpened ? (
          <IconText role={"toggle-icon"} onClick={() => handleSetSideMenuOpened?.(false)} />
        ) : (
          <IconText role={"toggle-icon"} onClick={() => handleSetSideMenuOpened?.(true)} block />
        )}
      </ToggleHandle>
    </NavHeaderContainer>
  );
}

const NavHeaderContainer = styled.div<Props>`
  position: relative;
  height: 45px;
  background: ${(p) => p.theme.header_background};
  line-height: 1.1;

  ${({ sideMenuOpened }) => {
    if (sideMenuOpened) {
      return css`
        ${SMixinFlexRow("stretch", "center")};
        padding: 0 20px;
      `;
    }
    return css`
      ${SMixinFlexColumn("center", "center")};
      height: 70px;
      padding: 0;

      [role="toggle-menu"] {
        ${SMixinFlexRow("center", "center")};
      }
    `;
  }}
`;

const Logo = styled.div<Props>`
  column-gap: 6px;
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  color: ${(p) => p.theme.text_heading_color};

  ${({ sideMenuOpened }) => {
    if (sideMenuOpened) {
      return css`
        ${SMixinFlexRow("stretch", "center")};
      `;
    }
    return css`
      ${SMixinFlexRow("center", "center")};
    `;
  }}
`;

const ToggleHandle = styled.div`
  ${SMixinFlexRow("center", "center")};

  [role="toggle-icon"] {
    column-gap: 0;
  }
`;

export default NavHeader;
