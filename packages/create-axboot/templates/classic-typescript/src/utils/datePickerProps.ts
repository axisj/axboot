export const getDatePickerProps = (form: any, keyPath: string) => {
  return {
    // onBlur: (evt) => {
    //   if (evt.currentTarget.value) {
    //     const d = dayjs((evt.currentTarget as HTMLInputElement).value);
    //     if (d.isValid()) {
    //       form.setFieldsValue({ [keyPath]: d as any });
    //     }
    //   }
    // },
    onKeyDown: (evt) => {
      if (evt.key === "Enter") {
        evt.currentTarget.blur();
      }
    },
  };
};
