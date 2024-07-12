import { useUserStore } from "../stores";

interface Config {
  centerIdx?: boolean;
}

export const getUserAuthState = (config: Config) => {
  const me = useUserStore.getState().me;
  const _state: Record<string, any> = {};
  if (me) {
    if (config.centerIdx && me.centerIdx) {
      _state.centerIdx = [
        {
          value: JSON.stringify({
            centerIdx: `${me.centerIdx}`,
          }),
          label: me.centerName,
        },
      ];
    }
    //
    // if (config.storCd && me.storCd) {
    //   _state.storCd = [
    //     {
    //       value: JSON.stringify({
    //         busiCd: me.busiCd,
    //         compCd: me.compCd,
    //         commCompCd: me.commCompCd,
    //         storCd: me.storCd,
    //       }),
    //       label: me.storNm ?? me.storCd,
    //     },
    //   ];
    // }
  }
  return _state;
};
