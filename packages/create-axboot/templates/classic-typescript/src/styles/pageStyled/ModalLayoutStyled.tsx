import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { SMixinFlexColumn, SMixinFlexRow } from "../../@core/styles/emotion";

export interface ModalLayoutProps {
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  role?: string;
  stretch?: boolean;
}

export const ModalLayoutContainer = styled.div<ModalLayoutProps>`
  ${({ stretch }) => {
    if (stretch) {
      return css`
        flex: 1;
        ${SMixinFlexColumn("stretch", "stretch")};
      `;
    }

    return;
  }}
`;

export interface ModalHeaderProps {
  title: React.ReactNode;
  children?: React.ReactNode;
}

export function ModalHeader(props: ModalHeaderProps) {
  return (
    <HeaderContainer>
      <div role={"modal-header-title"}>{props.title}</div>
      <div role={"modal-header-addon"}>{props.children}</div>
    </HeaderContainer>
  );
}

export const HeaderContainer = styled.div`
  ${SMixinFlexRow("stretch", "center")};
  height: 54px;
  border-bottom: 1px solid ${(p) => p.theme.border_color_split};
  padding: 0 50px 0 20px;

  [role="modal-header-title"] {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 16px;
    font-weight: 600;
    color: ${(p) => p.theme.text_heading_color};
  }

  [role="modal-header-addon"] {
    flex: none;
  }
`;

export const ModalBody = styled.div`
  flex: 1;
  padding: 20px;
  min-height: 400px;
`;

export const ModalFooter = styled.div<{ compact?: boolean }>`
  ${SMixinFlexRow("flex-end", "center")};
  padding: 15px 20px;
  gap: 6px;
  background: ${(p) => p.theme.header_background};
  border-radius: 0 0 5px 5px;
`;
