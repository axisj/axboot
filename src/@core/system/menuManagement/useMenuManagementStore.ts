import { AXFDGSortParam } from "@axframe/datagrid";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { getTabStoreListener } from "@core/stores/usePageTabStore";
import { ProgramFn } from "@types";
import React from "react";
import { ROUTES } from "router/Routes";
import {
  GetSystemMenuRequest,
  SystemMenuGroup,
  SystemMenuService,
  SystemUserGroup,
  SystemUserGroupService,
} from "services";
import { errorHandling } from "utils/errorHandling";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface ListRequest extends GetSystemMenuRequest {}

interface SaveRequest extends SystemMenuGroup {}

interface DtoItem extends SystemMenuGroup {}

interface MetaData {
  programFn?: ProgramFn;
  listRequestValue: ListRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
  listSelectedRowKey?: React.Key;
  flexGrow: number;
  saveRequestValue?: SaveRequest;
  detail?: DtoItem;
  formActive: boolean;
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  listSpinning: boolean;
  listData: DtoItem[];
  saveSpinning: boolean;
  deleteSpinning: boolean;
  detailSpinning: boolean;
  userGroupSpinning: boolean;
  userGroupListData: SystemUserGroup[];
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSpinning: (spinning: boolean) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  setListSelectedItem: (item: DtoItem) => void;
  callListApi: (request?: ListRequest, pageNumber?: number) => Promise<void>;
  setFlexGrow: (flexGlow: number) => void;

  setSaveRequestValue: (exampleSaveRequestValue: SaveRequest) => void;
  setSaveSpinning: (exampleSaveSpinning: boolean) => void;
  callSaveApi: (request?: SaveRequest) => Promise<void>;
  callDeleteApi: (menuGrpCd: string) => Promise<void>;
  cancelFormActive: () => void;
  setFormActive: () => void;
  callUserGroupApi: () => Promise<void>;
  callSaveOrderApi: (
    list: {
      grpCd: string;
      code: string;
    }[],
  ) => Promise<void>;
}

// create states
const createState: States = {
  routePath: ROUTES.SYSTEM.children.AUTH.children.MENU.path,
  listRequestValue: { pageNumber: 1, pageSize: 100 },
  listColWidths: [],
  listSpinning: false,
  listData: [],
  listSortParams: [],
  listSelectedRowKey: "",
  flexGrow: 30,
  saveSpinning: false,
  deleteSpinning: false,
  detailSpinning: false,
  formActive: true,
  userGroupListData: [],
  userGroupSpinning: false,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  onMountApp: async () => {
    await get().callUserGroupApi();
  },
  setListRequestValue: (requestValues) => {
    set({ listRequestValue: requestValues });
  },
  setListColWidths: (colWidths) => set({ listColWidths: colWidths }),
  setListSpinning: (spinning) => set({ listSpinning: spinning }),
  setListSortParams: (sortParams) => set({ listSortParams: sortParams }),
  setListSelectedItem: async (item) => {
    item.multiLang = {
      ko: item.multiLang.ko ?? "",
      en: item.multiLang.en ?? "",
    };
    set({ listSelectedRowKey: item.menuGrpCd, detail: { ...item }, saveRequestValue: { ...item } });
  },
  callListApi: async (request) => {
    set({ listSpinning: true });

    try {
      const apiParam = request ?? get().listRequestValue;
      const response = await SystemMenuService.getSystemMenu(apiParam);

      set({
        listData: response.ds,
      });
    } catch (err: any) {
      await errorHandling(err);
    } finally {
      set({ listSpinning: false });
    }
  },

  setFlexGrow: (flexGlow) => {
    set({ flexGrow: flexGlow });
  },
  setSaveRequestValue: (exampleSaveRequestValue) => {
    set({ saveRequestValue: exampleSaveRequestValue });
  },
  setSaveSpinning: (exampleSaveSpinning) => set({ saveSpinning: exampleSaveSpinning }),
  callSaveApi: async (request) => {
    set({ saveSpinning: true });

    try {
      const apiParam = request ?? get().saveRequestValue;
      const listSelectedRowKey = get().listSelectedRowKey;
      if (!apiParam) return;
      apiParam.__status__ = listSelectedRowKey ? "U" : "C";

      await SystemMenuService.putSystemMenu(apiParam);
      set({ detail: apiParam });
      await get().callListApi();
    } finally {
      set({ saveSpinning: false });
    }
  },
  callDeleteApi: async (menuGrpCd) => {
    set({ deleteSpinning: true });

    try {
      await SystemMenuService.deleteSystemMenu({ menuGrpCd });
      get().cancelFormActive();
      await get().callListApi();
    } finally {
      set({ deleteSpinning: false });
    }
  },
  cancelFormActive: () => {
    set({ formActive: false, listSelectedRowKey: undefined });
  },
  setFormActive: () => {
    set({ formActive: true, listSelectedRowKey: undefined, detail: undefined, saveRequestValue: undefined });
  },
  callUserGroupApi: async () => {
    set({ userGroupSpinning: true });
    try {
      const response = await SystemUserGroupService.list({});
      set({ userGroupListData: response.ds });
    } catch (err: any) {
      await errorHandling(err);
    } finally {
      set({ userGroupSpinning: false });
    }
  },
  callSaveOrderApi: async (list: any[]) => {
    set({ listSpinning: true });
    try {
      await SystemMenuService.PutSystemMenuOrder({
        list,
      });
      await get().callListApi();
    } catch (err: any) {
      await errorHandling(err);
    } finally {
      set({ listSpinning: false });
    }
  },

  syncMetadata: (s = createState) => {
    const metaData: MetaData = {
      programFn: s.programFn,
      listSortParams: s.listSortParams,
      listRequestValue: s.listRequestValue,
      listColWidths: s.listColWidths,
      listSelectedRowKey: s.listSelectedRowKey,
      flexGrow: s.flexGrow,
      saveRequestValue: s.saveRequestValue,
      detail: s.detail,
      formActive: s.formActive,
    };
    set(metaData);
  },
  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface menuManagementStore extends States, Actions, PageStoreActions<States> {}

export const useMenuManagementStore = create(
  subscribeWithSelector<menuManagementStore>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
useMenuManagementStore.subscribe(
  (s): MetaData => ({
    programFn: s.programFn,
    listSortParams: s.listSortParams,
    listRequestValue: s.listRequestValue,
    listColWidths: s.listColWidths,
    listSelectedRowKey: s.listSelectedRowKey,
    flexGrow: s.flexGrow,
    saveRequestValue: s.saveRequestValue,
    detail: s.detail,
    formActive: s.formActive,
  }),
  getTabStoreListener<MetaData>(createState.routePath),
  { equalityFn: shallow },
);
