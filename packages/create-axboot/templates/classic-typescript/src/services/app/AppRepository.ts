import { apiWrapper } from "../apiWrapper";
import {
  AppRepositoryInterface,
  GetAppMenuRequest,
  GetAppMenuResponse,
  GetProgramAuthorityRequest,
  GetProgramAuthorityResponse,
} from "./AppRepositoryInterface";

export class AppRepository extends AppRepositoryInterface {
  async getAppMenu(params: GetAppMenuRequest): Promise<GetAppMenuResponse> {
    const { data } = await apiWrapper<GetAppMenuResponse>("get", "/v1/menu", params);

    return data;
  }

  async getProgramAuthority(params: GetProgramAuthorityRequest): Promise<GetProgramAuthorityResponse> {
    const { data } = await apiWrapper<GetProgramAuthorityResponse>("get", "/v1/authority", params);

    return data;
  }
}
