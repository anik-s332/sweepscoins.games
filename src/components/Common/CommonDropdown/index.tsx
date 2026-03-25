// @ts-nocheck
/* eslint-disable */
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch } from "react-redux";
import { useNavigate } from '@/lib/router';
import { toast } from 'react-toastify';
import { accountNavigate, checkLogin, getAccessToken, getIsBillingAsHomeAddress, getUser } from "../../../redux/actions/index";
import { HOME_URL, LOGOUT_API_URL, MY_ACCOUNT } from "../../Shared/constant";

const CommonDropdown = (props) => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const { setDropdwon, accessToken } = props;

    const closeDropdown = () => {
        setDropdwon?.(false);
    };

    const resetAuthState = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("access_tokens");
        localStorage.removeItem("starttime");
        localStorage.removeItem("targettime");
        dispatch(getAccessToken(""));
        dispatch(getIsBillingAsHomeAddress(true));
        dispatch(checkLogin("no"));
        dispatch(getUser(""));
    };

    const MemberDashboard = () => {
        Navigate(MY_ACCOUNT);
        dispatch(accountNavigate("my-books"));
        if(screen.width < 800) {
            var element = document.getElementById("responsiveSidebarMain");
            element.classList.remove("active");
        };
        closeDropdown();
    };

    const MyAccountLink = () => {
        Navigate(MY_ACCOUNT);
        dispatch(accountNavigate("my-account"));
        if(screen.width < 800) {
            var element = document.getElementById("responsiveSidebarMain");
            element.classList.remove("active");
        };
        closeDropdown();
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
            resetAuthState();
            toast.success(result?.data?.msg);
            closeDropdown();
        })
        .catch(function () {
            closeDropdown();
            AccessTokenCheckLogout();
        });
    };

    const AccessTokenCheckLogout = () => {
        if(screen.width < 800) {
            var element = document.getElementById("responsiveSidebarMain");
            element.classList.remove("active");
        }
        setTimeout(() =>  Navigate(HOME_URL), 200);
        resetAuthState();
    };

    return(
    <Dropdown.Menu className="CommonDropdownWraps">
        <Dropdown.Item onClick={() => MemberDashboard()}>
            Member Dashboard
        </Dropdown.Item>
        <Dropdown.Item onClick={() => MyAccountLink()}>
            My Account
        </Dropdown.Item>
        <Dropdown.Item onClick={() => Logout()} >
           Logout
        </Dropdown.Item>
    </Dropdown.Menu>
    );
}

export default CommonDropdown;
