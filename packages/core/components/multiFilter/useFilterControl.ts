import * as React from "react";
import { IFilter, IFilterValue } from "./MultiFilter";

export function useFilterControl(
  originFilter: IFilter,
  name: string,
  openFilterName: string,
  setOpenFilterName: React.Dispatch<React.SetStateAction<string>>,
  onChange: (filter: IFilter) => void,
  onRemove: (name: string) => void,
  defaultValue?: string,
) {
  const [mounted, setMounted] = React.useState(false);

  const handleOpenChange = React.useCallback(
    async (open: boolean) => {
      if (!open && mounted) {
        setOpenFilterName("");
      }
    },
    [mounted, setOpenFilterName],
  );

  const handleChangeCondition = React.useCallback(
    async _condition => {
      if (_condition === "IS_EMPTY" || _condition === "NOT_EMPTY") {
        originFilter.value = defaultValue ?? "";
      }

      onChange({
        ...originFilter,
        condition: _condition,
      });
    },
    [onChange, originFilter, defaultValue],
  );

  const handleChangeValue = React.useCallback(
    (value: IFilterValue) => {
      onChange({
        ...originFilter,
        value,
      });
    },
    [onChange, originFilter],
  );

  const handleClick = React.useCallback(async () => {
    setOpenFilterName(openFilterName === name ? "" : name);
  }, [name, openFilterName, setOpenFilterName]);

  const open = openFilterName === name;

  React.useEffect(() => {
    if (open) {
      setMounted(true);
    }
  }, [open]);

  return {
    open,
    handleOpenChange,
    handleChangeCondition,
    handleChangeValue,
    handleClick,
  };
}
