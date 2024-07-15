import { AXFDGDataItem, AXFDGDataItemStatus } from "@axframe/datagrid";
import { EXAMPLE_ROUTERS } from "@core/router/exampleRouter";
import { ExampleListRequest, ExampleSubItem } from "@core/services/example/ExampleRepositoryInterface";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { getTabStoreListener } from "@core/stores/usePageTabStore";
import { addDataGridList, delDataGridList } from "@axboot/core/utils";
import { ProgramFn } from "@types";
import React from "react";
import { ExampleService } from "services";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface ListRequest extends ExampleListRequest {}

interface DtoItem extends ExampleSubItem {}

interface MetaData {
  programFn?: ProgramFn;
  listRequestValue: ListRequest;

  listAColWidths: number[];
  listASelectedRowKey?: React.Key;
  listACheckedIndexes?: number[];

  listBColWidths: number[];
  listBSelectedRowKey?: React.Key;
  listBCheckedIndexes?: number[];

  listCColWidths: number[];
  listCSelectedRowKey?: React.Key;
  listCCheckedIndexes?: number[];
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  spinning: boolean;

  listAData: AXFDGDataItem<DtoItem>[];
  listBData: AXFDGDataItem<DtoItem>[];
  listCData: AXFDGDataItem<DtoItem>[];
}

interface Actions extends PageStoreActions<States> {
  setRequestValue: (requestValue: ListRequest, changedValues?: ListRequest) => void;
  callListApi: (request?: ListRequest) => Promise<void>;
  callSaveApi: () => Promise<void>;
  setSpinning: (spinning: boolean) => void;

  setListAColWidths: (colWidths: number[]) => void;
  setListASelectedRowKey: (key?: React.Key) => void;
  setListACheckedIndexes: (indexes?: number[]) => void;
  setListBColWidths: (colWidths: number[]) => void;
  setListBSelectedRowKey: (key?: React.Key) => void;
  setListBCheckedIndexes: (indexes?: number[]) => void;
  setListCColWidths: (colWidths: number[]) => void;
  setListCSelectedRowKey: (key?: React.Key) => void;
  setListCCheckedIndexes: (indexes?: number[]) => void;

  addListAData: (list: DtoItem[]) => void;
  delListAData: (indexes: number[]) => void;
  setListAData: (list: AXFDGDataItem<DtoItem>[], reset?: boolean) => void;
  addListBData: (list: DtoItem[]) => void;
  delListBData: (indexes: number[]) => void;
  setListBData: (list: AXFDGDataItem<DtoItem>[], reset?: boolean) => void;
  addListCData: (list: DtoItem[]) => void;
  delListCData: (indexes: number[]) => void;
  setListCData: (list: AXFDGDataItem<DtoItem>[], reset?: boolean) => void;
}

// create states
const createState: States = {
  routePath: EXAMPLE_ROUTERS.THREE_LIST.path,
  listRequestValue: {},
  spinning: false,

  listAColWidths: [],
  listASelectedRowKey: "",
  listACheckedIndexes: [],
  listAData: [],
  listBColWidths: [],
  listBSelectedRowKey: "",
  listBCheckedIndexes: [],
  listBData: [],
  listCColWidths: [],
  listCSelectedRowKey: "",
  listCCheckedIndexes: [],
  listCData: [],
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  syncMetadata: (s = createState) => set(s),
  onMountApp: async () => {},
  setRequestValue: (requestValue) => {
    set({ listRequestValue: requestValue });
  },
  setSpinning: (spinning) => {
    set({ spinning: spinning });
  },
  callListApi: async () => {
    if (get().spinning) return;
    set({ spinning: true });

    try {
      const apiParam = get().listRequestValue;
      const response = await ExampleService.childList(apiParam);

      set({
        listAData: response.ds.map((values) => ({
          values,
        })),
        listBData: response.ds.map((values) => ({
          values,
        })),
        listCData: response.ds.map((values) => ({
          values,
        })),
      });
    } finally {
      set({ spinning: false });
    }
  },
  callSaveApi: async () => {
    if (get().spinning) return;
    set({ spinning: true });

    const listDataCollector = (item) => {
      const ITEM_STAT = {
        [AXFDGDataItemStatus.new]: "C",
        [AXFDGDataItemStatus.edit]: "U",
        [AXFDGDataItemStatus.remove]: "D",
      };
      return { ...item.values, status: ITEM_STAT[item.status ?? AXFDGDataItemStatus.edit] };
    };

    try {
      await ExampleService.childListSave({
        list: get().listAData.map(listDataCollector),
      });
      await ExampleService.childListSave({
        list: get().listBData.map(listDataCollector),
      });
      await ExampleService.childListSave({
        list: get().listCData.map(listDataCollector),
      });
    } finally {
      set({ spinning: false });
    }
  },

  setListAColWidths: (colWidths) => {
    set({ listAColWidths: colWidths });
  },
  setListASelectedRowKey: (key) => {
    set({ listASelectedRowKey: key });
  },
  setListACheckedIndexes: (indexes) => {
    set({ listACheckedIndexes: indexes });
  },
  setListBColWidths: (colWidths) => {
    set({ listBColWidths: colWidths });
  },
  setListBSelectedRowKey: (key) => {
    set({ listBSelectedRowKey: key });
  },
  setListBCheckedIndexes: (indexes) => {
    set({ listBCheckedIndexes: indexes });
  },
  setListCColWidths: (colWidths) => {
    set({ listCColWidths: colWidths });
  },
  setListCSelectedRowKey: (key) => {
    set({ listCSelectedRowKey: key });
  },
  setListCCheckedIndexes: (indexes) => {
    set({ listCCheckedIndexes: indexes });
  },

  addListAData: (list) => {
    const listData = addDataGridList<DtoItem>(get().listAData ?? [], list);
    set({ listAData: [...listData] });
  },
  delListAData: (indexes) => {
    const listData = delDataGridList(get().listAData ?? [], indexes);
    set({ listAData: [...listData], listACheckedIndexes: [] });
  },
  setListAData: (list, reset) => {
    if (reset) {
      set({
        listACheckedIndexes: [],
        listASelectedRowKey: undefined,
        listAData: list,
      });
    } else {
      set({ listAData: list });
    }
  },
  addListBData: (list) => {
    const listData = addDataGridList<DtoItem>(get().listBData ?? [], list);
    set({ listBData: [...listData] });
  },
  delListBData: (indexes) => {
    const listData = delDataGridList(get().listBData ?? [], indexes);
    set({ listBData: [...listData], listBCheckedIndexes: [] });
  },
  setListBData: (list, reset) => {
    if (reset) {
      set({
        listBCheckedIndexes: [],
        listBSelectedRowKey: undefined,
        listBData: list,
      });
    } else {
      set({ listBData: list });
    }
  },
  addListCData: (list) => {
    const listData = addDataGridList<DtoItem>(get().listCData ?? [], list);
    set({ listCData: [...listData] });
  },
  delListCData: (indexes) => {
    const listData = delDataGridList(get().listCData ?? [], indexes);
    set({ listCData: [...listData], listCCheckedIndexes: [] });
  },
  setListCData: (list, reset) => {
    if (reset) {
      set({
        listCCheckedIndexes: [],
        listCSelectedRowKey: undefined,
        listCData: list,
      });
    } else {
      set({ listCData: list });
    }
  },

  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface $LIST_WITH_LIST$Store extends States, Actions, PageStoreActions<States> {}

export const use$THREE_LIST$Store = create(
  subscribeWithSelector<$LIST_WITH_LIST$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

// pageModel 에 저장할 대상 모델 셀렉터 정의
use$THREE_LIST$Store.subscribe(
  (s): MetaData => ({
    programFn: s.programFn,
    listRequestValue: s.listRequestValue,
    listAColWidths: s.listAColWidths,
    listASelectedRowKey: s.listASelectedRowKey,
    listACheckedIndexes: s.listACheckedIndexes,
    listBColWidths: s.listBColWidths,
    listBSelectedRowKey: s.listBSelectedRowKey,
    listBCheckedIndexes: s.listBCheckedIndexes,
    listCColWidths: s.listCColWidths,
    listCSelectedRowKey: s.listCSelectedRowKey,
    listCCheckedIndexes: s.listCCheckedIndexes,
  }),
  getTabStoreListener<MetaData>(createState.routePath),
  { equalityFn: shallow },
);
