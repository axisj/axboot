export const buildCodeValidator = (errMessage: string) => {
  return () => ({
    validator(_, value) {
      const regex = new RegExp(/^[0-9a-zA-Z_]+$/);
      if (!value || regex.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(errMessage));
    },
  });
};

export const numberFormat = (value: any) => {
  const valueArr = (value ?? 0).toString().split(".");
  if (valueArr.length === 1) {
    return `${valueArr[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return `${valueArr[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + valueArr[1];
};

export const numberFormatInteger = (value: any) => {
  const valueArr = (value ?? 0).toString().split(".");
  return `${valueArr[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export const numberParser = (value?: string) => {
  if (value) return value?.replace(/\$\s?|(,*)/g, "");
  return "";
};
export const numberFormatPositive = (value: any) => {
  return numberFormat(`${value}`.replace(/-/g, ""));
};

export const numberFormatPositiveInteger = (value: any) => {
  return numberFormatInteger(`${value}`.replace(/-/g, ""));
};

export const phoneNumFormat = (value: any) => {
  const regExp = /(\d{3})(\d{3,4})(\d{4})/;
  return value.replace(regExp, "$1-$2-$3");
};
