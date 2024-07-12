import { apiWrapper } from "../../apiWrapper";
import {
  SystemUserGroupListRequest,
  SystemUserGroupListResponse,
  SystemUserGroupMemberDeleteResponse,
  SystemUserGroupMemberInsertResponse,
  SystemUserGroupMemberListResponse,
  SystemUserGroupRepositoryInterface,
  SystemUserGroupSaveRequest,
  SystemUserGroupSaveResponse,
} from "./SystemUserGroupRepositoryInterface";

export class SystemUserGroupRepository implements SystemUserGroupRepositoryInterface {
  async list(params: SystemUserGroupListRequest): Promise<SystemUserGroupListResponse> {
    const { data } = await apiWrapper<SystemUserGroupListResponse>("get", "/v1/code", {
      grpCd: "USER_ROLE",
      grpCdCond: "IS",
      useYn: "Y",
      cdLvl: 1,
      ...params,
    });
    return data;
  }

  async save(params: SystemUserGroupSaveRequest): Promise<SystemUserGroupSaveResponse> {
    const { data } = await apiWrapper<SystemUserGroupSaveResponse>("put", "/system/code", [
      {
        grpCd: "USER_ROLE",
        grpCdNm: "사용자 롤",
        sort: 1,
        cdLvl: 1,
        ...params,
      },
    ]);
    return data;
  }

  async subList(params): Promise<SystemUserGroupMemberListResponse> {
    const { data } = await apiWrapper<SystemUserGroupMemberListResponse>("get", "/system/user", {
      // role: "USER_ROLE",
      ...params,
    });

    return data;
  }

  async memberInsert(params): Promise<SystemUserGroupMemberInsertResponse> {
    const { data } = await apiWrapper<SystemUserGroupMemberInsertResponse>("put", "/system/user/role", {
      ...params,
    });

    return data;
  }

  async memberDelete(params): Promise<SystemUserGroupMemberDeleteResponse> {
    const { data } = await apiWrapper<SystemUserGroupMemberDeleteResponse>("put", "/system/user/role/remove", {
      ...params,
    });

    return data;
  }
}
