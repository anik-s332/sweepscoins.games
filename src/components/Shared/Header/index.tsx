// @ts-nocheck
/* eslint-disable */
import { memo, useEffect, useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from '@/lib/router';
import { toast } from 'react-toastify';
import { content, getPageTitle, images } from "@/content";
import { accountNavigate, CallLogoutUser, checkLogin, getAccessToken, getRegioLcTime, getUser } from "../../../redux/actions";
import AppImage from "../../Common/AppImage";
import CommonDropdown from "../../Common/CommonDropdown";
import { ALL_SESSION_LOGOUT_API_URL, BLOGS, CONTACT, HOME_URL, LOGOUT_API_URL, MY_ACCOUNT, PACKAGES } from "../constant";

const Header = (props) => {
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const { setSignUp, setLoginSigupUp, setLocationGet } = props;
    const LocationUrl = useLocation();
    const { profiledata, accessToken, is_login, accountUrl } = useSelector((state) => state.allReducers);
    const [scrolled, setScrolled] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);
    const headerContent = content.shared.header;
    const logoUrl = images.shared.logo;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        const mediaQuery = window.matchMedia("(min-width: 1101px)");
        const handleDesktopChange = (event) => {
            setIsDesktop(event.matches);
        };

        setIsDesktop(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleDesktopChange);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            mediaQuery.removeEventListener("change", handleDesktopChange);
        };
    }, []);

    useEffect(() => {
        if(LocationUrl.pathname) {
            setLocationGet(LocationUrl.pathname);
        }
    }, [ LocationUrl, setLocationGet ]);

    useEffect(() => {
        const title = getPageTitle(LocationUrl.pathname);
        if (title) {
            document.title = title;
        }
    }, [ LocationUrl.pathname ]);

    const openRespSidebar = () => {
        var element = document.getElementById("responsiveSidebarMain");
        element.classList.toggle("active");
    };

    const Logout = () => {
        window.axios.get(LOGOUT_API_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        }).then(function (result) {
            setTimeout(() =>  Navigate(HOME_URL), 200);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("starttime");
            localStorage.removeItem("targettime");
            localStorage.removeItem("access_tokens");
            dispatch(getAccessToken(""));
            dispatch(getRegioLcTime(""));
            dispatch(checkLogin("no"));
            toast.success(result?.data?.msg);
        })
        .catch(function (result) {
            toast.error(result?.response?.data?.detail);
            AccessTokenCheckLogout();
        });
    };

    const AccessTokenCheckLogout = () => {
        if(screen.width < 800) {
            var element = document.getElementById("responsiveSidebarMain");
            element.classList.remove("active");
        }
        setTimeout(() =>  Navigate(HOME_URL), 200);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("access_tokens");
        dispatch(getAccessToken(""));
        dispatch(checkLogin("no"));
        dispatch(getUser(""));
    };

    useEffect(() => {
        if(accessToken !== "") {
            window.axios.get(ALL_SESSION_LOGOUT_API_URL, {
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }}).then(function () {
            }).catch(function (result) {
                if(result?.response?.status === 403) {
                    toast.error("The session expired due to logging in on another device.");
                    dispatch(CallLogoutUser());
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("access_tokens");
                    Navigate(HOME_URL)
                };
            });
        }
    }, [ accessToken, LocationUrl, is_login, accountUrl, Navigate, dispatch ]);

    const background = (LocationUrl?.pathname !== "/home" || (LocationUrl?.pathname === "/home" && scrolled)) ? "#00081d" : "transparent";

    return(<header className={accessToken !== "" && is_login === "yes" ? "Header_section Header_after_login" : "Header_section"} style={{
        background:background
    }}>
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    {isDesktop ? (<div className="logogheader">
                        <Link to={HOME_URL} className="logohere">
                            <AppImage src={logoUrl} alt="Sweeps Coins" width={180} height={60} sizes="180px" priority />
                        </Link>
                        <div className="NewHeader_wrapper">
                            <div className="logo_main_wrapper">
                                <div className="NewHeader_wrapper_flex">
                                    <div className="headerNavLinks">
                                        <Link to={HOME_URL} className={LocationUrl.pathname === HOME_URL ? "active" : ""}>Home</Link>
                                        <Link to={PACKAGES} className={LocationUrl.pathname === PACKAGES ? "active" : ""}>Packages</Link>
                                        <Link to={BLOGS} className={LocationUrl.pathname.startsWith(BLOGS) ? "active" : ""}>Blogs</Link>
                                        <Link to={CONTACT} className={LocationUrl.pathname === CONTACT ? "active" : ""}>Contact</Link>
                                    </div>
                                    <h3 className="text-align-center" style={{color:"#FFD924"}}>{headerContent.promoText}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="header_login_detas">
                            <div className="header_login_wrapper" style={{ width: (accessToken !== "" && is_login !== "no") ? "100%" : "auto" }}>
                                {(accessToken === "" && is_login === "no") ? (<>
                                    <div className="headebtn">
                                        <button className="btn new_home_page_button log_in" onClick={() => setLoginSigupUp(true)}>{headerContent.loginButton}</button>
                                    </div>
                                    <div className="headebtn">
                                        <button className="btn new_home_page_button join_now" onClick={() => setSignUp(true)}>{headerContent.joinNowButton}</button>
                                    </div>
                                </>) : (<div className="userLoginSignupwraps">
                                    <div className={(accessToken === "" && is_login === "no") ? "userLoginSignupwrapsrow userLoginSignupwrapsrowRelative" : "userLoginSignupwrapsrow"}>
                                        <div className="loginbtnbx">
                                            {headerContent.accountLabel}
                                            <Dropdown>
                                                <Dropdown.Toggle id="dropdown-basic">
                                                    <h1 className="accountlogin">
                                                        {(profiledata?.first_name !== "" && profiledata?.last_name !== "") ? profiledata?.first_name + " " + profiledata?.last_name : profiledata?.email?.split("@")[0]}
                                                        <svg className="dropdousericon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><g><g><polygon points="13,20.4 0,7.4 1.8,5.6 13,16.8 24.2,5.6 26,7.4"></polygon></g></g></svg>
                                                    </h1>
                                                </Dropdown.Toggle>
                                                <CommonDropdown accessToken={accessToken} />
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>)}
                            </div>
                        </div>
                    </div>) : (<div className="logogheader">
                       <h3 style={{color:"#FFD924",fontSize:"14px"}}>{headerContent.promoTextMobile}</h3>
                        <div className="userLoginSignupwraps">
                            <div className={(accessToken === "" && is_login === "no") ? "userLoginSignupwrapsrow userLoginSignupwrapsrowRelative" : "userLoginSignupwrapsrow"}>
                                <Link to={HOME_URL} className="logohere">
                                    <AppImage src={logoUrl} alt="Sweeps Coins" width={160} height={54} sizes="160px" priority />
                                </Link>
                            </div>
                        </div>
                        <div className="togglebuttonrespo" onClick={() => openRespSidebar()}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>)}
                </div>
            </div>
        </div>
    </header>);
};

export default memo(Header);

