import { delay } from "@axboot/core/utils";
import { SystemProgramRepositoryInterface } from "./SystemProgramRepositoryInterface";

export class SystemProgramRepositoryMock implements SystemProgramRepositoryInterface {
  async getSystemProgram(params) {
    await delay(500);
    return {
      ds: [
        {
          progCd: "CUSTOMER",
          progNm: "고객관리",
          remark: "",
          userGroup: {
            ROLE_USER: ["fn01", "fn02", "fn03", "fn04"],
            ROLE_ADMIN: ["fn01", "fn02"],
          },
          functions: [
            {
              key: "fn01",
              label: "검색",
            },
            {
              key: "fn02",
              label: "저장",
            },
            {
              key: "fn03",
              label: "삭제",
            },
            {
              key: "fn04",
              label: "엑셀",
            },
          ],
        },
        {
          progCd: "CUSTOMER_MNG",
          progNm: "고객사관리",
          remark: "",
          userGroup: {
            ROLE_USER: ["fn01", "fn02", "fn03", "fn04"],
            ROLE_ADMIN: ["fn01", "fn02"],
          },
          functions: [
            {
              key: "fn01",
              label: "검색",
            },
            {
              key: "fn02",
              label: "저장",
            },
            {
              key: "fn03",
              label: "삭제",
            },
            {
              key: "fn04",
              label: "엑셀",
            },
          ],
        },
      ],
      page: {
        pageCount: 49,
        totalCount: 9737,
        pageNumber: params.pageNumber ?? 0,
        pageSize: params.pageSize ?? 0,
      },
    };
  }

  async putSystemProgram(params) {
    await delay(500);
    return {};
  }
}
