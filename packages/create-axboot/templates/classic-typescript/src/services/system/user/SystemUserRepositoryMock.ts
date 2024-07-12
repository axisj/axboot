import { delay } from "@axboot/core/utils";
import {
  PutSystemUserResetOtpRequest,
  PutSystemUserResetPwRequest,
  SystemUserRepositoryInterface,
} from "./SystemUserRepositoryInterface";

export class SystemUserRepositoryMock implements SystemUserRepositoryInterface {
  async getSystemUsers(params) {
    await delay(500);
    return {
      ds: [
        {
          userCd: "1001",
          userNm: "그룹01",
          remark: "그룹01 설명",
        },
        {
          userCd: "1002",
          userNm: "그룹02",
          remark: "그룹02 설명",
        },
      ],
      rs: {},
      page: {
        pageCount: 49,
        totalCount: 9737,
        pageNumber: params.pageNumber ?? 0,
        pageSize: params.pageSize ?? 0,
      },
    };
  }

  async putSystemUsers(params) {
    await delay(500);
    return {};
  }

  async getUsersExists(params) {
    await delay(500);
    return {};
  }

  putChangePw(params: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  putSystemUserResetOtp(params: PutSystemUserResetOtpRequest): Promise<any> {
    return Promise.resolve(undefined);
  }

  putSystemUserResetPw(params: PutSystemUserResetPwRequest): Promise<any> {
    return Promise.resolve(undefined);
  }
}
