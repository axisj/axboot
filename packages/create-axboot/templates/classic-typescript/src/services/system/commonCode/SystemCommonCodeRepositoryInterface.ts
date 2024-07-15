import { DataGridPageResponse, DefaultDto } from "@types";
import React from "react";

export interface SystemCommonCode extends DefaultDto {
  grpCd?: string; // 그룹 코드
  grpCdNm?: string; // 그룹 코드 명
  code?: string; // 코드
  codeNm?: string; // 코드 명
  codeEngNm?: string; // 코드 영어 명
  sort?: number; // 정렬
  cdLvl?: number; // 코드 레벨
  prntCd?: string; // 부모 코드
  remark?: string; // 코드값
  data1?: string; // 내용1
  data2?: string; // 내용2
  data3?: string; // 내용3
  data4?: string; // 내용4
  useYn?: string;
}

export interface CommonCodeCombo {
  label?: string;
  value?: React.Key;
}

export interface GetSystemCommonCodeRequest {
  grpCd?: string;
  grpCdCond?: string;
  code?: string;
  codeCond?: string;
  prntGrpCd?: string;
  prntGrpCdCond?: string;
  prntCd?: string;
  prntCdCond?: string;
  useYn?: string;
  useYnCond?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface GetSystemCommonCodeResponse {
  ds: SystemCommonCode[];
  rs: SystemCommonCode;
  page: DataGridPageResponse;
}

export interface GetSystemCommonCodeComboRequest {
  grpCd: string;
  useYn?: string;
  cdLvl?: number;
}

export interface GetSystemCommonCodeComboResponse {
  ds: SystemCommonCode[];
}

export interface GetAllSystemCommonCodeComboRequest {
  useYn?: string;
  cdLvl?: number;
}

export interface GetAllSystemCommonCodeComboResponse {
  ds: SystemCommonCode[];
}

export interface GetSystemCodeGroupRequest {
  grpCd?: string;
  grpCdCond?: string;
  code?: string;
  codeCond?: string;
  prntGrpCd?: string;
  prntGrpCdCond?: string;
  prntCd?: string;
  prntCdCond?: string;
  useYn?: string;
  useYnCond?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface GetSystemCodeGroupResponse {
  ds: SystemCommonCode[];
}

export interface GetSystemCodeRequest {
  grpCd?: string;
  cdLvl?: string;
  useYn?: string;
}

export interface GetSystemCodeResponse {
  ds: SystemCommonCode[];
}

export interface PutSystemCodeRequest extends SystemCommonCode {}

export interface PutSystemCodeResponse {}

export abstract class SystemCommonCodeRepositoryInterface {
  abstract getSystemCommonCode(params: GetSystemCommonCodeRequest): Promise<GetSystemCommonCodeResponse>;

  abstract getSystemCommonCodeCombo(params: GetSystemCommonCodeComboRequest): Promise<GetSystemCommonCodeComboResponse>;

  abstract getAllSystemCommonCodeCombo(
    params: GetAllSystemCommonCodeComboRequest,
  ): Promise<GetAllSystemCommonCodeComboResponse>;

  abstract getSystemCodeGroup(params: GetSystemCodeGroupRequest): Promise<GetSystemCodeGroupResponse>;

  abstract getSystemCode(params: GetSystemCodeRequest): Promise<GetSystemCodeResponse>;

  abstract putSystemCode(params: PutSystemCodeRequest[]): Promise<PutSystemCodeResponse>;
}
