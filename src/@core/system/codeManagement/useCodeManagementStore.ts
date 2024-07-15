import { AXFDGDataItem, AXFDGDataItemStatus, AXFDGSortParam } from "@axframe/datagrid";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { getTabStoreListener } from "@core/stores/usePageTabStore";
import { addDataGridList, delDataGridList } from "@core/utils";
import { ProgramFn } from "@types";
import { ROUTES } from "router/Routes";
import { GetSystemCodeRequest, GetSystemCommonCodeRequest, SystemCommonCode, SystemCommonCodeService } from "services";
import { errorHandling } from "utils/errorHandling";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface ListRequest extends GetSystemCommonCodeRequest {}

interface ChildListRequest extends GetSystemCodeRequest {}

interface DtoItem extends SystemCommonCode {}

interface SubDtoItem extends SystemCommonCode {}

interface MetaData {
  programFn?: ProgramFn;
  requestValue: ListRequest;
  listColWidths: number[];
  listSortParams: AXFDGSortParam[];
  listSelectedRowKey?: string;
  flexGrow: number;
  childListColWidths: number[];
  childListSelectedRowKey?: string;
  childListCheckedIndexes?: number[];
  childListData: AXFDGDataItem<SubDtoItem>[];
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  spinning: boolean;
  childListSpinning: boolean;
  listData: AXFDGDataItem<DtoItem>[];
}

interface Actions extends PageStoreActions<States> {
  callListApi: (request?: ListRequest, pageNumber?: number) => Promise<void>;
  callChildListApi: (request?: ChildListRequest) => Promise<void>;
  callSaveApi: () => Promise<void>;
  setSpinning: (spinning: boolean) => void;

  setRequestValue: (requestValue: ListRequest) => void;
  setListColWidths: (colWidths: number[]) => void;
  setListSortParams: (sortParams: AXFDGSortParam[]) => void;
  setListSelectedRowKey: (key: string, name: string) => void;
  setFlexGrow: (flexGlow: number) => void;

  setChildListColWidths: (colWidths: number[]) => void;
  setChildListSelectedRowKey: (key?: string) => void;
  setChildListCheckedIndexes: (indexes?: number[]) => void;

  addChildListData: (list: SubDtoItem[]) => void;
  delChildListData: (indexes: number[]) => void;
  setChildListData: (list: AXFDGDataItem<SubDtoItem>[], reset?: boolean) => void;
}

// create states
const createState: States = {
  routePath: ROUTES.SYSTEM.children.CODE.path,
  requestValue: {},
  listColWidths: [],
  listSortParams: [],
  listSelectedRowKey: undefined,
  flexGrow: 40,

  spinning: false,
  childListSpinning: false,
  listData: [],

  childListColWidths: [],
  childListSelectedRowKey: undefined,
  childListCheckedIndexes: [],
  childListData: [],
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  onMountApp: async () => {},
  callListApi: async (request) => {
    if (get().spinning) return;
    set({ spinning: true });

    try {
      const apiParam = request ?? get().requestValue;
      const response = await SystemCommonCodeService.getSystemCodeGroup(apiParam);

      set({
        listData: response.ds.map((values) => ({
          values,
        })),
      });
    } catch (err: any) {
      await errorHandling(err);
    } finally {
      set({ spinning: false });
    }
  },
  callChildListApi: async () => {
    set({ childListSpinning: true, childListData: [], childListSelectedRowKey: "" });

    try {
      if (!get().listSelectedRowKey) return;

      const response = await SystemCommonCodeService.getSystemCode({
        grpCd: get().listSelectedRowKey,
        grpCdCond: "IS",
        useYn: "Y",
        cdLvl: "1",
      });

      set({
        childListData: response.ds.map((values) => ({
          values,
        })),
      });
    } catch (err: any) {
      await errorHandling(err);
    } finally {
      set({ childListSpinning: false });
    }
  },
  callSaveApi: async () => {
    set({ spinning: true });

    const listData = get().listData;

    const listDataCollector = (item) => {
      const ITEM_STAT = {
        [AXFDGDataItemStatus.new]: "C",
        [AXFDGDataItemStatus.edit]: "U",
        [AXFDGDataItemStatus.remove]: "D",
      };

      const grp = listData.find((n) => n.values.grpCd === item.values.grpCd);
      const useYn = item.status === AXFDGDataItemStatus.remove ? "N" : item.values.useYn;
      return {
        ...item.values,
        grpCdNm: grp?.values.grpCdNm,
        useYn,
        __status__: ITEM_STAT[item.status ?? AXFDGDataItemStatus.edit],
      };
    };

    try {
      await SystemCommonCodeService.putSystemCode(get().childListData.map(listDataCollector));
      await get().callChildListApi();
    } finally {
      set({ spinning: false });
    }
  },
  setSpinning: (spinning) => set({ spinning }),
  setRequestValue: (requestValues) => set({ requestValue: requestValues }),
  setListColWidths: (colWidths) => set({ listColWidths: colWidths }),
  setListSortParams: (sortParams) => set({ listSortParams: sortParams }),
  setListSelectedRowKey: (key, name) => {
    set({
      listSelectedRowKey: key,
      childListSelectedRowKey: "",
      childListCheckedIndexes: [],
    });
  },
  setFlexGrow: (flexGlow) => set({ flexGrow: flexGlow }),

  setChildListColWidths: (colWidths) => set({ childListColWidths: colWidths }),
  setChildListSelectedRowKey: (key) => set({ childListSelectedRowKey: key }),
  setChildListCheckedIndexes: (indexes) => set({ childListCheckedIndexes: indexes }),
  addChildListData: (list) => {
    const listAData = addDataGridList<SubDtoItem>(get().childListData ?? [], list);
    set({ childListData: [...listAData] });
  },
  delChildListData: (indexes) => {
    const listData = delDataGridList(get().childListData ?? [], indexes);
    set({ childListData: [...listData], childListCheckedIndexes: [] });
  },
  setChildListData: (list, reset) => {
    if (reset) {
      set({
        childListCheckedIndexes: [],
        childListSelectedRowKey: undefined,
        childListData: list,
      });
    } else {
      set({ childListData: list });
    }
  },

  syncMetadata: (s = createState) => {
    const metaData: MetaData = {
      programFn: s.programFn,
      requestValue: s.requestValue,
      listColWidths: s.listColWidths,
      listSortParams: s.listSortParams,
      listSelectedRowKey: s.listSelectedRowKey,
      flexGrow: s.flexGrow,
      childListColWidths: s.childListColWidths,
      childListSelectedRowKey: s.childListSelectedRowKey,
      childListCheckedIndexes: s.childListCheckedIndexes,
      childListData: s.childListData,
    };
    set(metaData);
  },

  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface codeManagementStore extends States, Actions, PageStoreActions<States> {}

export const useCodeManagementStore = create(
  subscribeWithSelector<codeManagementStore>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
useCodeManagementStore.subscribe(
  (s): MetaData => ({
    programFn: s.programFn,
    requestValue: s.requestValue,
    listColWidths: s.listColWidths,
    listSortParams: s.listSortParams,
    listSelectedRowKey: s.listSelectedRowKey,
    flexGrow: s.flexGrow,
    childListColWidths: s.childListColWidths,
    childListSelectedRowKey: s.childListSelectedRowKey,
    childListCheckedIndexes: s.childListCheckedIndexes,
    childListData: s.childListData,
  }),
  getTabStoreListener<MetaData>(createState.routePath),
  { equalityFn: shallow },
);

useCodeManagementStore.subscribe(
  (s) => [s.listSelectedRowKey],
  ([listSelectedRowKey]) => {
    useCodeManagementStore.getState().callChildListApi();
  },
  { equalityFn: shallow },
);
