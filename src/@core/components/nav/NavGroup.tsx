import { SMixinFlexColumn, SMixinFlexRow } from "@core/styles/emotion";
import styled from "@emotion/styled";
import { Button } from "antd";
import React, { useCallback } from "react";
import { useAppStore } from "stores";
import { IconArrowLeft, IconArrowRight } from "../../../components/icon";
import NavUserMenu from "./NavUserMenu";

interface StyleProps {
  sideMenuOpened?: boolean;
}

interface Props extends StyleProps {}

function NavGroup({}: Props) {
  const sideMenuOpened = useAppStore((s) => s.sideMenuOpened);
  const setSideMenuOpened = useAppStore((s) => s.setSideMenuOpened);

  const handleSetSideMenuOpened = useCallback(
    (opened: boolean) => {
      setSideMenuOpened(opened);
    },
    [setSideMenuOpened],
  );

  return (
    <Container sideMenuOpened={sideMenuOpened}>
      <NavUserMenu />

      <Button
        size={"small"}
        className={"toggle-side-menu"}
        icon={sideMenuOpened ? <IconArrowLeft size={15} /> : <IconArrowRight size={15} style={{ marginLeft: 2 }} />}
        onClick={() => {
          handleSetSideMenuOpened(!sideMenuOpened);
        }}
        type={sideMenuOpened ? "default" : "primary"}
      />
    </Container>
  );
}

const Container = styled.div<StyleProps>`
  ${SMixinFlexColumn("stretch", "stretch")};
  flex: 1;
  padding: 2px;
  width: 100%;

  .toggle-side-menu {
    ${SMixinFlexRow("center", "center")};
    position: absolute;
    width: 16px;
    right: -16px;
    top: 35px;
    height: 26px;
    padding: 0 2px 0 0;
    border-radius: 0 4px 4px 0;

    &.ant-btn-default {
      background: ${(p) => p.theme.header_background};
    }
  }
`;

export default NavGroup;
