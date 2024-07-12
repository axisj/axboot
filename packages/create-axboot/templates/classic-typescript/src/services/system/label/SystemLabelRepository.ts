import { apiWrapper } from "../../apiWrapper";
import {
  GetLabelRequest,
  GetLabelResponse,
  PutLabelRemoveRequest,
  PutLabelRemoveResponse,
  PutLabelRequest,
  PutLabelResponse,
  SystemLabelRepositoryInterface,
} from "./SystemLabelRepositoryInterface";

export class SystemLabelRepository implements SystemLabelRepositoryInterface {
  async getLabel(params: GetLabelRequest): Promise<GetLabelResponse> {
    const { data } = await apiWrapper<GetLabelResponse>("get", "/v1/label", params);
    return data;
  }

  async putLabel(params: PutLabelRequest): Promise<PutLabelResponse> {
    const { data } = await apiWrapper<PutLabelResponse>("put", "/v1/label", params);
    return data;
  }

  async putLabelRemove(params: PutLabelRemoveRequest[]): Promise<PutLabelRemoveResponse> {
    const { data } = await apiWrapper<PutLabelRemoveResponse>("put", "/v1/label/remove", params);
    return data;
  }
}
