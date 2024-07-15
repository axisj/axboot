import { AXFDGDataItem, AXFDGPage, AXFDGSortParam } from "@axframe/datagrid";
import { EXAMPLE_ROUTERS } from "@core/router/exampleRouter";
import { ExampleItem, ExampleListRequest } from "@core/services/example/ExampleRepositoryInterface";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { getTabStoreListener } from "@core/stores/usePageTabStore";
import { ProgramFn } from "@types";
import { ExampleService } from "services";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface ListRequest extends ExampleListRequest {}

interface DetailRequest extends ExampleListRequest {}

interface DtoItem extends ExampleItem {}

interface MetaData {
  programFn?: ProgramFn;
  listRequestValue: ListRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  listSpinning: boolean;
  listData: AXFDGDataItem<DtoItem>[];
  listPage: AXFDGPage;
  detailSpinning: boolean;
  detail?: DtoItem;
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: ListRequest, changedValues?: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSpinning: (spinning: boolean) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  callListApi: (request?: ListRequest) => Promise<void>;
  changeListPage: (currentPage: number, pageSize?: number) => Promise<void>;
  setDetailSpinning: (detailSpinning: boolean) => void;
  callDetailApi: (request?: DetailRequest) => Promise<void>;
}

// create states
const createState: States = {
  routePath: EXAMPLE_ROUTERS.LIST_AND_DRAWER.path,
  listRequestValue: {
    pageNumber: 1,
    pageSize: 100,
  },
  listColWidths: [],
  listSpinning: false,
  listData: [],
  listPage: {
    currentPage: 0,
    totalPages: 0,
  },
  listSortParams: [],
  detailSpinning: false,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  syncMetadata: (s = createState) => set(s),
  onMountApp: async () => {},
  setListRequestValue: (requestValues) => {
    set({ listRequestValue: requestValues });
  },
  setListColWidths: (colWidths) => set({ listColWidths: colWidths }),
  setListSpinning: (spinning) => set({ listSpinning: spinning }),
  setListSortParams: (sortParams) => set({ listSortParams: sortParams }),
  callListApi: async (request) => {
    if (get().listSpinning) return;
    set({ listSpinning: true });

    try {
      const apiParam: ListRequest = { ...get().listRequestValue, ...request };
      const response = await ExampleService.list(apiParam);

      set({
        listRequestValue: apiParam,
        listData: response.ds.map((values) => ({
          values,
        })),
        listPage: {
          currentPage: response.page.pageNumber ?? 1,
          pageSize: response.page.pageSize ?? 0,
          totalPages: response.page.pageCount ?? 0,
          totalElements: response.page?.totalCount,
        },
      });
    } finally {
      set({ listSpinning: false });
    }
  },
  changeListPage: async (pageNumber, pageSize) => {
    await get().callListApi({
      pageNumber,
      pageSize,
    });
  },
  setDetailSpinning: (spinning) => set({ detailSpinning: spinning }),
  callDetailApi: async (request) => {
    set({ detailSpinning: true });

    try {
      const response = await ExampleService.detail(request);
      console.log(response);

      set({ detail: response.rs });
    } finally {
      set({ detailSpinning: false });
    }
  },

  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface $LIST_AND_DRAWER$Store extends States, Actions, PageStoreActions<States> {}

export const use$LIST_AND_DRAWER$Store = create(
  subscribeWithSelector<$LIST_AND_DRAWER$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

use$LIST_AND_DRAWER$Store.subscribe(
  (s): MetaData => ({
    programFn: s.programFn,
    listSortParams: s.listSortParams,
    listRequestValue: s.listRequestValue,
    listColWidths: s.listColWidths,
  }),
  getTabStoreListener<MetaData>(createState.routePath),
  { equalityFn: shallow },
);
