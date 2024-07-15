import { DataGridPageResponse, DefaultDto } from "@types";

export interface SystemProgramFn extends DefaultDto {
  key: string;
  label: string;
}

export interface SystemProgram extends DefaultDto {
  progCd?: string;
  progNm?: string;
  remark?: string;
  userGroup?: Record<string, string[]>;
  functions?: SystemProgramFn[];
}

export interface GetSystemProgramRequest {}

export interface GetSystemProgramResponse {
  ds: SystemProgram[];
  rs?: any;
  page: DataGridPageResponse;
}

export interface PutSystemProgramRequest extends SystemProgram {}

export interface PutSystemProgramResponse {}

export abstract class SystemProgramRepositoryInterface {
  abstract getSystemProgram(params: GetSystemProgramRequest): Promise<GetSystemProgramResponse>;

  abstract putSystemProgram(params: PutSystemProgramRequest): Promise<PutSystemProgramResponse>;
}
