import { ApiListResponse, DefaultDto } from "@src/@types";

export interface Label extends DefaultDto {
  id?: number;
  lblNm?: string;
  lblDesc?: string;
  color?: string;
  lblId?: string;
}

export interface PutLabelRequest extends Label {}

export interface GetLabelRequest {}

export interface PutLabelRemoveRequest {
  id: number;
}

export interface PutLabelResponse {}

export interface GetLabelResponse extends ApiListResponse {}

export interface PutLabelRemoveResponse {}

export abstract class SystemLabelRepositoryInterface {
  abstract putLabel(params: PutLabelRequest): Promise<PutLabelResponse>;

  abstract getLabel(params: GetLabelRequest): Promise<GetLabelResponse>;

  abstract putLabelRemove(params: PutLabelRemoveRequest[]): Promise<PutLabelRemoveResponse>;
}
