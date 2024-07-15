import { AXFDGDataItem, AXFDGPage, AXFDGSortParam } from "@axframe/datagrid";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { getTabStoreListener } from "@core/stores/usePageTabStore";
import { ProgramFn } from "@types";
import React from "react";
import { ROUTES } from "router/Routes";
import {
  GetSystemProgramRequest,
  PutSystemProgramRequest,
  SystemProgram,
  SystemProgramService,
  SystemUserGroup,
  SystemUserGroupService,
} from "services";
import { errorHandling } from "utils/errorHandling";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface ListRequest extends GetSystemProgramRequest {}

interface SaveRequest extends PutSystemProgramRequest {}

interface DetailResponse extends SystemProgram {}

interface DtoItem extends SystemProgram {}

interface MetaData {
  programFn?: ProgramFn;
  listRequestValue: ListRequest;
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
  listPage: AXFDGPage;
  saveSpinning: boolean;
  detailSpinning: boolean;
  userGroupSpinning: boolean;
  userGroupListData: SystemUserGroup[];
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSpinning: (spinning: boolean) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  setListSelectedRowKey: (key?: React.Key, detail?: DetailResponse) => void;
  callListApi: (request?: ListRequest, pageNumber?: number) => Promise<void>;
  changeListPage: (currentPage: number, pageSize?: number) => Promise<void>;
  setFlexGrow: (flexGlow: number) => void;

  setSaveRequestValue: (exampleSaveRequestValue: SaveRequest) => void;
  setSaveSpinning: (exampleSaveSpinning: boolean) => void;
  callSaveApi: (request?: SaveRequest) => Promise<void>;
  cancelFormActive: () => void;
  setFormActive: () => void;
  callUserGroupApi: () => Promise<void>;
  resetSaveRequestValue: () => void;
}

// create states
const createState: States = {
  routePath: ROUTES.SYSTEM.children.AUTH.children.PROGRAM.path,
  listRequestValue: { pageNumber: 1, pageSize: 100 },
  listColWidths: [],
  listSpinning: false,
  listData: [],
  listPage: {
    currentPage: 0,
    totalPages: 0,
  },
  listSortParams: [],
  listSelectedRowKey: "",
  flexGrow: 50,
  saveRequestValue: {},
  detail: {},
  saveSpinning: false,
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
  setListSelectedRowKey: async (key, detail) => {
    const { functions = [], userGroup = {}, ...rest } = detail ?? {};
    const _detail: SaveRequest = {
      functions,
      userGroup,
      ...rest,
    };
    set({ listSelectedRowKey: key, detail, saveRequestValue: _detail });
  },
  callListApi: async (request, pageNumber = 1) => {
    if (get().listSpinning) return;
    set({ listSpinning: true });

    try {
      const requestValue = request ?? get().listRequestValue;
      const apiParam: ListRequest = {
        ...requestValue,
        pageNumber,
      };
      const response = await SystemProgramService.getSystemProgram(apiParam);

      set({
        listData: response.ds.map((values) => ({
          values,
        })),
        listPage: {
          currentPage: response.page?.pageNumber ?? 1,
          pageSize: response.page?.pageSize ?? 0,
          totalPages: response.page?.endPageNo ?? 0,
          totalElements: response.page?.totalCount,
        },
      });
    } catch (err: any) {
      await errorHandling(err);
    } finally {
      set({ listSpinning: false });
    }
  },
  changeListPage: async (pageNumber, pageSize) => {
    const requestValues = {
      ...get().listRequestValue,
      pageNumber,
      pageSize,
    };
    set({ listRequestValue: requestValues });
    await get().callListApi(undefined, pageNumber);
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
      if (!apiParam) return;
      apiParam.__status__ = get().listSelectedRowKey ? "U" : "C";

      await SystemProgramService.putSystemProgram(apiParam);
      set({ detail: apiParam });
      await get().callListApi();
    } finally {
      await set({ saveSpinning: false });
    }
  },
  cancelFormActive: () => {
    set({ formActive: false, listSelectedRowKey: undefined });
  },
  setFormActive: () => {
    set({ formActive: true, detail: undefined, saveRequestValue: {} });
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
  resetSaveRequestValue: () => {
    set({ saveRequestValue: { ...get().detail } });
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
export interface ExampleListWithListStore extends States, Actions, PageStoreActions<States> {}

export const useProgramManagementStore = create(
  subscribeWithSelector<ExampleListWithListStore>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
useProgramManagementStore.subscribe(
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
