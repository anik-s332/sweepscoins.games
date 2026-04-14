// @ts-nocheck
/* eslint-disable */
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "@/lib/router";
import { Accordion, Image, Spinner } from "react-bootstrap";
import { images } from "@/content";
import Logo from "../assets/img/sweepcoinscash-01.webp";
import CloseNewIcon from "../assets/img/close_mark.png";
import CorrectIcon from "../assets/img/check_mark.png";
import AppImage from "./Common/AppImage";
import { HOME_URL } from "./Shared/constant";

const LOCATE_AUTH_ID_KEY = "LocateCheckedAuthId";
const LOCATE_IFRAME_URL_KEY = "LocateIframeUrl";
const LOCATE_SUCCESS_KEY = "LocateCheckSuccess";
const LOCATE_PASSED_KEY = "LocateCheckPassed";
const POST_REDIRECT_URL_KEY = "PostLocationRedirectUrl";
const LOCATE_API_PATH = "/api/assure-locate";
const BLOG_DETAIL_ROUTE_REGEX = /^\/blogs\/[^/]+\/?$/;

const LocateCheck = () => {
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const hasBootstrappedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [iframeGet, setIframeGet] = useState("");
  const [data, setData] = useState(null);
  const [currentLocateId, setCurrentLocateId] = useState("");

  const isCountryCheckAllow =
    process.env.NEXT_PUBLIC_COUNTRY_CHECK_IS_ALLOW === "true";

  const clearPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updatePageLoader = useCallback((isVisible) => {
    const loader = document.getElementById("pageisLoading");

    if (loader) {
      loader.style.display = isVisible ? "flex" : "none";
    }
  }, []);

  useEffect(() => {
    updatePageLoader(loading);
  }, [loading, updatePageLoader]);

  const resetLocateSession = useCallback(() => {
    clearPolling();
    sessionStorage.removeItem(LOCATE_AUTH_ID_KEY);
    sessionStorage.removeItem(LOCATE_IFRAME_URL_KEY);
    sessionStorage.removeItem(LOCATE_SUCCESS_KEY);
    sessionStorage.removeItem(LOCATE_PASSED_KEY);
    setCurrentLocateId("");
    setIframeGet("");
    setData(null);
  }, [clearPolling]);

  const locateApiCall = useCallback(async () => {
    clearPolling();
    setLoading(true);
    setErrorMsg("");
    setData(null);
    setIframeGet("");
    sessionStorage.setItem(LOCATE_PASSED_KEY, "false");
    sessionStorage.removeItem(LOCATE_SUCCESS_KEY);

    try {
      const res = await axios.get(LOCATE_API_PATH);

      if (res?.status === 200 && res?.data?.data?.evs_url && res?.data?.data?.id) {
        const evsUrl = res.data.data.evs_url;
        const locateId = String(res.data.data.id);

        sessionStorage.setItem(LOCATE_AUTH_ID_KEY, locateId);
        sessionStorage.setItem(LOCATE_IFRAME_URL_KEY, evsUrl);
        setCurrentLocateId(locateId);
        setIframeGet(evsUrl);
        setLoading(false);
        return;
      }

      setErrorMsg("Your location is not whitelisted. Access denied.");
      sessionStorage.removeItem(LOCATE_AUTH_ID_KEY);
      sessionStorage.removeItem(LOCATE_IFRAME_URL_KEY);
      setCurrentLocateId("");
      setLoading(false);
    } catch (err) {
      console.error("Locate API error:", err);
      setErrorMsg("Error verifying location. Please try again later.");
      sessionStorage.removeItem(LOCATE_AUTH_ID_KEY);
      sessionStorage.removeItem(LOCATE_IFRAME_URL_KEY);
      setCurrentLocateId("");
      setLoading(false);
    }
  }, [clearPolling]);

  const isLocationAllowed = useCallback(
    ({ deviceLocation, ipLocation }) => {
      const country = deviceLocation?.country || ipLocation?.country || "";
      const state = ipLocation?.province || "";

      if (isCountryCheckAllow) {
        if (country !== "USA") {
          return false;
        }

        if (state === "MI" || state === "WA" || !state) {
          return false;
        }
      }

      return true;
    },
    [isCountryCheckAllow],
  );

  const pollLocateResult = useCallback(
    async (locateId) => {
      try {
        const response = await axios.get(`${LOCATE_API_PATH}/${locateId}`);
        const evsData = response?.data?.data?.evs_data;

        if (response?.status === 200 && evsData) {
          setData(evsData);
          setIframeGet("");
          setLoading(false);
          sessionStorage.removeItem(LOCATE_IFRAME_URL_KEY);
          sessionStorage.setItem(LOCATE_SUCCESS_KEY, "true");
          clearPolling();
          return;
        }

        sessionStorage.setItem(LOCATE_SUCCESS_KEY, "pending");
      } catch (error) {
        console.error("API Error:", error);
        sessionStorage.setItem(LOCATE_SUCCESS_KEY, "pending");
      }
    },
    [clearPolling],
  );

  useEffect(() => {
    if (hasBootstrappedRef.current) {
      return;
    }

    hasBootstrappedRef.current = true;

    const existingLocateId = sessionStorage.getItem(LOCATE_AUTH_ID_KEY);
    const existingIframeUrl = sessionStorage.getItem(LOCATE_IFRAME_URL_KEY);
    const existingLocateStatus = sessionStorage.getItem(LOCATE_SUCCESS_KEY);

    if (existingLocateId && existingLocateStatus !== "true") {
      setCurrentLocateId(existingLocateId);

      if (existingIframeUrl) {
        setIframeGet(existingIframeUrl);
        setLoading(false);
      } else {
        locateApiCall();
      }

      return;
    }

    locateApiCall();
  }, [locateApiCall]);

  useEffect(() => {
    if (!currentLocateId) {
      clearPolling();
      return;
    }

    pollLocateResult(currentLocateId);
    intervalRef.current = setInterval(() => {
      pollLocateResult(currentLocateId);
    }, 5000);

    return () => {
      clearPolling();
    };
  }, [clearPolling, currentLocateId, pollLocateResult]);

  useEffect(() => {
    if (!data?.data?.assureLocate) {
      return;
    }

    const { spoofingTools, deviceLocation, ipLocation } = data.data.assureLocate;
    const spoofCode = spoofingTools?.code;
    const isSpoofSafe = spoofCode === "N";
    const isProxySafe = true;
    const isLocationSafe = isLocationAllowed({
      deviceLocation: { country: deviceLocation?.country },
      ipLocation: { province: ipLocation?.province },
    });

    if (isSpoofSafe && isProxySafe && isLocationSafe) {
      const redirectUrl = sessionStorage.getItem(POST_REDIRECT_URL_KEY);
      const redirectPathname = redirectUrl ? redirectUrl.split("?")[0] : "";
      const shouldRedirectToSavedPath =
        !!redirectUrl &&
        (redirectUrl.includes("/reset-password/") ||
          BLOG_DETAIL_ROUTE_REGEX.test(redirectPathname));

      sessionStorage.setItem(LOCATE_PASSED_KEY, "true");
      sessionStorage.setItem(LOCATE_SUCCESS_KEY, "true");

      if (shouldRedirectToSavedPath) {
        sessionStorage.removeItem(POST_REDIRECT_URL_KEY);
        navigate(redirectUrl);
        return;
      }

      navigate(HOME_URL);
    }
  }, [data, isLocationAllowed, navigate]);

  useEffect(() => {
    return () => {
      clearPolling();
      updatePageLoader(false);
    };
  }, [clearPolling, updatePageLoader]);

  const GeoComplyHit = () => {
    resetLocateSession();
    locateApiCall();
  };

  if (iframeGet) {
    return (
      <div className="locate-iframe">
        <div className="locate-logo">
          <AppImage src={images.shared.logo} alt="Sweeps Coins" width={110} height={110} priority />
        </div>
        <iframe
          src={iframeGet}
          title="Location Verification"
          width="100%"
          height="600px"
          allow="geolocation; microphone; camera"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          style={{ border: "none" }}
        />
      </div>
    );
  }

  if (data) {
    const { spoofingTools, deviceLocation, ipLocation } =
      data?.data?.assureLocate || {};
    const isCheckCountry = isLocationAllowed({
      deviceLocation: { country: deviceLocation?.country },
      ipLocation: { province: deviceLocation?.province },
    });
    const isIpChecked = true;
    const isUSAMichigan = deviceLocation?.province === "MI";
    const isUSAWashington = deviceLocation?.province === "WA";

    return (
      <div className="locate-iframe">
        <div className="locate-logo">
          <AppImage src={images.shared.logo} alt="Sweeps Coins" width={110} height={110} priority />
        </div>
        <div className="Error_message_wraps">
          <h4>Could Not Locate You.</h4>
          <small>Please fix these issues then try again.</small>
          <Accordion>
            <div className="row">
              <div className="col-md-6">
                <h3>You may be out of country or state.</h3>
                <div className="collpseheader">
                  {isCheckCountry ? (
                    <Image src={CorrectIcon.src} alt="success" />
                  ) : (
                    <Image src={CloseNewIcon.src} alt="error" />
                  )}
                  <Accordion.Item eventKey="0">
                    {isCheckCountry ? (
                      <Accordion.Header
                        className={isCheckCountry ? "remove_arrow" : ""}
                        onClick={(e) => isCheckCountry && e.preventDefault()}
                        style={{
                          cursor: isCheckCountry ? "not-allowed" : "pointer",
                          opacity: isCheckCountry ? 0.5 : 1,
                        }}
                        aria-disabled="true"
                      >
                        Your location is permitted.
                      </Accordion.Header>
                    ) : (
                      <>
                        <Accordion.Header>How to fix this?</Accordion.Header>
                        <Accordion.Body>
                          Your device&apos;s location data indicates you are not in a
                          permitted area. Please make sure that you are within a
                          permitted area, then try again.

                          {(isUSAMichigan || isUSAWashington) && (
                            <div style={{ marginTop: "15px" }}>
                              <strong
                                style={{
                                  float: "left",
                                  width: "auto",
                                  marginRight: "6px",
                                  color: "#cd1125",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                Access Restricted:
                              </strong>
                              {" "}We currently do not support users from the state of{" "}
                              {isUSAMichigan ? "Michigan" : "Washington"} (USA).
                            </div>
                          )}
                        </Accordion.Body>
                      </>
                    )}
                  </Accordion.Item>
                </div>
              </div>
              <div className="col-md-6">
                <h3>Spoofing Tools</h3>
                <div className="collpseheader">
                  {spoofingTools?.code === "N" ? (
                    <Image src={CorrectIcon.src} alt="success" />
                  ) : (
                    <Image src={CloseNewIcon.src} alt="error" />
                  )}
                  <Accordion.Item eventKey="1">
                    {spoofingTools?.code === "N" ? (
                      <Accordion.Header
                        className={spoofingTools?.code === "N" ? "remove_arrow" : ""}
                        onClick={(e) =>
                          spoofingTools?.code === "N" && e.preventDefault()
                        }
                        style={{
                          cursor:
                            spoofingTools?.code === "N" ? "not-allowed" : "pointer",
                          opacity: spoofingTools?.code === "N" ? 0.5 : 1,
                        }}
                        aria-disabled="true"
                      >
                        No spoofing tools detected.
                      </Accordion.Header>
                    ) : (
                      <>
                        <Accordion.Header>How to fix this?</Accordion.Header>
                        <Accordion.Body>
                          {spoofingTools?.description && (
                            <p className="mb-1 text-danger">
                              <strong className="w-auto">Error</strong>:{" "}
                              {spoofingTools?.description}
                            </p>
                          )}
                          Try These Steps :
                          <ol className="mb-0 ps-3">
                            <li>Clear cache and cookies, then restart your browser.</li>
                            <li>
                              Try in Incognito or Private mode. If it works there, the
                              issue is likely an extension.
                            </li>
                            <li>Update your browser to the latest version.</li>
                            <li>
                              If this is your own site, remove any devtools or debugger
                              detection script.
                            </li>
                          </ol>
                        </Accordion.Body>
                      </>
                    )}
                  </Accordion.Item>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-6">
                <h3>VPN Detected.</h3>
                <div className="collpseheader">
                  <Image src={CorrectIcon.src} alt="success" />
                  <Accordion.Item eventKey="2">
                    <Accordion.Header
                      className="remove_arrow"
                      onClick={(e) => e.preventDefault()}
                      style={{ cursor: "not-allowed", opacity: 0.5 }}
                      aria-disabled="true"
                    >
                      No VPN detected.
                    </Accordion.Header>
                  </Accordion.Item>
                </div>
              </div>
              <div className="col-md-6">
                <h3>Proxy Check</h3>
                <div className="collpseheader">
                  {isIpChecked ? (
                    <Image src={CorrectIcon.src} alt="success" />
                  ) : (
                    <Image src={CloseNewIcon.src} alt="error" />
                  )}
                  <Accordion.Item eventKey="3">
                    {isIpChecked ? (
                      <Accordion.Header
                        className={isIpChecked ? "remove_arrow" : ""}
                        onClick={(e) => isIpChecked && e.preventDefault()}
                        style={{
                          cursor: isIpChecked ? "not-allowed" : "pointer",
                          opacity: isIpChecked ? 0.5 : 1,
                        }}
                        aria-disabled="true"
                      >
                        No Proxy detected.
                      </Accordion.Header>
                    ) : (
                      <>
                        <Accordion.Header>How to fix this?</Accordion.Header>
                        <Accordion.Body>
                          Your connection appears to be routed through a proxy, which is
                          not allowed for security reasons. Kindly disable the proxy and
                          refresh the page to proceed.
                        </Accordion.Body>
                      </>
                    )}
                  </Accordion.Item>
                </div>
              </div>
            </div>
          </Accordion>
          <button
            type="button"
            className="btn tryAgainbtn"
            onClick={GeoComplyHit}
            style={{ marginTop: "30px" }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="locate-error">
        <h2>Access Denied</h2>
        <p>{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="locate-iframe">
      <div className="locate-logo">
        <AppImage src={images.shared.logo} alt="Sweeps Coins" width={110} height={110} priority />
      </div>
      <div className="locate-loader">
        <Spinner />
        <h1>Checking Your Location...</h1>
        <p>Please wait while we verify your access.</p>
      </div>
    </div>
  );
};

export default LocateCheck;
