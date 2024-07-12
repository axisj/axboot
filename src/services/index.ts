import { ExampleRepositoryMock } from "@axboot/core/services/example/ExampleRepositoryMock";
import { AppRepository } from "./app/AppRepository";
import { MockDataRepository } from "./mockData/MockDataRepository";
import { SystemCommonCodeRepository } from "./system/commonCode/SystemCommonCodeRepository";
import { SystemMenuRepository } from "./system/menu/SystemMenuRepository";
import { SystemProgramRepository } from "./system/program/SystemProgramRepository";
import { SystemUserRepository } from "./system/user/SystemUserRepository";
import { SystemUserGroupRepository } from "./system/userGroup/SystemUserGroupRepository";
import { UserRepository } from "./user/UserRepository";

export * from "@axboot/core/services/example/ExampleRepositoryInterface";
export * from "./user/UserRepositoryInterface";
export * from "./app/AppRepositoryInterface";

export * from "./system/menu/SystemMenuRepositoryInterface";
export * from "./system/userGroup/SystemUserGroupRepositoryInterface";
export * from "./system/user/SystemUserRepositoryInterface";
export * from "./system/program/SystemProgramRepositoryInterface";
export * from "./system/commonCode/SystemCommonCodeRepositoryInterface";
export * from "./system/label/SystemLabelRepositoryInterface";

export const UserService = new UserRepository();
export const ExampleService = new ExampleRepositoryMock();
export const AppService = new AppRepository();

export const SystemProgramService = new SystemProgramRepository();
export const SystemMenuService = new SystemMenuRepository();
export const SystemUserGroupService = new SystemUserGroupRepository();
export const SystemUserService = new SystemUserRepository();
export const SystemCommonCodeService = new SystemCommonCodeRepository();

export const MockDataService = new MockDataRepository();
