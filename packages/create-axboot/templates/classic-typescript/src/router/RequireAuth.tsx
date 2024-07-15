import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppStore, useCodeStore, useUserStore } from "stores";
import { getFlattedMenus } from "@core/utils/store";
import { ROUTES } from "./Routes";
import { useAppMenu } from "./useAppMenu";

interface Props {
  children: JSX.Element;
}

function RequireAuth({ children }: Props) {
  const loaded = useUserStore((s) => s.loaded);
  const me = useUserStore((s) => s.me);
  const accessibleMenus = useUserStore((s) => s.authorityList);
  const callAppMenu = useAppStore((s) => s.callAppMenu);
  const appMenuGroupLoaded = useAppStore((s) => s.appMenuGroupLoaded);
  const callAllCode = useCodeStore((s) => s.callAllCode);
  const { APP_MENUS } = useAppMenu();
  const location = useLocation();
  const currentMenu = getFlattedMenus(APP_MENUS as any).find((fMenu) => fMenu.key === location.pathname);

  // use codeStore
  // React.useEffect(() => {
  //   if (!codeStoreLoaded && loaded && me) {
  //     callAllCode().then();
  //     callAppMenu().then();
  //   }
  // }, [callAllCode, callAppMenu, codeStoreLoaded, loaded, me]);

  React.useEffect(() => {
    if (loaded && me && !appMenuGroupLoaded) {
      callAllCode().then();
      callAppMenu().then();
    }
  }, [callAppMenu, loaded, me, appMenuGroupLoaded, callAllCode]);

  if (!loaded) {
    return null;
  }

  if (currentMenu && currentMenu.program_type && !accessibleMenus.includes(currentMenu.program_type)) {
    return <Navigate to={ROUTES.HOME.path} state={{ from: location }} replace />;
  }

  if (loaded && !me) {
    return <Navigate to={ROUTES.SIGN_IN.path} state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
