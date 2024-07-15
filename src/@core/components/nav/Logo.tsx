import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Tag } from "antd";
import React from "react";
import { User } from "services";
import pkg from "../../../../package.json";
import { NavPosition, useAppStore } from "../../../stores";
import { SMixinFlexRow } from "../../styles/emotion";
import { IconAXBootOpened } from "../axboot";

interface StyleProps {
  sideMenuOpened?: boolean;
  navPosition?: keyof NavPosition;
  brandLogo?: React.ReactNode;
}

interface Props extends StyleProps {
  me?: User;
  onSignOut?: () => Promise<void>;
}

function Logo({ brandLogo }: Props) {
  const navPosition = useAppStore((s) => s.navPosition);
  return (
    <Container navPosition={navPosition}>
      {brandLogo ? (
        brandLogo
      ) : (
        <>
          <IconAXBootOpened />
          <Tag>{pkg.version}</Tag>
        </>
      )}
    </Container>
  );
}

const Container = styled.div<StyleProps>`
  ${SMixinFlexRow("center", "center")};
  width: ${(p) => p.theme.side_menu_open_width}px;
  padding: 0;

  ${({ navPosition }) => {
    if (navPosition === "top") {
      return css`
        width: auto;
        padding: 0 16px;
      `;
    }
  }}

  flex: none;
  overflow: hidden;
  position: relative;

  background-size: 164px;
  color: ${(p) => p.theme.text_display_color};
`;

export default Logo;
