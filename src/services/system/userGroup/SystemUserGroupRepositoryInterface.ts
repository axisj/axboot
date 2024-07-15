import { DataGridPageResponse, DefaultDto } from "@types";

export interface SystemUserGroup extends DefaultDto {
  code?: string;
  codeNm?: string;
  codeEngNm?: string;
  sort?: number;
  cdLvl?: number;
  remark?: string;
  useYn?: string;
  data1?: string;
  multiLang?: {
    en?: string;
    ko?: string;
  };
}

export interface SystemUserGroupMember {
  userCd?: string;
  userNm?: string;
  remark?: string;
}

export interface SystemUserGroupMemberMnpl {
  userCd?: string[];
  role?: string;
}

export interface SystemUserGroupListRequest {}

export interface SystemUserGroupListResponse {
  ds: SystemUserGroup[];
}

export interface SystemUserGroupSaveRequest extends SystemUserGroup {}

export interface SystemUserGroupSaveResponse {}

export interface SystemUserGroupMemberListRequest {}

export interface SystemUserGroupMemberListResponse {
  ds: SystemUserGroupMember[];
  rs: SystemUserGroupMember;
  page: DataGridPageResponse;
}

export interface SystemUserGroupMemberInsertRequest extends SystemUserGroupMemberMnpl {}

export interface SystemUserGroupMemberInsertResponse {}

export interface SystemUserGroupMemberDeleteRequest extends SystemUserGroupMemberMnpl {}

export interface SystemUserGroupMemberDeleteResponse {}

export abstract class SystemUserGroupRepositoryInterface {
  abstract list(params: SystemUserGroupListRequest): Promise<SystemUserGroupListResponse>;

  abstract save(params: SystemUserGroupSaveRequest): Promise<SystemUserGroupSaveResponse>;

  abstract subList(params: SystemUserGroupMemberListRequest): Promise<SystemUserGroupMemberListResponse>;

  abstract memberInsert(params: SystemUserGroupMemberInsertRequest): Promise<SystemUserGroupMemberInsertResponse>;

  abstract memberDelete(params: SystemUserGroupMemberDeleteRequest): Promise<SystemUserGroupMemberDeleteResponse>;
}
