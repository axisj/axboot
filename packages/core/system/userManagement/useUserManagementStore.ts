import { AXFDGDataItem, AXFDGPage, AXFDGSortParam } from "@axframe/datagrid";
import { pageStoreActions } from "@axboot/core/stores/pageStoreActions";
import { PageStoreActions, StoreActions } from "@axboot/core/stores/types";
import { getTabStoreListener } from "@axboot/core/stores/usePageTabStore";
import { ProgramFn } from "../../../../src/@types";
import React from "react";
import { ROUTES } from "../../../../src/router/Routes";
import {
  GetSystemUsersRequest,
  PutSystemUsersRequest,
  SystemUser,
  SystemUserGroup,
  SystemUserGroupService,
  SystemUserService,
} from "../../../../src/services";
import { errorHandling, phoneNumFormat } from "../../../../src/utils";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface ListRequest extends GetSystemUsersRequest {}

interface SaveRequest extends PutSystemUsersRequest {
  userPassword?: string;
}

interface DtoItem extends SystemUser {}

interface MetaData {
  programFn?: ProgramFn;
  listRequestValue: ListRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
  listSelectedRowKey?: React.Key;
  flexGrow: number;
  saveRequestValue?: SaveRequest;
  detail?: SaveRequest;
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
  dupCheckSpinning: boolean;
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSpinning: (spinning: boolean) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  setListSelectedRowKey: (key?: React.Key, detail?: DtoItem) => void;
  callListApi: (request?: ListRequest, pageNumber?: number) => Promise<void>;
  changeListPage: (currentPage: number, pageSize?: number) => Promise<void>;
  setFlexGrow: (flexGlow: number) => void;

  setSaveRequestValue: (requestValue: SaveRequest) => void;
  setSaveSpinning: (spinning: boolean) => void;
  callSaveApi: (request?: SaveRequest) => Promise<void>;
  cancelFormActive: () => void;
  setFormActive: () => void;
  callUserGroupApi: () => Promise<void>;
  callIdDupCheckApi: (request?: DtoItem) => Promise<void>;
  callResetOptApi: (request?: any) => Promise<void>;
}

// create states
const createState: States = {
  routePath: ROUTES.SYSTEM.children.AUTH.children.USER.path,
  listRequestValue: { pageNumber: 0, pageSize: 100 },
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
  userGroupSpinning: false,
  userGroupListData: [],
  dupCheckSpinning: false,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  onMountApp: async () => {},
  setListRequestValue: requestValues => {
    set({ listRequestValue: requestValues });
  },
  setListColWidths: colWidths => set({ listColWidths: colWidths }),
  setListSpinning: spinning => set({ listSpinning: spinning }),
  setListSortParams: sortParams => set({ listSortParams: sortParams }),
  setListSelectedRowKey: async (key, detail) => {
    // set({ listSelectedRowKey: key });
    // await get().callDetailApi();

    if (detail) detail.hpNo = phoneNumFormat(detail.hpNo ?? "");

    set({ listSelectedRowKey: key, detail, saveRequestValue: detail ?? {} });
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
      const response = await SystemUserService.getSystemUsers(apiParam);

      set({
        listData: response.ds.map(values => ({
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
  setFlexGrow: flexGlow => {
    set({ flexGrow: flexGlow });
  },
  setSaveRequestValue: requestValue => {
    set({ saveRequestValue: requestValue });
  },
  setSaveSpinning: spinning => set({ saveSpinning: spinning }),
  callSaveApi: async request => {
    set({ saveSpinning: true });

    try {
      const apiParam = request ?? get().saveRequestValue;
      if (!apiParam) return;
      apiParam.__status__ = get().listSelectedRowKey ? "U" : "C";

      await SystemUserService.putSystemUsers(apiParam);
    } finally {
      set({ saveSpinning: false });
    }
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
  callIdDupCheckApi: async request => {
    set({ dupCheckSpinning: true });
    try {
      const apiParam = request ?? {};
      const response = await SystemUserService.getUsersExists(apiParam);

      console.log("response", response);
    } catch (err: any) {
      await errorHandling(err);
    } finally {
      set({ dupCheckSpinning: false });
    }
  },
  callResetOptApi: async request => {
    set({ saveSpinning: true });

    try {
      await SystemUserService.putSystemUserResetOtp(request);
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
    };
    set(metaData);
  },
  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface ExampleListWithListStore extends States, Actions, PageStoreActions<States> {}

export const useUserManagementStore = create(
  subscribeWithSelector<ExampleListWithListStore>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
useUserManagementStore.subscribe(
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
