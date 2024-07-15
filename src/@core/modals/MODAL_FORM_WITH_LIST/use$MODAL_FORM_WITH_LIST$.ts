import { CustomError } from "@core/services/CustomError";
import { StoreActions } from "@core/stores/types";
import { convertDateToString } from "@core/utils/object";
import { getI18n } from "hooks";
import { ExampleItem, ExampleListRequest, ExampleSaveRequest, ExampleService, ExampleSubItem } from "services";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ListRequest extends ExampleListRequest {}

interface DtoItem extends ExampleItem {}

interface DtoSubItem extends ExampleSubItem {}

interface SaveRequest extends ExampleSaveRequest {
  childList?: DtoSubItem[];
}

interface States {
  listRequestValue: ListRequest;
  item: DtoItem;
  childList: DtoSubItem[];
  saveSpinning: boolean;
}

interface Actions {
  init: (state?: Partial<States>) => void;
  reset: () => void;
  setItem: (item: DtoItem) => void;
  setChildList: (childList: DtoSubItem[]) => void;
  callSaveApi: () => Promise<void>;
}

// create states
const createState: States = {
  listRequestValue: {},
  item: {},
  childList: [],
  saveSpinning: false,
};

// create actions
const createActions: StoreActions<States & Actions, Actions> = (set, get) => ({
  init: (state) => {
    set(state ?? createState);
  },
  reset: () => {
    console.log("reset~~~");
    set(createState);
  },
  setItem: (item) => set({ item }),
  setChildList: (childList) => {
    set({ childList });
  },
  callSaveApi: async () => {
    const { t } = getI18n();
    if (get().saveSpinning) return;
    set({ saveSpinning: true });

    try {
      const apiParam: SaveRequest = {
        ...get().item,
        childList: get().childList ?? [],
      };

      if (!apiParam.childList || apiParam.childList.length < 1) {
        throw new CustomError(t("추가된 아이템이 없습니다. 아이템을 추가후 저장을 눌러주세요."));
      }

      // validate apiParam
      apiParam.__status__ = "U";

      await ExampleService.save(convertDateToString(apiParam));
    } finally {
      set({ saveSpinning: false });
    }
  },
});

// ---------------- exports
export interface $MODAL_FORM_WITH_LIST$Store extends States, Actions {}

export const use$MODAL_FORM_WITH_LIST$Store = create(
  subscribeWithSelector<$MODAL_FORM_WITH_LIST$Store>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);
