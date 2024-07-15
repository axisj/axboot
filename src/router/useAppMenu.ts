import { useAppStore, useUserStore } from "stores";
import { getFlattedAppMenus } from "@core/utils/store";
import React from "react";
import { AppMenu, AppMenuGroup } from "services";
import { PROGRAM_TYPES } from "./@programTypes";

export function useAppMenu() {
  const appMenuGroups = useAppStore((s) => s.appMenuGroups);
  const authorityList = useUserStore((s) => s.authorityList);
  const programList = useUserStore((s) => s.programList);

  const APP_MENUS = React.useMemo(() => {
    const getAppMenus = (menus?: AppMenu[]): AppMenu[] => {
      return (menus ?? [])
        .map((m) => {
          if (m.progCd && !programList.includes(m.progCd as PROGRAM_TYPES)) {
            return;
          }
          return {
            ...m,
            children: getAppMenus(m.children),
          };
        })
        .filter(Boolean) as AppMenu[];
    };
    const getAppMenuGroups = (menuGroups: AppMenuGroup[]) => {
      return menuGroups
        .filter((mg) => mg.userGroup.some((ug) => authorityList.includes(ug)))
        .map((mg) => {
          if (mg.menuGrpCd === "_") {
            return [
              ...((mg.children ?? [])
                .map((m) => {
                  if (m.progCd && !programList.includes(m.progCd as PROGRAM_TYPES)) {
                    return;
                  }
                  return {
                    ...m,
                    children: getAppMenus(m.children),
                  };
                })
                .filter(Boolean) as AppMenu[]),
            ];
          }

          return {
            ...mg,
            children: getAppMenus(mg.children),
          };
        }) as AppMenuGroup[];
    };

    return getAppMenuGroups(appMenuGroups).flat();
  }, [appMenuGroups, authorityList, programList]);

  const MENUS_LIST = React.useMemo(() => getFlattedAppMenus(APP_MENUS), [APP_MENUS]);

  return {
    APP_MENUS,
    MENUS_LIST,
  };
}
