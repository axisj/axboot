import { apiWrapper } from "../../apiWrapper";
import {
  DeleteSystemMenuRequest,
  DeleteSystemMenuResponse,
  GetSystemMenuResponse,
  PutSystemMenuOrderRequest,
  PutSystemMenuOrderResponse,
  PutSystemMenuRequest,
  PutSystemMenuResponse,
  SystemMenuRepositoryInterface,
} from "./SystemMenuRepositoryInterface";

export class SystemMenuRepository extends SystemMenuRepositoryInterface {
  async getSystemMenu(params): Promise<GetSystemMenuResponse> {
    const { data } = await apiWrapper<GetSystemMenuResponse>("get", "/v1/menu", params);
    return data;
  }

  async putSystemMenu(params: PutSystemMenuRequest): Promise<PutSystemMenuResponse> {
    await apiWrapper("put", "/system/code", [
      {
        grpCd: "MENU_GROUP",
        code: params.menuGrpCd,
        grpCdNm: "메뉴그룹",
        codeNm: params.multiLang?.ko,
        multiLang: params.multiLang,
        useYn: "Y",
        __status__: "U",
      },
    ]);

    await apiWrapper<PutSystemMenuResponse>("put", "/system/menu", params);

    return {};
  }

  async deleteSystemMenu(params: DeleteSystemMenuRequest): Promise<DeleteSystemMenuResponse> {
    await apiWrapper("get", `/system/menu/remove/${params.menuGrpCd}`);
    return {};
  }

  async PutSystemMenuOrder(params: PutSystemMenuOrderRequest): Promise<PutSystemMenuOrderResponse> {
    await apiWrapper("put", "/system/code/sort", params.list);
    return {};
  }
}
