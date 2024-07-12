import { apiWrapper } from "../../apiWrapper";
import {
  GetAllSystemCommonCodeComboRequest,
  GetAllSystemCommonCodeComboResponse,
  GetSystemCodeGroupRequest,
  GetSystemCodeGroupResponse,
  GetSystemCodeResponse,
  GetSystemCommonCodeComboRequest,
  GetSystemCommonCodeComboResponse,
  GetSystemCommonCodeRequest,
  GetSystemCommonCodeResponse,
  PutSystemCodeRequest,
  PutSystemCodeResponse,
  SystemCommonCodeRepositoryInterface,
} from "./SystemCommonCodeRepositoryInterface";

export class SystemCommonCodeRepository implements SystemCommonCodeRepositoryInterface {
  async getSystemCommonCode(params: GetSystemCommonCodeRequest): Promise<GetSystemCommonCodeResponse> {
    const { data } = await apiWrapper<GetSystemCommonCodeResponse>("get", "/v1/code", {
      pageSize: params.pageSize,
      pageNumber: params.pageNumber,
      ...params,
    });
    return data;
  }

  async getSystemCommonCodeCombo(params: GetSystemCommonCodeComboRequest): Promise<GetSystemCommonCodeComboResponse> {
    const { data } = await apiWrapper<GetSystemCommonCodeComboResponse>("get", "/v1/code", {
      ...params,
      useYn: params.useYn ?? "Y",
      prntCd: "ALL",
    });
    return data;
  }

  async getAllSystemCommonCodeCombo(
    params: GetAllSystemCommonCodeComboRequest,
  ): Promise<GetAllSystemCommonCodeComboResponse> {
    const { data } = await apiWrapper<GetAllSystemCommonCodeComboResponse>("get", "/v1/code", {
      ...params,
      useYn: params.useYn ?? "Y",
      prntCd: "ALL",
      cache: true,
    });
    return data;
  }

  async getSystemCodeGroup(params: GetSystemCodeGroupRequest): Promise<GetSystemCodeGroupResponse> {
    const { data } = await apiWrapper<GetSystemCodeGroupResponse>("get", "/v1/code/group", params);
    return data;
  }

  async getSystemCode(params): Promise<GetSystemCodeResponse> {
    const { data } = await apiWrapper<GetSystemCodeResponse>("get", "/v1/code", {
      ...params,
    });
    return data;
  }

  async putSystemCode(params: PutSystemCodeRequest[]): Promise<PutSystemCodeResponse> {
    const { data } = await apiWrapper<PutSystemCodeResponse>("put", "/system/code", params);
    return data;
  }
}
