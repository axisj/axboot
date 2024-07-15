import { delay } from "@core/utils";
import {
  DeleteSystemMenuRequest,
  DeleteSystemMenuResponse,
  GetSystemMenuResponse,
  PutSystemMenuOrderRequest,
  PutSystemMenuOrderResponse,
  PutSystemMenuResponse,
  SystemMenuRepositoryInterface,
} from "./SystemMenuRepositoryInterface";

export class SystemMenuRepositoryMock implements SystemMenuRepositoryInterface {
  async getSystemMenu(params): Promise<GetSystemMenuResponse> {
    await delay(500);
    return {
      ds: [
        {
          menuGrpCd: "SYSTEM_MANAGER",
          multiLang: {
            ko: "시스템 매니져",
            en: "SYSTEM_MANAGER",
          },
          level: 0,
          sort: 1,
          children: [
            {
              menuId: 1,
              multiLang: {
                ko: "회원가입",
                en: "Sign Up",
              },
              level: 1,
              sort: 1,
              progCd: "testCd",
              children: [
                {
                  menuId: 3,
                  multiLang: {
                    ko: "회원가입-1",
                    en: "USER-1",
                  },
                  level: 2,
                  sort: 1,
                  progCd: "testCd",
                  children: [],
                },
                {
                  menuId: 4,
                  multiLang: {
                    ko: "회원가입-2",
                    en: "USER-2",
                  },
                  level: 2,
                  sort: 2,
                  progCd: "testCd",
                  children: [],
                },
              ],
            },
            {
              menuId: 2,
              multiLang: {
                ko: "메뉴2",
                en: "menu2",
              },
              level: 1,
              sort: 1,
              progCd: "testCd",
              children: [],
            },
          ],
          userGroup: ["ROLE_ADMIN"],
        },
        {
          menuGrpCd: "SYSTEM_MENU",
          multiLang: {
            ko: "시스템 메뉴",
            en: "SYSTEM_MENU",
          },
          level: 0,
          sort: 1,
          children: [
            {
              menuId: 1,
              multiLang: {
                ko: "회원가입",
                en: "Sign Up",
              },
              level: 1,
              sort: 1,
              progCd: "testCd",
              children: [],
            },
          ],
          userGroup: ["ROLE_ADMIN"],
        },
      ],
    };
  }

  async putSystemMenu(params): Promise<PutSystemMenuResponse> {
    await delay(500);
    return {
      rs: {
        menuId: 1,
        multiLang: {
          ko: "회원가입",
          en: "Sign Up",
        },
        level: 1,
        sort: 1,
        progCd: "testCd",
        children: [],
      },
    };
  }

  async deleteSystemMenu(params: DeleteSystemMenuRequest): Promise<DeleteSystemMenuResponse> {
    await delay(500);
    return {};
  }

  async PutSystemMenuOrder(params: PutSystemMenuOrderRequest): Promise<PutSystemMenuOrderResponse> {
    await delay(500);
    return {};
  }
}
