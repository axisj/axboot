import { EXAMPLE_ROUTERS } from "@core/router/exampleRouter";
import { pageStoreActions } from "@core/stores/pageStoreActions";
import { PageStoreActions, StoreActions } from "@core/stores/types";
import { getTabStoreListener } from "@core/stores/usePageTabStore";
import { ProgramFn } from "@types";
import dayjs from "dayjs";
import { ExampleService, ExampleTodoItem, GetTodoRequest } from "services";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface DtoItem extends ExampleTodoItem {}

interface ListRequest {
  baseMonth?: dayjs.Dayjs;
}

interface MetaData {
  programFn?: ProgramFn;
  listRequestValue: ListRequest;
}

interface States extends MetaData {
  routePath: string; // initialized Store;
  listData: DtoItem[];
  listSpinning: boolean;
}

interface Actions extends PageStoreActions<States> {
  setListRequestValue: (requestValue: ListRequest, changedValues?: ListRequest) => void;
  callListApi: (request?: ListRequest) => Promise<void>;
}

// create states
const createState: States = {
  routePath: EXAMPLE_ROUTERS.EXAMPLE_CALENDAR.path,
  listRequestValue: {
    baseMonth: dayjs(),
  },
  listSpinning: false,
  listData: [],
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  syncMetadata: (s = createState) => set(s),
  onMountApp: async () => {
    set({
      listRequestValue: {
        ...get().listRequestValue,
      },
    });
  },
  setListRequestValue: (requestValues, changedValues) => {
    set({ listRequestValue: requestValues, listData: [] });
  },

  callListApi: async (request) => {
    if (get().listSpinning) return;
    set({ listSpinning: true });

    try {
      const requestValue = get().listRequestValue;

      const apiParam: GetTodoRequest = {
        ...requestValue,
        ...request,
        baseMonth: dayjs(requestValue.baseMonth).format("YYYY-MM"),
      };

      const res = await ExampleService.getTodo(apiParam);
      set({ listData: res.ds ?? {} });

      console.log(apiParam);
    } finally {
      set({ listSpinning: false });
    }
  },

  ...pageStoreActions(set, get, { createState }),
});

// ---------------- exports
export interface calendarStore extends States, Actions, PageStoreActions<States> {}

export const use$CALENDAR$Store = create(
  subscribeWithSelector<calendarStore>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);

use$CALENDAR$Store.subscribe(
  (s): MetaData => ({
    programFn: s.programFn,
    listRequestValue: s.listRequestValue,
  }),
  getTabStoreListener<MetaData>(createState.routePath),
  { equalityFn: shallow },
);
