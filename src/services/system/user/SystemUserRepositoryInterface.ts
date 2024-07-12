import { DataGridPageResponse, DefaultDto } from "@src/@types";

export interface SystemUser extends DefaultDto {
  userCd?: string; //사용자 코드,
  userNm?: string; //사용자 이름,
  userPs?: string; //사용자 비밀번호,
  busiCd?: string; //사업부 코드,
  busiNm?: string; //사업부 코드,
  compCd?: string; //회사 코드,
  compNm?: string; //회사 코드,
  storCd?: string; //매장 코드,
  storNm?: string; //매장 코드,
  commCompCd?: string; //급식업체 코드,
  commCompNm?: string; //급식업체 코드,
  email?: string; //이메일,
  hpNo?: string; //휴대전화 번호,
  remark?: string; //비고,
  lastLoginAt?: string; //마지막 로그인 일시,
  psUptAt?: string; //비밀번호 업데이트 일시,
  userStat?: string; //사용자 상태,
  ipAddr?: string; //IP 주소,
  locale?: string; //언어,
  menuGrpCd?: string; //메뉴 그룹 코드,
  roles?: string; //권한,
  useYn?: string; //사용 Y/N,
  delYn?: string; //삭제 Y/N,
  loginToken?: string; //로그인 토큰,
  loginFailCnt?: string; //로그인 실패 횟"
  domainId?: string;
  knoxId?: string;
  lockYn?: string;
  passwordResetYn?: string;
  roleList?: string[];
  authList?: string[];
  userAuthFg?: string;
  otpCertKey?: string;

  centerCode?: string;
  centerName?: string;
}

export interface GetSystemUsersRequest {
  pageNumber?: number;
  pageSize?: number;
  filter?: string;
  centerCode?: string;
}

export interface GetSystemUsersResponse {
  ds: SystemUser[];
  rs: SystemUser;
  page: DataGridPageResponse;
}

export interface PutSystemUsersRequest extends SystemUser {}

export interface PutSystemUsersResponse {}

export interface GetUsersExistsRequest extends SystemUser {}

export interface GetUsersExistsResponse {}

export interface PutSystemUserResetOtpRequest {
  userCd?: string;
  hpNo?: string;
}

export interface PutSystemUserResetOtpResponse {}

export interface PutSystemUserResetPwRequest {
  userCd?: string;
  __status__?: string;
}

export interface PutSystemUserResetPwResponse {}

export abstract class SystemUserRepositoryInterface {
  abstract getSystemUsers(params: GetSystemUsersRequest): Promise<GetSystemUsersResponse>;

  abstract putSystemUsers(params: PutSystemUsersRequest): Promise<PutSystemUsersResponse>;

  abstract getUsersExists(params: GetUsersExistsRequest): Promise<GetUsersExistsResponse>;

  abstract putChangePw(params: any): Promise<any>;

  abstract putSystemUserResetOtp(params: PutSystemUserResetOtpRequest): Promise<PutSystemUserResetOtpResponse>;

  abstract putSystemUserResetPw(params: PutSystemUserResetPwRequest): Promise<PutSystemUserResetPwResponse>;
}
