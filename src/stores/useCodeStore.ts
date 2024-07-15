import { StoreActions } from "@core/stores/types";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { SystemCommonCodeService } from "../services";
import { useAppStore } from "./useAppStore";
import { useUserStore } from "./useUserStore";

export interface CodeOption {
  labels: {
    en: string;
    ko: string;
  };
  label: string;
  value: string;
  sort: number;
  level: number;
}

export interface Code {
  name: string;
  label: string;
  defaultValue: string;
  options: CodeOption[];
  record: Record<string, any>;
}

export interface CodeModel {
  loaded: boolean;

  USE_YN: Code;
  YN: Code;
  REPLY_YN: Code;
  SERVICE_TYPE: Code;
  ETC_SERVICE_TYPE: Code;
  CENTER_TYPE: Code;
  REQ_STATUS: Code;
  END_STATUS: Code;
  PAY_METHOD: Code;
  PAY_STATUS: Code;
  ASSMT_CERT_YN: Code;
  CHARACTERISTIC: Code;
  TEACHER_STATUS: Code;
  TEACHER_JOB_TYPE: Code;
  WOEK_TYPE: Code;
  USE_TIME: Code;
}

export interface CodeActions {
  callAllCode: () => Promise<void>;
}

export interface codeStore extends CodeModel, CodeActions {}

export const createState = {
  loaded: false,
  YN: {
    options: [
      { label: "예", value: "Y" },
      { label: "아니오", value: "N" },
    ],
    defaultValue: "Y",
  },
  REPLY_YN: {
    options: [
      { label: "답변완료", value: "Y" },
      { label: "미답변", value: "N" },
    ],
    defaultValue: "",
  },
  SERVICE_TYPE: {
    options: [
      { label: "365형", value: "365형" },
      { label: "주말형", value: "주말형" },
      { label: "주말(서울)형", value: "주말(서울)형" },
    ],
    defaultValue: "365형",
  },
  ETC_SERVICE_TYPE: {
    options: [
      { label: "365", value: "365" },
      { label: "주말", value: "주말" },
      { label: "주말공휴일", value: "주말공휴일" },
    ],
    defaultValue: "365",
  },
  CENTER_TYPE: {
    options: [
      { label: "국공립", value: "국공립" },
      { label: "사회복지법인", value: "사회복지법인" },
    ],
    defaultValue: "국공립(구립)",
  },
  REQ_STATUS: {
    options: [
      { label: "신청", value: "신청" },
      { label: "확정", value: "확정" },
      { label: "대기", value: "대기" },
      { label: "취소", value: "취소" },
      { label: "취소요청", value: "취소요청" },
    ],
    defaultValue: "신청",
  },
  END_STATUS: {
    options: [
      { label: "이용중", value: "이용중" },
      { label: "이용완료", value: "이용완료" },
      { label: "미이용", value: "미이용" },
    ],
    defaultValue: "이용중",
  },
  PAY_METHOD: {
    options: [
      { label: "계좌이체", value: "계좌이체" },
      { label: "정부지원(국민행복카드)", value: "정부지원(국민행복카드)" },
    ],
    defaultValue: "계좌이체",
  },
  PAY_STATUS: {
    options: [
      { label: "미납", value: "미납" },
      { label: "완료", value: "완료" },
    ],
    defaultValue: "미납",
  },
  ASSMT_CERT_YN: {
    options: [
      { label: "평가참여(A)", value: "A" },
      { label: "평가참여(B)", value: "B" },
      { label: "평가참여(C)", value: "C" },
      { label: "평가참여(D)", value: "D" },
    ],
    defaultValue: "A",
  },
  CHARACTERISTIC: {
    options: [
      { label: "장애아통합", value: "장애아통합" },
      { label: "시간연장형", value: "시간연장형" },
      { label: "24시간", value: "24시간" },
      { label: "시간제", value: "시간제" },
    ],
    defaultValue: "장애아통합",
  },
  TEACHER_STATUS: {
    options: [
      { label: "재직", value: "재직" },
      { label: "퇴직", value: "퇴직" },
      { label: "출산휴가", value: "출산휴가" },
      { label: "육아휴직", value: "육아휴직" },
      { label: "병가", value: "병가" },
    ],
    defaultValue: "재직",
  },
  TEACHER_JOB_TYPE: {
    options: [
      { label: "전담교사", value: "전담교사" },
      { label: "전담교사(시급채용)", value: "전담교사(시급채용)" },
      { label: "돌봄지원교사", value: "돌봄지원교사" },
      { label: "휴게지원교사", value: "휴게지원교사" },
      { label: "휴게지원교사(시급채용)", value: "휴게지원교사(시급채용)" },
      { label: "원장", value: "원장" },
    ],
    defaultValue: "전담교사",
  },
  WOEK_TYPE: {
    options: [
      { label: "휴일(휴게)", value: "휴일(휴게)" },
      { label: "휴일", value: "휴일" },
      { label: "연장", value: "연장" },
      { label: "야간(40초과)", value: "야간(40초과)" },
      { label: "야간(40이내)", value: "야간(40이내)" },
    ],
    defaultValue: "휴일(휴게)",
  },
  USE_TIME: {
    options: [
      { value: "00:00:00", label: "00시" },
      { value: "01:00:00", label: "01시" },
      { value: "02:00:00", label: "02시" },
      { value: "03:00:00", label: "03시" },
      { value: "04:00:00", label: "04시" },
      { value: "05:00:00", label: "05시" },
      { value: "06:00:00", label: "06시" },
      { value: "07:00:00", label: "07시" },
      { value: "08:00:00", label: "08시" },
      { value: "09:00:00", label: "09시" },
      { value: "10:00:00", label: "10시" },
      { value: "11:00:00", label: "11시" },
      { value: "12:00:00", label: "12시" },
      { value: "13:00:00", label: "13시" },
      { value: "14:00:00", label: "14시" },
      { value: "15:00:00", label: "15시" },
      { value: "16:00:00", label: "16시" },
      { value: "17:00:00", label: "17시" },
      { value: "18:00:00", label: "18시" },
      { value: "19:00:00", label: "19시" },
      { value: "20:00:00", label: "20시" },
      { value: "21:00:00", label: "21시" },
      { value: "22:00:00", label: "22시" },
      { value: "23:00:00", label: "23시" },
      { value: "24:00:00", label: "24시" },
    ],
  },
} as CodeModel;

const createActions: StoreActions<CodeModel & CodeActions, CodeActions> = (set, get) => ({
  setLoaded: (loaded: boolean) => set({ loaded }),
  callAllCode: async () => {
    const currentLanguage = useAppStore.getState().currentLanguage;
    try {
      const data = await SystemCommonCodeService.getAllSystemCommonCodeCombo({});
      const map = {};
      data.ds.forEach((n) => {
        if (n.grpCd) {
          if (map[n.grpCd]) {
            const labels = { en: n.codeEngNm, ko: n.codeNm };
            map[n.grpCd].options.push({
              labels,
              label: labels[currentLanguage],
              value: n.code,
              sort: n.sort,
              level: n.cdLvl,
            });

            map[n.grpCd].record[n.code] = labels[currentLanguage];
          } else {
            const labels = { en: n.codeEngNm, ko: n.codeNm };
            map[n.grpCd] = {
              name: n.grpCd,
              label: n.grpCdNm,
              defaultValue: n.code,
              options: [
                {
                  labels,
                  label: labels[currentLanguage],
                  value: n.code,
                  sort: n.sort,
                  level: n.cdLvl,
                },
              ],
              record: {
                [n.code ?? ""]: labels[currentLanguage],
              },
            };
          }
        }
      });

      set(map);
      set({ loaded: true });
    } catch (e: any) {
      if (e.code === "401") {
        await useUserStore.getState().signOut();
        return;
      }
      console.error(e);
    } finally {
      set({ loaded: true });
    }
  },
});

export const useCodeStore = create(
  subscribeWithSelector<codeStore>((set, get) => ({
    ...createState,
    ...createActions(set, get),
  })),
);
