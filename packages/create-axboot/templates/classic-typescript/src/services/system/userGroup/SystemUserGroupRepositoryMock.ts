import { delay } from "@core/utils";
import { SystemUserGroupRepositoryInterface } from "./SystemUserGroupRepositoryInterface";

export class SystemUserGroupRepositoryMock implements SystemUserGroupRepositoryInterface {
  async list(params) {
    await delay(500);
    return {
      ds: [
        {
          code: "ROLE_USER",
          codeNm: "그룹01",
          codeEngNm: "group01",
        },
        {
          code: "ROLE_ADMIN",
          codeNm: "그룹02",
          codeEngNm: "group02",
        },
      ],
    };
  }

  async save(params) {
    await delay(500);
    return {};
  }

  async subList(params) {
    await delay(500);
    return {
      ds: [
        {
          userCd: "100001",
          userNm: "유저 01",
          remark: "유저 01 설명",
        },
        {
          userCd: "100002",
          userNm: "유저 02",
          remark: "유저 02 설명",
        },
        {
          userCd: "100003",
          userNm: "유저 03",
          remark: "유저 03 설명",
        },
      ],
      rs: {},
      page: {
        pageCount: 10,
        totalCount: 737,
        pageNumber: params.pageNumber ?? 0,
        pageSize: params.pageSize ?? 0,
      },
    };
  }

  async memberInsert(params) {
    await delay(500);
    return {};
  }

  async memberDelete(params) {
    await delay(500);
    return {};
  }
}
