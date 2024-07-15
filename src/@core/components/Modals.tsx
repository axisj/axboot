import React from "react";
import { useModalStore } from "stores";
import { Loading } from "./common";

function Modals() {
  const modals = useModalStore((s) => s.modals);
  return (
    <>
      {[...modals].map(
        ([
          key,
          {
            modal: { modalFactory },
            resolve,
            reject,
            open,
            onClose,
            afterClose,
          },
        ]) => {
          if (modalFactory) {
            return (
              <React.Suspense fallback={<Loading active />} key={key}>
                {modalFactory(open, resolve, reject, onClose, afterClose)}
              </React.Suspense>
            );
          }

          return null;
        },
      )}
    </>
  );
}

export { Modals };
