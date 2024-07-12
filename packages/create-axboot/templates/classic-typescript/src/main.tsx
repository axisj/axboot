import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@axboot/core/components/ErrorFallback";
import App from "./App";

const themes = {
  dark: `/app-dark.css`,
  light: `/app-light.css`,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeSwitcherProvider themeMap={themes} defaultTheme="light">
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </ThemeSwitcherProvider>,
);
