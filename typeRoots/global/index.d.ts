export {};

declare global {
  interface Window {
    log: {
      debug: window.console.log;
      error: window.console.error;
      warn: window.console.warning;
      info: window.console.info;
    };
  }
}
