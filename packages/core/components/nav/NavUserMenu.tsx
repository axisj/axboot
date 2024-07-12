import { useLink } from "@axboot/core/hooks";
import { lighten } from "@axboot/core/styles/colorUtil";
import { SMixinScrollerStyle } from "@axboot/core/styles/emotion";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  IconArrowsDiagonal,
  IconArrowsDiagonalMinimize,
  IconClose,
  IconLeftPane,
  IconSearch,
  IconTopPane,
} from "../../../../src/components/icon";
import { MenuIcon } from "../../../../src/components/MenuIcon";
import { useI18n } from "../../../../src/hooks";
import { MenuItem, useAppMenu } from "../../../../src/router";
import { AppMenu, AppMenuGroup } from "../../../../src/services";
import { useAppStore, useUserStore } from "../../../../src/stores";
import { errorHandling } from "../../../../src/utils";
import { Button, ConfigProvider, Menu, Tooltip } from "antd";
import { MenuProps } from "antd/lib/menu";
import React, { useCallback } from "react";
import { openSearchBoxModal } from "./SearchBoxModal";

interface StyleProps {
  sideMenuOpened?: boolean;
}

interface Props extends StyleProps {}

function NavUserMenu({}: Props) {
  const { t, currentLanguage } = useI18n();
  const { linkByMenu } = useLink();
  const { APP_MENUS } = useAppMenu();

  const sideMenuOpened = useAppStore(s => s.sideMenuOpened);
  const setSideMenuOpened = useAppStore(s => s.setSideMenuOpened);
  const openedMenuUuids = useUserStore(s => s.openedMenuUuids);
  const setOpenedMenuUuids = useUserStore(s => s.setOpenedMenuUuids);
  const selectedMenuUuid = useUserStore(s => s.selectedMenuUuid);
  const setSelectedMenuUuid = useUserStore(s => s.setSelectedMenuUuid);
  const setNavPosition = useAppStore(s => s.setNavPosition);

  const menus = React.useMemo(() => {
    const getAppMenus = (menus: AppMenu[], pid: string): MenuItem[] => {
      return menus
        .map((m, idx) => {
          const children = getAppMenus(m.children, pid + "_" + idx);
          if (m.children.length > 0 && children.length === 0) {
            return;
          }
          return {
            icon: m.iconTy ? <MenuIcon typeName={m.iconTy as any} /> : null,
            key: pid + "_" + idx,
            program_type: m.progCd,
            labels: m.multiLang,
            label: m.multiLang[currentLanguage],
            title: m.multiLang[currentLanguage],
            iconty: m.iconTy,
            children: children.length === 0 ? undefined : children,
          } as MenuItem;
        })
        .filter(Boolean) as MenuItem[];
    };

    const getAppMenuGroups = (menuGroups: AppMenuGroup[]) => {
      return menuGroups.map((mg, idx) => {
        const children = getAppMenus(mg.children ?? [], `${idx}`);
        return {
          icon: <MenuIcon typeName={mg.iconTy as any} />,
          key: idx,
          program_type: mg.progCd,
          labels: mg.multiLang,
          label: mg.multiLang[currentLanguage],
          children: children.length === 0 ? undefined : children,
        } as MenuItem;
      });
    };
    return getAppMenuGroups(APP_MENUS);
  }, [APP_MENUS, currentLanguage]);

  const onSideMenuOpenChange = React.useCallback(
    (openKeys: string[]) => {
      setOpenedMenuUuids(openKeys);
    },
    [setOpenedMenuUuids],
  );

  const onClick: MenuProps["onClick"] = React.useCallback(
    ({ key }) => {
      const keyPath = key.split(/_/g);
      const menu = keyPath.reduce((acc, cur) => {
        return acc[cur].children ? acc[cur].children : acc[cur];
      }, menus);

      setSelectedMenuUuid(menu.key);
      linkByMenu(menu);
    },
    [linkByMenu, menus, setSelectedMenuUuid],
  );

  const handleExpandAll = useCallback(() => {
    const keys = menus.map((m, idx) => `${idx}`);
    setOpenedMenuUuids(keys);
  }, [menus, setOpenedMenuUuids]);

  const handleCollapseAll = useCallback(() => {
    setOpenedMenuUuids([]);
  }, [setOpenedMenuUuids]);

  const openSearchBox = useCallback(async () => {
    try {
      const data = await openSearchBoxModal();
      linkByMenu(data);
    } catch (err) {
      await errorHandling(err);
    }
  }, [linkByMenu]);

  const handleSetSideMenuOpened = useCallback(
    (opened: boolean) => {
      setSideMenuOpened(opened);
    },
    [setSideMenuOpened],
  );

  return (
    <>
      <NavUserMenuContainer sideMenuOpened={sideMenuOpened}>
        <div className={"tool-bar"}>
          <Tooltip title={t("전체 펼치기")}>
            <Button size={"small"} type={"link"} icon={<IconArrowsDiagonal size={14} />} onClick={handleExpandAll} />
          </Tooltip>
          <Tooltip title={t("전체 닫기")}>
            <Button
              size={"small"}
              type={"link"}
              icon={<IconArrowsDiagonalMinimize size={14} />}
              onClick={handleCollapseAll}
            />
          </Tooltip>
          <Tooltip title={t("레프트메뉴 레이아웃")}>
            <Button
              size={"small"}
              type={"link"}
              icon={<IconLeftPane size={14} />}
              onClick={() => setNavPosition("left")}
            />
          </Tooltip>
          <Tooltip title={t("탑메뉴 레이아웃")}>
            <Button
              size={"small"}
              type={"link"}
              icon={<IconTopPane size={14} />}
              onClick={() => setNavPosition("top")}
            />
          </Tooltip>
          <Tooltip title={t("메뉴 찾기")}>
            <Button
              size={"small"}
              type={"link"}
              icon={<IconSearch size={14} />}
              onClick={openSearchBox}
              onFocus={e => e.currentTarget.blur()}
            />
          </Tooltip>
          <Tooltip title={t("메뉴바 닫기")}>
            <Button
              size={"small"}
              type={"link"}
              icon={<IconClose size={14} />}
              onClick={() => handleSetSideMenuOpened(!sideMenuOpened)}
            />
          </Tooltip>
        </div>

        <ConfigProvider
          theme={{
            token: {
              fontSize: 13,
            },
            components: {
              Menu: {
                itemHeight: 34,
                iconMarginInlineEnd: 6,
                iconSize: 18,
              },
            },
          }}
        >
          <Menu
            mode={"inline"}
            items={menus}
            // defaultOpenKeys={sideMenuOpened ? openedMenuUuids : []}
            openKeys={openedMenuUuids}
            onOpenChange={onSideMenuOpenChange}
            selectedKeys={[selectedMenuUuid ?? ""]}
            inlineIndent={14}
            inlineCollapsed={!sideMenuOpened}
            onClick={onClick}
          />
        </ConfigProvider>
      </NavUserMenuContainer>
    </>
  );
}

const NavUserMenuContainer = styled.div<StyleProps>`
  flex: 1;
  overflow: auto;
  overflow-x: hidden;
  user-select: none;

  .tool-bar {
    position: sticky;
    top: 10px;
    z-index: 2;
    margin: 0 4px 24px 4px;
    padding: 6px;
    background: ${p => p.theme.border_color_base};
    border-radius: 24px;

    display: flex;
    justify-content: center;
    gap: 6px;

    .ant-btn {
      color: ${p => p.theme.text_heading_color};
    }

    ${p =>
      !p.sideMenuOpened &&
      css`
        display: none;
      `}
  }

  ${({ sideMenuOpened, theme }) => {
    if (sideMenuOpened) {
      return css`
        padding: 16px;
        ${SMixinScrollerStyle({
          track_color: theme.header_background,
          thumb_color: theme.border_color_base,
          bg_color: theme.page_background,
        })};
      `;
    }
    return css`
      padding: 4px;
      ${SMixinScrollerStyle({
        track_color: theme.component_background,
        thumb_color: theme.scroll_thumb_color,
        bg_color: theme.page_background,
      })};
    `;
  }}

  .ant-menu {
    background: inherit;
    color: ${p => p.theme.text_heading_color};
  }

  // 우측에 보더값 제거
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: 0 none;
    border-inline-end: 0 none !important;
  }

  .ant-menu-root.ant-menu-inline {
    > .ant-menu-item,
    > .ant-menu-submenu {
      min-height: 36px;
      line-height: 36px;

      // menu parent title
      .ant-menu-submenu-title {
        font-weight: 600;
      }
    }
  }

  // opened menu
  .ant-menu {
    > .ant-menu-submenu {
      > [role="menuitem"] {
        > .ant-menu-item-icon {
          font-size: 20px;
        }
      }
    }
  }
  // !opened menu
  .ant-menu.ant-menu-inline-collapsed {
    width: 100%;

    [role="menuitem"] {
      padding-inline: 0;
      height: 36px;
      padding-top: 3px;

      .ant-menu-item-icon {
        font-size: 20px;
        margin: 0 auto;
        display: block;
        line-height: 36px;
      }
    }
  }

  .ant-menu-light.ant-menu-inline .ant-menu-sub.ant-menu-inline,
  .ant-menu-light > .ant-menu.ant-menu-inline .ant-menu-sub.ant-menu-inline {
    background: ${p => lighten(p.theme.header_background, 0.01)};
    border-radius: 8px;
  }
`;

export default NavUserMenu;
