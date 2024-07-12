import { DefaultDto } from "@src/@types";
import { MenuIconType } from "@src/components/MenuIcon";

export interface SystemMenu extends DefaultDto {
  menuGrpCd?: string;
  menuId?: number;
  parentId?: number;
  multiLang: {
    ko: string;
    en: string;
  };
  level?: number;
  sort?: number;
  progCd?: string;
  iconTy?: keyof typeof MenuIconType;
  children: SystemMenu[];
}

export interface SystemMenuGroup extends DefaultDto {
  menuGrpCd: string;
  multiLang: {
    ko: string;
    en: string;
  };
  level?: number;
  sort?: number;
  children: SystemMenu[];
  userGroup: string[];
  iconTy?: keyof typeof MenuIconType;
}

export interface GetSystemMenuRequest {}

export interface GetSystemMenuResponse {
  ds: SystemMenuGroup[];
}

export interface PutSystemMenuRequest extends SystemMenuGroup {}

export interface PutSystemMenuResponse {}

export interface DeleteSystemMenuRequest {
  menuGrpCd: string;
}

export interface DeleteSystemMenuResponse {}

export interface PutSystemMenuOrderRequest {
  list: {
    grpCd: string;
    code: string;
  }[];
}

export interface PutSystemMenuOrderResponse {}

export abstract class SystemMenuRepositoryInterface {
  abstract getSystemMenu(params: GetSystemMenuRequest): Promise<GetSystemMenuResponse>;

  abstract putSystemMenu(params: PutSystemMenuRequest): Promise<PutSystemMenuResponse>;

  abstract deleteSystemMenu(params: DeleteSystemMenuRequest): Promise<DeleteSystemMenuResponse>;

  abstract PutSystemMenuOrder(params: PutSystemMenuOrderRequest): Promise<PutSystemMenuOrderResponse>;
}
