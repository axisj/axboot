import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "stores";
import { ROUTES } from "./Routes";

interface Props {
  children: JSX.Element;
}

function RestrictAuth({ children }: Props) {
  const location = useLocation();
  const me = useUserStore((s) => s.me);

  if (me) {
    return <Navigate to={ROUTES.HOME.path} state={{ from: location }} replace />;
  }

  return children;
}

export default RestrictAuth;
