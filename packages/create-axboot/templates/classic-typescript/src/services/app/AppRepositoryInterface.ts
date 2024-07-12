import { MenuIconType } from "components/MenuIcon";

export interface AppMenu {
  keyPath?: number[];
  menuId?: number;
  parentId?: number;
  multiLang: {
    ko: string;
    en: string;
  };
  parent_multiLang?: {
    ko: string;
    en: string;
  };
  level?: number;
  sort?: number;
  progCd?: string;
  iconTy?: keyof typeof MenuIconType;
  children: AppMenu[];
  userGroup: string[];
}

export interface AppMenuGroup {
  menuGrpCd: string;
  multiLang: {
    ko: string;
    en: string;
  };
  level?: number;
  sort?: number;
  progCd?: string;
  userGroup: string[];
  iconTy?: keyof typeof MenuIconType;
  children?: AppMenu[];
}

export interface GetAppMenuRequest {}

export interface GetAppMenuResponse {
  ds: AppMenuGroup[];
}

export interface GetProgramAuthorityRequest {}

export interface GetProgramAuthorityResponse {}

export abstract class AppRepositoryInterface {
  abstract getAppMenu(params: GetAppMenuRequest): Promise<GetAppMenuResponse>;

  abstract getProgramAuthority(params: GetProgramAuthorityRequest): Promise<GetProgramAuthorityResponse>;
}
