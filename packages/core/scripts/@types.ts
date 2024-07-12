export enum ProgramType {
  DETAIL,
  FORM,
  LIST,
  LIST_AND_DRAWER,
  LIST_AND_MODAL,
  LIST_WITH_FORM,
  LIST_WITH_FORM_LIST,
  LIST_WITH_FORM_ROW,
  LIST_WITH_LIST,
  THREE_LIST,
  STATS,
  CALENDAR,
  LIST_AND_MODAL_MF,
}

interface Program {
  code: string;
  url?: string;
  name: string | string[];
  type: keyof typeof ProgramType;
}

export interface ProgramConfig {
  pagesDir: string;
  templateDir: string;
  programTypeFile: string;
  pageRouteFile: string;
  routesFile: string;
  serviceMockUpDataFile: string;
  programs: Program[];
}

export enum ModalProgramType {
  EMPTY,
  SELECT_ONE_ON_LIST,
  SELECT_MULTI_ON_LIST,
  FORM,
  MODAL_FORM_WITH_LIST,
}

interface ModalProgram {
  name: string;
  type: keyof typeof ModalProgramType;
}

export interface ModalProgramConfig {
  modalsDir: string;
  templateDir: string;
  modals: ModalProgram[];
}
