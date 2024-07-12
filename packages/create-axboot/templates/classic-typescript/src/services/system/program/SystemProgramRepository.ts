import { apiWrapper } from "@src/services/apiWrapper";
import {
  GetSystemProgramResponse,
  PutSystemProgramResponse,
  SystemProgramRepositoryInterface,
} from "./SystemProgramRepositoryInterface";

export class SystemProgramRepository implements SystemProgramRepositoryInterface {
  async getSystemProgram(params): Promise<GetSystemProgramResponse> {
    const { data } = await apiWrapper<GetSystemProgramResponse>("get", "/system/program", params);
    return data;
  }

  async putSystemProgram(params): Promise<PutSystemProgramResponse> {
    await apiWrapper<PutSystemProgramResponse>("put", "/system/program", params);

    return {};
  }
}
