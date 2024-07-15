import { AppMenuGroup, User } from "services";

export const getAppMenuMockData: AppMenuGroup[] = [
  {
    menuGrpCd: "_",
    multiLang: { ko: "", en: "" },
    children: [
      {
        multiLang: {
          en: "Center",
          ko: "Center",
        },
        iconTy: "Default",
        progCd: "CENTER",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Teacher",
          ko: "Teacher",
        },
        iconTy: "Default",
        progCd: "TEACHER",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Member",
          ko: "Member",
        },
        iconTy: "Default",
        progCd: "MEMBER",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Schedule",
          ko: "Schedule",
        },
        iconTy: "Default",
        progCd: "SCHEDULE",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "SalaryGrade",
          ko: "SalaryGrade",
        },
        iconTy: "Default",
        progCd: "SALARY_GRADE",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Request",
          ko: "Request",
        },
        iconTy: "Default",
        progCd: "REQUEST",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "UseRequest",
          ko: "UseRequest",
        },
        iconTy: "Default",
        progCd: "USE_REQUEST",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Question",
          ko: "Question",
        },
        iconTy: "Default",
        progCd: "QUESTION",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Compliment",
          ko: "Compliment",
        },
        iconTy: "Default",
        progCd: "COMPLIMENT",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "CenterInfo",
          ko: "CenterInfo",
        },
        iconTy: "Default",
        progCd: "CENTER_INFO",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Teacher",
          ko: "Teacher",
        },
        iconTy: "Default",
        progCd: "TEACHER",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "StatMonth",
          ko: "StatMonth",
        },
        iconTy: "Default",
        progCd: "USE_REQUEST_STAT_MONTH",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "StatChart",
          ko: "StatChart",
        },
        iconTy: "Default",
        progCd: "USE_REQUEST_STAT_CHART",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Notice",
          ko: "Notice",
        },
        iconTy: "Default",
        progCd: "NOTICE",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Overtime",
          ko: "Overtime",
        },
        iconTy: "Default",
        progCd: "OVERTIME",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Budget",
          ko: "Budget",
        },
        iconTy: "Default",
        progCd: "BUDGET",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "BigDataSample",
          ko: "BigDataSample",
        },
        iconTy: "Default",
        progCd: "BIG_DATA_SAMPLE",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      /* ##INSERT_MENU_POSITION## */
    ],
    userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
  },
  {
    menuGrpCd: "EXAMPLE",
    multiLang: {
      ko: "예제",
      en: "Examples",
    },
    iconTy: "Example",
    children: [
      {
        multiLang: {
          en: "Forms",
          ko: "양식",
        },
        iconTy: "Default",
        progCd: "EXAMPLE_FORM",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "List",
          ko: "목록",
        },
        iconTy: "Default",
        progCd: "EXAMPLE_LIST",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "List & Drawer",
          ko: "목록과 서랍",
        },
        iconTy: "Default",
        progCd: "EXAMPLE_LIST_AND_DRAWER",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "List & Modal",
          ko: "목록과 모달",
        },
        iconTy: "Default",
        progCd: "EXAMPLE_LIST_AND_MODAL",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "List & Form",
          ko: "목록과 양식",
        },
        iconTy: "Default",
        progCd: "EXAMPLE_LIST_WITH_FORM",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "List & Form & List",
          ko: "목록과 양식-목록",
        },
        iconTy: "Default",
        progCd: "EXAMPLE_LIST_WITH_FORM_LIST",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "List & List",
          ko: "목록과 목록",
        },
        iconTy: "Default",
        progCd: "EXAMPLE_LIST_WITH_LIST",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Three List",
          ko: "3개 목록",
        },
        iconTy: "Default",
        progCd: "EXAMPLE_THREE_LIST",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
      {
        multiLang: {
          en: "Stats",
          ko: "통계",
        },
        iconTy: "Default",
        progCd: "EXAMPLE_STATS",
        children: [],
        userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
      },
    ],
    userGroup: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
  },
];

export const signInMockData: User = {
  userNm: "시스템사용자",
  userCd: "system",
  timeZone: 9,
  locale: "en",
  authorityList: ["ROLE_ADMIN", "ROLE_ASP", "ROLE_USER"],
  programList: [
    "EXAMPLE_DETAIL",
    "EXAMPLE_FORM",
    "EXAMPLE_LIST",
    "EXAMPLE_LIST_AND_DRAWER",
    "EXAMPLE_LIST_AND_MODAL",
    "EXAMPLE_LIST_WITH_FORM",
    "EXAMPLE_LIST_WITH_FORM_ROW",
    "EXAMPLE_LIST_WITH_FORM_LIST",
    "EXAMPLE_LIST_WITH_LIST",
    "EXAMPLE_THREE_LIST",
    "EXAMPLE_STATS",
    "CENTER",
    "TEACHER",
    "MEMBER",
    "SCHEDULE",
    "SALARY_GRADE",
    "REQUEST",
    "USE_REQUEST",
    "QUESTION",
    "COMPLIMENT",
    "CENTER_INFO",
    "TEACHER",
    "USE_REQUEST_STAT_MONTH",
    "USE_REQUEST_STAT_CHART",
    "NOTICE",
    "OVERTIME",
    "BUDGET",
    "BIG_DATA_SAMPLE",
    /* ##INSERT_PROGRAM_TYPE_POSITION## */
  ],
  email: "tom@axisj.com",
  compCd: "V100",
  centerCode: "V100",
  centerIdx: 1,
  centerName: "V100",
};
