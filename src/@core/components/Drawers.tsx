import React from "react";
import { useDrawerStore } from "stores";
import { Loading } from "./common";

function Drawers() {
  const drawers = useDrawerStore((s) => s.drawers);
  return (
    <>
      {[...drawers].map(
        ([
          key,
          {
            drawer: { drawerFactory },
            resolve,
            reject,
            open,
            onClose,
            afterOpenChange,
          },
        ]) => {
          if (drawerFactory) {
            return (
              <React.Suspense fallback={<Loading active />} key={key}>
                {drawerFactory(open, resolve, reject, onClose, afterOpenChange)}
              </React.Suspense>
            );
          }

          return null;
        },
      )}
    </>
  );
}

export { Drawers };
