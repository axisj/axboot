import { AXFDGDataItem, AXFDGPage, AXFDGSortParam } from "@axframe/datagrid";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { getTabStoreListener } from "@core/stores/usePageTabStore";
import { ProgramFn } from "@types";
import React from "react";
import { ROUTES } from "router/Routes";
import {
  SystemUserGroup,
  SystemUserGroupListRequest,
  SystemUserGroupMember,
  SystemUserGroupMemberListRequest,
  SystemUserGroupSaveRequest,
  SystemUserGroupService,
} from "services";
import { errorHandling } from "utils/errorHandling";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface ListRequest extends SystemUserGroupListRequest {}

interface SaveRequest extends SystemUserGroupSaveRequest {}

interface DetailResponse extends SystemUserGroup {}

interface SubListRequest extends SystemUserGroupMemberListRequest {}

interface DtoItem extends SystemUserGroup {}

interface MetaData {
  programFn?: ProgramFn;
  listRequestValue: ListRequest;
  subListRequestValue: SubListRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
  listSelectedRowKey?: React.Key;
  flexGrow: number;
  saveRequestValue: SaveRequest;
  detail?: DetailResponse;
  formActive: boolean;
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  listSpinning: boolean;
  listData: AXFDGDataItem<DtoItem>[];
  saveSpinning: boolean;
  detailSpinning: boolean;
  subListData: AXFDGDataItem<SystemUserGroupMember>[];
  subListPage: AXFDGPage;
  subListSpinning: boolean;
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: ListRequest) => void;
  setSubListRequestValue: (requestValue: SubListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSpinning: (spinning: boolean) => void;
  setSubListSpinning: (spinning: boolean) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  setListSelectedRowKey: (key?: React.Key, detail?: DetailResponse) => void;
  callListApi: (request?: ListRequest, pageNumber?: number) => Promise<void>;
  callSubListApi: (request?: SubListRequest) => Promise<void>;
  changeSubListPage: (currentPage: number, pageSize?: number) => Promise<void>;
  setFlexGrow: (flexGlow: number) => void;

  setSaveRequestValue: (exampleSaveRequestValue: SaveRequest) => void;
  setSaveSpinning: (exampleSaveSpinning: boolean) => void;
  callSaveApi: (request?: SaveRequest) => Promise<void>;
  cancelFormActive: () => void;
  setFormActive: () => void;
}

// create states
const createState: States = {
  routePath: ROUTES.SYSTEM.children.AUTH.children.USER_GROUP.path,
  listRequestValue: { pageNumber: 1, pageSize: 100 },
  listColWidths: [],
  listSpinning: false,
  listData: [],
  listSortParams: [],
  listSelectedRowKey: "",
  flexGrow: 50,
  saveRequestValue: {},
  detail: {},
  saveSpinning: false,
  detailSpinning: false,
  formActive: true,
  subListRequestValue: { pageNumber: 1, pageSize: 100 },
  subListData: [],
  subListPage: {
    currentPage: 0,
    totalPages: 0,
  },
  subListSpinning: false,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  onMountApp: async () => {},
  setListRequestValue: (requestValues) => {
    set({ listRequestValue: requestValues });
  },
  setSubListRequestValue: (requestValues) => {
    set({ subListRequestValue: requestValues });
  },
  setListColWidths: (colWidths) => set({ listColWidths: colWidths }),
  setListSpinning: (spinning) => set({ listSpinning: spinning }),
  setListSortParams: (sortParams) => set({ listSortParams: sortParams }),
  setListSelectedRowKey: async (key, detail) => {
    set({ listSelectedRowKey: key, detail, saveRequestValue: detail ?? {} });
    // await get().callDetailApi();
    await get().callSubListApi();
  },
  callListApi: async (request) => {
    if (get().listSpinning) return;
    set({ listSpinning: true });

    try {
      const apiParam = request ?? get().listRequestValue;
      const response = await SystemUserGroupService.list(apiParam);

      set({
        listData: response.ds.map((values) => ({
          values,
        })),
      });
    } catch (err: any) {
      await errorHandling(err);
    } finally {
      set({ listSpinning: false });
    }
  },
  setSubListSpinning: (spinning) => set({ subListSpinning: spinning }),
  callSubListApi: async (request) => {
    set({ subListSpinning: true });

    try {
      const apiParam = request ?? get().subListRequestValue;
      apiParam["roles"] = get().detail?.code;
      const response = await SystemUserGroupService.subList(apiParam);

      set({
        subListData: response.ds.map((values) => ({
          values,
        })),
        subListPage: {
          currentPage: response.page?.pageNumber ?? 1,
          pageSize: response.page?.pageSize ?? 0,
          totalPages: response.page?.endPageNo ?? 0,
          totalElements: response.page?.totalCount,
        },
      });
    } catch (err: any) {
      await errorHandling(err);
    } finally {
      set({ subListSpinning: false });
    }
  },
  changeSubListPage: async (pageNumber, pageSize) => {
    const requestValues = {
      ...get().subListRequestValue,
      pageNumber,
      pageSize,
    };
    set({ subListRequestValue: requestValues });
    await get().callSubListApi();
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
      const apiParam = { ...get().saveRequestValue };

      if (!apiParam) return;
      apiParam.__status__ = get().listSelectedRowKey ? "U" : "C";

      const response = await SystemUserGroupService.save(apiParam);

      console.log(response);
    } catch (err: any) {
      await errorHandling(err);
    } finally {
      set({ saveSpinning: false });
    }
  },
  cancelFormActive: () => {
    set({ formActive: false, listSelectedRowKey: undefined });
  },
  setFormActive: () => {
    set({ formActive: true, detail: undefined, saveRequestValue: undefined });
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
      subListRequestValue: s.subListRequestValue,
    };
    set(metaData);
  },
  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface ExampleListWithListStore extends States, Actions, PageStoreActions<States> {}

export const useUserGroupManagementStore = create(
  subscribeWithSelector<ExampleListWithListStore>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
useUserGroupManagementStore.subscribe(
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
    subListRequestValue: s.subListRequestValue,
  }),
  getTabStoreListener<MetaData>(createState.routePath),
  { equalityFn: shallow },
);
