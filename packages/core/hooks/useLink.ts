import { stringFormat } from "@axboot/core/utils";
import { getFlattedMenus } from "@axboot/core/utils/store";
import React from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { MenuItem, RawRoute, ROUTES_LIST, useAppMenu } from "../../../src/router";
import { usePageTabStore } from "../../../src/stores";

export interface MetadataLinkByRoute {
  labels?: {
    en: string;
    ko: string;
  };
}

export function useLink() {
  const navigate = useNavigate();
  const addTab = usePageTabStore(s => s.addTab);
  const updateTab = usePageTabStore(s => s.updateTab);
  const setActiveTab = usePageTabStore(s => s.setActiveTab);
  const getActiveTabPage = usePageTabStore(s => s.getActiveTabPage);
  const { MENUS_LIST } = useAppMenu();

  const linkByTo = React.useCallback(
    (to: string) => {
      const linkToMenu = getFlattedMenus([]).find(fMenu => fMenu?.key === to);

      const labels = linkToMenu?.labels;
      const { tabUuid, page } = getActiveTabPage();

      if (page.path === "about:blank") {
        updateTab(tabUuid, { ...page, labels, path: to });
        navigate(to);
        return;
      }

      const addedTabUuid = addTab({
        labels,
        path: to,
        fixed: false,
      });
      setActiveTab(addedTabUuid);

      const hash = getActiveTabPage().page.hash ?? "";
      navigate(to + hash);
    },
    [addTab, getActiveTabPage, navigate, setActiveTab, updateTab],
  );

  const linkByRoute = React.useCallback(
    (route: RawRoute, params: Record<string, any>, metaData?: MetadataLinkByRoute, query?: Record<string, any>) => {
      const labels = { en: route.program_type as string, ko: route.program_type as string };
      const { tabUuid, page } = getActiveTabPage();

      if (route.program_type) {
        const menu = MENUS_LIST.find(menu => menu.progCd && menu.progCd === route.program_type);
        labels.en = stringFormat(menu?.multiLang.en ?? metaData?.labels?.en ?? (route.program_type as string), params);
        labels.ko = stringFormat(menu?.multiLang.ko ?? metaData?.labels?.ko ?? (route.program_type as string), params);
      }

      const path = generatePath(route.path, params);

      if (page.path === "about:blank") {
        updateTab(tabUuid, { ...page, labels, path });
        navigate(path);
        return;
      }

      const addedTabUuid = addTab({
        labels,
        path,
        fixed: false,
      });
      setActiveTab(addedTabUuid);

      const hash = getActiveTabPage().page.hash ?? "";
      const qs = new URLSearchParams(query).toString();
      navigate(path + hash + (qs ? `?${qs}` : ""));
    },
    [MENUS_LIST, addTab, getActiveTabPage, navigate, setActiveTab, updateTab],
  );

  const linkByMenu = React.useCallback(
    (menu: MenuItem) => {
      if (menu.program_type) {
        const route = ROUTES_LIST.find(route => route.program_type === menu.program_type);

        if (!route) return;

        const labels = menu.labels;
        const { tabUuid, page } = getActiveTabPage();
        const path = generatePath(route.path);

        if (page.path === "about:blank") {
          updateTab(tabUuid, { ...page, labels, path, icon: menu.iconty });
          navigate(path);
          return;
        }

        const addedTabUuid = addTab({
          labels,
          path,
          fixed: false,
          icon: menu.iconty,
        });
        setActiveTab(addedTabUuid);

        const hash = getActiveTabPage().page.hash ?? "";
        navigate(path + hash);
      }
    },
    [addTab, getActiveTabPage, navigate, setActiveTab, updateTab],
  );

  return {
    linkByTo,
    linkByRoute,
    linkByMenu,
  };
}
