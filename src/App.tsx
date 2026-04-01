// @ts-nocheck
/* eslint-disable */
import axios from 'axios';
import dynamic from "next/dynamic";
import React, { useEffect, useState } from 'react';
import { Accordion, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from '@/lib/router';
import { ToastContainer } from 'react-toastify';
import { useNetworkState } from "react-use";
import { images } from "@/content";
import CorrectIcon from "./assets/img/check_mark.png";
import CloseNewIcon from "./assets/img/close_mark.png";
import Nowifi from "./assets/img/nowifi.png";
import ScrollToTop from './components/ScrollToTop';
import {
    CHECK_OUT_PACKAGE,
    BLOGS,
    CONTACT,
    FREE_CREDIT,
    GET_PRODUCT_API_URL,
    GET_PROFILE_API_URL,
    HOME_URL,
    MY_ACCOUNT,
    PACKAGES,
    PRIVACY_POLICY,
    PROMOTIONAL_RULES,
    RESET_PASSWORD,
    RESPONSIBLE_GAME_PLAY,
    TERMS_CONDITIONS,
    USER_DATA_DETECTION,
    CHECK_OUT_PACKAGE_TIERLOCK
} from './components/Shared/constant';
import Footer from './components/Shared/Footer';
import Header from "./components/Shared/Header";
import AppImage from "./components/Common/AppImage";
import { CallLogoutUser, checkLogin, ClearReduxFlow, getAccessToken, getGeoCoplyLocation, getGeoCoplyMessage, getLicenseCoplyMessage, getProductList, GetProductsIdWise, getRegioLcTime, getSpoofingDetection, getUser, IsSiteIsBlockCheck } from './redux/actions';
import LocationRedirect from './LocationRedirect';
const Home = dynamic(() => import("./components/Home"));
const Account = dynamic(() => import("./components/Account"));
const Checkout = dynamic(() => import("./components/Checkout"));
const PackageCheckout = dynamic(() => import("./components/Checkout/PackageCheckout"));
const TierlockPayment = dynamic(() => import("./components/TierlockPayment"));
const FreeCredit = dynamic(() => import("./components/FreeCredit"));
const Blogs = dynamic(() => import("./components/Blogs"));
const BlogDetail = dynamic(() => import("./components/Blogs/BlogDetail"));
const Contact = dynamic(() => import("./components/Contact"));
const Privacy = dynamic(() => import("./components/Privacy"));
const ResponsibleGamePlay = dynamic(() => import("./components/ResponsibleGamePlay"));
const TermsConditions = dynamic(() => import("./components/TermsConditions"));
const PromotionalRules = dynamic(() => import("./components/PromotionalRules"));
const ResetPassword = dynamic(() => import("./components/ResetPassword"));
const Packages = dynamic(() => import("./components/Packages"));
const Userdatadeletion = dynamic(() => import("./components/Userdatadeletion"));
const LocateCheck = dynamic(() => import("./components/LocateCheck"));
const LoginSignupModal = dynamic(() => import("./components/LoginSignupModal"));
const SignUpSidebar = dynamic(() => import("./components/Shared/SignUp"));
const ResponsiveSidebar = dynamic(() => import("./components/Shared/ResponsiveSidebar"));
const CommonTermsPrivacy = dynamic(() => import("./components/Common/CommonTermsPrivacy"));
const EighteenYearsOldModel = dynamic(() => import("./components/Common/EighteenYearsOldModel"));
const FacebookPixel = dynamic(() => import("./components/Common/FacebookPixel"));
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

function App() {
    const [ SignUp, setSignUp ] = useState(false);
    const [ LoginSigupUp, setLoginSigupUp ] = useState(false);
    const [ LocationGet, setLocationGet ] = useState("");
    const dispatch = useDispatch();
    const { accessToken, is_login, profiledata, EighteenPlusModel, StopOverCalling, accountUrl, ComplyErrorMessage, ReGeoLcTimeGet, LicenseErrorMsg, UniqueBrowserId, spoofingDetection,checkCacheNewz, geoComplyLocation, isSiteBlock } = useSelector((state) => state.allReducers);
    const [ AllclearData, setAllclearData ] = useState(false);
    const LocationUrl = window.location.href.split("/")[3];
    const [ checkUserIsBlock, setCheckUserIsBlock ] = useState({
        attempt: 0,
        Status: "",
    });
    const [ device, setdevice ] = useState({
        status: false,
        msg: "",
        retry: 0,
    });
    const [ boundary, setboundary ] = useState({
        status: false,
        msg: "",
        retry: 0,
    });
    const [ spoofing_detection, setspoofing_detection ] = useState({
        status: false,
        msg: "",
        retry: 0,
    });
    const [ dev_tool_simulation, setdev_tool_simulation ] = useState({
        status: false,
        msg: "",
        retry: 0,
    });
    const [ solus_dev_mode1, setsolus_dev_mode1 ] = useState({
        status: false,
        msg: "",
        retry: 0,
    });
    const [ EighteenModelState, setEighteenModelState ] = useState(false);
    const [ TermsPravacyState, setTermsPravacyState ] = useState({
        open: false,
        Url: "",
    });
    const networkState = useNetworkState();

    useEffect(() => {
        if(LocationUrl === "?action=privacy-policy") {
            setTermsPravacyState({...TermsPravacyState, open: !TermsPravacyState?.open, Url: "PRIVACY_POLICY"});
        };
        if(LocationUrl === "?action=terms-and-conditions") {
            setTermsPravacyState({...TermsPravacyState, open: !TermsPravacyState?.open, Url: "TERMS_CONDITIONS"});
        };
        localStorage.setItem("NEXT_PUBLIC_BASE_URL", process.env.NEXT_PUBLIC_BASE_URL)
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_tokens") || localStorage.getItem("accessToken");

        if ((accessToken === "" || accessToken === null || accessToken === undefined) && storedToken) {
            dispatch(getAccessToken(storedToken));
            dispatch(checkLogin("yes"));
        }
    }, [accessToken, checkCacheNewz, dispatch]);

    useEffect(() => {
        if(sessionStorage.getItem("SiteBlockChecking") === null || sessionStorage.getItem("SiteBlockChecking") === "yes") {
            setEighteenModelState(true);
        };
    }, [ LocationGet ]);
  
    useEffect(()=>{
        if(spoofingDetection === null || spoofingDetection === "" || spoofingDetection === undefined){
            document.getElementById("spoofingDetectionModel").style.display = "none";
        }else{
            document.getElementById("spoofingDetectionModel").style.display = "flex";
        };
    },[spoofingDetection]);



    useEffect(()=>{
       if(!networkState?.online){
        document.getElementById("pageisLoading").style.display = "none";
       }
    },[networkState?.online])


    useEffect(() => {
        if(isSiteBlock !== false && isSiteBlock !== null) {
            if(accessToken !== "" && accessToken !== null && accessToken !== undefined){
                window.axios.get(GET_PROFILE_API_URL, {
                    headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }}).then(function (result) {
                    if(result?.status === 200) {
                        dispatch(getUser(result?.data?.data));
                    };
                }).catch(function (result) {
                    if(result?.response?.status === 403) {
                        dispatch(CallLogoutUser());
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("access_tokens");
                    }
                });
            };

            //  get my product
            window.axios.get( `${GET_PRODUCT_API_URL}/5000/1`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then(function (result) {
                dispatch(GetProductsIdWise(result.data.data));
                dispatch(getProductList(result.data.data));
            }).catch(function (result) {
                dispatch(GetProductsIdWise([]));
                dispatch(getProductList([]));
                if(result?.response?.status === 403) {
                    dispatch(CallLogoutUser());
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("access_tokens");
                };
            });
        }
    }, [ accessToken, dispatch, isSiteBlock ]);

    useEffect(() => {
        const inputElement = document.getElementById("input");
        if (!inputElement) {
            return;
        }

        const preventLeadingSpace = function (e) {
            if (this.value.length === 0 && e.which === 32) {
                e.preventDefault();
            }
        };

        inputElement.addEventListener("keydown", preventLeadingSpace);

        return () => {
            inputElement.removeEventListener("keydown", preventLeadingSpace);
        };
    }, []);

    const ClickOutSideCloseSidebar = () => {
        setTimeout(() => {
            document.getElementById("signupflag")?.classList?.remove("active");
            setSignUp(false);
            setAllclearData(true);
        }, 200);
    };

    useEffect(() => {
        if(ComplyErrorMessage !== undefined || ComplyErrorMessage !== null) {
            ComplyErrorMessage && ComplyErrorMessage.forEach((elm) => {
                if(elm?.attrib?.rule === "device" ) {
                    setdevice({...device, status: true, msg: elm.msg, retry: elm?.attrib?.retry});
                } else if(elm?.attrib?.rule === "boundary") {
                    setboundary({...boundary, status: true,msg: elm.msg, retry: elm?.attrib?.retry});
                } else if(elm?.attrib?.rule === "spoofing_detection") {
                    setspoofing_detection({...spoofing_detection, status: true,msg: elm.msg, retry: elm?.attrib?.retry});
                } else if(elm?.attrib?.rule === "dev_tool_simulation" ) {
                    setdev_tool_simulation({...dev_tool_simulation, status: true,msg: elm.msg, retry: elm?.attrib?.retry});
                } else if(elm?.attrib?.rule === "solus_dev_mode") {
                    setsolus_dev_mode1({...solus_dev_mode1, status: true,msg: elm.msg, retry: elm?.attrib?.retry});
                }
            })
        };
      }, [ComplyErrorMessage]);
      
      const BlockMessageShowAsPer = () => {
        return(<div className="Error_message_wraps">
        <h4>Could Not Locate You.</h4>
        <small>Please fix these issues then try again.</small>
        {(checkUserIsBlock?.attempt !== 1 && checkUserIsBlock?.Status !== "") && (<div className='AttepsshowError'>
          {checkUserIsBlock?.attempt === 2 && "Attention: Only 4 Verification Attempts Left!"}
          {checkUserIsBlock?.attempt === 3 && "Attention: Only 3 Verification Attempts Left!"}
          {checkUserIsBlock?.attempt === 4 && "Attention: Only 2 Verification Attempts Left!"}
          {checkUserIsBlock?.attempt === 5 && "Attention: Only 1 Verification Attempt Left!"}
          {checkUserIsBlock?.Status === "block" && "Maximum failed attempt. Please retry after 30 minutes."}
        </div>)}
        <Accordion>
          <div className='row'>
              <div className='col-md-6'>
                  <h3>Customer support</h3>
                  <div className='collpseheader'>
                    {device?.status === false ? (<Image src={CorrectIcon} alt='success' />) : (<Image src={CloseNewIcon} alt='error' />)}
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>How to fix this?</Accordion.Header>
                      <Accordion.Body>
                      There is an issue with your account. Please contact customer support for more information.
                      </Accordion.Body>
                    </Accordion.Item>
                  </div>
              </div>
              <div className='col-md-6'>
                  <h3>You may be out of state.</h3>
                  <div className='collpseheader'>
                    {boundary?.status === false ? (<Image src={CorrectIcon} alt='success' />) : (<Image src={CloseNewIcon} alt='error' />)}
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>How to fix this?</Accordion.Header>
                      <Accordion.Body>
                      Your device's location data indicates you are not in a permitted area. Please make sure that you are within a permitted area, then try again.
                      </Accordion.Body>
                    </Accordion.Item>
                  </div>
              </div>
          </div>
          <div className='row'>
              <div className='col-md-6'>
                <h3>VPN Detected.</h3>
                <div className='collpseheader'>
                  {spoofing_detection?.status === false ? (<Image src={CorrectIcon} alt='success' />) : (<Image src={CloseNewIcon} alt='error' />)}
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>How to fix this?</Accordion.Header>
                    <Accordion.Body>
                    For Security purposes, you are required to turn off browser extensions. Please disable, then try again.
                    </Accordion.Body>
                  </Accordion.Item>
                </div>
              </div>
              <div className='col-md-6'>
                <h3>Turn browser developer mode off</h3>
                <div className='collpseheader'>
                  {(dev_tool_simulation?.status === false || solus_dev_mode1?.status === false) ? (<Image src={CorrectIcon} alt='success' />) : (<Image src={CloseNewIcon} alt='error' />)}
                  <Accordion.Item eventKey="3">  
                    <Accordion.Header>How to fix this?</Accordion.Header>
                    <Accordion.Body>
                    For Security purposes, you are required to turn off developer mode in the browser. Please disable, then try again.
                    </Accordion.Body>
                  </Accordion.Item>
                </div>
              </div>
          </div>
        </Accordion>
        <button type="button" onClick={() => GeoComplyHit()} style={{ marginTop: "30px" }}>Try again</button>
    </div>)
    };

    const ButtonShowAfterTime = () => {
            return(<button type="button" onClick={() => GeoComplyHit()} style={{ marginTop: "30px" }}>Try again</button>)
    };

    const ResetPasswordWrapper = () => {
        const navigate = useNavigate();
        const locationPassed = sessionStorage.getItem("LocateCheckPassed") === "true";

        useEffect(() => {
            if (!locationPassed) {
                sessionStorage.setItem("PostLocationRedirectUrl", window.location.pathname);
                navigate("/locate-check");
            }
        }, [locationPassed, navigate]);

        return locationPassed ? <div style={{ paddingTop: LocationUrl==="locate-check" ? "95px": 0 }}><ResetPassword /></div> : null;
    };


    return (<React.Fragment>
    <div className="wrapper" style={{paddingTop:(LocationUrl==="home" || LocationUrl==="locate-check") ? "0px":"90px"}}>
        <BrowserRouter>
            <LocationRedirect>
            {(LocationGet.split("/")[1] !== "reset-password" && LocationGet.split("/")[1] !== "locate-check") && <Header setSignUp={setSignUp} setLoginSigupUp={setLoginSigupUp} setLocationGet={setLocationGet} />}
                <ScrollToTop />
                <Routes>
                    <Route path="*" element={<Navigate replace to={HOME_URL}/>} />
                    <Route path="/locate-check" element={<LocateCheck />} />
                    <Route path={HOME_URL} element={<Home setLoginSigupUp={setLoginSigupUp} setSignUp={setSignUp} setLocationGet={setLocationGet} />} />
                    <Route path={MY_ACCOUNT} element={((accessToken !== "" && accessToken !== null) || (typeof window !== "undefined" && !!(localStorage.getItem("access_tokens") || localStorage.getItem("accessToken")))) ? <Account /> : <Navigate replace to={HOME_URL}/>} />
                    <Route path={PRIVACY_POLICY} element={<Privacy />} />
                    <Route path={RESPONSIBLE_GAME_PLAY} element={<ResponsibleGamePlay />} />
                    <Route path={TERMS_CONDITIONS} element={<TermsConditions />} />
                    <Route path={PROMOTIONAL_RULES} element={<PromotionalRules />} />
                    <Route path={CHECK_OUT_PACKAGE} element={<Checkout setLoginSigupUp={setLoginSigupUp} />} />
                    <Route path={`${CHECK_OUT_PACKAGE}/:order_id`} element={<PackageCheckout setLoginSigupUp={setLoginSigupUp} />} />
                    <Route path={`${CHECK_OUT_PACKAGE}/:order_id/:payment_id`} element={<PackageCheckout setLoginSigupUp={setLoginSigupUp} />} />
                    <Route path={CHECK_OUT_PACKAGE_TIERLOCK} element={<TierlockPayment setLoginSigupUp={setLoginSigupUp} />} />
                    <Route path={`${FREE_CREDIT}/:free_credit`} element={<FreeCredit setLoginSigupUp={setLoginSigupUp} />} />
                    <Route path={BLOGS} element={<Blogs />} />
                    <Route path={`${BLOGS}/:documentId`} element={<BlogDetail />} />
                    <Route path={CONTACT} element={<Contact />} />
                    <Route
                        path={`${RESET_PASSWORD}/:roomId`}
                        element={<ResetPasswordWrapper />}
                    />
                    <Route path={PACKAGES} element={<Packages />} />
                    <Route path={USER_DATA_DETECTION} element={<Userdatadeletion />} />
                </Routes>
                {(LocationGet.split("/")[1] !== "reset-password" && LocationGet.split("/")[1] !== "locate-check") && <Footer />}
                <SignUpSidebar SignUp={SignUp} AllclearData={AllclearData} setAllclearData={setAllclearData} setSignUp={setSignUp} setLoginSigupUp={setLoginSigupUp} />
                {LoginSigupUp && (<LoginSignupModal setLoginSigupUp={setLoginSigupUp} setSignUp={setSignUp} />)}
                {SignUp && (<div className='backgroundmodal' onClick={() => ClickOutSideCloseSidebar()}></div>)}
                <ResponsiveSidebar setSignUp={setSignUp} setLoginSigupUp={setLoginSigupUp} profiledata={profiledata} accessToken={accessToken} is_login={is_login}/>

                {EighteenModelState && (<EighteenYearsOldModel TermsPravacyState={TermsPravacyState} setTermsPravacyState={setTermsPravacyState} setEighteenModelState={setEighteenModelState} />)}
                {EighteenModelState && (<div className='backgroundmodalEighteenYearsOldModel' ></div>)}

                {TermsPravacyState?.open && (<CommonTermsPrivacy TermsPravacyState={TermsPravacyState} setTermsPravacyState={setTermsPravacyState} />)}
            </LocationRedirect>
        </BrowserRouter>
        <ToastContainer />
    </div>
    
    {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && (
        <FacebookPixel id={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID} />
    )}
    {!networkState?.online && (<div className={`internet-popup ${!networkState?.online ? 'active' : ''}`}>
        <div className="pageloadiwrapsnew" style={{margin:'5px'}}>
            <div style={{width:"50px"}}>
                <AppImage src={images.shared.nowifi} alt="no-wifi" className='popup-image' width={50} height={50} />
            </div>
            
            <span>No internet connection or unstable network detected. <br></br>Please check your connection and try again.</span>
        </div>
    </div>)}
    </React.Fragment>
    );
}

export default App;




