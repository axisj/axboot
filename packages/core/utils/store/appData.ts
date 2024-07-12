import { getCookie, setCookie } from "@axboot/core/utils";
import LZUTF8 from "lzutf8";

interface AppData {
  name: string;
  version: string;
  authorization: string;
  refreshToken: string;
}

export function setAppData(values: AppData) {
  setCookie(
    "appData",
    LZUTF8.compress(JSON.stringify(values), {
      outputEncoding: "StorageBinaryString",
    }),
    undefined,
    { path: "/" },
  );
}

export function clearAppData() {
  setCookie("appData", "", -1);
}

export function getAppData(): AppData | null {
  const appData = getCookie("appData");
  if (appData) {
    try {
      return JSON.parse(
        LZUTF8.decompress(appData, {
          inputEncoding: "StorageBinaryString",
        }),
      );

      // console.log("state", state.me);
    } finally {
      /* empty */
    }
  }

  return null;
}
