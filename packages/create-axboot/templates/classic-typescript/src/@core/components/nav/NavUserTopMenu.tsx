import { useLink } from "@core/hooks";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ConfigProvider, Menu } from "antd";
import { MenuProps } from "antd/lib/menu";
import { MenuIcon } from "components/MenuIcon";
import { useI18n } from "hooks";
import React from "react";
import { MenuItem, useAppMenu } from "router";
import { AppMenu, AppMenuGroup } from "services";
import { useAppStore, useUserStore } from "stores";

interface StyleProps {
  sideMenuOpened?: boolean;
}

interface Props extends StyleProps {}

function NavUserTopMenu({}: Props) {
  const { t, currentLanguage } = useI18n();
  const { linkByMenu } = useLink();
  const { APP_MENUS } = useAppMenu();

  const sideMenuOpened = useAppStore((s) => s.sideMenuOpened);
  const openedMenuUuids = useUserStore((s) => s.openedMenuUuids);
  const setOpenedMenuUuids = useUserStore((s) => s.setOpenedMenuUuids);
  const selectedMenuUuid = useUserStore((s) => s.selectedMenuUuid);
  const setSelectedMenuUuid = useUserStore((s) => s.setSelectedMenuUuid);
  const setSideMenuOpened = useAppStore((s) => s.setSideMenuOpened);
  const setNavPosition = useAppStore((s) => s.setNavPosition);

  const menus = React.useMemo(() => {
    const getAppMenus = (menus: AppMenu[], pid: string): MenuItem[] => {
      return menus
        .map((m, idx) => {
          const children = getAppMenus(m.children, pid + "_" + idx);
          if (m.children.length > 0 && children.length === 0) {
            return;
          }
          return {
            icon: m.iconTy ? <MenuIcon typeName={m.iconTy} /> : null,
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
          icon: <MenuIcon typeName={mg.iconTy ?? "Default"} />,
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

  return (
    <NavUserMenuContainer sideMenuOpened={sideMenuOpened}>
      <ConfigProvider
        theme={{
          token: {},
          components: {
            Menu: {
              fontSize: 13,
              iconSize: 18,
              itemHeight: 34,
              iconMarginInlineEnd: 6,
              itemPaddingInline: 12,
              horizontalLineHeight: "34px",
              activeBarHeight: 0,
            },
          },
        }}
      >
        <Menu mode={"horizontal"} items={menus} selectedKeys={[selectedMenuUuid ?? ""]} onClick={onClick} />
      </ConfigProvider>
    </NavUserMenuContainer>
  );
}

const NavUserMenuContainer = styled.div<StyleProps>`
  flex: 1;
  user-select: none;

  .tool-bar {
    position: sticky;
    top: 10px;
    z-index: 2;
    margin: 0 4px 24px 4px;
    padding: 6px 16px;
    background: ${(p) => p.theme.axf_page_frame_tab_bg};

    border-radius: 24px;
    //border: 1px solid ${(p) => p.theme.border_color_base};

    display: flex;
    justify-content: space-around;

    .ant-btn {
      color: ${(p) => p.theme.axf_page_frame_tab_color};
    }

    ${(p) =>
      !p.sideMenuOpened &&
      css`
        display: none;
      `}
  }

  .ant-menu {
    background: inherit;
    color: ${(p) => p.theme.text_heading_color};
    font-weight: 600;
  }

  .ant-menu-horizontal {
    border-bottom: 0;
  }

  .ant-menu .ant-menu-submenu-title {
    display: flex;
  }
  .ant-menu .ant-menu-submenu-title .ant-menu-item-icon + span {
    margin-inline-start: 6px;
  }
`;

export default NavUserTopMenu;
