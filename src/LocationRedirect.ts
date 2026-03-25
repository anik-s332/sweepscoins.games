// @ts-nocheck
/* eslint-disable */
import { useEffect } from "react";
import { useLocation, useNavigate } from "@/lib/router";
import {
  CHECK_OUT_PACKAGE_TIERLOCK,
  HOME_URL,
} from "./components/Shared/constant";

function LocationRedirect({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const locatePassed =
    typeof window !== "undefined" &&
    sessionStorage.getItem("LocateCheckPassed") === "true";

  const isLocatePage = location.pathname === "/locate-check";
  const isTierlockRoute = location.pathname.startsWith(
    CHECK_OUT_PACKAGE_TIERLOCK,
  );

  useEffect(() => {
    if (isTierlockRoute) {
      return;
    }

    if (!locatePassed && !isLocatePage) {
      navigate("/locate-check", { replace: true });
      return;
    }

    if (locatePassed && isLocatePage) {
      navigate(HOME_URL, { replace: true });
    }
  }, [isLocatePage, isTierlockRoute, locatePassed, navigate]);

  return children;
}

export default LocationRedirect;
