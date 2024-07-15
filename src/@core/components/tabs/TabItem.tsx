import { SMixinFlexRow } from "@core/styles/emotion";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { Page, useAppStore, usePageTabStore } from "stores";
import { IconClose, IconHome } from "../../../components/icon";
import MenuIcon from "../../../components/MenuIcon";

interface StyleProps {
  isHome?: boolean;
  active?: boolean;
}

interface Props extends StyleProps {
  tabUuid: string;
  tabInfo: Page;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>, tabUuid: string) => void;
  onRemoveTab: (uuid: string) => void;
  onClickTab: (tabUuid: string, path?: string) => void;
}

function TabItem({ tabUuid, tabInfo, onContextMenu, onRemoveTab, onClickTab }: Props) {
  const activeTabUuid = usePageTabStore((s) => s.activeTabUuid);
  const currentLanguage = useAppStore((s) => s.currentLanguage);

  return (
    <TabItemContainer
      isHome={tabInfo.isHome}
      active={activeTabUuid === tabUuid}
      onClick={() => onClickTab(tabUuid, tabInfo.path)}
      role={activeTabUuid === tabUuid ? "active-tab-item" : "tab-item"}
      onContextMenu={(evt) => onContextMenu(evt, tabUuid)}
    >
      <Box isHome={tabInfo.isHome} active={activeTabUuid === tabUuid}>
        {tabInfo.isHome ? (
          <>
            <IconHome size={18} />
            HOME
          </>
        ) : (
          <>
            {tabInfo.icon && <MenuIcon typeName={tabInfo.icon as any} size={18} />}
            {tabInfo.labels?.[currentLanguage] ?? ""}
            <a
              role='tab-close'
              onClick={(evt) => {
                onRemoveTab(tabUuid);
                evt.stopPropagation();
              }}
            >
              <IconClose />
            </a>
          </>
        )}

        {activeTabUuid === tabUuid && (
          <>
            <div className={"extra-l"} />
            <div className={"extra-r"} />
          </>
        )}
      </Box>
    </TabItemContainer>
  );
}

const Box = styled.div<StyleProps>`
  ${SMixinFlexRow("flex-start", "center")};
  gap: 5px;
  flex: none;
  height: ${(p) => p.theme.tab_bar_height - 4}px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  position: relative;
  white-space: nowrap;
  transition: all 0.3s;
  border-radius: 6px 6px 0 0;

  [role="tab-close"] {
    position: absolute;
    right: 6px;
    width: 16px;
    height: 16px;
    padding: 2px;
    border-radius: 50%;
    display: none;
    svg {
      display: block;
    }
  }

  ${({ isHome }) => {
    if (isHome) {
      return css`
        padding: 0 14px;
      `;
    }
    return css`
      padding: 0 26px 0 10px;
    `;
  }}

  &:after {
    content: "";
    position: absolute;
    transition: all 0.3s;
  }

  ${({ active, theme }) => {
    if (active) {
      return css`
        z-index: 2;
        color: ${theme.axf_page_frame_tab_active_color};
        background: ${theme.axf_page_frame_tab_active_bg};

        &:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 35px;
          width: calc(100% - 70px);
          height: 2px;
          border-radius: 3px;
          background: ${theme.axf_page_frame_tab_active_color};
        }

        &:hover {
          &:after {
            bottom: -1px;
            left: 25px;
            width: calc(100% - 50px);
            height: 3px;
          }
        }

        [role="tab-close"] {
          ${SMixinFlexRow("center", "center")};
          transition: all 0.3s;
          color: ${theme.axf_page_frame_tab_active_color};

          &:hover {
            background: ${theme.axf_page_frame_tab_bg};
            color: ${theme.axf_page_frame_tab_active_bg};
          }
        }
      `;
    }
    return css`
      transition: all 0.3s;
      color: ${theme.axf_page_frame_tab_color};
      background: ${theme.axf_page_frame_tab_bg};

      &:hover {
        background: ${theme.axf_page_frame_tab_hover_bg};

        &:after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 25px;
          width: calc(100% - 50px);
          height: 4px;
          background: ${theme.axf_page_frame_tab_color};
          border-radius: 3px;
        }

        [role="tab-close"] {
          ${SMixinFlexRow("center", "center")};
          transition: all 0.3s;
          color: ${theme.axf_page_frame_tab_active_bg};

          &:hover {
            background: ${theme.axf_page_frame_tab_bg};
            color: ${theme.axf_page_frame_tab_active_bg};
          }
        }
      }
    `;
  }}

  //overflow: visible;
  .extra-l {
    position: absolute;
    top: 0;
    left: -4px;
    width: 4px;
    height: 100%;
    background: ${(p) => p.theme.axf_page_frame_tab_active_bg};
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${(p) => p.theme.axf_page_frame_tab_bg};
      border-radius: 0 0 4px 0;
    }
  }
  .extra-r {
    position: absolute;
    top: 0;
    right: -4px;
    width: 4px;
    height: 100%;
    background: ${(p) => p.theme.axf_page_frame_tab_active_bg};
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${(p) => p.theme.axf_page_frame_tab_bg};
      border-radius: 0 0 0 4px;
    }
  }
`;
const TabItemContainer = styled.div<StyleProps>`
  &.sortable-ghost {
    color: ${(p) => p.theme.white_color};
    background: #d5d5d5;
  }

  ${({ isHome }) => {
    if (isHome) {
      return css`
        padding: 0;
      `;
    }
  }}
`;

export default TabItem;
