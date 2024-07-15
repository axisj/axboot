import React from "react";
import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import { usePageTabStore, useUserStore } from "stores";
import { StoreSpinner } from "../@core/components";
import { EXAMPLE_ROUTERS } from "../@core/router/exampleRouter";
import { loadCoreExample, loadCoreSystem } from "../@core/utils/object";
import RequireAuth from "./RequireAuth";
import RestrictAuth from "./RestrictAuth";
import { ROUTES, ROUTES_LIST } from "./Routes";
import { useAppMenu } from "./useAppMenu";

const FrameDefault = React.lazy(() => import("pageFrame/FrameDefault"));
const FrameProgram = React.lazy(() => import("pageFrame/FrameProgram"));

const Home = React.lazy(() => import("pages/home/App"));
const SignIn = React.lazy(() => import("pages/signIn/App"));
const Error404 = React.lazy(() => import("pages/error/Error404"));
const ModalDemo = React.lazy(() => import("@core/modals/demo/App"));

/* ##IMPORT_COMPONENT_POSITION## */

function PageRoute() {
  const setSelectedMenuUuid = useUserStore((s) => s.setSelectedMenuUuid);
  const setActiveTabByPath = usePageTabStore((s) => s.setActiveTabByPath);
  const { MENUS_LIST } = useAppMenu();
  const location = useLocation();

  React.useEffect(() => {
    const route = ROUTES_LIST.find((route) => matchPath(route.path, location.pathname));
    if (!route) {
      return;
    }

    const currentMenu = MENUS_LIST.find((m) => m.progCd && m.progCd === route.program_type);
    setSelectedMenuUuid(currentMenu?.keyPath?.join("_") ?? "");

    setActiveTabByPath(location.pathname);
  }, [MENUS_LIST, location.pathname, setActiveTabByPath, setSelectedMenuUuid]);

  return (
    <React.Suspense fallback={<StoreSpinner spinning />}>
      <Routes>
        <Route
          element={
            <RequireAuth>
              <FrameProgram />
            </RequireAuth>
          }
        >
          <Route path={EXAMPLE_ROUTERS.FORM.path} element={loadCoreExample("FORM")} />
          <Route path={EXAMPLE_ROUTERS.LIST.path} element={loadCoreExample("LIST")} />
          <Route path={EXAMPLE_ROUTERS.DETAIL.path} element={loadCoreExample("DETAIL")} />
          <Route path={EXAMPLE_ROUTERS.LIST_AND_MODAL.path} element={loadCoreExample("LIST_AND_MODAL")} />
          <Route path={EXAMPLE_ROUTERS.LIST_AND_DRAWER.path} element={loadCoreExample("LIST_AND_DRAWER")} />
          <Route path={EXAMPLE_ROUTERS.LIST_WITH_LIST.path} element={loadCoreExample("LIST_WITH_LIST")} />
          <Route path={EXAMPLE_ROUTERS.LIST_WITH_FORM.path} element={loadCoreExample("LIST_WITH_FORM")} />
          <Route path={EXAMPLE_ROUTERS.LIST_WITH_FORM_LIST.path} element={loadCoreExample("LIST_WITH_FORM_LIST")} />
          <Route path={EXAMPLE_ROUTERS.LIST_WITH_FORM_ROW.path} element={loadCoreExample("LIST_WITH_FORM_ROW")} />
          <Route path={EXAMPLE_ROUTERS.THREE_LIST.path} element={loadCoreExample("THREE_LIST")} />
          <Route path={EXAMPLE_ROUTERS.STATS.path} element={loadCoreExample("STATS")} />
          <Route path={EXAMPLE_ROUTERS.EXAMPLE_CALENDAR.path} element={loadCoreExample("CALENDAR")} />
          <Route path={EXAMPLE_ROUTERS.LIST_AND_MODAL_MF.path} element={loadCoreExample("LIST_AND_MODAL_MF")} />

          <Route path={ROUTES.SYSTEM.children.CODE.path} element={loadCoreSystem("codeManagement")} />
          <Route path={ROUTES.SYSTEM.children.AUTH.children.USER.path} element={loadCoreSystem("userManagement")} />
          <Route
            path={ROUTES.SYSTEM.children.AUTH.children.USER_GROUP.path}
            element={loadCoreSystem("userGroupManagement")}
          />
          <Route
            path={ROUTES.SYSTEM.children.AUTH.children.PROGRAM.path}
            element={loadCoreSystem("programManagement")}
          />
          <Route path={ROUTES.SYSTEM.children.AUTH.children.MENU.path} element={loadCoreSystem("menuManagement")} />

          {/* ##INSERT_ROUTE_POSITION## */}

          <Route path={ROUTES.HOME.path} element={<Home />} />
        </Route>
        <Route
          element={
            <RestrictAuth>
              <FrameDefault />
            </RestrictAuth>
          }
        >
          <Route path={ROUTES.SIGN_IN.path} element={<SignIn />} />
        </Route>

        <Route path={"dev-modal"} element={<ModalDemo />} />
        <Route path={"*"} element={<Error404 />} />
      </Routes>
    </React.Suspense>
  );
}

export default PageRoute;
