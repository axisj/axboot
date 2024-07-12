import buildStore from "@axboot/core/stores/buildStore";
import { StoreActions } from "@axboot/core/stores/types";
import { Tooltip } from "antd";
import i18n, { LanguageType } from "@src/i18n";
import { themePalette, ThemeType } from "@src/styles/theme";
import { AppMenuGroup, AppService } from "../services";

export type NavPosition = {
  top: "top";
  left: "left";
};

export interface AppModel {
  loaded: boolean;
  currentLanguage: LanguageType;
  theme: ThemeType;
  sideMenuOpened: boolean;
  sideBoxOpened: boolean;
  width: number;
  height: number;
  appMenuGroups: AppMenuGroup[];
  appMenuGroupSpinning: boolean;
  appMenuGroupLoaded: boolean;
  fullScreen: boolean;
  navPosition: keyof NavPosition;
}

export interface AppActions {
  setLanguage: (language: LanguageType) => void;
  setTheme: (theme: ThemeType) => void;
  setLoaded: (loaded: boolean) => void;
  setSideMenuOpened: (sideMenuOpened: boolean) => void;
  setWidthHeight: (width: number, height: number) => void;
  setSideBoxOpened: (sideBoxOpened: boolean) => void;
  callAppMenu: () => Promise<void>;
  setFullScreen: (fullScreen: boolean) => void;
  setNavPosition: (navPosition: keyof NavPosition) => void;
}

export interface AppStore extends AppModel, AppActions {}

export const appInitialState: AppModel = {
  loaded: false,
  currentLanguage: "ko",
  theme: "light",
  sideMenuOpened: true,
  sideBoxOpened: true,
  width: 0,
  height: 0,
  appMenuGroups: [],
  appMenuGroupSpinning: false,
  appMenuGroupLoaded: false,
  fullScreen: false,
  navPosition: "left",
};

const getAppStoreActions: StoreActions<AppModel & AppActions, AppActions> = (set, get) => ({
  setLanguage: (language: LanguageType) => set({ currentLanguage: language }),
  setTheme: (theme: ThemeType) => {
    set({ theme });
    if (Tooltip.defaultProps) {
      Tooltip.defaultProps.color = themePalette[theme].tooltip_bg;
    }
  },
  setLoaded: (loaded: boolean) => set({ loaded }),
  setSideMenuOpened: (sideMenuOpened: boolean) => set({ sideMenuOpened }),
  setWidthHeight: (width, height) => set({ width, height }),
  callAppMenu: async () => {
    set({ appMenuGroupSpinning: true });
    try {
      const data = await AppService.getAppMenu({});
      set({ appMenuGroups: data.ds, appMenuGroupLoaded: true });
    } finally {
      set({ appMenuGroupSpinning: false });
    }
  },
  setFullScreen: (fullScreen: boolean) => set({ fullScreen }),
  setSideBoxOpened: (sideBoxOpened: boolean) => set({ sideBoxOpened }),
  setNavPosition: (navPosition: keyof NavPosition) => set({ navPosition }),
});

export const useAppStore = buildStore<AppStore>("app", 1, (set, get) => ({
  ...appInitialState,
  ...getAppStoreActions(set, get),
}));

useAppStore.persist.onFinishHydration(state => {
  state.appMenuGroupLoaded = false;

  i18n.changeLanguage(state.currentLanguage);

  if (!state.loaded) {
    state.setLoaded(true);
  }
});

window["appStore"] = useAppStore;
