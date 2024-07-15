import { delay } from "@core/utils";
import { getAppMenuMockData } from "services/serviceMockUpData";
import {
  AppRepositoryInterface,
  GetAppMenuRequest,
  GetAppMenuResponse,
  GetProgramAuthorityRequest,
  GetProgramAuthorityResponse,
} from "./AppRepositoryInterface";

export class AppRepositoryMock extends AppRepositoryInterface {
  async getAppMenu(params: GetAppMenuRequest): Promise<GetAppMenuResponse> {
    await delay(100);

    return {
      ds: getAppMenuMockData,
    };
  }

  async getProgramAuthority(params: GetProgramAuthorityRequest): Promise<GetProgramAuthorityResponse> {
    return Promise.resolve({});
  }
}
