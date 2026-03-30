// @ts-nocheck
/* eslint-disable */
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useLocation } from '@/lib/router';
import CommonDropdown from "../Common/CommonDropdown";
import { BLOGS, CONTACT, HOME_URL, PACKAGES } from './constant';

const ResponsiveSidebar = (props) => {
    const { accessToken, is_login, profiledata } = useSelector((state) => state.allReducers);
    const { setLoginSigupUp, setSignUp } = props;
    const LocationUrl = useLocation();
    const [ Dropdwon, setDropdwon ] = useState(false);

    const closeRespSidebar = () => {
        var element = document.getElementById("responsiveSidebarMain");
        element.classList.remove("active");
    };

    return(<div className="responsiveSidebar" id="responsiveSidebarMain">
        <div className="togglebuttonrespo" onClick={() => closeRespSidebar()}>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div className="headerLinks">
            <ul>
                {(accessToken === "" && is_login === "no") && (<>
                    <li>
                        <a onClick={() => {
                            setLoginSigupUp(true);
                            closeRespSidebar();
                        }} className="side_bar_text">
                        Login
                        </a>
                    </li>
                    <li>
                        <a onClick={() => {
                            setSignUp(true);
                            closeRespSidebar();
                        }} className="side_bar_text">
                        Join Now
                        </a>
                    </li>
                </>)}
                <li className={LocationUrl.pathname === HOME_URL ? "active" : ""} onClick={() => closeRespSidebar()}>
                    <Link to={HOME_URL} className="side_bar_text">Home</Link>
                </li>
                <li className={LocationUrl.pathname === PACKAGES ? "active" : ""} onClick={() => closeRespSidebar()}>
                    <Link to={PACKAGES} className="side_bar_text">Packages</Link>
                </li>
                <li className={LocationUrl.pathname.startsWith(BLOGS) ? "active" : ""} onClick={() => closeRespSidebar()}>
                    <Link to={BLOGS} className="side_bar_text">Blogs</Link>
                </li>
                <li className={LocationUrl.pathname === CONTACT ? "active" : ""} onClick={() => closeRespSidebar()}>
                    <Link to={CONTACT} className="side_bar_text">Contact</Link>
                </li>
                {(accessToken !== "" && is_login !== "no") && (<div className="loginbtnbx login">
                <li >
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">
                            <h1 className="accountlogin side_bar_text" onClick={() => setDropdwon(!Dropdwon)}>
                                {(profiledata?.first_name !== "" && profiledata?.last_name !== "") ? profiledata?.first_name + " " + profiledata?.last_name : profiledata?.email?.split("@")[0]} 
                            </h1>
                                <svg className="dropdousericon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><g><g><polygon points="13,20.4 0,7.4 1.8,5.6 13,16.8 24.2,5.6 26,7.4   "></polygon></g></g></svg>
                        </Dropdown.Toggle>
                        <CommonDropdown setDropdwon={setDropdwon} accessToken={accessToken} />
                    </Dropdown>
                </li>
                </div>)}
            </ul>
        </div>
    </div>)
}

export default ResponsiveSidebar;
