export interface ApiListResponse {
  result: string;
  msg: string;
  ds: Record<string, any>[];
  rs: Record<string, any>;
}

export interface ApiPageResponse {
  pageCount: number;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface MousePosition {
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
}

export interface DataGridPageResponse extends ApiPageResponse {
  endPageNo?: number;
}

export type DtoItemStatus = "C" | "U" | "D";

export interface DefaultDto {
  __status__?: DtoItemStatus;
  rowId?: string;
}

export interface Option {
  label?: string;
  value?: string;
}

export interface FileDto {
  fileKey?: string;
  savePath?: string;
  seq?: number;
  saveNm?: string;
  fileSize?: number;
  fileNm?: string;
  extension?: string;
  width?: number;
  height?: number;
  dwldCnt?: number;
  attachCls?: string;
  attachClsId?: string;
  thumbnail?: string;
  url?: string;
  download?: string;
}

export interface ProgramFn {
  fn01?: string; // 조회
  fn02?: string; // 저장
  fn03?: string; // 삭제
  fn04?: string; // 엑셀
  fn05?: string;
  fn06?: string;
  fn07?: string;
  fn08?: string;
  fn09?: string;
  fn10?: string;
  fn11?: string;
  fn12?: string;
  fn13?: string;
  fn14?: string;
  fn15?: string;
  fn16?: string;
}

export * from "./error";
