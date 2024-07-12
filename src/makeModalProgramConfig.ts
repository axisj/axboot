import { ModalProgramConfig } from "@core/scripts/@types";

const modalProgramConfig: ModalProgramConfig = {
  modalsDir: "./src/modals",
  templateDir: "./src/@core/modals",
  modals: [
    {
      type: "SELECT_MULTI_ON_LIST",
      name: "second-admin",
    },
    {
      type: "MODAL_FORM_WITH_LIST",
      name: "form-admin",
    },
  ],
};

export default modalProgramConfig;
