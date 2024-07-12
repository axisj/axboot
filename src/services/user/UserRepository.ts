import { setAppData } from "@axboot/core/utils/store";
import pkg from "../../../package.json";
import { apiWrapper, setApiHeader } from "../apiWrapper";
import {
  GetProgramFnRequest,
  GetProgramFnResponse,
  PutChangePwRequest,
  PutChangePwResponse,
  SignInResponse,
  UserRepositoryInterface,
} from "./UserRepositoryInterface";

export class UserRepository implements UserRepositoryInterface {
  async signIn(params): Promise<SignInResponse> {
    const { data, headers } = await apiWrapper<SignInResponse>("post", "/login/otp", params, {
      headers: {
        Authorization: null,
      },
    });

    if (headers && headers.authorization) {
      setApiHeader(headers.authorization);
      // debugger;
      setAppData({
        name: pkg.name,
        version: pkg.version,
        authorization: headers.authorization,
        refreshToken: headers["refresh-token"] ?? "",
      });
    }

    return data;
  }

  async signOut() {
    await apiWrapper<SignInResponse>("post", "/logout", {}, { ignoreError: true });
    return;
  }

  async getProgramFn(params: GetProgramFnRequest): Promise<GetProgramFnResponse> {
    params.cache = true;
    const { data } = await apiWrapper<GetProgramFnResponse>("get", "/v1/user/program", params);
    return data;
  }

  async putChangePw(params: PutChangePwRequest): Promise<PutChangePwResponse> {
    await apiWrapper<PutChangePwResponse>("put", "/v1/user/password", params);
    return {};
  }

  async signInForce(params): Promise<SignInResponse> {
    const { data, headers } = await apiWrapper<SignInResponse>("get", "/v1/system/login", params);

    if (headers && headers.authorization) {
      setApiHeader(headers.authorization);
      setAppData({
        name: pkg.name,
        version: pkg.version,
        authorization: headers.authorization,
        refreshToken: headers.token ?? "",
      });
    }

    return data;
  }
}
