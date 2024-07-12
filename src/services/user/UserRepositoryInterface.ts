export interface User {
  userNm: string;
  userCd: string;
  timeZone: number;
  programList: string[];
  locale: string;
  authorityList: string[];
  roleList?: string[];
  email: string;
  compCd: string;
  centerIdx: number;
  centerCode: string;
  centerName: string;
}

export interface SignInRequest {
  userCd?: string;
  userPs?: string;
}

export interface SignInResponse {
  rs: User;
}

export interface GetProgramFnRequest {
  progCd?: string;
  apiUrl?: string;
  cache?: boolean;
}

export interface GetProgramFnResponse {
  ds: string[];
}

export interface PutChangePwRequest {
  userNewPs?: string;
  userOldPs?: string;
  __status__?: string;
}

export interface PutChangePwResponse {}

export abstract class UserRepositoryInterface {
  abstract signIn(params: SignInRequest): Promise<SignInResponse>;

  abstract signOut(): Promise<void>;

  abstract getProgramFn(params: GetProgramFnRequest): Promise<GetProgramFnResponse>;

  abstract putChangePw(params: PutChangePwRequest): Promise<PutChangePwResponse>;
}
