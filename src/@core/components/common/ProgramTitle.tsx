import { SMixinFlexRow } from "@axboot/core/styles";
import styled from "@emotion/styled";
import { Breadcrumb } from "antd";
import { useLink } from "hooks";
import React from "react";
import { matchPath } from "react-router-dom";
import { ROUTES_LIST, useAppMenu } from "router";
import { AppMenu } from "services";
import { useAppStore } from "stores";
import { Spinner } from "./Spinner";

const MenuIcon = React.lazy(() => import("components/MenuIcon"));

interface Props {
  title?: string;
  icon?: React.ReactNode;
  disableIcon?: boolean;
  disableBreadcrumb?: boolean;
  spinning?: boolean;
  children?: React.ReactNode;
}

interface BreadCrumb {
  iconTy: string;
  multiLang: { en: string; ko: string };
  keyPath: number[];
  children: AppMenu[];
}

function ProgramTitle({ title, icon, disableIcon, disableBreadcrumb, spinning, children }: Props) {
  const currentLanguage = useAppStore((s) => s.currentLanguage);
  const { APP_MENUS, MENUS_LIST } = useAppMenu();
  const { linkByRoute } = useLink();
  const currentRoute = React.useMemo(
    () =>
      ROUTES_LIST.find((route) => {
        // console.log("ROUTES_LIST", route.key, route.path, location.pathname, matchPath(route.path, location.pathname));
        return matchPath(route.path, location.pathname);
      }),
    [],
  );

  const { iconTy, breadCrumbs } = React.useMemo(() => {
    const currentMenu = MENUS_LIST.find((m) => m.progCd && m.progCd === currentRoute?.program_type);

    const breadCrumbs: BreadCrumb[] = [];
    currentMenu?.keyPath?.reduce((acc, cur) => {
      breadCrumbs.push({
        iconTy: acc[cur].iconTy ?? "",
        multiLang: acc[cur].multiLang,
        keyPath: acc[cur].keyPath ?? [],
        children: acc[cur].children,
      });
      return acc[cur].children;
    }, APP_MENUS as AppMenu[]);

    return {
      iconTy: currentMenu?.iconTy,
      breadCrumbs,
    };
  }, [APP_MENUS, MENUS_LIST, currentRoute?.program_type]);

  const handleClickMenu = React.useCallback(
    (m) => {
      const mm = m.key.split(/\./g)?.reduce(
        (acc, cur) => {
          return acc.children[Number(cur)] as AppMenu;
        },
        { children: APP_MENUS as AppMenu[] },
      ) as AppMenu;
      const route = ROUTES_LIST.find((route) => route.program_type === mm.progCd);
      if (!route) return;
      linkByRoute(route, {});
    },
    [APP_MENUS, linkByRoute],
  );

  const bItems = React.useMemo(() => {
    return breadCrumbs.map((item, idx) => {
      if (idx < breadCrumbs.length - 1) {
        return {
          key: item.keyPath.join("."),
          title: item.multiLang[currentLanguage],
        };
      }

      const menuItems = breadCrumbs[breadCrumbs.length - 2]?.children.map((b, bidx) => {
        const menu = {
          key: b.keyPath?.join(".") ?? bidx + "",
          label: b.multiLang[currentLanguage],
          program_type: b.progCd,
        };

        return {
          ...menu,
          onClick: () => {
            handleClickMenu(menu);
          },
        };
      });

      return {
        key: item.keyPath.join("."),
        title: item.multiLang[currentLanguage],
        menu: menuItems
          ? {
              items: menuItems,
            }
          : undefined,
      };
    });
  }, [breadCrumbs, currentLanguage, handleClickMenu]);

  const currentMenu = React.useMemo(() => {
    if (currentRoute) {
      return MENUS_LIST.find((m) => m.progCd && m.progCd === currentRoute.program_type);
    }
  }, [MENUS_LIST, currentRoute]);

  return (
    <Container>
      {spinning ? <Spinner /> : disableIcon ? null : icon ?? <MenuIcon typeName={iconTy ?? "Default"} size={22} />}
      <TitleWrap>{title ?? currentMenu?.multiLang[currentLanguage]}</TitleWrap>
      {!disableBreadcrumb && <Breadcrumb items={bItems} />}
      {children}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  ${SMixinFlexRow("flex-start", "center", "wrap")};
  gap: 5px;
  min-height: 32px;

  .ant-breadcrumb {
    font-weight: 400;
    .ant-breadcrumb-separator {
      margin-inline: 6px;
    }
  }
`;
const TitleWrap = styled.div`
  margin-right: 10px;
  margin-left: 4px;
`;

export { ProgramTitle };
