import { ApiPageResponse } from "@src/@types";

export interface MockData {
  id: number;
  c1: number;
  c2: string;
  c3: string;
  c4: string;
  c5: string;
  c6: string;
  c7: string;
  c8: string;
  c10: string;
  c11: string;
  c12: string;
  c13: string;
  c14: string;
  c15: string;
  c16: string;
  c17: string;
  c18: string;
  c19: string;
  c20: string;
  c21: string;
  c22: string;
  c23: string;
  c25: string;
  c26: string;
  c27: string;
  c28: string;
  c29: string;
  c30: string;
}

export interface GetMockDataRequest {
  filter?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface GetMockDataResponse {
  ds: MockData[];
  page: ApiPageResponse;
}

export abstract class MockDataRepositoryInterface {
  abstract getMockData(params: GetMockDataRequest): Promise<GetMockDataResponse>;
}
