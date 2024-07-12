import { apiWrapper } from "../apiWrapper";
import { GetMockDataRequest, GetMockDataResponse, MockDataRepositoryInterface } from "./MockDataRepositoryInterface";

export class MockDataRepository implements MockDataRepositoryInterface {
  async getMockData(params: GetMockDataRequest): Promise<GetMockDataResponse> {
    const { data } = await apiWrapper<GetMockDataResponse>("get", "/v1/mockData", params);
    return data;
  }
}
