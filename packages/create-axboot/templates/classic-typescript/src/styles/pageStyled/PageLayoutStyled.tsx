import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { SMixinFlexColumn, SMixinFlexRow, SMixinScrollerStyle } from "../../@core/styles/emotion";
import { alpha } from "../../@core/styles/colorUtil";
import { PageLayoutProps } from "./PageLayout";

export type HeaderSize = "small" | "medium" | "large";

export const PageLayoutContainer = styled.div<PageLayoutProps>`
  position: relative;
  padding: 0;

  .datagrid-editable {
    background: ${(p) => alpha(p.theme.primary_color, 0.1)};
    user-select: none;

    input {
      user-select: all;
    }
  }

  ${({ stretch, theme }) => {
    if (stretch) {
      return css`
        flex: 1;
        overflow: hidden;
        ${SMixinFlexColumn("stretch", "stretch")};
      `;
    }

    return css`
      ${SMixinFlexColumn("flex-start", "stretch")};
    `;
  }}
`;

export const PageHeader = styled.div`
  ${SMixinFlexRow("space-between", "center", "wrap")};

  font-weight: 700;
  color: ${(p) => p.theme.text_heading_color};
  padding: 24px 28px 4px;
  margin-top: 8px;
  font-size: 20px;
  gap: 12px;
`;

export const PageSearchBar = styled.div`
  position: relative;
  padding: 16px 28px;
`;

export const PageTabBar = styled.div`
  position: relative;
  padding: 0 32px;

  .ant-tabs-top > .ant-tabs-nav {
    margin: 0;
  }
`;

export const PageContentBoxHeader = styled.div<{ size?: HeaderSize }>`
  ${SMixinFlexRow("space-between", "center")};
  font-weight: 600;
  color: ${(p) => p.theme.text_heading_color};
  margin: 0 0 8px 0;

  ${({ size = "medium" }) => {
    if (size === "small") {
      return css`
        font-size: 1em;
      `;
    }
    if (size === "medium") {
      return css`
        font-size: 1.1em;
      `;
    }
    if (size === "large") {
      return css`
        font-size: 1.4em;
      `;
    }
    return css``;
  }}
`;

export const PageContentBox = styled.div<{ level?: 1 | 2 | 3 }>`
  position: relative;
  ${SMixinFlexColumn("stretch", "stretch")};

  .ant-input-group-addon {
    padding: 0 5px;

    .ant-btn.ant-btn-sm {
      padding: 0 2px;

      &:hover {
        color: ${(p) => p.theme.primary_color};
      }
    }
  }

  ${({ level = 1, theme }) => {
    if (level === 1) {
      return css`
        border: 1px solid ${theme.axf_border_color};
        background: ${theme.form_box_bg};
        box-shadow: ${theme.box_shadow_base};
        border-radius: 4px;
        padding: 20px;
      `;
    }
    if (level === 2) {
      return css`
        background: ${theme.component_sub_background};
        border: 1px solid ${theme.axf_border_color};
        border-radius: 4px;
        padding: 10px 20px;
        margin: 0 0 15px;
      `;
    }
    return css``;
  }}
`;

export const PageGroupTitle = styled.div`
  margin-bottom: 5px;
  color: ${(p) => p.theme.text_heading_color};
  font-weight: bold;
  font-size: 1.1em;
`;

export const ButtonGroup = styled.div<{ compact?: boolean; align?: "flex-start" | "center" | "flex-end" }>`
  ${({ align = "flex-start" }) => {
    return css`
      ${SMixinFlexRow(align, "center")};
      gap: 6px;
    `;
  }};
  ${({ compact, align }) => {
    if (!compact) {
      return css`
        margin: 15px 0;
      `;
    }
  }};
`;

export const PageFrameHeader = styled.div`
  ${SMixinFlexRow("space-between", "center")};
  line-height: 32px;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: bold;
  color: ${(p) => p.theme.text_heading_color};
`;

export const PageFrameRow = styled.div<{ scroll?: boolean }>`
  position: relative;
  flex: 1;
  ${SMixinFlexRow("stretch", "stretch")};
  padding: 0;

  border-top: 1px solid ${(p) => p.theme.border_color_base};

  ${({ scroll }) => {
    if (!scroll) {
      return css`
        overflow: hidden;
      `;
    }
    return css`
      overflow: auto;
    `;
  }};
`;
export const PageFrameColumn = styled.div<{ scroll?: boolean }>`
  position: relative;
  flex: 1;
  ${SMixinFlexColumn("stretch", "stretch")};
  padding: 16px 28px;

  ${({ theme }) => {
    return css`
      ${SMixinScrollerStyle({
        track_color: theme.header_background,
        thumb_color: theme.border_color_base,
        bg_color: theme.page_background,
      })}
    `;
  }};
  ${({ scroll, theme }) => {
    if (!scroll) {
      return css`
        overflow: hidden;
      `;
    }
    return css`
      overflow: auto;
    `;
  }};
`;
export const PageFrameBody = styled.div`
  position: relative;
  flex: 1;
  ${SMixinFlexColumn("stretch", "stretch")};
`;

export const ToolBar = styled.div`
  ${SMixinFlexRow("space-between", "center")};
  margin-bottom: 0.7em;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }

  h1 {
  }

  h2 {
  }

  h3 {
  }
`;
