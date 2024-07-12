import { AXFDGDataItem, AXFDGPage, AXFDGSortParam } from "@axframe/datagrid";
import { EXAMPLE_ROUTERS } from "@axboot/core/router/exampleRouter";
import { ExampleItem, ExampleListRequest } from "@axboot/core/services/example/ExampleRepositoryInterface";
import { pageStoreActions } from "@axboot/core/stores/pageStoreActions";
import { PageStoreActions, StoreActions } from "@axboot/core/stores/types";
import { getTabStoreListener } from "@axboot/core/stores/usePageTabStore";
import { ProgramFn } from "../../../../src/@types";
import { ExampleService } from "../../../../src/services";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface ListRequest extends ExampleListRequest {}

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
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: ListRequest, changedValues?: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSpinning: (spinning: boolean) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  callListApi: (request?: ListRequest) => Promise<void>;
  changeListPage: (currentPage: number, pageSize?: number) => Promise<void>;
}

// create states
const createState: States = {
  routePath: EXAMPLE_ROUTERS.LIST_AND_MODAL.path,
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
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  syncMetadata: (s = createState) => set(s),
  onMountApp: async () => {},
  setListRequestValue: requestValues => {
    set({ listRequestValue: requestValues });
  },
  setListColWidths: colWidths => set({ listColWidths: colWidths }),
  setListSpinning: spinning => set({ listSpinning: spinning }),
  setListSortParams: sortParams => set({ listSortParams: sortParams }),
  callListApi: async request => {
    if (get().listSpinning) return;
    set({ listSpinning: true });

    try {
      const apiParam: ListRequest = { ...get().listRequestValue, ...request };
      const response = await ExampleService.list(apiParam);

      set({
        listRequestValue: apiParam,
        listData: response.ds.map(values => ({
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

  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface $LIST_AND_MODAL$Store extends States, Actions, PageStoreActions<States> {}

export const use$LIST_AND_MODAL$Store = create(
  subscribeWithSelector<$LIST_AND_MODAL$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
use$LIST_AND_MODAL$Store.subscribe(
  (s): MetaData => ({
    programFn: s.programFn,
    listSortParams: s.listSortParams,
    listRequestValue: s.listRequestValue,
    listColWidths: s.listColWidths,
  }),
  getTabStoreListener<MetaData>(createState.routePath),
  { equalityFn: shallow },
);
