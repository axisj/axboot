import { AXFDGDataItem, AXFDGPage, AXFDGSortParam } from "@axframe/datagrid";
import { FilterType, IFilter } from "@axboot/core/components/multiFilter";
import { getFiltersValues } from "@axboot/core/components/multiFilter/utils";
import { EXAMPLE_ROUTERS } from "@axboot/core/router/exampleRouter";
import { ExampleItem, ExampleListRequest } from "@axboot/core/services/example/ExampleRepositoryInterface";
import { pageStoreActions } from "@axboot/core/stores/pageStoreActions";
import { PageStoreActions, StoreActions } from "@axboot/core/stores/types";
import { getTabStoreListener } from "@axboot/core/stores/usePageTabStore";
import { ProgramFn } from "../../../../src/@types";
import debounce from "lodash/debounce";
import memoize from "memoize";
import { ExampleService } from "../../../../src/services";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface ListRequest extends ExampleListRequest {}

interface DtoItem extends ExampleItem {}

interface MetaData {
  programFn?: ProgramFn;
  filters: IFilter[];
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
  setFilters: (filters: IFilter[]) => Promise<void>;
}

// create states
const createState: States = {
  routePath: EXAMPLE_ROUTERS.LIST_AND_MODAL_MF.path,
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
  filters: [{ name: "cust", type: FilterType.STRING, value: "" }],
};

const memoGetList = memoize(ExampleService.list, { cacheKey: JSON.stringify, maxAge: 10000 });

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
      const listRequestValue: ListRequest = { ...get().listRequestValue, ...request };
      const apiParam: ListRequest = {
        ...getFiltersValues(get().filters),
        ...listRequestValue,
      };
      const response = await memoGetList(apiParam);

      set({
        listRequestValue,
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
  setFilters: async filters => {
    set({ filters });
    await de_CallListApi({ pageNumber: 1 });
  },

  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface $LIST_AND_MODAL_MF$Store extends States, Actions, PageStoreActions<States> {}

export const use$LIST_AND_MODAL_MF$Store = create(
  subscribeWithSelector<$LIST_AND_MODAL_MF$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

const de_CallListApi = debounce(use$LIST_AND_MODAL_MF$Store.getState().callListApi, 500);

// pageModel 에 저장할 대상 모델 셀렉터 정의
use$LIST_AND_MODAL_MF$Store.subscribe(
  (s): MetaData => ({
    programFn: s.programFn,
    listSortParams: s.listSortParams,
    listRequestValue: s.listRequestValue,
    listColWidths: s.listColWidths,
    filters: s.filters,
  }),
  getTabStoreListener<MetaData>(createState.routePath),
  { equalityFn: shallow },
);
