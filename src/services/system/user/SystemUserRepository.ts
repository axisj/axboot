import { apiWrapper } from "../../apiWrapper";
import {
  GetSystemUsersResponse,
  GetUsersExistsResponse,
  PutSystemUsersResponse,
  SystemUserRepositoryInterface,
} from "./SystemUserRepositoryInterface";

export class SystemUserRepository implements SystemUserRepositoryInterface {
  async getSystemUsers(params): Promise<GetSystemUsersResponse> {
    const { data } = await apiWrapper<GetSystemUsersResponse>("get", "/system/user", {
      pageSize: params.pageSize,
      pageNumber: params.pageNumber,
      filter: params.filter,
      ...params,
    });
    return data;
  }

  async putSystemUsers(params): Promise<PutSystemUsersResponse> {
    const { data } = await apiWrapper<PutSystemUsersResponse>("put", "/system/user", {
      userPs: params.userPassword,
      ...params,
    });
    return data;
  }

  async getUsersExists(params): Promise<GetUsersExistsResponse> {
    const { data } = await apiWrapper<GetUsersExistsResponse>("get", "/system/user/exists", {
      ...params,
    });
    return data;
  }

  async putChangePw(params: any): Promise<any> {
    const { data } = await apiWrapper<GetUsersExistsResponse>("put", "/v1/user/changePw", {
      ...params,
    });
    return data;
  }

  async putSystemUserResetOtp(params): Promise<PutSystemUsersResponse> {
    const { data } = await apiWrapper<PutSystemUsersResponse>("put", "/system/user/otp", params);
    return data;
  }

  async putSystemUserResetPw(params): Promise<PutSystemUsersResponse> {
    const { data } = await apiWrapper<PutSystemUsersResponse>("put", "/system/user/password", params);
    return data;
  }
}
