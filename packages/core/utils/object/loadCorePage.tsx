import { lazy, Suspense } from "react";
import { StoreSpinner } from "../../components";
import { ProgramType } from "../../scripts/@types";

export function loadCoreExample(pageName: keyof typeof ProgramType) {
  const Page = lazy(() => {
    return import(`../../pages/${pageName}/App.tsx`).catch(reason => {
      console.error(reason);
      return import("../../../../src/pages/error/Error404");
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
    return import(`../../system/${pageName}/App.tsx`).catch(reason => {
      console.error(reason);
      return import("../../../../src/pages/error/Error404");
    });
  });

  return (
    <Suspense fallback={<StoreSpinner spinning />}>
      <Page />
    </Suspense>
  );
}
