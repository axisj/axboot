import { lazy, Suspense } from "react";
import { StoreSpinner } from "../../components";
import { ProgramType } from "../../scripts/@types";

export function loadCoreExample(pageName: keyof typeof ProgramType) {
  const Page = lazy(() => {
    return import(`../../../@core/pages/${pageName}/App.tsx`).catch((reason) => {
      console.error(reason);
      return import("pages/error/Error404");
    });
  });

  return (
    <Suspense fallback={<StoreSpinner spinning />}>
      <Page />
    </Suspense>
  );
}

export function loadCoreSystem(pageName: string) {
  const Page = lazy(() => {
    return import(`../../../@core/system/${pageName}/App.tsx`).catch((reason) => {
      console.error(reason);
      return import("pages/error/Error404");
    });
  });

  return (
    <Suspense fallback={<StoreSpinner spinning />}>
      <Page />
    </Suspense>
  );
}
