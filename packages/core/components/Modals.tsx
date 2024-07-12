import React from "react";
import { useModalStore } from "../../../src/stores";

function Modals() {
  const modals = useModalStore(s => s.modals);
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
              <React.Fragment key={key}>{modalFactory(open, resolve, reject, onClose, afterClose)}</React.Fragment>
            );
          }

          return null;
        },
      )}
    </>
  );
}

export { Modals };
